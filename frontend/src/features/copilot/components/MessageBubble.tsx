import { Activity, User } from "lucide-react";
import { ResponseCard, type ResponseTemplate } from "./ResponseCard";
import { cn } from "../../../utils/cn";

export interface ChatMessage {
  sender: "user" | "agent";
  text: string;
  card?: ResponseTemplate;
  routes?: { name: string; aqi: number; reason: string }[];
  structuredData?: {
    primaryCause: string;
    secondaryCause: string;
    weatherInfluence: string;
    forecast: string;
    recommendations: string[];
    confidence: number;
    evidence: string[];
  };
}

interface MessageBubbleProps {
  msg: ChatMessage;
}

export function MessageBubble({ msg }: MessageBubbleProps) {
  const isUser = msg.sender === "user";

  return (
    <div className={cn(
      "flex gap-3 max-w-[85%] animate-in fade-in duration-200",
      isUser ? "self-end flex-row-reverse" : "self-start"
    )}>
      
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
        isUser 
          ? "bg-primary/10 border-primary/20 text-primary" 
          : "bg-gradient-to-tr from-primary to-accent border-transparent text-white"
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Activity className="w-4.5 h-4.5" />}
      </div>

      <div className="flex flex-col gap-2.5">
        {/* Message body */}
        <div className={cn(
          "p-3.5 rounded-2xl text-xs leading-relaxed font-sans shadow-theme border",
          isUser 
            ? "bg-primary text-white border-transparent font-semibold rounded-tr-none" 
            : "bg-card text-foreground border-border rounded-tl-none"
        )}>
          {msg.text}
        </div>

        {/* Structured Explainability Card */}
        {msg.structuredData && (
          <div className="bg-card border border-border p-4 rounded-2xl flex flex-col gap-3 shadow-theme max-w-sm text-left text-foreground">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-[9px] font-black uppercase tracking-wider text-primary">AI Causal Attribution</span>
              <span className="text-[8.5px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded font-extrabold">
                Confidence: {msg.structuredData.confidence}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-[11px] mt-1">
              <div>
                <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">Primary Cause</span>
                <span className="font-bold text-foreground mt-0.5 block">{msg.structuredData.primaryCause}</span>
              </div>
              <div>
                <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">Secondary Cause</span>
                <span className="font-bold text-foreground mt-0.5 block">{msg.structuredData.secondaryCause}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">Weather Impact</span>
                <span className="font-semibold text-foreground mt-0.5 block">{msg.structuredData.weatherInfluence}</span>
              </div>
            </div>

            <div className="bg-muted/5 border border-border p-2.5 rounded-xl text-[10.5px]">
              <span className="text-[8.5px] uppercase tracking-wider font-extrabold text-primary block">AI Forecast Horizon</span>
              <p className="font-semibold text-foreground mt-1 leading-normal">{msg.structuredData.forecast}</p>
            </div>

            <div className="flex flex-col gap-1.5 mt-0.5">
              <span className="text-[8px] uppercase tracking-wider font-black text-muted block">Advisory Interventions</span>
              {msg.structuredData.recommendations.map((r, i) => (
                <div key={i} className="flex gap-2 items-center text-[10px] bg-success/5 border border-success/20 text-success p-2 rounded-lg font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-1 pt-2.5 border-t border-border">
              {msg.structuredData.evidence.map((ev, idx) => (
                <span key={idx} className="text-[8px] font-extrabold bg-muted/10 border border-border/80 px-2 py-0.5 rounded text-muted">
                  {ev}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Modular Template Response Card */}
        {msg.card && (
          <ResponseCard card={msg.card} />
        )}

        {/* Dynamic Route recommendations */}
        {msg.routes && msg.routes.length > 0 && (
          <div className="flex flex-col gap-2 bg-muted/5 border border-border p-3.5 rounded-2xl">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-primary">Recommended green pathways:</span>
            <div className="flex flex-col gap-2 mt-1">
              {msg.routes.map((r, idx) => (
                <div key={idx} className="bg-card border border-border p-2.5 rounded-xl flex justify-between items-center text-[10px]">
                  <div>
                    <span className="font-bold text-foreground block">{r.name}</span>
                    <span className="text-[8px] text-muted block mt-0.5">{r.reason}</span>
                  </div>
                  <span className="font-extrabold text-success whitespace-nowrap">AQI {r.aqi}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
