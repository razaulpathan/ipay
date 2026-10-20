import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  Wifi,
  Camera,
  Film,
  Paperclip,
  Send,
  Check,
  CheckCheck,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { COLORS, SHADOWS } from '../theme';

export const CustomerServiceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useApp();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('Hj'); // prefilled test message from video
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    loadChat();
  }, []);

  const loadChat = async () => {
    try {
      const res = await api.getSupportMessages();
      if (res.messages && res.messages.length > 0) {
        setMessages(res.messages);
      }
    } catch (e) {
      // fallback history matching video
      setMessages([
        {
          id: 'msg_1',
          sender: 'SYSTEM',
          text: `Event Reward Settings:\nJoin Telegram channel: 15 Rupees\nContact customer service: 15 Rupees\nLink PhonePe UPI: 10 Rupees\nLink MobiKwik or other UPI: 25 Rupees\nComplete first payment-on-behalf transaction:\n30 Rupees\nTotal rewards: 95 Rupees\nProfit per completed order: 4% of the order amount\nSummary:\nUpon completing a first payment-on-behalf transaction of 100 Rupees, the actual withdrawable amount is 202 Rupees.`,
          timestamp: '11:12:27 PM',
          dateStr: '19/10/2026',
        },
        {
          id: 'msg_2',
          sender: 'USER',
          text: 'Hello',
          timestamp: '11:14:56 PM',
          dateStr: '19/10/2026',
          status: 'READ',
        },
        {
          id: 'msg_3',
          sender: 'USER',
          text: 'I want to colab with you i will launch my own platform like you but I need orders',
          timestamp: '11:15:22 PM',
          dateStr: '19/10/2026',
          status: 'READ',
        },
        {
          id: 'msg_4',
          sender: 'AGENT',
          text: 'What does it mean, and how would the cooperation work?',
          timestamp: '7:06:44 AM',
          dateStr: '20/10/2026',
        },
      ]);
    } finally {
      setTimeout(() => {
        setLoadingHistory(false);
      }, 500);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: `usr_msg_${Date.now()}`,
      sender: 'USER',
      text: inputText.trim(),
      timestamp: '9:47:30 AM',
      dateStr: '20/10/2026',
      status: 'SENT',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    try {
      await api.sendSupportMessage(newMsg.text);
    } catch (e) {}

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Service</Text>
        <View style={styles.wifiBox}>
          <Wifi size={18} color={COLORS.primary} />
        </View>
      </View>

      {loadingHistory ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading chat history...</Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatScroll}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {/* Date Separator */}
          <View style={styles.dateTagBox}>
            <Text style={styles.dateTagText}>19/10/2026</Text>
          </View>

          {messages.map((m) => {
            const isUser = m.sender === 'USER';
            const isSystem = m.sender === 'SYSTEM';

            return (
              <View
                key={m.id}
                style={[
                  styles.messageBubbleWrapper,
                  isUser ? styles.userWrapper : styles.agentWrapper,
                ]}
              >
                {!isUser && (
                  <View style={styles.csAvatar}>
                    <Text style={styles.csAvatarText}>CS</Text>
                  </View>
                )}

                <View
                  style={[
                    styles.messageBubble,
                    isUser
                      ? styles.userBubble
                      : isSystem
                      ? styles.systemBubble
                      : styles.agentBubble,
                  ]}
                >
                  <Text style={[styles.messageText, isUser && styles.userMessageText]}>
                    {m.text}
                  </Text>

                  <View style={styles.metaRow}>
                    <Text style={[styles.timeText, isUser && styles.userTimeText]}>
                      {m.timestamp}
                    </Text>
                    {isUser && (
                      <View style={{ marginLeft: 4 }}>
                        {m.status === 'READ' ? (
                          <CheckCheck size={14} color="#ffffff" />
                        ) : (
                          <Check size={14} color="#ffffff" />
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Bottom Message Input Bar */}
      <View style={styles.inputBar}>
        <View style={styles.iconsRow}>
          <TouchableOpacity style={styles.actionIconBtn}>
            <Camera size={18} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconBtn}>
            <Film size={18} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconBtn}>
            <Paperclip size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.chatInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 56,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  wifiBox: {
    width: 40,
    alignItems: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
  },
  chatScroll: {
    padding: 16,
    paddingBottom: 20,
  },
  dateTagBox: {
    alignSelf: 'center',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 16,
  },
  dateTagText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  messageBubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  agentWrapper: {
    justifyContent: 'flex-start',
  },
  csAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  csAvatarText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  systemBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageText: {
    fontSize: 13.5,
    color: '#0f172a',
    lineHeight: 20,
  },
  userMessageText: {
    color: '#ffffff',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  userTimeText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  actionIconBtn: {
    padding: 6,
  },
  chatInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 14,
    fontSize: 13.5,
    color: '#0f172a',
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginLeft: 8,
  },
  sendBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
