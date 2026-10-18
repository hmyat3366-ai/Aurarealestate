/**
 * src/lib/server/db.ts
 * Production-oriented, file-backed embedded data layer for AURA Real Estate.
 * Handles users, OTPs, registration tokens, server sessions, saved properties,
 * and viewing requests with strict cross-account isolation and atomic persistence.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  UserSession,
  OtpRecord,
  RegistrationTokenRecord,
  AccountSavedProperty,
  AccountViewing,
} from '@/types/auth';

interface DatabaseSchema {
  users: User[];
  otps: OtpRecord[];
  registrationTokens: RegistrationTokenRecord[];
  sessions: UserSession[];
  savedProperties: AccountSavedProperty[];
  viewings: AccountViewing[];
  rateLimits: Record<string, number[]>; // email -> array of request timestamps
}

// In-memory cache
let inMemoryDb: DatabaseSchema | null = null;

// Determine storage path
function getDbFilePath(): string {
  const dir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // directory creation handled
    }
  }
  return path.join(dir, 'aura-auth-db.json');
}

// Default initial state
function createInitialSchema(): DatabaseSchema {
  return {
    users: [],
    otps: [],
    registrationTokens: [],
    sessions: [],
    savedProperties: [],
    viewings: [],
    rateLimits: {},
  };
}

// Load database from file or initialize
function loadDb(): DatabaseSchema {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  const filePath = getDbFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      inMemoryDb = JSON.parse(data);
      if (!inMemoryDb || typeof inMemoryDb !== 'object') {
        inMemoryDb = createInitialSchema();
      }
    } else {
      inMemoryDb = createInitialSchema();
      saveDb(inMemoryDb);
    }
  } catch {
    inMemoryDb = createInitialSchema();
  }

  return inMemoryDb!;
}

function saveDb(db: DatabaseSchema): void {
  inMemoryDb = db;
  try {
    const filePath = getDbFilePath();
    const tempPath = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf-8');
    try {
      fs.renameSync(tempPath, filePath);
    } catch {
      // Direct write fallback if atomic rename encounters Windows OS file lock
      fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8');
      try {
        fs.unlinkSync(tempPath);
      } catch {
        // temp file cleanup
      }
    }
  } catch {
    // If filesystem write fails in restricted/read-only environment, inMemoryDb continues to work
  }
}

// Hash helper using SHA-256
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Generate secure 6-digit numeric OTP code
export function generateOtpCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

// Generate random secure hex token
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

// Rate Limiting constants
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const OTP_MAX_ATTEMPTS = 5; // Max 5 failed attempts per OTP
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per 10 minutes

export class AuthDatabase {
  /**
   * Reset database (for unit tests and clean slate)
   */
  static reset(): void {
    inMemoryDb = createInitialSchema();
    saveDb(inMemoryDb);
  }

  /**
   * Find user by normalized email
   */
  static findUserByEmail(email: string): User | null {
    const db = loadDb();
    const normalized = email.trim().toLowerCase();
    return db.users.find((u) => u.email.toLowerCase() === normalized) || null;
  }

  /**
   * Find user by ID
   */
  static findUserById(id: string): User | null {
    const db = loadDb();
    return db.users.find((u) => u.id === id) || null;
  }

  /**
   * Create a new user
   */
  static createUser(params: { email: string; fullName: string; phone?: string }): User {
    const db = loadDb();
    const normalizedEmail = params.email.trim().toLowerCase();

    // Check if user already exists
    const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const newUser: User = {
      id: `usr_${generateSecureToken(8)}`,
      email: normalizedEmail,
      fullName: params.fullName.trim(),
      phone: params.phone ? params.phone.trim() : undefined,
      createdAt: now,
      updatedAt: now,
    };

    db.users.push(newUser);
    saveDb(db);
    return newUser;
  }

  /**
   * Update user profile
   */
  static updateUserProfile(
    userId: string,
    updates: { fullName?: string; phone?: string }
  ): User | null {
    const db = loadDb();
    const userIndex = db.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return null;

    const user = db.users[userIndex];
    if (updates.fullName !== undefined) {
      const trimmedName = updates.fullName.trim();
      if (trimmedName.length >= 2 && trimmedName.length <= 100) {
        user.fullName = trimmedName;
      }
    }
    if (updates.phone !== undefined) {
      user.phone = updates.phone.trim().slice(0, 30);
    }
    user.updatedAt = new Date().toISOString();

    db.users[userIndex] = user;
    saveDb(db);
    return user;
  }

  /**
   * Request / Generate OTP for an email
   * Enforces:
   * 1. 60-second resend cooldown
   * 2. 5-requests per 10 minutes rate limit
   * 3. 5-minute expiry
   * 4. Anti-enumeration: callers return identical generic message
   */
  static requestOtp(email: string): {
    success: boolean;
    error?: string;
    cooldownSeconds?: number;
    code?: string; // Provided for dispatching / test inspection
  } {
    const db = loadDb();
    const normalizedEmail = email.trim().toLowerCase();
    const now = Date.now();

    // 1. Rate Limiting Check (max 5 per 10 min window)
    if (!db.rateLimits[normalizedEmail]) {
      db.rateLimits[normalizedEmail] = [];
    }
    // Remove expired timestamps
    db.rateLimits[normalizedEmail] = db.rateLimits[normalizedEmail].filter(
      (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    );
    if (db.rateLimits[normalizedEmail].length >= RATE_LIMIT_MAX_REQUESTS) {
      return {
        success: false,
        error: 'Too many verification code requests. Please wait 10 minutes before trying again.',
      };
    }

    // 2. Resend Cooldown Check (60 seconds)
    // Enforce against latest OTP request for this email, preventing cooldown bypass via intentional attempt invalidation
    const latestOtp = db.otps
      .filter((o) => o.email.toLowerCase() === normalizedEmail)
      .sort((a, b) => b.createdAt - a.createdAt)[0];

    if (latestOtp && now < latestOtp.resendAvailableAt) {
      const remainingSeconds = Math.ceil((latestOtp.resendAvailableAt - now) / 1000);
      return {
        success: false,
        error: `Please wait ${remainingSeconds} seconds before requesting a new code.`,
        cooldownSeconds: remainingSeconds,
      };
    }

    // Mark previous unconsumed OTPs for this email as consumed/invalidated
    db.otps = db.otps.map((o) =>
      o.email.toLowerCase() === normalizedEmail ? { ...o, consumed: true } : o
    );

    // 3. Generate New 6-digit OTP
    const code = generateOtpCode();
    const codeHash = hashToken(code);
    const expiresAt = now + OTP_EXPIRY_MS;
    const resendAvailableAt = now + OTP_RESEND_COOLDOWN_MS;

    const newOtpRecord: OtpRecord = {
      id: `otp_${generateSecureToken(8)}`,
      email: normalizedEmail,
      codeHash,
      plainCode: code, // Used for email dispatch simulation / testing
      expiresAt,
      attempts: 0,
      resendAvailableAt,
      verified: false,
      consumed: false,
      createdAt: now,
    };

    db.otps.push(newOtpRecord);
    db.rateLimits[normalizedEmail].push(now);
    saveDb(db);

    return {
      success: true,
      code,
    };
  }

  /**
   * Verify an entered OTP code
   * Enforces:
   * 1. 5-minute expiry check
   * 2. Max 5 failed attempts check (invalidates OTP once exceeded)
   * 3. Consumes OTP on match
   */
  static verifyOtp(
    email: string,
    code: string
  ): {
    success: boolean;
    error?: string;
    remainingAttempts?: number;
    isNewUser?: boolean;
    user?: User;
    registrationToken?: string;
  } {
    const db = loadDb();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedCode = code.trim();
    const now = Date.now();

    // Find the latest unconsumed OTP for this email (scan backwards to select newest entry)
    let otpIndex = -1;
    for (let i = db.otps.length - 1; i >= 0; i--) {
      if (db.otps[i].email.toLowerCase() === normalizedEmail && !db.otps[i].consumed) {
        otpIndex = i;
        break;
      }
    }

    if (otpIndex === -1) {
      return {
        success: false,
        error: 'No active verification code found. Please request a new code.',
      };
    }

    const otp = db.otps[otpIndex];

    // Check expiration (5 minutes)
    if (now > otp.expiresAt) {
      otp.consumed = true;
      db.otps[otpIndex] = otp;
      saveDb(db);
      return {
        success: false,
        error: 'Verification code has expired. Please request a new code.',
      };
    }

    // Check attempt limit (max 5)
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      otp.consumed = true;
      db.otps[otpIndex] = otp;
      saveDb(db);
      return {
        success: false,
        error: 'Maximum attempts exceeded. This code has been invalidated. Please request a new code.',
        remainingAttempts: 0,
      };
    }

    // Verify code match using timing-safe comparison
    const incomingHash = hashToken(trimmedCode);
    const hashesMatch =
      incomingHash.length === otp.codeHash.length &&
      crypto.timingSafeEqual(Buffer.from(incomingHash), Buffer.from(otp.codeHash));

    if (!hashesMatch) {
      otp.attempts += 1;
      const remaining = OTP_MAX_ATTEMPTS - otp.attempts;
      if (otp.attempts >= OTP_MAX_ATTEMPTS) {
        otp.consumed = true;
      }
      db.otps[otpIndex] = otp;
      saveDb(db);

      if (remaining <= 0) {
        return {
          success: false,
          error: 'Maximum verification attempts exceeded. Please request a new code.',
          remainingAttempts: 0,
        };
      }

      return {
        success: false,
        error: `Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
        remainingAttempts: remaining,
      };
    }

    // Code is valid! Consume OTP
    otp.verified = true;
    otp.consumed = true;
    db.otps[otpIndex] = otp;

    // Check if user exists
    const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (user) {
      // Existing user: direct session establishment
      saveDb(db);
      return {
        success: true,
        isNewUser: false,
        user,
      };
    }

    // New user: generate a temporary registration token (15-minute expiry)
    const registrationToken = generateSecureToken(24);
    const regRecord: RegistrationTokenRecord = {
      token: registrationToken,
      email: normalizedEmail,
      expiresAt: now + 15 * 60 * 1000,
      createdAt: now,
    };
    db.registrationTokens.push(regRecord);
    saveDb(db);

    return {
      success: true,
      isNewUser: true,
      registrationToken,
    };
  }

  /**
   * Complete new account registration using valid registrationToken
   */
  static completeRegistration(params: {
    registrationToken: string;
    fullName: string;
    phone?: string;
  }): {
    success: boolean;
    error?: string;
    user?: User;
  } {
    const db = loadDb();
    const now = Date.now();

    const tokenIndex = db.registrationTokens.findIndex(
      (r) => r.token === params.registrationToken
    );

    if (tokenIndex === -1) {
      return {
        success: false,
        error: 'Invalid or expired registration session. Please sign in again.',
      };
    }

    const reg = db.registrationTokens[tokenIndex];
    if (now > reg.expiresAt) {
      db.registrationTokens.splice(tokenIndex, 1);
      saveDb(db);
      return {
        success: false,
        error: 'Registration session expired. Please sign in again.',
      };
    }

    const trimmedFullName = params.fullName ? params.fullName.trim() : '';
    if (trimmedFullName.length < 2) {
      return {
        success: false,
        error: 'Full name must be at least 2 characters.',
      };
    }
    if (trimmedFullName.length > 100) {
      return {
        success: false,
        error: 'Full name cannot exceed 100 characters.',
      };
    }

    // Consume registration token
    db.registrationTokens.splice(tokenIndex, 1);

    // Create user
    const user = this.createUser({
      email: reg.email,
      fullName: trimmedFullName,
      phone: params.phone ? params.phone.trim().slice(0, 30) : undefined,
    });

    saveDb(db);
    return {
      success: true,
      user,
    };
  }

  /**
   * Server-side Session Management
   */
  static createSession(userId: string): UserSession {
    const db = loadDb();
    const token = generateSecureToken(32);
    const now = Date.now();
    const expiresAt = now + 30 * 24 * 60 * 60 * 1000; // 30 days

    const session: UserSession = {
      token,
      userId,
      expiresAt,
      createdAt: new Date(now).toISOString(),
    };

    db.sessions.push(session);
    saveDb(db);
    return session;
  }

  static getSession(token: string): { session: UserSession; user: User } | null {
    if (!token) return null;
    const db = loadDb();
    const now = Date.now();

    const session = db.sessions.find((s) => s.token === token);
    if (!session || now > session.expiresAt) {
      return null;
    }

    const user = db.users.find((u) => u.id === session.userId);
    if (!user) {
      return null;
    }

    return { session, user };
  }

  static rotateSession(oldToken: string, userId: string): UserSession {
    const db = loadDb();
    // Invalidate old session
    db.sessions = db.sessions.filter((s) => s.token !== oldToken);
    saveDb(db);
    // Create fresh session
    return this.createSession(userId);
  }

  static deleteSession(token: string): void {
    const db = loadDb();
    db.sessions = db.sessions.filter((s) => s.token !== token);
    saveDb(db);
  }

  /**
   * Saved Properties Management (Strict cross-account isolation)
   */
  static getUserSavedPropertyIds(userId: string): string[] {
    const db = loadDb();
    return db.savedProperties
      .filter((s) => s.userId === userId)
      .map((s) => s.propertyId);
  }

  static addSavedProperty(userId: string, propertyId: string): string[] {
    const db = loadDb();
    const cleanPropId = propertyId.trim();
    if (!cleanPropId) return this.getUserSavedPropertyIds(userId);

    const exists = db.savedProperties.some(
      (s) => s.userId === userId && s.propertyId === cleanPropId
    );

    if (!exists) {
      db.savedProperties.push({
        id: `sp_${generateSecureToken(8)}`,
        userId,
        propertyId: cleanPropId,
        savedAt: new Date().toISOString(),
      });
      saveDb(db);
    }

    return this.getUserSavedPropertyIds(userId);
  }

  static removeSavedProperty(userId: string, propertyId: string): string[] {
    const db = loadDb();
    const cleanPropId = propertyId.trim();
    db.savedProperties = db.savedProperties.filter(
      (s) => !(s.userId === userId && s.propertyId === cleanPropId)
    );
    saveDb(db);
    return this.getUserSavedPropertyIds(userId);
  }

  static mergeSavedProperties(userId: string, guestPropertyIds: string[]): string[] {
    const db = loadDb();
    const existing = new Set(
      db.savedProperties.filter((s) => s.userId === userId).map((s) => s.propertyId)
    );

    const now = new Date().toISOString();
    let hasChanges = false;

    for (const propId of guestPropertyIds) {
      const clean = (propId || '').trim();
      if (clean && !existing.has(clean)) {
        existing.add(clean);
        db.savedProperties.push({
          id: `sp_${generateSecureToken(8)}`,
          userId,
          propertyId: clean,
          savedAt: now,
        });
        hasChanges = true;
      }
    }

    if (hasChanges) {
      saveDb(db);
    }

    return Array.from(existing);
  }

  /**
   * Viewing Appointments Management (Strict cross-account isolation)
   */
  static getUserViewings(userId: string): AccountViewing[] {
    const db = loadDb();
    return db.viewings
      .filter((v) => v.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static getUserViewingById(id: string, userId: string): AccountViewing | null {
    const db = loadDb();
    const viewing = db.viewings.find((v) => v.id === id && v.userId === userId);
    return viewing || null;
  }

  static createUserViewing(
    userId: string,
    viewingData: Omit<AccountViewing, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): AccountViewing {
    const db = loadDb();
    const now = new Date().toISOString();

    const newViewing: AccountViewing = {
      ...viewingData,
      id: `view_${generateSecureToken(8)}`,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    db.viewings.push(newViewing);
    saveDb(db);
    return newViewing;
  }

  static cancelUserViewing(id: string, userId: string): AccountViewing | null {
    const db = loadDb();
    const index = db.viewings.findIndex((v) => v.id === id && v.userId === userId);
    if (index === -1) return null;

    const viewing = db.viewings[index];
    viewing.status = 'cancelled';
    viewing.updatedAt = new Date().toISOString();

    db.viewings[index] = viewing;
    saveDb(db);
    return viewing;
  }

  /**
   * Test Inspection Helper: retrieve last generated OTP for testing
   */
  static getLastOtpForTesting(email: string): string | null {
    const db = loadDb();
    const normalized = email.trim().toLowerCase();
    const active = db.otps
      .filter((o) => o.email.toLowerCase() === normalized && !o.consumed)
      .sort((a, b) => b.createdAt - a.createdAt)[0];
    return active?.plainCode || null;
  }
}
