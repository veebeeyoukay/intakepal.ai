// Chat Message Bubble Component

import { ChatMessage } from '@/types/voice-chat';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessage;
  isLatest?: boolean;
}

export function ChatMessageBubble({ message, isLatest = false }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';

  // System messages (like errors) are centered and styled differently
  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-4 py-2 rounded-xl bg-warning/10 text-warning text-sm max-w-md text-center">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
        !isAssistant && 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isAssistant ? 'bg-[--brand-primary] text-white' : 'bg-[--surface-alt] text-[--ink]'
        )}
      >
        {isAssistant ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          'flex flex-col max-w-[80%] sm:max-w-[70%]',
          !isAssistant && 'items-end'
        )}
      >
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl shadow-sm',
            isAssistant
              ? 'bg-white border border-gray-200 text-[--ink]'
              : 'bg-[--brand-primary] text-white'
          )}
        >
          {/* Parse markdown-style bold text */}
          <div
            className="text-sm leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: message.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/• /g, '<br/>• ')
            }}
          />
        </div>

        {/* Timestamp (only show on hover for cleaner UI) */}
        <div className="text-xs text-muted-foreground mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {message.timestamp.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Typing indicator component
 */
export function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Allie avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[--brand-primary] text-white flex items-center justify-center">
        <Bot className="w-5 h-5" />
      </div>

      {/* Typing dots */}
      <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
