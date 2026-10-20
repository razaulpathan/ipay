import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { SHADOWS } from '../theme';

export const WhatsAppFAB: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('CustomerService')}
      style={styles.fab}
    >
      <Svg width={34} height={34} viewBox="0 0 24 24" fill="#ffffff">
        <Path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.73 7.32C8.54 7.32 8.24 7.39 7.98 7.68C7.73 7.96 7 8.64 7 10.02C7 11.4 8.01 12.74 8.15 12.93C8.29 13.11 10.13 15.94 12.95 17.15C13.62 17.44 14.15 17.62 14.55 17.75C15.23 17.96 15.84 17.93 16.33 17.86C16.88 17.78 18.01 17.18 18.25 16.51C18.49 15.84 18.49 15.26 18.42 15.14C18.35 15.02 18.16 14.96 17.87 14.81C17.58 14.66 16.18 13.97 15.92 13.88C15.66 13.79 15.47 13.74 15.28 14.03C15.09 14.32 14.55 14.96 14.38 15.15C14.22 15.34 14.05 15.37 13.76 15.22C13.47 15.07 12.54 14.77 11.44 13.79C10.59 13.03 10.01 12.09 9.85 11.8C9.68 11.51 9.83 11.35 9.98 11.21C10.11 11.08 10.27 10.87 10.42 10.7C10.56 10.53 10.61 10.4 10.71 10.21C10.8 10.02 10.76 9.85 10.68 9.7C10.61 9.56 10.03 8.12 9.79 7.55C9.55 6.99 9.31 7.07 9.13 7.06C8.96 7.05 8.76 7.05 8.57 7.05L8.73 7.32Z" />
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 84,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#25d366',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    ...SHADOWS.glow,
  },
});
