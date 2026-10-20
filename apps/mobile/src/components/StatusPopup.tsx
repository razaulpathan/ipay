import React from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useApp } from '../context/AppContext';
import { COLORS, SHADOWS } from '../theme';

export const StatusPopup: React.FC = () => {
  const { dialogState } = useApp();

  if (!dialogState || !dialogState.visible) return null;

  return (
    <Modal transparent animationType="fade" visible={dialogState.visible}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {dialogState.type === 'loading' && (
            <View style={{ padding: 10 }}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}

          {dialogState.type === 'sad' && (
            <View style={styles.iconContainer}>
              <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
                <Circle cx={32} cy={32} r={30} fill="#f43f5e" />
                {/* Eyes */}
                <Circle cx={22} cy={26} r={3.5} fill="#ffffff" />
                <Circle cx={42} cy={26} r={3.5} fill="#ffffff" />
                {/* Sad Mouth Curve */}
                <Path
                  d="M21 44 C 26 36, 38 36, 43 44"
                  stroke="#ffffff"
                  strokeWidth={4.5}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          )}

          {dialogState.type === 'smile' && (
            <View style={styles.iconContainer}>
              <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
                <Circle cx={32} cy={32} r={30} fill={COLORS.primary} />
                {/* Eyes */}
                <Circle cx={22} cy={25} r={3.5} fill="#ffffff" />
                <Circle cx={42} cy={25} r={3.5} fill="#ffffff" />
                {/* Smile Mouth Curve */}
                <Path
                  d="M21 37 C 26 45, 38 45, 43 37"
                  stroke="#ffffff"
                  strokeWidth={4.5}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          )}

          {dialogState.type === 'info' && (
            <View style={styles.iconContainer}>
              <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
                <Circle cx={32} cy={32} r={30} fill="#f59e0b" />
                {/* Information letter i */}
                <Circle cx={32} cy={22} r={3.5} fill="#ffffff" />
                <Path d="M32 29 V 45" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" />
              </Svg>
            </View>
          )}

          {dialogState.text ? (
            <Text style={styles.titleText}>{dialogState.text}</Text>
          ) : null}

          {dialogState.subText ? (
            <Text style={styles.subText}>{dialogState.subText}</Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 28,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
    ...SHADOWS.modal,
  },
  iconContainer: {
    marginBottom: 14,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 22,
  },
  subText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
