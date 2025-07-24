
// @ts-nocheck
import NewAuditWorkflow from './_components/new-audit-workflow';

export default function NewAuditPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Create New Audit
        </h1>
        <p className="text-muted-foreground">
          Set up a new ISO 9001 audit with company details and scope configuration
        </p>
      </div>
      
      <NewAuditWorkflow />
    </div>
  );
}
