import { DayOfWeek, PlanType, User, Circle, AvailabilityWindow, Child, Hangout, HangoutStatus, PlanLimits, Subscription } from './types';

// GLOBAL CONFIG
export const BETA_MODE = true; // Set to true to give everyone Pro access for testing

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  [PlanType.FREE]: {
    maxWindows: 3,
    maxCircles: 3,
    maxChildren: 1,
    canUseSmartSuggestions: false,
    canSyncCalendar: false,
    canUseAnalytics: false
  },
  [PlanType.PRO]: {
    maxWindows: 'unlimited',
    maxCircles: 'unlimited',
    maxChildren: 'unlimited',
    canUseSmartSuggestions: true,
    canSyncCalendar: true,
    canUseAnalytics: true
  }
};

export const DAYS_ORDER = [
  DayOfWeek.Mon, DayOfWeek.Tue, DayOfWeek.Wed, DayOfWeek.Thu, DayOfWeek.Fri, DayOfWeek.Sat, DayOfWeek.Sun
];

// If Beta mode is on, we default the user to PRO for the UI experience, 
// though the backend might technically see them as free.
const INITIAL_PLAN = BETA_MODE ? PlanType.PRO : PlanType.FREE;

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Sarah Jenkins',
  email: 'sarah@example.com',
  avatarUrl: 'https://picsum.photos/100/100',
  plan: INITIAL_PLAN,
  referralCode: 'LOOPD-SARAH-22'
};

export const MOCK_SUBSCRIPTION: Subscription = {
  id: 'sub_123',
  userId: 'u1',
  planType: INITIAL_PLAN,
  status: 'active',
  paymentProvider: 'none', // Placeholder
  startedAt: new Date().toISOString()
};

export const MOCK_KIDS: Child[] = [
  {
    id: 'c1',
    userId: 'u1',
    name: 'Leo',
    age: 7,
    color: 'bg-blue-100 text-blue-800',
    activities: [
      { id: 'a1', name: 'School', day: DayOfWeek.Mon, startTime: '09:00', endTime: '15:00' },
      { id: 'a2', name: 'Soccer', day: DayOfWeek.Tue, startTime: '16:00', endTime: '17:00' }
    ]
  },
  {
    id: 'c2',
    userId: 'u1',
    name: 'Mia',
    age: 4,
    color: 'bg-pink-100 text-pink-800',
    activities: [
      { id: 'a3', name: 'Preschool', day: DayOfWeek.Mon, startTime: '08:30', endTime: '12:30' }
    ]
  }
];

export const MOCK_WINDOWS: AvailabilityWindow[] = [
  {
    id: 'w1',
    userId: 'u1',
    day: DayOfWeek.Fri,
    startTime: '15:30',
    endTime: '17:30',
    isActive: true,
    title: 'After school hang'
  },
  {
    id: 'w2',
    userId: 'u1',
    day: DayOfWeek.Sat,
    startTime: '10:00',
    endTime: '12:00',
    isActive: true,
    title: 'Coffee & Playground'
  }
];

export const MOCK_CIRCLES: Circle[] = [
  {
    id: 'cir1',
    name: 'Room 7 Mums',
    description: 'Parents from Leo\'s class',
    createdBy: 'u1',
    members: [{ userId: 'u1', role: 'owner' }, { userId: 'u2', role: 'member' }, { userId: 'u3', role: 'member' }]
  },
  {
    id: 'cir2',
    name: 'Netball Team',
    description: 'Saturday morning crew',
    createdBy: 'u2',
    members: [{ userId: 'u1', role: 'member' }, { userId: 'u2', role: 'owner' }]
  }
];

export const MOCK_FRIENDS: User[] = [
  { id: 'u2', name: 'Emily Chen', email: 'emily@test.com', plan: PlanType.PRO, referralCode: '123' },
  { id: 'u3', name: 'Jess M', email: 'jess@test.com', plan: PlanType.FREE, referralCode: '456' }
];

export const MOCK_HANGOUTS: Hangout[] = [
  {
    id: 'h1',
    organiserId: 'u2',
    invitedUserIds: ['u1'],
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), // 2 days from now
    startTime: '10:00',
    endTime: '12:00',
    location: 'Central Park Cafe',
    status: HangoutStatus.PROPOSED,
    note: 'Hey! Are you free for a coffee?'
  }
];
