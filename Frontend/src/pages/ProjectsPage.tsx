import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui';
import { getProjects } from '../services/api';

export function ProjectsPage() {
  const { data = [] } = useQuery({ queryKey: ['projects'], queryFn: getProjects });
  return <div className="grid gap-4"><h1 className="text-3xl font-bold">Saved Projects</h1>{data.map(project => <Link key={project.id} to={`/recommendations/${project.id}`}><Card><strong>{project.name}</strong><p className="text-sm text-foreground/65">{project.status} · {project.expected_users} expected users · ${project.budget} budget</p></Card></Link>)}</div>;
}
