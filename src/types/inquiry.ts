/**
 * src/types/inquiry.ts
 * Inquiries, viewing requests, and seller valuation type specifications.
 */

import { PropertyType } from './property';

export type TourType = 'in-person' | 'video';
export type TimeSlot = 'morning' | 'afternoon' | 'evening';
export type ViewingRequestStatus = 'pending_confirmation';

export interface ViewingRequest {
  id?: string;
  propertyId: string;
  propertyTitle: string;
  fullName: string;
  email: string;
  phone: string;
  tourType: TourType;
  preferredDate: string; // ISO YYYY-MM-DD
  preferredTime: TimeSlot;
  representedByBroker?: boolean;
  notes?: string;
  status: ViewingRequestStatus; // Explicitly 'pending_confirmation'
  createdAt?: string;
}

export type SellingTimeline =
  | 'immediate'
  | '1-3_months'
  | '3-6_months'
  | 'exploring';

export interface SellInquiry {
  id?: string;
  ownerName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  unit?: string;
  neighborhood?: string;
  propertyType: PropertyType;
  estimatedBedrooms: number;
  estimatedBathrooms: number;
  estimatedValue?: string;
  timeline?: SellingTimeline;
  marketingPreference?: 'private_exclusive' | 'public_debut';
  notes?: string;
  submissionMethod?: 'form' | 'mailto';
  createdAt?: string;
}

export interface ContactInquiry {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  preferredOffice?: 'New York' | 'London' | 'Zurich';
  createdAt?: string;
}

export type InquiryStatus = 'idle' | 'submitting' | 'success' | 'error';
