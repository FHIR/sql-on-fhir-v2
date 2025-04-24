
export function formatAttrs(attrs) {
  return Object.entries(attrs).map(([key, value]) => `${key}="${value}"`).join(' ');
}

export function div(attrs, ...children) {
  return `<div ${formatAttrs(attrs)}>${children.join('')}</div>`;
}

export function span(attrs, ...children) {
  return `<span ${formatAttrs(attrs)}>${children.join('')}</span>`;
}

export function ul(attrs, ...children) {
  return `<ul ${formatAttrs(attrs)}>${children.join('')}</ul>`;
}

export function li(attrs, ...children) {
  return `<li ${formatAttrs(attrs)}>${children.join('')}</li>`;
}

export function ol(attrs, ...children) {
  return `<ol ${formatAttrs(attrs)}>${children.join('')}</ol>`;
}

export function input(attrs) {
  return `<input ${formatAttrs(attrs)} />`;
}

export function select(attrs, ...children) {
  return `<select ${formatAttrs(attrs)}>${children.join('')}</select>`;
}

div({},
    select({name: 'test'},
        option({value: '1'}, '1'),
        option({value: '2'}, '2'),
        option({value: '3'}, '3')
    ),
    input({value: 'hi'}),
    textarea({value: 'hi'}),
)

