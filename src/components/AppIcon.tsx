import type { AppDefinition } from '../data/apps';

type Props = { app: AppDefinition; onClick: () => void; dock?: boolean; active?: boolean };
export function AppIcon({ app, onClick, dock, active }: Props) {
  const Icon = app.icon;
  return <button className={`app-button ${dock ? 'dock-button' : 'desktop-button'}`} onClick={onClick} aria-label={`Open ${app.label}`} title={app.label}>
    <span className={`app-icon ${app.tone}`}>
      {app.id === 'about' ? <img src="/assets/portrait.png" alt="" /> : <Icon strokeWidth={1.65} aria-hidden="true" />}
    </span>
    {dock ? <span className={`dock-indicator ${active ? 'visible' : ''}`} /> : <span className="app-label">{app.label}</span>}
  </button>;
}
