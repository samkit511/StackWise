import { clsx } from 'clsx';
import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={clsx('rounded-lg border border-border bg-card p-5 shadow-sm', className)}>{children}</section>;
}

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={clsx('inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50', props.className)} />;
}

export function SecondaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={clsx('inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:bg-muted', props.className)} />;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(props, ref) {
  return <input ref={ref} {...props} className={clsx('min-h-10 w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary', props.className)} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(props, ref) {
  return <textarea ref={ref} {...props} className={clsx('min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary', props.className)} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(props, ref) {
  return <select ref={ref} {...props} className={clsx('min-h-10 w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary', props.className)} />;
});

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2 text-sm font-medium">{label}{children}</label>;
}