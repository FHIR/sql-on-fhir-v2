import { fhirpath_evaluate } from './path.js'

export function merge(a,b) {
  return Object.assign({}, a, b);
}

export function row_product(parts) {
  let rows = [{}];
  let new_rows = null;
  parts.forEach((partial_rows) => {
    new_rows = [];
    partial_rows.forEach((partial_row)=> {
      rows.forEach((row)=> {
        new_rows.push(merge(partial_row,row))
      })
    })
    rows = new_rows;
  });
  return rows;
}

function get_columns(column, node) {
  let record = {};
  column.forEach((c) => {
    let vs = fhirpath_evaluate( node, c.path);
    if(c.collection) {
      record[c.name] = vs;
    } else if (vs.length <= 1) {
      let v = vs[0];
      record[c.name] = (v === undefined) ? null : v;
    } else {
      throw new Error('Collection value for ' + c.path + ' => ' + JSON.stringify(vs))
    }
  });
  return record;

}

function process_rows(column, nodes) {
  return nodes.map((node)=> {
    return get_columns(column, node);
  })
}

function get_nodes(select, node) {
  let nodes = null;
  if(select.forEach) {
    nodes = fhirpath_evaluate(node, select.forEach)
  } else if (select.forEachOrNull) {
    nodes = fhirpath_evaluate(node, select.forEach)
    if(nodes.length == 0) { nodes = [{}] }
  } else {
    nodes = [node]
  }
  return nodes;
}


function process_union(select, nodes) {
  return nodes.flatMap((node)=> {
    let union_rows = select.unionAll.flatMap((s)=> {
      let res = process_select_clause(s, node);
      return res;
    })
    if(select.column){
      union_rows = row_product([[get_columns(select.column, node)], union_rows]);
    }
    return union_rows;
  })
}

function process_select_clause(select, node) {
  //there are two options
  // 1. we unroll collections with forEach(OrNull)
  // 2. or just process the node
  let nodes = get_nodes(select, node);

  if( select.select ) {
    return process_select(select, nodes);
  } else if( select.unionAll ) {
    return process_union(select, nodes);
  } else if(select.column) {
    return  process_rows(select.column, nodes);
  }
  throw new Error('unexpected');
}

function filter_where(nodes, where) {
  if(!where) { return nodes };
  return nodes.filter((x)=>{
    return false
  })
}

function process_select(definition, nodes) {
  if(definition.column) { definition.select.unshift({column: definition.column})}
  return filter_where(nodes, definition.where)
    .flatMap((node)=>{
      let partial_rows = definition.select.map((s)=> {return process_select_clause(s, node)});
      return row_product(partial_rows)
    })
}


export function validate(viewdef, opts) {
  //TBD
}

export function compile(viewdef) {
  //TBD
}

export function evaluate(viewdef, nodes) {
  return process_select(viewdef, nodes);
}
