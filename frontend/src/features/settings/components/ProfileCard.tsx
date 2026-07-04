import { useState } from "react";
import { User, Check } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

interface ProfileCardProps {
  email: string;
}

export function ProfileCard({ email }: ProfileCardProps) {
  const [name, setName] = useState("Rohit Reddy");
  const [org, setOrg] = useState("Hyderabad Municipal Authority");
  const [loc, setLoc] = useState("Hyderabad, India");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="glass-card p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">Enterprise Profile Settings</h4>
          <span className="text-[10px] text-muted block mt-0.5">Edit credentials and smart-city agency bounds</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter full name"
          id="profile-name"
        />

        <Input
          label="Email Credentials"
          value={email}
          disabled
          placeholder="Enter email"
          id="profile-email"
        />

        <Input
          label="Sponsor Organization"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          placeholder="Agency name"
          id="profile-org"
        />

        <Input
          label="Location Scope"
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          placeholder="Focus City"
          id="profile-loc"
        />
      </div>

      <div className="border-t border-border pt-4 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          className="py-2 px-6 font-bold text-xs"
        >
          {isSaved ? (
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-white" /> Profile Saved</span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

    </form>
  );
}
