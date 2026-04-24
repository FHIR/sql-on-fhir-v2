/**
 * UI layout primitives for the reference server.
 *
 * Author: John Grimes.
 */

/**
 * Render the masthead shown at the top of every page.
 * @returns {string} HTML markup for the masthead.
 */
function masthead() {
  return `
    <header class="masthead">
      <div class="masthead__inner">
        <div class="flex flex-col leading-tight">
          <a href="/" class="masthead__title">SQL on FHIR</a>
          <span class="masthead__subtitle">Reference Implementation</span>
        </div>
        <nav class="masthead__nav">
          <a href="/metadata">Capability</a>
          <a href="/ViewDefinition">Views</a>
          <a href="/Library">SQL</a>
        </nav>
      </div>
    </header>
  `;
}

/**
 * Render the footer shown at the bottom of every page.
 * @returns {string} HTML markup for the footer.
 */
function footer() {
  return `
    <footer class="footer">
      <span>SQL on FHIR · reference server</span>
      <span>sof-js</span>
      <a class="plain" href="https://github.com/FHIR/sql-on-fhir-v2">GitHub ⇢</a>
    </footer>
  `;
}

/**
 * Build a breadcrumb trail.
 * @param {Array<{href?: string, label: string}>} items - Crumbs; the last
 *   entry is rendered as the current page.
 * @returns {string} HTML markup for the breadcrumbs.
 */
export function crumb(items) {
  const parts = items.map((item, i) => {
    const isLast = i === items.length - 1;
    if (isLast || !item.href) {
      return `<span class="crumb__current">${item.label}</span>`;
    }
    return `<a href="${item.href}">${item.label}</a>`;
  });
  return `
    <nav class="crumb">
      ${parts.join('<span class="crumb__sep">›</span>')}
    </nav>
  `;
}

/**
 * Render a section header with an eyebrow, title, and optional actions.
 * @param {{eyebrow?: string, title: string, actions?: string}} opts - The
 *   section metadata.
 * @returns {string} HTML markup for the section header.
 */
export function sectionHead({ eyebrow, title, actions }) {
  return `
    <div class="section-head">
      <div class="section-head__titles">
        ${eyebrow ? `<span class="section-head__eyebrow">${eyebrow}</span>` : ''}
        <h1>${title}</h1>
      </div>
      ${actions ? `<div class="section-head__actions">${actions}</div>` : ''}
    </div>
  `;
}

/**
 * Wrap page content in the standard shell (masthead + page padding + footer).
 * @param {string} content - HTML body content.
 * @returns {string} The wrapped shell markup.
 */
export function shell(content) {
  return `
    ${masthead()}
    <main class="page">
      ${content}
    </main>
    <div class="page" style="padding-top:0;padding-bottom:0">
      ${footer()}
    </div>
  `;
}

/**
 * Produce the full HTML document for a page.
 * @param {string} content - Body content to render inside the shell.
 * @returns {string} The full HTML document.
 */
export function layout(content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SQL on FHIR</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <script src="/htmx.js"></script>
      <script src="/app.js"></script>
      <link href="/app.css" rel="stylesheet"></link>
    </head>
    <body>
      ${shell(content)}
    </body>
    </html>
  `;
}
