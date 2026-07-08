import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, Field, Input, Select } from '../components/ui';
import { getTechnologies } from '../services/api';

export function TechnologiesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { data = [] } = useQuery({ queryKey: ['technologies', search, category], queryFn: () => getTechnologies(search, category) });
  return <div className="grid gap-4"><h1 className="text-3xl font-bold">Technology Knowledge Base</h1><div className="grid gap-3 md:grid-cols-2"><Field label="Search"><Input value={search} onChange={event => setSearch(event.target.value)} /></Field><Field label="Category"><Select value={category} onChange={event => setCategory(event.target.value)}><option value="">All</option><option>Frontend</option><option>Backend</option><option>Database</option><option>Cloud</option><option>DevOps</option><option>Security</option></Select></Field></div><div className="grid gap-3 md:grid-cols-3">{data.map((tech: any) => <Card key={tech.id}><h2 className="font-semibold">{tech.name}</h2><p className="text-sm text-foreground/65">{tech.category} · {tech.language}</p><p className="mt-2 text-sm">Performance: {tech.performance} | Cost: {tech.cost}</p><a className="mt-3 inline-flex text-sm font-semibold text-primary" href={tech.official_url} target="_blank" rel="noreferrer">Official docs</a></Card>)}</div></div>;
}
