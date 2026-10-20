import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme';

export const LanguageModal: React.FC = () => {
  const { isLanguageModalVisible, setLanguageModalVisible, language, setLanguage } = useApp();

  if (!isLanguageModalVisible) return null;

  const selectLanguage = (code: 'en' | 'hi') => {
    setLanguage(code);
    setLanguageModalVisible(false);
  };

  return (
    <Modal visible={isLanguageModalVisible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={() => setLanguageModalVisible(false)}
      >
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <Text style={styles.sheetTitle}>
            {language === 'hi' ? 'भाषा' : 'Language'}
          </Text>

          {/* English Option */}
          <TouchableOpacity
            style={[styles.option, language === 'en' && styles.selectedOption]}
            onPress={() => selectLanguage('en')}
          >
            <Text style={[styles.primaryText, language === 'en' && styles.selectedText]}>
              English
            </Text>
            <Text style={styles.secondaryText}>English</Text>
          </TouchableOpacity>

          {/* Hindi Option */}
          <TouchableOpacity
            style={[styles.option, language === 'hi' && styles.selectedOption]}
            onPress={() => selectLanguage('hi')}
          >
            <Text style={[styles.primaryText, language === 'hi' && styles.selectedText]}>
              Hindi
            </Text>
            <Text style={styles.secondaryText}>हिन्दी</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
  },
  option: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  selectedOption: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  primaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  selectedText: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  secondaryText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
});
