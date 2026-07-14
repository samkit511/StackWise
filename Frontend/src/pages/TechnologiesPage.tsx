import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Database,
  ExternalLink,
  Globe,
  Layers,
  Search,
  Server,
  Shield,
  Zap,
} from 'lucide-react';
import { Badge, Card, Chip, Field, Input } from '../components/ui';
import { getTechnologies } from '../services/api';

const CATEGORIES = [
  { label: 'All',       value: '',        icon: <Layers   size={14} /> },
  { label: 'Frontend',  value: 'Frontend',icon: <Globe    size={14} /> },
  { label: 'Backend',   value: 'Backend', icon: <Server   size={14} /> },
  { label: 'Database',  value: 'Database',icon: <Database size={14} /> },
  { label: 'Cloud',     value: 'Cloud',   icon: <Globe    size={14} /> },
  { label: 'DevOps',    value: 'DevOps',  icon: <Zap      size={14} /> },
  { label: 'Security',  value: 'Security',icon: <Shield   size={14} /> },
];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'hsl(var(--primary))',
  Backend:  'hsl(var(--accent))',
  Database: 'hsl(var(--success))',
  Cloud:    'hsl(199 89% 62%)',
  DevOps:   'hsl(260 60% 65%)',
  Security: 'hsl(var(--danger))',
};

const PERF_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  High:   'success',
  Medium: 'warning',
  Low:    'danger',
};

const COST_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  Low:    'success',
  Medium: 'warning',
  High:   'danger',
};

function TechCard({ tech }: { tech: any }) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[tech.category] ?? 'hsl(var(--primary))';
  const pros: string[] = Array.isArray(tech.pros) ? tech.pros : [];
  const cons: string[] = Array.isArray(tech.cons) ? tech.cons : [];
  const useCases: string[] = Array.isArray(tech.use_cases) ? tech.use_cases : [];

  return (
    <Card className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white text-xs font-extrabold"
            style={{ background: color }}
          >
            {tech.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold leading-tight">{tech.name}</p>
            {tech.language && (
              <p className="text-xs text-foreground/50">{tech.language}</p>
            )}
          </div>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 text-[10px]"
          style={{ color, borderColor: `${color}50` }}
        >
          {tech.category}
        </Badge>
      </div>

      {/* Pills row */}
      <div className="flex flex-wrap gap-1.5">
        {tech.performance && (
          <Badge variant={PERF_VARIANT[tech.performance] ?? 'outline'}>
          <Badge variant="outline">Performance: {tech.performance}</Badge>
          </Badge>
        )}
        {tech.cost && (
          <Badge variant={COST_VARIANT[tech.cost] ?? 'outline'}>
          <Badge variant="outline">Cost: {tech.cost}</Badge>
          </Badge>
        )}
        {tech.learning_curve && (
          <Badge variant="outline">Learning: {tech.learning_curve}</Badge>
        )}
        {tech.community && (
          <Badge variant="outline">Community: {tech.community}</Badge>
        )}
        {tech.supports_ai && (
          <Badge variant="primary">
            <Brain size={10} /> AI
          </Badge>
        )}
        {tech.supports_realtime && (
          <Badge variant="primary">
            <Zap size={10} /> Realtime
          </Badge>
        )}
      </div>

      {/* Use cases preview */}
      {useCases.length > 0 && (
        <p className="text-xs text-foreground/60 line-clamp-2">
          Best for: {useCases.join(', ')}
        </p>
      )}

      {/* Expandable pros/cons */}
      {(pros.length > 0 || cons.length > 0) && (
        <div>
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            className="flex w-full items-center justify-between rounded-md border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
          >
            Pros & Cons
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {expanded && (
            <div className="mt-2 grid gap-2">
              {pros.length > 0 && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-2.5 dark:border-green-900 dark:bg-green-950/40">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-green-700 dark:text-green-400">
                    Pros
                  </p>
                  <ul className="grid gap-1">
                    {pros.map((p: string) => (
                      <li key={p} className="flex items-start gap-1.5 text-xs text-green-800 dark:text-green-300">
                        <span className="mt-0.5 text-green-500">+</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {cons.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 dark:border-red-900 dark:bg-red-950/40">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-red-700 dark:text-red-400">
                    Cons
                  </p>
                  <ul className="grid gap-1">
                    {cons.map((c: string) => (
                      <li key={c} className="flex items-start gap-1.5 text-xs text-red-800 dark:text-red-300">
                        <span className="mt-0.5 text-red-500">-</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Official docs link */}
      {tech.official_url && (
        <a
          href={tech.official_url}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          Official docs <ExternalLink size={11} />
        </a>
      )}
    </Card>
  );
}

export function TechnologiesPage() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');

  const { data = [], isLoading } = useQuery({
    queryKey: ['technologies', search, category],
    queryFn:  () => getTechnologies(search, category),
  });

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Technology Knowledge Base</h1>
        <p className="mt-1 text-sm text-foreground/60">
          {data.length} technologies Â· Browse, search, and compare the stack options used in
          recommendations.
        </p>
      </div>

      {/* Search + Category filter */}
      <div className="grid gap-4">
        <Field label="Search technologies">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
            />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="e.g. FastAPI, PostgreSQL, React"
              className="pl-9"
            />
          </div>
        </Field>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <Chip
              key={cat.value}
              active={category === cat.value}
              onClick={() => setCategory(cat.value)}
            >
              {cat.icon}
              {cat.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-border bg-card p-5">
              <div className="skeleton h-9 w-9 rounded-lg" />
              <div className="skeleton h-5 w-32 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && data.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-foreground/50">
          <Search size={32} className="opacity-30" />
          <p className="font-semibold">No technologies match your filters.</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setCategory(''); }}
            className="text-sm text-primary underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {!isLoading && data.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(data as any[]).map(tech => (
            <TechCard key={tech.id} tech={tech} />
          ))}
        </div>
      )}
    </div>
  );
}

