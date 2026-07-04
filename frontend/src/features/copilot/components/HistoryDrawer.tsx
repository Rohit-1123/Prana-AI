import { useState } from "react";
import { MessageSquare, Search, Trash2, Pin, Plus } from "lucide-react";
import { cn } from "../../../utils/cn";

export interface ConversationSession {
  id: string;
  title: string;
  timestamp: string;
  isPinned?: boolean;
}

interface HistoryDrawerProps {
  sessions: ConversationSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
}

export function HistoryDrawer({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession
}: HistoryDrawerProps) {
  const [search, setSearch] = useState("");

  const filtered = sessions.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-card p-4 flex flex-col gap-4 h-full overflow-y-auto animate-in fade-in duration-200">
      
      {/* Header button */}
      <button
        onClick={onNewSession}
        className="w-full btn-primary py-2 text-xs flex items-center justify-center gap-1.5 font-bold cursor-pointer"
      >
        <Plus className="w-4 h-4 text-white" />
        <span>New Conversation</span>
      </button>

      {/* Search History */}
      <div className="relative bg-muted/5 border border-border rounded-xl flex items-center px-3 py-1.5 shadow-theme mt-1">
        <Search className="w-3.5 h-3.5 text-muted mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search History..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-xs text-foreground placeholder-muted w-full focus:ring-0"
        />
      </div>

      {/* Sessions list */}
      <div className="flex flex-col gap-1.5 overflow-y-auto flex-grow pr-1 border-t border-border/80 pt-3">
        {filtered.length > 0 ? (
          filtered.map((s) => {
            const isActive = s.id === activeSessionId;
            return (
              <div
                key={s.id}
                onClick={() => onSelectSession(s.id)}
                className={cn(
                  "flex items-center justify-between p-2 rounded-xl text-xs font-semibold group cursor-pointer transition-colors w-full",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted hover:text-foreground hover:bg-muted/5"
                )}
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <MessageSquare className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-muted")} />
                  <span className="truncate block font-bold">{s.title}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {s.isPinned && <Pin className="w-3 h-3 text-primary shrink-0" />}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(s.id);
                    }}
                    title="Delete Conversation"
                    className="p-1 rounded text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <span className="text-[10px] text-muted italic block text-center py-4">No conversations found</span>
        )}
      </div>

    </div>
  );
}
