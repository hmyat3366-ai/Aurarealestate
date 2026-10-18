import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthDatabase } from "@/lib/server/db";

describe("Unit: AuthDatabase & Security Invariants", () => {
  beforeEach(() => {
    AuthDatabase.reset();
  });

  describe("1. OTP Generation, Expiry & Rate Limiting", () => {
    const testEmail = "client@aurarealestate.com";

    it("generates a 6-digit numeric OTP code", () => {
      const res = AuthDatabase.requestOtp(testEmail);
      expect(res.success).toBe(true);
      expect(res.code).toMatch(/^\d{6}$/);
    });

    it("enforces anti-enumeration invariant by responding identically for unregistered and registered emails", () => {
      // 1. Request OTP for unregistered email
      const unregRes = AuthDatabase.requestOtp("unregistered@example.com");
      expect(unregRes.success).toBe(true);

      // 2. Create user, then request OTP
      AuthDatabase.createUser({
        email: "registered@example.com",
        fullName: "Lord Sterling",
      });
      const regRes = AuthDatabase.requestOtp("registered@example.com");
      expect(regRes.success).toBe(true);

      expect(typeof unregRes.code).toBe("string");
      expect(typeof regRes.code).toBe("string");
    });

    it("enforces 60-second resend cooldown timer", () => {
      const first = AuthDatabase.requestOtp(testEmail);
      expect(first.success).toBe(true);

      // Immediate second attempt within 60s
      const second = AuthDatabase.requestOtp(testEmail);
      expect(second.success).toBe(false);
      expect(second.error).toContain("Please wait");
      expect(second.cooldownSeconds).toBeGreaterThan(0);
      expect(second.cooldownSeconds).toBeLessThanOrEqual(60);
    });

    it("enforces 5-minute expiry on OTP verification", () => {
      const { code } = AuthDatabase.requestOtp(testEmail);
      expect(code).toBeDefined();

      // Advance time by 5 minutes + 1 second
      const realDateNow = Date.now;
      try {
        Date.now = vi.fn(() => realDateNow() + 5 * 60 * 1000 + 1000);
        const verifyRes = AuthDatabase.verifyOtp(testEmail, code!);
        expect(verifyRes.success).toBe(false);
        expect(verifyRes.error).toContain("expired");
      } finally {
        Date.now = realDateNow;
      }
    });

    it("enforces attempt limit of 5 failed tries and invalidates code on 5th failure", () => {
      const { code } = AuthDatabase.requestOtp(testEmail);
      expect(code).toBeDefined();

      const wrongCode = code === "123456" ? "654321" : "123456";

      // Attempt 1 to 4
      for (let i = 1; i <= 4; i++) {
        const attempt = AuthDatabase.verifyOtp(testEmail, wrongCode);
        expect(attempt.success).toBe(false);
        expect(attempt.remainingAttempts).toBe(5 - i);
        expect(attempt.error).toContain(`${5 - i} attempt`);
      }

      // Attempt 5: invalidation
      const fifthAttempt = AuthDatabase.verifyOtp(testEmail, wrongCode);
      expect(fifthAttempt.success).toBe(false);
      expect(fifthAttempt.remainingAttempts).toBe(0);
      expect(fifthAttempt.error).toContain("exceeded");

      // Attempt with the real code now fails because OTP was invalidated
      const realCodeAttempt = AuthDatabase.verifyOtp(testEmail, code!);
      expect(realCodeAttempt.success).toBe(false);
      expect(realCodeAttempt.error).toContain("No active verification code found");

      // Verify that 60s cooldown is STILL enforced (attacker cannot bypass cooldown by exhausting attempts)
      const bypassAttempt = AuthDatabase.requestOtp(testEmail);
      expect(bypassAttempt.success).toBe(false);
      expect(bypassAttempt.error).toContain("Please wait");
      expect(bypassAttempt.cooldownSeconds).toBeGreaterThan(0);
    });

    it("enforces rate limit of max 5 OTP requests per 10 minutes", () => {
      const email = "frequent@example.com";
      const realDateNow = Date.now;
      let mockNow = 1700000000000;

      try {
        Date.now = vi.fn(() => mockNow);

        // Make 5 successful OTP requests with 65s gaps
        for (let i = 0; i < 5; i++) {
          const res = AuthDatabase.requestOtp(email);
          expect(res.success).toBe(true);
          mockNow += 65 * 1000; // Past cooldown
        }

        // 6th attempt within the 10-minute window should be rate limited
        const sixth = AuthDatabase.requestOtp(email);
        expect(sixth.success).toBe(false);
        expect(sixth.error).toContain("Too many verification code requests");
      } finally {
        Date.now = realDateNow;
      }
    });
  });

  describe("2. User Registration & Session Establishment", () => {
    it("directly returns user for existing accounts upon OTP verification", () => {
      const email = "existing.client@aurarealestate.com";
      const existingUser = AuthDatabase.createUser({
        email,
        fullName: "Lady Genevieve Vance",
        phone: "+44 20 7946 0888",
      });

      const { code } = AuthDatabase.requestOtp(email);
      const verifyRes = AuthDatabase.verifyOtp(email, code!);

      expect(verifyRes.success).toBe(true);
      expect(verifyRes.isNewUser).toBe(false);
      expect(verifyRes.user?.id).toBe(existingUser.id);
      expect(verifyRes.user?.fullName).toBe("Lady Genevieve Vance");
    });

    it("issues a registrationToken for new accounts upon OTP verification", () => {
      const email = "new.client@aurarealestate.com";
      const { code } = AuthDatabase.requestOtp(email);
      const verifyRes = AuthDatabase.verifyOtp(email, code!);

      expect(verifyRes.success).toBe(true);
      expect(verifyRes.isNewUser).toBe(true);
      expect(verifyRes.registrationToken).toBeDefined();
      expect(typeof verifyRes.registrationToken).toBe("string");

      // Complete registration with token
      const regRes = AuthDatabase.completeRegistration({
        registrationToken: verifyRes.registrationToken!,
        fullName: "Lord Charles Sterling",
        phone: "+1 212 555 0199",
      });

      expect(regRes.success).toBe(true);
      expect(regRes.user?.email).toBe(email);
      expect(regRes.user?.fullName).toBe("Lord Charles Sterling");
      expect(regRes.user?.phone).toBe("+1 212 555 0199");

      // Consumed token cannot be reused
      const replay = AuthDatabase.completeRegistration({
        registrationToken: verifyRes.registrationToken!,
        fullName: "Imposter",
      });
      expect(replay.success).toBe(false);
    });

    it("rejects names with fewer than 2 characters during profile registration", () => {
      const email = "shortname@aurarealestate.com";
      const { code } = AuthDatabase.requestOtp(email);
      const verifyRes = AuthDatabase.verifyOtp(email, code!);

      const regRes = AuthDatabase.completeRegistration({
        registrationToken: verifyRes.registrationToken!,
        fullName: "A",
      });
      expect(regRes.success).toBe(false);
      expect(regRes.error).toContain("Full name must be at least 2 characters.");
    });
  });

  describe("3. Session Rotation, Invalidation & Expiry", () => {
    it("creates, validates, and rotates sessions securely", () => {
      const user = AuthDatabase.createUser({
        email: "session.user@example.com",
        fullName: "Alexander Hamilton",
      });

      // 1. Create session
      const session1 = AuthDatabase.createSession(user.id);
      expect(session1.token).toBeDefined();

      const lookup1 = AuthDatabase.getSession(session1.token);
      expect(lookup1).not.toBeNull();
      expect(lookup1?.user.id).toBe(user.id);

      // 2. Rotate session (session fixation defense)
      const session2 = AuthDatabase.rotateSession(session1.token, user.id);
      expect(session2.token).not.toBe(session1.token);

      // Old session is now invalid
      expect(AuthDatabase.getSession(session1.token)).toBeNull();
      // New session is valid
      expect(AuthDatabase.getSession(session2.token)?.user.id).toBe(user.id);

      // 3. Logout / Delete session
      AuthDatabase.deleteSession(session2.token);
      expect(AuthDatabase.getSession(session2.token)).toBeNull();
    });
  });

  describe("4. Saved Properties & Guest Merging", () => {
    it("merges guest favorites into authenticated user account without duplicates or data loss", () => {
      const user = AuthDatabase.createUser({
        email: "saved.collector@example.com",
        fullName: "Eleanor Sterling",
      });

      // User already saved prop-sale-01
      AuthDatabase.addSavedProperty(user.id, "prop-sale-01");

      // Guest had prop-sale-01 (duplicate) and prop-rent-02, prop-sale-03 in localStorage
      const guestProperties = ["prop-sale-01", "prop-rent-02", "prop-sale-03"];
      const merged = AuthDatabase.mergeSavedProperties(user.id, guestProperties);

      expect(merged).toHaveLength(3);
      expect(merged).toContain("prop-sale-01");
      expect(merged).toContain("prop-rent-02");
      expect(merged).toContain("prop-sale-03");

      // Removing a property works as expected
      const afterRemove = AuthDatabase.removeSavedProperty(user.id, "prop-sale-01");
      expect(afterRemove).toHaveLength(2);
      expect(afterRemove).not.toContain("prop-sale-01");
    });
  });

  describe("5. Viewing Appointments & Cross-Account Data Isolation", () => {
    it("enforces strict cross-account isolation for viewings and appointments", () => {
      const userAlice = AuthDatabase.createUser({
        email: "alice@example.com",
        fullName: "Alice Vance",
      });
      const userBob = AuthDatabase.createUser({
        email: "bob@example.com",
        fullName: "Bob Sterling",
      });

      // Alice books a viewing
      const aliceViewing = AuthDatabase.createUserViewing(userAlice.id, {
        propertyId: "prop-sale-01",
        propertyTitle: "The Belgravia Crescent Penthouse",
        fullName: "Alice Vance",
        email: "alice@example.com",
        phone: "+44 20 7123 4567",
        tourType: "in-person",
        preferredDate: "2026-12-01",
        preferredTime: "afternoon",
        status: "pending_confirmation",
        referenceCode: "VS-VR-SALE-01-1234",
      });

      // 1. Bob cannot see Alice's viewings
      const bobViewings = AuthDatabase.getUserViewings(userBob.id);
      expect(bobViewings).toHaveLength(0);

      // 2. Bob cannot retrieve Alice's viewing by ID
      const bobAttempt = AuthDatabase.getUserViewingById(aliceViewing.id, userBob.id);
      expect(bobAttempt).toBeNull();

      // 3. Bob cannot cancel Alice's viewing
      const bobCancelAttempt = AuthDatabase.cancelUserViewing(aliceViewing.id, userBob.id);
      expect(bobCancelAttempt).toBeNull();

      // Alice's viewing status is still pending_confirmation
      const aliceCheck = AuthDatabase.getUserViewingById(aliceViewing.id, userAlice.id);
      expect(aliceCheck?.status).toBe("pending_confirmation");

      // 4. Alice CAN cancel her own viewing
      const aliceCancel = AuthDatabase.cancelUserViewing(aliceViewing.id, userAlice.id);
      expect(aliceCancel?.status).toBe("cancelled");
    });
  });
});
