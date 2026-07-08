import { useParams } from 'react-router-dom';
import { reportUrl } from '../services/api';

export function ReportPage() {
  const { projectId = '' } = useParams();
  return <iframe title="StackWise report" className="h-[80vh] w-full rounded-lg border border-border bg-white" src={reportUrl(projectId)} />;
}
