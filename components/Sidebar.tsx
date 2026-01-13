'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mfeStatusStore } from '../utils/statusStore';
import { MFE_REGISTRY } from '../utils/mfeConfig';

export default function Sidebar() {
  const pathname = usePathname();
  const [statuses, setStatuses] = useState<any>({});

  useEffect(() => mfeStatusStore.subscribe(setStatuses), []);

  return (
    <aside style={{ width: '280px', background: '#0f172a', display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Brand Section */}
      <div style={{ padding: '48px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '40px', height: '40px', background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)', 
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: 'white', fontWeight: 800, fontSize: '22px', boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)' 
          }}>L</div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'white', letterSpacing: '-0.5px' }}>LogTrack</h1>
        </div>
      </div>
      
      {/* Nav Section */}
      <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Object.entries(MFE_REGISTRY).map(([key, mfe]) => {
          const isActive = pathname.startsWith(`/${key}`);
          const status = statuses[mfe.scope] || 'idle';
          
          return (
            <Link key={key} href={`/${key}`} style={{
              textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', borderRadius: '14px', fontSize: '14px', transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              color: isActive ? '#60a5fa' : '#94a3b8',
              border: isActive ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px', filter: isActive ? 'none' : 'grayscale(100%) brightness(1.5)' }}>{mfe.icon}</span>
                <span style={{ fontWeight: isActive ? 600 : 500 }}>{mfe.title}</span>
              </div>
              
              {/* Animated Status Indicator */}
              <div style={{ 
                width: '8px', height: '8px', borderRadius: '50%', 
                background: status === 'online' ? '#22c55e' : status === 'loading' ? '#eab308' : status === 'offline' ? '#ef4444' : '#334155',
                boxShadow: status === 'online' ? '0 0 10px rgba(34, 197, 94, 0.6)' : 'none',
                transition: '0.3s'
              }} />
            </Link>
          );
        })}
      </nav>

      {/* Footer Version Tag */}
      <div style={{ padding: '32px' }}>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>System Version</div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', fontWeight: 500 }}>Enterprise v1.2.8</div>
        </div>
      </div>
    </aside>
  );
}