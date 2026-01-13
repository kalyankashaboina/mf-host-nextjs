// app/utils/federation.ts
import React from 'react';
import ReactDOM from 'react-dom';
import { mfeStatusStore } from './statusStore';

const nativeImport = (url: string) => new Function('url', 'return import(url)')(url);
const initializedRemotes = new Set<string>();

export async function loadViteModule(url: string, scope: string, module: string) {
  const logId = `[MFE-System][${scope}]`;
  try {
    mfeStatusStore.update(scope, 'loading');

    // 1. Force the Host's React instance into the global scope
    const reactEntry = { get: () => Promise.resolve(() => React), loaded: true, from: 'host', version: '19.0.0' };
    const sharedScope = {
      react: { 'default': reactEntry, [React.version]: reactEntry, '19.0.0': reactEntry, '19.2.0': reactEntry },
      'react-dom': { 'default': { get: () => Promise.resolve(() => ReactDOM), loaded: true, version: '19.0.0' } }
    };

    (globalThis as any).__federation_shared__ = { ...((globalThis as any).__federation_shared__ || {}), ...sharedScope };

    // 2. Load and Init
    const container = await nativeImport(url);
    if (!initializedRemotes.has(url)) {
      await container.init(sharedScope);
      initializedRemotes.add(url);
    }

    // 3. Extract Component
    const factory = await container.get(module);
    const Module = factory();
    mfeStatusStore.update(scope, 'online');
    return Module.default || Module;
  } catch (error) {
    mfeStatusStore.update(scope, 'offline');
    console.error(`${logId} Handshake Failed:`, error);
    throw error;
  }
}