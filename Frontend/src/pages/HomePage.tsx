import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  GitCompare,
  Layers3,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, StatCard } from '../components/ui';

const STATS = [
  { label: 'Technologies in KB',   value: '32+',   color: 'hsl(var(--primary))',  icon: <Layers3   size={18} color="hsl(var(--primary))"  /> },
  { label: 'Recommendation Rules', value: '40+',   color: 'hsl(var(--accent))',   icon: <Sparkles  size={18} color="hsl(var(--accent))"   /> },
  { label: 'Architecture Patterns',value: '8',     color: 'hsl(var(--success))',  icon: <GitCompare size={18} color="hsl(var(--success))" /> },
  { label: 'Avg. Confidence Score', value: '91%',  color: 'hsl(var(--warning))',  icon: <TrendingUp size={18} color="hsl(var(--warning))" /> },
];

const FEATURES = [
  {
    icon: <Layers3 size={22} />,
    title: 'Rule-based Recommendations',
    description:
      'Every technology is scored through structured weighted rules grounded in real-world constraints — not guesswork.',
    color: 'hsl(var(--primary))',
  },
  {
    icon: <GitCompare size={22} />,
    title: 'Compatibility Matrix',
    description:
      'Detect conflicts before they cost you. Every stack is validated for known incompatibilities and warnings.',
    color: 'hsl(var(--accent))',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Cost & Timeline Estimator',
    description:
      'Get monthly and annual infrastructure estimates alongside a phased development timeline.',
    color: 'hsl(var(--success))',
  },
  {
    icon: <Shield size={22} />,
    title: 'Security by Default',
    description:
      'Security tooling and authentication components are recommended based on compliance and product scope.',
    color: 'hsl(var(--danger))',
  },
  {
    icon: <Sparkles size={22} />,
    title: 'Feature Inference Engine',
    description:
      'Select payments and get invoices, refunds, and tax handling inferred. Select auth and get 2FA, RBAC, and sessions.',
    color: 'hsl(var(--primary-glow))',
  },
  {
    icon: <Zap size={22} />,
    title: 'Existing Project Analysis',
    description:
      'Paste in your current stack, get a structured keep / replace / remove / add migration report with risk assessment.',
    color: 'hsl(var(--warning))',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Describe your project', desc: 'Fill in business context, team size, budget, scale, and requirements across four simple steps.' },
  { step: '02', title: 'Engines score the stack', desc: 'The rule-based engine evaluates 32+ technologies against your inputs, filters incompatible choices, and ranks results.' },
  { step: '03', title: 'Review the dashboard', desc: 'See confidence scores, a compatibility matrix, cost estimates, a Mermaid architecture diagram, and alternatives.' },
  { step: '04', title: 'Export the report', desc: 'Download a printable HTML report with full justification, learning resources, and an official documentation reference.' },
];

export function HomePage() {
  return (
    <div className="grid gap-12">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-gradient relative overflow-hidden rounded-2xl border border-border bg-card px-8 py-14 md:px-12">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative grid gap-10 md:grid-cols-[1.3fr_0.7fr] md:items-center">
          <div className="animate-fade-in-up">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles size={12} />
              Development Stack Recommendation System
            </div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              <span className="gradient-text">StackWise</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-foreground/70">
              Helping founders choose the right software architecture{' '}
              <strong className="text-foreground/90">before writing the first line of code.</strong>
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/questionnaire">
                <Button className="gap-2 px-6 py-2.5 text-base animate-pulse-glow">
                  Start Recommendation <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/technologies">
                <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold transition-all hover:bg-muted">
                  Browse Technologies <GitCompare size={16} />
                </button>
              </Link>
            </div>
            <ul className="mt-7 grid gap-2">
              {['No AI black-box — fully explainable rule-based scoring', 'Covers architecture, cloud, DevOps, security, and cost', 'Plug-and-play Docker setup in one command'].map(point => (
                <li key={point} className="flex items-start gap-2 text-sm text-foreground/70">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" style={{ color: 'hsl(var(--success))' }} />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`animate-fade-in-up stagger-${i + 2} overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm`}
              >
                <div
                  className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: `${s.color}18` }}
                >
                  {s.icon}
                </div>
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="mt-0.5 text-xs text-foreground/55">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section>
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-bold">Everything in one recommendation</h2>
          <p className="mt-2 text-foreground/60">
            From architecture pattern to monthly hosting bill — explained and justified.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Card
              key={f.title}
              className={`animate-fade-in-up stagger-${(i % 6) + 1} relative overflow-hidden`}
              interactive
            >
              <div
                className="absolute right-0 top-0 h-20 w-20 rounded-bl-full opacity-[0.06]"
                style={{ background: f.color }}
              />
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ background: `${f.color}18`, color: f.color }}
              >
                {f.icon}
              </div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/65">{f.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section>
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-bold">How it works</h2>
          <p className="mt-2 text-foreground/60">Four steps from idea to architecture blueprint.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={step.step}
              className={`animate-fade-in-up stagger-${i + 1} relative rounded-xl border border-border bg-card p-6`}
            >
              <span className="text-5xl font-black text-foreground/[0.05]">{step.step}</span>
              <h3 className="mt-1 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-accent/5 p-10 text-center">
        <h2 className="text-3xl font-bold">Ready to choose your stack?</h2>
        <p className="mx-auto mt-3 max-w-lg text-foreground/65">
          Answer four steps about your project and get a fully explained, scored, and compatible technology recommendation in seconds.
        </p>
        <Link to="/questionnaire" className="mt-6 inline-flex">
          <Button className="gap-2 px-8 py-3 text-base">
            Start the Questionnaire <ArrowRight size={18} />
          </Button>
        </Link>
      </section>
    </div>
  );
}
