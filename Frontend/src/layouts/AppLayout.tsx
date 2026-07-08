import { Moon, SunMedium } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SecondaryButton } from '../components/ui';

const links = [
  ['/', 'Dashboard'],
  ['/questionnaire', 'Questionnaire'],
  ['/projects', 'Projects'],
  ['/technologies', 'Technologies']
];

export function AppLayout() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <NavLink to="/" className="text-xl font-bold text-primary">StackWise</NavLink>
          <nav className="flex flex-wrap items-center gap-2">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-muted text-primary' : 'hover:bg-muted'}`}>{label}</NavLink>
            ))}
            <SecondaryButton aria-label="Toggle theme" onClick={() => setDark(value => !value)}>{dark ? <SunMedium size={18} /> : <Moon size={18} />}</SecondaryButton>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
