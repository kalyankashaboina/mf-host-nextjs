// app/users/page.tsx
'use client';

import RemoteLoader from "@/components/RemoteLoader";
import { MFE_REGISTRY } from "@/utils/mfeConfig";


export default function UsersPage() {
  const config = MFE_REGISTRY.sales;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={{ marginBottom: '32px' }}>
        <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Portal / Workspace</div>
        <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '4px 0 0 0', letterSpacing: '-1.5px' }}>{config.title}</h2>
      </header>
      
      <div style={{ 
        flex: 1, background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <RemoteLoader {...config} />
      </div>
    </div>
  );
}