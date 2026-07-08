import { ArrowRight, BarChart3, GitCompare, Layers3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';

export function HomePage() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-5 rounded-lg border border-border bg-card p-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-normal">StackWise</h1>
          <p className="mt-3 max-w-3xl text-lg text-foreground/75">Helping founders choose the right software architecture before writing the first line of code.</p>
          <Link to="/questionnaire" className="mt-5 inline-flex"><Button>Start Recommendation <ArrowRight className="ml-2" size={18} /></Button></Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Architecture Score', '94%'],
            ['Stack Confidence', '91%'],
            ['Monthly Infra', '$350'],
            ['Build Timeline', '9 weeks']
          ].map(([label, value]) => <Card key={label}><p className="text-sm text-foreground/60">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></Card>)}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[['Rule-based recommendations', Layers3], ['Compatibility matrix', GitCompare], ['Cost and timeline estimates', BarChart3]].map(([title, Icon]) => {
          const RealIcon = Icon as typeof Layers3;
          return <Card key={title as string}><RealIcon className="text-primary" /><h2 className="mt-3 font-semibold">{title as string}</h2><p className="mt-2 text-sm text-foreground/65">Generated from structured technology knowledge, scoring rules, and project inputs.</p></Card>;
        })}
      </section>
    </div>
  );
}
