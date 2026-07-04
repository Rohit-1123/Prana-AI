import { HelpCircle, ExternalLink, ShieldCheck, Mail } from "lucide-react";

export function SupportPanel() {
  
  const links = [
    { label: "Documentation Guides", desc: "Read operational manuals detailing regression models.", action: () => alert("Redirecting to API docs.") },
    { label: "Report Sensor Malfunction", desc: "Open a support ticket with municipal repair teams.", action: () => alert("Support ticket created.") },
    { label: "Privacy Policies", desc: "Enterprise data privacy and compliance safeguards.", action: () => alert("Opening Privacy Agreement.") }
  ];

  return (
    <div className="glass-card p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">Help & Support Resources</h4>
          <span className="text-[10px] text-muted block mt-0.5">Contact smart-city developers or open tickets</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-5">
        {links.map((lnk, idx) => (
          <div
            key={idx}
            onClick={lnk.action}
            className="bg-muted/5 hover:bg-muted/10 border border-border p-3.5 rounded-xl flex justify-between items-center text-xs cursor-pointer group transition-colors"
          >
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <span className="font-bold text-foreground block group-hover:text-primary transition-colors">{lnk.label}</span>
                <span className="text-[9.5px] text-muted block mt-0.5 font-sans leading-relaxed">{lnk.desc}</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted group-hover:text-foreground shrink-0 transition-colors" />
          </div>
        ))}

        <div className="bg-primary/5 border border-primary/10 p-3.5 rounded-xl flex gap-3 items-start mt-2">
          <Mail className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-foreground block">Municipal Developer Helpdesk</span>
            <span className="text-[9.5px] text-muted block mt-0.5">Reach out to operations team at: <strong>support@prana.ai</strong></span>
          </div>
        </div>
      </div>

    </div>
  );
}
