import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';

// Modals
import { StatusPopup } from './src/components/StatusPopup';
import { SignInModal } from './src/components/modals/SignInModal';
import { VerifySecondaryModal } from './src/components/modals/VerifySecondaryModal';
import { RewardPromoModal } from './src/components/modals/RewardPromoModal';
import { LanguageModal } from './src/components/modals/LanguageModal';
import { ChangePasswordModal } from './src/components/modals/ChangePasswordModal';
import { VersionModal } from './src/components/modals/VersionModal';
import { WarningModal } from './src/components/modals/WarningModal';
import { TipsModal } from './src/components/modals/TipsModal';

function MainApp() {
  const { isSignInVisible, setSignInVisible } = useApp();

  return (
    <>
      <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
      <RootNavigator />

      {/* Global Modals & Dialogs */}
      <StatusPopup />
      <SignInModal visible={isSignInVisible} onClose={() => setSignInVisible(false)} />
      <VerifySecondaryModal />
      <RewardPromoModal />
      <LanguageModal />
      <ChangePasswordModal />
      <VersionModal />
      <WarningModal />
      <TipsModal />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </SafeAreaProvider>
  );
}
