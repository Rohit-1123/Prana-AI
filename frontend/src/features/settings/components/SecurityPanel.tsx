import { useState } from "react";
import { Shield, Check, Monitor, MapPin } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

export function SecurityPanel() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 2000);
  };

  const sessions = [
    { device: "MacBook Pro (Chrome)", loc: "Hyderabad, India", ip: "182.74.88.102", active: true },
    { device: "iPhone 15 Pro Max (Safari)", loc: "Hyderabad, India", ip: "182.74.88.105", active: false }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Reset password form */}
      <form onSubmit={handlePasswordReset} className="glass-card p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm">Security & Access Credentials</h4>
            <span className="text-[10px] text-muted block mt-0.5">Edit credentials password keys</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border pt-4">
          <Input
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="••••••••"
            id="sec-old-pass"
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            id="sec-new-pass"
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            id="sec-confirm-pass"
          />
        </div>

        <div className="border-t border-border pt-4 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            className="py-2 px-6 font-bold text-xs"
          >
            {isSaved ? (
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-white" /> Password Updated</span>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </form>

      {/* Active browser sessions list */}
      <div className="glass-card p-6 flex flex-col gap-4">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted block">Active User Sessions</span>
          <span className="text-[9px] text-muted block mt-0.5">Audit log listing active device accesses</span>
        </div>

        <div className="flex flex-col gap-3.5 border-t border-border pt-4">
          {sessions.map((sess, idx) => (
            <div key={idx} className="bg-muted/5 border border-border p-3.5 rounded-xl flex justify-between items-center text-xs">
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="font-bold text-foreground block">{sess.device}</span>
                  <span className="text-[9px] text-muted block mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {sess.loc} | IP: {sess.ip}
                  </span>
                </div>
              </div>

              {sess.active ? (
                <span className="text-[8.5px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border border-success/20 text-success bg-success/5 shrink-0">
                  Current Session
                </span>
              ) : (
                <button
                  onClick={() => alert("Session terminated.")}
                  className="text-[9.5px] font-bold text-danger hover:underline cursor-pointer"
                >
                  Revoke Access
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
