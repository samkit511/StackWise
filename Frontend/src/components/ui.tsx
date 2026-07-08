import React from 'react';
import { clsx } from 'clsx';
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

// ─── Card ──────────────────────────────────────────────────────────────────
export function Card({
  children,
  className = '',
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <section
      className={clsx(
        'rounded-xl border border-border bg-card p-5 shadow-sm',
        interactive && 'card-interactive cursor-pointer',
        className,
      )}
    >
      {children}
    </section>
  );
}

// ─── SectionHeader ─────────────────────────────────────────────────────────
export function SectionHeader({
  title,
  description,
  gradient = false,
}: {
  title: string;
  description?: string;
  gradient?: boolean;
}) {
  return (
    <div className="mb-1">
      <h2 className={clsx('text-xl font-bold tracking-tight', gradient && 'gradient-text')}>
        {title}
      </h2>
      {description && <p className="mt-1 text-sm text-foreground/60">{description}</p>}
    </div>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'primary' | 'outline';

export function Badge({
  children,
  variant = 'default',
  className = '',
  style,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  style?: React.CSSProperties;
}) {
  const styles: Record<BadgeVariant, string> = {
    default:  'bg-muted text-foreground/70 border-border',
    success:  'status-compatible border',
    warning:  'status-warning border',
    danger:   'status-incompatible border',
    primary:  'bg-primary/10 text-primary border-primary/25 border',
    outline:  'border border-border text-foreground/70 bg-transparent',
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        styles[variant],
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

// ─── Chip ──────────────────────────────────────────────────────────────────
export function Chip({
  children,
  active = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all duration-150',
        active
          ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20'
          : 'border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-primary',
      )}
    >
      {children}
    </button>
  );
}

// ─── ScoreRing ─────────────────────────────────────────────────────────────
export function ScoreRing({
  value,
  size = 80,
  label,
  color,
}: {
  value: number;
  size?: number;
  label?: string;
  color?: string;
}) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const stroke = color ?? 'hsl(var(--primary))';
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 40 40)"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
        />
        <text x="40" y="45" textAnchor="middle" fontSize="16" fontWeight="700" fill="currentColor">
          {value}%
        </text>
      </svg>
      {label && <span className="text-center text-xs font-medium text-foreground/60">{label}</span>}
    </div>
  );
}

// ─── ProgressBar ───────────────────────────────────────────────────────────
export function ProgressBar({
  value,
  max = 100,
  color,
  label,
  showValue = true,
}: {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="grid gap-1">
      {(label || showValue) && (
        <div className="flex justify-between text-xs font-medium text-foreground/65">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="animate-bar-fill h-2 rounded-full"
          style={{
            width: `${pct}%`,
            background: color ?? 'hsl(var(--primary))',
          }}
        />
      </div>
    </div>
  );
}

// ─── StatCard ──────────────────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  icon,
  accentColor,
  className = '',
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  accentColor?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm card-interactive',
        className,
      )}
    >
      {accentColor && (
        <div
          className="absolute left-0 top-0 h-0.5 w-full"
          style={{ background: accentColor }}
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground/55">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight">{value}</p>
        </div>
        {icon && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ background: accentColor ? `${accentColor}20` : 'hsl(var(--muted))' }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Timeline ──────────────────────────────────────────────────────────────
export function Timeline({
  phases,
}: {
  phases: { phase: string; weeks: number; outcome: string }[];
}) {
  const total = phases.reduce((s, p) => s + p.weeks, 0);
  const colors = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))'];
  return (
    <div className="grid gap-4">
      <div className="flex h-7 w-full overflow-hidden rounded-full">
        {phases.map((p, i) => (
          <div
            key={p.phase}
            title={`${p.phase}: ${p.weeks}w`}
            style={{ width: `${(p.weeks / total) * 100}%`, background: colors[i % colors.length] }}
            className="flex items-center justify-center text-[10px] font-bold text-white"
          >
            {p.weeks}w
          </div>
        ))}
      </div>
      <div className="grid gap-3">
        {phases.map((p, i) => (
          <div key={p.phase} className="flex gap-3">
            <div
              className="mt-1 h-3 w-3 shrink-0 rounded-full"
              style={{ background: colors[i % colors.length] }}
            />
            <div>
              <p className="text-sm font-semibold">{p.phase}</p>
              <p className="text-xs text-foreground/60">{p.weeks} weeks · {p.outcome}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LoadingCard ───────────────────────────────────────────────────────────
export function LoadingCard({ rows = 4 }: { rows?: number }) {
  return (
    <div className="grid gap-4 rounded-xl border border-border bg-card p-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-4 rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />
      ))}
    </div>
  );
}

// ─── Buttons ───────────────────────────────────────────────────────────────
export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:opacity-90 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        props.className,
      )}
    />
  );
}

export function SecondaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold transition-all duration-150 hover:border-border-hover hover:bg-muted active:scale-[0.98]',
        props.className,
      )}
    />
  );
}

// ─── Form primitives ───────────────────────────────────────────────────────
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input(props, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className={clsx(
          'min-h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-all duration-150 placeholder:text-foreground/35 focus:border-primary focus:ring-2 focus:ring-primary/20',
          props.className,
        )}
      />
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea(props, ref) {
    return (
      <textarea
        ref={ref}
        {...props}
        className={clsx(
          'min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-all duration-150 placeholder:text-foreground/35 focus:border-primary focus:ring-2 focus:ring-primary/20',
          props.className,
        )}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select(props, ref) {
    return (
      <select
        ref={ref}
        {...props}
        className={clsx(
          'min-h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20',
          props.className,
        )}
      />
    );
  },
);

export function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-foreground/80">{label}</span>
      {children}
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </label>
  );
}