import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ---------------------------------------------------------------------------
// WordPress Page Builder & Headless Integration Guard
// ---------------------------------------------------------------------------
// When Elementor or Divi editor canvases are active, or when running in WordPress
// 'headless-mode', the React SPA yields so page builders can render, drag-and-drop,
// and edit the native post content without any DOM clashing or iframe script collisions.
export function checkIsPageBuilderOrHeadlessMode(): boolean {
  if (typeof window === 'undefined') return false;

  const urlParams = new URLSearchParams(window.location.search);
  const searchStr = window.location.search.toLowerCase();

  // 1. Explicit Headless Mode Query Flag
  const hasHeadlessFlag =
    urlParams.get('headless-mode') === '1' ||
    urlParams.get('headless-mode') === 'true' ||
    urlParams.get('headless') === '1' ||
    urlParams.get('headless') === 'true';

  if (hasHeadlessFlag) {
    return true;
  }

  // 2. Elementor Editor Canvas Detection (Active editor canvas only - never standard visitor or preview)
  const isElementor =
    (searchStr.includes('elementor-preview') && urlParams.get('action') === 'elementor') ||
    document.body.classList.contains('elementor-editor-active');

  // 3. Divi Builder Visual Canvas Detection (Active visual builder only)
  const isDivi =
    searchStr.includes('et_fb=1') &&
    (document.body.classList.contains('et-fb') || document.body.classList.contains('et_pb_builder_active'));

  return Boolean(isElementor || isDivi);
}

// ---------------------------------------------------------------------------
// DOM Interactive Mounting Logic
// ---------------------------------------------------------------------------
// Guarantees the React root container is mounted only after the DOM is fully interactive
// so pre-rendered body content does not flash, duplicate, or abruptly disappear.
let isMounted = false;

export function mountReactApp(): void {
  if (isMounted || typeof document === 'undefined') return;

  const isHeadlessOrBuilder = checkIsPageBuilderOrHeadlessMode();

  // Look for the primary theme root container or standard Vite root
  let container = document.getElementById('online-mmj-card-root') || document.getElementById('root');

  // If running in standard visitor mode (not inside an active page builder canvas)
  if (!isHeadlessOrBuilder) {
    // If container does not exist on this page template yet, create it on body
    if (!container) {
      container = document.createElement('div');
      container.id = 'online-mmj-card-root';
      document.body.appendChild(container);
    }

    // Mark SPA as active on body now that the DOM is interactive and container is confirmed
    document.body.classList.add('online-mmj-spa-active');
  }

  if (container) {
    isMounted = true;
    const root = createRoot(container);
    root.render(<App isHeadlessMode={isHeadlessOrBuilder} />);
  }
}

// Execute mounting only after DOM is fully interactive (DOMContentLoaded or readyState check)
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountReactApp, { once: true });
  } else {
    // DOM is already interactive or complete
    mountReactApp();
  }
}
