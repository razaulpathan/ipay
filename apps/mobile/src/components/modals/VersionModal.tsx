import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useApp } from '../../context/AppContext';
import { SHADOWS } from '../../theme';

export const VersionModal: React.FC = () => {
  const { isVersionModalVisible, setVersionModalVisible, t } = useApp();

  if (!isVersionModalVisible) return null;

  return (
    <Modal visible={isVersionModalVisible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={() => setVersionModalVisible(false)}
      >
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <View style={styles.iconContainer}>
            <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
              <Circle cx={32} cy={32} r={30} fill="#facc15" />
              {/* i symbol */}
              <Circle cx={32} cy={22} r={3.5} fill="#ffffff" />
              <Path d="M32 29 V 45" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" />
            </Svg>
          </View>
          <Text style={styles.text}>{t('alreadyLatestVersion')}</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    maxWidth: 280,
    width: '100%',
    ...SHADOWS.modal,
  },
  iconContainer: {
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
});
