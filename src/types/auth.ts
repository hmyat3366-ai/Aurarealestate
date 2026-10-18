/**
 * src/types/auth.ts
 * Type definitions for passwordless OTP authentication, sessions,
 * user profiles, saved residences, and account viewing appointments.
 */

import { TourType, TimeSlot } from './inquiry';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  token: string;
  userId: string;
  expiresAt: number; // Timestamp in milliseconds
  createdAt: string;
}

export interface OtpRecord {
  id: string;
  email: string;
  codeHash: string;
  plainCode?: string; // For testing or debug output in non-prod
  expiresAt: number; // Timestamp in milliseconds (5 minutes from creation)
  attempts: number; // Failed verification attempts (max 5)
  resendAvailableAt: number; // Timestamp in milliseconds (60s cooldown)
  verified: boolean;
  consumed: boolean;
  createdAt: number;
}

export interface RegistrationTokenRecord {
  token: string;
  email: string;
  expiresAt: number; // Timestamp in milliseconds (15 minutes from creation)
  createdAt: number;
}

export interface AccountSavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  savedAt: string;
}

export type AccountViewingStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface AccountViewing {
  id: string;
  userId: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation?: string;
  propertyPrice?: number;
  propertyCurrency?: string;
  propertyListingType?: 'sale' | 'rent';
  propertyImageUrl?: string;
  fullName: string;
  email: string;
  phone: string;
  tourType: TourType;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: TimeSlot;
  notes?: string;
  status: AccountViewingStatus;
  referenceCode: string;
  advisorName?: string;
  advisorPhone?: string;
  advisorEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
