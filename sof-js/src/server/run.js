import { read } from './db.js';
import { isHtml, renderNotFound, runOperation, renderOperationDefinition } from './utils.js';
import { layout, crumb, sectionHead } from './ui.js';

function renderError(req, res, error) {
    if (isHtml(req)) {
        res.setHeader('Content-Type', 'text/html');
        res.send(layout(`
            ${sectionHead({ eyebrow: 'operation · failed', title: 'Evaluate ViewDefinition' })}
            <div class="alert">
              <div class="alert__eyebrow">error</div>
              <pre style="margin-top:0.5rem">${error}</pre>
            </div>
        `));
        res.end();
    } else if (req.headers['hx-target']) {
        res.setHeader('Content-Type', 'text/html');
        res.send(`
            <div class="alert">
              <div class="alert__eyebrow">error</div>
              <pre style="margin-top:0.5rem">${error}</pre>
            </div>
        `);
        res.end();
    } else {
        res.status(500);
        res.json({
            resourceType: 'OperationOutcome',
            issue: [{ code: 'error', message: error.toString() }]
        });
    }
}


export async function getRunFormEndpoint(req, res) {
    const id = req.params.id;
    const resource = await read(req.config, 'ViewDefinition', id);
    const operation = await read(req.config, 'OperationDefinition', '$run');
    if (resource == null) {
        renderNotFound(req, res, `Resource id = "${id}" not found`);
        return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.send(layout(`
      ${crumb([
        { href: '/', label: 'Home' },
        { href: '/ViewDefinition', label: 'View definitions' },
        { href: `/ViewDefinition/${resource.id}`, label: resource.id },
        { label: '$run' },
      ])}
      ${sectionHead({
        eyebrow: 'operation · view · $run',
        title: `$run — ${resource.name || resource.id}`,
      })}
      <form hx-get="/ViewDefinition/${resource.id}/$run/process"
            hx-target="#run-results"
            hx-swap="innerHTML"
            method="get">
        ${await renderOperationDefinition(req, operation)}
        <div class="mt-4">
          <button class="btn btn-primary" type="submit">$run</button>
        </div>
      </form>
      <div id="run-results" class="mt-6"></div>
    `));
};

function renderResult(req, res, result, format, includeHeader = true) {
    if (isHtml(req)) {
        res.setHeader('Content-Type', 'text/html');
        res.send(layout(`
            ${sectionHead({ eyebrow: 'operation · result', title: 'Evaluate ViewDefinition' })}
            <h3>Query</h3>
            <pre>${JSON.stringify(req.query, null, 2)}</pre>
            <h3>Result</h3>
            <pre>${JSON.stringify(result, null, 2)}</pre>
        `));
    } else if (format === 'json') {
        res.setHeader('Content-Type', 'application/fhir+json');
        res.send(JSON.stringify(result, null, 2));
        res.end();
    } else if (format === 'ndjson') {
        res.setHeader('Content-Type', 'application/ndjson');
        result.forEach(item => {
            res.write(JSON.stringify(item) + '\n');
        });
        res.end();
    } else if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        let csvContent = '';
        if (includeHeader && result.length > 0) {
            csvContent = Object.keys(result[0]).join(',') + '\n';
        }
        csvContent += result.map(item => Object.values(item).join(',')).join('\n');
        res.send(csvContent);
    }
}

export async function getRunEndpoint(req, res) {
    const id = req.params.id;
    const resource = await read(req.config, 'ViewDefinition', id);
    if (resource == null) {
        renderNotFound(req, res, `Resource id = "${id}" not found`);
        return;
    }
    try {
        const result = await runOperation(req, resource, req.query);
        const format = req.query.format || 'json';
        const includeHeader = req.query.header !== 'false';
        renderResult(req, res, result, format, includeHeader);
    } catch (error) {
        console.error('$run-error', error);
        renderError(req, res, error);
    }
}

function renderRunResults(query, result) {
    if (query.format === 'json') {
        return `<pre>${JSON.stringify(result, null, 2)}</pre>`;
    } else if (query.format === 'ndjson') {
        return `<pre>${result.map(item => JSON.stringify(item)).join('\n')}</pre>`;
    } else if (query.format === 'csv') {
        let csvContent = '';
        if (query.header !== 'false' && result.length > 0) {
            csvContent = Object.keys(result[0]).join(',') + '\n';
        }
        csvContent += result.map(item => Object.values(item).join(',')).join('\n');
        return `<pre>${csvContent}</pre>`;
    } else {
        return `<pre>${JSON.stringify(result, null, 2)}</pre>`;
    }
}

export async function getRunProcessEndpoint(req, res) {
    const id = req.params.id;
    const resource = await read(req.config, 'ViewDefinition', id);
    const result = await runOperation(req, resource, req.query);
    res.setHeader('Content-Type', 'text/html');
    // Fragment response for htmx swap into #run-results.
    res.send(`
      <div class="panel panel--flush mt-2">
        <div class="panel__header">
          <span>result · ${Array.isArray(result) ? result.length : 0} row${Array.isArray(result) && result.length === 1 ? '' : 's'}</span>
          <span>${(req.query.format || 'json').toUpperCase()}</span>
        </div>
        <div class="panel__body">
          <h3 style="margin-top:0">Query parameters</h3>
          <pre>${JSON.stringify(req.query, null, 2)}</pre>
          <h3>Result</h3>
          ${renderRunResults(req.query, result)}
        </div>
      </div>
    `);
}

export function mountRoutes(app) {
    app.get('/ViewDefinition/:id/\\$run/form', getRunFormEndpoint);
    app.get('/ViewDefinition/:id/\\$run/process', getRunProcessEndpoint);
    app.get('/ViewDefinition/:id/\\$run', getRunEndpoint);
}