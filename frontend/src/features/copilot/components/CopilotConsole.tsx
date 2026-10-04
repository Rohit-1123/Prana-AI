import { useState, useEffect } from "react";
import { HistoryDrawer, type ConversationSession } from "./HistoryDrawer";
import { ConversationView } from "./ConversationView";
import { PromptInput } from "./PromptInput";
import { ContextPanel } from "./ContextPanel";
import { QuickActions } from "./QuickActions";
import { MessageSquare, RefreshCw } from "lucide-react";
import { type ChatMessage } from "./MessageBubble";
import { askCopilot } from "../api";
import { useSettings } from "../../../contexts/SettingsContext";



interface CopilotConsoleProps {
  selectedWard: any;
  /** All wards with live readings, so the agent can compare places. */
  wards: any[];
  onGenerateReport: () => void;
  onViewTwin: () => void;
  onOpenForecast: () => void;
  onNavigate?: (tabId: string) => void;
}

export function CopilotConsole({
  selectedWard,
  wards,
  onGenerateReport,
  onViewTwin,
  onOpenForecast,
  onNavigate
}: CopilotConsoleProps) {
  const { language } = useSettings();
  
  // Suggested Questions Prompt Chips
  const suggestedQuestions = [
    `Is it safe to jog in ${selectedWard.name} this evening?`,
    "What is the AQI forecast for tomorrow?",
    "Which area currently has the best air quality?",
    "How should I protect my kids from today's air?"
  ];

  // Conversation Sessions list state
  const [sessions, setSessions] = useState<ConversationSession[]>(() => {
    const saved = localStorage.getItem("prana-copilot-sessions");
    return saved ? JSON.parse(saved) : [
      { id: "sess-1", title: "New Conversation", timestamp: new Date().toISOString().split("T")[0] }
    ];
  });
  const [activeSessionId, setActiveSessionId] = useState(() => {
    return localStorage.getItem("prana-copilot-active-session") || "sess-1";
  });

  // Messages session logs mapping
  const [sessionMessages, setSessionMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem("prana-copilot-messages");
    return saved ? JSON.parse(saved) : {
      "sess-1": [
        { sender: "agent", text: "Hello! I am your Citizen Advisory Agent. Ask me about air quality, safe outdoor hours, or cleaner places nearby in any city on PranaAI." }
      ]
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const messages = sessionMessages[activeSessionId] || [];

  useEffect(() => {
    localStorage.setItem("prana-copilot-sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("prana-copilot-messages", JSON.stringify(sessionMessages));
  }, [sessionMessages]);

  useEffect(() => {
    localStorage.setItem("prana-copilot-active-session", activeSessionId);
  }, [activeSessionId]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const sessionId = activeSessionId;
    const updatedUserMsg = [...messages, { sender: "user", text } as ChatMessage];
    setSessionMessages(prev => ({ ...prev, [sessionId]: updatedUserMsg }));
    // Name untitled conversations after their first question
    setSessions(prev => prev.map(s => s.id === sessionId && s.title === "New Conversation" ? { ...s, title: text.slice(0, 48) } : s));
    setIsLoading(true);

    const reply = await askCopilot(text, selectedWard, wards, language, messages);
    setSessionMessages(prev => ({
      ...prev,
      [sessionId]: [...(prev[sessionId] || updatedUserMsg), { sender: "agent", text: reply.text, routes: reply.routes } as ChatMessage]
    }));
    setIsLoading(false);
  };

  const handleNewSession = () => {
    const newId = `sess-${Date.now()}`;
    const newSession: ConversationSession = {
      id: newId,
      title: "New Conversation",
      timestamp: new Date().toISOString().split("T")[0]
    };
    setSessions([newSession, ...sessions]);
    setSessionMessages(prev => ({
      ...prev,
      [newId]: [{ sender: "agent", text: "Hello! Ask me about air quality, safe outdoor hours, or cleaner places nearby in any city on PranaAI." }]
    }));
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (id: string) => {
    const remaining = sessions.filter(s => s.id !== id);
    setSessions(remaining);
    setSessionMessages(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeSessionId === id) {
      if (remaining.length) setActiveSessionId(remaining[0].id);
      else handleNewSession();
    }
  };

  const handleClearChat = () => {
    setSessionMessages(prev => ({
      ...prev,
      [activeSessionId]: []
    }));
  };

  const handleExport = () => {
    const chatLogText = messages.map(m => `[${m.sender}] ${m.text}`).join("\n");
    const blob = new Blob([chatLogText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prana-copilot-chat-${activeSessionId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      {/* 1. Left Drawer: History list (3 columns on desktop) */}
      <div className="order-3 lg:order-1 lg:col-span-3 h-full">
        <HistoryDrawer 
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* 2. Center Panel: Chat Workspace (6 columns on desktop) */}
      <div className="order-1 lg:order-2 lg:col-span-6 glass-card p-6 flex flex-col justify-between min-h-[420px] h-[calc(100dvh-13rem)] max-h-[720px]">
        
        {/* Workspace Header */}
        <div className="flex justify-between items-center border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-primary shrink-0" />
            <div>
              <h3 className="font-extrabold text-sm text-foreground">Interactive Copilot Console</h3>
              <span className="text-[10px] text-muted block mt-0.5">Prompt model calculations and explainability paths</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoading && (
              <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />
            )}
            <QuickActions 
              onViewTwin={onViewTwin}
              onOpenForecast={onOpenForecast}
              onGenerateReport={onGenerateReport}
              onExport={handleExport}
            />
          </div>
        </div>

        {/* Scrollable messages view */}
        <ConversationView 
          messages={messages}
          suggestedQuestions={suggestedQuestions}
          onClickQuestion={handleSend}
          isLoading={isLoading}
          onNavigate={onNavigate}
          onGenerateReport={onGenerateReport}
        />

        {/* Footer Prompt Input */}
        <div className="border-t border-border pt-4 mt-2">
          <PromptInput 
            onSend={handleSend}
            onClear={handleClearChat}
            isLoading={isLoading}
          />
        </div>

      </div>

      {/* 3. Right Panel: Active Context details (3 columns on desktop) */}
      <div className="order-2 lg:order-3 lg:col-span-3 h-full">
        <ContextPanel 
          selectedWard={selectedWard}
        />
      </div>

    </div>
  );
}
