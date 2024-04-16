import { default as fhirpath } from 'fhirpath'
// @note: These are not exported by main export, but could be because they are useful
import { FP_Date, FP_DateTime, FP_Time, timeRE, dateTimeRE } from 'fhirpath/src/types';

// @note this is not exported by fhirpath/src/types but should be
let dateRE = new RegExp(
  '^[0-9][0-9][0-9][0-9](-[0-9][0-9](-[0-9][0-9])?)?$');

const identity = (ctx, v) => [v]

function getResourceKey(nodes) {
  return nodes.flatMap((node) => {
    return [node.id]
  })
}

function getReferenceKey(nodes, opts) {
  let resource = opts?.name;
  return nodes.flatMap((node) => {
    const parts = node.reference.replaceAll('//', '').split('/_history')[0].split('/')
    const type = parts[parts.length - 2];
    const key  = parts[parts.length - 1];
    if(!resource) {
      return [key];
    } else if(resource && resource == type) {
      return [key];
    } else {
      return []
    }
  })
}

function lowBoundary(nodes) {
  return nodes.flatMap((node) => {
    if (node == null) {
      return null;
    }
    if (node.match(timeRE)) {
      const picoSeconds = (node.split(".")[1] || "").padEnd(9, 0);
      const time = new FP_Time(node.split(".")[0])._dateAtPrecision(2);
      return time.toISOString().split("T")[1].slice(0, -4).concat(picoSeconds);
    }
    // @note for some examples of Dates and DateTimes, both are matched by this regex
    // else if(node.match(dateRE)) {
    //   let [year, month, day] = node.split('-');
    //   if (!day) {
    //     day = '01'
    //   }
    //   if (!month) {
    //     month = '01'
    //   }
    //   return `${year}-${month}-${day}`;
    // }
    // if (node.match(dateTimeRE)) {
    //   const picoSeconds = (node.split(".")[1] || "").padEnd(9, 0);
    //   const hasTimeZone = (node.split('-').length == 4 || node.includes('+'));
    //   const dateTime = new FP_DateTime(node.split(".")[0])._dateAtPrecision(5);
    //   const date = dateTime.toISOString().split("T")[0];
    //   const time = dateTime.toISOString().split("T")[1].slice(0, -4).concat(picoSeconds);
    //   if (hasTimeZone) {
    //     //let timeZone = 

    //   } else {
    //     time.concat("+14:00")
    //   }
    //   return date.concat("T", time);
    // }
    return [node];
  })
}

function highBoundary(nodes) {
  return nodes.flatMap((node) => {
    if (node == null) {
      return null;
    }
    if (node.match(timeRE)) {
      const hasSeconds = node.split(":").length == 3;
      const picoSeconds = (node.split(".")[1] || "").padEnd(9, 9);
      const time = new FP_Time(node.split(".")[0])._dateAtPrecision(2);
      if (!hasSeconds) time.setSeconds(59);
      return time.toISOString().split("T")[1].slice(0, -4).concat(picoSeconds);
    }
    // @note for some examples of Dates and DateTimes, both are matched by this regex
    // else if (node.match(dateRE)) {
    //   let [year, month, day] = node.split('-');
    //   if (!month) {
    //     month = '12';
    //     day = '31';
    //   }
    //   if (!day) {
    //     if (month == "02") {
    //       (year % 4) ? day = '28' : day = '29';
    //     }
    //     else if (["04", "06", "09", "11"].includes(month)) {
    //       day = '30';
    //     }
    //     else {
    //       day = '31';
    //     }
    //   }
    //   return `${year}-${month}-${day}`;
    // }
    return [node];
  })
}

function ofType(ctx, nodes, a1, a2, a3) {
  console.log('of type nodes', nodes, a1, a2, a3)
  return 'ups'
}


function rewrite_path(path) {
  if(path.startsWith('$this')){
    path =  'identity()' + path.slice('$this'.length)
  }
  const ofTypeRegex = /\.ofType\(([^)]+)\)/g
  let match
  // HACK: fhirpath.js only knows that `Observation.value.ofType(Quantity)`
  // refers to `Observation.valueQuantity` if load FHIR models... which
  // we otherwise don't need. So here, just wrestle into explicit properties.
  while ((match = ofTypeRegex.exec(path)) !== null) {
    const replacement = match[1].charAt(0).toUpperCase() + match[1].slice(1)
    path = path.replace(match[0], `${replacement}`)
  }
  return path;
}


let fhirpath_options = {
  userInvocationTable: {
    getResourceKey:  { fn: getResourceKey, arity: { 0: [] } },
    getReferenceKey: { fn: getReferenceKey, arity: { 0: [], 1: ['TypeSpecifier'] } },
    identity:        { fn: (nodes) => nodes, arity: { 0: [] } },
    lowBoundary:     { fn: lowBoundary, arity: { 0: [] }, nullable: true},
    highBoundary:    { fn: highBoundary, arity: { 0: [] }, nullable: true},
  }
}

function process_constants(constants) {
  return constants.reduce((acc, x) => {
    let name, val;
    for (const key in x) {
      if (key === "name") {
        name = x[key];
      }
      if (key.startsWith("value")) {
        val = x[key];
      }
    }
    acc[name] = val;
    return acc;
  }, {});
}

export function fhirpath_evaluate(data, path, constants = []) {
  return fhirpath.evaluate(data, rewrite_path(path), process_constants(constants), null, fhirpath_options);
}

export function fhirpath_validate(path) {
  try {
    fhirpath.compile(path, null, fhirpath_options);
    return true;
  } catch (e) {
    return false;
  }
}
