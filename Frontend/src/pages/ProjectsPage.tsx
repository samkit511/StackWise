import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Calendar, DollarSign, Layers, PlusCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button, Card } from '../components/ui';
import { getProjects } from '../services/api';
import type { Project } from '../types/api';

function ProjectCard({ project }: { project: Project }) {
  const isNew = project.status?.toLowerCase() === 'new';

  return (
    <Link to={`/recommendations/${project.id}`} className="block">
      <Card interactive>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers size={18} />
            </div>
            <div>
              <p className="font-bold">{project.name}</p>
              {project.description && (
                <p className="mt-0.5 line-clamp-1 text-xs text-foreground/55">{project.description}</p>
              )}
            </div>
          </div>
          <Badge variant={isNew ? 'primary' : 'warning'}>{project.status}</Badge>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-border bg-muted/40 p-3">
          <div className="flex items-center gap-1.5">
            <Users size={13} className="text-foreground/40" />
            <div>
              <p className="text-[10px] text-foreground/40">Users</p>
              <p className="text-xs font-semibold">{project.expected_users?.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign size={13} className="text-foreground/40" />
            <div>
              <p className="text-[10px] text-foreground/40">Budget</p>
              <p className="text-xs font-semibold">${project.budget?.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-foreground/40" />
            <div>
              <p className="text-[10px] text-foreground/40">Timeline</p>
              <p className="text-xs font-semibold capitalize">{project.timeline ?? 'Not set'}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-1 text-xs font-semibold text-primary">
          View recommendation <ArrowRight size={12} />
        </div>
      </Card>
    </Link>
  );
}

export function ProjectsPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Saved Projects</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Every questionnaire submission is saved here. Click a project to re-view its recommendation.
          </p>
        </div>
        <Link to="/questionnaire">
          <Button className="gap-2">
            <PlusCircle size={16} /> New Project
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-border bg-card p-5">
              <div className="skeleton h-6 w-40 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-12 w-full rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-border py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Layers size={28} className="text-foreground/30" />
          </div>
          <div>
            <p className="text-lg font-bold">No projects yet</p>
            <p className="mt-1 text-sm text-foreground/55">
              Complete the questionnaire to generate and save your first stack recommendation.
            </p>
          </div>
          <Link to="/questionnaire">
            <Button className="gap-2">
              Start Questionnaire <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      )}

      {!isLoading && data.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
