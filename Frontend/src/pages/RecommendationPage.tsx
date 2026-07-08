import { useQuery } from '@tanstack/react-query';
import mermaid from 'mermaid';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  Info,
  Layers,
  XCircle,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Badge,
  Button,
  Card,
  LoadingCard,
  ProgressBar,
  ScoreRing,
  SectionHeader,
  Timeline,
} from '../components/ui';
import { getRecommendation, reportUrl } from '../services/api';
import type { Recommendation, StackItem } from '../types/api';

mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'loose' });

// ─── Helpers ───────────────────────────────────────────────────────────────
function confidenceBadge(score: number) {
  if (score >= 85) return <Badge variant="success">{score}% confidence</Badge>;
  if (score >= 65) return <Badge variant="warning">{score}% confidence</Badge>;
  return <Badge variant="danger">{score}% confidence</Badge>;
}

function scoreColor(v: number) {
  if (v >= 80) return 'hsl(var(--success))';
  if (v >= 60) return 'hsl(var(--warning))';
  return 'hsl(var(--danger))';
}

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'hsl(var(--primary))',
  Backend:  'hsl(var(--accent))',
  Database: 'hsl(var(--success))',
  Cloud:    'hsl(199 89% 62%)',
  DevOps:   'hsl(260 60% 65%)',
  Security: 'hsl(var(--danger))',
  Cache:    'hsl(38 92% 55%)',
};

// ─── Sub-components ────────────────────────────────────────────────────────
function StackCard({ item }: { item: StackItem }) {
  const color = CATEGORY_COLORS[item.role] ?? 'hsl(var(--primary))';
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm card-interactive">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">{item.name}</span>
            <Badge variant="outline">{item.role}</Badge>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">{item.explanation}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-lg font-black" style={{ color }}>{item.confidence}%</div>
          <div className="text-xs text-foreground/40">score</div>
        </div>
      </div>
      <ProgressBar value={item.confidence} color={color} showValue={false} />
      {item.official_url && (
        <a
          href={item.official_url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          Official docs <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}

function CompatibilityGrid({
  matrix,
}: {
  matrix: Array<{ source: string; target: string; status: string; score: number; reason: string }>;
}) {
  return (
    <div className="max-h-96 overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-foreground/50">
            <th className="pb-2 text-left font-semibold">Source</th>
            <th className="pb-2 text-left font-semibold">Target</th>
            <th className="pb-2 text-left font-semibold">Status</th>
            <th className="pb-2 text-right font-semibold">Score</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={`${row.source}-${row.target}-${i}`} className="border-b border-border/50">
              <td className="py-2 font-medium">{row.source}</td>
              <td className="py-2 text-foreground/70">{row.target}</td>
              <td className="py-2">
                {row.status === 'compatible' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold status-compatible rounded-full border px-2 py-0.5">
                    <CheckCircle2 size={10} /> compatible
                  </span>
                ) : row.status === 'warning' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold status-warning rounded-full border px-2 py-0.5">
                    <AlertTriangle size={10} /> warning
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold status-incompatible rounded-full border px-2 py-0.5">
                    <XCircle size={10} /> incompatible
                  </span>
                )}
              </td>
              <td className="py-2 text-right font-mono text-xs">{row.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MigrationReport({
  analysis,
}: {
  analysis: Record<string, string | string[]>;
}) {
  const sections: { key: string; icon: React.ReactNode; label: string; color: string }[] = [
    { key: 'keep',    icon: <CheckCircle2 size={14} />, label: 'Keep',    color: 'hsl(var(--success))' },
    { key: 'replace', icon: <AlertTriangle size={14} />,label: 'Replace', color: 'hsl(var(--warning))' },
    { key: 'remove',  icon: <XCircle size={14} />,      label: 'Remove',  color: 'hsl(var(--danger))'  },
    { key: 'add',     icon: <ArrowRight size={14} />,   label: 'Add',     color: 'hsl(var(--primary))' },
  ];

  const meta: { key: string; label: string }[] = [
    { key: 'migration_difficulty', label: 'Difficulty'   },
    { key: 'migration_cost',       label: 'Cost'         },
    { key: 'migration_time',       label: 'Time'         },
    { key: 'migration_risk',       label: 'Risk'         },
  ];

  const hasContent = Object.keys(analysis).length > 0 &&
    sections.some(s => {
      const v = analysis[s.key];
      return Array.isArray(v) ? v.length > 0 : Boolean(v);
    });

  if (!hasContent) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-4 text-sm text-foreground/60">
        <Info size={16} className="shrink-0" />
        This is a new project — no existing project migration analysis was generated.
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {/* Keep / Replace / Remove / Add */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {sections.map(({ key, icon, label, color }) => {
          const raw = analysis[key];
          const items: string[] = Array.isArray(raw)
            ? raw
            : typeof raw === 'string' && raw
              ? [raw]
              : [];
          return (
            <div
              key={key}
              className="rounded-xl border p-4"
              style={{ borderColor: `${color}30`, background: `${color}08` }}
            >
              <div className="mb-2 flex items-center gap-2 font-semibold text-sm" style={{ color }}>
                {icon} {label}
              </div>
              {items.length ? (
                <ul className="grid gap-1">
                  {items.map(item => (
                    <li key={item} className="text-xs text-foreground/70 flex items-start gap-1.5">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-foreground/40">None identified</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Migration metadata pills */}
      <div className="flex flex-wrap gap-2">
        {meta.map(({ key, label }) => {
          const value = analysis[key];
          if (!value) return null;
          return (
            <div key={key} className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
              <span className="font-semibold text-foreground/50">{label}: </span>
              <span className="font-bold">{value as string}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export function RecommendationPage() {
  const { projectId = '' } = useParams();
  const { data, isLoading } = useQuery<Recommendation>({
    queryKey: ['recommendation', projectId],
    queryFn: () => getRecommendation(projectId),
    enabled: Boolean(projectId),
  });
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.architecture?.mermaid && diagramRef.current) {
      mermaid
        .render(`sw-diagram-${projectId}`, data.architecture.mermaid)
        .then(({ svg }) => {
          if (diagramRef.current) diagramRef.current.innerHTML = svg;
        })
        .catch(() => {
          if (diagramRef.current) {
            diagramRef.current.textContent = data.architecture.mermaid;
          }
        });
    }
  }, [data, projectId]);

  if (isLoading || !data) {
    return (
      <div className="grid gap-5">
        <div className="skeleton h-10 w-64 rounded-xl" />
        <div className="grid gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingCard key={i} rows={2} />
          ))}
        </div>
        <LoadingCard rows={6} />
      </div>
    );
  }

  const scoreData = Object.entries(data.scores).map(([name, value]) => ({
    name: name.replaceAll('_', ' '),
    value,
  }));
  const costData = Object.entries(data.cost_estimate.breakdown).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="grid gap-6 animate-fade-in">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Recommendation Dashboard</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-foreground/65">{data.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={reportUrl(projectId)} target="_blank" rel="noreferrer">
            <Button className="gap-2">
              <FileText size={16} /> Export Report
            </Button>
          </a>
        </div>
      </div>

      {/* ── Score rings ─────────────────────────────────────────────── */}
      <Card>
        <SectionHeader title="Overall Scores" description="Weighted across the full recommended stack" />
        <div className="mt-4 flex flex-wrap items-start justify-around gap-6">
          <ScoreRing
            value={data.confidence}
            size={90}
            label="Confidence"
            color="hsl(var(--primary))"
          />
          {Object.entries(data.scores).map(([key, value]) => (
            <ScoreRing
              key={key}
              value={value as number}
              size={80}
              label={key.replaceAll('_', ' ')}
              color={scoreColor(value as number)}
            />
          ))}
        </div>
      </Card>

      {/* ── Recommended stack + score chart ─────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <SectionHeader title="Recommended Stack" description="Best-scored technology per category" />
          <div className="mt-4 grid gap-3">
            {data.recommended_stack.map(item => (
              <StackCard key={item.name} item={item} />
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card>
            <SectionHeader title="Score Profile" />
            <div className="mt-3 h-60">
              <ResponsiveContainer>
                <BarChart data={scoreData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 11 }}
                    tickFormatter={v => v.replace(' score', '')}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, 'Score']}
                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Development Timeline" />
            <div className="mt-4">
              {data.development_timeline?.length ? (
                <Timeline phases={data.development_timeline} />
              ) : (
                <p className="text-sm text-foreground/50">No timeline data.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Architecture diagram + Cost breakdown ───────────────────── */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="mb-3 flex items-start justify-between gap-3">
            <SectionHeader
              title="Architecture Diagram"
              description={`${data.architecture.pattern}: ${data.architecture.reason}`}
            />
            <Badge variant="primary">{data.architecture.pattern}</Badge>
          </div>
          <div
            ref={diagramRef}
            className="overflow-auto rounded-lg border border-border bg-white p-3 text-black dark:bg-white"
          />
        </Card>

        <Card>
          <SectionHeader title="Cost Breakdown" description="Monthly infrastructure estimate" />
          <div className="mt-3 h-52">
            <ResponsiveContainer>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v: number) => [`$${v}`, 'Cost/mo']}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="value" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            {([
              { label: 'Monthly',     value: `$${data.cost_estimate.monthly_total}`,     icon: <DollarSign size={14} /> },
              { label: 'Annual',      value: `$${data.cost_estimate.annual_total}`,      icon: <DollarSign size={14} /> },
              { label: 'Development', value: `$${data.cost_estimate.development_total}`, icon: <Clock size={14} /> },
            ] as const).map(({ label, value, icon }) => (
              <div key={label} className="rounded-lg border border-border bg-muted/40 p-3">
                <div className="flex justify-center text-foreground/50 mb-1">{icon}</div>
                <p className="text-xs text-foreground/50">{label}</p>
                <p className="mt-0.5 text-base font-bold">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Compatibility matrix + Feature recommendations ───────────── */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionHeader
            title="Compatibility Matrix"
            description="Technology pair compatibility in the recommended stack"
          />
          <div className="mt-4">
            <CompatibilityGrid matrix={data.compatibility_matrix} />
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="Feature Recommendations"
            description="Inferred supporting features based on selected capabilities"
          />
          <div className="mt-4 grid gap-3">
            {data.feature_recommendations.length === 0 ? (
              <p className="text-sm text-foreground/50">No feature recommendations generated.</p>
            ) : (
              data.feature_recommendations.map(item => (
                <div
                  key={item.feature}
                  className="rounded-xl border border-border bg-card p-3 card-interactive"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span className="font-semibold text-sm">{item.feature}</span>
                    <Badge
                      variant={
                        item.priority === 'High' || item.priority === 'Critical'
                          ? 'danger'
                          : item.priority === 'Medium'
                            ? 'warning'
                            : 'outline'
                      }
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-xs text-foreground/60">{item.reason}</p>
                  {item.business_impact && (
                    <p className="mt-1 text-xs font-medium text-primary">{item.business_impact}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* ── Migration report ────────────────────────────────────────── */}
      <Card>
        <div className="mb-4">
          <SectionHeader
            title="Existing Project Analysis"
            description="Migration strategy: what to keep, replace, remove, and add"
          />
        </div>
        <MigrationReport analysis={data.existing_project_analysis} />
      </Card>

      {/* ── Alternative stack ────────────────────────────────────────── */}
      <Card>
        <SectionHeader
          title="Alternative Technologies"
          description="Runner-up choices — viable depending on team preference"
        />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {data.alternative_stack.map(item => (
            <Link
              to="/technologies"
              key={`${item.name}-${item.role}`}
              className="group rounded-xl border border-border bg-card p-3 transition-all duration-150 hover:border-primary/30 hover:bg-muted hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-foreground/55">{item.role}</p>
                </div>
                {confidenceBadge(item.confidence)}
              </div>
              <p className="mt-2 text-xs text-foreground/60 line-clamp-2">{item.explanation}</p>
              <div className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                View in KB <ExternalLink size={10} />
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
