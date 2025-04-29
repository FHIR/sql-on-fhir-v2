
function isObject(value) {
  return typeof value === 'object' && value !== null;
}

function joinTags(tags) {
  return tags.map(tag => Array.isArray(tag) ? joinTags(tag) : tag).join('');
}

export function formatAttrs(attrs) {
  return Object.entries(attrs)
  .map(([key, value]) =>  {
    if (isObject(value)) {  
      return Object.entries(value)
        .map(([k, v]) => `${key}-${k}="${v}"`)
        .join(' ');
    } else {
      return `${key}="${value}"`;
    }
  })
  .join(' ');
}

export function div(attrs, ...children) {
  return `<div ${formatAttrs(attrs)}>${joinTags(children)}</div>`;
}

export function span(attrs, ...children) {
  return `<span ${formatAttrs(attrs)}>${joinTags(children)}</span>`;
}

export function ul(attrs, ...children) {
  return `<ul ${formatAttrs(attrs)}>${joinTags(children)}</ul>`;
}

export function li(attrs, ...children) {
  return `<li ${formatAttrs(attrs)}>${joinTags(children)}</li>`;
}

export function ol(attrs, ...children) {
  return `<ol ${formatAttrs(attrs)}>${joinTags(children)}</ol>`;
}

export function input(attrs) {
  return `<input ${formatAttrs(attrs)} />`;
}

export function select(attrs, ...children) {
  return `<select ${formatAttrs(attrs)}>${joinTags(children)}</select>`;
}

export function option(attrs, ...children) {
  return `<option ${formatAttrs(attrs)}>${joinTags(children)}</option>`;
}

export function textarea(attrs) {
  return `<textarea ${formatAttrs(attrs)} />`;
}

export function html(...children) {
  return `<!DOCTYPE html>${joinTags(children)}</html>`;
}

export function head(...children) {
  return `<head>${joinTags(children)}</head>`;
}

export function body(attrs, ...children) {
  return `<body ${formatAttrs(attrs)}>${joinTags(children)}</body>`;
}

export function title(attrs, ...children) {
  return `<title ${formatAttrs(attrs)}>${joinTags(children)}</title>`;
}

export function form(attrs, ...children) {
  return `<form ${formatAttrs(attrs)}>${joinTags(children)}</form>`;
}

export function button(attrs, ...children) {
  return `<button ${formatAttrs(attrs)}>${joinTags(children)}</button>`;
}

export function a(attrs, ...children) {
  return `<a ${formatAttrs(attrs)}>${joinTags(children)}</a>`;
}

export function img(attrs, ...children) {
  return `<img ${formatAttrs(attrs)} />`;
}

export function css(path) {
  return `<link rel="stylesheet" href="${path}" />`;
}

export function js(path) {
  return `<script src="${path}"></script>`;
}

let frm = form({hx: {post: '/test'}, data: {name: 'test'}},
  input({type: 'text', name: 'name' }),
  input({type: 'email', name: 'email'}),
  input({type: 'password', name: 'password'}),
  button({type: 'submit'}, 'Submit'),
)

let res = html(
  head(
    title({},'Sof.js'),
    js('/static/app.js'),
    css('/static/app.css'),
  ),
  body({id: 'body'},
    div({ hx: { get: '/test', target: '#body' }, class: 'p-4 text-sm' },
      select({ name: 'test' }, [1,2,3].map(i => option({ value: i }, i))),
      input({ value: 'hi' }),
      textarea({ value: 'hi' }),
      a({href: '/test'}, 'Test'),
      frm,
      img({src: '/test.png'}),
    )
  )
)

console.log(res);
