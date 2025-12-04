export enum PlanType {
  FREE = 'FREE',
  PRO = 'PRO'
}

export enum DayOfWeek {
  Mon = 'Mon',
  Tue = 'Tue',
  Wed = 'Wed',
  Thu = 'Thu',
  Fri = 'Fri',
  Sat = 'Sat',
  Sun = 'Sun'
}

export enum HangoutStatus {
  PROPOSED = 'PROPOSED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: PlanType;
  referralCode: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planType: PlanType;
  status: 'active' | 'cancelled' | 'trial';
  paymentProvider: 'none' | 'stripe' | 'appStore';
  startedAt: string;
  renewedAt?: string;
  cancelledAt?: string;
}

export type FeatureLimit = number | 'unlimited';

export interface PlanLimits {
  maxWindows: FeatureLimit;
  maxCircles: FeatureLimit;
  maxChildren: FeatureLimit;
  canUseSmartSuggestions: boolean;
  canSyncCalendar: boolean;
  canUseAnalytics: boolean;
}

export interface ChildActivity {
  id: string;
  name: string;
  day: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  location?: string;
}

export interface Child {
  id: string;
  userId: string;
  name: string;
  age: number;
  color: string;
  activities: ChildActivity[];
}

export interface AvailabilityWindow {
  id: string;
  userId: string;
  title?: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  circleIds?: string[]; // null/empty means general visibility
  isActive: boolean;
}

export interface CircleMember {
  userId: string;
  role: 'owner' | 'member';
}

export interface Circle {
  id: string;
  name: string;
  description?: string;
  members: CircleMember[];
  createdBy: string;
}

export interface Hangout {
  id: string;
  organiserId: string;
  invitedUserIds: string[];
  circleId?: string;
  date: string; // ISO Date string
  startTime: string;
  endTime: string;
  location: string;
  status: HangoutStatus;
  note?: string;
}

// UI State Types
export enum ViewState {
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  CIRCLES = 'CIRCLES',
  SCHEDULE = 'SCHEDULE',
  PROFILE = 'PROFILE',
  PLAN_HANG = 'PLAN_HANG'
}
