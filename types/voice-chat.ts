// TypeScript types for Voice Chat / IVR Demo

export type MessageRole = 'assistant' | 'user' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export type IVRStep =
  | 'greeting'
  | 'emergency_check'
  | 'intent_classification'
  | 'identity_name'
  | 'identity_dob'
  | 'language_preference'
  | 'consent_intro'
  | 'consent_confirmation'
  | 'magic_link_offer'
  | 'contact_collection'
  | 'appointment_scheduling'
  | 'billing_routing'
  | 'pharmacy_info'
  | 'end_demo'
  | 'error_recovery';

export type UserIntent =
  | 'new_patient'
  | 'appointment'
  | 'billing'
  | 'pharmacy'
  | 'emergency'
  | 'unknown';

export interface VoiceChatState {
  currentStep: IVRStep;
  messages: ChatMessage[];
  userIntent: UserIntent | null;
  collectedData: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    language?: 'en' | 'es';
    phone?: string;
    email?: string;
    consentGiven?: boolean;
    consentTimestamp?: string;
  };
  hasEmergency: boolean;
  isComplete: boolean;
  continueToIntake: boolean;
}

export interface IVRFlowNode {
  step: IVRStep;
  message: string | ((state: VoiceChatState) => string);
  nextStep: IVRStep | ((userInput: string, state: VoiceChatState) => IVRStep);
  extractData?: (userInput: string, state: VoiceChatState) => Partial<VoiceChatState['collectedData']>;
  keywords?: string[];
  validation?: (userInput: string) => boolean;
  errorMessage?: string;
}

export interface VoiceChatHookReturn {
  state: VoiceChatState;
  sendMessage: (content: string) => void;
  resetChat: () => void;
  isTyping: boolean;
}
