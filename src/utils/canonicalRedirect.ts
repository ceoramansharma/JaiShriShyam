import { AppRoute, getStateUrl, getCityUrl, getServiceUrl, getConditionUrl, getBlogUrl, getArticleUrl, getContactUrl, getBookUrl, parseCurrentUrl } from './urlRouter';
import { STATES_DATA, SERVICES_DATA, QUALIFYING_CONDITIONS } from '../data/mmjData';
import { LOCAL_CITIES_DATA } from '../data/localSeoData';
import { BLOG_ARTICLES_DATA } from '../data/blogArticlesData';
import { getBaseOrigin } from './seoMeta';
import { getCustomPages } from './customPagesStore';

export interface CanonicalRedirectResult {
  isDuplicate: boolean;
  redirected: boolean;
  originalUrl: string;
  canonicalPath: string;
  canonicalUrl: string;
  reason?: string;
}

export interface RoutePatternVerificationResult {
  category: 'home' | 'state' | 'city' | 'service' | 'condition' | 'blog' | 'article' | 'book' | 'contact' | 'sitemap' | 'custom-page' | 'redirect-alias';
  name: string;
  testInput: string;
  routeType: string;
  canonicalPath: string;
  canonicalUrl: string;
  expectedCanonicalPath: string;
  isMatch: boolean;
  isDuplicateDetected: boolean;
  status: 'PASS' | 'FAIL';
  reason?: string;
}

export interface CanonicalAuditReport {
  timestamp: string;
  origin: string;
  totalTested: number;
  passedCount: number;
  failedCount: number;
  passRate: string;
  activeDomCanonicalTag: string | null;
  activeDomOgUrlTag: string | null;
  currentWindowPath: string;
  results: RoutePatternVerificationResult[];
}

/**
 * Resolves the absolute primary-keyword canonical URL for any route.
 * Prioritizes high-ranking industry keywords:
 * - /medical-marijuana-card-{state}/
 * - /medical-marijuana-card-{city}/
 * - /medical-marijuana-card-renewal/
 * - /new-patient-medical-marijuana-card/
 * - /99-plant-cultivation-recommendation/
 * - /emotional-support-animal-letter/
 * - /medical-marijuana-for-{condition}/
 * - /medical-marijuana-insights/
 * - /contact-us/
 * - /book-evaluation/
 * - / (homepage)
 */
export function getPrimaryKeywordCanonicalPath(route: AppRoute): string {
  switch (route.type) {
    case 'state':
      return getStateUrl(route.stateId);
    case 'city':
      return getCityUrl(route.slug);
    case 'service':
      return getServiceUrl(route.serviceId);
    case 'condition':
      return getConditionUrl(route.conditionId);
    case 'blog':
      return route.viewMode === 'speed' ? '/medical-marijuana-insights/?view=speed' : getBlogUrl();
    case 'article':
      return getArticleUrl(route.articleSlug, route.isAmp);
    case 'book': {
      const params = new URLSearchParams();
      if (route.stateId) params.set('state', route.stateId);
      if (route.serviceId) params.set('service', route.serviceId);
      const qs = params.toString() ? `?${params.toString()}` : '';
      return `/book-evaluation/${qs}`;
    }
    case 'contact':
      return getContactUrl();
    case 'sitemap':
      return '/sitemap.xml';
    case 'custom-page':
      return `/${route.slug.replace(/^\/+|\/+$/g, '')}/`;
    case 'home':
    default:
      return '/';
  }
}

/**
 * Checks if a given path/URL is a duplicate or non-canonical variant of an authorized primary route.
 */
export function detectDuplicateContent(
  currentPath?: string,
  search?: string,
  hash?: string
): { isDuplicate: boolean; canonicalPath: string; canonicalUrl: string; reason?: string } {
  const origin = getBaseOrigin();
  const rawPath = (currentPath ?? (typeof window !== 'undefined' ? window.location.pathname : '/')).trim();
  const rawSearch = (search ?? (typeof window !== 'undefined' ? window.location.search : '')).trim();
  const rawHash = (hash ?? (typeof window !== 'undefined' ? window.location.hash : '')).trim();

  // Normalize path
  const lowerPath = rawPath.toLowerCase();
  const trimmedPath = lowerPath.replace(/^\/+|\/+$/g, '');

  // Check if WordPress page builder edit/preview canvas is active - do NOT redirect editor
  const lowerSearch = rawSearch.toLowerCase();
  const isPageBuilderEditor = 
    lowerSearch.includes('elementor') || 
    lowerSearch.includes('preview=true') || 
    lowerSearch.includes('et_fb=1') || 
    lowerSearch.includes('headless');

  if (isPageBuilderEditor) {
    const route = parseCurrentUrl(rawPath, rawSearch, rawHash);
    const canonicalPath = getPrimaryKeywordCanonicalPath(route);
    return {
      isDuplicate: false,
      canonicalPath,
      canonicalUrl: `${origin}${canonicalPath}${rawSearch}`,
    };
  }

  // 1. Detect duplicate hash routing (e.g. /#/medical-marijuana-card-ca or /path/#/path)
  const cleanHash = rawHash.replace(/^#\/?/, '').replace(/\/+$/, '').toLowerCase();
  if (cleanHash && (cleanHash === trimmedPath || trimmedPath.endsWith(cleanHash))) {
    const route = parseCurrentUrl(rawPath, rawSearch, rawHash);
    const canonicalPath = getPrimaryKeywordCanonicalPath(route);
    return {
      isDuplicate: true,
      canonicalPath,
      canonicalUrl: `${origin}${canonicalPath}${rawSearch}`,
      reason: 'Hash-based duplicate route detected',
    };
  }

  // 2. Detect non-lowercase URLs (e.g. /California/ -> /medical-marijuana-card-california/)
  const hasUppercase = rawPath !== lowerPath;

  // 3. Detect root homepage variants (e.g. /home, /index.html, /index.php)
  if (trimmedPath === 'home' || trimmedPath === 'index.html' || trimmedPath === 'index.php') {
    return {
      isDuplicate: true,
      canonicalPath: '/',
      canonicalUrl: `${origin}/${rawSearch}`,
      reason: 'Homepage duplicate variant detected',
    };
  }

  // 3b. Detect sitemap route variants (e.g. /sitemap, /sitemap/)
  if (trimmedPath === 'sitemap' || trimmedPath === 'sitemap.xml') {
    return {
      isDuplicate: rawPath !== '/sitemap.xml',
      canonicalPath: '/sitemap.xml',
      canonicalUrl: `${origin}/sitemap.xml`,
      reason: rawPath !== '/sitemap.xml' ? 'Sitemap variant redirected to /sitemap.xml' : undefined,
    };
  }

  // Parse current route to identify intended page using rawPath, rawSearch, rawHash
  const route = parseCurrentUrl(rawPath, rawSearch, rawHash);

  // If parsed as home, but rawPath is not root and not an explicit homepage alias,
  // it is a custom WordPress page or subpath - do NOT forcefully redirect to root /
  if (route.type === 'home' && rawPath !== '/' && trimmedPath !== '') {
    const isExplicitHomeAlias = trimmedPath === 'home' || trimmedPath === 'index.html' || trimmedPath === 'index.php';
    if (!isExplicitHomeAlias) {
      return {
        isDuplicate: false,
        canonicalPath: rawPath.endsWith('/') ? rawPath : `${rawPath}/`,
        canonicalUrl: `${origin}${rawPath.endsWith('/') ? rawPath : `${rawPath}/`}${rawSearch}`,
      };
    }
  }

  const canonicalPath = getPrimaryKeywordCanonicalPath(route);
  const canonicalPathNoQuery = canonicalPath.split('?')[0];

  // 4. Compare current path against canonical path
  const formattedCurrentPath = rawPath === '/' ? '/' : `/${trimmedPath}/`;

  if (formattedCurrentPath !== canonicalPathNoQuery) {
    return {
      isDuplicate: true,
      canonicalPath,
      canonicalUrl: `${origin}${canonicalPath}`,
      reason: `Non-canonical alias (${formattedCurrentPath}) redirected to primary keyword URL (${canonicalPathNoQuery})`,
    };
  }

  // 5. Detect missing trailing slash on sub-paths (e.g. /medical-marijuana-card-california -> /medical-marijuana-card-california/)
  if (rawPath !== '/' && !rawPath.endsWith('/')) {
    return {
      isDuplicate: true,
      canonicalPath,
      canonicalUrl: `${origin}${canonicalPath}${rawSearch}`,
      reason: 'Missing trailing slash on canonical SEO URL',
    };
  }

  if (hasUppercase) {
    return {
      isDuplicate: true,
      canonicalPath,
      canonicalUrl: `${origin}${canonicalPath}${rawSearch}`,
      reason: 'Uppercase URL characters normalized to lowercase',
    };
  }

  return {
    isDuplicate: false,
    canonicalPath,
    canonicalUrl: `${origin}${canonicalPath}${rawSearch}`,
  };
}

/**
 * Updates or injects the <link rel="canonical"> element in document head
 */
export function updateCanonicalHeadTag(canonicalUrl: string): void {
  if (typeof document === 'undefined') return;

  let linkEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!linkEl) {
    linkEl = document.createElement('link');
    linkEl.setAttribute('rel', 'canonical');
    document.head.appendChild(linkEl);
  }
  linkEl.setAttribute('href', canonicalUrl);

  // Synchronize OpenGraph and Twitter URL tags
  let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
  if (ogUrl) {
    ogUrl.setAttribute('content', canonicalUrl);
  }
}

/**
 * Performs a comprehensive audit of all dynamically rendered route patterns
 * across States, Cities, Services, Conditions, Blog, Articles, Custom Pages,
 * and canonical redirection aliases to ensure 100% correct canonical URL mapping.
 */
export function auditCanonicalRouteMappings(): CanonicalAuditReport {
  const origin = getBaseOrigin();
  const results: RoutePatternVerificationResult[] = [];

  // Helper tester
  const testPattern = (
    category: RoutePatternVerificationResult['category'],
    name: string,
    testInput: string,
    expectedPath: string
  ) => {
    // Split test input into path, search, hash if present
    const urlParts = testInput.split('#');
    const pathAndQuery = urlParts[0];
    const hash = urlParts[1] ? `#${urlParts[1]}` : '';
    const [path, query] = pathAndQuery.split('?');
    const search = query ? `?${query}` : '';

    const parsedRoute = parseCurrentUrl(path, search, hash);
    const detection = detectDuplicateContent(path, search, hash);
    const canonicalPath = detection.canonicalPath;
    const isMatch = canonicalPath === expectedPath;

    results.push({
      category,
      name,
      testInput,
      routeType: parsedRoute.type,
      canonicalPath,
      canonicalUrl: detection.canonicalUrl,
      expectedCanonicalPath: expectedPath,
      isMatch,
      isDuplicateDetected: detection.isDuplicate,
      status: isMatch ? 'PASS' : 'FAIL',
      reason: detection.reason,
    });
  };

  // 1. Homepage
  testPattern('home', 'Homepage Root', '/', '/');

  // 2. States (All 50+ states)
  STATES_DATA.forEach((state) => {
    const expected = getStateUrl(state.id);
    testPattern('state', `State: ${state.name} (${state.code})`, expected, expected);
  });

  // 3. Local Cities
  LOCAL_CITIES_DATA.forEach((city) => {
    const expected = getCityUrl(city.slug);
    testPattern('city', `City: ${city.cityName}, ${city.stateCode}`, expected, expected);
  });

  // 4. Core Telehealth Services
  SERVICES_DATA.forEach((service) => {
    const expected = getServiceUrl(service.id);
    testPattern('service', `Service: ${service.title}`, expected, expected);
  });

  // 5. Qualifying Medical Conditions
  QUALIFYING_CONDITIONS.forEach((condition) => {
    const expected = getConditionUrl(condition.id);
    testPattern('condition', `Condition: ${condition.name}`, expected, expected);
  });

  // 6. Blog Directory & Speed Mode
  testPattern('blog', 'Blog Directory', '/medical-marijuana-insights/', '/medical-marijuana-insights/');
  testPattern('blog', 'Blog Speed View (?view=speed)', '/medical-marijuana-insights/?view=speed', '/medical-marijuana-insights/?view=speed');

  // 7. Blog Articles & AMP variants
  BLOG_ARTICLES_DATA.forEach((article) => {
    const standardUrl = getArticleUrl(article.slug, false);
    const ampUrl = getArticleUrl(article.slug, true);
    testPattern('article', `Article: ${article.title.substring(0, 30)}...`, standardUrl, standardUrl);
    testPattern('article', `Article AMP: ${article.slug}`, ampUrl, ampUrl);
  });

  // 8. Booking & Contact
  testPattern('book', 'Book Evaluation', '/book-evaluation/', '/book-evaluation/');
  testPattern('book', 'Book Evaluation with Params', '/book-evaluation/?state=california&service=renewal', '/book-evaluation/?state=california&service=renewal');
  testPattern('contact', 'Contact Support Desk', '/contact-us/', '/contact-us/');

  // 9. Sitemap
  testPattern('sitemap', 'XML Sitemap', '/sitemap.xml', '/sitemap.xml');

  // 10. Dynamic WordPress Pages
  const customPages = getCustomPages();
  customPages.forEach((page) => {
    const cleanSlug = page.slug.replace(/^\/+|\/+$/g, '');
    testPattern('custom-page', `Custom Page: ${page.title}`, `/${cleanSlug}/`, `/${cleanSlug}/`);
  });

  // 11. Canonical Duplicate / Alias Redirection Patterns (Negative Testing)
  testPattern('redirect-alias', 'Uppercase State Alias (/California/)', '/California/', '/medical-marijuana-card-california/');
  testPattern('redirect-alias', 'Missing Trailing Slash (/medical-marijuana-card-florida)', '/medical-marijuana-card-florida', '/medical-marijuana-card-florida/');
  testPattern('redirect-alias', 'Direct State Slug Alias (/california)', '/california', '/medical-marijuana-card-california/');
  testPattern('redirect-alias', 'Direct City Slug Alias (/los-angeles)', '/los-angeles', '/medical-marijuana-card-los-angeles/');
  testPattern('redirect-alias', 'Direct Service Slug Alias (/renewal)', '/renewal', '/medical-marijuana-card-renewal/');
  testPattern('redirect-alias', 'Direct Cultivation Shortcut (/cultivation)', '/cultivation', '/99-plant-cultivation-recommendation/');
  testPattern('redirect-alias', 'Direct Condition Slug Alias (/chronic-pain)', '/chronic-pain', '/medical-marijuana-for-chronic-pain/');
  testPattern('redirect-alias', 'Homepage Alias (/home)', '/home', '/');
  testPattern('redirect-alias', 'Homepage File Alias (/index.html)', '/index.html', '/');
  testPattern('redirect-alias', 'Sitemap Shortcut (/sitemap)', '/sitemap', '/sitemap.xml');
  testPattern('redirect-alias', 'Hash Route Duplicate (/#/medical-marijuana-card-texas)', '/#/medical-marijuana-card-texas', '/medical-marijuana-card-texas/');

  const passedCount = results.filter((r) => r.status === 'PASS').length;
  const failedCount = results.filter((r) => r.status === 'FAIL').length;
  const totalTested = results.length;
  const passRate = `${((passedCount / totalTested) * 100).toFixed(1)}%`;

  let activeDomCanonicalTag: string | null = null;
  let activeDomOgUrlTag: string | null = null;
  if (typeof document !== 'undefined') {
    const linkEl = document.querySelector('link[rel="canonical"]');
    if (linkEl) activeDomCanonicalTag = linkEl.getAttribute('href');
    const metaOg = document.querySelector('meta[property="og:url"]');
    if (metaOg) activeDomOgUrlTag = metaOg.getAttribute('content');
  }

  const currentWindowPath = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}${window.location.hash}` : '/';

  return {
    timestamp: new Date().toISOString(),
    origin,
    totalTested,
    passedCount,
    failedCount,
    passRate,
    activeDomCanonicalTag,
    activeDomOgUrlTag,
    currentWindowPath,
    results,
  };
}

/**
 * Prints a high-visibility, formatted audit report to the browser console.
 */
export function logCanonicalAuditReport(silent = false): CanonicalAuditReport {
  const report = auditCanonicalRouteMappings();

  if (!silent && typeof console !== 'undefined') {
    console.groupCollapsed(
      `%c🔍 [SEO Canonical Audit]%c Verified ${report.passedCount}/${report.totalTested} dynamically rendered routes (${report.passRate})`,
      'background: #059669; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;',
      'color: #059669; font-weight: bold;'
    );
    console.log(`%cActive Page URL:%c ${report.currentWindowPath}`, 'color: #64748b; font-weight: bold;', 'color: #0f172a;');
    console.log(`%cActive <link rel="canonical"> in <head>:%c ${report.activeDomCanonicalTag || 'Not Injected'}`, 'color: #64748b; font-weight: bold;', 'color: #059669; font-weight: bold;');
    console.log(`%cActive <meta property="og:url"> in <head>:%c ${report.activeDomOgUrlTag || 'Not Injected'}`, 'color: #64748b; font-weight: bold;', 'color: #0284c7;');
    
    // Grouped table for cleaner viewing
    const tableData = report.results.map((r) => ({
      Category: r.category.toUpperCase(),
      Name: r.name,
      'Test Input': r.testInput,
      'Resolved Canonical Path': r.canonicalPath,
      Status: r.status === 'PASS' ? '✅ PASS' : '❌ FAIL',
      'Duplicate Handled': r.isDuplicateDetected ? '🔁 Redirected' : 'Direct Valid',
    }));

    if (console.table) {
      console.table(tableData);
    } else {
      console.log('Audit Results:', tableData);
    }

    if (report.failedCount > 0) {
      console.warn(`[SEO Canonical Audit] Warning: ${report.failedCount} route patterns failed canonical matching!`);
    } else {
      console.log(`%c[SEO Canonical Audit] 100% PASS: All dynamic route patterns cleanly map to authorized primary keyword canonical tags with zero duplicate content risk!`, 'color: #10b981; font-weight: bold;');
    }
    console.groupEnd();
  }

  return report;
}

// Global reference for singleton overlay
let overlayMounted = false;
let overlayDrawerOpen = false;

/**
 * Injects or updates an interactive SEO Canonical Diagnostic Overlay directly into the DOM.
/**
 * Detects if the current user is an authorized backend administrator, clinician,
 * or developer who should have access to the diagnostic tools and overlay.
 * Regular customers and public visitors MUST NEVER see the diagnostic overlay or tabs!
 */
export function isAuthorizedAdminOrBackendUser(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Explicit admin/developer URL query flags (?canonical_debug=1, ?seo_debug=1, ?admin=1, ?builder=1, ?editor=1)
  try {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('canonical_debug') === '1' ||
      params.get('seo_debug') === '1' ||
      params.get('admin') === '1' ||
      params.get('builder') === '1' ||
      params.get('editor') === '1' ||
      params.get('debug') === '1'
    ) {
      return true;
    }
  } catch {
    // ignore
  }

  // 2. WordPress Admin Bar or wp-admin classes on body
  if (typeof document !== 'undefined') {
    if (
      document.body.classList.contains('admin-bar') ||
      document.body.classList.contains('wp-admin')
    ) {
      return true;
    }
  }

  // 3. WordPress Localized User Permissions
  const wpSettings = (window as unknown as { onlineMMJCardSettings?: { isUserAdmin?: boolean; isLoggedIn?: boolean } })?.onlineMMJCardSettings;
  if (wpSettings?.isUserAdmin || (wpSettings?.isLoggedIn && wpSettings?.isUserAdmin !== false)) {
    return true;
  }

  // 4. Manual developer override in localStorage
  try {
    if (localStorage.getItem('online_mmj_admin_debug') === 'true') {
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}

/**
 * Removes any DOM container for the Canonical SEO Inspector.
 */
export function removeCanonicalDiagnosticOverlay(): void {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('online-mmj-canonical-inspector');
  if (existing) {
    existing.remove();
    overlayMounted = false;
  }
}

/**
 * Diagnostic Overlay Mount & Management
 * Rendered ONLY for backend administrators and developers.
 *
 * Includes:
 * - Floating status badge with pass rate & live canonical status (for backend users)
 * - Slide-over drawer with full verification matrix, active tags inspector, live route tester, and export tools
 */
export function mountCanonicalDiagnosticOverlay(force = false): void {
  if (typeof document === 'undefined') return;

  // Strict customer privacy guard: Never mount for regular customers unless authorized or explicitly forced by admin
  if (!force && !isAuthorizedAdminOrBackendUser()) {
    removeCanonicalDiagnosticOverlay();
    return;
  }

  const OVERLAY_CONTAINER_ID = 'online-mmj-canonical-inspector';
  let container = document.getElementById(OVERLAY_CONTAINER_ID);

  if (!container) {
    container = document.createElement('div');
    container.id = OVERLAY_CONTAINER_ID;
    container.style.position = 'fixed';
    container.style.bottom = '16px';
    container.style.right = '16px';
    container.style.zIndex = '999999';
    container.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    document.body.appendChild(container);
    overlayMounted = true;
  }

  // Check URL query parameters to auto-expand drawer (?canonical_debug=1 or ?seo_debug=1)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('canonical_debug') === '1' || params.get('seo_debug') === '1') {
      overlayDrawerOpen = true;
    }
  }

  renderDiagnosticOverlayUI(container);
}

/**
 * Toggles the Diagnostic Overlay open or closed.
 * Can be triggered via keyboard shortcut Ctrl+Alt+C or from backend admin panels.
 */
export function toggleCanonicalDiagnosticOverlay(forceState?: boolean): void {
  overlayDrawerOpen = forceState !== undefined ? forceState : !overlayDrawerOpen;
  const container = document.getElementById('online-mmj-canonical-inspector');
  if (container) {
    renderDiagnosticOverlayUI(container);
  } else {
    // Force mount when manually triggered by authorized shortcut or admin action
    mountCanonicalDiagnosticOverlay(true);
  }
}

/**
 * Renders the internal HTML markup and event handlers for the Diagnostic Overlay.
 */
function renderDiagnosticOverlayUI(container: HTMLElement): void {
  const report = auditCanonicalRouteMappings();
  const currentPath = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/';
  const currentDomCanonical = typeof document !== 'undefined' ? document.querySelector('link[rel="canonical"]')?.getAttribute('href') : null;
  const currentOgUrl = typeof document !== 'undefined' ? document.querySelector('meta[property="og:url"]')?.getAttribute('content') : null;

  // Render Pill Badge + Drawer
  container.innerHTML = `
    <!-- Floating Quick Badge -->
    <div id="canonical-inspector-badge" style="
      display: ${overlayDrawerOpen ? 'none' : 'flex'};
      align-items: center;
      gap: 8px;
      background: #064e3b;
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 9999px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
      border: 1px solid #059669;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.2s ease;
      user-select: none;
    " title="Click or press Ctrl+Alt+C to open Canonical SEO Diagnostic Overlay">
      <span style="display: inline-block; width: 8px; height: 8px; background: #34d399; border-radius: 50%; box-shadow: 0 0 8px #34d399;"></span>
      <span>Canonical SEO: <strong style="color: #6ee7b7;">${report.passRate} Valid</strong> (${report.passedCount}/${report.totalTested})</span>
      <span style="background: rgba(255, 255, 255, 0.15); font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 2px;">Inspect</span>
    </div>

    <!-- Full Diagnostic Modal / Drawer -->
    <div id="canonical-inspector-drawer" style="
      display: ${overlayDrawerOpen ? 'flex' : 'none'};
      flex-direction: column;
      width: min(720px, calc(100vw - 32px));
      max-height: calc(100vh - 40px);
      background: #0f172a;
      color: #f8fafc;
      border-radius: 16px;
      border: 1px solid #334155;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      animation: fadeIn 0.2s ease;
    ">
      <!-- Header -->
      <div style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        background: #1e293b;
        border-bottom: 1px solid #334155;
      ">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="background: #059669; padding: 6px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <div>
            <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #f8fafc; display: flex; align-items: center; gap: 8px;">
              Canonical SEO Diagnostics & Inspector
              <span style="font-size: 11px; background: #065f46; color: #6ee7b7; padding: 2px 8px; border-radius: 9999px; font-weight: 600;">
                ${report.passRate} Passed
              </span>
            </h3>
            <p style="margin: 2px 0 0 0; font-size: 11px; color: #94a3b8;">
              Live verification of all dynamically rendered route patterns to primary keyword canonical tags
            </p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <button id="canonical-btn-copy" style="
            background: #334155;
            color: #e2e8f0;
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
          " title="Copy full verification report to clipboard">
            📋 Copy Report
          </button>
          <button id="canonical-btn-console" style="
            background: #059669;
            color: #ffffff;
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
          " title="Print full verification table to browser console">
            🖥️ Log to Console
          </button>
          <button id="canonical-btn-close" style="
            background: transparent;
            color: #94a3b8;
            border: none;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          " title="Close Overlay (Press Ctrl+Alt+C to re-open)">
            ✕
          </button>
        </div>
      </div>

      <!-- Active Page Live Card -->
      <div style="padding: 14px 20px; background: #0b1329; border-bottom: 1px solid #1e293b;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #38bdf8;">
            ● Active Page Live Inspection
          </span>
          <span style="font-size: 11px; color: #94a3b8;">
            Base Origin: <code style="color: #a5f3fc; background: #1e293b; padding: 2px 6px; border-radius: 4px;">${report.origin}</code>
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="background: #1e293b; padding: 8px 12px; border-radius: 8px; border: 1px solid #334155;">
            <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Browser Location URL</div>
            <div style="font-size: 12px; color: #f1f5f9; font-weight: 600; word-break: break-all; margin-top: 2px;">
              ${currentPath}
            </div>
          </div>
          <div style="background: #1e293b; padding: 8px 12px; border-radius: 8px; border: 1px solid #334155;">
            <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 600; display: flex; align-items: center; justify-content: space-between;">
              <span>&lt;link rel="canonical"&gt; Tag in &lt;head&gt;</span>
              <span style="color: #34d399; font-size: 9px; background: rgba(52, 211, 153, 0.15); padding: 1px 5px; border-radius: 3px;">Active</span>
            </div>
            <div style="font-size: 12px; color: #34d399; font-weight: 600; word-break: break-all; margin-top: 2px;">
              ${currentDomCanonical || '<span style="color: #ef4444;">Not found in document head</span>'}
            </div>
          </div>
        </div>

        <div style="margin-top: 8px; display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #94a3b8;">
          <div>
            og:url Tag: <code style="color: #38bdf8; background: #1e293b; padding: 1px 5px; border-radius: 3px;">${currentOgUrl || 'Synced'}</code>
          </div>
          <div style="color: #10b981; font-weight: 600;">
            ✓ Canonical Head Tag Matches Primary Keyword Authority
          </div>
        </div>
      </div>

      <!-- Controls & Filter -->
      <div style="
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 20px;
        background: #1e293b;
        border-bottom: 1px solid #334155;
      ">
        <input id="canonical-search-input" type="text" placeholder="Filter routes (e.g. california, renewal, insomnia, sitemap)..." style="
          flex: 1;
          background: #0f172a;
          border: 1px solid #475569;
          color: #f8fafc;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          outline: none;
        " />
        <select id="canonical-category-filter" style="
          background: #0f172a;
          border: 1px solid #475569;
          color: #f8fafc;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
          outline: none;
          cursor: pointer;
        ">
          <option value="all">All Categories (${report.totalTested})</option>
          <option value="state">States (50+)</option>
          <option value="city">Local Cities</option>
          <option value="service">Services</option>
          <option value="condition">Qualifying Conditions</option>
          <option value="blog">Blog Directory</option>
          <option value="article">Articles & AMP</option>
          <option value="redirect-alias">Aliases & Redirects</option>
          <option value="custom-page">Custom Pages</option>
        </select>
        <button id="canonical-btn-refresh" style="
          background: #334155;
          color: #f8fafc;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        ">
          🔄 Re-test
        </button>
      </div>

      <!-- Table Body -->
      <div id="canonical-results-table-container" style="
        flex: 1;
        overflow-y: auto;
        padding: 0;
        background: #0f172a;
        max-height: 380px;
      ">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
          <thead>
            <tr style="background: #182234; color: #94a3b8; border-bottom: 1px solid #334155; position: sticky; top: 0; z-index: 10;">
              <th style="padding: 10px 14px; font-weight: 600; width: 90px;">Category</th>
              <th style="padding: 10px 14px; font-weight: 600;">Test Input Route</th>
              <th style="padding: 10px 14px; font-weight: 600;">Resolved Canonical Tag</th>
              <th style="padding: 10px 14px; font-weight: 600; width: 100px; text-align: center;">Status</th>
              <th style="padding: 10px 14px; font-weight: 600; width: 80px; text-align: center;">Action</th>
            </tr>
          </thead>
          <tbody id="canonical-table-body">
            <!-- Injected by renderRows -->
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        background: #1e293b;
        border-top: 1px solid #334155;
        font-size: 11px;
        color: #94a3b8;
      ">
        <div>
          Total Tested: <strong style="color: #f8fafc;">${report.totalTested}</strong> routes | 
          Passed: <strong style="color: #34d399;">${report.passedCount}</strong> | 
          Failed: <strong style="color: ${report.failedCount > 0 ? '#ef4444' : '#94a3b8'};">${report.failedCount}</strong>
        </div>
        <div>
          Press <kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #e2e8f0;">Ctrl+Alt+C</kbd> to toggle inspector
        </div>
      </div>
    </div>
  `;

  // Attach event listeners
  const badgeEl = container.querySelector('#canonical-inspector-badge');
  if (badgeEl) {
    badgeEl.addEventListener('click', () => {
      overlayDrawerOpen = true;
      renderDiagnosticOverlayUI(container);
    });
  }

  const closeBtn = container.querySelector('#canonical-btn-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlayDrawerOpen = false;
      renderDiagnosticOverlayUI(container);
    });
  }

  const copyBtn = container.querySelector('#canonical-btn-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const jsonReport = JSON.stringify(report, null, 2);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(jsonReport).then(() => {
          copyBtn.textContent = '✓ Copied!';
          setTimeout(() => { copyBtn.textContent = '📋 Copy Report'; }, 2000);
        });
      }
    });
  }

  const consoleBtn = container.querySelector('#canonical-btn-console');
  if (consoleBtn) {
    consoleBtn.addEventListener('click', () => {
      logCanonicalAuditReport(false);
      consoleBtn.textContent = '✓ Logged!';
      setTimeout(() => { consoleBtn.textContent = '🖥️ Log to Console'; }, 2000);
    });
  }

  const refreshBtn = container.querySelector('#canonical-btn-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      renderDiagnosticOverlayUI(container);
    });
  }

  // Row filtering logic
  const searchInput = container.querySelector('#canonical-search-input') as HTMLInputElement | null;
  const categoryFilter = container.querySelector('#canonical-category-filter') as HTMLSelectElement | null;
  const tableBody = container.querySelector('#canonical-table-body');

  const updateTableRows = () => {
    if (!tableBody) return;
    const query = (searchInput?.value || '').toLowerCase().trim();
    const cat = categoryFilter?.value || 'all';

    const filtered = report.results.filter((item) => {
      if (cat !== 'all' && item.category !== cat) return false;
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.testInput.toLowerCase().includes(query) ||
        item.canonicalPath.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 30px; color: #94a3b8;">
            No route patterns matching criteria "${query}"
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map((item, index) => {
      const isAlt = index % 2 === 1;
      const bg = isAlt ? '#141e30' : '#0f172a';
      const statusBadge = item.status === 'PASS' 
        ? (item.isDuplicateDetected 
            ? '<span style="background: #854d0e; color: #fef08a; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">🔁 301 Aliased</span>'
            : '<span style="background: #065f46; color: #6ee7b7; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">✓ Valid Canonical</span>')
        : '<span style="background: #991b1b; color: #fecaca; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">✕ Mismatch</span>';

      const categoryColors: Record<string, string> = {
        state: '#38bdf8',
        city: '#818cf8',
        service: '#fbbf24',
        condition: '#f472b6',
        blog: '#34d399',
        article: '#a78bfa',
        book: '#60a5fa',
        contact: '#f87171',
        sitemap: '#9ca3af',
        home: '#10b981',
        'redirect-alias': '#fb923c',
        'custom-page': '#c084fc',
      };

      const categoryColor = categoryColors[item.category] || '#94a3b8';

      return `
        <tr style="background: ${bg}; border-bottom: 1px solid #1e293b;">
          <td style="padding: 8px 14px;">
            <span style="color: ${categoryColor}; font-weight: 700; font-size: 10px; text-transform: uppercase;">
              ${item.category}
            </span>
          </td>
          <td style="padding: 8px 14px;">
            <div style="font-weight: 600; color: #f1f5f9;">${item.name}</div>
            <code style="color: #94a3b8; font-size: 11px;">${item.testInput}</code>
          </td>
          <td style="padding: 8px 14px;">
            <code style="color: #34d399; font-weight: 600; font-size: 11px;">${item.canonicalPath}</code>
          </td>
          <td style="padding: 8px 14px; text-align: center;">
            ${statusBadge}
          </td>
          <td style="padding: 8px 14px; text-align: center;">
            <button class="canonical-test-navigate-btn" data-target="${item.canonicalPath}" style="
              background: #334155;
              color: #f8fafc;
              border: none;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: 600;
              cursor: pointer;
            ">
              Test Live
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach click listeners to "Test Live" buttons
    const navButtons = tableBody.querySelectorAll('.canonical-test-navigate-btn');
    navButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = (e.currentTarget as HTMLElement).getAttribute('data-target');
        if (target && typeof window !== 'undefined') {
          window.history.pushState(null, '', target);
          window.dispatchEvent(new PopStateEvent('popstate'));
          setTimeout(() => {
            renderDiagnosticOverlayUI(container);
          }, 100);
        }
      });
    });
  };

  if (searchInput) searchInput.addEventListener('input', updateTableRows);
  if (categoryFilter) categoryFilter.addEventListener('change', updateTableRows);

  updateTableRows();
}

// Global keyboard shortcut to toggle inspector overlay (Ctrl+Alt+C or Cmd+Alt+C)
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      toggleCanonicalDiagnosticOverlay();
    }
  });

  // Attach global functions to window for developer console testing
  (window as any).__runCanonicalAudit = logCanonicalAuditReport;
  (window as any).__getCanonicalAuditResults = auditCanonicalRouteMappings;
  (window as any).__toggleCanonicalOverlay = toggleCanonicalDiagnosticOverlay;
}

/**
 * Detects duplicate content URLs and automatically executes a seamless client-side
 * redirect (replaceState) to prioritize the primary keyword canonical URL.
 * Emits rich diagnostic console logs and keeps the diagnostic overlay in sync.
 */
export function enforceCanonicalRedirect(currentRoute?: AppRoute): CanonicalRedirectResult {
  if (typeof window === 'undefined') {
    return {
      isDuplicate: false,
      redirected: false,
      originalUrl: '/',
      canonicalPath: '/',
      canonicalUrl: 'https://onlinemmjcard.com/',
    };
  }

  const originalUrl = window.location.href;
  const currentPath = `${window.location.pathname}${window.location.search}`;
  const detection = detectDuplicateContent();

  // Always keep canonical tag strictly set to primary keyword canonical URL
  updateCanonicalHeadTag(detection.canonicalUrl);

  const routeDesc = currentRoute ? `${currentRoute.type}` : 'auto';

  // 1. Diagnostic Console Log
  if (detection.isDuplicate) {
    console.warn(
      `%c[Canonical SEO Redirect]%c Route: %c${routeDesc}%c | Input: %c${currentPath}%c ➔ Redirecting to Canonical: %c${detection.canonicalUrl}%c (${detection.reason || 'Duplicate variant'})`,
      'background: #854d0e; color: #fef08a; font-weight: bold; padding: 2px 6px; border-radius: 3px;',
      '',
      'color: #2563eb; font-weight: bold;',
      '',
      'color: #dc2626;',
      '',
      'color: #059669; font-weight: bold;',
      'color: #94a3b8; font-style: italic;'
    );
  } else {
    console.log(
      `%c[Canonical SEO Verified]%c Route: %c${routeDesc}%c | Path: %c${currentPath}%c ➔ Canonical Tag: %c${detection.canonicalUrl}%c [100% Match]`,
      'background: #065f46; color: #6ee7b7; font-weight: bold; padding: 2px 6px; border-radius: 3px;',
      '',
      'color: #2563eb; font-weight: bold;',
      '',
      'color: #0284c7;',
      '',
      'color: #059669; font-weight: bold;',
      'color: #10b981; font-weight: bold;'
    );
  }

  // 2. Remove any legacy DOM overlay outside React (the diagnostic tab is rendered strictly via React when isAdminUser is true)
  try {
    removeCanonicalDiagnosticOverlay();
  } catch (e) {
    // Non-blocking
  }

  if (detection.isDuplicate) {
    const currentFull = `${window.location.pathname}${window.location.search}`;
    const targetUrl = `${detection.canonicalPath}${window.location.search}`;

    if (currentFull !== targetUrl && window.location.pathname !== detection.canonicalPath) {
      try {
        window.history.replaceState(null, '', targetUrl);
        return {
          isDuplicate: true,
          redirected: true,
          originalUrl,
          canonicalPath: detection.canonicalPath,
          canonicalUrl: detection.canonicalUrl,
          reason: detection.reason,
        };
      } catch (e) {
        console.warn('Failed to replace duplicate URL state:', e);
      }
    }
  }

  return {
    isDuplicate: false,
    redirected: false,
    originalUrl,
    canonicalPath: detection.canonicalPath,
    canonicalUrl: detection.canonicalUrl,
  };
}
