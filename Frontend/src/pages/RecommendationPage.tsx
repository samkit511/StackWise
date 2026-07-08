import { useQuery } from '@tanstack/react-query';
import mermaid from 'mermaid';
import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button, Card } from '../components/ui';
import { getRecommendation, reportUrl } from '../services/api';

mermaid.initialize({ startOnLoad: false, theme: 'neutral' });

export function RecommendationPage() {
  const { projectId = '' } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['recommendation', projectId], queryFn: () => getRecommendation(projectId), enabled: Boolean(projectId) });
  const diagramRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (data && diagramRef.current) {
      mermaid.render('stackwise-diagram', data.architecture.mermaid).then(({ svg }) => {
        if (diagramRef.current) diagramRef.current.innerHTML = svg;
      });
    }
  }, [data]);
  if (isLoading || !data) return <Card>Loading recommendation...</Card>;
  const scoreData = Object.entries(data.scores).map(([name, value]) => ({ name: name.replaceAll('_', ' '), value }));
  const costData = Object.entries(data.cost_estimate.breakdown).map(([name, value]) => ({ name, value }));
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Recommendation Dashboard</h1><p className="max-w-4xl text-foreground/70">{data.summary}</p></div>
        <a href={reportUrl(projectId)} target="_blank" rel="noreferrer"><Button>Export Report</Button></a>
      </div>
      <section className="grid gap-4 md:grid-cols-5">
        <Card><p className="text-sm text-foreground/60">Confidence</p><p className="text-3xl font-bold">{data.confidence}%</p></Card>
        {Object.entries(data.scores).map(([key, value]) => <Card key={key}><p className="text-sm capitalize text-foreground/60">{key.replaceAll('_', ' ')}</p><p className="text-3xl font-bold">{value}%</p></Card>)}
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card><h2 className="font-semibold">Recommended Stack</h2><div className="mt-4 grid gap-3">{data.recommended_stack.map(item => <div key={item.name} className="rounded-md border border-border p-3"><div className="flex justify-between gap-3"><strong>{item.role}: {item.name}</strong><span>{item.confidence}%</span></div><p className="mt-1 text-sm text-foreground/65">{item.explanation}</p></div>)}</div></Card>
        <Card><h2 className="font-semibold">Score Profile</h2><div className="h-72"><ResponsiveContainer><BarChart data={scoreData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="hsl(var(--primary))" /></BarChart></ResponsiveContainer></div></Card>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card><h2 className="font-semibold">Architecture Diagram</h2><p className="mb-3 text-sm text-foreground/65">{data.architecture.pattern}: {data.architecture.reason}</p><div ref={diagramRef} className="overflow-auto rounded-md bg-white p-3 text-black" /></Card>
        <Card><h2 className="font-semibold">Cost Breakdown</h2><div className="h-72"><ResponsiveContainer><BarChart data={costData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="hsl(var(--accent))" /></BarChart></ResponsiveContainer></div><p className="mt-2 font-semibold">Monthly ${data.cost_estimate.monthly_total} | Annual ${data.cost_estimate.annual_total} | Development ${data.cost_estimate.development_total}</p></Card>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card><h2 className="font-semibold">Compatibility Matrix</h2><div className="mt-3 max-h-96 overflow-auto"><table className="w-full text-sm"><tbody>{data.compatibility_matrix.map((row, index) => <tr key={`${row.source}-${row.target}-${index}`} className="border-b border-border"><td className="py-2">{row.source}</td><td>{row.target}</td><td className="capitalize">{row.status}</td><td>{row.score}</td></tr>)}</tbody></table></div></Card>
        <Card><h2 className="font-semibold">Feature Recommendations</h2><div className="mt-3 grid gap-3">{data.feature_recommendations.map(item => <div key={item.feature} className="rounded-md border border-border p-3"><strong>{item.feature} · {item.priority}</strong><p className="text-sm text-foreground/65">{item.reason}</p></div>)}</div></Card>
      </section>
      <Card><h2 className="font-semibold">Existing Project Migration Report</h2><pre className="mt-3 overflow-auto rounded-md bg-muted p-3 text-sm">{JSON.stringify(data.existing_project_analysis, null, 2)}</pre></Card>
      <Card><h2 className="font-semibold">Alternative Technologies</h2><div className="mt-3 grid gap-3 md:grid-cols-3">{data.alternative_stack.map(item => <Link to="/technologies" key={item.name} className="rounded-md border border-border p-3 hover:bg-muted"><strong>{item.name}</strong><p className="text-sm text-foreground/65">{item.role} · {item.confidence}%</p></Link>)}</div></Card>
    </div>
  );
}
