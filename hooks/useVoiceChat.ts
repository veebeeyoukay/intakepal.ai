// Voice Chat State Management Hook

'use client';

import { useState, useCallback, useEffect } from 'react';
import { VoiceChatState, ChatMessage, IVRStep, VoiceChatHookReturn } from '@/types/voice-chat';
import {
  getMessage,
  getNextStep,
  extractStepData,
  classifyIntent,
  detectEmergency,
  validateInput,
  getErrorMessage
} from '@/lib/ivr-flow';

const INITIAL_STATE: VoiceChatState = {
  currentStep: 'greeting',
  messages: [],
  userIntent: null,
  collectedData: {},
  hasEmergency: false,
  isComplete: false,
  continueToIntake: false
};

export function useVoiceChat(): VoiceChatHookReturn {
  const [state, setState] = useState<VoiceChatState>(INITIAL_STATE);
  const [isTyping, setIsTyping] = useState(false);

  /**
   * Add a message to the chat
   */
  const addMessage = useCallback((role: ChatMessage['role'], content: string) => {
    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  }, []);

  /**
   * Send initial greeting when component mounts
   */
  useEffect(() => {
    if (state.messages.length === 0) {
      // Small delay for realism
      setIsTyping(true);
      setTimeout(() => {
        const greeting = getMessage('greeting', state);
        addMessage('assistant', greeting);
        setIsTyping(false);
      }, 800);
    }
  }, [state.messages.length, addMessage, state]);

  /**
   * Process user message and determine next step
   */
  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || isTyping) return;

    // Add user message
    addMessage('user', content);

    // Simulate typing delay
    setIsTyping(true);

    setTimeout(() => {
      setState(prev => {
        const currentStep = prev.currentStep;

        // Check for emergency keywords in any message
        if (detectEmergency(content)) {
          prev = { ...prev, hasEmergency: true };

          if (currentStep === 'greeting') {
            const emergencyMsg = getMessage('emergency_check', prev);
            setTimeout(() => {
              addMessage('assistant', emergencyMsg);
              setIsTyping(false);
            }, 500);

            return {
              ...prev,
              currentStep: 'emergency_check'
            };
          }
        }

        // Classify intent if at greeting or intent classification step
        if (currentStep === 'greeting' || currentStep === 'intent_classification') {
          const intent = classifyIntent(content);
          prev = { ...prev, userIntent: intent };
        }

        // Validate input for current step
        if (!validateInput(currentStep, content)) {
          const errorMsg = getErrorMessage(currentStep);
          if (errorMsg) {
            setTimeout(() => {
              addMessage('system', errorMsg);
              setIsTyping(false);
            }, 500);
            return prev; // Stay on same step
          }
        }

        // Extract data from user input
        const extractedData = extractStepData(currentStep, content, prev);
        prev = {
          ...prev,
          collectedData: {
            ...prev.collectedData,
            ...extractedData
          }
        };

        // Determine next step
        const nextStep = getNextStep(currentStep, content, prev);

        // Check if user wants to continue to intake or end demo
        if (currentStep === 'end_demo') {
          const lowerContent = content.toLowerCase();
          if (lowerContent.includes('continue') || lowerContent.includes('intake')) {
            prev = { ...prev, continueToIntake: true, isComplete: true };
          } else if (lowerContent.includes('end') || lowerContent.includes('explore')) {
            prev = { ...prev, isComplete: true };
          }
        }

        // Get message for next step
        const nextMessage = getMessage(nextStep, prev);

        // Delay to simulate realistic conversation
        const delay = nextStep === 'greeting' ? 500 : 1000 + Math.random() * 500;

        setTimeout(() => {
          addMessage('assistant', nextMessage);
          setIsTyping(false);
        }, delay);

        return {
          ...prev,
          currentStep: nextStep
        };
      });
    }, 600); // Typing delay
  }, [isTyping, addMessage]);

  /**
   * Reset chat to initial state
   */
  const resetChat = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    sendMessage,
    resetChat,
    isTyping
  };
}
