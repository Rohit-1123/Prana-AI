import { useEffect, useRef } from "react";
import { MessageBubble, type ChatMessage } from "./MessageBubble";
import { EmptyState } from "./EmptyState";
import { TypingIndicator } from "./TypingIndicator";

interface ConversationViewProps {
  messages: ChatMessage[];
  suggestedQuestions: string[];
  onClickQuestion: (q: string) => void;
  isLoading: boolean;
  onNavigate?: (tabId: string) => void;
  onGenerateReport?: () => void;
}

export function ConversationView({
  messages,
  suggestedQuestions,
  onClickQuestion,
  isLoading,
  onNavigate,
  onGenerateReport
}: ConversationViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 min-h-[300px] max-h-[500px]"
    >
      {messages.length === 0 ? (
        <EmptyState 
          questions={suggestedQuestions}
          onClickQuestion={onClickQuestion}
        />
      ) : (
        <>
          {messages.map((msg, index) => (
            <MessageBubble 
              key={index} 
              msg={msg} 
              onNavigate={onNavigate}
              onGenerateReport={onGenerateReport}
            />
          ))}
          {isLoading && <TypingIndicator />}
        </>
      )}
    </div>
  );
}
