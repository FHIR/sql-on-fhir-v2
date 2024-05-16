import { default as fhirpath } from 'fhirpath'
import fhir_r4_model from 'fhirpath/fhir-context/r4'
import { FP_DateTime, FP_Time } from 'fhirpath/src/types';

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

function checkDate (date, type) {
  let [year, month, day] = date.split('-');
  if (type == "low") {
    if (!day) {
      day = '01'
    }
    if (!month) {
      month = '01'
    }
  } else {
    if (!month) {
      month = '12';
      day = '31';
    }
    if (!day) {
      if (month == "02") {
        (year % 4 || !(year % 100) && year % 400) ? day = '28' : day = '29';
      }
      else if (["04", "06", "09", "11"].includes(month)) {
        day = '30';
      }
      else {
        day = '31';
      }
    }
  } 
  return `${year}-${month}-${day}`;
}

function lowBoundary(nodes) {
  return nodes.flatMap((node) => {
    if (node == null) {
      return null;
    }
    const { name: type } = node.getTypeInfo();
    if (type === "decimal") {
      let integer = (node.data.toString().split(".")[0] || "").length;
      let precision = (node.data.toString().split(".")[1] || "").length;
      return (integer > 8 || precision > 8) ? null : parseFloat(node.data.toFixed(8));
    }
    else if (type === "time") {
      const picoSeconds = (node.data.split(".")[1] || "").padEnd(9, 0);
      const time = new FP_Time(node.data.split(".")[0])._dateAtPrecision(2);
      return time.toISOString().split("T")[1].slice(0, -4).concat(picoSeconds);
    }
    else if(type === "date") {
      return checkDate(node.data, "low");
    }
    else if (type === 'dateTime') {
      var timeHMS, timeZone, picoSeconds;
      var [date, time] = node.data.split("T");
      if (date) var dateObj = checkDate(date, "low");
      if (time) {
        var matchResult = time.match(/(\d{2}:\d{2}(?::\d{2})?)(?:\.(\d+))?(Z|[\+\-]\d{2}:\d{2})?/);
        if (matchResult) {
            [, timeHMS, picoSeconds, timeZone] = matchResult;
        }
      }
      if (timeHMS) dateObj = date.concat("T", timeHMS);
      const dateTime = new FP_DateTime(dateObj)._dateAtPrecision(5);
      const newDate = dateTime.toISOString().split("T")[0];
      if (picoSeconds == undefined) picoSeconds = "0";
      const newTime = dateTime.toISOString().split("T")[1].slice(0, -4).concat(picoSeconds.padEnd(9, 0));
      return newDate.concat("T", newTime, (timeZone == undefined) ? timeZone = "+14:00" : timeZone);
    }
    return [node];
  })
}

function highBoundary(nodes) {
  return nodes.flatMap((node) => {
    if (node == null) {
      return null;
    }
    const { name: type } = node.getTypeInfo();
    if (type === "decimal") {
      let integer = (node.data.toString().split(".")[0] || "").length;
      let precision = (node.data.toString().split(".")[1] || "").length;
      return (integer > 8 || precision > 8) 
            ? null 
            : parseFloat(node.data.toString().split(".")[0] + '.' + (node.data.toString().split(".")[1] || "").padEnd(8, 9));
    }
    else if (type === "time") {
      const hasSeconds = node.data.split(":").length == 3;
      const picoSeconds = (node.data.split(".")[1] || "").padEnd(9, 9);
      const time = new FP_Time(node.data.split(".")[0])._dateAtPrecision(2);
      if (!hasSeconds) time.setSeconds(59);
      return time.toISOString().split("T")[1].slice(0, -4).concat(picoSeconds);
    }
    else if (type === "date") {
      return checkDate(node.data, "high");
    }
    else if (type === "dateTime") {
      var timeHMS, timeZone, picoSeconds;
      var [date, time] = node.data.split("T");
      if (date) var dateObj = checkDate(date, "high");
      if (time) {
        var matchResult = time.match(/(\d{2}:\d{2}(?::\d{2})?)(?:\.(\d+))?(Z|[\+\-]\d{2}:\d{2})?/);
        if (matchResult) {
            [, timeHMS, picoSeconds, timeZone] = matchResult;
        }
        var [hours, minutes, seconds] = timeHMS.split(":");
      }
      if (timeHMS) dateObj = date.concat("T", timeHMS);
      const dateTime = new FP_DateTime(dateObj)._dateAtPrecision(5);
      const newDate = dateTime.toISOString().split("T")[0];
      if (hours == undefined) dateTime.setHours(23);
      if (minutes == undefined) dateTime.setMinutes(59);
      if (seconds == undefined) dateTime.setSeconds(59);
      if (picoSeconds == undefined) picoSeconds = "9";
      const newTime = dateTime.toISOString().split("T")[1].slice(0, -4).concat(picoSeconds.padEnd(9, 9));
      return newDate.concat("T", newTime, (timeZone == undefined) ? timeZone = "-12:00" : timeZone);
    }
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
    lowBoundary:     { fn: lowBoundary, arity: { 0: [] }, nullable: true, internalStructures: true},
    highBoundary:    { fn: highBoundary, arity: { 0: [] }, nullable: true, internalStructures: true},
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
  return fhirpath.evaluate(data, rewrite_path(path), process_constants(constants), fhir_r4_model, fhirpath_options);
}

export function fhirpath_validate(path) {
  try {
    fhirpath.compile(path, null, fhirpath_options);
    return true;
  } catch (e) {
    return false;
  }
}
