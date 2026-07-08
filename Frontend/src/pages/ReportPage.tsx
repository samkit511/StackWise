import { FileText, Maximize2 } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { Button, SecondaryButton } from '../components/ui';
import { reportUrl } from '../services/api';

export function ReportPage() {
  const { projectId = '' } = useParams();
  const url = reportUrl(projectId);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Architecture Report</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Full printable recommendation report for project #{projectId}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/recommendations/${projectId}`}>
            <SecondaryButton className="gap-2">← Back to Dashboard</SecondaryButton>
          </Link>
          <a href={url} target="_blank" rel="noreferrer">
            <Button className="gap-2">
              <Maximize2 size={15} /> Open in new tab
            </Button>
          </a>
        </div>
      </div>

      <iframe
        title="StackWise architecture report"
        className="h-[80vh] w-full rounded-xl border border-border bg-white shadow-sm"
        src={url}
      />

      <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 py-3 text-sm text-foreground/60">
        <FileText size={14} />
        Use your browser's <strong className="text-foreground">Print</strong> function (Ctrl+P) to
        save as PDF.
      </div>
    </div>
  );
}
