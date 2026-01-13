'use client';
import RemoteLoader from "@/components/RemoteLoader";
import { MFE_REGISTRY } from "@/utils/mfeConfig";

export default function UsersPage() {
  const config = MFE_REGISTRY.users;
  return (
    // No bottom padding here (padding: top right bottom left)
    <div style={{ padding: '40px 40px 0 40px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      
      {/* Breadcrumb Header */}
      <div style={{ marginBottom: '20px', color: '#64748b', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
        Portal / Workspace / {config.title}
      </div>
      
      {/* The Surface: Only rounded at the top, extends to the bottom */}
      <div style={{ 
        flex: 1, 
        background: 'white', 
        // Only top corners are rounded
        borderTopLeftRadius: '32px', 
        borderTopRightRadius: '32px', 
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
        // Border on top and sides only
        borderLeft: '1px solid rgba(226, 232, 240, 0.8)',
        borderRight: '1px solid rgba(226, 232, 240, 0.8)',
        borderTop: '1px solid rgba(226, 232, 240, 0.8)',
        borderBottom: 'none',
        // Shadow that flows downwards
        boxShadow: '0 -4px 20px rgba(0,0,0,0.02)', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden' // Keeps the remote content inside the rounded top
      }}>
        <RemoteLoader {...config} />
      </div>
    </div>
  );
}