import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Schedule } from './screens/Schedule';
import { Circles } from './screens/Circles';
import { PlanHangout } from './screens/PlanHangout';
import { Profile } from './screens/Profile';
import { UpgradeModal } from './components/UpgradeModal';
import { 
  MOCK_USER, MOCK_WINDOWS, MOCK_KIDS, MOCK_CIRCLES, MOCK_HANGOUTS, MOCK_FRIENDS, MOCK_SUBSCRIPTION, PLAN_LIMITS, BETA_MODE
} from './constants';
import { ViewState, ChildActivity, AvailabilityWindow, PlanType, PlanLimits } from './types';

function App() {
  const [view, setView] = useState<ViewState>(ViewState.ONBOARDING);
  const [user, setUser] = useState(MOCK_USER);
  const [subscription, setSubscription] = useState(MOCK_SUBSCRIPTION);
  const [windows, setWindows] = useState(MOCK_WINDOWS);
  const [kids, setKids] = useState(MOCK_KIDS);
  const [hangouts, setHangouts] = useState(MOCK_HANGOUTS);
  const [circles] = useState(MOCK_CIRCLES);
  
  // Upsell State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');

  const handleOnboardingComplete = () => {
    setView(ViewState.HOME);
  };

  /**
   * Central Access Controller
   * Checks if the user is allowed to perform an action based on their plan limits.
   * In BETA_MODE, access is always granted.
   */
  const checkAccess = (feature: keyof PlanLimits, currentCount: number = 0): boolean => {
    // 1. Beta Override
    if (BETA_MODE) {
      console.log(`BETA ACCESS: Granted for ${feature}`);
      return true;
    }

    // 2. Check Plan Limits
    const limits = PLAN_LIMITS[subscription.planType];
    const limitValue = limits[feature];

    // Boolean Check (e.g. smartSuggestions)
    if (typeof limitValue === 'boolean') {
      if (limitValue) return true;
      setUpgradeReason(getReasonText(feature));
      setShowUpgradeModal(true);
      return false;
    }

    // Numeric Check (e.g. maxWindows)
    if (limitValue === 'unlimited') return true;
    
    if (currentCount >= limitValue) {
      setUpgradeReason(getReasonText(feature));
      setShowUpgradeModal(true);
      return false;
    }

    return true;
  };

  const getReasonText = (feature: string) => {
    switch(feature) {
      case 'maxWindows': return "You've reached your limit of free availability windows.";
      case 'maxCircles': return "Free plans are limited to 3 circles.";
      case 'maxChildren': return "Upgrade to manage multiple kids' schedules.";
      case 'smartSuggestions': return "Smart AI suggestions are a Pro feature.";
      default: return "Upgrade to unlock this feature.";
    }
  }

  const handleUpgrade = () => {
    // In a real app, this would trigger Stripe flow.
    // For MVP/Demo, we just upgrade the state.
    setSubscription(prev => ({ ...prev, planType: PlanType.PRO }));
    setUser(prev => ({ ...prev, plan: PlanType.PRO }));
    setShowUpgradeModal(false);
    alert("Welcome to Pro! (Simulated Upgrade)");
  };

  const handleAddChildActivity = (childId: string, activity: Omit<ChildActivity, 'id'>) => {
    setKids(prev => prev.map(child => {
      if (child.id === childId) {
        return {
          ...child,
          activities: [...child.activities, { ...activity, id: crypto.randomUUID() }]
        };
      }
      return child;
    }));
  };

  const handleAddWindow = (windowData: Omit<AvailabilityWindow, 'id'>) => {
    const newWindow = { ...windowData, id: crypto.randomUUID() };
    setWindows([...windows, newWindow]);
  };

  const handleCreateHangout = (details: any) => {
    const newHangout = {
      id: crypto.randomUUID(),
      organiserId: user.id,
      invitedUserIds: details.friendIds,
      date: new Date().toISOString(), // Mock date
      startTime: '10:00', // Mock time based on window
      endTime: '12:00',
      location: 'TBD',
      status: 'PROPOSED',
      note: details.message
    };
    // @ts-ignore
    setHangouts([...hangouts, newHangout]);
    setView(ViewState.HOME);
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case ViewState.HOME:
        return (
          <Home 
            user={user} 
            windows={windows} 
            hangouts={hangouts} 
            kids={kids} 
            onUpgrade={() => setShowUpgradeModal(true)}
          />
        );
      case ViewState.SCHEDULE:
        return (
          <Schedule 
            user={user} 
            kids={kids} 
            windows={windows} 
            onAddWindow={handleAddWindow} 
            onAddChildActivity={handleAddChildActivity}
            checkAccess={checkAccess}
          />
        );
      case ViewState.CIRCLES:
        return (
          <Circles 
            circles={circles} 
            users={MOCK_FRIENDS} 
            checkAccess={checkAccess}
          />
        );
      case ViewState.PROFILE:
        return (
          <Profile 
            user={user} 
            subscription={subscription} 
            onUpgrade={() => setShowUpgradeModal(true)} 
          />
        );
      case ViewState.PLAN_HANG:
        return (
          <PlanHangout 
            currentUser={user} 
            friends={MOCK_FRIENDS} 
            windows={windows} 
            onClose={() => setView(ViewState.HOME)}
            onSubmit={handleCreateHangout}
          />
        );
      default:
        return <Home user={user} windows={windows} hangouts={hangouts} kids={kids} onUpgrade={() => setShowUpgradeModal(true)} />;
    }
  };

  return (
    <Layout currentView={view} setView={setView}>
      {renderContent()}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        onUpgrade={handleUpgrade}
        triggerReason={upgradeReason}
      />
    </Layout>
  );
}

export default App;
