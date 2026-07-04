import { useState } from "react";
import { SettingsSidebar, type SettingsSection } from "./SettingsSidebar";
import { AppearancePanel } from "./AppearancePanel";
import { UnitsPanel } from "./UnitsPanel";
import { TimezonePanel } from "./TimezonePanel";
import { AboutPanel } from "./AboutPanel";
import { SupportPanel } from "./SupportPanel";

export function SettingsLayout() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("appearance");

  const renderSection = () => {
    switch (activeSection) {
      case "appearance":
        return <AppearancePanel />;
      case "units":
        return <UnitsPanel />;
      case "timezone":
        return <TimezonePanel />;
      case "about":
        return <AboutPanel />;
      case "support":
        return <SupportPanel />;
      default:
        return <AppearancePanel />;
    }
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-foreground">Control Panel Settings</h2>
        <span className="text-xs text-muted block mt-1">Configure layout appearances, measurement units, timezone scope, and about parameters</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Options sidebar: 3 columns */}
        <div className="lg:col-span-3">
          <SettingsSidebar 
            activeSection={activeSection}
            onSelectSection={setActiveSection}
          />
        </div>

        {/* Right configuration views: 9 columns */}
        <div className="lg:col-span-9">
          {renderSection()}
        </div>

      </div>

    </div>
  );
}
