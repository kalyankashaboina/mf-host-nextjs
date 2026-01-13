'use client';
import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { loadViteModule } from '../utils/federation';

// --- 1. RUNTIME ERROR BOUNDARY ---
// Catches crashes that happen INSIDE the remote code after it has loaded.
class MfeErrorBoundary extends React.Component<{ children: React.ReactNode, name: string }, { hasError: boolean, error: any }> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }

  componentDidCatch(error: any, errorInfo: any) {
    console.group(`🔴 [MFE-Runtime-Error][${this.props.name}]`);
    console.error(error, errorInfo);
    console.groupEnd();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={errorCardStyle}>
          <div style={{ fontSize: '50px' }}>⚠️</div>
          <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '16px 0 8px 0' }}>Widget Runtime Error</h3>
          <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '350px', margin: '0 auto 24px auto' }}>
            The {this.props.name} widget encountered a JavaScript error.
          </p>
          <button onClick={() => window.location.reload()} style={primaryBtn}>Reload Application</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- 2. THE REMOTE LOADER ---
export default function RemoteLoader({ url, scope, module, title, componentProps = {} }: any) {
  const [Component, setComponent] = useState<any>(null);
  const [loadError, setLoadError] = useState<{ msg: string; type: 'network' | 'module' } | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const performLoad = useCallback(async () => {
    setLoadError(null);
    try {
      const Comp = await loadViteModule(url, scope, module);
      
      /** 
       * CRITICAL FIX: 
       * Wrap Comp in an arrow function so React stores it as a value 
       * instead of trying to execute it as a functional update!
       */
      setComponent(() => Comp);
      setIsInitialLoad(false);
    } catch (err: any) {
      console.error(`[MFE Loader] ${scope} failed:`, err);
      const isNetwork = err.message.toLowerCase().includes('fetch') || err.message.toLowerCase().includes('import');
      
      setLoadError({
        msg: isNetwork ? `Could not connect to ${url}. Please check if the remote server is running.` : err.message,
        type: isNetwork ? 'network' : 'module'
      });
      setIsInitialLoad(false);
    }
  }, [url, scope, module]);

  useEffect(() => {
    performLoad();
  }, [performLoad, retryTrigger]);

  // EDGE CASE: Loading State
  if (isInitialLoad || (!Component && !loadError)) {
    return <LoadingSkeleton title={title} />;
  }

  // EDGE CASE: Network or Module Error (Before the code even runs)
  if (loadError) {
    return (
      <div style={errorCardStyle} className="fade-up">
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>{loadError.type === 'network' ? '🔌' : '🧩'}</div>
        <h3 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-1px' }}>
          {title} {loadError.type === 'network' ? 'is Offline' : 'Load Failed'}
        </h3>
        <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '450px', margin: '0 auto 30px auto', lineHeight: '1.6' }}>
          {loadError.msg}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => setRetryTrigger(prev => prev + 1)} style={primaryBtn}>Try Again</button>
          <button onClick={() => window.open(url, '_blank')} style={secondaryBtn}>Check Source</button>
        </div>
      </div>
    );
  }

  // SUCCESS: Render with Error Boundary
  return (
    <MfeErrorBoundary name={title}>
      <Suspense fallback={<LoadingSkeleton title={title} />}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="fade-up">
          <Component {...componentProps} title={title} />
        </div>
      </Suspense>
    </MfeErrorBoundary>
  );
}

// --- 3. SUB-COMPONENTS & STYLES ---

function LoadingSkeleton({ title }: { title: string }) {
  return (
    <div style={{ padding: '40px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="shimmer" style={{ width: '200px', height: '36px', borderRadius: '10px' }} />
        <div className="shimmer" style={{ width: '100px', height: '36px', borderRadius: '10px' }} />
      </div>
      <div className="shimmer" style={{ flex: 1, borderRadius: '20px', minHeight: '350px' }} />
      <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px' }}>
        LOADING REMOTE MODULE: {title.toUpperCase()}
      </div>
    </div>
  );
}

const errorCardStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 20px',
  textAlign: 'center'
};

const primaryBtn: React.CSSProperties = {
  padding: '12px 28px',
  background: '#0f172a',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
};

const secondaryBtn: React.CSSProperties = {
  padding: '12px 28px',
  background: '#f1f5f9',
  color: '#475569',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer'
};