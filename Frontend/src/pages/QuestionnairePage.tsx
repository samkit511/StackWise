import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button, Card, Field, Input, SecondaryButton, Select, Textarea } from '../components/ui';
import { defaultQuestionnaire } from '../constants/questionnaire';
import { submitQuestionnaire } from '../services/api';
import type { QuestionnaireInput } from '../types/api';

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  status: z.string(),
  project_type: z.string(),
  budget: z.coerce.number().min(1000),
  expected_users: z.coerce.number().min(1),
  timeline: z.string(),
  team_size: z.coerce.number().min(1),
  team_frontend: z.string(),
  team_backend: z.string(),
  features: z.array(z.string()),
  need_ai: z.boolean(),
  need_realtime: z.boolean(),
  need_seo: z.boolean(),
  requires_reporting: z.boolean(),
  compliance: z.boolean(),
  admin_heavy: z.boolean(),
  backend_control: z.boolean(),
  data_complexity: z.string(),
  deployment: z.string(),
  current_stack: z.array(z.string()),
  pain_points: z.array(z.string())
});

const steps = ['Business', 'Team', 'Requirements', 'Existing Project'];
const featureOptions = ['authentication', 'payments', 'analytics', 'realtime'];

export function QuestionnairePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const saved = localStorage.getItem('stackwise-questionnaire');
  const form = useForm<QuestionnaireInput>({ resolver: zodResolver(schema), defaultValues: saved ? JSON.parse(saved) : defaultQuestionnaire });
  const mutation = useMutation({
    mutationFn: submitQuestionnaire,
    onSuccess: data => {
      localStorage.removeItem('stackwise-questionnaire');
      navigate(`/recommendations/${data.project.id}`, { state: data.recommendation });
    }
  });
  useEffect(() => {
    const sub = form.watch(value => localStorage.setItem('stackwise-questionnaire', JSON.stringify(value)));
    return () => sub.unsubscribe();
  }, [form]);
  const values = form.watch();
  function toggleFeature(feature: string) {
    const next = values.features.includes(feature) ? values.features.filter(item => item !== feature) : [...values.features, feature];
    form.setValue('features', next, { shouldValidate: true });
  }
  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit(value => mutation.mutate(value))}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Project Questionnaire</h1>
          <p className="text-foreground/65">Step {step + 1} of {steps.length}: {steps[step]}</p>
        </div>
        <div className="h-2 w-56 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
      </div>
      <Card className="grid gap-4">
        {step === 0 && <>
          <Field label="Project name"><Input {...form.register('name')} /></Field>
          <Field label="Description"><Textarea {...form.register('description')} /></Field>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Status"><Select {...form.register('status')}><option>New</option><option>Existing</option></Select></Field>
            <Field label="Project type"><Select {...form.register('project_type')}><option value="saas">SaaS</option><option value="marketplace">Marketplace</option><option value="dashboard">Dashboard</option><option value="ai">AI Product</option></Select></Field>
            <Field label="Budget"><Input type="number" {...form.register('budget')} /></Field>
          </div>
        </>}
        {step === 1 && <div className="grid gap-4 md:grid-cols-2">
          <Field label="Expected users"><Input type="number" {...form.register('expected_users')} /></Field>
          <Field label="Timeline"><Select {...form.register('timeline')}><option value="urgent">Urgent</option><option value="normal">Normal</option><option value="flexible">Flexible</option></Select></Field>
          <Field label="Team size"><Input type="number" {...form.register('team_size')} /></Field>
          <Field label="Frontend skill"><Select {...form.register('team_frontend')}><option value="react">React</option><option value="vue">Vue</option><option value="typescript">TypeScript</option><option value="mixed">Mixed</option></Select></Field>
          <Field label="Backend skill"><Select {...form.register('team_backend')}><option value="python">Python</option><option value="typescript">TypeScript</option><option value="javascript">JavaScript</option><option value="mixed">Mixed</option></Select></Field>
          <Field label="Data complexity"><Select {...form.register('data_complexity')}><option value="relational">Relational</option><option value="document">Document</option><option value="mixed">Mixed</option></Select></Field>
        </div>}
        {step === 2 && <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">{featureOptions.map(feature => <SecondaryButton type="button" key={feature} className={values.features.includes(feature) ? 'bg-primary text-white' : ''} onClick={() => toggleFeature(feature)}>{feature}</SecondaryButton>)}</div>
          <div className="grid gap-3 md:grid-cols-3">
            {(['need_ai', 'need_realtime', 'need_seo', 'requires_reporting', 'compliance', 'admin_heavy', 'backend_control'] as const).map(name => (
              <label key={name} className="flex items-center gap-2 rounded-md border border-border p-3 text-sm"><input type="checkbox" {...form.register(name)} />{name.replaceAll('_', ' ')}</label>
            ))}
          </div>
        </div>}
        {step === 3 && <div className="grid gap-4 md:grid-cols-2">
          <Field label="Deployment preference"><Select {...form.register('deployment')}><option value="docker">Docker</option><option value="cloud">Cloud</option><option value="portable">Portable</option></Select></Field>
          <Field label="Current stack comma-separated"><Input onChange={event => form.setValue('current_stack', event.target.value.split(',').map(v => v.trim()).filter(Boolean))} /></Field>
          <Field label="Pain points comma-separated"><Input onChange={event => form.setValue('pain_points', event.target.value.split(',').map(v => v.trim()).filter(Boolean))} /></Field>
        </div>}
      </Card>
      <div className="flex flex-wrap justify-between gap-3">
        <SecondaryButton type="button" disabled={step === 0} onClick={() => setStep(value => value - 1)}>Back</SecondaryButton>
        <div className="flex gap-2">
          <SecondaryButton type="button" onClick={() => localStorage.setItem('stackwise-questionnaire', JSON.stringify(form.getValues()))}><Save size={16} /> Save</SecondaryButton>
          {step < steps.length - 1 ? <Button type="button" onClick={() => setStep(value => value + 1)}>Next</Button> : <Button disabled={mutation.isPending} type="submit">{mutation.isPending ? 'Generating' : 'Generate Recommendation'}</Button>}
        </div>
      </div>
    </form>
  );
}
