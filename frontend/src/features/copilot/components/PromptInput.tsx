import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Send, Eraser } from "lucide-react";

interface PromptInputProps {
  onSend: (text: string) => void;
  onClear: () => void;
  isLoading: boolean;
}

export function PromptInput({ onSend, onClear, isLoading }: PromptInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 bg-card/90 border border-border p-2 rounded-2xl shadow-theme items-end animate-in fade-in duration-200">
      
      {/* Clear Chat */}
      <button
        type="button"
        onClick={onClear}
        title="Clear conversation"
        className="p-2.5 rounded-xl hover:bg-muted/10 text-muted hover:text-danger cursor-pointer shrink-0 transition-colors"
      >
        <Eraser className="w-4 h-4" />
      </button>

      {/* Multi-line input */}
      <textarea
        rows={1}
        placeholder="Ask about Hyderabad air quality, traffic spikes, weather indices, or green route recommendations..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow bg-transparent border-none outline-none resize-none text-xs text-foreground placeholder-muted p-2 max-h-24 focus:ring-0"
      />

      <div className="flex gap-1.5 shrink-0 items-center">

        {/* Send */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-primary text-white p-2.5 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </form>
  );
}
