import { FolderOpen, UserRound, NotebookPen, Sparkles, Camera, Facebook, Github, Globe2, type LucideIcon } from 'lucide-react';

export type AppId = 'about' | 'notes' | 'projects' | 'inspiration' | 'instagram' | 'facebook' | 'github' | 'website';
export type AppDefinition = { id: AppId; label: string; eyebrow: string; icon: LucideIcon; tone: string; dock?: boolean };
export const apps: AppDefinition[] = [
  { id: 'about', label: 'About Me', eyebrow: 'A LITTLE INTRO', icon: UserRound, tone: 'portrait', dock: true },
  { id: 'projects', label: 'Selected Work', eyebrow: 'COMING SOON', icon: FolderOpen, tone: 'blue', dock: true },
  { id: 'notes', label: 'Notes', eyebrow: 'WORDS & IDEAS', icon: NotebookPen, tone: 'yellow', dock: true },
  { id: 'inspiration', label: 'Inspiration', eyebrow: 'A LITTLE CREDIT', icon: Sparkles, tone: 'purple', dock: true },
  { id: 'instagram', label: 'Instagram', eyebrow: 'SOCIAL • DEMO', icon: Camera, tone: 'pink' },
  { id: 'facebook', label: 'Facebook', eyebrow: 'SOCIAL • DEMO', icon: Facebook, tone: 'facebook' },
  { id: 'github', label: 'GitHub', eyebrow: 'SOCIAL • DEMO', icon: Github, tone: 'dark' },
  { id: 'website', label: 'More to come', eyebrow: 'THE FUTURE', icon: Globe2, tone: 'mint' },
];
export const getApp = (id: AppId) => apps.find(app => app.id === id)!;
