// Voice Chatbot Demo Component

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mic, Send, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { ChatMessageBubble, TypingIndicator } from '@/components/ui/chat-message';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { cn } from '@/lib/utils';

interface VoiceChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceChatbot({ isOpen, onClose }: VoiceChatbotProps) {
  const router = useRouter();
  const { state, sendMessage, resetChat, isTyping } = useVoiceChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle continue to intake
  useEffect(() => {
    if (state.isComplete && state.continueToIntake) {
      // Store collected data in sessionStorage for intake wizard
      sessionStorage.setItem('voiceChatData', JSON.stringify(state.collectedData));

      // Close modal and navigate
      onClose();
      router.push('/new-patient?from=voice');
    }
  }, [state.isComplete, state.continueToIntake, state.collectedData, onClose, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleReset = () => {
    resetChat();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-16 z-50 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-4xl h-full flex flex-col bg-white rounded-3xl shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-[--brand-primary] to-[--brand-accent] text-white rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Talk to Allie</h2>
                <p className="text-sm text-white/80">Voice/IVR Demo</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="hover:bg-white/10 text-white"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Demo Notice */}
          <Alert className="m-4 mb-0 border-[--brand-accent]/30 bg-[--brand-accent]/5">
            <Mic className="w-4 h-4 text-[--brand-accent]" />
            <div className="ml-2">
              <p className="text-sm font-medium">Voice Demo Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                This demonstrates our IVR capabilities. Type your responses to interact with Allie.
                {' '}
                <span className="text-[--brand-accent] font-medium">Real voice integration coming soon!</span>
              </p>
            </div>
          </Alert>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
            {state.messages.map((message, index) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                isLatest={index === state.messages.length - 1}
              />
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* End Demo Actions (when complete) */}
          {state.isComplete && !state.continueToIntake && (
            <div className="px-6 py-4 border-t bg-[--surface-alt]">
              <p className="text-sm text-muted-foreground mb-3">
                Demo complete! What would you like to do?
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    sessionStorage.setItem('voiceChatData', JSON.stringify(state.collectedData));
                    onClose();
                    router.push('/new-patient?from=voice');
                  }}
                  className="flex-1"
                >
                  Continue to Full Intake
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  End Demo
                </Button>
              </div>
            </div>
          )}

          {/* Input Area */}
          {!state.isComplete && (
            <form onSubmit={handleSubmit} className="px-6 py-4 border-t bg-white rounded-b-3xl">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={isTyping ? 'Allie is typing...' : 'Type your response...'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isTyping}
                  className="flex-1 h-12 rounded-2xl"
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="h-12 w-12 rounded-2xl"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              {/* Quick Reply Suggestions (optional) */}
              {state.currentStep === 'greeting' && state.messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage('New patient intake')}
                    className="text-xs rounded-full"
                    disabled={isTyping}
                  >
                    New patient intake
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage('Schedule appointment')}
                    className="text-xs rounded-full"
                    disabled={isTyping}
                  >
                    Schedule appointment
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage('Billing question')}
                    className="text-xs rounded-full"
                    disabled={isTyping}
                  >
                    Billing question
                  </Button>
                </div>
              )}

              {/* Language selection quick replies */}
              {state.currentStep === 'language_preference' && (
                <div className="flex gap-2 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage('English')}
                    className="flex-1 rounded-full"
                    disabled={isTyping}
                  >
                    English
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage('Español')}
                    className="flex-1 rounded-full"
                    disabled={isTyping}
                  >
                    Español
                  </Button>
                </div>
              )}

              {/* Consent quick replies */}
              {state.currentStep === 'consent_confirmation' && (
                <div className="flex gap-2 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage('I agree')}
                    className="flex-1 rounded-full"
                    disabled={isTyping}
                  >
                    I agree
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage('I do not agree')}
                    className="flex-1 rounded-full"
                    disabled={isTyping}
                  >
                    I do not agree
                  </Button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </>
  );
}
