
// @ts-nocheck
import SettingsContent from './_components/settings-content';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your profile and application preferences
        </p>
      </div>
      
      <SettingsContent />
    </div>
  );
}
