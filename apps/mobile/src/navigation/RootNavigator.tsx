import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  IndianRupee,
  Plus,
  Users,
  Wallet,
} from 'lucide-react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { DepositScreen } from '../screens/DepositScreen';
import { ToolsScreen } from '../screens/ToolsScreen';
import { TeamsScreen } from '../screens/TeamsScreen';
import { AssetsScreen } from '../screens/AssetsScreen';
import { WalletSelectionScreen } from '../screens/WalletSelectionScreen';
import { WalletBindingScreen } from '../screens/WalletBindingScreen';
import { DepositUSDTScreen } from '../screens/DepositUSDTScreen';
import { BonusScreen } from '../screens/BonusScreen';
import { CustomerServiceScreen } from '../screens/CustomerServiceScreen';
import { SublineListScreen } from '../screens/SublineListScreen';
import { BillHistoryScreen } from '../screens/BillHistoryScreen';
import { OrderHistoryScreen } from '../screens/OrderHistoryScreen';
import { WithdrawalHistoryScreen } from '../screens/WithdrawalHistoryScreen';

import { useApp } from '../context/AppContext';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabNavigator() {
  const { t } = useApp();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f1f5f9',
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: t('home'),
          tabBarIcon: ({ color, size }) => <Home size={22} color={color} />,
        }}
      />

      <Tab.Screen
        name="DepositTab"
        component={DepositScreen}
        options={{
          tabBarLabel: t('deposit'),
          tabBarIcon: ({ color, size }) => <IndianRupee size={22} color={color} />,
        }}
      />

      {/* Prominent Center Elevated Button for Tools */}
      <Tab.Screen
        name="ToolsTab"
        component={ToolsScreen}
        options={{
          tabBarLabel: t('tools'),
          tabBarIcon: () => (
            <View style={styles.centerElevatedBtn}>
              <Plus size={24} color="#ffffff" strokeWidth={3} />
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            marginTop: 4,
          },
        }}
      />

      <Tab.Screen
        name="TeamsTab"
        component={TeamsScreen}
        options={{
          tabBarLabel: t('teams'),
          tabBarIcon: ({ color, size }) => <Users size={22} color={color} />,
        }}
      />

      <Tab.Screen
        name="AssetsTab"
        component={AssetsScreen}
        options={{
          tabBarLabel: t('assets'),
          tabBarIcon: ({ color, size }) => <Wallet size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="WalletSelection" component={WalletSelectionScreen} />
        <Stack.Screen name="WalletBinding" component={WalletBindingScreen} />
        <Stack.Screen name="DepositUSDT" component={DepositUSDTScreen} />
        <Stack.Screen name="Bonus" component={BonusScreen} />
        <Stack.Screen name="CustomerService" component={CustomerServiceScreen} />
        <Stack.Screen name="SublineList" component={SublineListScreen} />
        <Stack.Screen name="BillHistory" component={BillHistoryScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        <Stack.Screen name="WithdrawalHistory" component={WithdrawalHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  centerElevatedBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00b87c',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#00b87c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
});
