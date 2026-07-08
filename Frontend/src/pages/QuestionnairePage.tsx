import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  AlertCircle,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FolderOpen,
  Save,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {
  Badge,
  Button,
  Card,
  Chip,
  Field,
  Input,
  SecondaryButton,
  Select,
  Textarea,
} from '../components/ui';
import { defaultQuestionnaire } from '../constants/questionnaire';
import { submitQuestionnaire } from '../services/api';
import type { QuestionnaireInput } from '../types/api';

// ─── Validation schema ─────────────────────────────────────────────────────
const schema = z.object({
  name:              z.string().min(2,  'Project name must be at least 2 characters'),
  description:       z.string().min(10, 'Description must be at least 10 characters'),
  status:            z.string(),
  project_type:      z.string(),
  budget:            z.coerce.number().min(1000, 'Budget must be at least $1,000'),
  expected_users:    z.coerce.number().min(1,    'Expected users must be at least 1'),
  timeline:          z.string(),
  team_size:         z.coerce.number().min(1,    'Team size must be at least 1'),
  team_frontend:     z.string(),
  team_backend:      z.string(),
  features:          z.array(z.string()),
  need_ai:           z.boolean(),
  need_realtime:     z.boolean(),
  need_seo:          z.boolean(),
  requires_reporting:z.boolean(),
  compliance:        z.boolean(),
  admin_heavy:       z.boolean(),
  backend_control:   z.boolean(),
  data_complexity:   z.string(),
  deployment:        z.string(),
  current_stack:     z.array(z.string()),
  pain_points:       z.array(z.string()),
});

// ─── Step definitions ──────────────────────────────────────────────────────
const STEPS = [
  { label: 'Business',     icon: <Briefcase   size={16} />, id: 0 },
  { label: 'Team & Scale', icon: <Users       size={16} />, id: 1 },
  { label: 'Requirements', icon: <Cpu         size={16} />, id: 2 },
  { label: 'Existing',     icon: <FolderOpen  size={16} />, id: 3 },
];

const FEATURE_OPTIONS = [
  { value: 'authentication', label: 'Authentication', emoji: '🔐' },
  { value: 'payments',       label: 'Payments',       emoji: '💳' },
  { value: 'analytics',      label: 'Analytics',      emoji: '📊' },
  { value: 'realtime',       label: 'Realtime',       emoji: '⚡' },
  { value: 'notifications',  label: 'Notifications',  emoji: '🔔' },
  { value: 'file_upload',    label: 'File Upload',    emoji: '📁' },
  { value: 'search',         label: 'Search',         emoji: '🔍' },
  { value: 'ai_features',    label: 'AI Features',    emoji: '🤖' },
];

const BOOL_FIELDS: { name: keyof QuestionnaireInput; label: string; description: string }[] = [
  { name: 'need_ai',            label: 'AI / ML',           description: 'LLMs, embeddings, or ML pipelines'     },
  { name: 'need_realtime',      label: 'Realtime',          description: 'WebSockets, SSE, or live updates'      },
  { name: 'need_seo',           label: 'SEO Required',      description: 'Server-side rendering or static export' },
  { name: 'requires_reporting', label: 'Reporting',         description: 'Dashboards, data exports, BI tooling'  },
  { name: 'compliance',         label: 'Compliance',        description: 'GDPR, HIPAA, SOC2, or similar'         },
  { name: 'admin_heavy',        label: 'Admin-heavy',       description: 'Complex CMS or back-office features'    },
  { name: 'backend_control',    label: 'Full Control',      description: 'Own the backend — no Firebase/BaaS'    },
];

// ─── Component ─────────────────────────────────────────────────────────────
export function QuestionnairePage() {
  const navigate  = useNavigate();
  const [step, setStep] = useState(0);
  const saved = localStorage.getItem('stackwise-questionnaire');

  const form = useForm<QuestionnaireInput>({
    resolver:      zodResolver(schema),
    defaultValues: saved ? JSON.parse(saved) : defaultQuestionnaire,
    mode:          'onTouched',
  });

  const { register, watch, setValue, formState: { errors } } = form;
  const values = watch();

  // Persist to localStorage on every change
  useEffect(() => {
    const sub = form.watch(value =>
      localStorage.setItem('stackwise-questionnaire', JSON.stringify(value)),
    );
    return () => sub.unsubscribe();
  }, [form]);

  const mutation = useMutation({
    mutationFn: submitQuestionnaire,
    onSuccess: data => {
      localStorage.removeItem('stackwise-questionnaire');
      navigate(`/recommendations/${data.project.id}`, { state: data.recommendation });
    },
  });

  function toggleFeature(feature: string) {
    const next = values.features.includes(feature)
      ? values.features.filter(f => f !== feature)
      : [...values.features, feature];
    setValue('features', next, { shouldValidate: true });
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-3xl">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="animate-fade-in-up mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Project Questionnaire</h1>
            <p className="mt-1 text-sm text-foreground/60">
              Answer four steps — get a fully explained stack recommendation.
            </p>
          </div>
          <SecondaryButton
            type="button"
            className="shrink-0 gap-2 text-xs"
            onClick={() => localStorage.setItem('stackwise-questionnaire', JSON.stringify(form.getValues()))}
          >
            <Save size={14} /> Save draft
          </SecondaryButton>
        </div>

        {/* Step indicator */}
        <div className="mt-6 grid gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {STEPS[step].icon}
              <span className="text-sm font-semibold">
                Step {step + 1} of {STEPS.length}: {STEPS[step].label}
              </span>
            </div>
            <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dot steps */}
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200 ${
                    i < step
                      ? 'border-primary bg-primary text-white cursor-pointer'
                      : i === step
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-foreground/40'
                  }`}
                >
                  {i < step ? <CheckCircle2 size={14} /> : i + 1}
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-all duration-500 ${
                      i < step ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Error banner ───────────────────────────────────────────── */}
      {mutation.isError && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          <AlertCircle size={16} className="shrink-0" />
          Failed to generate recommendation. Check the backend is running and try again.
        </div>
      )}

      {/* ── Form ───────────────────────────────────────────────────── */}
      <form onSubmit={form.handleSubmit(value => mutation.mutate(value))}>
        <Card className="animate-fade-in grid gap-5 p-6">
          {/* Step 0 – Business */}
          {step === 0 && (
            <>
              <Field label="Project name" error={errors.name?.message}>
                <Input {...register('name')} placeholder="e.g. TalentHub" />
              </Field>
              <Field label="Description" error={errors.description?.message}>
                <Textarea
                  {...register('description')}
                  placeholder="Describe what your product does and who it's for…"
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Project status">
                  <Select {...register('status')}>
                    <option value="New">New project</option>
                    <option value="Existing">Existing project</option>
                  </Select>
                </Field>
                <Field label="Product type">
                  <Select {...register('project_type')}>
                    <option value="saas">SaaS</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="dashboard">Dashboard / Internal</option>
                    <option value="ai">AI Product</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="mobile_app">Mobile App Backend</option>
                  </Select>
                </Field>
                <Field label="Budget (USD)" error={errors.budget?.message}>
                  <Input type="number" {...register('budget')} placeholder="50000" />
                </Field>
              </div>
            </>
          )}

          {/* Step 1 – Team & Scale */}
          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Expected users (at launch)" error={errors.expected_users?.message}>
                <Input type="number" {...register('expected_users')} placeholder="10000" />
              </Field>
              <Field label="Timeline pressure">
                <Select {...register('timeline')}>
                  <option value="urgent">Urgent (MVP in &lt;3 months)</option>
                  <option value="normal">Normal (3–6 months)</option>
                  <option value="flexible">Flexible (&gt;6 months)</option>
                </Select>
              </Field>
              <Field label="Team size" error={errors.team_size?.message}>
                <Input type="number" {...register('team_size')} placeholder="4" />
              </Field>
              <Field label="Frontend skill">
                <Select {...register('team_frontend')}>
                  <option value="react">React / Next.js</option>
                  <option value="vue">Vue / Nuxt</option>
                  <option value="typescript">TypeScript-first</option>
                  <option value="mixed">Mixed / Undecided</option>
                </Select>
              </Field>
              <Field label="Backend skill">
                <Select {...register('team_backend')}>
                  <option value="python">Python</option>
                  <option value="typescript">Node / TypeScript</option>
                  <option value="javascript">Node / JavaScript</option>
                  <option value="go">Go</option>
                  <option value="mixed">Mixed / Undecided</option>
                </Select>
              </Field>
              <Field label="Data model complexity">
                <Select {...register('data_complexity')}>
                  <option value="relational">Relational (structured)</option>
                  <option value="document">Document (flexible)</option>
                  <option value="mixed">Mixed</option>
                  <option value="graph">Graph / Network</option>
                </Select>
              </Field>
            </div>
          )}

          {/* Step 2 – Requirements */}
          {step === 2 && (
            <div className="grid gap-6">
              <div>
                <p className="mb-3 text-sm font-semibold">Core features needed</p>
                <div className="flex flex-wrap gap-2">
                  {FEATURE_OPTIONS.map(f => (
                    <Chip
                      key={f.value}
                      active={values.features.includes(f.value)}
                      onClick={() => toggleFeature(f.value)}
                    >
                      {f.emoji} {f.label}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold">Technical requirements</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {BOOL_FIELDS.map(({ name, label, description }) => (
                    <label
                      key={name}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all duration-150 ${
                        values[name as keyof typeof values]
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-border bg-card hover:bg-muted'
                      }`}
                    >
                      <input
                        type="checkbox"
                        {...register(name as keyof QuestionnaireInput)}
                        className="mt-0.5 h-4 w-4 rounded accent-primary"
                      />
                      <div>
                        <p className="text-sm font-semibold">{label}</p>
                        <p className="text-xs text-foreground/55">{description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 – Existing project */}
          {step === 3 && (
            <div className="grid gap-5">
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
                <BookOpen size={18} className="mt-0.5 shrink-0 text-primary" />
                <p className="text-sm text-foreground/70">
                  This step is optional for new projects. For existing projects, it generates a
                  structured migration analysis with keep / replace / remove / add recommendations.
                </p>
              </div>
              <Field label="Deployment preference">
                <Select {...register('deployment')}>
                  <option value="docker">Docker / self-hosted</option>
                  <option value="cloud">Cloud (AWS / GCP / Azure)</option>
                  <option value="portable">Portable / multi-cloud</option>
                  <option value="serverless">Serverless</option>
                </Select>
              </Field>
              <Field label="Current stack (comma-separated)">
                <Input
                  placeholder="e.g. Django, MySQL, Vue 2, Heroku"
                  onChange={e =>
                    setValue(
                      'current_stack',
                      e.target.value.split(',').map(v => v.trim()).filter(Boolean),
                    )
                  }
                  defaultValue={values.current_stack.join(', ')}
                />
              </Field>
              <Field label="Pain points (comma-separated)">
                <Input
                  placeholder="e.g. slow queries, scaling issues, tech debt"
                  onChange={e =>
                    setValue(
                      'pain_points',
                      e.target.value.split(',').map(v => v.trim()).filter(Boolean),
                    )
                  }
                  defaultValue={values.pain_points.join(', ')}
                />
              </Field>
            </div>
          )}
        </Card>

        {/* ── Navigation ──────────────────────────────────────────── */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <SecondaryButton
            type="button"
            disabled={step === 0}
            onClick={() => setStep(v => v - 1)}
            className="gap-2"
          >
            <ChevronLeft size={16} /> Back
          </SecondaryButton>

          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={() => setStep(v => v + 1)} className="gap-2">
              Next <ChevronRight size={16} />
            </Button>
          ) : (
            <Button type="submit" disabled={mutation.isPending} className="min-w-44 gap-2">
              {mutation.isPending ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  Generate Recommendation <ChevronRight size={16} />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Step label hint */}
        <p className="mt-3 text-center text-xs text-foreground/40">
          {step < STEPS.length - 1
            ? `Next: ${STEPS[step + 1].label}`
            : 'Ready to generate your stack recommendation'}
        </p>
      </form>
    </div>
  );
}
