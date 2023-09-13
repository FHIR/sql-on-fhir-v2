var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toCommonJS = (from) => {
  const moduleCache = __toCommonJS.moduleCache ??= new WeakMap;
  var cached = moduleCache.get(from);
  if (cached)
    return cached;
  var to = __defProp({}, "__esModule", { value: true });
  var desc = { enumerable: false };
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key))
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  moduleCache.set(from, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    name: "fhirpath",
    version: "3.6.1",
    description: "A FHIRPath engine",
    main: "src/fhirpath.js",
    dependencies: {
      "@lhncbc/ucum-lhc": "^4.1.3",
      antlr4: "~4.9.3",
      commander: "^2.18.0",
      "date-fns": "^1.30.1",
      "js-yaml": "^3.13.1"
    },
    devDependencies: {
      "@babel/core": "^7.21.4",
      "@babel/eslint-parser": "^7.17.0",
      "@babel/preset-env": "^7.16.11",
      "babel-loader": "^8.2.3",
      benny: "^3.7.1",
      bestzip: "^2.2.0",
      "copy-webpack-plugin": "^6.0.3",
      cypress: "^10.3.0",
      eslint: "^8.10.0",
      fhir: "^4.10.3",
      grunt: "^1.5.2",
      "grunt-cli": "^1.4.3",
      "grunt-text-replace": "^0.4.0",
      "jasmine-spec-reporter": "^4.2.1",
      jest: "^27.3.1",
      "jit-grunt": "^0.10.0",
      lodash: "^4.17.21",
      open: "^8.4.0",
      rimraf: "^3.0.0",
      tmp: "0.0.33",
      webpack: "^5.11.1",
      "webpack-bundle-analyzer": "^4.4.2",
      "webpack-cli": "^4.9.1",
      xml2js: "^0.5.0",
      yargs: "^15.1.0"
    },
    engines: {
      node: ">=8.9.0"
    },
    scripts: {
      generateParser: "cd src/parser; rimraf ./generated/*; java -Xmx500M -cp \"../../antlr-4.9.3-complete.jar:$CLASSPATH\" org.antlr.v4.Tool -o generated -Dlanguage=JavaScript FHIRPath.g4; grunt updateParserRequirements",
      build: "cd browser-build && webpack && rimraf fhirpath.zip && bestzip fhirpath.zip LICENSE.md fhirpath.min.js fhirpath.r5.min.js fhirpath.r4.min.js fhirpath.stu3.min.js fhirpath.dstu2.min.js && rimraf  LICENSE.md",
      "test:unit": "jest && TZ=America/New_York jest && TZ=Europe/Paris jest",
      "test:unit:debug": "echo 'open chrome chrome://inspect/' && node --inspect node_modules/.bin/jest --runInBand",
      "build:demo": "npm run build && cd demo && npm run build",
      "test:e2e": "npm run build:demo && cypress run",
      test: "npm run lint && npm run test:unit && npm run test:e2e && echo \"For tests specific to IE 11, open browser-build/test/index.html in IE 11, and confirm that the tests on that page pass.\"",
      lint: "eslint src/parser/index.js src/*.js converter/",
      "compare-performance": "node ./test/benchmark.js"
    },
    bin: {
      fhirpath: "bin/fhirpath"
    },
    repository: "github:HL7/fhirpath.js",
    license: "MIT"
  };
});

// node_modules/antlr4/src/antlr4/Utils.js
var require_Utils = __commonJS((exports, module) => {
  var valueToString = function(v) {
    return v === null ? "null" : v;
  };
  var arrayToString = function(a) {
    return Array.isArray(a) ? "[" + a.map(valueToString).join(", ") + "]" : "null";
  };
  var standardEqualsFunction = function(a, b) {
    return a ? a.equals(b) : a == b;
  };
  var standardHashCodeFunction = function(a) {
    return a ? a.hashCode() : -1;
  };
  var hashStuff = function() {
    const hash = new Hash2;
    hash.update.apply(hash, arguments);
    return hash.finish();
  };
  var escapeWhitespace = function(s, escapeSpaces) {
    s = s.replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
    if (escapeSpaces) {
      s = s.replace(/ /g, "\xB7");
    }
    return s;
  };
  var titleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
  };
  var equalArrays = function(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b))
      return false;
    if (a === b)
      return true;
    if (a.length !== b.length)
      return false;
    for (let i = 0;i < a.length; i++) {
      if (a[i] === b[i])
        continue;
      if (!a[i].equals || !a[i].equals(b[i]))
        return false;
    }
    return true;
  };
  String.prototype.seed = String.prototype.seed || Math.round(Math.random() * Math.pow(2, 32));
  String.prototype.hashCode = function() {
    const key = this.toString();
    let h1b, k1;
    const remainder = key.length & 3;
    const bytes = key.length - remainder;
    let h1 = String.prototype.seed;
    const c1 = 3432918353;
    const c2 = 461845907;
    let i = 0;
    while (i < bytes) {
      k1 = key.charCodeAt(i) & 255 | (key.charCodeAt(++i) & 255) << 8 | (key.charCodeAt(++i) & 255) << 16 | (key.charCodeAt(++i) & 255) << 24;
      ++i;
      k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
      k1 = k1 << 15 | k1 >>> 17;
      k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
      h1 ^= k1;
      h1 = h1 << 13 | h1 >>> 19;
      h1b = (h1 & 65535) * 5 + (((h1 >>> 16) * 5 & 65535) << 16) & 4294967295;
      h1 = (h1b & 65535) + 27492 + (((h1b >>> 16) + 58964 & 65535) << 16);
    }
    k1 = 0;
    switch (remainder) {
      case 3:
        k1 ^= (key.charCodeAt(i + 2) & 255) << 16;
      case 2:
        k1 ^= (key.charCodeAt(i + 1) & 255) << 8;
      case 1:
        k1 ^= key.charCodeAt(i) & 255;
        k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
        k1 = k1 << 15 | k1 >>> 17;
        k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
        h1 ^= k1;
    }
    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = (h1 & 65535) * 2246822507 + (((h1 >>> 16) * 2246822507 & 65535) << 16) & 4294967295;
    h1 ^= h1 >>> 13;
    h1 = (h1 & 65535) * 3266489909 + (((h1 >>> 16) * 3266489909 & 65535) << 16) & 4294967295;
    h1 ^= h1 >>> 16;
    return h1 >>> 0;
  };

  class Set2 {
    constructor(hashFunction, equalsFunction) {
      this.data = {};
      this.hashFunction = hashFunction || standardHashCodeFunction;
      this.equalsFunction = equalsFunction || standardEqualsFunction;
    }
    add(value) {
      const hash = this.hashFunction(value);
      const key = "hash_" + hash;
      if (key in this.data) {
        const values = this.data[key];
        for (let i = 0;i < values.length; i++) {
          if (this.equalsFunction(value, values[i])) {
            return values[i];
          }
        }
        values.push(value);
        return value;
      } else {
        this.data[key] = [value];
        return value;
      }
    }
    contains(value) {
      return this.get(value) != null;
    }
    get(value) {
      const hash = this.hashFunction(value);
      const key = "hash_" + hash;
      if (key in this.data) {
        const values = this.data[key];
        for (let i = 0;i < values.length; i++) {
          if (this.equalsFunction(value, values[i])) {
            return values[i];
          }
        }
      }
      return null;
    }
    values() {
      let l = [];
      for (const key in this.data) {
        if (key.indexOf("hash_") === 0) {
          l = l.concat(this.data[key]);
        }
      }
      return l;
    }
    toString() {
      return arrayToString(this.values());
    }
    get length() {
      let l = 0;
      for (const key in this.data) {
        if (key.indexOf("hash_") === 0) {
          l = l + this.data[key].length;
        }
      }
      return l;
    }
  }

  class BitSet {
    constructor() {
      this.data = [];
    }
    add(value) {
      this.data[value] = true;
    }
    or(set) {
      const bits = this;
      Object.keys(set.data).map(function(alt) {
        bits.add(alt);
      });
    }
    remove(value) {
      delete this.data[value];
    }
    contains(value) {
      return this.data[value] === true;
    }
    values() {
      return Object.keys(this.data);
    }
    minValue() {
      return Math.min.apply(null, this.values());
    }
    hashCode() {
      const hash = new Hash2;
      hash.update(this.values());
      return hash.finish();
    }
    equals(other) {
      if (!(other instanceof BitSet)) {
        return false;
      }
      return this.hashCode() === other.hashCode();
    }
    toString() {
      return "{" + this.values().join(", ") + "}";
    }
    get length() {
      return this.values().length;
    }
  }

  class Map {
    constructor(hashFunction, equalsFunction) {
      this.data = {};
      this.hashFunction = hashFunction || standardHashCodeFunction;
      this.equalsFunction = equalsFunction || standardEqualsFunction;
    }
    put(key, value) {
      const hashKey = "hash_" + this.hashFunction(key);
      if (hashKey in this.data) {
        const entries = this.data[hashKey];
        for (let i = 0;i < entries.length; i++) {
          const entry = entries[i];
          if (this.equalsFunction(key, entry.key)) {
            const oldValue = entry.value;
            entry.value = value;
            return oldValue;
          }
        }
        entries.push({ key, value });
        return value;
      } else {
        this.data[hashKey] = [{ key, value }];
        return value;
      }
    }
    containsKey(key) {
      const hashKey = "hash_" + this.hashFunction(key);
      if (hashKey in this.data) {
        const entries = this.data[hashKey];
        for (let i = 0;i < entries.length; i++) {
          const entry = entries[i];
          if (this.equalsFunction(key, entry.key))
            return true;
        }
      }
      return false;
    }
    get(key) {
      const hashKey = "hash_" + this.hashFunction(key);
      if (hashKey in this.data) {
        const entries = this.data[hashKey];
        for (let i = 0;i < entries.length; i++) {
          const entry = entries[i];
          if (this.equalsFunction(key, entry.key))
            return entry.value;
        }
      }
      return null;
    }
    entries() {
      let l = [];
      for (const key in this.data) {
        if (key.indexOf("hash_") === 0) {
          l = l.concat(this.data[key]);
        }
      }
      return l;
    }
    getKeys() {
      return this.entries().map(function(e) {
        return e.key;
      });
    }
    getValues() {
      return this.entries().map(function(e) {
        return e.value;
      });
    }
    toString() {
      const ss = this.entries().map(function(entry) {
        return "{" + entry.key + ":" + entry.value + "}";
      });
      return "[" + ss.join(", ") + "]";
    }
    get length() {
      let l = 0;
      for (const hashKey in this.data) {
        if (hashKey.indexOf("hash_") === 0) {
          l = l + this.data[hashKey].length;
        }
      }
      return l;
    }
  }

  class AltDict {
    constructor() {
      this.data = {};
    }
    get(key) {
      key = "k-" + key;
      if (key in this.data) {
        return this.data[key];
      } else {
        return null;
      }
    }
    put(key, value) {
      key = "k-" + key;
      this.data[key] = value;
    }
    values() {
      const data = this.data;
      const keys = Object.keys(this.data);
      return keys.map(function(key) {
        return data[key];
      });
    }
  }

  class DoubleDict {
    constructor(defaultMapCtor) {
      this.defaultMapCtor = defaultMapCtor || Map;
      this.cacheMap = new this.defaultMapCtor;
    }
    get(a, b) {
      const d = this.cacheMap.get(a) || null;
      return d === null ? null : d.get(b) || null;
    }
    set(a, b, o) {
      let d = this.cacheMap.get(a) || null;
      if (d === null) {
        d = new this.defaultMapCtor;
        this.cacheMap.put(a, d);
      }
      d.put(b, o);
    }
  }

  class Hash2 {
    constructor() {
      this.count = 0;
      this.hash = 0;
    }
    update() {
      for (let i = 0;i < arguments.length; i++) {
        const value = arguments[i];
        if (value == null)
          continue;
        if (Array.isArray(value))
          this.update.apply(this, value);
        else {
          let k = 0;
          switch (typeof value) {
            case "undefined":
            case "function":
              continue;
            case "number":
            case "boolean":
              k = value;
              break;
            case "string":
              k = value.hashCode();
              break;
            default:
              if (value.updateHashCode)
                value.updateHashCode(this);
              else
                console.log("No updateHashCode for " + value.toString());
              continue;
          }
          k = k * 3432918353;
          k = k << 15 | k >>> 32 - 15;
          k = k * 461845907;
          this.count = this.count + 1;
          let hash = this.hash ^ k;
          hash = hash << 13 | hash >>> 32 - 13;
          hash = hash * 5 + 3864292196;
          this.hash = hash;
        }
      }
    }
    finish() {
      let hash = this.hash ^ this.count * 4;
      hash = hash ^ hash >>> 16;
      hash = hash * 2246822507;
      hash = hash ^ hash >>> 13;
      hash = hash * 3266489909;
      hash = hash ^ hash >>> 16;
      return hash;
    }
  }
  module.exports = {
    Hash: Hash2,
    Set: Set2,
    Map,
    BitSet,
    AltDict,
    DoubleDict,
    hashStuff,
    escapeWhitespace,
    arrayToString,
    titleCase,
    equalArrays
  };
});

// node_modules/antlr4/src/antlr4/Token.js
var require_Token = __commonJS((exports, module) => {
  class Token {
    constructor() {
      this.source = null;
      this.type = null;
      this.channel = null;
      this.start = null;
      this.stop = null;
      this.tokenIndex = null;
      this.line = null;
      this.column = null;
      this._text = null;
    }
    getTokenSource() {
      return this.source[0];
    }
    getInputStream() {
      return this.source[1];
    }
    get text() {
      return this._text;
    }
    set text(text) {
      this._text = text;
    }
  }
  Token.INVALID_TYPE = 0;
  Token.EPSILON = -2;
  Token.MIN_USER_TOKEN_TYPE = 1;
  Token.EOF = -1;
  Token.DEFAULT_CHANNEL = 0;
  Token.HIDDEN_CHANNEL = 1;

  class CommonToken extends Token {
    constructor(source, type, channel, start, stop) {
      super();
      this.source = source !== undefined ? source : CommonToken.EMPTY_SOURCE;
      this.type = type !== undefined ? type : null;
      this.channel = channel !== undefined ? channel : Token.DEFAULT_CHANNEL;
      this.start = start !== undefined ? start : -1;
      this.stop = stop !== undefined ? stop : -1;
      this.tokenIndex = -1;
      if (this.source[0] !== null) {
        this.line = source[0].line;
        this.column = source[0].column;
      } else {
        this.column = -1;
      }
    }
    clone() {
      const t = new CommonToken(this.source, this.type, this.channel, this.start, this.stop);
      t.tokenIndex = this.tokenIndex;
      t.line = this.line;
      t.column = this.column;
      t.text = this.text;
      return t;
    }
    toString() {
      let txt = this.text;
      if (txt !== null) {
        txt = txt.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
      } else {
        txt = "<no text>";
      }
      return "[@" + this.tokenIndex + "," + this.start + ":" + this.stop + "='" + txt + "',<" + this.type + ">" + (this.channel > 0 ? ",channel=" + this.channel : "") + "," + this.line + ":" + this.column + "]";
    }
    get text() {
      if (this._text !== null) {
        return this._text;
      }
      const input = this.getInputStream();
      if (input === null) {
        return null;
      }
      const n = input.size;
      if (this.start < n && this.stop < n) {
        return input.getText(this.start, this.stop);
      } else {
        return "<EOF>";
      }
    }
    set text(text) {
      this._text = text;
    }
  }
  CommonToken.EMPTY_SOURCE = [null, null];
  module.exports = {
    Token,
    CommonToken
  };
});

// node_modules/antlr4/src/antlr4/atn/ATNState.js
var require_ATNState = __commonJS((exports, module) => {
  class ATNState {
    constructor() {
      this.atn = null;
      this.stateNumber = ATNState.INVALID_STATE_NUMBER;
      this.stateType = null;
      this.ruleIndex = 0;
      this.epsilonOnlyTransitions = false;
      this.transitions = [];
      this.nextTokenWithinRule = null;
    }
    toString() {
      return this.stateNumber;
    }
    equals(other) {
      if (other instanceof ATNState) {
        return this.stateNumber === other.stateNumber;
      } else {
        return false;
      }
    }
    isNonGreedyExitState() {
      return false;
    }
    addTransition(trans, index) {
      if (index === undefined) {
        index = -1;
      }
      if (this.transitions.length === 0) {
        this.epsilonOnlyTransitions = trans.isEpsilon;
      } else if (this.epsilonOnlyTransitions !== trans.isEpsilon) {
        this.epsilonOnlyTransitions = false;
      }
      if (index === -1) {
        this.transitions.push(trans);
      } else {
        this.transitions.splice(index, 1, trans);
      }
    }
  }
  ATNState.INVALID_TYPE = 0;
  ATNState.BASIC = 1;
  ATNState.RULE_START = 2;
  ATNState.BLOCK_START = 3;
  ATNState.PLUS_BLOCK_START = 4;
  ATNState.STAR_BLOCK_START = 5;
  ATNState.TOKEN_START = 6;
  ATNState.RULE_STOP = 7;
  ATNState.BLOCK_END = 8;
  ATNState.STAR_LOOP_BACK = 9;
  ATNState.STAR_LOOP_ENTRY = 10;
  ATNState.PLUS_LOOP_BACK = 11;
  ATNState.LOOP_END = 12;
  ATNState.serializationNames = [
    "INVALID",
    "BASIC",
    "RULE_START",
    "BLOCK_START",
    "PLUS_BLOCK_START",
    "STAR_BLOCK_START",
    "TOKEN_START",
    "RULE_STOP",
    "BLOCK_END",
    "STAR_LOOP_BACK",
    "STAR_LOOP_ENTRY",
    "PLUS_LOOP_BACK",
    "LOOP_END"
  ];
  ATNState.INVALID_STATE_NUMBER = -1;

  class BasicState extends ATNState {
    constructor() {
      super();
      this.stateType = ATNState.BASIC;
    }
  }

  class DecisionState extends ATNState {
    constructor() {
      super();
      this.decision = -1;
      this.nonGreedy = false;
      return this;
    }
  }

  class BlockStartState extends DecisionState {
    constructor() {
      super();
      this.endState = null;
      return this;
    }
  }

  class BasicBlockStartState extends BlockStartState {
    constructor() {
      super();
      this.stateType = ATNState.BLOCK_START;
      return this;
    }
  }

  class BlockEndState extends ATNState {
    constructor() {
      super();
      this.stateType = ATNState.BLOCK_END;
      this.startState = null;
      return this;
    }
  }

  class RuleStopState extends ATNState {
    constructor() {
      super();
      this.stateType = ATNState.RULE_STOP;
      return this;
    }
  }

  class RuleStartState extends ATNState {
    constructor() {
      super();
      this.stateType = ATNState.RULE_START;
      this.stopState = null;
      this.isPrecedenceRule = false;
      return this;
    }
  }

  class PlusLoopbackState extends DecisionState {
    constructor() {
      super();
      this.stateType = ATNState.PLUS_LOOP_BACK;
      return this;
    }
  }

  class PlusBlockStartState extends BlockStartState {
    constructor() {
      super();
      this.stateType = ATNState.PLUS_BLOCK_START;
      this.loopBackState = null;
      return this;
    }
  }

  class StarBlockStartState extends BlockStartState {
    constructor() {
      super();
      this.stateType = ATNState.STAR_BLOCK_START;
      return this;
    }
  }

  class StarLoopbackState extends ATNState {
    constructor() {
      super();
      this.stateType = ATNState.STAR_LOOP_BACK;
      return this;
    }
  }

  class StarLoopEntryState extends DecisionState {
    constructor() {
      super();
      this.stateType = ATNState.STAR_LOOP_ENTRY;
      this.loopBackState = null;
      this.isPrecedenceDecision = null;
      return this;
    }
  }

  class LoopEndState extends ATNState {
    constructor() {
      super();
      this.stateType = ATNState.LOOP_END;
      this.loopBackState = null;
      return this;
    }
  }

  class TokensStartState extends DecisionState {
    constructor() {
      super();
      this.stateType = ATNState.TOKEN_START;
      return this;
    }
  }
  module.exports = {
    ATNState,
    BasicState,
    DecisionState,
    BlockStartState,
    BlockEndState,
    LoopEndState,
    RuleStartState,
    RuleStopState,
    TokensStartState,
    PlusLoopbackState,
    StarLoopbackState,
    StarLoopEntryState,
    PlusBlockStartState,
    StarBlockStartState,
    BasicBlockStartState
  };
});

// node_modules/antlr4/src/antlr4/atn/SemanticContext.js
var require_SemanticContext = __commonJS((exports, module) => {
  var { Set: Set2, Hash: Hash2, equalArrays } = require_Utils();

  class SemanticContext {
    hashCode() {
      const hash = new Hash2;
      this.updateHashCode(hash);
      return hash.finish();
    }
    evaluate(parser, outerContext) {
    }
    evalPrecedence(parser, outerContext) {
      return this;
    }
    static andContext(a, b) {
      if (a === null || a === SemanticContext.NONE) {
        return b;
      }
      if (b === null || b === SemanticContext.NONE) {
        return a;
      }
      const result = new AND(a, b);
      if (result.opnds.length === 1) {
        return result.opnds[0];
      } else {
        return result;
      }
    }
    static orContext(a, b) {
      if (a === null) {
        return b;
      }
      if (b === null) {
        return a;
      }
      if (a === SemanticContext.NONE || b === SemanticContext.NONE) {
        return SemanticContext.NONE;
      }
      const result = new OR(a, b);
      if (result.opnds.length === 1) {
        return result.opnds[0];
      } else {
        return result;
      }
    }
  }

  class Predicate extends SemanticContext {
    constructor(ruleIndex, predIndex, isCtxDependent) {
      super();
      this.ruleIndex = ruleIndex === undefined ? -1 : ruleIndex;
      this.predIndex = predIndex === undefined ? -1 : predIndex;
      this.isCtxDependent = isCtxDependent === undefined ? false : isCtxDependent;
    }
    evaluate(parser, outerContext) {
      const localctx = this.isCtxDependent ? outerContext : null;
      return parser.sempred(localctx, this.ruleIndex, this.predIndex);
    }
    updateHashCode(hash) {
      hash.update(this.ruleIndex, this.predIndex, this.isCtxDependent);
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof Predicate)) {
        return false;
      } else {
        return this.ruleIndex === other.ruleIndex && this.predIndex === other.predIndex && this.isCtxDependent === other.isCtxDependent;
      }
    }
    toString() {
      return "{" + this.ruleIndex + ":" + this.predIndex + "}?";
    }
  }
  SemanticContext.NONE = new Predicate;

  class PrecedencePredicate extends SemanticContext {
    constructor(precedence) {
      super();
      this.precedence = precedence === undefined ? 0 : precedence;
    }
    evaluate(parser, outerContext) {
      return parser.precpred(outerContext, this.precedence);
    }
    evalPrecedence(parser, outerContext) {
      if (parser.precpred(outerContext, this.precedence)) {
        return SemanticContext.NONE;
      } else {
        return null;
      }
    }
    compareTo(other) {
      return this.precedence - other.precedence;
    }
    updateHashCode(hash) {
      hash.update(this.precedence);
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof PrecedencePredicate)) {
        return false;
      } else {
        return this.precedence === other.precedence;
      }
    }
    toString() {
      return "{" + this.precedence + ">=prec}?";
    }
    static filterPrecedencePredicates(set) {
      const result = [];
      set.values().map(function(context) {
        if (context instanceof PrecedencePredicate) {
          result.push(context);
        }
      });
      return result;
    }
  }

  class AND extends SemanticContext {
    constructor(a, b) {
      super();
      const operands = new Set2;
      if (a instanceof AND) {
        a.opnds.map(function(o) {
          operands.add(o);
        });
      } else {
        operands.add(a);
      }
      if (b instanceof AND) {
        b.opnds.map(function(o) {
          operands.add(o);
        });
      } else {
        operands.add(b);
      }
      const precedencePredicates = PrecedencePredicate.filterPrecedencePredicates(operands);
      if (precedencePredicates.length > 0) {
        let reduced = null;
        precedencePredicates.map(function(p) {
          if (reduced === null || p.precedence < reduced.precedence) {
            reduced = p;
          }
        });
        operands.add(reduced);
      }
      this.opnds = Array.from(operands.values());
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof AND)) {
        return false;
      } else {
        return equalArrays(this.opnds, other.opnds);
      }
    }
    updateHashCode(hash) {
      hash.update(this.opnds, "AND");
    }
    evaluate(parser, outerContext) {
      for (let i = 0;i < this.opnds.length; i++) {
        if (!this.opnds[i].evaluate(parser, outerContext)) {
          return false;
        }
      }
      return true;
    }
    evalPrecedence(parser, outerContext) {
      let differs = false;
      const operands = [];
      for (let i = 0;i < this.opnds.length; i++) {
        const context = this.opnds[i];
        const evaluated = context.evalPrecedence(parser, outerContext);
        differs |= evaluated !== context;
        if (evaluated === null) {
          return null;
        } else if (evaluated !== SemanticContext.NONE) {
          operands.push(evaluated);
        }
      }
      if (!differs) {
        return this;
      }
      if (operands.length === 0) {
        return SemanticContext.NONE;
      }
      let result = null;
      operands.map(function(o) {
        result = result === null ? o : SemanticContext.andContext(result, o);
      });
      return result;
    }
    toString() {
      const s = this.opnds.map((o) => o.toString());
      return (s.length > 3 ? s.slice(3) : s).join("&&");
    }
  }

  class OR extends SemanticContext {
    constructor(a, b) {
      super();
      const operands = new Set2;
      if (a instanceof OR) {
        a.opnds.map(function(o) {
          operands.add(o);
        });
      } else {
        operands.add(a);
      }
      if (b instanceof OR) {
        b.opnds.map(function(o) {
          operands.add(o);
        });
      } else {
        operands.add(b);
      }
      const precedencePredicates = PrecedencePredicate.filterPrecedencePredicates(operands);
      if (precedencePredicates.length > 0) {
        const s = precedencePredicates.sort(function(a2, b2) {
          return a2.compareTo(b2);
        });
        const reduced = s[s.length - 1];
        operands.add(reduced);
      }
      this.opnds = Array.from(operands.values());
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof OR)) {
        return false;
      } else {
        return equalArrays(this.opnds, other.opnds);
      }
    }
    updateHashCode(hash) {
      hash.update(this.opnds, "OR");
    }
    evaluate(parser, outerContext) {
      for (let i = 0;i < this.opnds.length; i++) {
        if (this.opnds[i].evaluate(parser, outerContext)) {
          return true;
        }
      }
      return false;
    }
    evalPrecedence(parser, outerContext) {
      let differs = false;
      const operands = [];
      for (let i = 0;i < this.opnds.length; i++) {
        const context = this.opnds[i];
        const evaluated = context.evalPrecedence(parser, outerContext);
        differs |= evaluated !== context;
        if (evaluated === SemanticContext.NONE) {
          return SemanticContext.NONE;
        } else if (evaluated !== null) {
          operands.push(evaluated);
        }
      }
      if (!differs) {
        return this;
      }
      if (operands.length === 0) {
        return null;
      }
      const result = null;
      operands.map(function(o) {
        return result === null ? o : SemanticContext.orContext(result, o);
      });
      return result;
    }
    toString() {
      const s = this.opnds.map((o) => o.toString());
      return (s.length > 3 ? s.slice(3) : s).join("||");
    }
  }
  module.exports = {
    SemanticContext,
    PrecedencePredicate,
    Predicate
  };
});

// node_modules/antlr4/src/antlr4/atn/ATNConfig.js
var require_ATNConfig = __commonJS((exports, module) => {
  var checkParams = function(params, isCfg) {
    if (params === null) {
      const result = { state: null, alt: null, context: null, semanticContext: null };
      if (isCfg) {
        result.reachesIntoOuterContext = 0;
      }
      return result;
    } else {
      const props = {};
      props.state = params.state || null;
      props.alt = params.alt === undefined ? null : params.alt;
      props.context = params.context || null;
      props.semanticContext = params.semanticContext || null;
      if (isCfg) {
        props.reachesIntoOuterContext = params.reachesIntoOuterContext || 0;
        props.precedenceFilterSuppressed = params.precedenceFilterSuppressed || false;
      }
      return props;
    }
  };
  var { DecisionState } = require_ATNState();
  var { SemanticContext } = require_SemanticContext();
  var { Hash: Hash2 } = require_Utils();

  class ATNConfig {
    constructor(params, config) {
      this.checkContext(params, config);
      params = checkParams(params);
      config = checkParams(config, true);
      this.state = params.state !== null ? params.state : config.state;
      this.alt = params.alt !== null ? params.alt : config.alt;
      this.context = params.context !== null ? params.context : config.context;
      this.semanticContext = params.semanticContext !== null ? params.semanticContext : config.semanticContext !== null ? config.semanticContext : SemanticContext.NONE;
      this.reachesIntoOuterContext = config.reachesIntoOuterContext;
      this.precedenceFilterSuppressed = config.precedenceFilterSuppressed;
    }
    checkContext(params, config) {
      if ((params.context === null || params.context === undefined) && (config === null || config.context === null || config.context === undefined)) {
        this.context = null;
      }
    }
    hashCode() {
      const hash = new Hash2;
      this.updateHashCode(hash);
      return hash.finish();
    }
    updateHashCode(hash) {
      hash.update(this.state.stateNumber, this.alt, this.context, this.semanticContext);
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof ATNConfig)) {
        return false;
      } else {
        return this.state.stateNumber === other.state.stateNumber && this.alt === other.alt && (this.context === null ? other.context === null : this.context.equals(other.context)) && this.semanticContext.equals(other.semanticContext) && this.precedenceFilterSuppressed === other.precedenceFilterSuppressed;
      }
    }
    hashCodeForConfigSet() {
      const hash = new Hash2;
      hash.update(this.state.stateNumber, this.alt, this.semanticContext);
      return hash.finish();
    }
    equalsForConfigSet(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof ATNConfig)) {
        return false;
      } else {
        return this.state.stateNumber === other.state.stateNumber && this.alt === other.alt && this.semanticContext.equals(other.semanticContext);
      }
    }
    toString() {
      return "(" + this.state + "," + this.alt + (this.context !== null ? ",[" + this.context.toString() + "]" : "") + (this.semanticContext !== SemanticContext.NONE ? "," + this.semanticContext.toString() : "") + (this.reachesIntoOuterContext > 0 ? ",up=" + this.reachesIntoOuterContext : "") + ")";
    }
  }

  class LexerATNConfig extends ATNConfig {
    constructor(params, config) {
      super(params, config);
      const lexerActionExecutor = params.lexerActionExecutor || null;
      this.lexerActionExecutor = lexerActionExecutor || (config !== null ? config.lexerActionExecutor : null);
      this.passedThroughNonGreedyDecision = config !== null ? this.checkNonGreedyDecision(config, this.state) : false;
      this.hashCodeForConfigSet = LexerATNConfig.prototype.hashCode;
      this.equalsForConfigSet = LexerATNConfig.prototype.equals;
      return this;
    }
    updateHashCode(hash) {
      hash.update(this.state.stateNumber, this.alt, this.context, this.semanticContext, this.passedThroughNonGreedyDecision, this.lexerActionExecutor);
    }
    equals(other) {
      return this === other || other instanceof LexerATNConfig && this.passedThroughNonGreedyDecision === other.passedThroughNonGreedyDecision && (this.lexerActionExecutor ? this.lexerActionExecutor.equals(other.lexerActionExecutor) : !other.lexerActionExecutor) && super.equals(other);
    }
    checkNonGreedyDecision(source, target) {
      return source.passedThroughNonGreedyDecision || target instanceof DecisionState && target.nonGreedy;
    }
  }
  exports.ATNConfig = ATNConfig;
  exports.LexerATNConfig = LexerATNConfig;
});

// node_modules/antlr4/src/antlr4/IntervalSet.js
var require_IntervalSet = __commonJS((exports, module) => {
  var { Token } = require_Token();

  class Interval {
    constructor(start, stop) {
      this.start = start;
      this.stop = stop;
    }
    clone() {
      return new Interval(this.start, this.stop);
    }
    contains(item) {
      return item >= this.start && item < this.stop;
    }
    toString() {
      if (this.start === this.stop - 1) {
        return this.start.toString();
      } else {
        return this.start.toString() + ".." + (this.stop - 1).toString();
      }
    }
    get length() {
      return this.stop - this.start;
    }
  }

  class IntervalSet {
    constructor() {
      this.intervals = null;
      this.readOnly = false;
    }
    first(v) {
      if (this.intervals === null || this.intervals.length === 0) {
        return Token.INVALID_TYPE;
      } else {
        return this.intervals[0].start;
      }
    }
    addOne(v) {
      this.addInterval(new Interval(v, v + 1));
    }
    addRange(l, h) {
      this.addInterval(new Interval(l, h + 1));
    }
    addInterval(toAdd) {
      if (this.intervals === null) {
        this.intervals = [];
        this.intervals.push(toAdd.clone());
      } else {
        for (let pos = 0;pos < this.intervals.length; pos++) {
          const existing = this.intervals[pos];
          if (toAdd.stop < existing.start) {
            this.intervals.splice(pos, 0, toAdd);
            return;
          } else if (toAdd.stop === existing.start) {
            this.intervals[pos] = new Interval(toAdd.start, existing.stop);
            return;
          } else if (toAdd.start <= existing.stop) {
            this.intervals[pos] = new Interval(Math.min(existing.start, toAdd.start), Math.max(existing.stop, toAdd.stop));
            this.reduce(pos);
            return;
          }
        }
        this.intervals.push(toAdd.clone());
      }
    }
    addSet(other) {
      if (other.intervals !== null) {
        other.intervals.forEach((toAdd) => this.addInterval(toAdd), this);
      }
      return this;
    }
    reduce(pos) {
      if (pos < this.intervals.length - 1) {
        const current = this.intervals[pos];
        const next = this.intervals[pos + 1];
        if (current.stop >= next.stop) {
          this.intervals.splice(pos + 1, 1);
          this.reduce(pos);
        } else if (current.stop >= next.start) {
          this.intervals[pos] = new Interval(current.start, next.stop);
          this.intervals.splice(pos + 1, 1);
        }
      }
    }
    complement(start, stop) {
      const result = new IntervalSet;
      result.addInterval(new Interval(start, stop + 1));
      if (this.intervals !== null)
        this.intervals.forEach((toRemove) => result.removeRange(toRemove));
      return result;
    }
    contains(item) {
      if (this.intervals === null) {
        return false;
      } else {
        for (let k = 0;k < this.intervals.length; k++) {
          if (this.intervals[k].contains(item)) {
            return true;
          }
        }
        return false;
      }
    }
    removeRange(toRemove) {
      if (toRemove.start === toRemove.stop - 1) {
        this.removeOne(toRemove.start);
      } else if (this.intervals !== null) {
        let pos = 0;
        for (let n = 0;n < this.intervals.length; n++) {
          const existing = this.intervals[pos];
          if (toRemove.stop <= existing.start) {
            return;
          } else if (toRemove.start > existing.start && toRemove.stop < existing.stop) {
            this.intervals[pos] = new Interval(existing.start, toRemove.start);
            const x = new Interval(toRemove.stop, existing.stop);
            this.intervals.splice(pos, 0, x);
            return;
          } else if (toRemove.start <= existing.start && toRemove.stop >= existing.stop) {
            this.intervals.splice(pos, 1);
            pos = pos - 1;
          } else if (toRemove.start < existing.stop) {
            this.intervals[pos] = new Interval(existing.start, toRemove.start);
          } else if (toRemove.stop < existing.stop) {
            this.intervals[pos] = new Interval(toRemove.stop, existing.stop);
          }
          pos += 1;
        }
      }
    }
    removeOne(value) {
      if (this.intervals !== null) {
        for (let i = 0;i < this.intervals.length; i++) {
          const existing = this.intervals[i];
          if (value < existing.start) {
            return;
          } else if (value === existing.start && value === existing.stop - 1) {
            this.intervals.splice(i, 1);
            return;
          } else if (value === existing.start) {
            this.intervals[i] = new Interval(existing.start + 1, existing.stop);
            return;
          } else if (value === existing.stop - 1) {
            this.intervals[i] = new Interval(existing.start, existing.stop - 1);
            return;
          } else if (value < existing.stop - 1) {
            const replace = new Interval(existing.start, value);
            existing.start = value + 1;
            this.intervals.splice(i, 0, replace);
            return;
          }
        }
      }
    }
    toString(literalNames, symbolicNames, elemsAreChar) {
      literalNames = literalNames || null;
      symbolicNames = symbolicNames || null;
      elemsAreChar = elemsAreChar || false;
      if (this.intervals === null) {
        return "{}";
      } else if (literalNames !== null || symbolicNames !== null) {
        return this.toTokenString(literalNames, symbolicNames);
      } else if (elemsAreChar) {
        return this.toCharString();
      } else {
        return this.toIndexString();
      }
    }
    toCharString() {
      const names = [];
      for (let i = 0;i < this.intervals.length; i++) {
        const existing = this.intervals[i];
        if (existing.stop === existing.start + 1) {
          if (existing.start === Token.EOF) {
            names.push("<EOF>");
          } else {
            names.push("'" + String.fromCharCode(existing.start) + "'");
          }
        } else {
          names.push("'" + String.fromCharCode(existing.start) + "'..'" + String.fromCharCode(existing.stop - 1) + "'");
        }
      }
      if (names.length > 1) {
        return "{" + names.join(", ") + "}";
      } else {
        return names[0];
      }
    }
    toIndexString() {
      const names = [];
      for (let i = 0;i < this.intervals.length; i++) {
        const existing = this.intervals[i];
        if (existing.stop === existing.start + 1) {
          if (existing.start === Token.EOF) {
            names.push("<EOF>");
          } else {
            names.push(existing.start.toString());
          }
        } else {
          names.push(existing.start.toString() + ".." + (existing.stop - 1).toString());
        }
      }
      if (names.length > 1) {
        return "{" + names.join(", ") + "}";
      } else {
        return names[0];
      }
    }
    toTokenString(literalNames, symbolicNames) {
      const names = [];
      for (let i = 0;i < this.intervals.length; i++) {
        const existing = this.intervals[i];
        for (let j = existing.start;j < existing.stop; j++) {
          names.push(this.elementName(literalNames, symbolicNames, j));
        }
      }
      if (names.length > 1) {
        return "{" + names.join(", ") + "}";
      } else {
        return names[0];
      }
    }
    elementName(literalNames, symbolicNames, token) {
      if (token === Token.EOF) {
        return "<EOF>";
      } else if (token === Token.EPSILON) {
        return "<EPSILON>";
      } else {
        return literalNames[token] || symbolicNames[token];
      }
    }
    get length() {
      return this.intervals.map((interval) => interval.length).reduce((acc, val) => acc + val);
    }
  }
  module.exports = {
    Interval,
    IntervalSet
  };
});

// node_modules/antlr4/src/antlr4/atn/Transition.js
var require_Transition = __commonJS((exports, module) => {
  var { Token } = require_Token();
  var { IntervalSet } = require_IntervalSet();
  var { Predicate, PrecedencePredicate } = require_SemanticContext();

  class Transition {
    constructor(target) {
      if (target === undefined || target === null) {
        throw "target cannot be null.";
      }
      this.target = target;
      this.isEpsilon = false;
      this.label = null;
    }
  }
  Transition.EPSILON = 1;
  Transition.RANGE = 2;
  Transition.RULE = 3;
  Transition.PREDICATE = 4;
  Transition.ATOM = 5;
  Transition.ACTION = 6;
  Transition.SET = 7;
  Transition.NOT_SET = 8;
  Transition.WILDCARD = 9;
  Transition.PRECEDENCE = 10;
  Transition.serializationNames = [
    "INVALID",
    "EPSILON",
    "RANGE",
    "RULE",
    "PREDICATE",
    "ATOM",
    "ACTION",
    "SET",
    "NOT_SET",
    "WILDCARD",
    "PRECEDENCE"
  ];
  Transition.serializationTypes = {
    EpsilonTransition: Transition.EPSILON,
    RangeTransition: Transition.RANGE,
    RuleTransition: Transition.RULE,
    PredicateTransition: Transition.PREDICATE,
    AtomTransition: Transition.ATOM,
    ActionTransition: Transition.ACTION,
    SetTransition: Transition.SET,
    NotSetTransition: Transition.NOT_SET,
    WildcardTransition: Transition.WILDCARD,
    PrecedencePredicateTransition: Transition.PRECEDENCE
  };

  class AtomTransition2 extends Transition {
    constructor(target, label) {
      super(target);
      this.label_ = label;
      this.label = this.makeLabel();
      this.serializationType = Transition.ATOM;
    }
    makeLabel() {
      const s = new IntervalSet;
      s.addOne(this.label_);
      return s;
    }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
      return this.label_ === symbol;
    }
    toString() {
      return this.label_;
    }
  }

  class RuleTransition extends Transition {
    constructor(ruleStart, ruleIndex, precedence, followState) {
      super(ruleStart);
      this.ruleIndex = ruleIndex;
      this.precedence = precedence;
      this.followState = followState;
      this.serializationType = Transition.RULE;
      this.isEpsilon = true;
    }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
      return false;
    }
  }

  class EpsilonTransition extends Transition {
    constructor(target, outermostPrecedenceReturn) {
      super(target);
      this.serializationType = Transition.EPSILON;
      this.isEpsilon = true;
      this.outermostPrecedenceReturn = outermostPrecedenceReturn;
    }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
      return false;
    }
    toString() {
      return "epsilon";
    }
  }

  class RangeTransition extends Transition {
    constructor(target, start, stop) {
      super(target);
      this.serializationType = Transition.RANGE;
      this.start = start;
      this.stop = stop;
      this.label = this.makeLabel();
    }
    makeLabel() {
      const s = new IntervalSet;
      s.addRange(this.start, this.stop);
      return s;
    }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
      return symbol >= this.start && symbol <= this.stop;
    }
    toString() {
      return "'" + String.fromCharCode(this.start) + "'..'" + String.fromCharCode(this.stop) + "'";
    }
  }

  class AbstractPredicateTransition extends Transition {
    constructor(target) {
      super(target);
    }
  }

  class PredicateTransition extends AbstractPredicateTransition {
    constructor(target, ruleIndex, predIndex, isCtxDependent) {
      super(target);
      this.serializationType = Transition.PREDICATE;
      this.ruleIndex = ruleIndex;
      this.predIndex = predIndex;
      this.isCtxDependent = isCtxDependent;
      this.isEpsilon = true;
    }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
      return false;
    }
    getPredicate() {
      return new Predicate(this.ruleIndex, this.predIndex, this.isCtxDependent);
    }
    toString() {
      return "pred_" + this.ruleIndex + ":" + this.predIndex;
    }
  }

  class ActionTransition extends Transition {
    constructor(target, ruleIndex, actionIndex, isCtxDependent) {
      super(target);
      this.serializationType = Transition.ACTION;
      this.ruleIndex = ruleIndex;
      this.actionIndex = actionIndex === undefined ? -1 : actionIndex;
      this.isCtxDependent = isCtxDependent === undefined ? false : isCtxDependent;
      this.isEpsilon = true;
    }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
      return false;
    }
    toString() {
      return "action_" + this.ruleIndex + ":" + this.actionIndex;
    }
  }

  class SetTransition extends Transition {
    constructor(target, set) {
      super(target);
      this.serializationType = Transition.SET;
      if (set !== undefined && set !== null) {
        this.label = set;
      } else {
        this.label = new IntervalSet;
        this.label.addOne(Token.INVALID_TYPE);
      }
    }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
      return this.label.contains(symbol);
    }
    toString() {
      return this.label.toString();
    }
  }

  class NotSetTransition extends SetTransition {
    constructor(target, set) {
      super(target, set);
      this.serializationType = Transition.NOT_SET;
    }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
      return symbol >= minVocabSymbol && symbol <= maxVocabSymbol && !super.matches(symbol, minVocabSymbol, maxVocabSymbol);
    }
    toString() {
      return "~" + super.toString();
    }
  }

  class WildcardTransition extends Transition {
    constructor(target) {
      super(target);
      this.serializationType = Transition.WILDCARD;
    }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
      return symbol >= minVocabSymbol && symbol <= maxVocabSymbol;
    }
    toString() {
      return ".";
    }
  }

  class PrecedencePredicateTransition extends AbstractPredicateTransition {
    constructor(target, precedence) {
      super(target);
      this.serializationType = Transition.PRECEDENCE;
      this.precedence = precedence;
      this.isEpsilon = true;
    }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
      return false;
    }
    getPredicate() {
      return new PrecedencePredicate(this.precedence);
    }
    toString() {
      return this.precedence + " >= _p";
    }
  }
  module.exports = {
    Transition,
    AtomTransition: AtomTransition2,
    SetTransition,
    NotSetTransition,
    RuleTransition,
    ActionTransition,
    EpsilonTransition,
    RangeTransition,
    WildcardTransition,
    PredicateTransition,
    PrecedencePredicateTransition,
    AbstractPredicateTransition
  };
});

// node_modules/antlr4/src/antlr4/tree/Tree.js
var require_Tree = __commonJS((exports, module) => {
  var { Token } = require_Token();
  var { Interval } = require_IntervalSet();
  var INVALID_INTERVAL = new Interval(-1, -2);

  class Tree {
  }

  class SyntaxTree extends Tree {
    constructor() {
      super();
    }
  }

  class ParseTree extends SyntaxTree {
    constructor() {
      super();
    }
  }

  class RuleNode extends ParseTree {
    constructor() {
      super();
    }
    getRuleContext() {
      throw new Error("missing interface implementation");
    }
  }

  class TerminalNode extends ParseTree {
    constructor() {
      super();
    }
  }

  class ErrorNode extends TerminalNode {
    constructor() {
      super();
    }
  }

  class ParseTreeVisitor {
    visit(ctx) {
      if (Array.isArray(ctx)) {
        return ctx.map(function(child) {
          return child.accept(this);
        }, this);
      } else {
        return ctx.accept(this);
      }
    }
    visitChildren(ctx) {
      if (ctx.children) {
        return this.visit(ctx.children);
      } else {
        return null;
      }
    }
    visitTerminal(node) {
    }
    visitErrorNode(node) {
    }
  }

  class ParseTreeListener {
    visitTerminal(node) {
    }
    visitErrorNode(node) {
    }
    enterEveryRule(node) {
    }
    exitEveryRule(node) {
    }
  }

  class TerminalNodeImpl extends TerminalNode {
    constructor(symbol) {
      super();
      this.parentCtx = null;
      this.symbol = symbol;
    }
    getChild(i) {
      return null;
    }
    getSymbol() {
      return this.symbol;
    }
    getParent() {
      return this.parentCtx;
    }
    getPayload() {
      return this.symbol;
    }
    getSourceInterval() {
      if (this.symbol === null) {
        return INVALID_INTERVAL;
      }
      const tokenIndex = this.symbol.tokenIndex;
      return new Interval(tokenIndex, tokenIndex);
    }
    getChildCount() {
      return 0;
    }
    accept(visitor) {
      return visitor.visitTerminal(this);
    }
    getText() {
      return this.symbol.text;
    }
    toString() {
      if (this.symbol.type === Token.EOF) {
        return "<EOF>";
      } else {
        return this.symbol.text;
      }
    }
  }

  class ErrorNodeImpl extends TerminalNodeImpl {
    constructor(token) {
      super(token);
    }
    isErrorNode() {
      return true;
    }
    accept(visitor) {
      return visitor.visitErrorNode(this);
    }
  }

  class ParseTreeWalker {
    walk(listener, t) {
      const errorNode = t instanceof ErrorNode || t.isErrorNode !== undefined && t.isErrorNode();
      if (errorNode) {
        listener.visitErrorNode(t);
      } else if (t instanceof TerminalNode) {
        listener.visitTerminal(t);
      } else {
        this.enterRule(listener, t);
        for (let i = 0;i < t.getChildCount(); i++) {
          const child = t.getChild(i);
          this.walk(listener, child);
        }
        this.exitRule(listener, t);
      }
    }
    enterRule(listener, r) {
      const ctx = r.getRuleContext();
      listener.enterEveryRule(ctx);
      ctx.enterRule(listener);
    }
    exitRule(listener, r) {
      const ctx = r.getRuleContext();
      ctx.exitRule(listener);
      listener.exitEveryRule(ctx);
    }
  }
  ParseTreeWalker.DEFAULT = new ParseTreeWalker;
  module.exports = {
    RuleNode,
    ErrorNode,
    TerminalNode,
    ErrorNodeImpl,
    TerminalNodeImpl,
    ParseTreeListener,
    ParseTreeVisitor,
    ParseTreeWalker,
    INVALID_INTERVAL
  };
});

// node_modules/antlr4/src/antlr4/tree/Trees.js
var require_Trees = __commonJS((exports, module) => {
  var Utils = require_Utils();
  var { Token } = require_Token();
  var { ErrorNode, TerminalNode, RuleNode } = require_Tree();
  var Trees = {
    toStringTree: function(tree, ruleNames, recog) {
      ruleNames = ruleNames || null;
      recog = recog || null;
      if (recog !== null) {
        ruleNames = recog.ruleNames;
      }
      let s = Trees.getNodeText(tree, ruleNames);
      s = Utils.escapeWhitespace(s, false);
      const c = tree.getChildCount();
      if (c === 0) {
        return s;
      }
      let res = "(" + s + " ";
      if (c > 0) {
        s = Trees.toStringTree(tree.getChild(0), ruleNames);
        res = res.concat(s);
      }
      for (let i = 1;i < c; i++) {
        s = Trees.toStringTree(tree.getChild(i), ruleNames);
        res = res.concat(" " + s);
      }
      res = res.concat(")");
      return res;
    },
    getNodeText: function(t, ruleNames, recog) {
      ruleNames = ruleNames || null;
      recog = recog || null;
      if (recog !== null) {
        ruleNames = recog.ruleNames;
      }
      if (ruleNames !== null) {
        if (t instanceof RuleNode) {
          const context = t.getRuleContext();
          const altNumber = context.getAltNumber();
          if (altNumber != 0) {
            return ruleNames[t.ruleIndex] + ":" + altNumber;
          }
          return ruleNames[t.ruleIndex];
        } else if (t instanceof ErrorNode) {
          return t.toString();
        } else if (t instanceof TerminalNode) {
          if (t.symbol !== null) {
            return t.symbol.text;
          }
        }
      }
      const payload = t.getPayload();
      if (payload instanceof Token) {
        return payload.text;
      }
      return t.getPayload().toString();
    },
    getChildren: function(t) {
      const list = [];
      for (let i = 0;i < t.getChildCount(); i++) {
        list.push(t.getChild(i));
      }
      return list;
    },
    getAncestors: function(t) {
      let ancestors = [];
      t = t.getParent();
      while (t !== null) {
        ancestors = [t].concat(ancestors);
        t = t.getParent();
      }
      return ancestors;
    },
    findAllTokenNodes: function(t, ttype) {
      return Trees.findAllNodes(t, ttype, true);
    },
    findAllRuleNodes: function(t, ruleIndex) {
      return Trees.findAllNodes(t, ruleIndex, false);
    },
    findAllNodes: function(t, index, findTokens) {
      const nodes = [];
      Trees._findAllNodes(t, index, findTokens, nodes);
      return nodes;
    },
    _findAllNodes: function(t, index, findTokens, nodes) {
      if (findTokens && t instanceof TerminalNode) {
        if (t.symbol.type === index) {
          nodes.push(t);
        }
      } else if (!findTokens && t instanceof RuleNode) {
        if (t.ruleIndex === index) {
          nodes.push(t);
        }
      }
      for (let i = 0;i < t.getChildCount(); i++) {
        Trees._findAllNodes(t.getChild(i), index, findTokens, nodes);
      }
    },
    descendants: function(t) {
      let nodes = [t];
      for (let i = 0;i < t.getChildCount(); i++) {
        nodes = nodes.concat(Trees.descendants(t.getChild(i)));
      }
      return nodes;
    }
  };
  module.exports = Trees;
});

// node_modules/antlr4/src/antlr4/RuleContext.js
var require_RuleContext = __commonJS((exports, module) => {
  var { RuleNode } = require_Tree();
  var { INVALID_INTERVAL } = require_Tree();
  var Trees = require_Trees();

  class RuleContext extends RuleNode {
    constructor(parent, invokingState) {
      super();
      this.parentCtx = parent || null;
      this.invokingState = invokingState || -1;
    }
    depth() {
      let n = 0;
      let p = this;
      while (p !== null) {
        p = p.parentCtx;
        n += 1;
      }
      return n;
    }
    isEmpty() {
      return this.invokingState === -1;
    }
    getSourceInterval() {
      return INVALID_INTERVAL;
    }
    getRuleContext() {
      return this;
    }
    getPayload() {
      return this;
    }
    getText() {
      if (this.getChildCount() === 0) {
        return "";
      } else {
        return this.children.map(function(child) {
          return child.getText();
        }).join("");
      }
    }
    getAltNumber() {
      return 0;
    }
    setAltNumber(altNumber) {
    }
    getChild(i) {
      return null;
    }
    getChildCount() {
      return 0;
    }
    accept(visitor) {
      return visitor.visitChildren(this);
    }
    toStringTree(ruleNames, recog) {
      return Trees.toStringTree(this, ruleNames, recog);
    }
    toString(ruleNames, stop) {
      ruleNames = ruleNames || null;
      stop = stop || null;
      let p = this;
      let s = "[";
      while (p !== null && p !== stop) {
        if (ruleNames === null) {
          if (!p.isEmpty()) {
            s += p.invokingState;
          }
        } else {
          const ri = p.ruleIndex;
          const ruleName = ri >= 0 && ri < ruleNames.length ? ruleNames[ri] : "" + ri;
          s += ruleName;
        }
        if (p.parentCtx !== null && (ruleNames !== null || !p.parentCtx.isEmpty())) {
          s += " ";
        }
        p = p.parentCtx;
      }
      s += "]";
      return s;
    }
  }
  module.exports = RuleContext;
});

// node_modules/antlr4/src/antlr4/PredictionContext.js
var require_PredictionContext = __commonJS((exports, module) => {
  var predictionContextFromRuleContext = function(atn, outerContext) {
    if (outerContext === undefined || outerContext === null) {
      outerContext = RuleContext.EMPTY;
    }
    if (outerContext.parentCtx === null || outerContext === RuleContext.EMPTY) {
      return PredictionContext.EMPTY;
    }
    const parent = predictionContextFromRuleContext(atn, outerContext.parentCtx);
    const state = atn.states[outerContext.invokingState];
    const transition = state.transitions[0];
    return SingletonPredictionContext.create(parent, transition.followState.stateNumber);
  };
  var merge = function(a, b, rootIsWildcard, mergeCache) {
    if (a === b) {
      return a;
    }
    if (a instanceof SingletonPredictionContext && b instanceof SingletonPredictionContext) {
      return mergeSingletons(a, b, rootIsWildcard, mergeCache);
    }
    if (rootIsWildcard) {
      if (a instanceof EmptyPredictionContext) {
        return a;
      }
      if (b instanceof EmptyPredictionContext) {
        return b;
      }
    }
    if (a instanceof SingletonPredictionContext) {
      a = new ArrayPredictionContext([a.getParent()], [a.returnState]);
    }
    if (b instanceof SingletonPredictionContext) {
      b = new ArrayPredictionContext([b.getParent()], [b.returnState]);
    }
    return mergeArrays(a, b, rootIsWildcard, mergeCache);
  };
  var mergeSingletons = function(a, b, rootIsWildcard, mergeCache) {
    if (mergeCache !== null) {
      let previous = mergeCache.get(a, b);
      if (previous !== null) {
        return previous;
      }
      previous = mergeCache.get(b, a);
      if (previous !== null) {
        return previous;
      }
    }
    const rootMerge = mergeRoot(a, b, rootIsWildcard);
    if (rootMerge !== null) {
      if (mergeCache !== null) {
        mergeCache.set(a, b, rootMerge);
      }
      return rootMerge;
    }
    if (a.returnState === b.returnState) {
      const parent = merge(a.parentCtx, b.parentCtx, rootIsWildcard, mergeCache);
      if (parent === a.parentCtx) {
        return a;
      }
      if (parent === b.parentCtx) {
        return b;
      }
      const spc = SingletonPredictionContext.create(parent, a.returnState);
      if (mergeCache !== null) {
        mergeCache.set(a, b, spc);
      }
      return spc;
    } else {
      let singleParent = null;
      if (a === b || a.parentCtx !== null && a.parentCtx === b.parentCtx) {
        singleParent = a.parentCtx;
      }
      if (singleParent !== null) {
        const payloads2 = [a.returnState, b.returnState];
        if (a.returnState > b.returnState) {
          payloads2[0] = b.returnState;
          payloads2[1] = a.returnState;
        }
        const parents2 = [singleParent, singleParent];
        const apc = new ArrayPredictionContext(parents2, payloads2);
        if (mergeCache !== null) {
          mergeCache.set(a, b, apc);
        }
        return apc;
      }
      const payloads = [a.returnState, b.returnState];
      let parents = [a.parentCtx, b.parentCtx];
      if (a.returnState > b.returnState) {
        payloads[0] = b.returnState;
        payloads[1] = a.returnState;
        parents = [b.parentCtx, a.parentCtx];
      }
      const a_ = new ArrayPredictionContext(parents, payloads);
      if (mergeCache !== null) {
        mergeCache.set(a, b, a_);
      }
      return a_;
    }
  };
  var mergeRoot = function(a, b, rootIsWildcard) {
    if (rootIsWildcard) {
      if (a === PredictionContext.EMPTY) {
        return PredictionContext.EMPTY;
      }
      if (b === PredictionContext.EMPTY) {
        return PredictionContext.EMPTY;
      }
    } else {
      if (a === PredictionContext.EMPTY && b === PredictionContext.EMPTY) {
        return PredictionContext.EMPTY;
      } else if (a === PredictionContext.EMPTY) {
        const payloads = [
          b.returnState,
          PredictionContext.EMPTY_RETURN_STATE
        ];
        const parents = [b.parentCtx, null];
        return new ArrayPredictionContext(parents, payloads);
      } else if (b === PredictionContext.EMPTY) {
        const payloads = [a.returnState, PredictionContext.EMPTY_RETURN_STATE];
        const parents = [a.parentCtx, null];
        return new ArrayPredictionContext(parents, payloads);
      }
    }
    return null;
  };
  var mergeArrays = function(a, b, rootIsWildcard, mergeCache) {
    if (mergeCache !== null) {
      let previous = mergeCache.get(a, b);
      if (previous !== null) {
        return previous;
      }
      previous = mergeCache.get(b, a);
      if (previous !== null) {
        return previous;
      }
    }
    let i = 0;
    let j = 0;
    let k = 0;
    let mergedReturnStates = [];
    let mergedParents = [];
    while (i < a.returnStates.length && j < b.returnStates.length) {
      const a_parent = a.parents[i];
      const b_parent = b.parents[j];
      if (a.returnStates[i] === b.returnStates[j]) {
        const payload = a.returnStates[i];
        const bothDollars = payload === PredictionContext.EMPTY_RETURN_STATE && a_parent === null && b_parent === null;
        const ax_ax = a_parent !== null && b_parent !== null && a_parent === b_parent;
        if (bothDollars || ax_ax) {
          mergedParents[k] = a_parent;
          mergedReturnStates[k] = payload;
        } else {
          mergedParents[k] = merge(a_parent, b_parent, rootIsWildcard, mergeCache);
          mergedReturnStates[k] = payload;
        }
        i += 1;
        j += 1;
      } else if (a.returnStates[i] < b.returnStates[j]) {
        mergedParents[k] = a_parent;
        mergedReturnStates[k] = a.returnStates[i];
        i += 1;
      } else {
        mergedParents[k] = b_parent;
        mergedReturnStates[k] = b.returnStates[j];
        j += 1;
      }
      k += 1;
    }
    if (i < a.returnStates.length) {
      for (let p = i;p < a.returnStates.length; p++) {
        mergedParents[k] = a.parents[p];
        mergedReturnStates[k] = a.returnStates[p];
        k += 1;
      }
    } else {
      for (let p = j;p < b.returnStates.length; p++) {
        mergedParents[k] = b.parents[p];
        mergedReturnStates[k] = b.returnStates[p];
        k += 1;
      }
    }
    if (k < mergedParents.length) {
      if (k === 1) {
        const a_ = SingletonPredictionContext.create(mergedParents[0], mergedReturnStates[0]);
        if (mergeCache !== null) {
          mergeCache.set(a, b, a_);
        }
        return a_;
      }
      mergedParents = mergedParents.slice(0, k);
      mergedReturnStates = mergedReturnStates.slice(0, k);
    }
    const M = new ArrayPredictionContext(mergedParents, mergedReturnStates);
    if (M === a) {
      if (mergeCache !== null) {
        mergeCache.set(a, b, a);
      }
      return a;
    }
    if (M === b) {
      if (mergeCache !== null) {
        mergeCache.set(a, b, b);
      }
      return b;
    }
    combineCommonParents(mergedParents);
    if (mergeCache !== null) {
      mergeCache.set(a, b, M);
    }
    return M;
  };
  var combineCommonParents = function(parents) {
    const uniqueParents = new Map;
    for (let p = 0;p < parents.length; p++) {
      const parent = parents[p];
      if (!uniqueParents.containsKey(parent)) {
        uniqueParents.put(parent, parent);
      }
    }
    for (let q = 0;q < parents.length; q++) {
      parents[q] = uniqueParents.get(parents[q]);
    }
  };
  var getCachedPredictionContext = function(context, contextCache, visited) {
    if (context.isEmpty()) {
      return context;
    }
    let existing = visited.get(context) || null;
    if (existing !== null) {
      return existing;
    }
    existing = contextCache.get(context);
    if (existing !== null) {
      visited.put(context, existing);
      return existing;
    }
    let changed = false;
    let parents = [];
    for (let i = 0;i < parents.length; i++) {
      const parent = getCachedPredictionContext(context.getParent(i), contextCache, visited);
      if (changed || parent !== context.getParent(i)) {
        if (!changed) {
          parents = [];
          for (let j = 0;j < context.length; j++) {
            parents[j] = context.getParent(j);
          }
          changed = true;
        }
        parents[i] = parent;
      }
    }
    if (!changed) {
      contextCache.add(context);
      visited.put(context, context);
      return context;
    }
    let updated = null;
    if (parents.length === 0) {
      updated = PredictionContext.EMPTY;
    } else if (parents.length === 1) {
      updated = SingletonPredictionContext.create(parents[0], context.getReturnState(0));
    } else {
      updated = new ArrayPredictionContext(parents, context.returnStates);
    }
    contextCache.add(updated);
    visited.put(updated, updated);
    visited.put(context, updated);
    return updated;
  };
  var RuleContext = require_RuleContext();
  var { Hash: Hash2, Map, equalArrays } = require_Utils();

  class PredictionContext {
    constructor(cachedHashCode) {
      this.cachedHashCode = cachedHashCode;
    }
    isEmpty() {
      return this === PredictionContext.EMPTY;
    }
    hasEmptyPath() {
      return this.getReturnState(this.length - 1) === PredictionContext.EMPTY_RETURN_STATE;
    }
    hashCode() {
      return this.cachedHashCode;
    }
    updateHashCode(hash) {
      hash.update(this.cachedHashCode);
    }
  }
  PredictionContext.EMPTY = null;
  PredictionContext.EMPTY_RETURN_STATE = 2147483647;
  PredictionContext.globalNodeCount = 1;
  PredictionContext.id = PredictionContext.globalNodeCount;

  class PredictionContextCache {
    constructor() {
      this.cache = new Map;
    }
    add(ctx) {
      if (ctx === PredictionContext.EMPTY) {
        return PredictionContext.EMPTY;
      }
      const existing = this.cache.get(ctx) || null;
      if (existing !== null) {
        return existing;
      }
      this.cache.put(ctx, ctx);
      return ctx;
    }
    get(ctx) {
      return this.cache.get(ctx) || null;
    }
    get length() {
      return this.cache.length;
    }
  }

  class SingletonPredictionContext extends PredictionContext {
    constructor(parent, returnState) {
      let hashCode = 0;
      const hash = new Hash2;
      if (parent !== null) {
        hash.update(parent, returnState);
      } else {
        hash.update(1);
      }
      hashCode = hash.finish();
      super(hashCode);
      this.parentCtx = parent;
      this.returnState = returnState;
    }
    getParent(index) {
      return this.parentCtx;
    }
    getReturnState(index) {
      return this.returnState;
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof SingletonPredictionContext)) {
        return false;
      } else if (this.hashCode() !== other.hashCode()) {
        return false;
      } else {
        if (this.returnState !== other.returnState)
          return false;
        else if (this.parentCtx == null)
          return other.parentCtx == null;
        else
          return this.parentCtx.equals(other.parentCtx);
      }
    }
    toString() {
      const up = this.parentCtx === null ? "" : this.parentCtx.toString();
      if (up.length === 0) {
        if (this.returnState === PredictionContext.EMPTY_RETURN_STATE) {
          return "$";
        } else {
          return "" + this.returnState;
        }
      } else {
        return "" + this.returnState + " " + up;
      }
    }
    get length() {
      return 1;
    }
    static create(parent, returnState) {
      if (returnState === PredictionContext.EMPTY_RETURN_STATE && parent === null) {
        return PredictionContext.EMPTY;
      } else {
        return new SingletonPredictionContext(parent, returnState);
      }
    }
  }

  class EmptyPredictionContext extends SingletonPredictionContext {
    constructor() {
      super(null, PredictionContext.EMPTY_RETURN_STATE);
    }
    isEmpty() {
      return true;
    }
    getParent(index) {
      return null;
    }
    getReturnState(index) {
      return this.returnState;
    }
    equals(other) {
      return this === other;
    }
    toString() {
      return "$";
    }
  }
  PredictionContext.EMPTY = new EmptyPredictionContext;

  class ArrayPredictionContext extends PredictionContext {
    constructor(parents, returnStates) {
      const h = new Hash2;
      h.update(parents, returnStates);
      const hashCode = h.finish();
      super(hashCode);
      this.parents = parents;
      this.returnStates = returnStates;
      return this;
    }
    isEmpty() {
      return this.returnStates[0] === PredictionContext.EMPTY_RETURN_STATE;
    }
    getParent(index) {
      return this.parents[index];
    }
    getReturnState(index) {
      return this.returnStates[index];
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof ArrayPredictionContext)) {
        return false;
      } else if (this.hashCode() !== other.hashCode()) {
        return false;
      } else {
        return equalArrays(this.returnStates, other.returnStates) && equalArrays(this.parents, other.parents);
      }
    }
    toString() {
      if (this.isEmpty()) {
        return "[]";
      } else {
        let s = "[";
        for (let i = 0;i < this.returnStates.length; i++) {
          if (i > 0) {
            s = s + ", ";
          }
          if (this.returnStates[i] === PredictionContext.EMPTY_RETURN_STATE) {
            s = s + "$";
            continue;
          }
          s = s + this.returnStates[i];
          if (this.parents[i] !== null) {
            s = s + " " + this.parents[i];
          } else {
            s = s + "null";
          }
        }
        return s + "]";
      }
    }
    get length() {
      return this.returnStates.length;
    }
  }
  module.exports = {
    merge,
    PredictionContext,
    PredictionContextCache,
    SingletonPredictionContext,
    predictionContextFromRuleContext,
    getCachedPredictionContext
  };
});

// node_modules/antlr4/src/antlr4/LL1Analyzer.js
var require_LL1Analyzer = __commonJS((exports, module) => {
  var { Set: Set2, BitSet } = require_Utils();
  var { Token } = require_Token();
  var { ATNConfig } = require_ATNConfig();
  var { IntervalSet } = require_IntervalSet();
  var { RuleStopState } = require_ATNState();
  var { RuleTransition, NotSetTransition, WildcardTransition, AbstractPredicateTransition } = require_Transition();
  var { predictionContextFromRuleContext, PredictionContext, SingletonPredictionContext } = require_PredictionContext();

  class LL1Analyzer {
    constructor(atn) {
      this.atn = atn;
    }
    getDecisionLookahead(s) {
      if (s === null) {
        return null;
      }
      const count = s.transitions.length;
      const look = [];
      for (let alt = 0;alt < count; alt++) {
        look[alt] = new IntervalSet;
        const lookBusy = new Set2;
        const seeThruPreds = false;
        this._LOOK(s.transition(alt).target, null, PredictionContext.EMPTY, look[alt], lookBusy, new BitSet, seeThruPreds, false);
        if (look[alt].length === 0 || look[alt].contains(LL1Analyzer.HIT_PRED)) {
          look[alt] = null;
        }
      }
      return look;
    }
    LOOK(s, stopState, ctx) {
      const r = new IntervalSet;
      const seeThruPreds = true;
      ctx = ctx || null;
      const lookContext = ctx !== null ? predictionContextFromRuleContext(s.atn, ctx) : null;
      this._LOOK(s, stopState, lookContext, r, new Set2, new BitSet, seeThruPreds, true);
      return r;
    }
    _LOOK(s, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF) {
      const c = new ATNConfig({ state: s, alt: 0, context: ctx }, null);
      if (lookBusy.contains(c)) {
        return;
      }
      lookBusy.add(c);
      if (s === stopState) {
        if (ctx === null) {
          look.addOne(Token.EPSILON);
          return;
        } else if (ctx.isEmpty() && addEOF) {
          look.addOne(Token.EOF);
          return;
        }
      }
      if (s instanceof RuleStopState) {
        if (ctx === null) {
          look.addOne(Token.EPSILON);
          return;
        } else if (ctx.isEmpty() && addEOF) {
          look.addOne(Token.EOF);
          return;
        }
        if (ctx !== PredictionContext.EMPTY) {
          const removed = calledRuleStack.contains(s.ruleIndex);
          try {
            calledRuleStack.remove(s.ruleIndex);
            for (let i = 0;i < ctx.length; i++) {
              const returnState = this.atn.states[ctx.getReturnState(i)];
              this._LOOK(returnState, stopState, ctx.getParent(i), look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
            }
          } finally {
            if (removed) {
              calledRuleStack.add(s.ruleIndex);
            }
          }
          return;
        }
      }
      for (let j = 0;j < s.transitions.length; j++) {
        const t = s.transitions[j];
        if (t.constructor === RuleTransition) {
          if (calledRuleStack.contains(t.target.ruleIndex)) {
            continue;
          }
          const newContext = SingletonPredictionContext.create(ctx, t.followState.stateNumber);
          try {
            calledRuleStack.add(t.target.ruleIndex);
            this._LOOK(t.target, stopState, newContext, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
          } finally {
            calledRuleStack.remove(t.target.ruleIndex);
          }
        } else if (t instanceof AbstractPredicateTransition) {
          if (seeThruPreds) {
            this._LOOK(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
          } else {
            look.addOne(LL1Analyzer.HIT_PRED);
          }
        } else if (t.isEpsilon) {
          this._LOOK(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
        } else if (t.constructor === WildcardTransition) {
          look.addRange(Token.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType);
        } else {
          let set = t.label;
          if (set !== null) {
            if (t instanceof NotSetTransition) {
              set = set.complement(Token.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType);
            }
            look.addSet(set);
          }
        }
      }
    }
  }
  LL1Analyzer.HIT_PRED = Token.INVALID_TYPE;
  module.exports = LL1Analyzer;
});

// node_modules/antlr4/src/antlr4/atn/ATN.js
var require_ATN = __commonJS((exports, module) => {
  var LL1Analyzer = require_LL1Analyzer();
  var { IntervalSet } = require_IntervalSet();
  var { Token } = require_Token();

  class ATN {
    constructor(grammarType, maxTokenType) {
      this.grammarType = grammarType;
      this.maxTokenType = maxTokenType;
      this.states = [];
      this.decisionToState = [];
      this.ruleToStartState = [];
      this.ruleToStopState = null;
      this.modeNameToStartState = {};
      this.ruleToTokenType = null;
      this.lexerActions = null;
      this.modeToStartState = [];
    }
    nextTokensInContext(s, ctx) {
      const anal = new LL1Analyzer(this);
      return anal.LOOK(s, null, ctx);
    }
    nextTokensNoContext(s) {
      if (s.nextTokenWithinRule !== null) {
        return s.nextTokenWithinRule;
      }
      s.nextTokenWithinRule = this.nextTokensInContext(s, null);
      s.nextTokenWithinRule.readOnly = true;
      return s.nextTokenWithinRule;
    }
    nextTokens(s, ctx) {
      if (ctx === undefined) {
        return this.nextTokensNoContext(s);
      } else {
        return this.nextTokensInContext(s, ctx);
      }
    }
    addState(state) {
      if (state !== null) {
        state.atn = this;
        state.stateNumber = this.states.length;
      }
      this.states.push(state);
    }
    removeState(state) {
      this.states[state.stateNumber] = null;
    }
    defineDecisionState(s) {
      this.decisionToState.push(s);
      s.decision = this.decisionToState.length - 1;
      return s.decision;
    }
    getDecisionState(decision) {
      if (this.decisionToState.length === 0) {
        return null;
      } else {
        return this.decisionToState[decision];
      }
    }
    getExpectedTokens(stateNumber, ctx) {
      if (stateNumber < 0 || stateNumber >= this.states.length) {
        throw "Invalid state number.";
      }
      const s = this.states[stateNumber];
      let following = this.nextTokens(s);
      if (!following.contains(Token.EPSILON)) {
        return following;
      }
      const expected = new IntervalSet;
      expected.addSet(following);
      expected.removeOne(Token.EPSILON);
      while (ctx !== null && ctx.invokingState >= 0 && following.contains(Token.EPSILON)) {
        const invokingState = this.states[ctx.invokingState];
        const rt = invokingState.transitions[0];
        following = this.nextTokens(rt.followState);
        expected.addSet(following);
        expected.removeOne(Token.EPSILON);
        ctx = ctx.parentCtx;
      }
      if (following.contains(Token.EPSILON)) {
        expected.addOne(Token.EOF);
      }
      return expected;
    }
  }
  ATN.INVALID_ALT_NUMBER = 0;
  module.exports = ATN;
});

// node_modules/antlr4/src/antlr4/atn/ATNType.js
var require_ATNType = __commonJS((exports, module) => {
  module.exports = {
    LEXER: 0,
    PARSER: 1
  };
});

// node_modules/antlr4/src/antlr4/atn/ATNDeserializationOptions.js
var require_ATNDeserializationOptions = __commonJS((exports, module) => {
  class ATNDeserializationOptions {
    constructor(copyFrom) {
      if (copyFrom === undefined) {
        copyFrom = null;
      }
      this.readOnly = false;
      this.verifyATN = copyFrom === null ? true : copyFrom.verifyATN;
      this.generateRuleBypassTransitions = copyFrom === null ? false : copyFrom.generateRuleBypassTransitions;
    }
  }
  ATNDeserializationOptions.defaultOptions = new ATNDeserializationOptions;
  ATNDeserializationOptions.defaultOptions.readOnly = true;
  module.exports = ATNDeserializationOptions;
});

// node_modules/antlr4/src/antlr4/atn/LexerAction.js
var require_LexerAction = __commonJS((exports, module) => {
  var LexerActionType = {
    CHANNEL: 0,
    CUSTOM: 1,
    MODE: 2,
    MORE: 3,
    POP_MODE: 4,
    PUSH_MODE: 5,
    SKIP: 6,
    TYPE: 7
  };

  class LexerAction {
    constructor(action) {
      this.actionType = action;
      this.isPositionDependent = false;
    }
    hashCode() {
      const hash = new Hash;
      this.updateHashCode(hash);
      return hash.finish();
    }
    updateHashCode(hash) {
      hash.update(this.actionType);
    }
    equals(other) {
      return this === other;
    }
  }

  class LexerSkipAction extends LexerAction {
    constructor() {
      super(LexerActionType.SKIP);
    }
    execute(lexer) {
      lexer.skip();
    }
    toString() {
      return "skip";
    }
  }
  LexerSkipAction.INSTANCE = new LexerSkipAction;

  class LexerTypeAction extends LexerAction {
    constructor(type) {
      super(LexerActionType.TYPE);
      this.type = type;
    }
    execute(lexer) {
      lexer.type = this.type;
    }
    updateHashCode(hash) {
      hash.update(this.actionType, this.type);
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof LexerTypeAction)) {
        return false;
      } else {
        return this.type === other.type;
      }
    }
    toString() {
      return "type(" + this.type + ")";
    }
  }

  class LexerPushModeAction extends LexerAction {
    constructor(mode) {
      super(LexerActionType.PUSH_MODE);
      this.mode = mode;
    }
    execute(lexer) {
      lexer.pushMode(this.mode);
    }
    updateHashCode(hash) {
      hash.update(this.actionType, this.mode);
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof LexerPushModeAction)) {
        return false;
      } else {
        return this.mode === other.mode;
      }
    }
    toString() {
      return "pushMode(" + this.mode + ")";
    }
  }

  class LexerPopModeAction extends LexerAction {
    constructor() {
      super(LexerActionType.POP_MODE);
    }
    execute(lexer) {
      lexer.popMode();
    }
    toString() {
      return "popMode";
    }
  }
  LexerPopModeAction.INSTANCE = new LexerPopModeAction;

  class LexerMoreAction extends LexerAction {
    constructor() {
      super(LexerActionType.MORE);
    }
    execute(lexer) {
      lexer.more();
    }
    toString() {
      return "more";
    }
  }
  LexerMoreAction.INSTANCE = new LexerMoreAction;

  class LexerModeAction extends LexerAction {
    constructor(mode) {
      super(LexerActionType.MODE);
      this.mode = mode;
    }
    execute(lexer) {
      lexer.mode(this.mode);
    }
    updateHashCode(hash) {
      hash.update(this.actionType, this.mode);
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof LexerModeAction)) {
        return false;
      } else {
        return this.mode === other.mode;
      }
    }
    toString() {
      return "mode(" + this.mode + ")";
    }
  }

  class LexerCustomAction extends LexerAction {
    constructor(ruleIndex, actionIndex) {
      super(LexerActionType.CUSTOM);
      this.ruleIndex = ruleIndex;
      this.actionIndex = actionIndex;
      this.isPositionDependent = true;
    }
    execute(lexer) {
      lexer.action(null, this.ruleIndex, this.actionIndex);
    }
    updateHashCode(hash) {
      hash.update(this.actionType, this.ruleIndex, this.actionIndex);
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof LexerCustomAction)) {
        return false;
      } else {
        return this.ruleIndex === other.ruleIndex && this.actionIndex === other.actionIndex;
      }
    }
  }

  class LexerChannelAction extends LexerAction {
    constructor(channel) {
      super(LexerActionType.CHANNEL);
      this.channel = channel;
    }
    execute(lexer) {
      lexer._channel = this.channel;
    }
    updateHashCode(hash) {
      hash.update(this.actionType, this.channel);
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof LexerChannelAction)) {
        return false;
      } else {
        return this.channel === other.channel;
      }
    }
    toString() {
      return "channel(" + this.channel + ")";
    }
  }

  class LexerIndexedCustomAction extends LexerAction {
    constructor(offset, action) {
      super(action.actionType);
      this.offset = offset;
      this.action = action;
      this.isPositionDependent = true;
    }
    execute(lexer) {
      this.action.execute(lexer);
    }
    updateHashCode(hash) {
      hash.update(this.actionType, this.offset, this.action);
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof LexerIndexedCustomAction)) {
        return false;
      } else {
        return this.offset === other.offset && this.action === other.action;
      }
    }
  }
  module.exports = {
    LexerActionType,
    LexerSkipAction,
    LexerChannelAction,
    LexerCustomAction,
    LexerIndexedCustomAction,
    LexerMoreAction,
    LexerTypeAction,
    LexerPushModeAction,
    LexerPopModeAction,
    LexerModeAction
  };
});

// node_modules/antlr4/src/antlr4/atn/ATNDeserializer.js
var require_ATNDeserializer = __commonJS((exports, module) => {
  var initArray = function(length, value) {
    const tmp = [];
    tmp[length - 1] = value;
    return tmp.map(function(i) {
      return value;
    });
  };
  var createByteToHex = function() {
    const bth = [];
    for (let i = 0;i < 256; i++) {
      bth[i] = (i + 256).toString(16).substr(1).toUpperCase();
    }
    return bth;
  };
  var { Token } = require_Token();
  var ATN = require_ATN();
  var ATNType = require_ATNType();
  var {
    ATNState,
    BasicState,
    DecisionState,
    BlockStartState,
    BlockEndState,
    LoopEndState,
    RuleStartState,
    RuleStopState,
    TokensStartState,
    PlusLoopbackState,
    StarLoopbackState,
    StarLoopEntryState,
    PlusBlockStartState,
    StarBlockStartState,
    BasicBlockStartState
  } = require_ATNState();
  var {
    Transition,
    AtomTransition: AtomTransition2,
    SetTransition,
    NotSetTransition,
    RuleTransition,
    RangeTransition,
    ActionTransition,
    EpsilonTransition,
    WildcardTransition,
    PredicateTransition,
    PrecedencePredicateTransition
  } = require_Transition();
  var { IntervalSet } = require_IntervalSet();
  var ATNDeserializationOptions = require_ATNDeserializationOptions();
  var {
    LexerActionType,
    LexerSkipAction,
    LexerChannelAction,
    LexerCustomAction,
    LexerMoreAction,
    LexerTypeAction,
    LexerPushModeAction,
    LexerPopModeAction,
    LexerModeAction
  } = require_LexerAction();
  var BASE_SERIALIZED_UUID = "AADB8D7E-AEEF-4415-AD2B-8204D6CF042E";
  var ADDED_UNICODE_SMP = "59627784-3BE5-417A-B9EB-8131A7286089";
  var SUPPORTED_UUIDS = [BASE_SERIALIZED_UUID, ADDED_UNICODE_SMP];
  var SERIALIZED_VERSION = 3;
  var SERIALIZED_UUID = ADDED_UNICODE_SMP;

  class ATNDeserializer {
    constructor(options) {
      if (options === undefined || options === null) {
        options = ATNDeserializationOptions.defaultOptions;
      }
      this.deserializationOptions = options;
      this.stateFactories = null;
      this.actionFactories = null;
    }
    isFeatureSupported(feature, actualUuid) {
      const idx1 = SUPPORTED_UUIDS.indexOf(feature);
      if (idx1 < 0) {
        return false;
      }
      const idx2 = SUPPORTED_UUIDS.indexOf(actualUuid);
      return idx2 >= idx1;
    }
    deserialize(data) {
      this.reset(data);
      this.checkVersion();
      this.checkUUID();
      const atn = this.readATN();
      this.readStates(atn);
      this.readRules(atn);
      this.readModes(atn);
      const sets = [];
      this.readSets(atn, sets, this.readInt.bind(this));
      if (this.isFeatureSupported(ADDED_UNICODE_SMP, this.uuid)) {
        this.readSets(atn, sets, this.readInt32.bind(this));
      }
      this.readEdges(atn, sets);
      this.readDecisions(atn);
      this.readLexerActions(atn);
      this.markPrecedenceDecisions(atn);
      this.verifyATN(atn);
      if (this.deserializationOptions.generateRuleBypassTransitions && atn.grammarType === ATNType.PARSER) {
        this.generateRuleBypassTransitions(atn);
        this.verifyATN(atn);
      }
      return atn;
    }
    reset(data) {
      const adjust = function(c) {
        const v = c.charCodeAt(0);
        return v > 1 ? v - 2 : v + 65534;
      };
      const temp = data.split("").map(adjust);
      temp[0] = data.charCodeAt(0);
      this.data = temp;
      this.pos = 0;
    }
    checkVersion() {
      const version = this.readInt();
      if (version !== SERIALIZED_VERSION) {
        throw "Could not deserialize ATN with version " + version + " (expected " + SERIALIZED_VERSION + ").";
      }
    }
    checkUUID() {
      const uuid = this.readUUID();
      if (SUPPORTED_UUIDS.indexOf(uuid) < 0) {
        throw "Could not deserialize ATN with UUID: " + uuid + " (expected " + SERIALIZED_UUID + " or a legacy UUID).", uuid, SERIALIZED_UUID;
      }
      this.uuid = uuid;
    }
    readATN() {
      const grammarType = this.readInt();
      const maxTokenType = this.readInt();
      return new ATN(grammarType, maxTokenType);
    }
    readStates(atn) {
      let j, pair, stateNumber;
      const loopBackStateNumbers = [];
      const endStateNumbers = [];
      const nstates = this.readInt();
      for (let i = 0;i < nstates; i++) {
        const stype = this.readInt();
        if (stype === ATNState.INVALID_TYPE) {
          atn.addState(null);
          continue;
        }
        let ruleIndex = this.readInt();
        if (ruleIndex === 65535) {
          ruleIndex = -1;
        }
        const s = this.stateFactory(stype, ruleIndex);
        if (stype === ATNState.LOOP_END) {
          const loopBackStateNumber = this.readInt();
          loopBackStateNumbers.push([s, loopBackStateNumber]);
        } else if (s instanceof BlockStartState) {
          const endStateNumber = this.readInt();
          endStateNumbers.push([s, endStateNumber]);
        }
        atn.addState(s);
      }
      for (j = 0;j < loopBackStateNumbers.length; j++) {
        pair = loopBackStateNumbers[j];
        pair[0].loopBackState = atn.states[pair[1]];
      }
      for (j = 0;j < endStateNumbers.length; j++) {
        pair = endStateNumbers[j];
        pair[0].endState = atn.states[pair[1]];
      }
      let numNonGreedyStates = this.readInt();
      for (j = 0;j < numNonGreedyStates; j++) {
        stateNumber = this.readInt();
        atn.states[stateNumber].nonGreedy = true;
      }
      let numPrecedenceStates = this.readInt();
      for (j = 0;j < numPrecedenceStates; j++) {
        stateNumber = this.readInt();
        atn.states[stateNumber].isPrecedenceRule = true;
      }
    }
    readRules(atn) {
      let i;
      const nrules = this.readInt();
      if (atn.grammarType === ATNType.LEXER) {
        atn.ruleToTokenType = initArray(nrules, 0);
      }
      atn.ruleToStartState = initArray(nrules, 0);
      for (i = 0;i < nrules; i++) {
        const s = this.readInt();
        atn.ruleToStartState[i] = atn.states[s];
        if (atn.grammarType === ATNType.LEXER) {
          let tokenType = this.readInt();
          if (tokenType === 65535) {
            tokenType = Token.EOF;
          }
          atn.ruleToTokenType[i] = tokenType;
        }
      }
      atn.ruleToStopState = initArray(nrules, 0);
      for (i = 0;i < atn.states.length; i++) {
        const state = atn.states[i];
        if (!(state instanceof RuleStopState)) {
          continue;
        }
        atn.ruleToStopState[state.ruleIndex] = state;
        atn.ruleToStartState[state.ruleIndex].stopState = state;
      }
    }
    readModes(atn) {
      const nmodes = this.readInt();
      for (let i = 0;i < nmodes; i++) {
        let s = this.readInt();
        atn.modeToStartState.push(atn.states[s]);
      }
    }
    readSets(atn, sets, readUnicode) {
      const m = this.readInt();
      for (let i = 0;i < m; i++) {
        const iset = new IntervalSet;
        sets.push(iset);
        const n = this.readInt();
        const containsEof = this.readInt();
        if (containsEof !== 0) {
          iset.addOne(-1);
        }
        for (let j = 0;j < n; j++) {
          const i1 = readUnicode();
          const i2 = readUnicode();
          iset.addRange(i1, i2);
        }
      }
    }
    readEdges(atn, sets) {
      let i, j, state, trans, target;
      const nedges = this.readInt();
      for (i = 0;i < nedges; i++) {
        const src = this.readInt();
        const trg = this.readInt();
        const ttype = this.readInt();
        const arg1 = this.readInt();
        const arg2 = this.readInt();
        const arg3 = this.readInt();
        trans = this.edgeFactory(atn, ttype, src, trg, arg1, arg2, arg3, sets);
        const srcState = atn.states[src];
        srcState.addTransition(trans);
      }
      for (i = 0;i < atn.states.length; i++) {
        state = atn.states[i];
        for (j = 0;j < state.transitions.length; j++) {
          const t = state.transitions[j];
          if (!(t instanceof RuleTransition)) {
            continue;
          }
          let outermostPrecedenceReturn = -1;
          if (atn.ruleToStartState[t.target.ruleIndex].isPrecedenceRule) {
            if (t.precedence === 0) {
              outermostPrecedenceReturn = t.target.ruleIndex;
            }
          }
          trans = new EpsilonTransition(t.followState, outermostPrecedenceReturn);
          atn.ruleToStopState[t.target.ruleIndex].addTransition(trans);
        }
      }
      for (i = 0;i < atn.states.length; i++) {
        state = atn.states[i];
        if (state instanceof BlockStartState) {
          if (state.endState === null) {
            throw "IllegalState";
          }
          if (state.endState.startState !== null) {
            throw "IllegalState";
          }
          state.endState.startState = state;
        }
        if (state instanceof PlusLoopbackState) {
          for (j = 0;j < state.transitions.length; j++) {
            target = state.transitions[j].target;
            if (target instanceof PlusBlockStartState) {
              target.loopBackState = state;
            }
          }
        } else if (state instanceof StarLoopbackState) {
          for (j = 0;j < state.transitions.length; j++) {
            target = state.transitions[j].target;
            if (target instanceof StarLoopEntryState) {
              target.loopBackState = state;
            }
          }
        }
      }
    }
    readDecisions(atn) {
      const ndecisions = this.readInt();
      for (let i = 0;i < ndecisions; i++) {
        const s = this.readInt();
        const decState = atn.states[s];
        atn.decisionToState.push(decState);
        decState.decision = i;
      }
    }
    readLexerActions(atn) {
      if (atn.grammarType === ATNType.LEXER) {
        const count = this.readInt();
        atn.lexerActions = initArray(count, null);
        for (let i = 0;i < count; i++) {
          const actionType = this.readInt();
          let data1 = this.readInt();
          if (data1 === 65535) {
            data1 = -1;
          }
          let data2 = this.readInt();
          if (data2 === 65535) {
            data2 = -1;
          }
          atn.lexerActions[i] = this.lexerActionFactory(actionType, data1, data2);
        }
      }
    }
    generateRuleBypassTransitions(atn) {
      let i;
      const count = atn.ruleToStartState.length;
      for (i = 0;i < count; i++) {
        atn.ruleToTokenType[i] = atn.maxTokenType + i + 1;
      }
      for (i = 0;i < count; i++) {
        this.generateRuleBypassTransition(atn, i);
      }
    }
    generateRuleBypassTransition(atn, idx) {
      let i, state;
      const bypassStart = new BasicBlockStartState;
      bypassStart.ruleIndex = idx;
      atn.addState(bypassStart);
      const bypassStop = new BlockEndState;
      bypassStop.ruleIndex = idx;
      atn.addState(bypassStop);
      bypassStart.endState = bypassStop;
      atn.defineDecisionState(bypassStart);
      bypassStop.startState = bypassStart;
      let excludeTransition = null;
      let endState = null;
      if (atn.ruleToStartState[idx].isPrecedenceRule) {
        endState = null;
        for (i = 0;i < atn.states.length; i++) {
          state = atn.states[i];
          if (this.stateIsEndStateFor(state, idx)) {
            endState = state;
            excludeTransition = state.loopBackState.transitions[0];
            break;
          }
        }
        if (excludeTransition === null) {
          throw "Couldn't identify final state of the precedence rule prefix section.";
        }
      } else {
        endState = atn.ruleToStopState[idx];
      }
      for (i = 0;i < atn.states.length; i++) {
        state = atn.states[i];
        for (let j = 0;j < state.transitions.length; j++) {
          const transition = state.transitions[j];
          if (transition === excludeTransition) {
            continue;
          }
          if (transition.target === endState) {
            transition.target = bypassStop;
          }
        }
      }
      const ruleToStartState = atn.ruleToStartState[idx];
      const count = ruleToStartState.transitions.length;
      while (count > 0) {
        bypassStart.addTransition(ruleToStartState.transitions[count - 1]);
        ruleToStartState.transitions = ruleToStartState.transitions.slice(-1);
      }
      atn.ruleToStartState[idx].addTransition(new EpsilonTransition(bypassStart));
      bypassStop.addTransition(new EpsilonTransition(endState));
      const matchState = new BasicState;
      atn.addState(matchState);
      matchState.addTransition(new AtomTransition2(bypassStop, atn.ruleToTokenType[idx]));
      bypassStart.addTransition(new EpsilonTransition(matchState));
    }
    stateIsEndStateFor(state, idx) {
      if (state.ruleIndex !== idx) {
        return null;
      }
      if (!(state instanceof StarLoopEntryState)) {
        return null;
      }
      const maybeLoopEndState = state.transitions[state.transitions.length - 1].target;
      if (!(maybeLoopEndState instanceof LoopEndState)) {
        return null;
      }
      if (maybeLoopEndState.epsilonOnlyTransitions && maybeLoopEndState.transitions[0].target instanceof RuleStopState) {
        return state;
      } else {
        return null;
      }
    }
    markPrecedenceDecisions(atn) {
      for (let i = 0;i < atn.states.length; i++) {
        const state = atn.states[i];
        if (!(state instanceof StarLoopEntryState)) {
          continue;
        }
        if (atn.ruleToStartState[state.ruleIndex].isPrecedenceRule) {
          const maybeLoopEndState = state.transitions[state.transitions.length - 1].target;
          if (maybeLoopEndState instanceof LoopEndState) {
            if (maybeLoopEndState.epsilonOnlyTransitions && maybeLoopEndState.transitions[0].target instanceof RuleStopState) {
              state.isPrecedenceDecision = true;
            }
          }
        }
      }
    }
    verifyATN(atn) {
      if (!this.deserializationOptions.verifyATN) {
        return;
      }
      for (let i = 0;i < atn.states.length; i++) {
        const state = atn.states[i];
        if (state === null) {
          continue;
        }
        this.checkCondition(state.epsilonOnlyTransitions || state.transitions.length <= 1);
        if (state instanceof PlusBlockStartState) {
          this.checkCondition(state.loopBackState !== null);
        } else if (state instanceof StarLoopEntryState) {
          this.checkCondition(state.loopBackState !== null);
          this.checkCondition(state.transitions.length === 2);
          if (state.transitions[0].target instanceof StarBlockStartState) {
            this.checkCondition(state.transitions[1].target instanceof LoopEndState);
            this.checkCondition(!state.nonGreedy);
          } else if (state.transitions[0].target instanceof LoopEndState) {
            this.checkCondition(state.transitions[1].target instanceof StarBlockStartState);
            this.checkCondition(state.nonGreedy);
          } else {
            throw "IllegalState";
          }
        } else if (state instanceof StarLoopbackState) {
          this.checkCondition(state.transitions.length === 1);
          this.checkCondition(state.transitions[0].target instanceof StarLoopEntryState);
        } else if (state instanceof LoopEndState) {
          this.checkCondition(state.loopBackState !== null);
        } else if (state instanceof RuleStartState) {
          this.checkCondition(state.stopState !== null);
        } else if (state instanceof BlockStartState) {
          this.checkCondition(state.endState !== null);
        } else if (state instanceof BlockEndState) {
          this.checkCondition(state.startState !== null);
        } else if (state instanceof DecisionState) {
          this.checkCondition(state.transitions.length <= 1 || state.decision >= 0);
        } else {
          this.checkCondition(state.transitions.length <= 1 || state instanceof RuleStopState);
        }
      }
    }
    checkCondition(condition, message) {
      if (!condition) {
        if (message === undefined || message === null) {
          message = "IllegalState";
        }
        throw message;
      }
    }
    readInt() {
      return this.data[this.pos++];
    }
    readInt32() {
      const low = this.readInt();
      const high = this.readInt();
      return low | high << 16;
    }
    readLong() {
      const low = this.readInt32();
      const high = this.readInt32();
      return low & 4294967295 | high << 32;
    }
    readUUID() {
      const bb = [];
      for (let i = 7;i >= 0; i--) {
        const int = this.readInt();
        bb[2 * i + 1] = int & 255;
        bb[2 * i] = int >> 8 & 255;
      }
      return byteToHex[bb[0]] + byteToHex[bb[1]] + byteToHex[bb[2]] + byteToHex[bb[3]] + "-" + byteToHex[bb[4]] + byteToHex[bb[5]] + "-" + byteToHex[bb[6]] + byteToHex[bb[7]] + "-" + byteToHex[bb[8]] + byteToHex[bb[9]] + "-" + byteToHex[bb[10]] + byteToHex[bb[11]] + byteToHex[bb[12]] + byteToHex[bb[13]] + byteToHex[bb[14]] + byteToHex[bb[15]];
    }
    edgeFactory(atn, type, src, trg, arg1, arg2, arg3, sets) {
      const target = atn.states[trg];
      switch (type) {
        case Transition.EPSILON:
          return new EpsilonTransition(target);
        case Transition.RANGE:
          return arg3 !== 0 ? new RangeTransition(target, Token.EOF, arg2) : new RangeTransition(target, arg1, arg2);
        case Transition.RULE:
          return new RuleTransition(atn.states[arg1], arg2, arg3, target);
        case Transition.PREDICATE:
          return new PredicateTransition(target, arg1, arg2, arg3 !== 0);
        case Transition.PRECEDENCE:
          return new PrecedencePredicateTransition(target, arg1);
        case Transition.ATOM:
          return arg3 !== 0 ? new AtomTransition2(target, Token.EOF) : new AtomTransition2(target, arg1);
        case Transition.ACTION:
          return new ActionTransition(target, arg1, arg2, arg3 !== 0);
        case Transition.SET:
          return new SetTransition(target, sets[arg1]);
        case Transition.NOT_SET:
          return new NotSetTransition(target, sets[arg1]);
        case Transition.WILDCARD:
          return new WildcardTransition(target);
        default:
          throw "The specified transition type: " + type + " is not valid.";
      }
    }
    stateFactory(type, ruleIndex) {
      if (this.stateFactories === null) {
        const sf = [];
        sf[ATNState.INVALID_TYPE] = null;
        sf[ATNState.BASIC] = () => new BasicState;
        sf[ATNState.RULE_START] = () => new RuleStartState;
        sf[ATNState.BLOCK_START] = () => new BasicBlockStartState;
        sf[ATNState.PLUS_BLOCK_START] = () => new PlusBlockStartState;
        sf[ATNState.STAR_BLOCK_START] = () => new StarBlockStartState;
        sf[ATNState.TOKEN_START] = () => new TokensStartState;
        sf[ATNState.RULE_STOP] = () => new RuleStopState;
        sf[ATNState.BLOCK_END] = () => new BlockEndState;
        sf[ATNState.STAR_LOOP_BACK] = () => new StarLoopbackState;
        sf[ATNState.STAR_LOOP_ENTRY] = () => new StarLoopEntryState;
        sf[ATNState.PLUS_LOOP_BACK] = () => new PlusLoopbackState;
        sf[ATNState.LOOP_END] = () => new LoopEndState;
        this.stateFactories = sf;
      }
      if (type > this.stateFactories.length || this.stateFactories[type] === null) {
        throw "The specified state type " + type + " is not valid.";
      } else {
        const s = this.stateFactories[type]();
        if (s !== null) {
          s.ruleIndex = ruleIndex;
          return s;
        }
      }
    }
    lexerActionFactory(type, data1, data2) {
      if (this.actionFactories === null) {
        const af = [];
        af[LexerActionType.CHANNEL] = (data12, data22) => new LexerChannelAction(data12);
        af[LexerActionType.CUSTOM] = (data12, data22) => new LexerCustomAction(data12, data22);
        af[LexerActionType.MODE] = (data12, data22) => new LexerModeAction(data12);
        af[LexerActionType.MORE] = (data12, data22) => LexerMoreAction.INSTANCE;
        af[LexerActionType.POP_MODE] = (data12, data22) => LexerPopModeAction.INSTANCE;
        af[LexerActionType.PUSH_MODE] = (data12, data22) => new LexerPushModeAction(data12);
        af[LexerActionType.SKIP] = (data12, data22) => LexerSkipAction.INSTANCE;
        af[LexerActionType.TYPE] = (data12, data22) => new LexerTypeAction(data12);
        this.actionFactories = af;
      }
      if (type > this.actionFactories.length || this.actionFactories[type] === null) {
        throw "The specified lexer action type " + type + " is not valid.";
      } else {
        return this.actionFactories[type](data1, data2);
      }
    }
  }
  var byteToHex = createByteToHex();
  module.exports = ATNDeserializer;
});

// node_modules/antlr4/src/antlr4/error/ErrorListener.js
var require_ErrorListener = __commonJS((exports, module) => {
  class ErrorListener {
    syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
    }
    reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs) {
    }
    reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs) {
    }
    reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs) {
    }
  }

  class ConsoleErrorListener extends ErrorListener {
    constructor() {
      super();
    }
    syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
      console.error("line " + line + ":" + column + " " + msg);
    }
  }
  ConsoleErrorListener.INSTANCE = new ConsoleErrorListener;

  class ProxyErrorListener extends ErrorListener {
    constructor(delegates) {
      super();
      if (delegates === null) {
        throw "delegates";
      }
      this.delegates = delegates;
      return this;
    }
    syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
      this.delegates.map((d) => d.syntaxError(recognizer, offendingSymbol, line, column, msg, e));
    }
    reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs) {
      this.delegates.map((d) => d.reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs));
    }
    reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs) {
      this.delegates.map((d) => d.reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs));
    }
    reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs) {
      this.delegates.map((d) => d.reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs));
    }
  }
  module.exports = { ErrorListener, ConsoleErrorListener, ProxyErrorListener };
});

// node_modules/antlr4/src/antlr4/Recognizer.js
var require_Recognizer = __commonJS((exports, module) => {
  var { Token } = require_Token();
  var { ConsoleErrorListener } = require_ErrorListener();
  var { ProxyErrorListener } = require_ErrorListener();

  class Recognizer {
    constructor() {
      this._listeners = [ConsoleErrorListener.INSTANCE];
      this._interp = null;
      this._stateNumber = -1;
    }
    checkVersion(toolVersion) {
      const runtimeVersion = "4.9.3";
      if (runtimeVersion !== toolVersion) {
        console.log("ANTLR runtime and generated code versions disagree: " + runtimeVersion + "!=" + toolVersion);
      }
    }
    addErrorListener(listener) {
      this._listeners.push(listener);
    }
    removeErrorListeners() {
      this._listeners = [];
    }
    getLiteralNames() {
      return Object.getPrototypeOf(this).constructor.literalNames || [];
    }
    getSymbolicNames() {
      return Object.getPrototypeOf(this).constructor.symbolicNames || [];
    }
    getTokenNames() {
      if (!this.tokenNames) {
        const literalNames = this.getLiteralNames();
        const symbolicNames = this.getSymbolicNames();
        const length = literalNames.length > symbolicNames.length ? literalNames.length : symbolicNames.length;
        this.tokenNames = [];
        for (let i = 0;i < length; i++) {
          this.tokenNames[i] = literalNames[i] || symbolicNames[i] || "<INVALID";
        }
      }
      return this.tokenNames;
    }
    getTokenTypeMap() {
      const tokenNames = this.getTokenNames();
      if (tokenNames === null) {
        throw "The current recognizer does not provide a list of token names.";
      }
      let result = this.tokenTypeMapCache[tokenNames];
      if (result === undefined) {
        result = tokenNames.reduce(function(o, k, i) {
          o[k] = i;
        });
        result.EOF = Token.EOF;
        this.tokenTypeMapCache[tokenNames] = result;
      }
      return result;
    }
    getRuleIndexMap() {
      const ruleNames = this.ruleNames;
      if (ruleNames === null) {
        throw "The current recognizer does not provide a list of rule names.";
      }
      let result = this.ruleIndexMapCache[ruleNames];
      if (result === undefined) {
        result = ruleNames.reduce(function(o, k, i) {
          o[k] = i;
        });
        this.ruleIndexMapCache[ruleNames] = result;
      }
      return result;
    }
    getTokenType(tokenName) {
      const ttype = this.getTokenTypeMap()[tokenName];
      if (ttype !== undefined) {
        return ttype;
      } else {
        return Token.INVALID_TYPE;
      }
    }
    getErrorHeader(e) {
      const line = e.getOffendingToken().line;
      const column = e.getOffendingToken().column;
      return "line " + line + ":" + column;
    }
    getTokenErrorDisplay(t) {
      if (t === null) {
        return "<no token>";
      }
      let s = t.text;
      if (s === null) {
        if (t.type === Token.EOF) {
          s = "<EOF>";
        } else {
          s = "<" + t.type + ">";
        }
      }
      s = s.replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
      return "'" + s + "'";
    }
    getErrorListenerDispatch() {
      return new ProxyErrorListener(this._listeners);
    }
    sempred(localctx, ruleIndex, actionIndex) {
      return true;
    }
    precpred(localctx, precedence) {
      return true;
    }
    get state() {
      return this._stateNumber;
    }
    set state(state) {
      this._stateNumber = state;
    }
  }
  Recognizer.tokenTypeMapCache = {};
  Recognizer.ruleIndexMapCache = {};
  module.exports = Recognizer;
});

// node_modules/antlr4/src/antlr4/CommonTokenFactory.js
var require_CommonTokenFactory = __commonJS((exports, module) => {
  var CommonToken = require_Token().CommonToken;

  class TokenFactory {
  }

  class CommonTokenFactory extends TokenFactory {
    constructor(copyText) {
      super();
      this.copyText = copyText === undefined ? false : copyText;
    }
    create(source, type, text, channel, start, stop, line, column) {
      const t = new CommonToken(source, type, channel, start, stop);
      t.line = line;
      t.column = column;
      if (text !== null) {
        t.text = text;
      } else if (this.copyText && source[1] !== null) {
        t.text = source[1].getText(start, stop);
      }
      return t;
    }
    createThin(type, text) {
      const t = new CommonToken(null, type);
      t.text = text;
      return t;
    }
  }
  CommonTokenFactory.DEFAULT = new CommonTokenFactory;
  module.exports = CommonTokenFactory;
});

// node_modules/antlr4/src/antlr4/error/Errors.js
var require_Errors = __commonJS((exports, module) => {
  var formatMessage = function(predicate, message) {
    if (message !== null) {
      return message;
    } else {
      return "failed predicate: {" + predicate + "}?";
    }
  };
  var { PredicateTransition } = require_Transition();
  var { Interval } = require_IntervalSet().Interval;

  class RecognitionException extends Error {
    constructor(params) {
      super(params.message);
      if (!!Error.captureStackTrace) {
        Error.captureStackTrace(this, RecognitionException);
      } else {
        var stack = new Error().stack;
      }
      this.message = params.message;
      this.recognizer = params.recognizer;
      this.input = params.input;
      this.ctx = params.ctx;
      this.offendingToken = null;
      this.offendingState = -1;
      if (this.recognizer !== null) {
        this.offendingState = this.recognizer.state;
      }
    }
    getExpectedTokens() {
      if (this.recognizer !== null) {
        return this.recognizer.atn.getExpectedTokens(this.offendingState, this.ctx);
      } else {
        return null;
      }
    }
    toString() {
      return this.message;
    }
  }

  class LexerNoViableAltException extends RecognitionException {
    constructor(lexer, input, startIndex, deadEndConfigs) {
      super({ message: "", recognizer: lexer, input, ctx: null });
      this.startIndex = startIndex;
      this.deadEndConfigs = deadEndConfigs;
    }
    toString() {
      let symbol = "";
      if (this.startIndex >= 0 && this.startIndex < this.input.size) {
        symbol = this.input.getText(new Interval(this.startIndex, this.startIndex));
      }
      return "LexerNoViableAltException" + symbol;
    }
  }

  class NoViableAltException extends RecognitionException {
    constructor(recognizer, input, startToken, offendingToken, deadEndConfigs, ctx) {
      ctx = ctx || recognizer._ctx;
      offendingToken = offendingToken || recognizer.getCurrentToken();
      startToken = startToken || recognizer.getCurrentToken();
      input = input || recognizer.getInputStream();
      super({ message: "", recognizer, input, ctx });
      this.deadEndConfigs = deadEndConfigs;
      this.startToken = startToken;
      this.offendingToken = offendingToken;
    }
  }

  class InputMismatchException extends RecognitionException {
    constructor(recognizer) {
      super({ message: "", recognizer, input: recognizer.getInputStream(), ctx: recognizer._ctx });
      this.offendingToken = recognizer.getCurrentToken();
    }
  }

  class FailedPredicateException extends RecognitionException {
    constructor(recognizer, predicate, message) {
      super({
        message: formatMessage(predicate, message || null),
        recognizer,
        input: recognizer.getInputStream(),
        ctx: recognizer._ctx
      });
      const s = recognizer._interp.atn.states[recognizer.state];
      const trans = s.transitions[0];
      if (trans instanceof PredicateTransition) {
        this.ruleIndex = trans.ruleIndex;
        this.predicateIndex = trans.predIndex;
      } else {
        this.ruleIndex = 0;
        this.predicateIndex = 0;
      }
      this.predicate = predicate;
      this.offendingToken = recognizer.getCurrentToken();
    }
  }

  class ParseCancellationException extends Error {
    constructor() {
      super();
      Error.captureStackTrace(this, ParseCancellationException);
    }
  }
  module.exports = {
    RecognitionException,
    NoViableAltException,
    LexerNoViableAltException,
    InputMismatchException,
    FailedPredicateException,
    ParseCancellationException
  };
});

// node_modules/antlr4/src/antlr4/Lexer.js
var require_Lexer = __commonJS((exports, module) => {
  var { Token } = require_Token();
  var Recognizer = require_Recognizer();
  var CommonTokenFactory = require_CommonTokenFactory();
  var { RecognitionException } = require_Errors();
  var { LexerNoViableAltException } = require_Errors();

  class Lexer extends Recognizer {
    constructor(input) {
      super();
      this._input = input;
      this._factory = CommonTokenFactory.DEFAULT;
      this._tokenFactorySourcePair = [this, input];
      this._interp = null;
      this._token = null;
      this._tokenStartCharIndex = -1;
      this._tokenStartLine = -1;
      this._tokenStartColumn = -1;
      this._hitEOF = false;
      this._channel = Token.DEFAULT_CHANNEL;
      this._type = Token.INVALID_TYPE;
      this._modeStack = [];
      this._mode = Lexer.DEFAULT_MODE;
      this._text = null;
    }
    reset() {
      if (this._input !== null) {
        this._input.seek(0);
      }
      this._token = null;
      this._type = Token.INVALID_TYPE;
      this._channel = Token.DEFAULT_CHANNEL;
      this._tokenStartCharIndex = -1;
      this._tokenStartColumn = -1;
      this._tokenStartLine = -1;
      this._text = null;
      this._hitEOF = false;
      this._mode = Lexer.DEFAULT_MODE;
      this._modeStack = [];
      this._interp.reset();
    }
    nextToken() {
      if (this._input === null) {
        throw "nextToken requires a non-null input stream.";
      }
      const tokenStartMarker = this._input.mark();
      try {
        while (true) {
          if (this._hitEOF) {
            this.emitEOF();
            return this._token;
          }
          this._token = null;
          this._channel = Token.DEFAULT_CHANNEL;
          this._tokenStartCharIndex = this._input.index;
          this._tokenStartColumn = this._interp.column;
          this._tokenStartLine = this._interp.line;
          this._text = null;
          let continueOuter = false;
          while (true) {
            this._type = Token.INVALID_TYPE;
            let ttype = Lexer.SKIP;
            try {
              ttype = this._interp.match(this._input, this._mode);
            } catch (e) {
              if (e instanceof RecognitionException) {
                this.notifyListeners(e);
                this.recover(e);
              } else {
                console.log(e.stack);
                throw e;
              }
            }
            if (this._input.LA(1) === Token.EOF) {
              this._hitEOF = true;
            }
            if (this._type === Token.INVALID_TYPE) {
              this._type = ttype;
            }
            if (this._type === Lexer.SKIP) {
              continueOuter = true;
              break;
            }
            if (this._type !== Lexer.MORE) {
              break;
            }
          }
          if (continueOuter) {
            continue;
          }
          if (this._token === null) {
            this.emit();
          }
          return this._token;
        }
      } finally {
        this._input.release(tokenStartMarker);
      }
    }
    skip() {
      this._type = Lexer.SKIP;
    }
    more() {
      this._type = Lexer.MORE;
    }
    mode(m) {
      this._mode = m;
    }
    pushMode(m) {
      if (this._interp.debug) {
        console.log("pushMode " + m);
      }
      this._modeStack.push(this._mode);
      this.mode(m);
    }
    popMode() {
      if (this._modeStack.length === 0) {
        throw "Empty Stack";
      }
      if (this._interp.debug) {
        console.log("popMode back to " + this._modeStack.slice(0, -1));
      }
      this.mode(this._modeStack.pop());
      return this._mode;
    }
    emitToken(token) {
      this._token = token;
    }
    emit() {
      const t = this._factory.create(this._tokenFactorySourcePair, this._type, this._text, this._channel, this._tokenStartCharIndex, this.getCharIndex() - 1, this._tokenStartLine, this._tokenStartColumn);
      this.emitToken(t);
      return t;
    }
    emitEOF() {
      const cpos = this.column;
      const lpos = this.line;
      const eof = this._factory.create(this._tokenFactorySourcePair, Token.EOF, null, Token.DEFAULT_CHANNEL, this._input.index, this._input.index - 1, lpos, cpos);
      this.emitToken(eof);
      return eof;
    }
    getCharIndex() {
      return this._input.index;
    }
    getAllTokens() {
      const tokens = [];
      let t = this.nextToken();
      while (t.type !== Token.EOF) {
        tokens.push(t);
        t = this.nextToken();
      }
      return tokens;
    }
    notifyListeners(e) {
      const start = this._tokenStartCharIndex;
      const stop = this._input.index;
      const text = this._input.getText(start, stop);
      const msg = "token recognition error at: '" + this.getErrorDisplay(text) + "'";
      const listener = this.getErrorListenerDispatch();
      listener.syntaxError(this, null, this._tokenStartLine, this._tokenStartColumn, msg, e);
    }
    getErrorDisplay(s) {
      const d = [];
      for (let i = 0;i < s.length; i++) {
        d.push(s[i]);
      }
      return d.join("");
    }
    getErrorDisplayForChar(c) {
      if (c.charCodeAt(0) === Token.EOF) {
        return "<EOF>";
      } else if (c === "\n") {
        return "\\n";
      } else if (c === "\t") {
        return "\\t";
      } else if (c === "\r") {
        return "\\r";
      } else {
        return c;
      }
    }
    getCharErrorDisplay(c) {
      return "'" + this.getErrorDisplayForChar(c) + "'";
    }
    recover(re) {
      if (this._input.LA(1) !== Token.EOF) {
        if (re instanceof LexerNoViableAltException) {
          this._interp.consume(this._input);
        } else {
          this._input.consume();
        }
      }
    }
    get inputStream() {
      return this._input;
    }
    set inputStream(input) {
      this._input = null;
      this._tokenFactorySourcePair = [this, this._input];
      this.reset();
      this._input = input;
      this._tokenFactorySourcePair = [this, this._input];
    }
    get sourceName() {
      return this._input.sourceName;
    }
    get type() {
      return this._type;
    }
    set type(type) {
      this._type = type;
    }
    get line() {
      return this._interp.line;
    }
    set line(line) {
      this._interp.line = line;
    }
    get column() {
      return this._interp.column;
    }
    set column(column) {
      this._interp.column = column;
    }
    get text() {
      if (this._text !== null) {
        return this._text;
      } else {
        return this._interp.getText(this._input);
      }
    }
    set text(text) {
      this._text = text;
    }
  }
  Lexer.DEFAULT_MODE = 0;
  Lexer.MORE = -2;
  Lexer.SKIP = -3;
  Lexer.DEFAULT_TOKEN_CHANNEL = Token.DEFAULT_CHANNEL;
  Lexer.HIDDEN = Token.HIDDEN_CHANNEL;
  Lexer.MIN_CHAR_VALUE = 0;
  Lexer.MAX_CHAR_VALUE = 1114111;
  module.exports = Lexer;
});

// node_modules/antlr4/src/antlr4/atn/ATNConfigSet.js
var require_ATNConfigSet = __commonJS((exports, module) => {
  var hashATNConfig = function(c) {
    return c.hashCodeForConfigSet();
  };
  var equalATNConfigs = function(a, b) {
    if (a === b) {
      return true;
    } else if (a === null || b === null) {
      return false;
    } else
      return a.equalsForConfigSet(b);
  };
  var ATN = require_ATN();
  var Utils = require_Utils();
  var { SemanticContext } = require_SemanticContext();
  var { merge } = require_PredictionContext();

  class ATNConfigSet {
    constructor(fullCtx) {
      this.configLookup = new Utils.Set(hashATNConfig, equalATNConfigs);
      this.fullCtx = fullCtx === undefined ? true : fullCtx;
      this.readOnly = false;
      this.configs = [];
      this.uniqueAlt = 0;
      this.conflictingAlts = null;
      this.hasSemanticContext = false;
      this.dipsIntoOuterContext = false;
      this.cachedHashCode = -1;
    }
    add(config, mergeCache) {
      if (mergeCache === undefined) {
        mergeCache = null;
      }
      if (this.readOnly) {
        throw "This set is readonly";
      }
      if (config.semanticContext !== SemanticContext.NONE) {
        this.hasSemanticContext = true;
      }
      if (config.reachesIntoOuterContext > 0) {
        this.dipsIntoOuterContext = true;
      }
      const existing = this.configLookup.add(config);
      if (existing === config) {
        this.cachedHashCode = -1;
        this.configs.push(config);
        return true;
      }
      const rootIsWildcard = !this.fullCtx;
      const merged = merge(existing.context, config.context, rootIsWildcard, mergeCache);
      existing.reachesIntoOuterContext = Math.max(existing.reachesIntoOuterContext, config.reachesIntoOuterContext);
      if (config.precedenceFilterSuppressed) {
        existing.precedenceFilterSuppressed = true;
      }
      existing.context = merged;
      return true;
    }
    getStates() {
      const states = new Utils.Set;
      for (let i = 0;i < this.configs.length; i++) {
        states.add(this.configs[i].state);
      }
      return states;
    }
    getPredicates() {
      const preds = [];
      for (let i = 0;i < this.configs.length; i++) {
        const c = this.configs[i].semanticContext;
        if (c !== SemanticContext.NONE) {
          preds.push(c.semanticContext);
        }
      }
      return preds;
    }
    optimizeConfigs(interpreter) {
      if (this.readOnly) {
        throw "This set is readonly";
      }
      if (this.configLookup.length === 0) {
        return;
      }
      for (let i = 0;i < this.configs.length; i++) {
        const config = this.configs[i];
        config.context = interpreter.getCachedContext(config.context);
      }
    }
    addAll(coll) {
      for (let i = 0;i < coll.length; i++) {
        this.add(coll[i]);
      }
      return false;
    }
    equals(other) {
      return this === other || other instanceof ATNConfigSet && Utils.equalArrays(this.configs, other.configs) && this.fullCtx === other.fullCtx && this.uniqueAlt === other.uniqueAlt && this.conflictingAlts === other.conflictingAlts && this.hasSemanticContext === other.hasSemanticContext && this.dipsIntoOuterContext === other.dipsIntoOuterContext;
    }
    hashCode() {
      const hash = new Utils.Hash;
      hash.update(this.configs);
      return hash.finish();
    }
    updateHashCode(hash) {
      if (this.readOnly) {
        if (this.cachedHashCode === -1) {
          this.cachedHashCode = this.hashCode();
        }
        hash.update(this.cachedHashCode);
      } else {
        hash.update(this.hashCode());
      }
    }
    isEmpty() {
      return this.configs.length === 0;
    }
    contains(item) {
      if (this.configLookup === null) {
        throw "This method is not implemented for readonly sets.";
      }
      return this.configLookup.contains(item);
    }
    containsFast(item) {
      if (this.configLookup === null) {
        throw "This method is not implemented for readonly sets.";
      }
      return this.configLookup.containsFast(item);
    }
    clear() {
      if (this.readOnly) {
        throw "This set is readonly";
      }
      this.configs = [];
      this.cachedHashCode = -1;
      this.configLookup = new Utils.Set;
    }
    setReadonly(readOnly) {
      this.readOnly = readOnly;
      if (readOnly) {
        this.configLookup = null;
      }
    }
    toString() {
      return Utils.arrayToString(this.configs) + (this.hasSemanticContext ? ",hasSemanticContext=" + this.hasSemanticContext : "") + (this.uniqueAlt !== ATN.INVALID_ALT_NUMBER ? ",uniqueAlt=" + this.uniqueAlt : "") + (this.conflictingAlts !== null ? ",conflictingAlts=" + this.conflictingAlts : "") + (this.dipsIntoOuterContext ? ",dipsIntoOuterContext" : "");
    }
    get items() {
      return this.configs;
    }
    get length() {
      return this.configs.length;
    }
  }

  class OrderedATNConfigSet extends ATNConfigSet {
    constructor() {
      super();
      this.configLookup = new Utils.Set;
    }
  }
  module.exports = {
    ATNConfigSet,
    OrderedATNConfigSet
  };
});

// node_modules/antlr4/src/antlr4/dfa/DFAState.js
var require_DFAState = __commonJS((exports, module) => {
  var { ATNConfigSet } = require_ATNConfigSet();
  var { Hash: Hash2, Set: Set2 } = require_Utils();

  class PredPrediction {
    constructor(pred, alt) {
      this.alt = alt;
      this.pred = pred;
    }
    toString() {
      return "(" + this.pred + ", " + this.alt + ")";
    }
  }

  class DFAState {
    constructor(stateNumber, configs) {
      if (stateNumber === null) {
        stateNumber = -1;
      }
      if (configs === null) {
        configs = new ATNConfigSet;
      }
      this.stateNumber = stateNumber;
      this.configs = configs;
      this.edges = null;
      this.isAcceptState = false;
      this.prediction = 0;
      this.lexerActionExecutor = null;
      this.requiresFullContext = false;
      this.predicates = null;
      return this;
    }
    getAltSet() {
      const alts = new Set2;
      if (this.configs !== null) {
        for (let i = 0;i < this.configs.length; i++) {
          const c = this.configs[i];
          alts.add(c.alt);
        }
      }
      if (alts.length === 0) {
        return null;
      } else {
        return alts;
      }
    }
    equals(other) {
      return this === other || other instanceof DFAState && this.configs.equals(other.configs);
    }
    toString() {
      let s = "" + this.stateNumber + ":" + this.configs;
      if (this.isAcceptState) {
        s = s + "=>";
        if (this.predicates !== null)
          s = s + this.predicates;
        else
          s = s + this.prediction;
      }
      return s;
    }
    hashCode() {
      const hash = new Hash2;
      hash.update(this.configs);
      return hash.finish();
    }
  }
  module.exports = { DFAState, PredPrediction };
});

// node_modules/antlr4/src/antlr4/atn/ATNSimulator.js
var require_ATNSimulator = __commonJS((exports, module) => {
  var { DFAState } = require_DFAState();
  var { ATNConfigSet } = require_ATNConfigSet();
  var { getCachedPredictionContext } = require_PredictionContext();
  var { Map } = require_Utils();

  class ATNSimulator {
    constructor(atn, sharedContextCache) {
      this.atn = atn;
      this.sharedContextCache = sharedContextCache;
      return this;
    }
    getCachedContext(context) {
      if (this.sharedContextCache === null) {
        return context;
      }
      const visited = new Map;
      return getCachedPredictionContext(context, this.sharedContextCache, visited);
    }
  }
  ATNSimulator.ERROR = new DFAState(2147483647, new ATNConfigSet);
  module.exports = ATNSimulator;
});

// node_modules/antlr4/src/antlr4/atn/LexerActionExecutor.js
var require_LexerActionExecutor = __commonJS((exports, module) => {
  var { hashStuff } = require_Utils();
  var { LexerIndexedCustomAction } = require_LexerAction();

  class LexerActionExecutor {
    constructor(lexerActions) {
      this.lexerActions = lexerActions === null ? [] : lexerActions;
      this.cachedHashCode = hashStuff(lexerActions);
      return this;
    }
    fixOffsetBeforeMatch(offset) {
      let updatedLexerActions = null;
      for (let i = 0;i < this.lexerActions.length; i++) {
        if (this.lexerActions[i].isPositionDependent && !(this.lexerActions[i] instanceof LexerIndexedCustomAction)) {
          if (updatedLexerActions === null) {
            updatedLexerActions = this.lexerActions.concat([]);
          }
          updatedLexerActions[i] = new LexerIndexedCustomAction(offset, this.lexerActions[i]);
        }
      }
      if (updatedLexerActions === null) {
        return this;
      } else {
        return new LexerActionExecutor(updatedLexerActions);
      }
    }
    execute(lexer, input, startIndex) {
      let requiresSeek = false;
      const stopIndex = input.index;
      try {
        for (let i = 0;i < this.lexerActions.length; i++) {
          let lexerAction = this.lexerActions[i];
          if (lexerAction instanceof LexerIndexedCustomAction) {
            const offset = lexerAction.offset;
            input.seek(startIndex + offset);
            lexerAction = lexerAction.action;
            requiresSeek = startIndex + offset !== stopIndex;
          } else if (lexerAction.isPositionDependent) {
            input.seek(stopIndex);
            requiresSeek = false;
          }
          lexerAction.execute(lexer);
        }
      } finally {
        if (requiresSeek) {
          input.seek(stopIndex);
        }
      }
    }
    hashCode() {
      return this.cachedHashCode;
    }
    updateHashCode(hash) {
      hash.update(this.cachedHashCode);
    }
    equals(other) {
      if (this === other) {
        return true;
      } else if (!(other instanceof LexerActionExecutor)) {
        return false;
      } else if (this.cachedHashCode != other.cachedHashCode) {
        return false;
      } else if (this.lexerActions.length != other.lexerActions.length) {
        return false;
      } else {
        const numActions = this.lexerActions.length;
        for (let idx = 0;idx < numActions; ++idx) {
          if (!this.lexerActions[idx].equals(other.lexerActions[idx])) {
            return false;
          }
        }
        return true;
      }
    }
    static append(lexerActionExecutor, lexerAction) {
      if (lexerActionExecutor === null) {
        return new LexerActionExecutor([lexerAction]);
      }
      const lexerActions = lexerActionExecutor.lexerActions.concat([lexerAction]);
      return new LexerActionExecutor(lexerActions);
    }
  }
  module.exports = LexerActionExecutor;
});

// node_modules/antlr4/src/antlr4/atn/LexerATNSimulator.js
var require_LexerATNSimulator = __commonJS((exports, module) => {
  var resetSimState = function(sim) {
    sim.index = -1;
    sim.line = 0;
    sim.column = -1;
    sim.dfaState = null;
  };
  var { Token } = require_Token();
  var Lexer = require_Lexer();
  var ATN = require_ATN();
  var ATNSimulator = require_ATNSimulator();
  var { DFAState } = require_DFAState();
  var { OrderedATNConfigSet } = require_ATNConfigSet();
  var { PredictionContext } = require_PredictionContext();
  var { SingletonPredictionContext } = require_PredictionContext();
  var { RuleStopState } = require_ATNState();
  var { LexerATNConfig } = require_ATNConfig();
  var { Transition } = require_Transition();
  var LexerActionExecutor = require_LexerActionExecutor();
  var { LexerNoViableAltException } = require_Errors();

  class SimState {
    constructor() {
      resetSimState(this);
    }
    reset() {
      resetSimState(this);
    }
  }

  class LexerATNSimulator extends ATNSimulator {
    constructor(recog, atn, decisionToDFA, sharedContextCache) {
      super(atn, sharedContextCache);
      this.decisionToDFA = decisionToDFA;
      this.recog = recog;
      this.startIndex = -1;
      this.line = 1;
      this.column = 0;
      this.mode = Lexer.DEFAULT_MODE;
      this.prevAccept = new SimState;
    }
    copyState(simulator) {
      this.column = simulator.column;
      this.line = simulator.line;
      this.mode = simulator.mode;
      this.startIndex = simulator.startIndex;
    }
    match(input, mode) {
      this.match_calls += 1;
      this.mode = mode;
      const mark = input.mark();
      try {
        this.startIndex = input.index;
        this.prevAccept.reset();
        const dfa = this.decisionToDFA[mode];
        if (dfa.s0 === null) {
          return this.matchATN(input);
        } else {
          return this.execATN(input, dfa.s0);
        }
      } finally {
        input.release(mark);
      }
    }
    reset() {
      this.prevAccept.reset();
      this.startIndex = -1;
      this.line = 1;
      this.column = 0;
      this.mode = Lexer.DEFAULT_MODE;
    }
    matchATN(input) {
      const startState = this.atn.modeToStartState[this.mode];
      if (LexerATNSimulator.debug) {
        console.log("matchATN mode " + this.mode + " start: " + startState);
      }
      const old_mode = this.mode;
      const s0_closure = this.computeStartState(input, startState);
      const suppressEdge = s0_closure.hasSemanticContext;
      s0_closure.hasSemanticContext = false;
      const next = this.addDFAState(s0_closure);
      if (!suppressEdge) {
        this.decisionToDFA[this.mode].s0 = next;
      }
      const predict = this.execATN(input, next);
      if (LexerATNSimulator.debug) {
        console.log("DFA after matchATN: " + this.decisionToDFA[old_mode].toLexerString());
      }
      return predict;
    }
    execATN(input, ds0) {
      if (LexerATNSimulator.debug) {
        console.log("start state closure=" + ds0.configs);
      }
      if (ds0.isAcceptState) {
        this.captureSimState(this.prevAccept, input, ds0);
      }
      let t = input.LA(1);
      let s = ds0;
      while (true) {
        if (LexerATNSimulator.debug) {
          console.log("execATN loop starting closure: " + s.configs);
        }
        let target = this.getExistingTargetState(s, t);
        if (target === null) {
          target = this.computeTargetState(input, s, t);
        }
        if (target === ATNSimulator.ERROR) {
          break;
        }
        if (t !== Token.EOF) {
          this.consume(input);
        }
        if (target.isAcceptState) {
          this.captureSimState(this.prevAccept, input, target);
          if (t === Token.EOF) {
            break;
          }
        }
        t = input.LA(1);
        s = target;
      }
      return this.failOrAccept(this.prevAccept, input, s.configs, t);
    }
    getExistingTargetState(s, t) {
      if (s.edges === null || t < LexerATNSimulator.MIN_DFA_EDGE || t > LexerATNSimulator.MAX_DFA_EDGE) {
        return null;
      }
      let target = s.edges[t - LexerATNSimulator.MIN_DFA_EDGE];
      if (target === undefined) {
        target = null;
      }
      if (LexerATNSimulator.debug && target !== null) {
        console.log("reuse state " + s.stateNumber + " edge to " + target.stateNumber);
      }
      return target;
    }
    computeTargetState(input, s, t) {
      const reach = new OrderedATNConfigSet;
      this.getReachableConfigSet(input, s.configs, reach, t);
      if (reach.items.length === 0) {
        if (!reach.hasSemanticContext) {
          this.addDFAEdge(s, t, ATNSimulator.ERROR);
        }
        return ATNSimulator.ERROR;
      }
      return this.addDFAEdge(s, t, null, reach);
    }
    failOrAccept(prevAccept, input, reach, t) {
      if (this.prevAccept.dfaState !== null) {
        const lexerActionExecutor = prevAccept.dfaState.lexerActionExecutor;
        this.accept(input, lexerActionExecutor, this.startIndex, prevAccept.index, prevAccept.line, prevAccept.column);
        return prevAccept.dfaState.prediction;
      } else {
        if (t === Token.EOF && input.index === this.startIndex) {
          return Token.EOF;
        }
        throw new LexerNoViableAltException(this.recog, input, this.startIndex, reach);
      }
    }
    getReachableConfigSet(input, closure, reach, t) {
      let skipAlt = ATN.INVALID_ALT_NUMBER;
      for (let i = 0;i < closure.items.length; i++) {
        const cfg = closure.items[i];
        const currentAltReachedAcceptState = cfg.alt === skipAlt;
        if (currentAltReachedAcceptState && cfg.passedThroughNonGreedyDecision) {
          continue;
        }
        if (LexerATNSimulator.debug) {
          console.log("testing %s at %s\n", this.getTokenName(t), cfg.toString(this.recog, true));
        }
        for (let j = 0;j < cfg.state.transitions.length; j++) {
          const trans = cfg.state.transitions[j];
          const target = this.getReachableTarget(trans, t);
          if (target !== null) {
            let lexerActionExecutor = cfg.lexerActionExecutor;
            if (lexerActionExecutor !== null) {
              lexerActionExecutor = lexerActionExecutor.fixOffsetBeforeMatch(input.index - this.startIndex);
            }
            const treatEofAsEpsilon = t === Token.EOF;
            const config = new LexerATNConfig({ state: target, lexerActionExecutor }, cfg);
            if (this.closure(input, config, reach, currentAltReachedAcceptState, true, treatEofAsEpsilon)) {
              skipAlt = cfg.alt;
            }
          }
        }
      }
    }
    accept(input, lexerActionExecutor, startIndex, index, line, charPos) {
      if (LexerATNSimulator.debug) {
        console.log("ACTION %s\n", lexerActionExecutor);
      }
      input.seek(index);
      this.line = line;
      this.column = charPos;
      if (lexerActionExecutor !== null && this.recog !== null) {
        lexerActionExecutor.execute(this.recog, input, startIndex);
      }
    }
    getReachableTarget(trans, t) {
      if (trans.matches(t, 0, Lexer.MAX_CHAR_VALUE)) {
        return trans.target;
      } else {
        return null;
      }
    }
    computeStartState(input, p) {
      const initialContext = PredictionContext.EMPTY;
      const configs = new OrderedATNConfigSet;
      for (let i = 0;i < p.transitions.length; i++) {
        const target = p.transitions[i].target;
        const cfg = new LexerATNConfig({ state: target, alt: i + 1, context: initialContext }, null);
        this.closure(input, cfg, configs, false, false, false);
      }
      return configs;
    }
    closure(input, config, configs, currentAltReachedAcceptState, speculative, treatEofAsEpsilon) {
      let cfg = null;
      if (LexerATNSimulator.debug) {
        console.log("closure(" + config.toString(this.recog, true) + ")");
      }
      if (config.state instanceof RuleStopState) {
        if (LexerATNSimulator.debug) {
          if (this.recog !== null) {
            console.log("closure at %s rule stop %s\n", this.recog.ruleNames[config.state.ruleIndex], config);
          } else {
            console.log("closure at rule stop %s\n", config);
          }
        }
        if (config.context === null || config.context.hasEmptyPath()) {
          if (config.context === null || config.context.isEmpty()) {
            configs.add(config);
            return true;
          } else {
            configs.add(new LexerATNConfig({ state: config.state, context: PredictionContext.EMPTY }, config));
            currentAltReachedAcceptState = true;
          }
        }
        if (config.context !== null && !config.context.isEmpty()) {
          for (let i = 0;i < config.context.length; i++) {
            if (config.context.getReturnState(i) !== PredictionContext.EMPTY_RETURN_STATE) {
              const newContext = config.context.getParent(i);
              const returnState = this.atn.states[config.context.getReturnState(i)];
              cfg = new LexerATNConfig({ state: returnState, context: newContext }, config);
              currentAltReachedAcceptState = this.closure(input, cfg, configs, currentAltReachedAcceptState, speculative, treatEofAsEpsilon);
            }
          }
        }
        return currentAltReachedAcceptState;
      }
      if (!config.state.epsilonOnlyTransitions) {
        if (!currentAltReachedAcceptState || !config.passedThroughNonGreedyDecision) {
          configs.add(config);
        }
      }
      for (let j = 0;j < config.state.transitions.length; j++) {
        const trans = config.state.transitions[j];
        cfg = this.getEpsilonTarget(input, config, trans, configs, speculative, treatEofAsEpsilon);
        if (cfg !== null) {
          currentAltReachedAcceptState = this.closure(input, cfg, configs, currentAltReachedAcceptState, speculative, treatEofAsEpsilon);
        }
      }
      return currentAltReachedAcceptState;
    }
    getEpsilonTarget(input, config, trans, configs, speculative, treatEofAsEpsilon) {
      let cfg = null;
      if (trans.serializationType === Transition.RULE) {
        const newContext = SingletonPredictionContext.create(config.context, trans.followState.stateNumber);
        cfg = new LexerATNConfig({ state: trans.target, context: newContext }, config);
      } else if (trans.serializationType === Transition.PRECEDENCE) {
        throw "Precedence predicates are not supported in lexers.";
      } else if (trans.serializationType === Transition.PREDICATE) {
        if (LexerATNSimulator.debug) {
          console.log("EVAL rule " + trans.ruleIndex + ":" + trans.predIndex);
        }
        configs.hasSemanticContext = true;
        if (this.evaluatePredicate(input, trans.ruleIndex, trans.predIndex, speculative)) {
          cfg = new LexerATNConfig({ state: trans.target }, config);
        }
      } else if (trans.serializationType === Transition.ACTION) {
        if (config.context === null || config.context.hasEmptyPath()) {
          const lexerActionExecutor = LexerActionExecutor.append(config.lexerActionExecutor, this.atn.lexerActions[trans.actionIndex]);
          cfg = new LexerATNConfig({ state: trans.target, lexerActionExecutor }, config);
        } else {
          cfg = new LexerATNConfig({ state: trans.target }, config);
        }
      } else if (trans.serializationType === Transition.EPSILON) {
        cfg = new LexerATNConfig({ state: trans.target }, config);
      } else if (trans.serializationType === Transition.ATOM || trans.serializationType === Transition.RANGE || trans.serializationType === Transition.SET) {
        if (treatEofAsEpsilon) {
          if (trans.matches(Token.EOF, 0, Lexer.MAX_CHAR_VALUE)) {
            cfg = new LexerATNConfig({ state: trans.target }, config);
          }
        }
      }
      return cfg;
    }
    evaluatePredicate(input, ruleIndex, predIndex, speculative) {
      if (this.recog === null) {
        return true;
      }
      if (!speculative) {
        return this.recog.sempred(null, ruleIndex, predIndex);
      }
      const savedcolumn = this.column;
      const savedLine = this.line;
      const index = input.index;
      const marker = input.mark();
      try {
        this.consume(input);
        return this.recog.sempred(null, ruleIndex, predIndex);
      } finally {
        this.column = savedcolumn;
        this.line = savedLine;
        input.seek(index);
        input.release(marker);
      }
    }
    captureSimState(settings, input, dfaState) {
      settings.index = input.index;
      settings.line = this.line;
      settings.column = this.column;
      settings.dfaState = dfaState;
    }
    addDFAEdge(from_, tk, to, cfgs) {
      if (to === undefined) {
        to = null;
      }
      if (cfgs === undefined) {
        cfgs = null;
      }
      if (to === null && cfgs !== null) {
        const suppressEdge = cfgs.hasSemanticContext;
        cfgs.hasSemanticContext = false;
        to = this.addDFAState(cfgs);
        if (suppressEdge) {
          return to;
        }
      }
      if (tk < LexerATNSimulator.MIN_DFA_EDGE || tk > LexerATNSimulator.MAX_DFA_EDGE) {
        return to;
      }
      if (LexerATNSimulator.debug) {
        console.log("EDGE " + from_ + " -> " + to + " upon " + tk);
      }
      if (from_.edges === null) {
        from_.edges = [];
      }
      from_.edges[tk - LexerATNSimulator.MIN_DFA_EDGE] = to;
      return to;
    }
    addDFAState(configs) {
      const proposed = new DFAState(null, configs);
      let firstConfigWithRuleStopState = null;
      for (let i = 0;i < configs.items.length; i++) {
        const cfg = configs.items[i];
        if (cfg.state instanceof RuleStopState) {
          firstConfigWithRuleStopState = cfg;
          break;
        }
      }
      if (firstConfigWithRuleStopState !== null) {
        proposed.isAcceptState = true;
        proposed.lexerActionExecutor = firstConfigWithRuleStopState.lexerActionExecutor;
        proposed.prediction = this.atn.ruleToTokenType[firstConfigWithRuleStopState.state.ruleIndex];
      }
      const dfa = this.decisionToDFA[this.mode];
      const existing = dfa.states.get(proposed);
      if (existing !== null) {
        return existing;
      }
      const newState = proposed;
      newState.stateNumber = dfa.states.length;
      configs.setReadonly(true);
      newState.configs = configs;
      dfa.states.add(newState);
      return newState;
    }
    getDFA(mode) {
      return this.decisionToDFA[mode];
    }
    getText(input) {
      return input.getText(this.startIndex, input.index - 1);
    }
    consume(input) {
      const curChar = input.LA(1);
      if (curChar === "\n".charCodeAt(0)) {
        this.line += 1;
        this.column = 0;
      } else {
        this.column += 1;
      }
      input.consume();
    }
    getTokenName(tt) {
      if (tt === -1) {
        return "EOF";
      } else {
        return "'" + String.fromCharCode(tt) + "'";
      }
    }
  }
  LexerATNSimulator.debug = false;
  LexerATNSimulator.dfa_debug = false;
  LexerATNSimulator.MIN_DFA_EDGE = 0;
  LexerATNSimulator.MAX_DFA_EDGE = 127;
  LexerATNSimulator.match_calls = 0;
  module.exports = LexerATNSimulator;
});

// node_modules/antlr4/src/antlr4/atn/PredictionMode.js
var require_PredictionMode = __commonJS((exports, module) => {
  var { Map, BitSet, AltDict, hashStuff } = require_Utils();
  var ATN = require_ATN();
  var { RuleStopState } = require_ATNState();
  var { ATNConfigSet } = require_ATNConfigSet();
  var { ATNConfig } = require_ATNConfig();
  var { SemanticContext } = require_SemanticContext();
  var PredictionMode = {
    SLL: 0,
    LL: 1,
    LL_EXACT_AMBIG_DETECTION: 2,
    hasSLLConflictTerminatingPrediction: function(mode, configs) {
      if (PredictionMode.allConfigsInRuleStopStates(configs)) {
        return true;
      }
      if (mode === PredictionMode.SLL) {
        if (configs.hasSemanticContext) {
          const dup = new ATNConfigSet;
          for (let i = 0;i < configs.items.length; i++) {
            let c = configs.items[i];
            c = new ATNConfig({ semanticContext: SemanticContext.NONE }, c);
            dup.add(c);
          }
          configs = dup;
        }
      }
      const altsets = PredictionMode.getConflictingAltSubsets(configs);
      return PredictionMode.hasConflictingAltSet(altsets) && !PredictionMode.hasStateAssociatedWithOneAlt(configs);
    },
    hasConfigInRuleStopState: function(configs) {
      for (let i = 0;i < configs.items.length; i++) {
        const c = configs.items[i];
        if (c.state instanceof RuleStopState) {
          return true;
        }
      }
      return false;
    },
    allConfigsInRuleStopStates: function(configs) {
      for (let i = 0;i < configs.items.length; i++) {
        const c = configs.items[i];
        if (!(c.state instanceof RuleStopState)) {
          return false;
        }
      }
      return true;
    },
    resolvesToJustOneViableAlt: function(altsets) {
      return PredictionMode.getSingleViableAlt(altsets);
    },
    allSubsetsConflict: function(altsets) {
      return !PredictionMode.hasNonConflictingAltSet(altsets);
    },
    hasNonConflictingAltSet: function(altsets) {
      for (let i = 0;i < altsets.length; i++) {
        const alts = altsets[i];
        if (alts.length === 1) {
          return true;
        }
      }
      return false;
    },
    hasConflictingAltSet: function(altsets) {
      for (let i = 0;i < altsets.length; i++) {
        const alts = altsets[i];
        if (alts.length > 1) {
          return true;
        }
      }
      return false;
    },
    allSubsetsEqual: function(altsets) {
      let first = null;
      for (let i = 0;i < altsets.length; i++) {
        const alts = altsets[i];
        if (first === null) {
          first = alts;
        } else if (alts !== first) {
          return false;
        }
      }
      return true;
    },
    getUniqueAlt: function(altsets) {
      const all = PredictionMode.getAlts(altsets);
      if (all.length === 1) {
        return all.minValue();
      } else {
        return ATN.INVALID_ALT_NUMBER;
      }
    },
    getAlts: function(altsets) {
      const all = new BitSet;
      altsets.map(function(alts) {
        all.or(alts);
      });
      return all;
    },
    getConflictingAltSubsets: function(configs) {
      const configToAlts = new Map;
      configToAlts.hashFunction = function(cfg) {
        hashStuff(cfg.state.stateNumber, cfg.context);
      };
      configToAlts.equalsFunction = function(c1, c2) {
        return c1.state.stateNumber === c2.state.stateNumber && c1.context.equals(c2.context);
      };
      configs.items.map(function(cfg) {
        let alts = configToAlts.get(cfg);
        if (alts === null) {
          alts = new BitSet;
          configToAlts.put(cfg, alts);
        }
        alts.add(cfg.alt);
      });
      return configToAlts.getValues();
    },
    getStateToAltMap: function(configs) {
      const m = new AltDict;
      configs.items.map(function(c) {
        let alts = m.get(c.state);
        if (alts === null) {
          alts = new BitSet;
          m.put(c.state, alts);
        }
        alts.add(c.alt);
      });
      return m;
    },
    hasStateAssociatedWithOneAlt: function(configs) {
      const values = PredictionMode.getStateToAltMap(configs).values();
      for (let i = 0;i < values.length; i++) {
        if (values[i].length === 1) {
          return true;
        }
      }
      return false;
    },
    getSingleViableAlt: function(altsets) {
      let result = null;
      for (let i = 0;i < altsets.length; i++) {
        const alts = altsets[i];
        const minAlt = alts.minValue();
        if (result === null) {
          result = minAlt;
        } else if (result !== minAlt) {
          return ATN.INVALID_ALT_NUMBER;
        }
      }
      return result;
    }
  };
  module.exports = PredictionMode;
});

// node_modules/antlr4/src/antlr4/ParserRuleContext.js
var require_ParserRuleContext = __commonJS((exports, module) => {
  var RuleContext = require_RuleContext();
  var Tree = require_Tree();
  var INVALID_INTERVAL = Tree.INVALID_INTERVAL;
  var TerminalNode = Tree.TerminalNode;
  var TerminalNodeImpl = Tree.TerminalNodeImpl;
  var ErrorNodeImpl = Tree.ErrorNodeImpl;
  var Interval = require_IntervalSet().Interval;

  class ParserRuleContext extends RuleContext {
    constructor(parent, invokingStateNumber) {
      parent = parent || null;
      invokingStateNumber = invokingStateNumber || null;
      super(parent, invokingStateNumber);
      this.ruleIndex = -1;
      this.children = null;
      this.start = null;
      this.stop = null;
      this.exception = null;
    }
    copyFrom(ctx) {
      this.parentCtx = ctx.parentCtx;
      this.invokingState = ctx.invokingState;
      this.children = null;
      this.start = ctx.start;
      this.stop = ctx.stop;
      if (ctx.children) {
        this.children = [];
        ctx.children.map(function(child) {
          if (child instanceof ErrorNodeImpl) {
            this.children.push(child);
            child.parentCtx = this;
          }
        }, this);
      }
    }
    enterRule(listener) {
    }
    exitRule(listener) {
    }
    addChild(child) {
      if (this.children === null) {
        this.children = [];
      }
      this.children.push(child);
      return child;
    }
    removeLastChild() {
      if (this.children !== null) {
        this.children.pop();
      }
    }
    addTokenNode(token) {
      const node = new TerminalNodeImpl(token);
      this.addChild(node);
      node.parentCtx = this;
      return node;
    }
    addErrorNode(badToken) {
      const node = new ErrorNodeImpl(badToken);
      this.addChild(node);
      node.parentCtx = this;
      return node;
    }
    getChild(i, type) {
      type = type || null;
      if (this.children === null || i < 0 || i >= this.children.length) {
        return null;
      }
      if (type === null) {
        return this.children[i];
      } else {
        for (let j = 0;j < this.children.length; j++) {
          const child = this.children[j];
          if (child instanceof type) {
            if (i === 0) {
              return child;
            } else {
              i -= 1;
            }
          }
        }
        return null;
      }
    }
    getToken(ttype, i) {
      if (this.children === null || i < 0 || i >= this.children.length) {
        return null;
      }
      for (let j = 0;j < this.children.length; j++) {
        const child = this.children[j];
        if (child instanceof TerminalNode) {
          if (child.symbol.type === ttype) {
            if (i === 0) {
              return child;
            } else {
              i -= 1;
            }
          }
        }
      }
      return null;
    }
    getTokens(ttype) {
      if (this.children === null) {
        return [];
      } else {
        const tokens = [];
        for (let j = 0;j < this.children.length; j++) {
          const child = this.children[j];
          if (child instanceof TerminalNode) {
            if (child.symbol.type === ttype) {
              tokens.push(child);
            }
          }
        }
        return tokens;
      }
    }
    getTypedRuleContext(ctxType, i) {
      return this.getChild(i, ctxType);
    }
    getTypedRuleContexts(ctxType) {
      if (this.children === null) {
        return [];
      } else {
        const contexts = [];
        for (let j = 0;j < this.children.length; j++) {
          const child = this.children[j];
          if (child instanceof ctxType) {
            contexts.push(child);
          }
        }
        return contexts;
      }
    }
    getChildCount() {
      if (this.children === null) {
        return 0;
      } else {
        return this.children.length;
      }
    }
    getSourceInterval() {
      if (this.start === null || this.stop === null) {
        return INVALID_INTERVAL;
      } else {
        return new Interval(this.start.tokenIndex, this.stop.tokenIndex);
      }
    }
  }
  RuleContext.EMPTY = new ParserRuleContext;
  module.exports = ParserRuleContext;
});

// node_modules/antlr4/src/antlr4/atn/ParserATNSimulator.js
var require_ParserATNSimulator = __commonJS((exports, module) => {
  var Utils = require_Utils();
  var { Set: Set2, BitSet, DoubleDict } = Utils;
  var ATN = require_ATN();
  var { ATNState, RuleStopState } = require_ATNState();
  var { ATNConfig } = require_ATNConfig();
  var { ATNConfigSet } = require_ATNConfigSet();
  var { Token } = require_Token();
  var { DFAState, PredPrediction } = require_DFAState();
  var ATNSimulator = require_ATNSimulator();
  var PredictionMode = require_PredictionMode();
  var RuleContext = require_RuleContext();
  var ParserRuleContext = require_ParserRuleContext();
  var { SemanticContext } = require_SemanticContext();
  var { PredictionContext } = require_PredictionContext();
  var { Interval } = require_IntervalSet();
  var { Transition, SetTransition, NotSetTransition, RuleTransition, ActionTransition } = require_Transition();
  var { NoViableAltException } = require_Errors();
  var { SingletonPredictionContext, predictionContextFromRuleContext } = require_PredictionContext();

  class ParserATNSimulator extends ATNSimulator {
    constructor(parser, atn, decisionToDFA, sharedContextCache) {
      super(atn, sharedContextCache);
      this.parser = parser;
      this.decisionToDFA = decisionToDFA;
      this.predictionMode = PredictionMode.LL;
      this._input = null;
      this._startIndex = 0;
      this._outerContext = null;
      this._dfa = null;
      this.mergeCache = null;
      this.debug = false;
      this.debug_closure = false;
      this.debug_add = false;
      this.debug_list_atn_decisions = false;
      this.dfa_debug = false;
      this.retry_debug = false;
    }
    reset() {
    }
    adaptivePredict(input, decision, outerContext) {
      if (this.debug || this.debug_list_atn_decisions) {
        console.log("adaptivePredict decision " + decision + " exec LA(1)==" + this.getLookaheadName(input) + " line " + input.LT(1).line + ":" + input.LT(1).column);
      }
      this._input = input;
      this._startIndex = input.index;
      this._outerContext = outerContext;
      const dfa = this.decisionToDFA[decision];
      this._dfa = dfa;
      const m = input.mark();
      const index = input.index;
      try {
        let s0;
        if (dfa.precedenceDfa) {
          s0 = dfa.getPrecedenceStartState(this.parser.getPrecedence());
        } else {
          s0 = dfa.s0;
        }
        if (s0 === null) {
          if (outerContext === null) {
            outerContext = RuleContext.EMPTY;
          }
          if (this.debug || this.debug_list_atn_decisions) {
            console.log("predictATN decision " + dfa.decision + " exec LA(1)==" + this.getLookaheadName(input) + ", outerContext=" + outerContext.toString(this.parser.ruleNames));
          }
          const fullCtx = false;
          let s0_closure = this.computeStartState(dfa.atnStartState, RuleContext.EMPTY, fullCtx);
          if (dfa.precedenceDfa) {
            dfa.s0.configs = s0_closure;
            s0_closure = this.applyPrecedenceFilter(s0_closure);
            s0 = this.addDFAState(dfa, new DFAState(null, s0_closure));
            dfa.setPrecedenceStartState(this.parser.getPrecedence(), s0);
          } else {
            s0 = this.addDFAState(dfa, new DFAState(null, s0_closure));
            dfa.s0 = s0;
          }
        }
        const alt = this.execATN(dfa, s0, input, index, outerContext);
        if (this.debug) {
          console.log("DFA after predictATN: " + dfa.toString(this.parser.literalNames, this.parser.symbolicNames));
        }
        return alt;
      } finally {
        this._dfa = null;
        this.mergeCache = null;
        input.seek(index);
        input.release(m);
      }
    }
    execATN(dfa, s0, input, startIndex, outerContext) {
      if (this.debug || this.debug_list_atn_decisions) {
        console.log("execATN decision " + dfa.decision + " exec LA(1)==" + this.getLookaheadName(input) + " line " + input.LT(1).line + ":" + input.LT(1).column);
      }
      let alt;
      let previousD = s0;
      if (this.debug) {
        console.log("s0 = " + s0);
      }
      let t = input.LA(1);
      while (true) {
        let D = this.getExistingTargetState(previousD, t);
        if (D === null) {
          D = this.computeTargetState(dfa, previousD, t);
        }
        if (D === ATNSimulator.ERROR) {
          const e = this.noViableAlt(input, outerContext, previousD.configs, startIndex);
          input.seek(startIndex);
          alt = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(previousD.configs, outerContext);
          if (alt !== ATN.INVALID_ALT_NUMBER) {
            return alt;
          } else {
            throw e;
          }
        }
        if (D.requiresFullContext && this.predictionMode !== PredictionMode.SLL) {
          let conflictingAlts = null;
          if (D.predicates !== null) {
            if (this.debug) {
              console.log("DFA state has preds in DFA sim LL failover");
            }
            const conflictIndex = input.index;
            if (conflictIndex !== startIndex) {
              input.seek(startIndex);
            }
            conflictingAlts = this.evalSemanticContext(D.predicates, outerContext, true);
            if (conflictingAlts.length === 1) {
              if (this.debug) {
                console.log("Full LL avoided");
              }
              return conflictingAlts.minValue();
            }
            if (conflictIndex !== startIndex) {
              input.seek(conflictIndex);
            }
          }
          if (this.dfa_debug) {
            console.log("ctx sensitive state " + outerContext + " in " + D);
          }
          const fullCtx = true;
          const s0_closure = this.computeStartState(dfa.atnStartState, outerContext, fullCtx);
          this.reportAttemptingFullContext(dfa, conflictingAlts, D.configs, startIndex, input.index);
          alt = this.execATNWithFullContext(dfa, D, s0_closure, input, startIndex, outerContext);
          return alt;
        }
        if (D.isAcceptState) {
          if (D.predicates === null) {
            return D.prediction;
          }
          const stopIndex = input.index;
          input.seek(startIndex);
          const alts = this.evalSemanticContext(D.predicates, outerContext, true);
          if (alts.length === 0) {
            throw this.noViableAlt(input, outerContext, D.configs, startIndex);
          } else if (alts.length === 1) {
            return alts.minValue();
          } else {
            this.reportAmbiguity(dfa, D, startIndex, stopIndex, false, alts, D.configs);
            return alts.minValue();
          }
        }
        previousD = D;
        if (t !== Token.EOF) {
          input.consume();
          t = input.LA(1);
        }
      }
    }
    getExistingTargetState(previousD, t) {
      const edges = previousD.edges;
      if (edges === null) {
        return null;
      } else {
        return edges[t + 1] || null;
      }
    }
    computeTargetState(dfa, previousD, t) {
      const reach = this.computeReachSet(previousD.configs, t, false);
      if (reach === null) {
        this.addDFAEdge(dfa, previousD, t, ATNSimulator.ERROR);
        return ATNSimulator.ERROR;
      }
      let D = new DFAState(null, reach);
      const predictedAlt = this.getUniqueAlt(reach);
      if (this.debug) {
        const altSubSets = PredictionMode.getConflictingAltSubsets(reach);
        console.log("SLL altSubSets=" + Utils.arrayToString(altSubSets) + ", configs=" + reach + ", predict=" + predictedAlt + ", allSubsetsConflict=" + PredictionMode.allSubsetsConflict(altSubSets) + ", conflictingAlts=" + this.getConflictingAlts(reach));
      }
      if (predictedAlt !== ATN.INVALID_ALT_NUMBER) {
        D.isAcceptState = true;
        D.configs.uniqueAlt = predictedAlt;
        D.prediction = predictedAlt;
      } else if (PredictionMode.hasSLLConflictTerminatingPrediction(this.predictionMode, reach)) {
        D.configs.conflictingAlts = this.getConflictingAlts(reach);
        D.requiresFullContext = true;
        D.isAcceptState = true;
        D.prediction = D.configs.conflictingAlts.minValue();
      }
      if (D.isAcceptState && D.configs.hasSemanticContext) {
        this.predicateDFAState(D, this.atn.getDecisionState(dfa.decision));
        if (D.predicates !== null) {
          D.prediction = ATN.INVALID_ALT_NUMBER;
        }
      }
      D = this.addDFAEdge(dfa, previousD, t, D);
      return D;
    }
    predicateDFAState(dfaState, decisionState) {
      const nalts = decisionState.transitions.length;
      const altsToCollectPredsFrom = this.getConflictingAltsOrUniqueAlt(dfaState.configs);
      const altToPred = this.getPredsForAmbigAlts(altsToCollectPredsFrom, dfaState.configs, nalts);
      if (altToPred !== null) {
        dfaState.predicates = this.getPredicatePredictions(altsToCollectPredsFrom, altToPred);
        dfaState.prediction = ATN.INVALID_ALT_NUMBER;
      } else {
        dfaState.prediction = altsToCollectPredsFrom.minValue();
      }
    }
    execATNWithFullContext(dfa, D, s0, input, startIndex, outerContext) {
      if (this.debug || this.debug_list_atn_decisions) {
        console.log("execATNWithFullContext " + s0);
      }
      const fullCtx = true;
      let foundExactAmbig = false;
      let reach;
      let previous = s0;
      input.seek(startIndex);
      let t = input.LA(1);
      let predictedAlt = -1;
      while (true) {
        reach = this.computeReachSet(previous, t, fullCtx);
        if (reach === null) {
          const e = this.noViableAlt(input, outerContext, previous, startIndex);
          input.seek(startIndex);
          const alt = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(previous, outerContext);
          if (alt !== ATN.INVALID_ALT_NUMBER) {
            return alt;
          } else {
            throw e;
          }
        }
        const altSubSets = PredictionMode.getConflictingAltSubsets(reach);
        if (this.debug) {
          console.log("LL altSubSets=" + altSubSets + ", predict=" + PredictionMode.getUniqueAlt(altSubSets) + ", resolvesToJustOneViableAlt=" + PredictionMode.resolvesToJustOneViableAlt(altSubSets));
        }
        reach.uniqueAlt = this.getUniqueAlt(reach);
        if (reach.uniqueAlt !== ATN.INVALID_ALT_NUMBER) {
          predictedAlt = reach.uniqueAlt;
          break;
        } else if (this.predictionMode !== PredictionMode.LL_EXACT_AMBIG_DETECTION) {
          predictedAlt = PredictionMode.resolvesToJustOneViableAlt(altSubSets);
          if (predictedAlt !== ATN.INVALID_ALT_NUMBER) {
            break;
          }
        } else {
          if (PredictionMode.allSubsetsConflict(altSubSets) && PredictionMode.allSubsetsEqual(altSubSets)) {
            foundExactAmbig = true;
            predictedAlt = PredictionMode.getSingleViableAlt(altSubSets);
            break;
          }
        }
        previous = reach;
        if (t !== Token.EOF) {
          input.consume();
          t = input.LA(1);
        }
      }
      if (reach.uniqueAlt !== ATN.INVALID_ALT_NUMBER) {
        this.reportContextSensitivity(dfa, predictedAlt, reach, startIndex, input.index);
        return predictedAlt;
      }
      this.reportAmbiguity(dfa, D, startIndex, input.index, foundExactAmbig, null, reach);
      return predictedAlt;
    }
    computeReachSet(closure, t, fullCtx) {
      if (this.debug) {
        console.log("in computeReachSet, starting closure: " + closure);
      }
      if (this.mergeCache === null) {
        this.mergeCache = new DoubleDict;
      }
      const intermediate = new ATNConfigSet(fullCtx);
      let skippedStopStates = null;
      for (let i = 0;i < closure.items.length; i++) {
        const c = closure.items[i];
        if (this.debug) {
          console.log("testing " + this.getTokenName(t) + " at " + c);
        }
        if (c.state instanceof RuleStopState) {
          if (fullCtx || t === Token.EOF) {
            if (skippedStopStates === null) {
              skippedStopStates = [];
            }
            skippedStopStates.push(c);
            if (this.debug_add) {
              console.log("added " + c + " to skippedStopStates");
            }
          }
          continue;
        }
        for (let j = 0;j < c.state.transitions.length; j++) {
          const trans = c.state.transitions[j];
          const target = this.getReachableTarget(trans, t);
          if (target !== null) {
            const cfg = new ATNConfig({ state: target }, c);
            intermediate.add(cfg, this.mergeCache);
            if (this.debug_add) {
              console.log("added " + cfg + " to intermediate");
            }
          }
        }
      }
      let reach = null;
      if (skippedStopStates === null && t !== Token.EOF) {
        if (intermediate.items.length === 1) {
          reach = intermediate;
        } else if (this.getUniqueAlt(intermediate) !== ATN.INVALID_ALT_NUMBER) {
          reach = intermediate;
        }
      }
      if (reach === null) {
        reach = new ATNConfigSet(fullCtx);
        const closureBusy = new Set2;
        const treatEofAsEpsilon = t === Token.EOF;
        for (let k = 0;k < intermediate.items.length; k++) {
          this.closure(intermediate.items[k], reach, closureBusy, false, fullCtx, treatEofAsEpsilon);
        }
      }
      if (t === Token.EOF) {
        reach = this.removeAllConfigsNotInRuleStopState(reach, reach === intermediate);
      }
      if (skippedStopStates !== null && (!fullCtx || !PredictionMode.hasConfigInRuleStopState(reach))) {
        for (let l = 0;l < skippedStopStates.length; l++) {
          reach.add(skippedStopStates[l], this.mergeCache);
        }
      }
      if (reach.items.length === 0) {
        return null;
      } else {
        return reach;
      }
    }
    removeAllConfigsNotInRuleStopState(configs, lookToEndOfRule) {
      if (PredictionMode.allConfigsInRuleStopStates(configs)) {
        return configs;
      }
      const result = new ATNConfigSet(configs.fullCtx);
      for (let i = 0;i < configs.items.length; i++) {
        const config = configs.items[i];
        if (config.state instanceof RuleStopState) {
          result.add(config, this.mergeCache);
          continue;
        }
        if (lookToEndOfRule && config.state.epsilonOnlyTransitions) {
          const nextTokens = this.atn.nextTokens(config.state);
          if (nextTokens.contains(Token.EPSILON)) {
            const endOfRuleState = this.atn.ruleToStopState[config.state.ruleIndex];
            result.add(new ATNConfig({ state: endOfRuleState }, config), this.mergeCache);
          }
        }
      }
      return result;
    }
    computeStartState(p, ctx, fullCtx) {
      const initialContext = predictionContextFromRuleContext(this.atn, ctx);
      const configs = new ATNConfigSet(fullCtx);
      for (let i = 0;i < p.transitions.length; i++) {
        const target = p.transitions[i].target;
        const c = new ATNConfig({ state: target, alt: i + 1, context: initialContext }, null);
        const closureBusy = new Set2;
        this.closure(c, configs, closureBusy, true, fullCtx, false);
      }
      return configs;
    }
    applyPrecedenceFilter(configs) {
      let config;
      const statesFromAlt1 = [];
      const configSet = new ATNConfigSet(configs.fullCtx);
      for (let i = 0;i < configs.items.length; i++) {
        config = configs.items[i];
        if (config.alt !== 1) {
          continue;
        }
        const updatedContext = config.semanticContext.evalPrecedence(this.parser, this._outerContext);
        if (updatedContext === null) {
          continue;
        }
        statesFromAlt1[config.state.stateNumber] = config.context;
        if (updatedContext !== config.semanticContext) {
          configSet.add(new ATNConfig({ semanticContext: updatedContext }, config), this.mergeCache);
        } else {
          configSet.add(config, this.mergeCache);
        }
      }
      for (let i = 0;i < configs.items.length; i++) {
        config = configs.items[i];
        if (config.alt === 1) {
          continue;
        }
        if (!config.precedenceFilterSuppressed) {
          const context = statesFromAlt1[config.state.stateNumber] || null;
          if (context !== null && context.equals(config.context)) {
            continue;
          }
        }
        configSet.add(config, this.mergeCache);
      }
      return configSet;
    }
    getReachableTarget(trans, ttype) {
      if (trans.matches(ttype, 0, this.atn.maxTokenType)) {
        return trans.target;
      } else {
        return null;
      }
    }
    getPredsForAmbigAlts(ambigAlts, configs, nalts) {
      let altToPred = [];
      for (let i = 0;i < configs.items.length; i++) {
        const c = configs.items[i];
        if (ambigAlts.contains(c.alt)) {
          altToPred[c.alt] = SemanticContext.orContext(altToPred[c.alt] || null, c.semanticContext);
        }
      }
      let nPredAlts = 0;
      for (let i = 1;i < nalts + 1; i++) {
        const pred = altToPred[i] || null;
        if (pred === null) {
          altToPred[i] = SemanticContext.NONE;
        } else if (pred !== SemanticContext.NONE) {
          nPredAlts += 1;
        }
      }
      if (nPredAlts === 0) {
        altToPred = null;
      }
      if (this.debug) {
        console.log("getPredsForAmbigAlts result " + Utils.arrayToString(altToPred));
      }
      return altToPred;
    }
    getPredicatePredictions(ambigAlts, altToPred) {
      const pairs = [];
      let containsPredicate = false;
      for (let i = 1;i < altToPred.length; i++) {
        const pred = altToPred[i];
        if (ambigAlts !== null && ambigAlts.contains(i)) {
          pairs.push(new PredPrediction(pred, i));
        }
        if (pred !== SemanticContext.NONE) {
          containsPredicate = true;
        }
      }
      if (!containsPredicate) {
        return null;
      }
      return pairs;
    }
    getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(configs, outerContext) {
      const cfgs = this.splitAccordingToSemanticValidity(configs, outerContext);
      const semValidConfigs = cfgs[0];
      const semInvalidConfigs = cfgs[1];
      let alt = this.getAltThatFinishedDecisionEntryRule(semValidConfigs);
      if (alt !== ATN.INVALID_ALT_NUMBER) {
        return alt;
      }
      if (semInvalidConfigs.items.length > 0) {
        alt = this.getAltThatFinishedDecisionEntryRule(semInvalidConfigs);
        if (alt !== ATN.INVALID_ALT_NUMBER) {
          return alt;
        }
      }
      return ATN.INVALID_ALT_NUMBER;
    }
    getAltThatFinishedDecisionEntryRule(configs) {
      const alts = [];
      for (let i = 0;i < configs.items.length; i++) {
        const c = configs.items[i];
        if (c.reachesIntoOuterContext > 0 || c.state instanceof RuleStopState && c.context.hasEmptyPath()) {
          if (alts.indexOf(c.alt) < 0) {
            alts.push(c.alt);
          }
        }
      }
      if (alts.length === 0) {
        return ATN.INVALID_ALT_NUMBER;
      } else {
        return Math.min.apply(null, alts);
      }
    }
    splitAccordingToSemanticValidity(configs, outerContext) {
      const succeeded = new ATNConfigSet(configs.fullCtx);
      const failed = new ATNConfigSet(configs.fullCtx);
      for (let i = 0;i < configs.items.length; i++) {
        const c = configs.items[i];
        if (c.semanticContext !== SemanticContext.NONE) {
          const predicateEvaluationResult = c.semanticContext.evaluate(this.parser, outerContext);
          if (predicateEvaluationResult) {
            succeeded.add(c);
          } else {
            failed.add(c);
          }
        } else {
          succeeded.add(c);
        }
      }
      return [succeeded, failed];
    }
    evalSemanticContext(predPredictions, outerContext, complete) {
      const predictions = new BitSet;
      for (let i = 0;i < predPredictions.length; i++) {
        const pair = predPredictions[i];
        if (pair.pred === SemanticContext.NONE) {
          predictions.add(pair.alt);
          if (!complete) {
            break;
          }
          continue;
        }
        const predicateEvaluationResult = pair.pred.evaluate(this.parser, outerContext);
        if (this.debug || this.dfa_debug) {
          console.log("eval pred " + pair + "=" + predicateEvaluationResult);
        }
        if (predicateEvaluationResult) {
          if (this.debug || this.dfa_debug) {
            console.log("PREDICT " + pair.alt);
          }
          predictions.add(pair.alt);
          if (!complete) {
            break;
          }
        }
      }
      return predictions;
    }
    closure(config, configs, closureBusy, collectPredicates, fullCtx, treatEofAsEpsilon) {
      const initialDepth = 0;
      this.closureCheckingStopState(config, configs, closureBusy, collectPredicates, fullCtx, initialDepth, treatEofAsEpsilon);
    }
    closureCheckingStopState(config, configs, closureBusy, collectPredicates, fullCtx, depth, treatEofAsEpsilon) {
      if (this.debug || this.debug_closure) {
        console.log("closure(" + config.toString(this.parser, true) + ")");
        if (config.reachesIntoOuterContext > 50) {
          throw "problem";
        }
      }
      if (config.state instanceof RuleStopState) {
        if (!config.context.isEmpty()) {
          for (let i = 0;i < config.context.length; i++) {
            if (config.context.getReturnState(i) === PredictionContext.EMPTY_RETURN_STATE) {
              if (fullCtx) {
                configs.add(new ATNConfig({ state: config.state, context: PredictionContext.EMPTY }, config), this.mergeCache);
                continue;
              } else {
                if (this.debug) {
                  console.log("FALLING off rule " + this.getRuleName(config.state.ruleIndex));
                }
                this.closure_(config, configs, closureBusy, collectPredicates, fullCtx, depth, treatEofAsEpsilon);
              }
              continue;
            }
            const returnState = this.atn.states[config.context.getReturnState(i)];
            const newContext = config.context.getParent(i);
            const parms = { state: returnState, alt: config.alt, context: newContext, semanticContext: config.semanticContext };
            const c = new ATNConfig(parms, null);
            c.reachesIntoOuterContext = config.reachesIntoOuterContext;
            this.closureCheckingStopState(c, configs, closureBusy, collectPredicates, fullCtx, depth - 1, treatEofAsEpsilon);
          }
          return;
        } else if (fullCtx) {
          configs.add(config, this.mergeCache);
          return;
        } else {
          if (this.debug) {
            console.log("FALLING off rule " + this.getRuleName(config.state.ruleIndex));
          }
        }
      }
      this.closure_(config, configs, closureBusy, collectPredicates, fullCtx, depth, treatEofAsEpsilon);
    }
    closure_(config, configs, closureBusy, collectPredicates, fullCtx, depth, treatEofAsEpsilon) {
      const p = config.state;
      if (!p.epsilonOnlyTransitions) {
        configs.add(config, this.mergeCache);
      }
      for (let i = 0;i < p.transitions.length; i++) {
        if (i === 0 && this.canDropLoopEntryEdgeInLeftRecursiveRule(config))
          continue;
        const t = p.transitions[i];
        const continueCollecting = collectPredicates && !(t instanceof ActionTransition);
        const c = this.getEpsilonTarget(config, t, continueCollecting, depth === 0, fullCtx, treatEofAsEpsilon);
        if (c !== null) {
          let newDepth = depth;
          if (config.state instanceof RuleStopState) {
            if (this._dfa !== null && this._dfa.precedenceDfa) {
              if (t.outermostPrecedenceReturn === this._dfa.atnStartState.ruleIndex) {
                c.precedenceFilterSuppressed = true;
              }
            }
            c.reachesIntoOuterContext += 1;
            if (closureBusy.add(c) !== c) {
              continue;
            }
            configs.dipsIntoOuterContext = true;
            newDepth -= 1;
            if (this.debug) {
              console.log("dips into outer ctx: " + c);
            }
          } else {
            if (!t.isEpsilon && closureBusy.add(c) !== c) {
              continue;
            }
            if (t instanceof RuleTransition) {
              if (newDepth >= 0) {
                newDepth += 1;
              }
            }
          }
          this.closureCheckingStopState(c, configs, closureBusy, continueCollecting, fullCtx, newDepth, treatEofAsEpsilon);
        }
      }
    }
    canDropLoopEntryEdgeInLeftRecursiveRule(config) {
      const p = config.state;
      if (p.stateType !== ATNState.STAR_LOOP_ENTRY)
        return false;
      if (p.stateType !== ATNState.STAR_LOOP_ENTRY || !p.isPrecedenceDecision || config.context.isEmpty() || config.context.hasEmptyPath())
        return false;
      const numCtxs = config.context.length;
      for (let i = 0;i < numCtxs; i++) {
        const returnState = this.atn.states[config.context.getReturnState(i)];
        if (returnState.ruleIndex !== p.ruleIndex)
          return false;
      }
      const decisionStartState = p.transitions[0].target;
      const blockEndStateNum = decisionStartState.endState.stateNumber;
      const blockEndState = this.atn.states[blockEndStateNum];
      for (let i = 0;i < numCtxs; i++) {
        const returnStateNumber = config.context.getReturnState(i);
        const returnState = this.atn.states[returnStateNumber];
        if (returnState.transitions.length !== 1 || !returnState.transitions[0].isEpsilon)
          return false;
        const returnStateTarget = returnState.transitions[0].target;
        if (returnState.stateType === ATNState.BLOCK_END && returnStateTarget === p)
          continue;
        if (returnState === blockEndState)
          continue;
        if (returnStateTarget === blockEndState)
          continue;
        if (returnStateTarget.stateType === ATNState.BLOCK_END && returnStateTarget.transitions.length === 1 && returnStateTarget.transitions[0].isEpsilon && returnStateTarget.transitions[0].target === p)
          continue;
        return false;
      }
      return true;
    }
    getRuleName(index) {
      if (this.parser !== null && index >= 0) {
        return this.parser.ruleNames[index];
      } else {
        return "<rule " + index + ">";
      }
    }
    getEpsilonTarget(config, t, collectPredicates, inContext, fullCtx, treatEofAsEpsilon) {
      switch (t.serializationType) {
        case Transition.RULE:
          return this.ruleTransition(config, t);
        case Transition.PRECEDENCE:
          return this.precedenceTransition(config, t, collectPredicates, inContext, fullCtx);
        case Transition.PREDICATE:
          return this.predTransition(config, t, collectPredicates, inContext, fullCtx);
        case Transition.ACTION:
          return this.actionTransition(config, t);
        case Transition.EPSILON:
          return new ATNConfig({ state: t.target }, config);
        case Transition.ATOM:
        case Transition.RANGE:
        case Transition.SET:
          if (treatEofAsEpsilon) {
            if (t.matches(Token.EOF, 0, 1)) {
              return new ATNConfig({ state: t.target }, config);
            }
          }
          return null;
        default:
          return null;
      }
    }
    actionTransition(config, t) {
      if (this.debug) {
        const index = t.actionIndex === -1 ? 65535 : t.actionIndex;
        console.log("ACTION edge " + t.ruleIndex + ":" + index);
      }
      return new ATNConfig({ state: t.target }, config);
    }
    precedenceTransition(config, pt, collectPredicates, inContext, fullCtx) {
      if (this.debug) {
        console.log("PRED (collectPredicates=" + collectPredicates + ") " + pt.precedence + ">=_p, ctx dependent=true");
        if (this.parser !== null) {
          console.log("context surrounding pred is " + Utils.arrayToString(this.parser.getRuleInvocationStack()));
        }
      }
      let c = null;
      if (collectPredicates && inContext) {
        if (fullCtx) {
          const currentPosition = this._input.index;
          this._input.seek(this._startIndex);
          const predSucceeds = pt.getPredicate().evaluate(this.parser, this._outerContext);
          this._input.seek(currentPosition);
          if (predSucceeds) {
            c = new ATNConfig({ state: pt.target }, config);
          }
        } else {
          const newSemCtx = SemanticContext.andContext(config.semanticContext, pt.getPredicate());
          c = new ATNConfig({ state: pt.target, semanticContext: newSemCtx }, config);
        }
      } else {
        c = new ATNConfig({ state: pt.target }, config);
      }
      if (this.debug) {
        console.log("config from pred transition=" + c);
      }
      return c;
    }
    predTransition(config, pt, collectPredicates, inContext, fullCtx) {
      if (this.debug) {
        console.log("PRED (collectPredicates=" + collectPredicates + ") " + pt.ruleIndex + ":" + pt.predIndex + ", ctx dependent=" + pt.isCtxDependent);
        if (this.parser !== null) {
          console.log("context surrounding pred is " + Utils.arrayToString(this.parser.getRuleInvocationStack()));
        }
      }
      let c = null;
      if (collectPredicates && (pt.isCtxDependent && inContext || !pt.isCtxDependent)) {
        if (fullCtx) {
          const currentPosition = this._input.index;
          this._input.seek(this._startIndex);
          const predSucceeds = pt.getPredicate().evaluate(this.parser, this._outerContext);
          this._input.seek(currentPosition);
          if (predSucceeds) {
            c = new ATNConfig({ state: pt.target }, config);
          }
        } else {
          const newSemCtx = SemanticContext.andContext(config.semanticContext, pt.getPredicate());
          c = new ATNConfig({ state: pt.target, semanticContext: newSemCtx }, config);
        }
      } else {
        c = new ATNConfig({ state: pt.target }, config);
      }
      if (this.debug) {
        console.log("config from pred transition=" + c);
      }
      return c;
    }
    ruleTransition(config, t) {
      if (this.debug) {
        console.log("CALL rule " + this.getRuleName(t.target.ruleIndex) + ", ctx=" + config.context);
      }
      const returnState = t.followState;
      const newContext = SingletonPredictionContext.create(config.context, returnState.stateNumber);
      return new ATNConfig({ state: t.target, context: newContext }, config);
    }
    getConflictingAlts(configs) {
      const altsets = PredictionMode.getConflictingAltSubsets(configs);
      return PredictionMode.getAlts(altsets);
    }
    getConflictingAltsOrUniqueAlt(configs) {
      let conflictingAlts = null;
      if (configs.uniqueAlt !== ATN.INVALID_ALT_NUMBER) {
        conflictingAlts = new BitSet;
        conflictingAlts.add(configs.uniqueAlt);
      } else {
        conflictingAlts = configs.conflictingAlts;
      }
      return conflictingAlts;
    }
    getTokenName(t) {
      if (t === Token.EOF) {
        return "EOF";
      }
      if (this.parser !== null && this.parser.literalNames !== null) {
        if (t >= this.parser.literalNames.length && t >= this.parser.symbolicNames.length) {
          console.log("" + t + " ttype out of range: " + this.parser.literalNames);
          console.log("" + this.parser.getInputStream().getTokens());
        } else {
          const name = this.parser.literalNames[t] || this.parser.symbolicNames[t];
          return name + "<" + t + ">";
        }
      }
      return "" + t;
    }
    getLookaheadName(input) {
      return this.getTokenName(input.LA(1));
    }
    dumpDeadEndConfigs(nvae) {
      console.log("dead end configs: ");
      const decs = nvae.getDeadEndConfigs();
      for (let i = 0;i < decs.length; i++) {
        const c = decs[i];
        let trans = "no edges";
        if (c.state.transitions.length > 0) {
          const t = c.state.transitions[0];
          if (t instanceof AtomTransition) {
            trans = "Atom " + this.getTokenName(t.label);
          } else if (t instanceof SetTransition) {
            const neg = t instanceof NotSetTransition;
            trans = (neg ? "~" : "") + "Set " + t.set;
          }
        }
        console.error(c.toString(this.parser, true) + ":" + trans);
      }
    }
    noViableAlt(input, outerContext, configs, startIndex) {
      return new NoViableAltException(this.parser, input, input.get(startIndex), input.LT(1), configs, outerContext);
    }
    getUniqueAlt(configs) {
      let alt = ATN.INVALID_ALT_NUMBER;
      for (let i = 0;i < configs.items.length; i++) {
        const c = configs.items[i];
        if (alt === ATN.INVALID_ALT_NUMBER) {
          alt = c.alt;
        } else if (c.alt !== alt) {
          return ATN.INVALID_ALT_NUMBER;
        }
      }
      return alt;
    }
    addDFAEdge(dfa, from_, t, to) {
      if (this.debug) {
        console.log("EDGE " + from_ + " -> " + to + " upon " + this.getTokenName(t));
      }
      if (to === null) {
        return null;
      }
      to = this.addDFAState(dfa, to);
      if (from_ === null || t < -1 || t > this.atn.maxTokenType) {
        return to;
      }
      if (from_.edges === null) {
        from_.edges = [];
      }
      from_.edges[t + 1] = to;
      if (this.debug) {
        const literalNames = this.parser === null ? null : this.parser.literalNames;
        const symbolicNames = this.parser === null ? null : this.parser.symbolicNames;
        console.log("DFA=\n" + dfa.toString(literalNames, symbolicNames));
      }
      return to;
    }
    addDFAState(dfa, D) {
      if (D === ATNSimulator.ERROR) {
        return D;
      }
      const existing = dfa.states.get(D);
      if (existing !== null) {
        return existing;
      }
      D.stateNumber = dfa.states.length;
      if (!D.configs.readOnly) {
        D.configs.optimizeConfigs(this);
        D.configs.setReadonly(true);
      }
      dfa.states.add(D);
      if (this.debug) {
        console.log("adding new DFA state: " + D);
      }
      return D;
    }
    reportAttemptingFullContext(dfa, conflictingAlts, configs, startIndex, stopIndex) {
      if (this.debug || this.retry_debug) {
        const interval = new Interval(startIndex, stopIndex + 1);
        console.log("reportAttemptingFullContext decision=" + dfa.decision + ":" + configs + ", input=" + this.parser.getTokenStream().getText(interval));
      }
      if (this.parser !== null) {
        this.parser.getErrorListenerDispatch().reportAttemptingFullContext(this.parser, dfa, startIndex, stopIndex, conflictingAlts, configs);
      }
    }
    reportContextSensitivity(dfa, prediction, configs, startIndex, stopIndex) {
      if (this.debug || this.retry_debug) {
        const interval = new Interval(startIndex, stopIndex + 1);
        console.log("reportContextSensitivity decision=" + dfa.decision + ":" + configs + ", input=" + this.parser.getTokenStream().getText(interval));
      }
      if (this.parser !== null) {
        this.parser.getErrorListenerDispatch().reportContextSensitivity(this.parser, dfa, startIndex, stopIndex, prediction, configs);
      }
    }
    reportAmbiguity(dfa, D, startIndex, stopIndex, exact, ambigAlts, configs) {
      if (this.debug || this.retry_debug) {
        const interval = new Interval(startIndex, stopIndex + 1);
        console.log("reportAmbiguity " + ambigAlts + ":" + configs + ", input=" + this.parser.getTokenStream().getText(interval));
      }
      if (this.parser !== null) {
        this.parser.getErrorListenerDispatch().reportAmbiguity(this.parser, dfa, startIndex, stopIndex, exact, ambigAlts, configs);
      }
    }
  }
  module.exports = ParserATNSimulator;
});

// node_modules/antlr4/src/antlr4/atn/index.js
var require_atn = __commonJS((exports) => {
  exports.ATN = require_ATN();
  exports.ATNDeserializer = require_ATNDeserializer();
  exports.LexerATNSimulator = require_LexerATNSimulator();
  exports.ParserATNSimulator = require_ParserATNSimulator();
  exports.PredictionMode = require_PredictionMode();
});

// node_modules/antlr4/src/antlr4/polyfills/codepointat.js
var exports_codepointat = {};
var init_codepointat = __esm(() => {
  /*! https://mths.be/codepointat v0.2.0 by @mathias */
  if (!String.prototype.codePointAt) {
    (function() {
      var defineProperty = function() {
        let result;
        try {
          const object = {};
          const $defineProperty = Object.defineProperty;
          result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) {
        }
        return result;
      }();
      const codePointAt = function(position) {
        if (this == null) {
          throw TypeError();
        }
        const string = String(this);
        const size = string.length;
        let index = position ? Number(position) : 0;
        if (index !== index) {
          index = 0;
        }
        if (index < 0 || index >= size) {
          return;
        }
        const first = string.charCodeAt(index);
        let second;
        if (first >= 55296 && first <= 56319 && size > index + 1) {
          second = string.charCodeAt(index + 1);
          if (second >= 56320 && second <= 57343) {
            return (first - 55296) * 1024 + second - 56320 + 65536;
          }
        }
        return first;
      };
      if (defineProperty) {
        defineProperty(String.prototype, "codePointAt", {
          value: codePointAt,
          configurable: true,
          writable: true
        });
      } else {
        String.prototype.codePointAt = codePointAt;
      }
    })();
  }
});

// node_modules/antlr4/src/antlr4/dfa/DFASerializer.js
var require_DFASerializer = __commonJS((exports, module) => {
  var Utils = require_Utils();

  class DFASerializer {
    constructor(dfa, literalNames, symbolicNames) {
      this.dfa = dfa;
      this.literalNames = literalNames || [];
      this.symbolicNames = symbolicNames || [];
    }
    toString() {
      if (this.dfa.s0 === null) {
        return null;
      }
      let buf = "";
      const states = this.dfa.sortedStates();
      for (let i = 0;i < states.length; i++) {
        const s = states[i];
        if (s.edges !== null) {
          const n = s.edges.length;
          for (let j = 0;j < n; j++) {
            const t = s.edges[j] || null;
            if (t !== null && t.stateNumber !== 2147483647) {
              buf = buf.concat(this.getStateString(s));
              buf = buf.concat("-");
              buf = buf.concat(this.getEdgeLabel(j));
              buf = buf.concat("->");
              buf = buf.concat(this.getStateString(t));
              buf = buf.concat("\n");
            }
          }
        }
      }
      return buf.length === 0 ? null : buf;
    }
    getEdgeLabel(i) {
      if (i === 0) {
        return "EOF";
      } else if (this.literalNames !== null || this.symbolicNames !== null) {
        return this.literalNames[i - 1] || this.symbolicNames[i - 1];
      } else {
        return String.fromCharCode(i - 1);
      }
    }
    getStateString(s) {
      const baseStateStr = (s.isAcceptState ? ":" : "") + "s" + s.stateNumber + (s.requiresFullContext ? "^" : "");
      if (s.isAcceptState) {
        if (s.predicates !== null) {
          return baseStateStr + "=>" + Utils.arrayToString(s.predicates);
        } else {
          return baseStateStr + "=>" + s.prediction.toString();
        }
      } else {
        return baseStateStr;
      }
    }
  }

  class LexerDFASerializer extends DFASerializer {
    constructor(dfa) {
      super(dfa, null);
    }
    getEdgeLabel(i) {
      return "'" + String.fromCharCode(i) + "'";
    }
  }
  module.exports = { DFASerializer, LexerDFASerializer };
});

// node_modules/antlr4/src/antlr4/dfa/DFA.js
var require_DFA = __commonJS((exports, module) => {
  var { Set: Set2 } = require_Utils();
  var { DFAState } = require_DFAState();
  var { StarLoopEntryState } = require_ATNState();
  var { ATNConfigSet } = require_ATNConfigSet();
  var { DFASerializer } = require_DFASerializer();
  var { LexerDFASerializer } = require_DFASerializer();

  class DFA {
    constructor(atnStartState, decision) {
      if (decision === undefined) {
        decision = 0;
      }
      this.atnStartState = atnStartState;
      this.decision = decision;
      this._states = new Set2;
      this.s0 = null;
      this.precedenceDfa = false;
      if (atnStartState instanceof StarLoopEntryState) {
        if (atnStartState.isPrecedenceDecision) {
          this.precedenceDfa = true;
          const precedenceState = new DFAState(null, new ATNConfigSet);
          precedenceState.edges = [];
          precedenceState.isAcceptState = false;
          precedenceState.requiresFullContext = false;
          this.s0 = precedenceState;
        }
      }
    }
    getPrecedenceStartState(precedence) {
      if (!this.precedenceDfa) {
        throw "Only precedence DFAs may contain a precedence start state.";
      }
      if (precedence < 0 || precedence >= this.s0.edges.length) {
        return null;
      }
      return this.s0.edges[precedence] || null;
    }
    setPrecedenceStartState(precedence, startState) {
      if (!this.precedenceDfa) {
        throw "Only precedence DFAs may contain a precedence start state.";
      }
      if (precedence < 0) {
        return;
      }
      this.s0.edges[precedence] = startState;
    }
    setPrecedenceDfa(precedenceDfa) {
      if (this.precedenceDfa !== precedenceDfa) {
        this._states = new Set2;
        if (precedenceDfa) {
          const precedenceState = new DFAState(null, new ATNConfigSet);
          precedenceState.edges = [];
          precedenceState.isAcceptState = false;
          precedenceState.requiresFullContext = false;
          this.s0 = precedenceState;
        } else {
          this.s0 = null;
        }
        this.precedenceDfa = precedenceDfa;
      }
    }
    sortedStates() {
      const list = this._states.values();
      return list.sort(function(a, b) {
        return a.stateNumber - b.stateNumber;
      });
    }
    toString(literalNames, symbolicNames) {
      literalNames = literalNames || null;
      symbolicNames = symbolicNames || null;
      if (this.s0 === null) {
        return "";
      }
      const serializer = new DFASerializer(this, literalNames, symbolicNames);
      return serializer.toString();
    }
    toLexerString() {
      if (this.s0 === null) {
        return "";
      }
      const serializer = new LexerDFASerializer(this);
      return serializer.toString();
    }
    get states() {
      return this._states;
    }
  }
  module.exports = DFA;
});

// node_modules/antlr4/src/antlr4/dfa/index.js
var require_dfa = __commonJS((exports) => {
  exports.DFA = require_DFA();
  exports.DFASerializer = require_DFASerializer().DFASerializer;
  exports.LexerDFASerializer = require_DFASerializer().LexerDFASerializer;
  exports.PredPrediction = require_DFAState().PredPrediction;
});

// node_modules/antlr4/src/antlr4/polyfills/fromcodepoint.js
var exports_fromcodepoint = {};
var init_fromcodepoint = __esm(() => {
  /*! https://mths.be/fromcodepoint v0.2.1 by @mathias */
  if (!String.fromCodePoint) {
    (function() {
      const defineProperty = function() {
        let result;
        try {
          const object = {};
          const $defineProperty = Object.defineProperty;
          result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) {
        }
        return result;
      }();
      const stringFromCharCode = String.fromCharCode;
      const floor = Math.floor;
      const fromCodePoint = function(_) {
        const MAX_SIZE = 16384;
        const codeUnits = [];
        let highSurrogate;
        let lowSurrogate;
        let index = -1;
        const length = arguments.length;
        if (!length) {
          return "";
        }
        let result = "";
        while (++index < length) {
          let codePoint = Number(arguments[index]);
          if (!isFinite(codePoint) || codePoint < 0 || codePoint > 1114111 || floor(codePoint) !== codePoint) {
            throw RangeError("Invalid code point: " + codePoint);
          }
          if (codePoint <= 65535) {
            codeUnits.push(codePoint);
          } else {
            codePoint -= 65536;
            highSurrogate = (codePoint >> 10) + 55296;
            lowSurrogate = codePoint % 1024 + 56320;
            codeUnits.push(highSurrogate, lowSurrogate);
          }
          if (index + 1 === length || codeUnits.length > MAX_SIZE) {
            result += stringFromCharCode.apply(null, codeUnits);
            codeUnits.length = 0;
          }
        }
        return result;
      };
      if (defineProperty) {
        defineProperty(String, "fromCodePoint", {
          value: fromCodePoint,
          configurable: true,
          writable: true
        });
      } else {
        String.fromCodePoint = fromCodePoint;
      }
    })();
  }
});

// node_modules/antlr4/src/antlr4/tree/index.js
var require_tree = __commonJS((exports, module) => {
  var Tree = require_Tree();
  var Trees = require_Trees();
  module.exports = { ...Tree, Trees };
});

// node_modules/antlr4/src/antlr4/error/DiagnosticErrorListener.js
var require_DiagnosticErrorListener = __commonJS((exports, module) => {
  var { BitSet } = require_Utils();
  var { ErrorListener } = require_ErrorListener();
  var { Interval } = require_IntervalSet();

  class DiagnosticErrorListener extends ErrorListener {
    constructor(exactOnly) {
      super();
      exactOnly = exactOnly || true;
      this.exactOnly = exactOnly;
    }
    reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs) {
      if (this.exactOnly && !exact) {
        return;
      }
      const msg = "reportAmbiguity d=" + this.getDecisionDescription(recognizer, dfa) + ": ambigAlts=" + this.getConflictingAlts(ambigAlts, configs) + ", input='" + recognizer.getTokenStream().getText(new Interval(startIndex, stopIndex)) + "'";
      recognizer.notifyErrorListeners(msg);
    }
    reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs) {
      const msg = "reportAttemptingFullContext d=" + this.getDecisionDescription(recognizer, dfa) + ", input='" + recognizer.getTokenStream().getText(new Interval(startIndex, stopIndex)) + "'";
      recognizer.notifyErrorListeners(msg);
    }
    reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs) {
      const msg = "reportContextSensitivity d=" + this.getDecisionDescription(recognizer, dfa) + ", input='" + recognizer.getTokenStream().getText(new Interval(startIndex, stopIndex)) + "'";
      recognizer.notifyErrorListeners(msg);
    }
    getDecisionDescription(recognizer, dfa) {
      const decision = dfa.decision;
      const ruleIndex = dfa.atnStartState.ruleIndex;
      const ruleNames = recognizer.ruleNames;
      if (ruleIndex < 0 || ruleIndex >= ruleNames.length) {
        return "" + decision;
      }
      const ruleName = ruleNames[ruleIndex] || null;
      if (ruleName === null || ruleName.length === 0) {
        return "" + decision;
      }
      return `${decision} (${ruleName})`;
    }
    getConflictingAlts(reportedAlts, configs) {
      if (reportedAlts !== null) {
        return reportedAlts;
      }
      const result = new BitSet;
      for (let i = 0;i < configs.items.length; i++) {
        result.add(configs.items[i].alt);
      }
      return `{${result.values().join(", ")}}`;
    }
  }
  module.exports = DiagnosticErrorListener;
});

// node_modules/antlr4/src/antlr4/error/ErrorStrategy.js
var require_ErrorStrategy = __commonJS((exports, module) => {
  var { Token } = require_Token();
  var { NoViableAltException, InputMismatchException, FailedPredicateException, ParseCancellationException } = require_Errors();
  var { ATNState } = require_ATNState();
  var { Interval, IntervalSet } = require_IntervalSet();

  class ErrorStrategy {
    reset(recognizer) {
    }
    recoverInline(recognizer) {
    }
    recover(recognizer, e) {
    }
    sync(recognizer) {
    }
    inErrorRecoveryMode(recognizer) {
    }
    reportError(recognizer) {
    }
  }

  class DefaultErrorStrategy extends ErrorStrategy {
    constructor() {
      super();
      this.errorRecoveryMode = false;
      this.lastErrorIndex = -1;
      this.lastErrorStates = null;
      this.nextTokensContext = null;
      this.nextTokenState = 0;
    }
    reset(recognizer) {
      this.endErrorCondition(recognizer);
    }
    beginErrorCondition(recognizer) {
      this.errorRecoveryMode = true;
    }
    inErrorRecoveryMode(recognizer) {
      return this.errorRecoveryMode;
    }
    endErrorCondition(recognizer) {
      this.errorRecoveryMode = false;
      this.lastErrorStates = null;
      this.lastErrorIndex = -1;
    }
    reportMatch(recognizer) {
      this.endErrorCondition(recognizer);
    }
    reportError(recognizer, e) {
      if (this.inErrorRecoveryMode(recognizer)) {
        return;
      }
      this.beginErrorCondition(recognizer);
      if (e instanceof NoViableAltException) {
        this.reportNoViableAlternative(recognizer, e);
      } else if (e instanceof InputMismatchException) {
        this.reportInputMismatch(recognizer, e);
      } else if (e instanceof FailedPredicateException) {
        this.reportFailedPredicate(recognizer, e);
      } else {
        console.log("unknown recognition error type: " + e.constructor.name);
        console.log(e.stack);
        recognizer.notifyErrorListeners(e.getOffendingToken(), e.getMessage(), e);
      }
    }
    recover(recognizer, e) {
      if (this.lastErrorIndex === recognizer.getInputStream().index && this.lastErrorStates !== null && this.lastErrorStates.indexOf(recognizer.state) >= 0) {
        recognizer.consume();
      }
      this.lastErrorIndex = recognizer._input.index;
      if (this.lastErrorStates === null) {
        this.lastErrorStates = [];
      }
      this.lastErrorStates.push(recognizer.state);
      const followSet = this.getErrorRecoverySet(recognizer);
      this.consumeUntil(recognizer, followSet);
    }
    sync(recognizer) {
      if (this.inErrorRecoveryMode(recognizer)) {
        return;
      }
      const s = recognizer._interp.atn.states[recognizer.state];
      const la = recognizer.getTokenStream().LA(1);
      const nextTokens = recognizer.atn.nextTokens(s);
      if (nextTokens.contains(la)) {
        this.nextTokensContext = null;
        this.nextTokenState = ATNState.INVALID_STATE_NUMBER;
        return;
      } else if (nextTokens.contains(Token.EPSILON)) {
        if (this.nextTokensContext === null) {
          this.nextTokensContext = recognizer._ctx;
          this.nextTokensState = recognizer._stateNumber;
        }
        return;
      }
      switch (s.stateType) {
        case ATNState.BLOCK_START:
        case ATNState.STAR_BLOCK_START:
        case ATNState.PLUS_BLOCK_START:
        case ATNState.STAR_LOOP_ENTRY:
          if (this.singleTokenDeletion(recognizer) !== null) {
            return;
          } else {
            throw new InputMismatchException(recognizer);
          }
        case ATNState.PLUS_LOOP_BACK:
        case ATNState.STAR_LOOP_BACK:
          this.reportUnwantedToken(recognizer);
          const expecting = new IntervalSet;
          expecting.addSet(recognizer.getExpectedTokens());
          const whatFollowsLoopIterationOrRule = expecting.addSet(this.getErrorRecoverySet(recognizer));
          this.consumeUntil(recognizer, whatFollowsLoopIterationOrRule);
          break;
        default:
      }
    }
    reportNoViableAlternative(recognizer, e) {
      const tokens = recognizer.getTokenStream();
      let input;
      if (tokens !== null) {
        if (e.startToken.type === Token.EOF) {
          input = "<EOF>";
        } else {
          input = tokens.getText(new Interval(e.startToken.tokenIndex, e.offendingToken.tokenIndex));
        }
      } else {
        input = "<unknown input>";
      }
      const msg = "no viable alternative at input " + this.escapeWSAndQuote(input);
      recognizer.notifyErrorListeners(msg, e.offendingToken, e);
    }
    reportInputMismatch(recognizer, e) {
      const msg = "mismatched input " + this.getTokenErrorDisplay(e.offendingToken) + " expecting " + e.getExpectedTokens().toString(recognizer.literalNames, recognizer.symbolicNames);
      recognizer.notifyErrorListeners(msg, e.offendingToken, e);
    }
    reportFailedPredicate(recognizer, e) {
      const ruleName = recognizer.ruleNames[recognizer._ctx.ruleIndex];
      const msg = "rule " + ruleName + " " + e.message;
      recognizer.notifyErrorListeners(msg, e.offendingToken, e);
    }
    reportUnwantedToken(recognizer) {
      if (this.inErrorRecoveryMode(recognizer)) {
        return;
      }
      this.beginErrorCondition(recognizer);
      const t = recognizer.getCurrentToken();
      const tokenName = this.getTokenErrorDisplay(t);
      const expecting = this.getExpectedTokens(recognizer);
      const msg = "extraneous input " + tokenName + " expecting " + expecting.toString(recognizer.literalNames, recognizer.symbolicNames);
      recognizer.notifyErrorListeners(msg, t, null);
    }
    reportMissingToken(recognizer) {
      if (this.inErrorRecoveryMode(recognizer)) {
        return;
      }
      this.beginErrorCondition(recognizer);
      const t = recognizer.getCurrentToken();
      const expecting = this.getExpectedTokens(recognizer);
      const msg = "missing " + expecting.toString(recognizer.literalNames, recognizer.symbolicNames) + " at " + this.getTokenErrorDisplay(t);
      recognizer.notifyErrorListeners(msg, t, null);
    }
    recoverInline(recognizer) {
      const matchedSymbol = this.singleTokenDeletion(recognizer);
      if (matchedSymbol !== null) {
        recognizer.consume();
        return matchedSymbol;
      }
      if (this.singleTokenInsertion(recognizer)) {
        return this.getMissingSymbol(recognizer);
      }
      throw new InputMismatchException(recognizer);
    }
    singleTokenInsertion(recognizer) {
      const currentSymbolType = recognizer.getTokenStream().LA(1);
      const atn = recognizer._interp.atn;
      const currentState = atn.states[recognizer.state];
      const next = currentState.transitions[0].target;
      const expectingAtLL2 = atn.nextTokens(next, recognizer._ctx);
      if (expectingAtLL2.contains(currentSymbolType)) {
        this.reportMissingToken(recognizer);
        return true;
      } else {
        return false;
      }
    }
    singleTokenDeletion(recognizer) {
      const nextTokenType = recognizer.getTokenStream().LA(2);
      const expecting = this.getExpectedTokens(recognizer);
      if (expecting.contains(nextTokenType)) {
        this.reportUnwantedToken(recognizer);
        recognizer.consume();
        const matchedSymbol = recognizer.getCurrentToken();
        this.reportMatch(recognizer);
        return matchedSymbol;
      } else {
        return null;
      }
    }
    getMissingSymbol(recognizer) {
      const currentSymbol = recognizer.getCurrentToken();
      const expecting = this.getExpectedTokens(recognizer);
      const expectedTokenType = expecting.first();
      let tokenText;
      if (expectedTokenType === Token.EOF) {
        tokenText = "<missing EOF>";
      } else {
        tokenText = "<missing " + recognizer.literalNames[expectedTokenType] + ">";
      }
      let current = currentSymbol;
      const lookback = recognizer.getTokenStream().LT(-1);
      if (current.type === Token.EOF && lookback !== null) {
        current = lookback;
      }
      return recognizer.getTokenFactory().create(current.source, expectedTokenType, tokenText, Token.DEFAULT_CHANNEL, -1, -1, current.line, current.column);
    }
    getExpectedTokens(recognizer) {
      return recognizer.getExpectedTokens();
    }
    getTokenErrorDisplay(t) {
      if (t === null) {
        return "<no token>";
      }
      let s = t.text;
      if (s === null) {
        if (t.type === Token.EOF) {
          s = "<EOF>";
        } else {
          s = "<" + t.type + ">";
        }
      }
      return this.escapeWSAndQuote(s);
    }
    escapeWSAndQuote(s) {
      s = s.replace(/\n/g, "\\n");
      s = s.replace(/\r/g, "\\r");
      s = s.replace(/\t/g, "\\t");
      return "'" + s + "'";
    }
    getErrorRecoverySet(recognizer) {
      const atn = recognizer._interp.atn;
      let ctx = recognizer._ctx;
      const recoverSet = new IntervalSet;
      while (ctx !== null && ctx.invokingState >= 0) {
        const invokingState = atn.states[ctx.invokingState];
        const rt = invokingState.transitions[0];
        const follow = atn.nextTokens(rt.followState);
        recoverSet.addSet(follow);
        ctx = ctx.parentCtx;
      }
      recoverSet.removeOne(Token.EPSILON);
      return recoverSet;
    }
    consumeUntil(recognizer, set) {
      let ttype = recognizer.getTokenStream().LA(1);
      while (ttype !== Token.EOF && !set.contains(ttype)) {
        recognizer.consume();
        ttype = recognizer.getTokenStream().LA(1);
      }
    }
  }

  class BailErrorStrategy extends DefaultErrorStrategy {
    constructor() {
      super();
    }
    recover(recognizer, e) {
      let context = recognizer._ctx;
      while (context !== null) {
        context.exception = e;
        context = context.parentCtx;
      }
      throw new ParseCancellationException(e);
    }
    recoverInline(recognizer) {
      this.recover(recognizer, new InputMismatchException(recognizer));
    }
    sync(recognizer) {
    }
  }
  module.exports = { BailErrorStrategy, DefaultErrorStrategy };
});

// node_modules/antlr4/src/antlr4/error/index.js
var require_error = __commonJS((exports, module) => {
  exports.RecognitionException = require_Errors().RecognitionException;
  exports.NoViableAltException = require_Errors().NoViableAltException;
  exports.LexerNoViableAltException = require_Errors().LexerNoViableAltException;
  exports.InputMismatchException = require_Errors().InputMismatchException;
  exports.FailedPredicateException = require_Errors().FailedPredicateException;
  exports.DiagnosticErrorListener = require_DiagnosticErrorListener();
  exports.BailErrorStrategy = require_ErrorStrategy().BailErrorStrategy;
  exports.DefaultErrorStrategy = require_ErrorStrategy().DefaultErrorStrategy;
  exports.ErrorListener = require_ErrorListener().ErrorListener;
});

// node_modules/antlr4/src/antlr4/InputStream.js
var require_InputStream = __commonJS((exports, module) => {
  var { Token } = require_Token();
  init_codepointat();
  init_fromcodepoint();

  class InputStream {
    constructor(data, decodeToUnicodeCodePoints) {
      this.name = "<empty>";
      this.strdata = data;
      this.decodeToUnicodeCodePoints = decodeToUnicodeCodePoints || false;
      this._index = 0;
      this.data = [];
      if (this.decodeToUnicodeCodePoints) {
        for (let i = 0;i < this.strdata.length; ) {
          const codePoint = this.strdata.codePointAt(i);
          this.data.push(codePoint);
          i += codePoint <= 65535 ? 1 : 2;
        }
      } else {
        this.data = new Array(this.strdata.length);
        for (let i = 0;i < this.strdata.length; i++) {
          const codeUnit = this.strdata.charCodeAt(i);
          this.data[i] = codeUnit;
        }
      }
      this._size = this.data.length;
    }
    reset() {
      this._index = 0;
    }
    consume() {
      if (this._index >= this._size) {
        throw "cannot consume EOF";
      }
      this._index += 1;
    }
    LA(offset) {
      if (offset === 0) {
        return 0;
      }
      if (offset < 0) {
        offset += 1;
      }
      const pos = this._index + offset - 1;
      if (pos < 0 || pos >= this._size) {
        return Token.EOF;
      }
      return this.data[pos];
    }
    LT(offset) {
      return this.LA(offset);
    }
    mark() {
      return -1;
    }
    release(marker) {
    }
    seek(_index) {
      if (_index <= this._index) {
        this._index = _index;
        return;
      }
      this._index = Math.min(_index, this._size);
    }
    getText(start, stop) {
      if (stop >= this._size) {
        stop = this._size - 1;
      }
      if (start >= this._size) {
        return "";
      } else {
        if (this.decodeToUnicodeCodePoints) {
          let result = "";
          for (let i = start;i <= stop; i++) {
            result += String.fromCodePoint(this.data[i]);
          }
          return result;
        } else {
          return this.strdata.slice(start, stop + 1);
        }
      }
    }
    toString() {
      return this.strdata;
    }
    get index() {
      return this._index;
    }
    get size() {
      return this._size;
    }
  }
  module.exports = InputStream;
});

// node_modules/antlr4/src/antlr4/BufferedTokenStream.js
var require_BufferedTokenStream = __commonJS((exports, module) => {
  var { Token } = require_Token();
  var Lexer = require_Lexer();
  var { Interval } = require_IntervalSet();

  class TokenStream {
  }

  class BufferedTokenStream extends TokenStream {
    constructor(tokenSource) {
      super();
      this.tokenSource = tokenSource;
      this.tokens = [];
      this.index = -1;
      this.fetchedEOF = false;
    }
    mark() {
      return 0;
    }
    release(marker) {
    }
    reset() {
      this.seek(0);
    }
    seek(index) {
      this.lazyInit();
      this.index = this.adjustSeekIndex(index);
    }
    get(index) {
      this.lazyInit();
      return this.tokens[index];
    }
    consume() {
      let skipEofCheck = false;
      if (this.index >= 0) {
        if (this.fetchedEOF) {
          skipEofCheck = this.index < this.tokens.length - 1;
        } else {
          skipEofCheck = this.index < this.tokens.length;
        }
      } else {
        skipEofCheck = false;
      }
      if (!skipEofCheck && this.LA(1) === Token.EOF) {
        throw "cannot consume EOF";
      }
      if (this.sync(this.index + 1)) {
        this.index = this.adjustSeekIndex(this.index + 1);
      }
    }
    sync(i) {
      const n = i - this.tokens.length + 1;
      if (n > 0) {
        const fetched = this.fetch(n);
        return fetched >= n;
      }
      return true;
    }
    fetch(n) {
      if (this.fetchedEOF) {
        return 0;
      }
      for (let i = 0;i < n; i++) {
        const t = this.tokenSource.nextToken();
        t.tokenIndex = this.tokens.length;
        this.tokens.push(t);
        if (t.type === Token.EOF) {
          this.fetchedEOF = true;
          return i + 1;
        }
      }
      return n;
    }
    getTokens(start, stop, types) {
      if (types === undefined) {
        types = null;
      }
      if (start < 0 || stop < 0) {
        return null;
      }
      this.lazyInit();
      const subset = [];
      if (stop >= this.tokens.length) {
        stop = this.tokens.length - 1;
      }
      for (let i = start;i < stop; i++) {
        const t = this.tokens[i];
        if (t.type === Token.EOF) {
          break;
        }
        if (types === null || types.contains(t.type)) {
          subset.push(t);
        }
      }
      return subset;
    }
    LA(i) {
      return this.LT(i).type;
    }
    LB(k) {
      if (this.index - k < 0) {
        return null;
      }
      return this.tokens[this.index - k];
    }
    LT(k) {
      this.lazyInit();
      if (k === 0) {
        return null;
      }
      if (k < 0) {
        return this.LB(-k);
      }
      const i = this.index + k - 1;
      this.sync(i);
      if (i >= this.tokens.length) {
        return this.tokens[this.tokens.length - 1];
      }
      return this.tokens[i];
    }
    adjustSeekIndex(i) {
      return i;
    }
    lazyInit() {
      if (this.index === -1) {
        this.setup();
      }
    }
    setup() {
      this.sync(0);
      this.index = this.adjustSeekIndex(0);
    }
    setTokenSource(tokenSource) {
      this.tokenSource = tokenSource;
      this.tokens = [];
      this.index = -1;
      this.fetchedEOF = false;
    }
    nextTokenOnChannel(i, channel) {
      this.sync(i);
      if (i >= this.tokens.length) {
        return -1;
      }
      let token = this.tokens[i];
      while (token.channel !== this.channel) {
        if (token.type === Token.EOF) {
          return -1;
        }
        i += 1;
        this.sync(i);
        token = this.tokens[i];
      }
      return i;
    }
    previousTokenOnChannel(i, channel) {
      while (i >= 0 && this.tokens[i].channel !== channel) {
        i -= 1;
      }
      return i;
    }
    getHiddenTokensToRight(tokenIndex, channel) {
      if (channel === undefined) {
        channel = -1;
      }
      this.lazyInit();
      if (tokenIndex < 0 || tokenIndex >= this.tokens.length) {
        throw "" + tokenIndex + " not in 0.." + this.tokens.length - 1;
      }
      const nextOnChannel = this.nextTokenOnChannel(tokenIndex + 1, Lexer.DEFAULT_TOKEN_CHANNEL);
      const from_ = tokenIndex + 1;
      const to = nextOnChannel === -1 ? this.tokens.length - 1 : nextOnChannel;
      return this.filterForChannel(from_, to, channel);
    }
    getHiddenTokensToLeft(tokenIndex, channel) {
      if (channel === undefined) {
        channel = -1;
      }
      this.lazyInit();
      if (tokenIndex < 0 || tokenIndex >= this.tokens.length) {
        throw "" + tokenIndex + " not in 0.." + this.tokens.length - 1;
      }
      const prevOnChannel = this.previousTokenOnChannel(tokenIndex - 1, Lexer.DEFAULT_TOKEN_CHANNEL);
      if (prevOnChannel === tokenIndex - 1) {
        return null;
      }
      const from_ = prevOnChannel + 1;
      const to = tokenIndex - 1;
      return this.filterForChannel(from_, to, channel);
    }
    filterForChannel(left, right, channel) {
      const hidden = [];
      for (let i = left;i < right + 1; i++) {
        const t = this.tokens[i];
        if (channel === -1) {
          if (t.channel !== Lexer.DEFAULT_TOKEN_CHANNEL) {
            hidden.push(t);
          }
        } else if (t.channel === channel) {
          hidden.push(t);
        }
      }
      if (hidden.length === 0) {
        return null;
      }
      return hidden;
    }
    getSourceName() {
      return this.tokenSource.getSourceName();
    }
    getText(interval) {
      this.lazyInit();
      this.fill();
      if (interval === undefined || interval === null) {
        interval = new Interval(0, this.tokens.length - 1);
      }
      let start = interval.start;
      if (start instanceof Token) {
        start = start.tokenIndex;
      }
      let stop = interval.stop;
      if (stop instanceof Token) {
        stop = stop.tokenIndex;
      }
      if (start === null || stop === null || start < 0 || stop < 0) {
        return "";
      }
      if (stop >= this.tokens.length) {
        stop = this.tokens.length - 1;
      }
      let s = "";
      for (let i = start;i < stop + 1; i++) {
        const t = this.tokens[i];
        if (t.type === Token.EOF) {
          break;
        }
        s = s + t.text;
      }
      return s;
    }
    fill() {
      this.lazyInit();
      while (this.fetch(1000) === 1000) {
        continue;
      }
    }
  }
  module.exports = BufferedTokenStream;
});

// node_modules/antlr4/src/antlr4/CommonTokenStream.js
var require_CommonTokenStream = __commonJS((exports, module) => {
  var Token = require_Token().Token;
  var BufferedTokenStream = require_BufferedTokenStream();

  class CommonTokenStream extends BufferedTokenStream {
    constructor(lexer, channel) {
      super(lexer);
      this.channel = channel === undefined ? Token.DEFAULT_CHANNEL : channel;
    }
    adjustSeekIndex(i) {
      return this.nextTokenOnChannel(i, this.channel);
    }
    LB(k) {
      if (k === 0 || this.index - k < 0) {
        return null;
      }
      let i = this.index;
      let n = 1;
      while (n <= k) {
        i = this.previousTokenOnChannel(i - 1, this.channel);
        n += 1;
      }
      if (i < 0) {
        return null;
      }
      return this.tokens[i];
    }
    LT(k) {
      this.lazyInit();
      if (k === 0) {
        return null;
      }
      if (k < 0) {
        return this.LB(-k);
      }
      let i = this.index;
      let n = 1;
      while (n < k) {
        if (this.sync(i + 1)) {
          i = this.nextTokenOnChannel(i + 1, this.channel);
        }
        n += 1;
      }
      return this.tokens[i];
    }
    getNumberOfOnChannelTokens() {
      let n = 0;
      this.fill();
      for (let i = 0;i < this.tokens.length; i++) {
        const t = this.tokens[i];
        if (t.channel === this.channel) {
          n += 1;
        }
        if (t.type === Token.EOF) {
          break;
        }
      }
      return n;
    }
  }
  module.exports = CommonTokenStream;
});

// node_modules/antlr4/src/antlr4/Parser.js
var require_Parser = __commonJS((exports, module) => {
  var { Token } = require_Token();
  var { ParseTreeListener, TerminalNode, ErrorNode } = require_Tree();
  var Recognizer = require_Recognizer();
  var { DefaultErrorStrategy } = require_ErrorStrategy();
  var ATNDeserializer = require_ATNDeserializer();
  var ATNDeserializationOptions = require_ATNDeserializationOptions();
  var Lexer = require_Lexer();

  class TraceListener extends ParseTreeListener {
    constructor(parser) {
      super();
      this.parser = parser;
    }
    enterEveryRule(ctx) {
      console.log("enter   " + this.parser.ruleNames[ctx.ruleIndex] + ", LT(1)=" + this.parser._input.LT(1).text);
    }
    visitTerminal(node) {
      console.log("consume " + node.symbol + " rule " + this.parser.ruleNames[this.parser._ctx.ruleIndex]);
    }
    exitEveryRule(ctx) {
      console.log("exit    " + this.parser.ruleNames[ctx.ruleIndex] + ", LT(1)=" + this.parser._input.LT(1).text);
    }
  }

  class Parser extends Recognizer {
    constructor(input) {
      super();
      this._input = null;
      this._errHandler = new DefaultErrorStrategy;
      this._precedenceStack = [];
      this._precedenceStack.push(0);
      this._ctx = null;
      this.buildParseTrees = true;
      this._tracer = null;
      this._parseListeners = null;
      this._syntaxErrors = 0;
      this.setInputStream(input);
    }
    reset() {
      if (this._input !== null) {
        this._input.seek(0);
      }
      this._errHandler.reset(this);
      this._ctx = null;
      this._syntaxErrors = 0;
      this.setTrace(false);
      this._precedenceStack = [];
      this._precedenceStack.push(0);
      if (this._interp !== null) {
        this._interp.reset();
      }
    }
    match(ttype) {
      let t = this.getCurrentToken();
      if (t.type === ttype) {
        this._errHandler.reportMatch(this);
        this.consume();
      } else {
        t = this._errHandler.recoverInline(this);
        if (this.buildParseTrees && t.tokenIndex === -1) {
          this._ctx.addErrorNode(t);
        }
      }
      return t;
    }
    matchWildcard() {
      let t = this.getCurrentToken();
      if (t.type > 0) {
        this._errHandler.reportMatch(this);
        this.consume();
      } else {
        t = this._errHandler.recoverInline(this);
        if (this._buildParseTrees && t.tokenIndex === -1) {
          this._ctx.addErrorNode(t);
        }
      }
      return t;
    }
    getParseListeners() {
      return this._parseListeners || [];
    }
    addParseListener(listener) {
      if (listener === null) {
        throw "listener";
      }
      if (this._parseListeners === null) {
        this._parseListeners = [];
      }
      this._parseListeners.push(listener);
    }
    removeParseListener(listener) {
      if (this._parseListeners !== null) {
        const idx = this._parseListeners.indexOf(listener);
        if (idx >= 0) {
          this._parseListeners.splice(idx, 1);
        }
        if (this._parseListeners.length === 0) {
          this._parseListeners = null;
        }
      }
    }
    removeParseListeners() {
      this._parseListeners = null;
    }
    triggerEnterRuleEvent() {
      if (this._parseListeners !== null) {
        const ctx = this._ctx;
        this._parseListeners.forEach(function(listener) {
          listener.enterEveryRule(ctx);
          ctx.enterRule(listener);
        });
      }
    }
    triggerExitRuleEvent() {
      if (this._parseListeners !== null) {
        const ctx = this._ctx;
        this._parseListeners.slice(0).reverse().forEach(function(listener) {
          ctx.exitRule(listener);
          listener.exitEveryRule(ctx);
        });
      }
    }
    getTokenFactory() {
      return this._input.tokenSource._factory;
    }
    setTokenFactory(factory) {
      this._input.tokenSource._factory = factory;
    }
    getATNWithBypassAlts() {
      const serializedAtn = this.getSerializedATN();
      if (serializedAtn === null) {
        throw "The current parser does not support an ATN with bypass alternatives.";
      }
      let result = this.bypassAltsAtnCache[serializedAtn];
      if (result === null) {
        const deserializationOptions = new ATNDeserializationOptions;
        deserializationOptions.generateRuleBypassTransitions = true;
        result = new ATNDeserializer(deserializationOptions).deserialize(serializedAtn);
        this.bypassAltsAtnCache[serializedAtn] = result;
      }
      return result;
    }
    compileParseTreePattern(pattern, patternRuleIndex, lexer) {
      lexer = lexer || null;
      if (lexer === null) {
        if (this.getTokenStream() !== null) {
          const tokenSource = this.getTokenStream().tokenSource;
          if (tokenSource instanceof Lexer) {
            lexer = tokenSource;
          }
        }
      }
      if (lexer === null) {
        throw "Parser can't discover a lexer to use";
      }
      const m = new ParseTreePatternMatcher(lexer, this);
      return m.compile(pattern, patternRuleIndex);
    }
    getInputStream() {
      return this.getTokenStream();
    }
    setInputStream(input) {
      this.setTokenStream(input);
    }
    getTokenStream() {
      return this._input;
    }
    setTokenStream(input) {
      this._input = null;
      this.reset();
      this._input = input;
    }
    getCurrentToken() {
      return this._input.LT(1);
    }
    notifyErrorListeners(msg, offendingToken, err) {
      offendingToken = offendingToken || null;
      err = err || null;
      if (offendingToken === null) {
        offendingToken = this.getCurrentToken();
      }
      this._syntaxErrors += 1;
      const line = offendingToken.line;
      const column = offendingToken.column;
      const listener = this.getErrorListenerDispatch();
      listener.syntaxError(this, offendingToken, line, column, msg, err);
    }
    consume() {
      const o = this.getCurrentToken();
      if (o.type !== Token.EOF) {
        this.getInputStream().consume();
      }
      const hasListener = this._parseListeners !== null && this._parseListeners.length > 0;
      if (this.buildParseTrees || hasListener) {
        let node;
        if (this._errHandler.inErrorRecoveryMode(this)) {
          node = this._ctx.addErrorNode(o);
        } else {
          node = this._ctx.addTokenNode(o);
        }
        node.invokingState = this.state;
        if (hasListener) {
          this._parseListeners.forEach(function(listener) {
            if (node instanceof ErrorNode || node.isErrorNode !== undefined && node.isErrorNode()) {
              listener.visitErrorNode(node);
            } else if (node instanceof TerminalNode) {
              listener.visitTerminal(node);
            }
          });
        }
      }
      return o;
    }
    addContextToParseTree() {
      if (this._ctx.parentCtx !== null) {
        this._ctx.parentCtx.addChild(this._ctx);
      }
    }
    enterRule(localctx, state, ruleIndex) {
      this.state = state;
      this._ctx = localctx;
      this._ctx.start = this._input.LT(1);
      if (this.buildParseTrees) {
        this.addContextToParseTree();
      }
      this.triggerEnterRuleEvent();
    }
    exitRule() {
      this._ctx.stop = this._input.LT(-1);
      this.triggerExitRuleEvent();
      this.state = this._ctx.invokingState;
      this._ctx = this._ctx.parentCtx;
    }
    enterOuterAlt(localctx, altNum) {
      localctx.setAltNumber(altNum);
      if (this.buildParseTrees && this._ctx !== localctx) {
        if (this._ctx.parentCtx !== null) {
          this._ctx.parentCtx.removeLastChild();
          this._ctx.parentCtx.addChild(localctx);
        }
      }
      this._ctx = localctx;
    }
    getPrecedence() {
      if (this._precedenceStack.length === 0) {
        return -1;
      } else {
        return this._precedenceStack[this._precedenceStack.length - 1];
      }
    }
    enterRecursionRule(localctx, state, ruleIndex, precedence) {
      this.state = state;
      this._precedenceStack.push(precedence);
      this._ctx = localctx;
      this._ctx.start = this._input.LT(1);
      this.triggerEnterRuleEvent();
    }
    pushNewRecursionContext(localctx, state, ruleIndex) {
      const previous = this._ctx;
      previous.parentCtx = localctx;
      previous.invokingState = state;
      previous.stop = this._input.LT(-1);
      this._ctx = localctx;
      this._ctx.start = previous.start;
      if (this.buildParseTrees) {
        this._ctx.addChild(previous);
      }
      this.triggerEnterRuleEvent();
    }
    unrollRecursionContexts(parentCtx) {
      this._precedenceStack.pop();
      this._ctx.stop = this._input.LT(-1);
      const retCtx = this._ctx;
      const parseListeners = this.getParseListeners();
      if (parseListeners !== null && parseListeners.length > 0) {
        while (this._ctx !== parentCtx) {
          this.triggerExitRuleEvent();
          this._ctx = this._ctx.parentCtx;
        }
      } else {
        this._ctx = parentCtx;
      }
      retCtx.parentCtx = parentCtx;
      if (this.buildParseTrees && parentCtx !== null) {
        parentCtx.addChild(retCtx);
      }
    }
    getInvokingContext(ruleIndex) {
      let ctx = this._ctx;
      while (ctx !== null) {
        if (ctx.ruleIndex === ruleIndex) {
          return ctx;
        }
        ctx = ctx.parentCtx;
      }
      return null;
    }
    precpred(localctx, precedence) {
      return precedence >= this._precedenceStack[this._precedenceStack.length - 1];
    }
    inContext(context) {
      return false;
    }
    isExpectedToken(symbol) {
      const atn = this._interp.atn;
      let ctx = this._ctx;
      const s = atn.states[this.state];
      let following = atn.nextTokens(s);
      if (following.contains(symbol)) {
        return true;
      }
      if (!following.contains(Token.EPSILON)) {
        return false;
      }
      while (ctx !== null && ctx.invokingState >= 0 && following.contains(Token.EPSILON)) {
        const invokingState = atn.states[ctx.invokingState];
        const rt = invokingState.transitions[0];
        following = atn.nextTokens(rt.followState);
        if (following.contains(symbol)) {
          return true;
        }
        ctx = ctx.parentCtx;
      }
      if (following.contains(Token.EPSILON) && symbol === Token.EOF) {
        return true;
      } else {
        return false;
      }
    }
    getExpectedTokens() {
      return this._interp.atn.getExpectedTokens(this.state, this._ctx);
    }
    getExpectedTokensWithinCurrentRule() {
      const atn = this._interp.atn;
      const s = atn.states[this.state];
      return atn.nextTokens(s);
    }
    getRuleIndex(ruleName) {
      const ruleIndex = this.getRuleIndexMap()[ruleName];
      if (ruleIndex !== null) {
        return ruleIndex;
      } else {
        return -1;
      }
    }
    getRuleInvocationStack(p) {
      p = p || null;
      if (p === null) {
        p = this._ctx;
      }
      const stack = [];
      while (p !== null) {
        const ruleIndex = p.ruleIndex;
        if (ruleIndex < 0) {
          stack.push("n/a");
        } else {
          stack.push(this.ruleNames[ruleIndex]);
        }
        p = p.parentCtx;
      }
      return stack;
    }
    getDFAStrings() {
      return this._interp.decisionToDFA.toString();
    }
    dumpDFA() {
      let seenOne = false;
      for (let i = 0;i < this._interp.decisionToDFA.length; i++) {
        const dfa = this._interp.decisionToDFA[i];
        if (dfa.states.length > 0) {
          if (seenOne) {
            console.log();
          }
          this.printer.println("Decision " + dfa.decision + ":");
          this.printer.print(dfa.toString(this.literalNames, this.symbolicNames));
          seenOne = true;
        }
      }
    }
    getSourceName() {
      return this._input.sourceName;
    }
    setTrace(trace) {
      if (!trace) {
        this.removeParseListener(this._tracer);
        this._tracer = null;
      } else {
        if (this._tracer !== null) {
          this.removeParseListener(this._tracer);
        }
        this._tracer = new TraceListener(this);
        this.addParseListener(this._tracer);
      }
    }
  }
  Parser.bypassAltsAtnCache = {};
  module.exports = Parser;
});

// src/parser/antlr4-index.js
var require_antlr4_index = __commonJS((exports) => {
  exports.atn = require_atn();
  exports.codepointat = (init_codepointat(), __toCommonJS(exports_codepointat));
  exports.dfa = require_dfa();
  exports.fromcodepoint = (init_fromcodepoint(), __toCommonJS(exports_fromcodepoint));
  exports.tree = require_tree();
  exports.error = require_error();
  exports.Token = require_Token().Token;
  exports.CommonToken = require_Token().CommonToken;
  exports.InputStream = require_InputStream();
  exports.CommonTokenStream = require_CommonTokenStream();
  exports.Lexer = require_Lexer();
  exports.Parser = require_Parser();
  var pc = require_PredictionContext();
  exports.PredictionContextCache = pc.PredictionContextCache;
  exports.ParserRuleContext = require_ParserRuleContext();
  exports.Interval = require_IntervalSet().Interval;
  exports.IntervalSet = require_IntervalSet().IntervalSet;
  exports.Utils = require_Utils();
  exports.LL1Analyzer = require_LL1Analyzer().LL1Analyzer;
});

// src/parser/generated/FHIRPathLexer.js
var require_FHIRPathLexer = __commonJS((exports, module) => {
  var antlr4 = require_antlr4_index();
  var serializedATN = [
    "\x03\u608B\uA72A\u8133\uB9ED\u417C\u3BE7\u7786",
    "\u5964\x02A\u0203\b\x01\x04\x02\t\x02\x04\x03\t\x03",
    "\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07",
    `	\x07\x04	\x04			\x04
	
\x04	\x04`,
    `	\x04\r	\r\x04\x0E	\x0E\x04\x0F	\x0F\x04\x10`,
    "\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04\x13\t\x13",
    "\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17",
    "\t\x17\x04\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A",
    "\x04\x1B\t\x1B\x04\x1C\t\x1C\x04\x1D\t\x1D\x04\x1E",
    '\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04"\t"\x04#',
    "\t#\x04$\t$\x04%\t%\x04&\t&\x04'\t'\x04(\t(\x04)\t)\x04",
    "*\t*\x04+\t+\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x040\t0\x04",
    "1\t1\x042\t2\x043\t3\x044\t4\x045\t5\x046\t6\x047\t7\x04",
    "8\t8\x049\t9\x04:\t:\x04;\t;\x04<\t<\x04=\t=\x04>\t>\x04",
    "?\t?\x04@\t@\x04A\tA\x04B\tB\x04C\tC\x04D\tD\x03\x02\x03",
    "\x02\x03\x03\x03\x03\x03\x04\x03\x04\x03\x05\x03",
    "\x05\x03\x06\x03\x06\x03\x07\x03\x07\x03\b\x03",
    `\x03	\x03	\x03	\x03	\x03
\x03
\x03
\x03
\x03`,
    `\x03\x03\x03\x03\r\x03\r\x03\r\x03\x0E`,
    "\x03\x0E\x03\x0F\x03\x0F\x03\x10\x03\x10\x03\x10",
    "\x03\x11\x03\x11\x03\x11\x03\x12\x03\x12\x03\x12",
    "\x03\x13\x03\x13\x03\x14\x03\x14\x03\x15\x03\x15",
    "\x03\x15\x03\x16\x03\x16\x03\x16\x03\x17\x03\x17",
    "\x03\x17\x03\x18\x03\x18\x03\x18\x03\x18\x03\x18",
    "\x03\x18\x03\x18\x03\x18\x03\x18\x03\x19\x03\x19",
    "\x03\x19\x03\x19\x03\x1A\x03\x1A\x03\x1A\x03\x1B",
    "\x03\x1B\x03\x1B\x03\x1B\x03\x1C\x03\x1C\x03\x1C",
    "\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1D",
    "\x03\x1D\x03\x1E\x03\x1E\x03\x1F\x03\x1F\x03 ",
    '\x03 \x03!\x03!\x03!\x03!\x03!\x03"\x03"\x03"\x03',
    '"\x03"\x03"\x03#\x03#\x03$\x03$\x03$\x03$\x03$',
    "\x03$\x03%\x03%\x03%\x03%\x03%\x03%\x03%\x03&\x03",
    "&\x03&\x03&\x03&\x03&\x03&\x03'\x03'\x03(\x03(\x03",
    "(\x03(\x03(\x03)\x03)\x03)\x03)\x03)\x03)\x03*\x03",
    "*\x03*\x03*\x03*\x03+\x03+\x03+\x03+\x03,\x03,\x03",
    ",\x03,\x03,\x03-\x03-\x03-\x03-\x03-\x03-\x03-\x03",
    ".\x03.\x03.\x03.\x03.\x03.\x03.\x03/\x03/\x03/\x03",
    "/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x03/\x030\x03",
    "0\x030\x030\x030\x030\x031\x031\x031\x031\x031\x03",
    "1\x031\x032\x032\x032\x032\x032\x032\x033\x033\x03",
    "3\x033\x033\x034\x034\x034\x034\x034\x034\x035\x03",
    "5\x035\x035\x035\x035\x035\x035\x036\x036\x036\x03",
    "6\x036\x036\x036\x036\x037\x037\x037\x037\x037\x03",
    "7\x037\x037\x037\x037\x037\x037\x037\x038\x038\x03",
    "8\x038\x038\x038\x038\x038\x038\x038\x038\x038\x03",
    `8\x058\u0183
8\x058\u0185
8\x058\u0187
8\x038\x058\u018A`,
    `
8\x039\x039\x039\x039\x03:\x03:\x03:\x03:\x03:\x03`,
    `:\x03:\x03:\x03:\x03:\x06:\u019A
:\r:\x0E:\u019B\x05`,
    `:\u019E
:\x05:\u01A0
:\x05:\u01A2
:\x03:\x03:\x03:\x03`,
    `:\x03:\x03:\x03:\x05:\u01AB
:\x03;\x05;\u01AE
;\x03`,
    `;\x07;\u01B1
;;\x0E;\u01B4;\x03<\x03<\x03<\x07`,
    `<\u01B9
<<\x0E<\u01BC<\x03<\x03<\x03=\x03=\x03`,
    `=\x07=\u01C3
==\x0E=\u01C6=\x03=\x03=\x03>\x06`,
    `>\u01CB
>\r>\x0E>\u01CC\x03>\x03>\x06>\u01D1
>\r>\x0E>\u01D2`,
    `\x05>\u01D5
>\x03?\x06?\u01D8
?\r?\x0E?\u01D9\x03?\x03`,
    `?\x03@\x03@\x03@\x03@\x07@\u01E2
@@\x0E@\u01E5`,
    "@\x03@\x03@\x03@\x03@\x03@\x03A\x03A\x03A\x03A\x07",
    `A\u01F0
AA\x0EA\u01F3A\x03A\x03A\x03B\x03B\x03`,
    `B\x05B\u01FA
B\x03C\x03C\x03C\x03C\x03C\x03C\x03D\x03`,
    "D\x03\u01E3\x02E\x03\x03\x05\x04\x07\x05\t\x06\v",
    `\x07\r\x0F	\x11
\x13\x15\x17\r\x19\x0E\x1B`,
    "\x0F\x1D\x10\x1F\x11!\x12#\x13%\x14'\x15)\x16+",
    "\x17-\x18/\x191\x1A3\x1B5\x1C7\x1D9\x1E;\x1F= ?!A",
    `"C#E$G%I&K'M(O)Q*S+U,W-Y.[/]0_1a2c3e4g5i6k7m8o9q:s\x02u;w<y={>}`,
    "?\x7F@\x81A\x83\x02\x85\x02\x87\x02\x03\x02\f\x03",
    "\x022;\x04\x02--//\x05\x02C\\aac|\x06\x022;C\\aac|\x04",
    '\x02^^bb\x03\x02))\x05\x02\v\f\x0F\x0F""\x04\x02',
    `\x0F\x0F
\x02))11^^bbhhppttvv\x05\x022;CHch\x02\u0214`,
    "\x02\x03\x03\x02\x02\x02\x02\x05\x03\x02\x02\x02",
    "\x02\x07\x03\x02\x02\x02\x02\t\x03\x02\x02\x02",
    `\x02\x03\x02\x02\x02\x02\r\x03\x02\x02\x02`,
    "\x02\x0F\x03\x02\x02\x02\x02\x11\x03\x02\x02\x02",
    "\x02\x13\x03\x02\x02\x02\x02\x15\x03\x02\x02\x02",
    "\x02\x17\x03\x02\x02\x02\x02\x19\x03\x02\x02\x02",
    "\x02\x1B\x03\x02\x02\x02\x02\x1D\x03\x02\x02\x02",
    "\x02\x1F\x03\x02\x02\x02\x02!\x03\x02\x02\x02",
    "\x02#\x03\x02\x02\x02\x02%\x03\x02\x02\x02\x02",
    "'\x03\x02\x02\x02\x02)\x03\x02\x02\x02\x02+\x03",
    "\x02\x02\x02\x02-\x03\x02\x02\x02\x02/\x03\x02",
    "\x02\x02\x021\x03\x02\x02\x02\x023\x03\x02\x02",
    "\x02\x025\x03\x02\x02\x02\x027\x03\x02\x02\x02",
    "\x029\x03\x02\x02\x02\x02;\x03\x02\x02\x02\x02",
    "=\x03\x02\x02\x02\x02?\x03\x02\x02\x02\x02A\x03",
    "\x02\x02\x02\x02C\x03\x02\x02\x02\x02E\x03\x02",
    "\x02\x02\x02G\x03\x02\x02\x02\x02I\x03\x02\x02",
    "\x02\x02K\x03\x02\x02\x02\x02M\x03\x02\x02\x02",
    "\x02O\x03\x02\x02\x02\x02Q\x03\x02\x02\x02\x02",
    "S\x03\x02\x02\x02\x02U\x03\x02\x02\x02\x02W\x03",
    "\x02\x02\x02\x02Y\x03\x02\x02\x02\x02[\x03\x02",
    "\x02\x02\x02]\x03\x02\x02\x02\x02_\x03\x02\x02",
    "\x02\x02a\x03\x02\x02\x02\x02c\x03\x02\x02\x02",
    "\x02e\x03\x02\x02\x02\x02g\x03\x02\x02\x02\x02",
    "i\x03\x02\x02\x02\x02k\x03\x02\x02\x02\x02m\x03",
    "\x02\x02\x02\x02o\x03\x02\x02\x02\x02q\x03\x02",
    "\x02\x02\x02u\x03\x02\x02\x02\x02w\x03\x02\x02",
    "\x02\x02y\x03\x02\x02\x02\x02{\x03\x02\x02\x02",
    "\x02}\x03\x02\x02\x02\x02\x7F\x03\x02\x02\x02",
    "\x02\x81\x03\x02\x02\x02\x03\x89\x03\x02\x02\x02",
    "\x05\x8B\x03\x02\x02\x02\x07\x8D\x03\x02\x02\x02",
    "\t\x8F\x03\x02\x02\x02\v\x91\x03\x02\x02\x02",
    `\r\x93\x03\x02\x02\x02\x0F\x95\x03\x02\x02\x02`,
    "\x11\x97\x03\x02\x02\x02\x13\x9B\x03\x02\x02\x02",
    "\x15\x9F\x03\x02\x02\x02\x17\xA1\x03\x02\x02\x02",
    "\x19\xA3\x03\x02\x02\x02\x1B\xA6\x03\x02\x02\x02",
    "\x1D\xA8\x03\x02\x02\x02\x1F\xAA\x03\x02\x02\x02",
    "!\xAD\x03\x02\x02\x02#\xB0\x03\x02\x02\x02%\xB3",
    "\x03\x02\x02\x02'\xB5\x03\x02\x02\x02)\xB7\x03",
    "\x02\x02\x02+\xBA\x03\x02\x02\x02-\xBD\x03\x02",
    "\x02\x02/\xC0\x03\x02\x02\x021\xC9\x03\x02\x02",
    "\x023\xCD\x03\x02\x02\x025\xD0\x03\x02\x02\x02",
    "7\xD4\x03\x02\x02\x029\xDC\x03\x02\x02\x02;\xDE",
    "\x03\x02\x02\x02=\xE0\x03\x02\x02\x02?\xE2\x03",
    "\x02\x02\x02A\xE4\x03\x02\x02\x02C\xE9\x03\x02",
    "\x02\x02E\xEF\x03\x02\x02\x02G\xF1\x03\x02\x02",
    "\x02I\xF7\x03\x02\x02\x02K\xFE\x03\x02\x02\x02",
    "M\u0105\x03\x02\x02\x02O\u0107\x03\x02\x02\x02Q\u010C",
    "\x03\x02\x02\x02S\u0112\x03\x02\x02\x02U\u0117\x03",
    "\x02\x02\x02W\u011B\x03\x02\x02\x02Y\u0120\x03\x02",
    "\x02\x02[\u0127\x03\x02\x02\x02]\u012E\x03\x02\x02",
    "\x02_\u013A\x03\x02\x02\x02a\u0140\x03\x02\x02\x02",
    "c\u0147\x03\x02\x02\x02e\u014D\x03\x02\x02\x02g\u0152",
    "\x03\x02\x02\x02i\u0158\x03\x02\x02\x02k\u0160\x03",
    "\x02\x02\x02m\u0168\x03\x02\x02\x02o\u0175\x03\x02",
    "\x02\x02q\u018B\x03\x02\x02\x02s\u018F\x03\x02\x02",
    "\x02u\u01AD\x03\x02\x02\x02w\u01B5\x03\x02\x02\x02",
    "y\u01BF\x03\x02\x02\x02{\u01CA\x03\x02\x02\x02}\u01D7",
    "\x03\x02\x02\x02\x7F\u01DD\x03\x02\x02\x02\x81\u01EB",
    "\x03\x02\x02\x02\x83\u01F6\x03\x02\x02\x02\x85\u01FB",
    "\x03\x02\x02\x02\x87\u0201\x03\x02\x02\x02\x89\x8A",
    "\x070\x02\x02\x8A\x04\x03\x02\x02\x02\x8B\x8C",
    "\x07]\x02\x02\x8C\x06\x03\x02\x02\x02\x8D\x8E",
    "\x07_\x02\x02\x8E\b\x03\x02\x02\x02\x8F\x90\x07",
    `-\x02\x02\x90
\x03\x02\x02\x02\x91\x92\x07/\x02`,
    "\x02\x92\f\x03\x02\x02\x02\x93\x94\x07,\x02\x02",
    "\x94\x0E\x03\x02\x02\x02\x95\x96\x071\x02\x02",
    "\x96\x10\x03\x02\x02\x02\x97\x98\x07f\x02\x02",
    "\x98\x99\x07k\x02\x02\x99\x9A\x07x\x02\x02\x9A",
    "\x12\x03\x02\x02\x02\x9B\x9C\x07o\x02\x02\x9C",
    "\x9D\x07q\x02\x02\x9D\x9E\x07f\x02\x02\x9E\x14",
    "\x03\x02\x02\x02\x9F\xA0\x07(\x02\x02\xA0\x16",
    "\x03\x02\x02\x02\xA1\xA2\x07~\x02\x02\xA2\x18",
    "\x03\x02\x02\x02\xA3\xA4\x07>\x02\x02\xA4\xA5",
    "\x07?\x02\x02\xA5\x1A\x03\x02\x02\x02\xA6\xA7",
    "\x07>\x02\x02\xA7\x1C\x03\x02\x02\x02\xA8\xA9",
    "\x07@\x02\x02\xA9\x1E\x03\x02\x02\x02\xAA\xAB",
    "\x07@\x02\x02\xAB\xAC\x07?\x02\x02\xAC \x03\x02",
    "\x02\x02\xAD\xAE\x07k\x02\x02\xAE\xAF\x07u\x02",
    '\x02\xAF"\x03\x02\x02\x02\xB0\xB1\x07c\x02\x02',
    "\xB1\xB2\x07u\x02\x02\xB2$\x03\x02\x02\x02\xB3",
    "\xB4\x07?\x02\x02\xB4&\x03\x02\x02\x02\xB5\xB6",
    "\x07\x80\x02\x02\xB6(\x03\x02\x02\x02\xB7\xB8",
    "\x07#\x02\x02\xB8\xB9\x07?\x02\x02\xB9*\x03\x02",
    "\x02\x02\xBA\xBB\x07#\x02\x02\xBB\xBC\x07\x80",
    "\x02\x02\xBC,\x03\x02\x02\x02\xBD\xBE\x07k\x02",
    "\x02\xBE\xBF\x07p\x02\x02\xBF.\x03\x02\x02\x02",
    "\xC0\xC1\x07e\x02\x02\xC1\xC2\x07q\x02\x02\xC2",
    "\xC3\x07p\x02\x02\xC3\xC4\x07v\x02\x02\xC4\xC5",
    "\x07c\x02\x02\xC5\xC6\x07k\x02\x02\xC6\xC7\x07",
    "p\x02\x02\xC7\xC8\x07u\x02\x02\xC80\x03\x02\x02",
    "\x02\xC9\xCA\x07c\x02\x02\xCA\xCB\x07p\x02\x02",
    "\xCB\xCC\x07f\x02\x02\xCC2\x03\x02\x02\x02\xCD",
    "\xCE\x07q\x02\x02\xCE\xCF\x07t\x02\x02\xCF4\x03",
    "\x02\x02\x02\xD0\xD1\x07z\x02\x02\xD1\xD2\x07",
    "q\x02\x02\xD2\xD3\x07t\x02\x02\xD36\x03\x02\x02",
    "\x02\xD4\xD5\x07k\x02\x02\xD5\xD6\x07o\x02\x02",
    "\xD6\xD7\x07r\x02\x02\xD7\xD8\x07n\x02\x02\xD8",
    "\xD9\x07k\x02\x02\xD9\xDA\x07g\x02\x02\xDA\xDB",
    "\x07u\x02\x02\xDB8\x03\x02\x02\x02\xDC\xDD\x07",
    "*\x02\x02\xDD:\x03\x02\x02\x02\xDE\xDF\x07+\x02",
    "\x02\xDF<\x03\x02\x02\x02\xE0\xE1\x07}\x02\x02",
    "\xE1>\x03\x02\x02\x02\xE2\xE3\x07\x7F\x02\x02",
    "\xE3@\x03\x02\x02\x02\xE4\xE5\x07v\x02\x02\xE5",
    "\xE6\x07t\x02\x02\xE6\xE7\x07w\x02\x02\xE7\xE8",
    "\x07g\x02\x02\xE8B\x03\x02\x02\x02\xE9\xEA\x07",
    "h\x02\x02\xEA\xEB\x07c\x02\x02\xEB\xEC\x07n\x02",
    "\x02\xEC\xED\x07u\x02\x02\xED\xEE\x07g\x02\x02",
    "\xEED\x03\x02\x02\x02\xEF\xF0\x07'\x02\x02\xF0",
    "F\x03\x02\x02\x02\xF1\xF2\x07&\x02\x02\xF2\xF3",
    "\x07v\x02\x02\xF3\xF4\x07j\x02\x02\xF4\xF5\x07",
    "k\x02\x02\xF5\xF6\x07u\x02\x02\xF6H\x03\x02\x02",
    "\x02\xF7\xF8\x07&\x02\x02\xF8\xF9\x07k\x02\x02",
    "\xF9\xFA\x07p\x02\x02\xFA\xFB\x07f\x02\x02\xFB",
    "\xFC\x07g\x02\x02\xFC\xFD\x07z\x02\x02\xFDJ\x03",
    "\x02\x02\x02\xFE\xFF\x07&\x02\x02\xFF\u0100\x07",
    "v\x02\x02\u0100\u0101\x07q\x02\x02\u0101\u0102\x07v\x02",
    "\x02\u0102\u0103\x07c\x02\x02\u0103\u0104\x07n\x02\x02",
    "\u0104L\x03\x02\x02\x02\u0105\u0106\x07.\x02\x02\u0106",
    "N\x03\x02\x02\x02\u0107\u0108\x07{\x02\x02\u0108\u0109",
    "\x07g\x02\x02\u0109\u010A\x07c\x02\x02\u010A\u010B\x07",
    "t\x02\x02\u010BP\x03\x02\x02\x02\u010C\u010D\x07o\x02",
    "\x02\u010D\u010E\x07q\x02\x02\u010E\u010F\x07p\x02\x02",
    "\u010F\u0110\x07v\x02\x02\u0110\u0111\x07j\x02\x02\u0111",
    "R\x03\x02\x02\x02\u0112\u0113\x07y\x02\x02\u0113\u0114",
    "\x07g\x02\x02\u0114\u0115\x07g\x02\x02\u0115\u0116\x07",
    "m\x02\x02\u0116T\x03\x02\x02\x02\u0117\u0118\x07f\x02",
    "\x02\u0118\u0119\x07c\x02\x02\u0119\u011A\x07{\x02\x02",
    "\u011AV\x03\x02\x02\x02\u011B\u011C\x07j\x02\x02\u011C",
    "\u011D\x07q\x02\x02\u011D\u011E\x07w\x02\x02\u011E\u011F",
    "\x07t\x02\x02\u011FX\x03\x02\x02\x02\u0120\u0121\x07",
    "o\x02\x02\u0121\u0122\x07k\x02\x02\u0122\u0123\x07p\x02",
    "\x02\u0123\u0124\x07w\x02\x02\u0124\u0125\x07v\x02\x02",
    "\u0125\u0126\x07g\x02\x02\u0126Z\x03\x02\x02\x02\u0127",
    "\u0128\x07u\x02\x02\u0128\u0129\x07g\x02\x02\u0129\u012A",
    "\x07e\x02\x02\u012A\u012B\x07q\x02\x02\u012B\u012C\x07",
    "p\x02\x02\u012C\u012D\x07f\x02\x02\u012D\\\x03\x02\x02",
    "\x02\u012E\u012F\x07o\x02\x02\u012F\u0130\x07k\x02\x02",
    "\u0130\u0131\x07n\x02\x02\u0131\u0132\x07n\x02\x02\u0132",
    "\u0133\x07k\x02\x02\u0133\u0134\x07u\x02\x02\u0134\u0135",
    "\x07g\x02\x02\u0135\u0136\x07e\x02\x02\u0136\u0137\x07",
    "q\x02\x02\u0137\u0138\x07p\x02\x02\u0138\u0139\x07f\x02",
    "\x02\u0139^\x03\x02\x02\x02\u013A\u013B\x07{\x02\x02",
    "\u013B\u013C\x07g\x02\x02\u013C\u013D\x07c\x02\x02\u013D",
    "\u013E\x07t\x02\x02\u013E\u013F\x07u\x02\x02\u013F`\x03",
    "\x02\x02\x02\u0140\u0141\x07o\x02\x02\u0141\u0142\x07",
    "q\x02\x02\u0142\u0143\x07p\x02\x02\u0143\u0144\x07v\x02",
    "\x02\u0144\u0145\x07j\x02\x02\u0145\u0146\x07u\x02\x02",
    "\u0146b\x03\x02\x02\x02\u0147\u0148\x07y\x02\x02\u0148",
    "\u0149\x07g\x02\x02\u0149\u014A\x07g\x02\x02\u014A\u014B",
    "\x07m\x02\x02\u014B\u014C\x07u\x02\x02\u014Cd\x03\x02",
    "\x02\x02\u014D\u014E\x07f\x02\x02\u014E\u014F\x07c\x02",
    "\x02\u014F\u0150\x07{\x02\x02\u0150\u0151\x07u\x02\x02",
    "\u0151f\x03\x02\x02\x02\u0152\u0153\x07j\x02\x02\u0153",
    "\u0154\x07q\x02\x02\u0154\u0155\x07w\x02\x02\u0155\u0156",
    "\x07t\x02\x02\u0156\u0157\x07u\x02\x02\u0157h\x03\x02",
    "\x02\x02\u0158\u0159\x07o\x02\x02\u0159\u015A\x07k\x02",
    "\x02\u015A\u015B\x07p\x02\x02\u015B\u015C\x07w\x02\x02",
    "\u015C\u015D\x07v\x02\x02\u015D\u015E\x07g\x02\x02\u015E",
    "\u015F\x07u\x02\x02\u015Fj\x03\x02\x02\x02\u0160\u0161",
    "\x07u\x02\x02\u0161\u0162\x07g\x02\x02\u0162\u0163\x07",
    "e\x02\x02\u0163\u0164\x07q\x02\x02\u0164\u0165\x07p\x02",
    "\x02\u0165\u0166\x07f\x02\x02\u0166\u0167\x07u\x02\x02",
    "\u0167l\x03\x02\x02\x02\u0168\u0169\x07o\x02\x02\u0169",
    "\u016A\x07k\x02\x02\u016A\u016B\x07n\x02\x02\u016B\u016C",
    "\x07n\x02\x02\u016C\u016D\x07k\x02\x02\u016D\u016E\x07",
    "u\x02\x02\u016E\u016F\x07g\x02\x02\u016F\u0170\x07e\x02",
    "\x02\u0170\u0171\x07q\x02\x02\u0171\u0172\x07p\x02\x02",
    "\u0172\u0173\x07f\x02\x02\u0173\u0174\x07u\x02\x02\u0174",
    "n\x03\x02\x02\x02\u0175\u0176\x07B\x02\x02\u0176\u0177",
    "\t\x02\x02\x02\u0177\u0178\t\x02\x02\x02\u0178\u0179\t\x02",
    "\x02\x02\u0179\u0186\t\x02\x02\x02\u017A\u017B\x07/\x02",
    "\x02\u017B\u017C\t\x02\x02\x02\u017C\u0184\t\x02\x02\x02",
    "\u017D\u017E\x07/\x02\x02\u017E\u017F\t\x02\x02\x02\u017F",
    "\u0182\t\x02\x02\x02\u0180\u0181\x07V\x02\x02\u0181\u0183",
    "\x05s:\x02\u0182\u0180\x03\x02\x02\x02\u0182\u0183\x03",
    "\x02\x02\x02\u0183\u0185\x03\x02\x02\x02\u0184\u017D\x03",
    "\x02\x02\x02\u0184\u0185\x03\x02\x02\x02\u0185\u0187\x03",
    "\x02\x02\x02\u0186\u017A\x03\x02\x02\x02\u0186\u0187\x03",
    "\x02\x02\x02\u0187\u0189\x03\x02\x02\x02\u0188\u018A\x07",
    "\\\x02\x02\u0189\u0188\x03\x02\x02\x02\u0189\u018A\x03",
    "\x02\x02\x02\u018Ap\x03\x02\x02\x02\u018B\u018C\x07",
    "B\x02\x02\u018C\u018D\x07V\x02\x02\u018D\u018E\x05s:\x02",
    "\u018Er\x03\x02\x02\x02\u018F\u0190\t\x02\x02\x02\u0190",
    "\u01A1\t\x02\x02\x02\u0191\u0192\x07<\x02\x02\u0192\u0193",
    "\t\x02\x02\x02\u0193\u019F\t\x02\x02\x02\u0194\u0195\x07",
    "<\x02\x02\u0195\u0196\t\x02\x02\x02\u0196\u019D\t\x02\x02",
    "\x02\u0197\u0199\x070\x02\x02\u0198\u019A\t\x02\x02\x02",
    "\u0199\u0198\x03\x02\x02\x02\u019A\u019B\x03\x02\x02\x02",
    "\u019B\u0199\x03\x02\x02\x02\u019B\u019C\x03\x02\x02\x02",
    "\u019C\u019E\x03\x02\x02\x02\u019D\u0197\x03\x02\x02\x02",
    "\u019D\u019E\x03\x02\x02\x02\u019E\u01A0\x03\x02\x02\x02",
    "\u019F\u0194\x03\x02\x02\x02\u019F\u01A0\x03\x02\x02\x02",
    "\u01A0\u01A2\x03\x02\x02\x02\u01A1\u0191\x03\x02\x02\x02",
    "\u01A1\u01A2\x03\x02\x02\x02\u01A2\u01AA\x03\x02\x02\x02",
    "\u01A3\u01AB\x07\\\x02\x02\u01A4\u01A5\t\x03\x02\x02\u01A5",
    "\u01A6\t\x02\x02\x02\u01A6\u01A7\t\x02\x02\x02\u01A7\u01A8",
    "\x07<\x02\x02\u01A8\u01A9\t\x02\x02\x02\u01A9\u01AB\t\x02",
    "\x02\x02\u01AA\u01A3\x03\x02\x02\x02\u01AA\u01A4\x03\x02",
    "\x02\x02\u01AA\u01AB\x03\x02\x02\x02\u01ABt\x03\x02",
    "\x02\x02\u01AC\u01AE\t\x04\x02\x02\u01AD\u01AC\x03\x02",
    "\x02\x02\u01AE\u01B2\x03\x02\x02\x02\u01AF\u01B1\t\x05",
    "\x02\x02\u01B0\u01AF\x03\x02\x02\x02\u01B1\u01B4\x03\x02",
    "\x02\x02\u01B2\u01B0\x03\x02\x02\x02\u01B2\u01B3\x03\x02",
    "\x02\x02\u01B3v\x03\x02\x02\x02\u01B4\u01B2\x03\x02",
    "\x02\x02\u01B5\u01BA\x07b\x02\x02\u01B6\u01B9\x05\x83",
    `B\x02\u01B7\u01B9
\x06\x02\x02\u01B8\u01B6\x03\x02\x02`,
    "\x02\u01B8\u01B7\x03\x02\x02\x02\u01B9\u01BC\x03\x02\x02",
    "\x02\u01BA\u01B8\x03\x02\x02\x02\u01BA\u01BB\x03\x02\x02",
    "\x02\u01BB\u01BD\x03\x02\x02\x02\u01BC\u01BA\x03\x02\x02",
    "\x02\u01BD\u01BE\x07b\x02\x02\u01BEx\x03\x02\x02\x02",
    "\u01BF\u01C4\x07)\x02\x02\u01C0\u01C3\x05\x83B\x02\u01C1",
    `\u01C3
\x07\x02\x02\u01C2\u01C0\x03\x02\x02\x02\u01C2`,
    "\u01C1\x03\x02\x02\x02\u01C3\u01C6\x03\x02\x02\x02\u01C4",
    "\u01C2\x03\x02\x02\x02\u01C4\u01C5\x03\x02\x02\x02\u01C5",
    "\u01C7\x03\x02\x02\x02\u01C6\u01C4\x03\x02\x02\x02\u01C7",
    "\u01C8\x07)\x02\x02\u01C8z\x03\x02\x02\x02\u01C9\u01CB",
    "\t\x02\x02\x02\u01CA\u01C9\x03\x02\x02\x02\u01CB\u01CC",
    "\x03\x02\x02\x02\u01CC\u01CA\x03\x02\x02\x02\u01CC\u01CD",
    "\x03\x02\x02\x02\u01CD\u01D4\x03\x02\x02\x02\u01CE\u01D0",
    "\x070\x02\x02\u01CF\u01D1\t\x02\x02\x02\u01D0\u01CF\x03",
    "\x02\x02\x02\u01D1\u01D2\x03\x02\x02\x02\u01D2\u01D0\x03",
    "\x02\x02\x02\u01D2\u01D3\x03\x02\x02\x02\u01D3\u01D5\x03",
    "\x02\x02\x02\u01D4\u01CE\x03\x02\x02\x02\u01D4\u01D5\x03",
    "\x02\x02\x02\u01D5|\x03\x02\x02\x02\u01D6\u01D8\t\b\x02",
    "\x02\u01D7\u01D6\x03\x02\x02\x02\u01D8\u01D9\x03\x02\x02",
    "\x02\u01D9\u01D7\x03\x02\x02\x02\u01D9\u01DA\x03\x02\x02",
    "\x02\u01DA\u01DB\x03\x02\x02\x02\u01DB\u01DC\b?\x02\x02",
    "\u01DC~\x03\x02\x02\x02\u01DD\u01DE\x071\x02\x02\u01DE",
    "\u01DF\x07,\x02\x02\u01DF\u01E3\x03\x02\x02\x02\u01E0",
    "\u01E2\v\x02\x02\x02\u01E1\u01E0\x03\x02\x02\x02\u01E2",
    "\u01E5\x03\x02\x02\x02\u01E3\u01E4\x03\x02\x02\x02\u01E3",
    "\u01E1\x03\x02\x02\x02\u01E4\u01E6\x03\x02\x02\x02\u01E5",
    "\u01E3\x03\x02\x02\x02\u01E6\u01E7\x07,\x02\x02\u01E7",
    "\u01E8\x071\x02\x02\u01E8\u01E9\x03\x02\x02\x02\u01E9",
    "\u01EA\b@\x02\x02\u01EA\x80\x03\x02\x02\x02\u01EB\u01EC",
    "\x071\x02\x02\u01EC\u01ED\x071\x02\x02\u01ED\u01F1\x03",
    `\x02\x02\x02\u01EE\u01F0
	\x02\x02\u01EF\u01EE\x03\x02`,
    "\x02\x02\u01F0\u01F3\x03\x02\x02\x02\u01F1\u01EF\x03\x02",
    "\x02\x02\u01F1\u01F2\x03\x02\x02\x02\u01F2\u01F4\x03\x02",
    "\x02\x02\u01F3\u01F1\x03\x02\x02\x02\u01F4\u01F5\bA\x02",
    "\x02\u01F5\x82\x03\x02\x02\x02\u01F6\u01F9\x07^\x02",
    `\x02\u01F7\u01FA	
\x02\x02\u01F8\u01FA\x05\x85C\x02\u01F9`,
    "\u01F7\x03\x02\x02\x02\u01F9\u01F8\x03\x02\x02\x02\u01FA",
    "\x84\x03\x02\x02\x02\u01FB\u01FC\x07w\x02\x02\u01FC",
    "\u01FD\x05\x87D\x02\u01FD\u01FE\x05\x87D\x02\u01FE\u01FF",
    "\x05\x87D\x02\u01FF\u0200\x05\x87D\x02\u0200\x86\x03",
    "\x02\x02\x02\u0201\u0202\t\v\x02\x02\u0202\x88\x03",
    "\x02\x02\x02\x1A\x02\u0182\u0184\u0186\u0189\u019B\u019D\u019F",
    "\u01A1\u01AA\u01AD\u01B0\u01B2\u01B8\u01BA\u01C2\u01C4\u01CC\u01D2\u01D4",
    "\u01D9\u01E3\u01F1\u01F9\x03\x02\x03\x02"
  ].join("");
  var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);
  var decisionsToDFA = atn.decisionToState.map((ds, index) => new antlr4.dfa.DFA(ds, index));

  class FHIRPathLexer extends antlr4.Lexer {
    static grammarFileName = "FHIRPath.g4";
    static channelNames = ["DEFAULT_TOKEN_CHANNEL", "HIDDEN"];
    static modeNames = ["DEFAULT_MODE"];
    static literalNames = [
      null,
      "'.'",
      "'['",
      "']'",
      "'+'",
      "'-'",
      "'*'",
      "'/'",
      "'div'",
      "'mod'",
      "'&'",
      "'|'",
      "'<='",
      "'<'",
      "'>'",
      "'>='",
      "'is'",
      "'as'",
      "'='",
      "'~'",
      "'!='",
      "'!~'",
      "'in'",
      "'contains'",
      "'and'",
      "'or'",
      "'xor'",
      "'implies'",
      "'('",
      "')'",
      "'{'",
      "'}'",
      "'true'",
      "'false'",
      "'%'",
      "'$this'",
      "'$index'",
      "'$total'",
      "','",
      "'year'",
      "'month'",
      "'week'",
      "'day'",
      "'hour'",
      "'minute'",
      "'second'",
      "'millisecond'",
      "'years'",
      "'months'",
      "'weeks'",
      "'days'",
      "'hours'",
      "'minutes'",
      "'seconds'",
      "'milliseconds'"
    ];
    static symbolicNames = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "DATETIME",
      "TIME",
      "IDENTIFIER",
      "DELIMITEDIDENTIFIER",
      "STRING",
      "NUMBER",
      "WS",
      "COMMENT",
      "LINE_COMMENT"
    ];
    static ruleNames = [
      "T__0",
      "T__1",
      "T__2",
      "T__3",
      "T__4",
      "T__5",
      "T__6",
      "T__7",
      "T__8",
      "T__9",
      "T__10",
      "T__11",
      "T__12",
      "T__13",
      "T__14",
      "T__15",
      "T__16",
      "T__17",
      "T__18",
      "T__19",
      "T__20",
      "T__21",
      "T__22",
      "T__23",
      "T__24",
      "T__25",
      "T__26",
      "T__27",
      "T__28",
      "T__29",
      "T__30",
      "T__31",
      "T__32",
      "T__33",
      "T__34",
      "T__35",
      "T__36",
      "T__37",
      "T__38",
      "T__39",
      "T__40",
      "T__41",
      "T__42",
      "T__43",
      "T__44",
      "T__45",
      "T__46",
      "T__47",
      "T__48",
      "T__49",
      "T__50",
      "T__51",
      "T__52",
      "T__53",
      "DATETIME",
      "TIME",
      "TIMEFORMAT",
      "IDENTIFIER",
      "DELIMITEDIDENTIFIER",
      "STRING",
      "NUMBER",
      "WS",
      "COMMENT",
      "LINE_COMMENT",
      "ESC",
      "UNICODE",
      "HEX"
    ];
    constructor(input) {
      super(input);
      this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache);
    }
    get atn() {
      return atn;
    }
  }
  FHIRPathLexer.EOF = antlr4.Token.EOF;
  FHIRPathLexer.T__0 = 1;
  FHIRPathLexer.T__1 = 2;
  FHIRPathLexer.T__2 = 3;
  FHIRPathLexer.T__3 = 4;
  FHIRPathLexer.T__4 = 5;
  FHIRPathLexer.T__5 = 6;
  FHIRPathLexer.T__6 = 7;
  FHIRPathLexer.T__7 = 8;
  FHIRPathLexer.T__8 = 9;
  FHIRPathLexer.T__9 = 10;
  FHIRPathLexer.T__10 = 11;
  FHIRPathLexer.T__11 = 12;
  FHIRPathLexer.T__12 = 13;
  FHIRPathLexer.T__13 = 14;
  FHIRPathLexer.T__14 = 15;
  FHIRPathLexer.T__15 = 16;
  FHIRPathLexer.T__16 = 17;
  FHIRPathLexer.T__17 = 18;
  FHIRPathLexer.T__18 = 19;
  FHIRPathLexer.T__19 = 20;
  FHIRPathLexer.T__20 = 21;
  FHIRPathLexer.T__21 = 22;
  FHIRPathLexer.T__22 = 23;
  FHIRPathLexer.T__23 = 24;
  FHIRPathLexer.T__24 = 25;
  FHIRPathLexer.T__25 = 26;
  FHIRPathLexer.T__26 = 27;
  FHIRPathLexer.T__27 = 28;
  FHIRPathLexer.T__28 = 29;
  FHIRPathLexer.T__29 = 30;
  FHIRPathLexer.T__30 = 31;
  FHIRPathLexer.T__31 = 32;
  FHIRPathLexer.T__32 = 33;
  FHIRPathLexer.T__33 = 34;
  FHIRPathLexer.T__34 = 35;
  FHIRPathLexer.T__35 = 36;
  FHIRPathLexer.T__36 = 37;
  FHIRPathLexer.T__37 = 38;
  FHIRPathLexer.T__38 = 39;
  FHIRPathLexer.T__39 = 40;
  FHIRPathLexer.T__40 = 41;
  FHIRPathLexer.T__41 = 42;
  FHIRPathLexer.T__42 = 43;
  FHIRPathLexer.T__43 = 44;
  FHIRPathLexer.T__44 = 45;
  FHIRPathLexer.T__45 = 46;
  FHIRPathLexer.T__46 = 47;
  FHIRPathLexer.T__47 = 48;
  FHIRPathLexer.T__48 = 49;
  FHIRPathLexer.T__49 = 50;
  FHIRPathLexer.T__50 = 51;
  FHIRPathLexer.T__51 = 52;
  FHIRPathLexer.T__52 = 53;
  FHIRPathLexer.T__53 = 54;
  FHIRPathLexer.DATETIME = 55;
  FHIRPathLexer.TIME = 56;
  FHIRPathLexer.IDENTIFIER = 57;
  FHIRPathLexer.DELIMITEDIDENTIFIER = 58;
  FHIRPathLexer.STRING = 59;
  FHIRPathLexer.NUMBER = 60;
  FHIRPathLexer.WS = 61;
  FHIRPathLexer.COMMENT = 62;
  FHIRPathLexer.LINE_COMMENT = 63;
  module.exports = FHIRPathLexer;
});

// src/parser/generated/FHIRPathListener.js
var require_FHIRPathListener = __commonJS((exports, module) => {
  var antlr4 = require_antlr4_index();

  class FHIRPathListener extends antlr4.tree.ParseTreeListener {
    enterEntireExpression(ctx) {
    }
    exitEntireExpression(ctx) {
    }
    enterIndexerExpression(ctx) {
    }
    exitIndexerExpression(ctx) {
    }
    enterPolarityExpression(ctx) {
    }
    exitPolarityExpression(ctx) {
    }
    enterAdditiveExpression(ctx) {
    }
    exitAdditiveExpression(ctx) {
    }
    enterMultiplicativeExpression(ctx) {
    }
    exitMultiplicativeExpression(ctx) {
    }
    enterUnionExpression(ctx) {
    }
    exitUnionExpression(ctx) {
    }
    enterOrExpression(ctx) {
    }
    exitOrExpression(ctx) {
    }
    enterAndExpression(ctx) {
    }
    exitAndExpression(ctx) {
    }
    enterMembershipExpression(ctx) {
    }
    exitMembershipExpression(ctx) {
    }
    enterInequalityExpression(ctx) {
    }
    exitInequalityExpression(ctx) {
    }
    enterInvocationExpression(ctx) {
    }
    exitInvocationExpression(ctx) {
    }
    enterEqualityExpression(ctx) {
    }
    exitEqualityExpression(ctx) {
    }
    enterImpliesExpression(ctx) {
    }
    exitImpliesExpression(ctx) {
    }
    enterTermExpression(ctx) {
    }
    exitTermExpression(ctx) {
    }
    enterTypeExpression(ctx) {
    }
    exitTypeExpression(ctx) {
    }
    enterInvocationTerm(ctx) {
    }
    exitInvocationTerm(ctx) {
    }
    enterLiteralTerm(ctx) {
    }
    exitLiteralTerm(ctx) {
    }
    enterExternalConstantTerm(ctx) {
    }
    exitExternalConstantTerm(ctx) {
    }
    enterParenthesizedTerm(ctx) {
    }
    exitParenthesizedTerm(ctx) {
    }
    enterNullLiteral(ctx) {
    }
    exitNullLiteral(ctx) {
    }
    enterBooleanLiteral(ctx) {
    }
    exitBooleanLiteral(ctx) {
    }
    enterStringLiteral(ctx) {
    }
    exitStringLiteral(ctx) {
    }
    enterNumberLiteral(ctx) {
    }
    exitNumberLiteral(ctx) {
    }
    enterDateTimeLiteral(ctx) {
    }
    exitDateTimeLiteral(ctx) {
    }
    enterTimeLiteral(ctx) {
    }
    exitTimeLiteral(ctx) {
    }
    enterQuantityLiteral(ctx) {
    }
    exitQuantityLiteral(ctx) {
    }
    enterExternalConstant(ctx) {
    }
    exitExternalConstant(ctx) {
    }
    enterMemberInvocation(ctx) {
    }
    exitMemberInvocation(ctx) {
    }
    enterFunctionInvocation(ctx) {
    }
    exitFunctionInvocation(ctx) {
    }
    enterThisInvocation(ctx) {
    }
    exitThisInvocation(ctx) {
    }
    enterIndexInvocation(ctx) {
    }
    exitIndexInvocation(ctx) {
    }
    enterTotalInvocation(ctx) {
    }
    exitTotalInvocation(ctx) {
    }
    enterFunctn(ctx) {
    }
    exitFunctn(ctx) {
    }
    enterParamList(ctx) {
    }
    exitParamList(ctx) {
    }
    enterQuantity(ctx) {
    }
    exitQuantity(ctx) {
    }
    enterUnit(ctx) {
    }
    exitUnit(ctx) {
    }
    enterDateTimePrecision(ctx) {
    }
    exitDateTimePrecision(ctx) {
    }
    enterPluralDateTimePrecision(ctx) {
    }
    exitPluralDateTimePrecision(ctx) {
    }
    enterTypeSpecifier(ctx) {
    }
    exitTypeSpecifier(ctx) {
    }
    enterQualifiedIdentifier(ctx) {
    }
    exitQualifiedIdentifier(ctx) {
    }
    enterIdentifier(ctx) {
    }
    exitIdentifier(ctx) {
    }
  }
  module.exports = FHIRPathListener;
});

// src/parser/generated/FHIRPathParser.js
var require_FHIRPathParser = __commonJS((exports, module) => {
  var antlr4 = require_antlr4_index();
  var FHIRPathListener = require_FHIRPathListener();
  var serializedATN = [
    "\x03\u608B\uA72A\u8133\uB9ED\u417C\u3BE7\u7786",
    "\u5964\x03A\x9C\x04\x02\t\x02\x04\x03\t\x03\x04\x04",
    "\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07\t\x07",
    `\x04	\x04			\x04
	
\x04	\x04	`,
    `\x04\r	\r\x04\x0E	\x0E\x04\x0F	\x0F\x04\x10	\x10`,
    "\x03\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03",
    `\x03\x03\x05\x03(
\x03\x03\x03\x03\x03\x03\x03`,
    "\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03",
    "\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03",
    "\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03",
    "\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03",
    "\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03",
    "\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x07\x03",
    `P
\x03\x03\x0E\x03S\x03\x03\x04\x03\x04\x03`,
    "\x04\x03\x04\x03\x04\x03\x04\x03\x04\x05\x04\\",
    `
\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05`,
    `\x03\x05\x03\x05\x03\x05\x05\x05f
\x05\x03\x06`,
    `\x03\x06\x03\x06\x05\x06k
\x06\x03\x07\x03\x07`,
    `\x03\x07\x03\x07\x03\x07\x05\x07r
\x07\x03\x03`,
    `\x03\x05w
\x03\x03\x03	\x03	\x03	\x07`,
    `	~
		\x0E	\x81	\x03
\x03
\x05
\x85

`,
    `\x03\x03\x03\x05\x8A
\x03`,
    `\x03\x03\r\x03\r\x03\x0E\x03\x0E\x03\x0F\x03`,
    `\x0F\x03\x0F\x07\x0F\x95
\x0F\x0F\x0E\x0F\x98`,
    "\v\x0F\x03\x10\x03\x10\x03\x10\x02\x03\x04\x11",
    `\x02\x04\x06
\x0E\x10\x12\x14\x16\x18\x1A\x1C`,
    "\x1E\x02\x0E\x03\x02\x06\x07\x03\x02\b\v\x04",
    "\x02\x06\x07\f\f\x03\x02\x0E\x11\x03\x02\x14\x17",
    "\x03\x02\x18\x19\x03\x02\x1B\x1C\x03\x02\x12\x13",
    '\x03\x02"#\x03\x02)0\x03\x0218\x05\x02\x12\x13',
    "\x18\x19;<\x02\xAD\x02 \x03\x02\x02\x02\x04'\x03",
    "\x02\x02\x02\x06[\x03\x02\x02\x02\be\x03\x02\x02",
    `\x02
g\x03\x02\x02\x02q\x03\x02\x02\x02\x0Es`,
    "\x03\x02\x02\x02\x10z\x03\x02\x02\x02\x12\x82",
    "\x03\x02\x02\x02\x14\x89\x03\x02\x02\x02\x16\x8B",
    "\x03\x02\x02\x02\x18\x8D\x03\x02\x02\x02\x1A\x8F",
    "\x03\x02\x02\x02\x1C\x91\x03\x02\x02\x02\x1E\x99",
    '\x03\x02\x02\x02 !\x05\x04\x03\x02!"\x07\x02\x02',
    '\x03"\x03\x03\x02\x02\x02#$\b\x03\x01\x02$(\x05',
    `\x06\x04\x02%&	\x02\x02\x02&(\x05\x04\x03\r'#\x03`,
    "\x02\x02\x02'%\x03\x02\x02\x02(Q\x03\x02\x02\x02",
    `)*\x02\x02*+	\x03\x02\x02+P\x05\x04\x03\r,-`,
    `\x02\x02-.	\x04\x02\x02.P\x05\x04\x03/0
\x02`,
    `\x0201\x07\r\x02\x021P\x05\x04\x0323	\x02\x02`,
    `34	\x05\x02\x024P\x05\x04\x03
56\x07\x02\x026`,
    "7\t\x06\x02\x027P\x05\x04\x03\b89\f\x06\x02\x029:",
    "\t\x07\x02\x02:P\x05\x04\x03\x07;<\f\x05\x02\x02",
    "<=\x07\x1A\x02\x02=P\x05\x04\x03\x06>?\f\x04\x02",
    "\x02?@\t\b\x02\x02@P\x05\x04\x03\x05AB\f\x03\x02\x02",
    "BC\x07\x1D\x02\x02CP\x05\x04\x03\x04DE\f\x0F\x02",
    "\x02EF\x07\x03\x02\x02FP\x05\f\x07\x02GH\f\x0E\x02",
    "\x02HI\x07\x04\x02\x02IJ\x05\x04\x03\x02JK\x07\x05",
    "\x02\x02KP\x03\x02\x02\x02LM\f\b\x02\x02MN\t\t\x02",
    "\x02NP\x05\x1A\x0E\x02O)\x03\x02\x02\x02O,\x03\x02",
    "\x02\x02O/\x03\x02\x02\x02O2\x03\x02\x02\x02O5\x03",
    "\x02\x02\x02O8\x03\x02\x02\x02O;\x03\x02\x02\x02",
    "O>\x03\x02\x02\x02OA\x03\x02\x02\x02OD\x03\x02\x02",
    "\x02OG\x03\x02\x02\x02OL\x03\x02\x02\x02PS\x03\x02",
    "\x02\x02QO\x03\x02\x02\x02QR\x03\x02\x02\x02R\x05",
    "\x03\x02\x02\x02SQ\x03\x02\x02\x02T\\\x05\f\x07",
    `\x02U\\\x05\x05\x02V\\\x05
\x06\x02WX\x07\x1E\x02`,
    "\x02XY\x05\x04\x03\x02YZ\x07\x1F\x02\x02Z\\\x03",
    "\x02\x02\x02[T\x03\x02\x02\x02[U\x03\x02\x02\x02",
    "[V\x03\x02\x02\x02[W\x03\x02\x02\x02\\\x07\x03\x02",
    `\x02\x02]^\x07 \x02\x02^f\x07!\x02\x02_f	
\x02\x02`,
    "`f\x07=\x02\x02af\x07>\x02\x02bf\x079\x02\x02cf\x07",
    `:\x02\x02df\x05\x12
\x02e]\x03\x02\x02\x02e_\x03`,
    "\x02\x02\x02e`\x03\x02\x02\x02ea\x03\x02\x02\x02",
    "eb\x03\x02\x02\x02ec\x03\x02\x02\x02ed\x03\x02\x02",
    "\x02f\t\x03\x02\x02\x02gj\x07$\x02\x02hk\x05\x1E",
    "\x10\x02ik\x07=\x02\x02jh\x03\x02\x02\x02ji\x03",
    "\x02\x02\x02k\v\x03\x02\x02\x02lr\x05\x1E\x10",
    "\x02mr\x05\x0E\b\x02nr\x07%\x02\x02or\x07&\x02\x02",
    "pr\x07'\x02\x02ql\x03\x02\x02\x02qm\x03\x02\x02",
    "\x02qn\x03\x02\x02\x02qo\x03\x02\x02\x02qp\x03\x02",
    `\x02\x02r\r\x03\x02\x02\x02st\x05\x1E\x10\x02tv`,
    "\x07\x1E\x02\x02uw\x05\x10\t\x02vu\x03\x02\x02\x02",
    "vw\x03\x02\x02\x02wx\x03\x02\x02\x02xy\x07\x1F\x02",
    "\x02y\x0F\x03\x02\x02\x02z\x7F\x05\x04\x03\x02",
    "{|\x07(\x02\x02|~\x05\x04\x03\x02}{\x03\x02\x02",
    "\x02~\x81\x03\x02\x02\x02\x7F}\x03\x02\x02\x02",
    "\x7F\x80\x03\x02\x02\x02\x80\x11\x03\x02\x02\x02",
    "\x81\x7F\x03\x02\x02\x02\x82\x84\x07>\x02\x02",
    "\x83\x85\x05\x14\v\x02\x84\x83\x03\x02\x02\x02",
    "\x84\x85\x03\x02\x02\x02\x85\x13\x03\x02\x02\x02",
    `\x86\x8A\x05\x16\x02\x87\x8A\x05\x18\r\x02\x88`,
    "\x8A\x07=\x02\x02\x89\x86\x03\x02\x02\x02\x89",
    "\x87\x03\x02\x02\x02\x89\x88\x03\x02\x02\x02\x8A",
    "\x15\x03\x02\x02\x02\x8B\x8C\t\v\x02\x02\x8C",
    "\x17\x03\x02\x02\x02\x8D\x8E\t\f\x02\x02\x8E\x19",
    "\x03\x02\x02\x02\x8F\x90\x05\x1C\x0F\x02\x90\x1B",
    "\x03\x02\x02\x02\x91\x96\x05\x1E\x10\x02\x92\x93",
    "\x07\x03\x02\x02\x93\x95\x05\x1E\x10\x02\x94\x92",
    "\x03\x02\x02\x02\x95\x98\x03\x02\x02\x02\x96\x94",
    "\x03\x02\x02\x02\x96\x97\x03\x02\x02\x02\x97\x1D",
    "\x03\x02\x02\x02\x98\x96\x03\x02\x02\x02\x99\x9A",
    `	\r\x02\x02\x9A\x1F\x03\x02\x02\x02\x0E'OQ[ejqv`,
    "\x7F\x84\x89\x96"
  ].join("");
  var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);
  var decisionsToDFA = atn.decisionToState.map((ds, index) => new antlr4.dfa.DFA(ds, index));
  var sharedContextCache = new antlr4.PredictionContextCache;

  class FHIRPathParser extends antlr4.Parser {
    static grammarFileName = "FHIRPath.g4";
    static literalNames = [
      null,
      "'.'",
      "'['",
      "']'",
      "'+'",
      "'-'",
      "'*'",
      "'/'",
      "'div'",
      "'mod'",
      "'&'",
      "'|'",
      "'<='",
      "'<'",
      "'>'",
      "'>='",
      "'is'",
      "'as'",
      "'='",
      "'~'",
      "'!='",
      "'!~'",
      "'in'",
      "'contains'",
      "'and'",
      "'or'",
      "'xor'",
      "'implies'",
      "'('",
      "')'",
      "'{'",
      "'}'",
      "'true'",
      "'false'",
      "'%'",
      "'$this'",
      "'$index'",
      "'$total'",
      "','",
      "'year'",
      "'month'",
      "'week'",
      "'day'",
      "'hour'",
      "'minute'",
      "'second'",
      "'millisecond'",
      "'years'",
      "'months'",
      "'weeks'",
      "'days'",
      "'hours'",
      "'minutes'",
      "'seconds'",
      "'milliseconds'"
    ];
    static symbolicNames = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "DATETIME",
      "TIME",
      "IDENTIFIER",
      "DELIMITEDIDENTIFIER",
      "STRING",
      "NUMBER",
      "WS",
      "COMMENT",
      "LINE_COMMENT"
    ];
    static ruleNames = [
      "entireExpression",
      "expression",
      "term",
      "literal",
      "externalConstant",
      "invocation",
      "functn",
      "paramList",
      "quantity",
      "unit",
      "dateTimePrecision",
      "pluralDateTimePrecision",
      "typeSpecifier",
      "qualifiedIdentifier",
      "identifier"
    ];
    constructor(input) {
      super(input);
      this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
      this.ruleNames = FHIRPathParser.ruleNames;
      this.literalNames = FHIRPathParser.literalNames;
      this.symbolicNames = FHIRPathParser.symbolicNames;
    }
    get atn() {
      return atn;
    }
    sempred(localctx, ruleIndex, predIndex) {
      switch (ruleIndex) {
        case 1:
          return this.expression_sempred(localctx, predIndex);
        default:
          throw "No predicate with index:" + ruleIndex;
      }
    }
    expression_sempred(localctx, predIndex) {
      switch (predIndex) {
        case 0:
          return this.precpred(this._ctx, 10);
        case 1:
          return this.precpred(this._ctx, 9);
        case 2:
          return this.precpred(this._ctx, 8);
        case 3:
          return this.precpred(this._ctx, 7);
        case 4:
          return this.precpred(this._ctx, 5);
        case 5:
          return this.precpred(this._ctx, 4);
        case 6:
          return this.precpred(this._ctx, 3);
        case 7:
          return this.precpred(this._ctx, 2);
        case 8:
          return this.precpred(this._ctx, 1);
        case 9:
          return this.precpred(this._ctx, 13);
        case 10:
          return this.precpred(this._ctx, 12);
        case 11:
          return this.precpred(this._ctx, 6);
        default:
          throw "No predicate with index:" + predIndex;
      }
    }
    entireExpression() {
      let localctx = new EntireExpressionContext(this, this._ctx, this.state);
      this.enterRule(localctx, 0, FHIRPathParser.RULE_entireExpression);
      try {
        this.enterOuterAlt(localctx, 1);
        this.state = 30;
        this.expression(0);
        this.state = 31;
        this.match(FHIRPathParser.EOF);
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
    expression(_p) {
      if (_p === undefined) {
        _p = 0;
      }
      const _parentctx = this._ctx;
      const _parentState = this.state;
      let localctx = new ExpressionContext(this, this._ctx, _parentState);
      let _prevctx = localctx;
      const _startState = 2;
      this.enterRecursionRule(localctx, 2, FHIRPathParser.RULE_expression, _p);
      var _la = 0;
      try {
        this.enterOuterAlt(localctx, 1);
        this.state = 37;
        this._errHandler.sync(this);
        switch (this._input.LA(1)) {
          case FHIRPathParser.T__15:
          case FHIRPathParser.T__16:
          case FHIRPathParser.T__21:
          case FHIRPathParser.T__22:
          case FHIRPathParser.T__27:
          case FHIRPathParser.T__29:
          case FHIRPathParser.T__31:
          case FHIRPathParser.T__32:
          case FHIRPathParser.T__33:
          case FHIRPathParser.T__34:
          case FHIRPathParser.T__35:
          case FHIRPathParser.T__36:
          case FHIRPathParser.DATETIME:
          case FHIRPathParser.TIME:
          case FHIRPathParser.IDENTIFIER:
          case FHIRPathParser.DELIMITEDIDENTIFIER:
          case FHIRPathParser.STRING:
          case FHIRPathParser.NUMBER:
            localctx = new TermExpressionContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 34;
            this.term();
            break;
          case FHIRPathParser.T__3:
          case FHIRPathParser.T__4:
            localctx = new PolarityExpressionContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 35;
            _la = this._input.LA(1);
            if (!(_la === FHIRPathParser.T__3 || _la === FHIRPathParser.T__4)) {
              this._errHandler.recoverInline(this);
            } else {
              this._errHandler.reportMatch(this);
              this.consume();
            }
            this.state = 36;
            this.expression(11);
            break;
          default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 79;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input, 2, this._ctx);
        while (_alt != 2 && _alt != antlr4.atn.ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            if (this._parseListeners !== null) {
              this.triggerExitRuleEvent();
            }
            _prevctx = localctx;
            this.state = 77;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input, 1, this._ctx);
            switch (la_) {
              case 1:
                localctx = new MultiplicativeExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, FHIRPathParser.RULE_expression);
                this.state = 39;
                if (!this.precpred(this._ctx, 10)) {
                  throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 10)");
                }
                this.state = 40;
                _la = this._input.LA(1);
                if (!((_la & ~31) == 0 && (1 << _la & (1 << FHIRPathParser.T__5 | 1 << FHIRPathParser.T__6 | 1 << FHIRPathParser.T__7 | 1 << FHIRPathParser.T__8)) !== 0)) {
                  this._errHandler.recoverInline(this);
                } else {
                  this._errHandler.reportMatch(this);
                  this.consume();
                }
                this.state = 41;
                this.expression(11);
                break;
              case 2:
                localctx = new AdditiveExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, FHIRPathParser.RULE_expression);
                this.state = 42;
                if (!this.precpred(this._ctx, 9)) {
                  throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 9)");
                }
                this.state = 43;
                _la = this._input.LA(1);
                if (!((_la & ~31) == 0 && (1 << _la & (1 << FHIRPathParser.T__3 | 1 << FHIRPathParser.T__4 | 1 << FHIRPathParser.T__9)) !== 0)) {
                  this._errHandler.recoverInline(this);
                } else {
                  this._errHandler.reportMatch(this);
                  this.consume();
                }
                this.state = 44;
                this.expression(10);
                break;
              case 3:
                localctx = new UnionExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, FHIRPathParser.RULE_expression);
                this.state = 45;
                if (!this.precpred(this._ctx, 8)) {
                  throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
                }
                this.state = 46;
                this.match(FHIRPathParser.T__10);
                this.state = 47;
                this.expression(9);
                break;
              case 4:
                localctx = new InequalityExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, FHIRPathParser.RULE_expression);
                this.state = 48;
                if (!this.precpred(this._ctx, 7)) {
                  throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 7)");
                }
                this.state = 49;
                _la = this._input.LA(1);
                if (!((_la & ~31) == 0 && (1 << _la & (1 << FHIRPathParser.T__11 | 1 << FHIRPathParser.T__12 | 1 << FHIRPathParser.T__13 | 1 << FHIRPathParser.T__14)) !== 0)) {
                  this._errHandler.recoverInline(this);
                } else {
                  this._errHandler.reportMatch(this);
                  this.consume();
                }
                this.state = 50;
                this.expression(8);
                break;
              case 5:
                localctx = new EqualityExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, FHIRPathParser.RULE_expression);
                this.state = 51;
                if (!this.precpred(this._ctx, 5)) {
                  throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                }
                this.state = 52;
                _la = this._input.LA(1);
                if (!((_la & ~31) == 0 && (1 << _la & (1 << FHIRPathParser.T__17 | 1 << FHIRPathParser.T__18 | 1 << FHIRPathParser.T__19 | 1 << FHIRPathParser.T__20)) !== 0)) {
                  this._errHandler.recoverInline(this);
                } else {
                  this._errHandler.reportMatch(this);
                  this.consume();
                }
                this.state = 53;
                this.expression(6);
                break;
              case 6:
                localctx = new MembershipExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, FHIRPathParser.RULE_expression);
                this.state = 54;
                if (!this.precpred(this._ctx, 4)) {
                  throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                }
                this.state = 55;
                _la = this._input.LA(1);
                if (!(_la === FHIRPathParser.T__21 || _la === FHIRPathParser.T__22)) {
                  this._errHandler.recoverInline(this);
                } else {
                  this._errHandler.reportMatch(this);
                  this.consume();
                }
                this.state = 56;
                this.expression(5);
                break;
              case 7:
                localctx = new AndExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, FHIRPathParser.RULE_expression);
                this.state = 57;
                if (!this.precpred(this._ctx, 3)) {
                  throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                }
                this.state = 58;
                this.match(FHIRPathParser.T__23);
                this.state = 59;
                this.expression(4);
                break;
              case 8:
                localctx = new OrExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, FHIRPathParser.RULE_expression);
                this.state = 60;
                if (!this.precpred(this._ctx, 2)) {
                  throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
                }
                this.state = 61;
                _la = this._input.LA(1);
                if (!(_la === FHIRPathParser.T__24 || _la === FHIRPathParser.T__25)) {
                  this._errHandler.recoverInline(this);
                } else {
                  this._errHandler.reportMatch(this);
                  this.consume();
                }
                this.state = 62;
                this.expression(3);
                break;
              case 9:
                localctx = new ImpliesExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, FHIRPathParser.RULE_expression);
                this.state = 63;
                if (!this.precpred(this._ctx, 1)) {
                  throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                }
                this.state = 64;
                this.match(FHIRPathParser.T__26);
                this.state = 65;
                this.expression(2);
                break;
              case 10:
                localctx = new InvocationExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, FHIRPathParser.RULE_expression);
                this.state = 66;
                if (!this.precpred(this._ctx, 13)) {
                  throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 13)");
                }
                this.state = 67;
                this.match(FHIRPathParser.T__0);
                this.state = 68;
                this.invocation();
                break;
              case 11:
                localctx = new IndexerExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, FHIRPathParser.RULE_expression);
                this.state = 69;
                if (!this.precpred(this._ctx, 12)) {
                  throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 12)");
                }
                this.state = 70;
                this.match(FHIRPathParser.T__1);
                this.state = 71;
                this.expression(0);
                this.state = 72;
                this.match(FHIRPathParser.T__2);
                break;
              case 12:
                localctx = new TypeExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, FHIRPathParser.RULE_expression);
                this.state = 74;
                if (!this.precpred(this._ctx, 6)) {
                  throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
                }
                this.state = 75;
                _la = this._input.LA(1);
                if (!(_la === FHIRPathParser.T__15 || _la === FHIRPathParser.T__16)) {
                  this._errHandler.recoverInline(this);
                } else {
                  this._errHandler.reportMatch(this);
                  this.consume();
                }
                this.state = 76;
                this.typeSpecifier();
                break;
            }
          }
          this.state = 81;
          this._errHandler.sync(this);
          _alt = this._interp.adaptivePredict(this._input, 2, this._ctx);
        }
      } catch (error) {
        if (error instanceof antlr4.error.RecognitionException) {
          localctx.exception = error;
          this._errHandler.reportError(this, error);
          this._errHandler.recover(this, error);
        } else {
          throw error;
        }
      } finally {
        this.unrollRecursionContexts(_parentctx);
      }
      return localctx;
    }
    term() {
      let localctx = new TermContext(this, this._ctx, this.state);
      this.enterRule(localctx, 4, FHIRPathParser.RULE_term);
      try {
        this.state = 89;
        this._errHandler.sync(this);
        switch (this._input.LA(1)) {
          case FHIRPathParser.T__15:
          case FHIRPathParser.T__16:
          case FHIRPathParser.T__21:
          case FHIRPathParser.T__22:
          case FHIRPathParser.T__34:
          case FHIRPathParser.T__35:
          case FHIRPathParser.T__36:
          case FHIRPathParser.IDENTIFIER:
          case FHIRPathParser.DELIMITEDIDENTIFIER:
            localctx = new InvocationTermContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 82;
            this.invocation();
            break;
          case FHIRPathParser.T__29:
          case FHIRPathParser.T__31:
          case FHIRPathParser.T__32:
          case FHIRPathParser.DATETIME:
          case FHIRPathParser.TIME:
          case FHIRPathParser.STRING:
          case FHIRPathParser.NUMBER:
            localctx = new LiteralTermContext(this, localctx);
            this.enterOuterAlt(localctx, 2);
            this.state = 83;
            this.literal();
            break;
          case FHIRPathParser.T__33:
            localctx = new ExternalConstantTermContext(this, localctx);
            this.enterOuterAlt(localctx, 3);
            this.state = 84;
            this.externalConstant();
            break;
          case FHIRPathParser.T__27:
            localctx = new ParenthesizedTermContext(this, localctx);
            this.enterOuterAlt(localctx, 4);
            this.state = 85;
            this.match(FHIRPathParser.T__27);
            this.state = 86;
            this.expression(0);
            this.state = 87;
            this.match(FHIRPathParser.T__28);
            break;
          default:
            throw new antlr4.error.NoViableAltException(this);
        }
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
    literal() {
      let localctx = new LiteralContext(this, this._ctx, this.state);
      this.enterRule(localctx, 6, FHIRPathParser.RULE_literal);
      var _la = 0;
      try {
        this.state = 99;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input, 4, this._ctx);
        switch (la_) {
          case 1:
            localctx = new NullLiteralContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 91;
            this.match(FHIRPathParser.T__29);
            this.state = 92;
            this.match(FHIRPathParser.T__30);
            break;
          case 2:
            localctx = new BooleanLiteralContext(this, localctx);
            this.enterOuterAlt(localctx, 2);
            this.state = 93;
            _la = this._input.LA(1);
            if (!(_la === FHIRPathParser.T__31 || _la === FHIRPathParser.T__32)) {
              this._errHandler.recoverInline(this);
            } else {
              this._errHandler.reportMatch(this);
              this.consume();
            }
            break;
          case 3:
            localctx = new StringLiteralContext(this, localctx);
            this.enterOuterAlt(localctx, 3);
            this.state = 94;
            this.match(FHIRPathParser.STRING);
            break;
          case 4:
            localctx = new NumberLiteralContext(this, localctx);
            this.enterOuterAlt(localctx, 4);
            this.state = 95;
            this.match(FHIRPathParser.NUMBER);
            break;
          case 5:
            localctx = new DateTimeLiteralContext(this, localctx);
            this.enterOuterAlt(localctx, 5);
            this.state = 96;
            this.match(FHIRPathParser.DATETIME);
            break;
          case 6:
            localctx = new TimeLiteralContext(this, localctx);
            this.enterOuterAlt(localctx, 6);
            this.state = 97;
            this.match(FHIRPathParser.TIME);
            break;
          case 7:
            localctx = new QuantityLiteralContext(this, localctx);
            this.enterOuterAlt(localctx, 7);
            this.state = 98;
            this.quantity();
            break;
        }
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
    externalConstant() {
      let localctx = new ExternalConstantContext(this, this._ctx, this.state);
      this.enterRule(localctx, 8, FHIRPathParser.RULE_externalConstant);
      try {
        this.enterOuterAlt(localctx, 1);
        this.state = 101;
        this.match(FHIRPathParser.T__33);
        this.state = 104;
        this._errHandler.sync(this);
        switch (this._input.LA(1)) {
          case FHIRPathParser.T__15:
          case FHIRPathParser.T__16:
          case FHIRPathParser.T__21:
          case FHIRPathParser.T__22:
          case FHIRPathParser.IDENTIFIER:
          case FHIRPathParser.DELIMITEDIDENTIFIER:
            this.state = 102;
            this.identifier();
            break;
          case FHIRPathParser.STRING:
            this.state = 103;
            this.match(FHIRPathParser.STRING);
            break;
          default:
            throw new antlr4.error.NoViableAltException(this);
        }
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
    invocation() {
      let localctx = new InvocationContext(this, this._ctx, this.state);
      this.enterRule(localctx, 10, FHIRPathParser.RULE_invocation);
      try {
        this.state = 111;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input, 6, this._ctx);
        switch (la_) {
          case 1:
            localctx = new MemberInvocationContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 106;
            this.identifier();
            break;
          case 2:
            localctx = new FunctionInvocationContext(this, localctx);
            this.enterOuterAlt(localctx, 2);
            this.state = 107;
            this.functn();
            break;
          case 3:
            localctx = new ThisInvocationContext(this, localctx);
            this.enterOuterAlt(localctx, 3);
            this.state = 108;
            this.match(FHIRPathParser.T__34);
            break;
          case 4:
            localctx = new IndexInvocationContext(this, localctx);
            this.enterOuterAlt(localctx, 4);
            this.state = 109;
            this.match(FHIRPathParser.T__35);
            break;
          case 5:
            localctx = new TotalInvocationContext(this, localctx);
            this.enterOuterAlt(localctx, 5);
            this.state = 110;
            this.match(FHIRPathParser.T__36);
            break;
        }
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
    functn() {
      let localctx = new FunctnContext(this, this._ctx, this.state);
      this.enterRule(localctx, 12, FHIRPathParser.RULE_functn);
      var _la = 0;
      try {
        this.enterOuterAlt(localctx, 1);
        this.state = 113;
        this.identifier();
        this.state = 114;
        this.match(FHIRPathParser.T__27);
        this.state = 116;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if ((_la & ~31) == 0 && (1 << _la & (1 << FHIRPathParser.T__3 | 1 << FHIRPathParser.T__4 | 1 << FHIRPathParser.T__15 | 1 << FHIRPathParser.T__16 | 1 << FHIRPathParser.T__21 | 1 << FHIRPathParser.T__22 | 1 << FHIRPathParser.T__27 | 1 << FHIRPathParser.T__29)) !== 0 || (_la - 32 & ~31) == 0 && (1 << _la - 32 & (1 << FHIRPathParser.T__31 - 32 | 1 << FHIRPathParser.T__32 - 32 | 1 << FHIRPathParser.T__33 - 32 | 1 << FHIRPathParser.T__34 - 32 | 1 << FHIRPathParser.T__35 - 32 | 1 << FHIRPathParser.T__36 - 32 | 1 << FHIRPathParser.DATETIME - 32 | 1 << FHIRPathParser.TIME - 32 | 1 << FHIRPathParser.IDENTIFIER - 32 | 1 << FHIRPathParser.DELIMITEDIDENTIFIER - 32 | 1 << FHIRPathParser.STRING - 32 | 1 << FHIRPathParser.NUMBER - 32)) !== 0) {
          this.state = 115;
          this.paramList();
        }
        this.state = 118;
        this.match(FHIRPathParser.T__28);
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
    paramList() {
      let localctx = new ParamListContext(this, this._ctx, this.state);
      this.enterRule(localctx, 14, FHIRPathParser.RULE_paramList);
      var _la = 0;
      try {
        this.enterOuterAlt(localctx, 1);
        this.state = 120;
        this.expression(0);
        this.state = 125;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while (_la === FHIRPathParser.T__37) {
          this.state = 121;
          this.match(FHIRPathParser.T__37);
          this.state = 122;
          this.expression(0);
          this.state = 127;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
        }
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
    quantity() {
      let localctx = new QuantityContext(this, this._ctx, this.state);
      this.enterRule(localctx, 16, FHIRPathParser.RULE_quantity);
      try {
        this.enterOuterAlt(localctx, 1);
        this.state = 128;
        this.match(FHIRPathParser.NUMBER);
        this.state = 130;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input, 9, this._ctx);
        if (la_ === 1) {
          this.state = 129;
          this.unit();
        }
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
    unit() {
      let localctx = new UnitContext(this, this._ctx, this.state);
      this.enterRule(localctx, 18, FHIRPathParser.RULE_unit);
      try {
        this.state = 135;
        this._errHandler.sync(this);
        switch (this._input.LA(1)) {
          case FHIRPathParser.T__38:
          case FHIRPathParser.T__39:
          case FHIRPathParser.T__40:
          case FHIRPathParser.T__41:
          case FHIRPathParser.T__42:
          case FHIRPathParser.T__43:
          case FHIRPathParser.T__44:
          case FHIRPathParser.T__45:
            this.enterOuterAlt(localctx, 1);
            this.state = 132;
            this.dateTimePrecision();
            break;
          case FHIRPathParser.T__46:
          case FHIRPathParser.T__47:
          case FHIRPathParser.T__48:
          case FHIRPathParser.T__49:
          case FHIRPathParser.T__50:
          case FHIRPathParser.T__51:
          case FHIRPathParser.T__52:
          case FHIRPathParser.T__53:
            this.enterOuterAlt(localctx, 2);
            this.state = 133;
            this.pluralDateTimePrecision();
            break;
          case FHIRPathParser.STRING:
            this.enterOuterAlt(localctx, 3);
            this.state = 134;
            this.match(FHIRPathParser.STRING);
            break;
          default:
            throw new antlr4.error.NoViableAltException(this);
        }
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
    dateTimePrecision() {
      let localctx = new DateTimePrecisionContext(this, this._ctx, this.state);
      this.enterRule(localctx, 20, FHIRPathParser.RULE_dateTimePrecision);
      var _la = 0;
      try {
        this.enterOuterAlt(localctx, 1);
        this.state = 137;
        _la = this._input.LA(1);
        if (!((_la - 39 & ~31) == 0 && (1 << _la - 39 & (1 << FHIRPathParser.T__38 - 39 | 1 << FHIRPathParser.T__39 - 39 | 1 << FHIRPathParser.T__40 - 39 | 1 << FHIRPathParser.T__41 - 39 | 1 << FHIRPathParser.T__42 - 39 | 1 << FHIRPathParser.T__43 - 39 | 1 << FHIRPathParser.T__44 - 39 | 1 << FHIRPathParser.T__45 - 39)) !== 0)) {
          this._errHandler.recoverInline(this);
        } else {
          this._errHandler.reportMatch(this);
          this.consume();
        }
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
    pluralDateTimePrecision() {
      let localctx = new PluralDateTimePrecisionContext(this, this._ctx, this.state);
      this.enterRule(localctx, 22, FHIRPathParser.RULE_pluralDateTimePrecision);
      var _la = 0;
      try {
        this.enterOuterAlt(localctx, 1);
        this.state = 139;
        _la = this._input.LA(1);
        if (!((_la - 47 & ~31) == 0 && (1 << _la - 47 & (1 << FHIRPathParser.T__46 - 47 | 1 << FHIRPathParser.T__47 - 47 | 1 << FHIRPathParser.T__48 - 47 | 1 << FHIRPathParser.T__49 - 47 | 1 << FHIRPathParser.T__50 - 47 | 1 << FHIRPathParser.T__51 - 47 | 1 << FHIRPathParser.T__52 - 47 | 1 << FHIRPathParser.T__53 - 47)) !== 0)) {
          this._errHandler.recoverInline(this);
        } else {
          this._errHandler.reportMatch(this);
          this.consume();
        }
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
    typeSpecifier() {
      let localctx = new TypeSpecifierContext(this, this._ctx, this.state);
      this.enterRule(localctx, 24, FHIRPathParser.RULE_typeSpecifier);
      try {
        this.enterOuterAlt(localctx, 1);
        this.state = 141;
        this.qualifiedIdentifier();
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
    qualifiedIdentifier() {
      let localctx = new QualifiedIdentifierContext(this, this._ctx, this.state);
      this.enterRule(localctx, 26, FHIRPathParser.RULE_qualifiedIdentifier);
      try {
        this.enterOuterAlt(localctx, 1);
        this.state = 143;
        this.identifier();
        this.state = 148;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input, 11, this._ctx);
        while (_alt != 2 && _alt != antlr4.atn.ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            this.state = 144;
            this.match(FHIRPathParser.T__0);
            this.state = 145;
            this.identifier();
          }
          this.state = 150;
          this._errHandler.sync(this);
          _alt = this._interp.adaptivePredict(this._input, 11, this._ctx);
        }
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
    identifier() {
      let localctx = new IdentifierContext(this, this._ctx, this.state);
      this.enterRule(localctx, 28, FHIRPathParser.RULE_identifier);
      var _la = 0;
      try {
        this.enterOuterAlt(localctx, 1);
        this.state = 151;
        _la = this._input.LA(1);
        if (!((_la & ~31) == 0 && (1 << _la & (1 << FHIRPathParser.T__15 | 1 << FHIRPathParser.T__16 | 1 << FHIRPathParser.T__21 | 1 << FHIRPathParser.T__22)) !== 0 || _la === FHIRPathParser.IDENTIFIER || _la === FHIRPathParser.DELIMITEDIDENTIFIER)) {
          this._errHandler.recoverInline(this);
        } else {
          this._errHandler.reportMatch(this);
          this.consume();
        }
      } catch (re) {
        if (re instanceof antlr4.error.RecognitionException) {
          localctx.exception = re;
          this._errHandler.reportError(this, re);
          this._errHandler.recover(this, re);
        } else {
          throw re;
        }
      } finally {
        this.exitRule();
      }
      return localctx;
    }
  }
  FHIRPathParser.EOF = antlr4.Token.EOF;
  FHIRPathParser.T__0 = 1;
  FHIRPathParser.T__1 = 2;
  FHIRPathParser.T__2 = 3;
  FHIRPathParser.T__3 = 4;
  FHIRPathParser.T__4 = 5;
  FHIRPathParser.T__5 = 6;
  FHIRPathParser.T__6 = 7;
  FHIRPathParser.T__7 = 8;
  FHIRPathParser.T__8 = 9;
  FHIRPathParser.T__9 = 10;
  FHIRPathParser.T__10 = 11;
  FHIRPathParser.T__11 = 12;
  FHIRPathParser.T__12 = 13;
  FHIRPathParser.T__13 = 14;
  FHIRPathParser.T__14 = 15;
  FHIRPathParser.T__15 = 16;
  FHIRPathParser.T__16 = 17;
  FHIRPathParser.T__17 = 18;
  FHIRPathParser.T__18 = 19;
  FHIRPathParser.T__19 = 20;
  FHIRPathParser.T__20 = 21;
  FHIRPathParser.T__21 = 22;
  FHIRPathParser.T__22 = 23;
  FHIRPathParser.T__23 = 24;
  FHIRPathParser.T__24 = 25;
  FHIRPathParser.T__25 = 26;
  FHIRPathParser.T__26 = 27;
  FHIRPathParser.T__27 = 28;
  FHIRPathParser.T__28 = 29;
  FHIRPathParser.T__29 = 30;
  FHIRPathParser.T__30 = 31;
  FHIRPathParser.T__31 = 32;
  FHIRPathParser.T__32 = 33;
  FHIRPathParser.T__33 = 34;
  FHIRPathParser.T__34 = 35;
  FHIRPathParser.T__35 = 36;
  FHIRPathParser.T__36 = 37;
  FHIRPathParser.T__37 = 38;
  FHIRPathParser.T__38 = 39;
  FHIRPathParser.T__39 = 40;
  FHIRPathParser.T__40 = 41;
  FHIRPathParser.T__41 = 42;
  FHIRPathParser.T__42 = 43;
  FHIRPathParser.T__43 = 44;
  FHIRPathParser.T__44 = 45;
  FHIRPathParser.T__45 = 46;
  FHIRPathParser.T__46 = 47;
  FHIRPathParser.T__47 = 48;
  FHIRPathParser.T__48 = 49;
  FHIRPathParser.T__49 = 50;
  FHIRPathParser.T__50 = 51;
  FHIRPathParser.T__51 = 52;
  FHIRPathParser.T__52 = 53;
  FHIRPathParser.T__53 = 54;
  FHIRPathParser.DATETIME = 55;
  FHIRPathParser.TIME = 56;
  FHIRPathParser.IDENTIFIER = 57;
  FHIRPathParser.DELIMITEDIDENTIFIER = 58;
  FHIRPathParser.STRING = 59;
  FHIRPathParser.NUMBER = 60;
  FHIRPathParser.WS = 61;
  FHIRPathParser.COMMENT = 62;
  FHIRPathParser.LINE_COMMENT = 63;
  FHIRPathParser.RULE_entireExpression = 0;
  FHIRPathParser.RULE_expression = 1;
  FHIRPathParser.RULE_term = 2;
  FHIRPathParser.RULE_literal = 3;
  FHIRPathParser.RULE_externalConstant = 4;
  FHIRPathParser.RULE_invocation = 5;
  FHIRPathParser.RULE_functn = 6;
  FHIRPathParser.RULE_paramList = 7;
  FHIRPathParser.RULE_quantity = 8;
  FHIRPathParser.RULE_unit = 9;
  FHIRPathParser.RULE_dateTimePrecision = 10;
  FHIRPathParser.RULE_pluralDateTimePrecision = 11;
  FHIRPathParser.RULE_typeSpecifier = 12;
  FHIRPathParser.RULE_qualifiedIdentifier = 13;
  FHIRPathParser.RULE_identifier = 14;

  class EntireExpressionContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_entireExpression;
    }
    expression() {
      return this.getTypedRuleContext(ExpressionContext, 0);
    }
    EOF() {
      return this.getToken(FHIRPathParser.EOF, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterEntireExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitEntireExpression(this);
      }
    }
  }

  class ExpressionContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_expression;
    }
    copyFrom(ctx) {
      super.copyFrom(ctx);
    }
  }

  class IndexerExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression = function(i) {
      if (i === undefined) {
        i = null;
      }
      if (i === null) {
        return this.getTypedRuleContexts(ExpressionContext);
      } else {
        return this.getTypedRuleContext(ExpressionContext, i);
      }
    };
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterIndexerExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitIndexerExpression(this);
      }
    }
  }
  FHIRPathParser.IndexerExpressionContext = IndexerExpressionContext;

  class PolarityExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression() {
      return this.getTypedRuleContext(ExpressionContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterPolarityExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitPolarityExpression(this);
      }
    }
  }
  FHIRPathParser.PolarityExpressionContext = PolarityExpressionContext;

  class AdditiveExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression = function(i) {
      if (i === undefined) {
        i = null;
      }
      if (i === null) {
        return this.getTypedRuleContexts(ExpressionContext);
      } else {
        return this.getTypedRuleContext(ExpressionContext, i);
      }
    };
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterAdditiveExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitAdditiveExpression(this);
      }
    }
  }
  FHIRPathParser.AdditiveExpressionContext = AdditiveExpressionContext;

  class MultiplicativeExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression = function(i) {
      if (i === undefined) {
        i = null;
      }
      if (i === null) {
        return this.getTypedRuleContexts(ExpressionContext);
      } else {
        return this.getTypedRuleContext(ExpressionContext, i);
      }
    };
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterMultiplicativeExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitMultiplicativeExpression(this);
      }
    }
  }
  FHIRPathParser.MultiplicativeExpressionContext = MultiplicativeExpressionContext;

  class UnionExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression = function(i) {
      if (i === undefined) {
        i = null;
      }
      if (i === null) {
        return this.getTypedRuleContexts(ExpressionContext);
      } else {
        return this.getTypedRuleContext(ExpressionContext, i);
      }
    };
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterUnionExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitUnionExpression(this);
      }
    }
  }
  FHIRPathParser.UnionExpressionContext = UnionExpressionContext;

  class OrExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression = function(i) {
      if (i === undefined) {
        i = null;
      }
      if (i === null) {
        return this.getTypedRuleContexts(ExpressionContext);
      } else {
        return this.getTypedRuleContext(ExpressionContext, i);
      }
    };
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterOrExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitOrExpression(this);
      }
    }
  }
  FHIRPathParser.OrExpressionContext = OrExpressionContext;

  class AndExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression = function(i) {
      if (i === undefined) {
        i = null;
      }
      if (i === null) {
        return this.getTypedRuleContexts(ExpressionContext);
      } else {
        return this.getTypedRuleContext(ExpressionContext, i);
      }
    };
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterAndExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitAndExpression(this);
      }
    }
  }
  FHIRPathParser.AndExpressionContext = AndExpressionContext;

  class MembershipExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression = function(i) {
      if (i === undefined) {
        i = null;
      }
      if (i === null) {
        return this.getTypedRuleContexts(ExpressionContext);
      } else {
        return this.getTypedRuleContext(ExpressionContext, i);
      }
    };
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterMembershipExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitMembershipExpression(this);
      }
    }
  }
  FHIRPathParser.MembershipExpressionContext = MembershipExpressionContext;

  class InequalityExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression = function(i) {
      if (i === undefined) {
        i = null;
      }
      if (i === null) {
        return this.getTypedRuleContexts(ExpressionContext);
      } else {
        return this.getTypedRuleContext(ExpressionContext, i);
      }
    };
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterInequalityExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitInequalityExpression(this);
      }
    }
  }
  FHIRPathParser.InequalityExpressionContext = InequalityExpressionContext;

  class InvocationExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression() {
      return this.getTypedRuleContext(ExpressionContext, 0);
    }
    invocation() {
      return this.getTypedRuleContext(InvocationContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterInvocationExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitInvocationExpression(this);
      }
    }
  }
  FHIRPathParser.InvocationExpressionContext = InvocationExpressionContext;

  class EqualityExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression = function(i) {
      if (i === undefined) {
        i = null;
      }
      if (i === null) {
        return this.getTypedRuleContexts(ExpressionContext);
      } else {
        return this.getTypedRuleContext(ExpressionContext, i);
      }
    };
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterEqualityExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitEqualityExpression(this);
      }
    }
  }
  FHIRPathParser.EqualityExpressionContext = EqualityExpressionContext;

  class ImpliesExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression = function(i) {
      if (i === undefined) {
        i = null;
      }
      if (i === null) {
        return this.getTypedRuleContexts(ExpressionContext);
      } else {
        return this.getTypedRuleContext(ExpressionContext, i);
      }
    };
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterImpliesExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitImpliesExpression(this);
      }
    }
  }
  FHIRPathParser.ImpliesExpressionContext = ImpliesExpressionContext;

  class TermExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    term() {
      return this.getTypedRuleContext(TermContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterTermExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitTermExpression(this);
      }
    }
  }
  FHIRPathParser.TermExpressionContext = TermExpressionContext;

  class TypeExpressionContext extends ExpressionContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression() {
      return this.getTypedRuleContext(ExpressionContext, 0);
    }
    typeSpecifier() {
      return this.getTypedRuleContext(TypeSpecifierContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterTypeExpression(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitTypeExpression(this);
      }
    }
  }
  FHIRPathParser.TypeExpressionContext = TypeExpressionContext;

  class TermContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_term;
    }
    copyFrom(ctx) {
      super.copyFrom(ctx);
    }
  }

  class ExternalConstantTermContext extends TermContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    externalConstant() {
      return this.getTypedRuleContext(ExternalConstantContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterExternalConstantTerm(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitExternalConstantTerm(this);
      }
    }
  }
  FHIRPathParser.ExternalConstantTermContext = ExternalConstantTermContext;

  class LiteralTermContext extends TermContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    literal() {
      return this.getTypedRuleContext(LiteralContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterLiteralTerm(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitLiteralTerm(this);
      }
    }
  }
  FHIRPathParser.LiteralTermContext = LiteralTermContext;

  class ParenthesizedTermContext extends TermContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    expression() {
      return this.getTypedRuleContext(ExpressionContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterParenthesizedTerm(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitParenthesizedTerm(this);
      }
    }
  }
  FHIRPathParser.ParenthesizedTermContext = ParenthesizedTermContext;

  class InvocationTermContext extends TermContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    invocation() {
      return this.getTypedRuleContext(InvocationContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterInvocationTerm(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitInvocationTerm(this);
      }
    }
  }
  FHIRPathParser.InvocationTermContext = InvocationTermContext;

  class LiteralContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_literal;
    }
    copyFrom(ctx) {
      super.copyFrom(ctx);
    }
  }

  class TimeLiteralContext extends LiteralContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    TIME() {
      return this.getToken(FHIRPathParser.TIME, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterTimeLiteral(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitTimeLiteral(this);
      }
    }
  }
  FHIRPathParser.TimeLiteralContext = TimeLiteralContext;

  class NullLiteralContext extends LiteralContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterNullLiteral(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitNullLiteral(this);
      }
    }
  }
  FHIRPathParser.NullLiteralContext = NullLiteralContext;

  class DateTimeLiteralContext extends LiteralContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    DATETIME() {
      return this.getToken(FHIRPathParser.DATETIME, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterDateTimeLiteral(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitDateTimeLiteral(this);
      }
    }
  }
  FHIRPathParser.DateTimeLiteralContext = DateTimeLiteralContext;

  class StringLiteralContext extends LiteralContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    STRING() {
      return this.getToken(FHIRPathParser.STRING, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterStringLiteral(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitStringLiteral(this);
      }
    }
  }
  FHIRPathParser.StringLiteralContext = StringLiteralContext;

  class BooleanLiteralContext extends LiteralContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterBooleanLiteral(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitBooleanLiteral(this);
      }
    }
  }
  FHIRPathParser.BooleanLiteralContext = BooleanLiteralContext;

  class NumberLiteralContext extends LiteralContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    NUMBER() {
      return this.getToken(FHIRPathParser.NUMBER, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterNumberLiteral(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitNumberLiteral(this);
      }
    }
  }
  FHIRPathParser.NumberLiteralContext = NumberLiteralContext;

  class QuantityLiteralContext extends LiteralContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    quantity() {
      return this.getTypedRuleContext(QuantityContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterQuantityLiteral(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitQuantityLiteral(this);
      }
    }
  }
  FHIRPathParser.QuantityLiteralContext = QuantityLiteralContext;

  class ExternalConstantContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_externalConstant;
    }
    identifier() {
      return this.getTypedRuleContext(IdentifierContext, 0);
    }
    STRING() {
      return this.getToken(FHIRPathParser.STRING, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterExternalConstant(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitExternalConstant(this);
      }
    }
  }

  class InvocationContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_invocation;
    }
    copyFrom(ctx) {
      super.copyFrom(ctx);
    }
  }

  class TotalInvocationContext extends InvocationContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterTotalInvocation(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitTotalInvocation(this);
      }
    }
  }
  FHIRPathParser.TotalInvocationContext = TotalInvocationContext;

  class ThisInvocationContext extends InvocationContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterThisInvocation(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitThisInvocation(this);
      }
    }
  }
  FHIRPathParser.ThisInvocationContext = ThisInvocationContext;

  class IndexInvocationContext extends InvocationContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterIndexInvocation(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitIndexInvocation(this);
      }
    }
  }
  FHIRPathParser.IndexInvocationContext = IndexInvocationContext;

  class FunctionInvocationContext extends InvocationContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    functn() {
      return this.getTypedRuleContext(FunctnContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterFunctionInvocation(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitFunctionInvocation(this);
      }
    }
  }
  FHIRPathParser.FunctionInvocationContext = FunctionInvocationContext;

  class MemberInvocationContext extends InvocationContext {
    constructor(parser, ctx) {
      super(parser);
      super.copyFrom(ctx);
    }
    identifier() {
      return this.getTypedRuleContext(IdentifierContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterMemberInvocation(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitMemberInvocation(this);
      }
    }
  }
  FHIRPathParser.MemberInvocationContext = MemberInvocationContext;

  class FunctnContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_functn;
    }
    identifier() {
      return this.getTypedRuleContext(IdentifierContext, 0);
    }
    paramList() {
      return this.getTypedRuleContext(ParamListContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterFunctn(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitFunctn(this);
      }
    }
  }

  class ParamListContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_paramList;
    }
    expression = function(i) {
      if (i === undefined) {
        i = null;
      }
      if (i === null) {
        return this.getTypedRuleContexts(ExpressionContext);
      } else {
        return this.getTypedRuleContext(ExpressionContext, i);
      }
    };
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterParamList(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitParamList(this);
      }
    }
  }

  class QuantityContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_quantity;
    }
    NUMBER() {
      return this.getToken(FHIRPathParser.NUMBER, 0);
    }
    unit() {
      return this.getTypedRuleContext(UnitContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterQuantity(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitQuantity(this);
      }
    }
  }

  class UnitContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_unit;
    }
    dateTimePrecision() {
      return this.getTypedRuleContext(DateTimePrecisionContext, 0);
    }
    pluralDateTimePrecision() {
      return this.getTypedRuleContext(PluralDateTimePrecisionContext, 0);
    }
    STRING() {
      return this.getToken(FHIRPathParser.STRING, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterUnit(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitUnit(this);
      }
    }
  }

  class DateTimePrecisionContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_dateTimePrecision;
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterDateTimePrecision(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitDateTimePrecision(this);
      }
    }
  }

  class PluralDateTimePrecisionContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_pluralDateTimePrecision;
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterPluralDateTimePrecision(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitPluralDateTimePrecision(this);
      }
    }
  }

  class TypeSpecifierContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_typeSpecifier;
    }
    qualifiedIdentifier() {
      return this.getTypedRuleContext(QualifiedIdentifierContext, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterTypeSpecifier(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitTypeSpecifier(this);
      }
    }
  }

  class QualifiedIdentifierContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_qualifiedIdentifier;
    }
    identifier = function(i) {
      if (i === undefined) {
        i = null;
      }
      if (i === null) {
        return this.getTypedRuleContexts(IdentifierContext);
      } else {
        return this.getTypedRuleContext(IdentifierContext, i);
      }
    };
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterQualifiedIdentifier(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitQualifiedIdentifier(this);
      }
    }
  }

  class IdentifierContext extends antlr4.ParserRuleContext {
    constructor(parser, parent, invokingState) {
      if (parent === undefined) {
        parent = null;
      }
      if (invokingState === undefined || invokingState === null) {
        invokingState = -1;
      }
      super(parent, invokingState);
      this.parser = parser;
      this.ruleIndex = FHIRPathParser.RULE_identifier;
    }
    IDENTIFIER() {
      return this.getToken(FHIRPathParser.IDENTIFIER, 0);
    }
    DELIMITEDIDENTIFIER() {
      return this.getToken(FHIRPathParser.DELIMITEDIDENTIFIER, 0);
    }
    enterRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.enterIdentifier(this);
      }
    }
    exitRule(listener) {
      if (listener instanceof FHIRPathListener) {
        listener.exitIdentifier(this);
      }
    }
  }
  FHIRPathParser.EntireExpressionContext = EntireExpressionContext;
  FHIRPathParser.ExpressionContext = ExpressionContext;
  FHIRPathParser.TermContext = TermContext;
  FHIRPathParser.LiteralContext = LiteralContext;
  FHIRPathParser.ExternalConstantContext = ExternalConstantContext;
  FHIRPathParser.InvocationContext = InvocationContext;
  FHIRPathParser.FunctnContext = FunctnContext;
  FHIRPathParser.ParamListContext = ParamListContext;
  FHIRPathParser.QuantityContext = QuantityContext;
  FHIRPathParser.UnitContext = UnitContext;
  FHIRPathParser.DateTimePrecisionContext = DateTimePrecisionContext;
  FHIRPathParser.PluralDateTimePrecisionContext = PluralDateTimePrecisionContext;
  FHIRPathParser.TypeSpecifierContext = TypeSpecifierContext;
  FHIRPathParser.QualifiedIdentifierContext = QualifiedIdentifierContext;
  FHIRPathParser.IdentifierContext = IdentifierContext;
  module.exports = FHIRPathParser;
});

// src/parser/index.js
var require_parser = __commonJS((exports, module) => {
  var antlr4 = require_antlr4_index();
  var Lexer = require_FHIRPathLexer();
  var Parser = require_FHIRPathParser();
  var Listener = require_FHIRPathListener();

  class ErrorListener extends antlr4.error.ErrorListener {
    constructor(errors) {
      super();
      this.errors = errors;
    }
    syntaxError(rec, sym, line, col, msg, e) {
      this.errors.push([rec, sym, line, col, msg, e]);
    }
  }
  var parse = function(path) {
    var chars = new antlr4.InputStream(path);
    var lexer = new Lexer(chars);
    var tokens = new antlr4.CommonTokenStream(lexer);
    var parser = new Parser(tokens);
    parser.buildParseTrees = true;
    var errors = [];
    var listener = new ErrorListener(errors);
    lexer.removeErrorListeners();
    lexer.addErrorListener(listener);
    parser.removeErrorListeners();
    parser.addErrorListener(listener);
    var tree = parser.entireExpression();

    class PathListener extends Listener {
      constructor() {
        super();
      }
    }
    var ast = {};
    var node;
    var parentStack = [ast];
    for (let p of Object.getOwnPropertyNames(Listener.prototype)) {
      if (p.startsWith("enter")) {
        PathListener.prototype[p] = function(ctx) {
          let parentNode = parentStack[parentStack.length - 1];
          let nodeType = p.slice(5);
          node = { type: nodeType };
          node.text = ctx.getText();
          if (!parentNode.children)
            parentNode.children = [];
          parentNode.children.push(node);
          parentStack.push(node);
          node.terminalNodeText = [];
          for (let c of ctx.children) {
            if (c.symbol)
              node.terminalNodeText.push(c.getText());
          }
        };
      } else if (p.startsWith("exit")) {
        PathListener.prototype[p] = function() {
          parentStack.pop();
        };
      }
    }
    var printer = new PathListener;
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(printer, tree);
    if (errors.length > 0) {
      let errMsgs = [];
      for (let i = 0, len = errors.length;i < len; ++i) {
        let err = errors[i];
        let msg = "line: " + err[2] + "; column: " + err[3] + "; message: " + err[4];
        errMsgs.push(msg);
      }
      var e = new Error(errMsgs.join("\n"));
      e.errors = errors;
      throw e;
    }
    return ast;
  };
  module.exports = {
    parse
  };
});

// node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds/index.js
var require_getTimezoneOffsetInMilliseconds = __commonJS((exports, module) => {
  var MILLISECONDS_IN_MINUTE = 60000;
  module.exports = function getTimezoneOffsetInMilliseconds(dirtyDate) {
    var date = new Date(dirtyDate.getTime());
    var baseTimezoneOffset = date.getTimezoneOffset();
    date.setSeconds(0, 0);
    var millisecondsPartOfTimezoneOffset = date.getTime() % MILLISECONDS_IN_MINUTE;
    return baseTimezoneOffset * MILLISECONDS_IN_MINUTE + millisecondsPartOfTimezoneOffset;
  };
});

// node_modules/date-fns/is_date/index.js
var require_is_date = __commonJS((exports, module) => {
  var isDate = function(argument) {
    return argument instanceof Date;
  };
  module.exports = isDate;
});

// node_modules/date-fns/parse/index.js
var require_parse = __commonJS((exports, module) => {
  var parse = function(argument, dirtyOptions) {
    if (isDate(argument)) {
      return new Date(argument.getTime());
    } else if (typeof argument !== "string") {
      return new Date(argument);
    }
    var options = dirtyOptions || {};
    var additionalDigits = options.additionalDigits;
    if (additionalDigits == null) {
      additionalDigits = DEFAULT_ADDITIONAL_DIGITS;
    } else {
      additionalDigits = Number(additionalDigits);
    }
    var dateStrings = splitDateString(argument);
    var parseYearResult = parseYear(dateStrings.date, additionalDigits);
    var year = parseYearResult.year;
    var restDateString = parseYearResult.restDateString;
    var date = parseDate(restDateString, year);
    if (date) {
      var timestamp = date.getTime();
      var time = 0;
      var offset;
      if (dateStrings.time) {
        time = parseTime(dateStrings.time);
      }
      if (dateStrings.timezone) {
        offset = parseTimezone(dateStrings.timezone) * MILLISECONDS_IN_MINUTE;
      } else {
        var fullTime = timestamp + time;
        var fullTimeDate = new Date(fullTime);
        offset = getTimezoneOffsetInMilliseconds(fullTimeDate);
        var fullTimeDateNextDay = new Date(fullTime);
        fullTimeDateNextDay.setDate(fullTimeDate.getDate() + 1);
        var offsetDiff = getTimezoneOffsetInMilliseconds(fullTimeDateNextDay) - getTimezoneOffsetInMilliseconds(fullTimeDate);
        if (offsetDiff > 0) {
          offset += offsetDiff;
        }
      }
      return new Date(timestamp + time + offset);
    } else {
      return new Date(argument);
    }
  };
  var splitDateString = function(dateString) {
    var dateStrings = {};
    var array = dateString.split(parseTokenDateTimeDelimeter);
    var timeString;
    if (parseTokenPlainTime.test(array[0])) {
      dateStrings.date = null;
      timeString = array[0];
    } else {
      dateStrings.date = array[0];
      timeString = array[1];
    }
    if (timeString) {
      var token = parseTokenTimezone.exec(timeString);
      if (token) {
        dateStrings.time = timeString.replace(token[1], "");
        dateStrings.timezone = token[1];
      } else {
        dateStrings.time = timeString;
      }
    }
    return dateStrings;
  };
  var parseYear = function(dateString, additionalDigits) {
    var parseTokenYYY = parseTokensYYY[additionalDigits];
    var parseTokenYYYYY = parseTokensYYYYY[additionalDigits];
    var token;
    token = parseTokenYYYY.exec(dateString) || parseTokenYYYYY.exec(dateString);
    if (token) {
      var yearString = token[1];
      return {
        year: parseInt(yearString, 10),
        restDateString: dateString.slice(yearString.length)
      };
    }
    token = parseTokenYY.exec(dateString) || parseTokenYYY.exec(dateString);
    if (token) {
      var centuryString = token[1];
      return {
        year: parseInt(centuryString, 10) * 100,
        restDateString: dateString.slice(centuryString.length)
      };
    }
    return {
      year: null
    };
  };
  var parseDate = function(dateString, year) {
    if (year === null) {
      return null;
    }
    var token;
    var date;
    var month;
    var week;
    if (dateString.length === 0) {
      date = new Date(0);
      date.setUTCFullYear(year);
      return date;
    }
    token = parseTokenMM.exec(dateString);
    if (token) {
      date = new Date(0);
      month = parseInt(token[1], 10) - 1;
      date.setUTCFullYear(year, month);
      return date;
    }
    token = parseTokenDDD.exec(dateString);
    if (token) {
      date = new Date(0);
      var dayOfYear = parseInt(token[1], 10);
      date.setUTCFullYear(year, 0, dayOfYear);
      return date;
    }
    token = parseTokenMMDD.exec(dateString);
    if (token) {
      date = new Date(0);
      month = parseInt(token[1], 10) - 1;
      var day = parseInt(token[2], 10);
      date.setUTCFullYear(year, month, day);
      return date;
    }
    token = parseTokenWww.exec(dateString);
    if (token) {
      week = parseInt(token[1], 10) - 1;
      return dayOfISOYear(year, week);
    }
    token = parseTokenWwwD.exec(dateString);
    if (token) {
      week = parseInt(token[1], 10) - 1;
      var dayOfWeek = parseInt(token[2], 10) - 1;
      return dayOfISOYear(year, week, dayOfWeek);
    }
    return null;
  };
  var parseTime = function(timeString) {
    var token;
    var hours;
    var minutes;
    token = parseTokenHH.exec(timeString);
    if (token) {
      hours = parseFloat(token[1].replace(",", "."));
      return hours % 24 * MILLISECONDS_IN_HOUR;
    }
    token = parseTokenHHMM.exec(timeString);
    if (token) {
      hours = parseInt(token[1], 10);
      minutes = parseFloat(token[2].replace(",", "."));
      return hours % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE;
    }
    token = parseTokenHHMMSS.exec(timeString);
    if (token) {
      hours = parseInt(token[1], 10);
      minutes = parseInt(token[2], 10);
      var seconds = parseFloat(token[3].replace(",", "."));
      return hours % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE + seconds * 1000;
    }
    return null;
  };
  var parseTimezone = function(timezoneString) {
    var token;
    var absoluteOffset;
    token = parseTokenTimezoneZ.exec(timezoneString);
    if (token) {
      return 0;
    }
    token = parseTokenTimezoneHH.exec(timezoneString);
    if (token) {
      absoluteOffset = parseInt(token[2], 10) * 60;
      return token[1] === "+" ? -absoluteOffset : absoluteOffset;
    }
    token = parseTokenTimezoneHHMM.exec(timezoneString);
    if (token) {
      absoluteOffset = parseInt(token[2], 10) * 60 + parseInt(token[3], 10);
      return token[1] === "+" ? -absoluteOffset : absoluteOffset;
    }
    return 0;
  };
  var dayOfISOYear = function(isoYear, week, day) {
    week = week || 0;
    day = day || 0;
    var date = new Date(0);
    date.setUTCFullYear(isoYear, 0, 4);
    var fourthOfJanuaryDay = date.getUTCDay() || 7;
    var diff = week * 7 + day + 1 - fourthOfJanuaryDay;
    date.setUTCDate(date.getUTCDate() + diff);
    return date;
  };
  var getTimezoneOffsetInMilliseconds = require_getTimezoneOffsetInMilliseconds();
  var isDate = require_is_date();
  var MILLISECONDS_IN_HOUR = 3600000;
  var MILLISECONDS_IN_MINUTE = 60000;
  var DEFAULT_ADDITIONAL_DIGITS = 2;
  var parseTokenDateTimeDelimeter = /[T ]/;
  var parseTokenPlainTime = /:/;
  var parseTokenYY = /^(\d{2})$/;
  var parseTokensYYY = [
    /^([+-]\d{2})$/,
    /^([+-]\d{3})$/,
    /^([+-]\d{4})$/
  ];
  var parseTokenYYYY = /^(\d{4})/;
  var parseTokensYYYYY = [
    /^([+-]\d{4})/,
    /^([+-]\d{5})/,
    /^([+-]\d{6})/
  ];
  var parseTokenMM = /^-(\d{2})$/;
  var parseTokenDDD = /^-?(\d{3})$/;
  var parseTokenMMDD = /^-?(\d{2})-?(\d{2})$/;
  var parseTokenWww = /^-?W(\d{2})$/;
  var parseTokenWwwD = /^-?W(\d{2})-?(\d{1})$/;
  var parseTokenHH = /^(\d{2}([.,]\d*)?)$/;
  var parseTokenHHMM = /^(\d{2}):?(\d{2}([.,]\d*)?)$/;
  var parseTokenHHMMSS = /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/;
  var parseTokenTimezone = /([Z+-].*)$/;
  var parseTokenTimezoneZ = /^(Z)$/;
  var parseTokenTimezoneHH = /^([+-])(\d{2})$/;
  var parseTokenTimezoneHHMM = /^([+-])(\d{2}):?(\d{2})$/;
  module.exports = parse;
});

// node_modules/date-fns/add_milliseconds/index.js
var require_add_milliseconds = __commonJS((exports, module) => {
  var addMilliseconds = function(dirtyDate, dirtyAmount) {
    var timestamp = parse(dirtyDate).getTime();
    var amount = Number(dirtyAmount);
    return new Date(timestamp + amount);
  };
  var parse = require_parse();
  module.exports = addMilliseconds;
});

// node_modules/date-fns/add_minutes/index.js
var require_add_minutes = __commonJS((exports, module) => {
  var addMinutes = function(dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_MINUTE);
  };
  var addMilliseconds = require_add_milliseconds();
  var MILLISECONDS_IN_MINUTE = 60000;
  module.exports = addMinutes;
});

// node_modules/@lhncbc/ucum-lhc/source-cjs/config.js
var require_config = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Ucum = undefined;
  var Ucum = {
    dimLen_: 7,
    validOps_: [".", "/"],
    codeSep_: ": ",
    valMsgStart_: "Did you mean ",
    valMsgEnd_: "?",
    cnvMsgStart_: "We assumed you meant ",
    cnvMsgEnd_: ".",
    openEmph_: " ->",
    closeEmph_: "<- ",
    openEmphHTML_: '<span class="emphSpan">',
    closeEmphHTML_: "</span>",
    bracesMsg_: "FYI - annotations (text in curly braces {}) are ignored, except that an annotation without a leading symbol implies the default unit 1 (the unity).",
    needMoleWeightMsg_: "Did you wish to convert between mass and moles?  The molecular weight of the substance represented by the units is required to perform the conversion.",
    csvCols_: {
      "case-sensitive code": "csCode_",
      "LOINC property": "loincProperty_",
      "name (display)": "name_",
      synonyms: "synonyms_",
      source: "source_",
      category: "category_",
      Guidance: "guidance_"
    },
    inputKey_: "case-sensitive code",
    specUnits_: {
      "B[10.nV]": "specialUnitOne",
      "[m/s2/Hz^(1/2)]": "specialUnitTwo"
    }
  };
  exports.Ucum = Ucum;
});

// node_modules/@lhncbc/ucum-lhc/source-cjs/prefix.js
var require_prefix = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Prefix = undefined;
  var Ucum = require_config();

  class Prefix {
    constructor(attrs) {
      if (attrs["code_"] === undefined || attrs["code_"] === null || attrs["name_"] === undefined || attrs["name_"] === null || attrs["value_"] === undefined || attrs["value_"] === null || attrs["exp_"] === undefined) {
        throw new Error("Prefix constructor called missing one or more parameters.  Prefix codes (cs or ci), name, value and exponent must all be specified and all but the exponent must not be null.");
      }
      this.code_ = attrs["code_"];
      this.ciCode_ = attrs["ciCode_"];
      this.name_ = attrs["name_"];
      this.printSymbol_ = attrs["printSymbol_"];
      if (typeof attrs["value_"] === "string")
        this.value_ = parseFloat(attrs["value_"]);
      else
        this.value_ = attrs["value_"];
      this.exp_ = attrs["exp_"];
    }
    getValue() {
      return this.value_;
    }
    getCode() {
      return this.code_;
    }
    getCiCode() {
      return this.ciCode_;
    }
    getName() {
      return this.name_;
    }
    getPrintSymbol() {
      return this.printSymbol_;
    }
    getExp() {
      return this.exp_;
    }
    equals(prefix2) {
      return this.code_ === prefix2.code_ && this.ciCode_ === prefix2.ciCode_ && this.name_ === prefix2.name_ && this.printSymbol_ === prefix2.printSymbol_ && this.value_ === prefix2.value_ && this.exp_ === prefix2.exp_;
    }
  }
  exports.Prefix = Prefix;
});

// node_modules/@lhncbc/ucum-lhc/source-cjs/prefixTables.js
var require_prefixTables = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PrefixTables = exports.PrefixTablesFactory = undefined;

  class PrefixTablesFactory {
    constructor() {
      this.byCode_ = {};
      this.byValue_ = {};
    }
    prefixCount() {
      return Object.keys(this.byCode_).length;
    }
    allPrefixesByValue() {
      let prefixBuff = "";
      let pList = Object.keys(this.byValue_);
      let pLen = pList.length;
      for (let p = 0;p < pLen; p++) {
        let pfx = this.getPrefixByValue(pList[p]);
        prefixBuff += pfx.code_ + "," + pfx.name_ + ",," + pfx.value_ + "\r\n";
      }
      return prefixBuff;
    }
    allPrefixesByCode() {
      let prefixList = [];
      let pList = Object.keys(this.byCode_);
      pList.sort();
      let pLen = pList.length;
      for (let p = 0;p < pLen; p++) {
        prefixList.push(this.getPrefixByCode(pList[p]));
      }
      return prefixList;
    }
    add(prefixObj) {
      this.byCode_[prefixObj.getCode()] = prefixObj;
      this.byValue_[prefixObj.getValue()] = prefixObj;
    }
    isDefined(code) {
      return this.byCode_[code] !== null && this.byCode_[code] !== undefined;
    }
    getPrefixByCode(code) {
      return this.byCode_[code];
    }
    getPrefixByValue(value) {
      return this.byValue_[value];
    }
  }
  exports.PrefixTablesFactory = PrefixTablesFactory;
  var prefixTablesInstance = new PrefixTablesFactory;
  var PrefixTables = {
    getInstance: function() {
      return prefixTablesInstance;
    }
  };
  exports.PrefixTables = PrefixTables;
});

// node_modules/@lhncbc/ucum-lhc/source-cjs/ucumFunctions.js
var require_ucumFunctions = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  class UcumFunctions {
    constructor() {
      this.funcs = {};
      this.funcs["cel"] = {
        cnvTo: function(x) {
          return x - 273.15;
        },
        cnvFrom: function(x) {
          return x + 273.15;
        }
      };
      this.funcs["degf"] = {
        cnvTo: function(x) {
          return x - 459.67;
        },
        cnvFrom: function(x) {
          return x + 459.67;
        }
      };
      this.funcs["degre"] = {
        cnvTo: function(x) {
          return x - 273.15;
        },
        cnvFrom: function(x) {
          return x + 273.15;
        }
      };
      this.funcs["ph"] = {
        cnvTo: function(x) {
          return -Math.log(x) / Math.LN10;
        },
        cnvFrom: function(x) {
          return Math.pow(10, -x);
        }
      };
      this.funcs["ln"] = {
        cnvTo: function(x) {
          return Math.log(x);
        },
        cnvFrom: function(x) {
          return Math.exp(x);
        }
      };
      this.funcs["2ln"] = {
        cnvTo: function(x) {
          return 2 * Math.log(x);
        },
        cnvFrom: function(x) {
          return Math.exp(x / 2);
        }
      };
      this.funcs["lg"] = {
        cnvTo: function(x) {
          return Math.log(x) / Math.LN10;
        },
        cnvFrom: function(x) {
          return Math.pow(10, x);
        }
      };
      this.funcs["10lg"] = {
        cnvTo: function(x) {
          return 10 * Math.log(x) / Math.LN10;
        },
        cnvFrom: function(x) {
          return Math.pow(10, x / 10);
        }
      };
      this.funcs["20lg"] = {
        cnvTo: function(x) {
          return 20 * Math.log(x) / Math.LN10;
        },
        cnvFrom: function(x) {
          return Math.pow(10, x / 20);
        }
      };
      this.funcs["2lg"] = {
        cnvTo: function(x) {
          return 2 * Math.log(x) / Math.LN10;
        },
        cnvFrom: function(x) {
          return Math.pow(10, x / 2);
        }
      };
      this.funcs["lgtimes2"] = this.funcs["2lg"];
      this.funcs["ld"] = {
        cnvTo: function(x) {
          return Math.log(x) / Math.LN2;
        },
        cnvFrom: function(x) {
          return Math.pow(2, x);
        }
      };
      this.funcs["100tan"] = {
        cnvTo: function(x) {
          return Math.tan(x) * 100;
        },
        cnvFrom: function(x) {
          return Math.atan(x / 100);
        }
      };
      this.funcs["tanTimes100"] = this.funcs["100tan"];
      this.funcs["sqrt"] = {
        cnvTo: function(x) {
          return Math.sqrt(x);
        },
        cnvFrom: function(x) {
          return x * x;
        }
      };
      this.funcs["inv"] = {
        cnvTo: function(x) {
          return 1 / x;
        },
        cnvFrom: function(x) {
          return 1 / x;
        }
      };
      this.funcs["hpX"] = {
        cnvTo: function(x) {
          return -this.funcs["lg"](x);
        },
        cnvFrom: function(x) {
          return Math.pow(10, -x);
        }
      };
      this.funcs["hpC"] = {
        cnvTo: function(x) {
          return -this.func["ln"](x) / this.funcs["ln"](100);
        },
        cnvFrom: function(x) {
          return Math.pow(100, -x);
        }
      };
      this.funcs["hpM"] = {
        cnvTo: function(x) {
          return -this.funcs["ln"](x) / this.funcs["ln"](1000);
        },
        cnvFrom: function(x) {
          return Math.pow(1000, -x);
        }
      };
      this.funcs["hpQ"] = {
        cnvTo: function(x) {
          return -this.funcs["ln"](x) / this.funcs["ln"](50000);
        },
        cnvFrom: function(x) {
          return Math.pow(50000, -x);
        }
      };
    }
    forName(fname) {
      fname = fname.toLowerCase();
      let f = this.funcs[fname];
      if (f === null)
        throw new Error(`Requested function ${fname} is not defined`);
      return f;
    }
    isDefined(fname) {
      fname = fname.toLowerCase();
      return this.funcs[fname] !== null;
    }
  }
  var _default = new UcumFunctions;
  exports.default = _default;
});

// node_modules/@lhncbc/ucum-lhc/source-cjs/unitTables.js
var require_unitTables = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UnitTables = undefined;
  var Ucum = require_config().Ucum;

  class UnitTablesFactory {
    constructor() {
      this.unitNames_ = {};
      this.unitCodes_ = {};
      this.codeOrder_ = [];
      this.unitStrings_ = {};
      this.unitDimensions_ = {};
      this.unitSynonyms_ = {};
      this.massDimIndex_ = 0;
    }
    unitsCount() {
      return Object.keys(this.unitCodes_).length;
    }
    addUnit(theUnit) {
      let uName = theUnit["name_"];
      if (uName) {
        this.addUnitName(theUnit);
      }
      this.addUnitCode(theUnit);
      this.addUnitString(theUnit);
      try {
        if (theUnit["dim_"].getProperty("dimVec_"))
          this.addUnitDimension(theUnit);
      } catch (err) {
      }
    }
    addUnitName(theUnit) {
      let uName = theUnit["name_"];
      if (uName) {
        if (this.unitNames_[uName])
          this.unitNames_[uName].push(theUnit);
        else
          this.unitNames_[uName] = [theUnit];
      } else
        throw new Error("UnitTables.addUnitName called for a unit with no name.  " + `Unit code = ${theUnit["csCode_"]}.`);
    }
    addUnitCode(theUnit) {
      let uCode = theUnit["csCode_"];
      if (uCode) {
        if (this.unitCodes_[uCode])
          throw new Error(`UnitTables.addUnitCode called, already contains entry for ` + `unit with code = ${uCode}`);
        else {
          this.unitCodes_[uCode] = theUnit;
          this.codeOrder_.push(uCode);
          if (uCode == "g") {
            let dimVec = theUnit.dim_.dimVec_;
            let d = 0;
            for (;d < dimVec.length && dimVec[d] < 1; d++)
              ;
            this.massDimIndex_ = d;
          }
        }
      } else
        throw new Error("UnitTables.addUnitCode called for unit that has no code.");
    }
    addUnitString(theUnit) {
      let uString = null;
      if (Ucum.caseSensitive_ == true)
        uString = theUnit["csUnitString_"];
      else
        uString = theUnit["ciUnitString_"];
      if (uString) {
        let uEntry = {
          mag: theUnit["baseFactorStr_"],
          unit: theUnit
        };
        if (this.unitStrings_[uString])
          this.unitStrings_[uString].push(uEntry);
        else
          this.unitStrings_[uString] = [uEntry];
      }
    }
    addUnitDimension(theUnit) {
      let uDim = theUnit["dim_"].getProperty("dimVec_");
      if (uDim) {
        if (this.unitDimensions_[uDim])
          this.unitDimensions_[uDim].push(theUnit);
        else
          this.unitDimensions_[uDim] = [theUnit];
      } else
        throw new Error("UnitTables.addUnitDimension called for a unit with no dimension.  " + `Unit code = ${theUnit["csCode_"]}.`);
    }
    buildUnitSynonyms() {
      for (let code in this.unitCodes_) {
        let theUnit = this.unitCodes_[code];
        let uSyns = theUnit.synonyms_;
        if (uSyns) {
          let synsAry = uSyns.split(";");
          if (synsAry[0] !== "") {
            let aLen = synsAry.length;
            for (let a = 0;a < aLen; a++) {
              let theSyn = synsAry[a].trim();
              this.addSynonymCodes(code, theSyn);
            }
          }
        }
        this.addSynonymCodes(code, theUnit.name_);
      }
    }
    addSynonymCodes(theCode, theSynonyms) {
      let words = theSynonyms.split(" ");
      let wLen = words.length;
      for (let w = 0;w < wLen; w++) {
        let word = words[w];
        if (this.unitSynonyms_[word]) {
          let synCodes = this.unitSynonyms_[word];
          if (synCodes.indexOf(theCode) === -1) {
            this.unitSynonyms_[word].push(theCode);
          }
        } else {
          this.unitSynonyms_[word] = [theCode];
        }
      }
    }
    getUnitByCode(uCode) {
      let retUnit = null;
      if (uCode) {
        retUnit = this.unitCodes_[uCode];
      }
      return retUnit;
    }
    getUnitByName(uName) {
      if (uName === null || uName === undefined) {
        throw new Error("Unable to find unit by name because no name was provided.");
      }
      let sepPos = uName.indexOf(Ucum.codeSep_);
      let uCode = null;
      if (sepPos >= 1) {
        uCode = uName.substr(sepPos + Ucum.codeSep_.length);
        uName = uName.substr(0, sepPos);
      }
      let retUnits = this.unitNames_[uName];
      if (retUnits) {
        let uLen = retUnits.length;
        if (uCode && uLen > 1) {
          let i = 0;
          for (;retUnits[i].csCode_ !== uCode && i < uLen; i++)
            ;
          if (i < uLen)
            retUnits = [retUnits[i]];
          else {
            retUnits = null;
          }
        }
      }
      return retUnits;
    }
    getUnitByString(uString) {
      let retAry = null;
      if (uString) {
        retAry = this.unitStrings_[uString];
        if (retAry === undefined)
          retAry = null;
      }
      return retAry;
    }
    getUnitsByDimension(uDim) {
      let unitsArray = null;
      if (uDim === null || uDim === undefined) {
        throw new Error("Unable to find unit by because no dimension vector was provided.");
      }
      unitsArray = this.unitDimensions_[uDim];
      if (unitsArray === undefined || unitsArray === null) {
        console.log(`Unable to find unit with dimension = ${uDim}`);
      }
      return unitsArray;
    }
    getUnitBySynonym(uSyn) {
      let retObj = {};
      let unitsArray = [];
      try {
        if (uSyn === null || uSyn === undefined) {
          retObj["status"] = "error";
          throw new Error("Unable to find unit by synonym because no synonym was provided.");
        }
        if (Object.keys(this.unitSynonyms_).length === 0) {
          this.buildUnitSynonyms();
        }
        let foundCodes = [];
        foundCodes = this.unitSynonyms_[uSyn];
        if (foundCodes) {
          retObj["status"] = "succeeded";
          let fLen = foundCodes.length;
          for (let f = 0;f < fLen; f++) {
            unitsArray.push(this.unitCodes_[foundCodes[f]]);
          }
          retObj["units"] = unitsArray;
        }
        if (unitsArray.length === 0) {
          retObj["status"] = "failed";
          retObj["msg"] = `Unable to find any units with synonym = ${uSyn}`;
        }
      } catch (err) {
        retObj["msg"] = err.message;
      }
      return retObj;
    }
    getAllUnitNames() {
      return Object.keys(this.unitNames_);
    }
    getUnitNamesList() {
      let nameList = [];
      let codes = Object.keys(this.unitCodes_);
      codes.sort(this.compareCodes);
      let uLen = codes.length;
      for (let i = 0;i < uLen; i++) {
        nameList[i] = codes[i] + Ucum.codeSep_ + this.unitCodes_[codes[i]].name_;
      }
      return nameList;
    }
    getMassDimensionIndex() {
      return this.massDimIndex_;
    }
    compareCodes(a, b) {
      a = a.replace(/[\[\]]/g, "");
      a = a.toLowerCase();
      b = b.replace(/[\[\]]/g, "");
      b = b.toLowerCase();
      return a < b ? -1 : 1;
    }
    getAllUnitCodes() {
      return Object.keys(this.unitCodes_);
    }
    allUnitsByDef() {
      let unitsList = [];
      let uLen = this.codeOrder_.length;
      for (let u = 0;u < uLen; u++) {
        unitsList.push(this.getUnitByCode(this.codeOrder_[u]));
      }
      return unitsList;
    }
    allUnitsByName(cols, sep) {
      if (sep === undefined || sep === null)
        sep = "|";
      let unitBuff = "";
      let unitsList = this.getAllUnitNames();
      let uLen = unitsList.length;
      let cLen = cols.length;
      for (let i = 0;i < uLen; i++) {
        let nameRecs = this.getUnitByName(unitsList[i]);
        for (let u = 0;u < nameRecs.length; u++) {
          let rec = nameRecs[u];
          for (let c = 0;c < cLen; c++) {
            if (c > 0)
              unitBuff += sep;
            if (cols[c] === "dim_") {
              if (rec.dim_ !== null && rec.dim_ !== undefined && rec.dim_.dimVec_ instanceof Array)
                unitBuff += "[" + rec.dim_.dimVec_.join(",") + "]";
              else
                unitBuff += "";
            } else {
              let cbuf = rec[cols[c]];
              if (typeof cbuf === "string")
                unitBuff += cbuf.replace(/[\n\r]/g, " ");
              else
                unitBuff += cbuf;
            }
          }
          unitBuff += "\r\n";
        }
      }
      return unitBuff;
    }
    printUnits(doLong, sep) {
      if (doLong === undefined)
        doLong = false;
      if (sep === undefined)
        sep = "|";
      let codeList = "";
      let uLen = this.codeOrder_.length;
      let unitString = "csCode" + sep;
      if (doLong) {
        unitString += "ciCode" + sep;
      }
      unitString += "name" + sep;
      if (doLong)
        unitString += "isBase" + sep;
      unitString += "magnitude" + sep + "dimension" + sep + "from unit(s)" + sep + "value" + sep + "function" + sep;
      if (doLong)
        unitString += "property" + sep + "printSymbol" + sep + "synonyms" + sep + "source" + sep + "class" + sep + "isMetric" + sep + "variable" + sep + "isSpecial" + sep + "isAbitrary" + sep;
      unitString += "comment";
      codeList = unitString + "\n";
      for (let u = 0;u < uLen; u++) {
        let curUnit = this.getUnitByCode(this.codeOrder_[u]);
        unitString = this.codeOrder_[u] + sep;
        if (doLong) {
          unitString += curUnit.getProperty("ciCode_") + sep;
        }
        unitString += curUnit.getProperty("name_") + sep;
        if (doLong) {
          if (curUnit.getProperty("isBase_"))
            unitString += "true" + sep;
          else
            unitString += "false" + sep;
        }
        unitString += curUnit.getProperty("magnitude_") + sep;
        let curDim = curUnit.getProperty("dim_");
        if (curDim) {
          unitString += curDim.dimVec_ + sep;
        } else {
          unitString += "null" + sep;
        }
        if (curUnit.csUnitString_)
          unitString += curUnit.csUnitString_ + sep + curUnit.baseFactor_ + sep;
        else
          unitString += "null" + sep + "null" + sep;
        if (curUnit.cnv_)
          unitString += curUnit.cnv_ + sep;
        else
          unitString += "null" + sep;
        if (doLong) {
          unitString += curUnit.getProperty("property_") + sep + curUnit.getProperty("printSymbol_") + sep + curUnit.getProperty("synonyms_") + sep + curUnit.getProperty("source_") + sep + curUnit.getProperty("class_") + sep + curUnit.getProperty("isMetric_") + sep + curUnit.getProperty("variable_") + sep + curUnit.getProperty("isSpecial_") + sep + curUnit.getProperty("isArbitrary_") + sep;
        }
        if (curUnit.defError_)
          unitString += "problem parsing this one, deferred to later.";
        codeList += unitString + "\n";
      }
      return codeList;
    }
  }
  var unitTablesInstance = new UnitTablesFactory;
  var UnitTables = {
    getInstance: function() {
      return unitTablesInstance;
    }
  };
  exports.UnitTables = UnitTables;
});

// node_modules/@lhncbc/ucum-lhc/source-cjs/ucumInternalUtils.js
var require_ucumInternalUtils = __commonJS((exports) => {
  var isNumericString = function(theString) {
    let num = "" + theString;
    return !isNaN(num) && !isNaN(parseFloat(num));
  };
  var isIntegerUnit = function(str) {
    return /^\d+$/.test(str);
  };
  var getSynonyms = function(theSyn) {
    let retObj = {};
    let utab = UnitTables.getInstance();
    let resp = {};
    resp = utab.getUnitBySynonym(theSyn);
    if (!resp["units"]) {
      retObj["status"] = resp["status"];
      retObj["msg"] = resp["msg"];
    } else {
      retObj["status"] = "succeeded";
      let aLen = resp["units"].length;
      retObj["units"] = [];
      for (let a = 0;a < aLen; a++) {
        let theUnit = resp["units"][a];
        retObj["units"][a] = {
          code: theUnit.csCode_,
          name: theUnit.name_,
          guidance: theUnit.guidance_
        };
      }
    }
    return retObj;
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isNumericString = isNumericString;
  exports.isIntegerUnit = isIntegerUnit;
  exports.getSynonyms = getSynonyms;
  var UnitTables = require_unitTables().UnitTables;
});

// node_modules/is-finite/index.js
var require_is_finite = __commonJS((exports, module) => {
  module.exports = Number.isFinite || function(value) {
    return !(typeof value !== "number" || value !== value || value === Infinity || value === (-Infinity));
  };
});

// node_modules/is-integer/index.js
var require_is_integer = __commonJS((exports, module) => {
  var isFinite2 = require_is_finite();
  module.exports = Number.isInteger || function(val) {
    return typeof val === "number" && isFinite2(val) && Math.floor(val) === val;
  };
});

// node_modules/@lhncbc/ucum-lhc/source-cjs/dimension.js
var require_dimension = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Dimension = undefined;
  var UC = require_config();
  var isInteger = require_is_integer();

  class Dimension {
    constructor(dimSetting) {
      if (UC.Ucum.dimLen_ === 0) {
        throw new Error("Dimension.setDimensionLen must be called before Dimension constructor");
      }
      if (dimSetting === undefined || dimSetting === null) {
        this.assignZero();
      } else if (dimSetting instanceof Array) {
        if (dimSetting.length !== UC.Ucum.dimLen_) {
          throw new Error("Parameter error, incorrect length of vector passed to " + `Dimension constructor, vector = ${JSON.stringify(dimSetting)}`);
        }
        this.dimVec_ = [];
        for (let d = 0;d < UC.Ucum.dimLen_; d++)
          this.dimVec_.push(dimSetting[d]);
      } else if (isInteger(dimSetting)) {
        if (dimSetting < 0 || dimSetting >= UC.Ucum.dimLen_) {
          throw new Error("Parameter error, invalid element number specified for Dimension constructor");
        }
        this.assignZero();
        this.dimVec_[dimSetting] = 1;
      }
    }
    setElementAt(indexPos, value) {
      if (!isInteger(indexPos) || indexPos < 0 || indexPos >= UC.Ucum.dimLen_) {
        throw new Error(`Dimension.setElementAt called with an invalid index ` + `position (${indexPos})`);
      }
      if (!this.dimVec_) {
        this.assignZero();
      }
      if (value === undefined || value === null)
        value = 1;
      this.dimVec_[indexPos] = value;
    }
    getElementAt(indexPos) {
      if (!isInteger(indexPos) || indexPos < 0 || indexPos >= UC.Ucum.dimLen_) {
        throw new Error(`Dimension.getElementAt called with an invalid index ` + `position (${indexPos})`);
      }
      let ret = null;
      if (this.dimVec_)
        ret = this.dimVec_[indexPos];
      return ret;
    }
    getProperty(propertyName) {
      let uProp = propertyName.charAt(propertyName.length - 1) === "_" ? propertyName : propertyName + "_";
      return this[uProp];
    }
    toString() {
      let ret = null;
      if (this.dimVec_)
        ret = "[" + this.dimVec_.join(", ") + "]";
      return ret;
    }
    add(dim22) {
      if (!dim22 instanceof Dimension) {
        throw new Error(`Dimension.add called with an invalid parameter - ` + `${typeof dim22} instead of a Dimension object`);
      }
      if (this.dimVec_ && dim22.dimVec_) {
        for (let i = 0;i < UC.Ucum.dimLen_; i++)
          this.dimVec_[i] += dim22.dimVec_[i];
      }
      return this;
    }
    sub(dim22) {
      if (!dim22 instanceof Dimension) {
        throw new Error(`Dimension.sub called with an invalid parameter - ` + `${typeof dim22} instead of a Dimension object`);
      }
      if (this.dimVec_ && dim22.dimVec_) {
        for (let i = 0;i < UC.Ucum.dimLen_; i++)
          this.dimVec_[i] -= dim22.dimVec_[i];
      }
      return this;
    }
    minus() {
      if (this.dimVec_) {
        for (let i = 0;i < UC.Ucum.dimLen_; i++)
          this.dimVec_[i] = -this.dimVec_[i];
      }
      return this;
    }
    mul(s) {
      if (!isInteger(s)) {
        throw new Error(`Dimension.sub called with an invalid parameter - ` + `${typeof dim2} instead of a number`);
      }
      if (this.dimVec_) {
        for (let i = 0;i < UC.Ucum.dimLen_; i++)
          this.dimVec_[i] *= s;
      }
      return this;
    }
    equals(dim22) {
      if (!dim22 instanceof Dimension) {
        throw new Error(`Dimension.equals called with an invalid parameter - ` + `${typeof dim22} instead of a Dimension object`);
      }
      let isEqual = true;
      let dimVec2 = dim22.dimVec_;
      if (this.dimVec_ && dimVec2) {
        for (let i = 0;isEqual && i < UC.Ucum.dimLen_; i++)
          isEqual = this.dimVec_[i] === dimVec2[i];
      } else {
        isEqual = this.dimVec_ === null && dimVec2 === null;
      }
      return isEqual;
    }
    assignDim(dim22) {
      if (!dim22 instanceof Dimension) {
        throw new Error(`Dimension.assignDim called with an invalid parameter - ` + `${typeof dim22} instead of a Dimension object`);
      }
      if (dim22.dimVec_ === null)
        this.dimVec_ = null;
      else {
        if (this.dimVec_ === null) {
          this.dimVec_ = [];
        }
        for (let i = 0;i < UC.Ucum.dimLen_; i++)
          this.dimVec_[i] = dim22.dimVec_[i];
      }
      return this;
    }
    assignZero() {
      if (this.dimVec_ === null || this.dimVec_ === undefined)
        this.dimVec_ = [];
      for (let i = 0;i < UC.Ucum.dimLen_; i++) {
        this.dimVec_.push(0);
      }
      return this;
    }
    isZero() {
      let allZero = this.dimVec_ !== null;
      if (this.dimVec_) {
        for (let i = 0;allZero && i < UC.Ucum.dimLen_; i++)
          allZero = this.dimVec_[i] === 0;
      }
      return allZero;
    }
    isNull() {
      return this.dimVec_ === null;
    }
    clone() {
      let that = new Dimension;
      that.assignDim(this);
      return that;
    }
  }
  exports.Dimension = Dimension;
});

// node_modules/@lhncbc/ucum-lhc/source-cjs/unit.js
var require_unit = __commonJS((exports) => {
  var _getRequireWildcardCache = function() {
    if (typeof WeakMap !== "function")
      return null;
    var cache = new WeakMap;
    _getRequireWildcardCache = function() {
      return cache;
    };
    return cache;
  };
  var _interopRequireWildcard = function(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      return { default: obj };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    newObj.default = obj;
    if (cache) {
      cache.set(obj, newObj);
    }
    return newObj;
  };
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Unit = undefined;
  var _ucumFunctions = _interopRequireDefault(require_ucumFunctions());
  var intUtils_ = _interopRequireWildcard(require_ucumInternalUtils());
  var Ucum = require_config().Ucum;
  var Dimension = require_dimension().Dimension;
  var UnitTables;
  var isInteger = require_is_integer();

  class Unit {
    constructor(attrs = {}) {
      this.isBase_ = attrs["isBase_"] || false;
      this.name_ = attrs["name_"] || "";
      this.csCode_ = attrs["csCode_"] || "";
      this.ciCode_ = attrs["ciCode_"] || "";
      this.property_ = attrs["property_"] || "";
      this.magnitude_ = attrs["magnitude_"] || 1;
      if (attrs["dim_"] === undefined || attrs["dim_"] === null) {
        this.dim_ = new Dimension;
      } else if (attrs["dim_"]["dimVec_"] !== undefined) {
        this.dim_ = new Dimension(attrs["dim_"]["dimVec_"]);
      } else if (attrs["dim_"] instanceof Dimension) {
        this.dim_ = attrs["dim_"];
      } else if (attrs["dim_"] instanceof Array || isInteger(attrs["dim_"])) {
        this.dim_ = new Dimension(attrs["dim_"]);
      } else {
        this.dim_ = new Dimension;
      }
      this.printSymbol_ = attrs["printSymbol_"] || null;
      this.class_ = attrs["class_"] || null;
      this.isMetric_ = attrs["isMetric_"] || false;
      this.variable_ = attrs["variable_"] || null;
      this.cnv_ = attrs["cnv_"] || null;
      this.cnvPfx_ = attrs["cnvPfx_"] || 1;
      this.isSpecial_ = attrs["isSpecial_"] || false;
      this.isArbitrary_ = attrs["isArbitrary_"] || false;
      this.moleExp_ = attrs["moleExp_"] || 0;
      this.synonyms_ = attrs["synonyms_"] || null;
      this.source_ = attrs["source_"] || null;
      this.loincProperty_ = attrs["loincProperty_"] || null;
      this.category_ = attrs["category_"] || null;
      this.guidance_ = attrs["guidance_"] || null;
      this.csUnitString_ = attrs["csUnitString_"] || null;
      this.ciUnitString_ = attrs["ciUnitString_"] || null;
      this.baseFactorStr_ = attrs["baseFactorStr_"] || null;
      this.baseFactor_ = attrs["baseFactor_"] || null;
      this.defError_ = attrs["defError_"] || false;
    }
    assignUnity() {
      this.name_ = "";
      this.magnitude_ = 1;
      if (!this.dim_)
        this.dim_ = new Dimension;
      this.dim_.assignZero();
      this.cnv_ = null;
      this.cnvPfx_ = 1;
      return this;
    }
    assignVals(vals) {
      for (let key in vals) {
        let uKey = !key.charAt(key.length - 1) === "_" ? key + "_" : key;
        if (this.hasOwnProperty(uKey))
          this[uKey] = vals[key];
        else
          throw new Error(`Parameter error; ${key} is not a property of a Unit`);
      }
    }
    clone() {
      let retUnit = new Unit;
      Object.getOwnPropertyNames(this).forEach((val) => {
        if (val === "dim_") {
          if (this["dim_"])
            retUnit["dim_"] = this["dim_"].clone();
          else
            retUnit["dim_"] = null;
        } else
          retUnit[val] = this[val];
      });
      return retUnit;
    }
    assign(unit2) {
      Object.getOwnPropertyNames(unit2).forEach((val) => {
        if (val === "dim_") {
          if (unit2["dim_"])
            this["dim_"] = unit2["dim_"].clone();
          else
            this["dim_"] = null;
        } else {
          this[val] = unit2[val];
        }
      });
    }
    equals(unit2) {
      return this.magnitude_ === unit2.magnitude_ && this.cnv_ === unit2.cnv_ && this.cnvPfx_ === unit2.cnvPfx_ && (this.dim_ === null && unit2.dim_ === null || this.dim_.equals(unit2.dim_));
    }
    fullEquals(unit2) {
      let thisAttr = Object.keys(this).sort();
      let u2Attr = Object.keys(unit2).sort();
      let keyLen = thisAttr.length;
      let match = keyLen === u2Attr.length;
      for (let k = 0;k < keyLen && match; k++) {
        if (thisAttr[k] === u2Attr[k]) {
          if (thisAttr[k] === "dim_")
            match = this.dim_.equals(unit2.dim_);
          else
            match = this[thisAttr[k]] === unit2[thisAttr[k]];
        } else
          match = false;
      }
      return match;
    }
    getProperty(propertyName) {
      let uProp = propertyName.charAt(propertyName.length - 1) === "_" ? propertyName : propertyName + "_";
      return this[uProp];
    }
    convertFrom(num, fromUnit) {
      let newNum = 0;
      if (this.isArbitrary_)
        throw new Error(`Attempt to convert arbitrary unit ${this.name_}`);
      if (fromUnit.isArbitrary_)
        throw new Error(`Attempt to convert to arbitrary unit ${fromUnit.name_}`);
      if (fromUnit.dim_ && this.dim_ && !fromUnit.dim_.equals(this.dim_)) {
        if (this.isMoleMassCommensurable(fromUnit)) {
          throw new Error(Ucum.needMoleWeightMsg_);
        } else {
          throw new Error(`Sorry.  ${fromUnit.csCode_} cannot be converted ` + `to ${this.csCode_}.`);
        }
      }
      if (fromUnit.dim_ && (!this.dim_ || this.dim_.isNull())) {
        throw new Error(`Sorry.  ${fromUnit.csCode_} cannot be converted ` + `to ${this.csCode_}.`);
      }
      if (this.dim_ && (!fromUnit.dim_ || fromUnit.dim_.isNull())) {
        throw new Error(`Sorry.  ${fromUnit.csCode_} cannot be converted ` + `to ${this.csCode_}.`);
      }
      let fromCnv = fromUnit.cnv_;
      let fromMag = fromUnit.magnitude_;
      if (fromCnv === this.cnv_) {
        newNum = num * fromMag / this.magnitude_;
      } else {
        let x = 0;
        if (fromCnv != null) {
          let fromFunc = _ucumFunctions.default.forName(fromCnv);
          x = fromFunc.cnvFrom(num * fromUnit.cnvPfx_) * fromMag;
        } else {
          x = num * fromMag;
        }
        if (this.cnv_ != null) {
          let toFunc = _ucumFunctions.default.forName(this.cnv_);
          newNum = toFunc.cnvTo(x / this.magnitude_) / this.cnvPfx_;
        } else {
          newNum = x / this.magnitude_;
        }
      }
      return newNum;
    }
    convertTo(num, toUnit) {
      return toUnit.convertFrom(num, this);
    }
    convertCoherent(num) {
      if (this.cnv_ !== null)
        num = this.cnv_.f_from(num / this.cnvPfx_) * this.magnitude_;
      return num;
    }
    mutateCoherent(num) {
      num = this.convertCoherent(num);
      this.magnitude_ = 1;
      this.cnv_ = null;
      this.cnvPfx_ = 1;
      this.name_ = "";
      for (let i = 0, max = Dimension.getMax();i < max; i++) {
        let elem = this.dim_.getElementAt(i);
        let tabs = this._getUnitTables();
        let uA = tabs.getUnitsByDimension(new Dimension(i));
        if (uA == null)
          throw new Error(`Can't find base unit for dimension ${i}`);
        this.name_ = uA.name + elem;
      }
      return num;
    }
    convertMassToMol(amt, molUnit, molecularWeight) {
      let molAmt = this.magnitude_ * amt / molecularWeight;
      let tabs = this._getUnitTables();
      let avoNum = tabs.getUnitByCode("mol").magnitude_;
      let molesFactor = molUnit.magnitude_ / avoNum;
      return molAmt / molesFactor;
    }
    convertMolToMass(amt, massUnit, molecularWeight) {
      let tabs = this._getUnitTables();
      let avoNum = tabs.getUnitByCode("mol").magnitude_;
      let molesFactor = this.magnitude_ / avoNum;
      let massAmt = molesFactor * amt * molecularWeight;
      return massAmt / massUnit.magnitude_;
    }
    mutateRatio(num) {
      if (this.cnv_ == null)
        return this.mutateCoherent(num);
      else
        return num;
    }
    multiplyThis(s) {
      let retUnit = this.clone();
      if (retUnit.cnv_ != null)
        retUnit.cnvPfx_ *= s;
      else
        retUnit.magnitude_ *= s;
      let mulVal = s.toString();
      retUnit.name_ = this._concatStrs(mulVal, "*", this.name_, "[", "]");
      retUnit.csCode_ = this._concatStrs(mulVal, ".", this.csCode_, "(", ")");
      retUnit.ciCode_ = this._concatStrs(mulVal, ".", this.ciCode_, "(", ")");
      retUnit.printSymbol_ = this._concatStrs(mulVal, ".", this.printSymbol_, "(", ")");
      return retUnit;
    }
    multiplyThese(unit2) {
      var retUnit = this.clone();
      if (retUnit.cnv_ != null) {
        if (unit2.cnv_ == null && (!unit2.dim_ || unit2.dim_.isZero()))
          retUnit.cnvPfx_ *= unit2.magnitude_;
        else
          throw new Error(`Attempt to multiply non-ratio unit ${retUnit.name_} ` + "failed.");
      } else if (unit2.cnv_ != null) {
        if (!retUnit.dim_ || retUnit.dim_.isZero()) {
          retUnit.cnvPfx_ = unit2.cnvPfx_ * retUnit.magnitude_;
          retUnit.cnv_ = unit2.cnv_;
        } else
          throw new Error(`Attempt to multiply non-ratio unit ${unit2.name_}`);
      } else {
        retUnit.magnitude_ *= unit2.magnitude_;
      }
      if (!retUnit.dim_ || retUnit.dim_ && !retUnit.dim_.dimVec_) {
        if (unit2.dim_)
          retUnit.dim_ = unit2.dim_.clone();
        else
          retUnit.dim_ = unit2.dim_;
      } else if (unit2.dim_ && unit2.dim_ instanceof Dimension) {
        retUnit.dim_.add(unit2.dim_);
      }
      retUnit.name_ = this._concatStrs(retUnit.name_, "*", unit2.name_, "[", "]");
      retUnit.csCode_ = this._concatStrs(retUnit.csCode_, ".", unit2.csCode_, "(", ")");
      if (retUnit.ciCode_ && unit2.ciCode_)
        retUnit.ciCode_ = this._concatStrs(retUnit.ciCode_, ".", unit2.ciCode_, "(", ")");
      else if (unit2.ciCode_)
        retUnit.ciCode_ = unit2.ciCode_;
      retUnit.guidance_ = "";
      if (retUnit.printSymbol_ && unit2.printSymbol_)
        retUnit.printSymbol_ = this._concatStrs(retUnit.printSymbol_, ".", unit2.printSymbol_, "(", ")");
      else if (unit2.printSymbol_)
        retUnit.printSymbol_ = unit2.printSymbol_;
      retUnit.moleExp_ = retUnit.moleExp_ + unit2.moleExp_;
      if (!retUnit.isArbitrary_)
        retUnit.isArbitrary_ = unit2.isArbitrary_;
      return retUnit;
    }
    divide(unit2) {
      var retUnit = this.clone();
      if (retUnit.cnv_ != null)
        throw new Error(`Attempt to divide non-ratio unit ${retUnit.name_}`);
      if (unit2.cnv_ != null)
        throw new Error(`Attempt to divide by non-ratio unit ${unit2.name_}`);
      if (retUnit.name_ && unit2.name_)
        retUnit.name_ = this._concatStrs(retUnit.name_, "/", unit2.name_, "[", "]");
      else if (unit2.name_)
        retUnit.name_ = unit2.invertString(unit2.name_);
      retUnit.csCode_ = this._concatStrs(retUnit.csCode_, "/", unit2.csCode_, "(", ")");
      if (retUnit.ciCode_ && unit2.ciCode_)
        retUnit.ciCode_ = this._concatStrs(retUnit.ciCode_, "/", unit2.ciCode_, "(", ")");
      else if (unit2.ciCode_)
        retUnit.ciCode_ = unit2.invertString(unit2.ciCode_);
      retUnit.guidance_ = "";
      retUnit.magnitude_ /= unit2.magnitude_;
      if (retUnit.printSymbol_ && unit2.printSymbol_)
        retUnit.printSymbol_ = this._concatStrs(retUnit.printSymbol_, "/", unit2.printSymbol_, "(", ")");
      else if (unit2.printSymbol_)
        retUnit.printSymbol_ = unit2.invertString(unit2.printSymbol_);
      if (unit2.dim_) {
        if (retUnit.dim_) {
          if (retUnit.dim_.isNull())
            retUnit.dim_.assignZero();
          retUnit.dim_ = retUnit.dim_.sub(unit2.dim_);
        } else
          retUnit.dim_ = unit2.dim_.clone().minus();
      }
      retUnit.moleExp_ = retUnit.moleExp_ - unit2.moleExp_;
      if (!retUnit.isArbitrary_)
        retUnit.isArbitrary_ = unit2.isArbitrary_;
      return retUnit;
    }
    invert() {
      if (this.cnv_ != null)
        throw new Error(`Attempt to invert a non-ratio unit - ${this.name_}`);
      this.name_ = this.invertString(this.name_);
      this.magnitude_ = 1 / this.magnitude_;
      this.dim_.minus();
      return this;
    }
    invertString(theString) {
      if (theString.length > 0) {
        let stringRep = theString.replace("/", "!").replace(".", "/").replace("!", ".");
        switch (stringRep.charAt(0)) {
          case ".":
            theString = stringRep.substr(1);
            break;
          case "/":
            theString = stringRep;
            break;
          default:
            theString = "/" + stringRep;
        }
      }
      return theString;
    }
    _concatStrs(str1, operator, str2, startChar, endChar) {
      return this._buildOneString(str1, startChar, endChar) + operator + this._buildOneString(str2, startChar, endChar);
    }
    _buildOneString(str, startChar, endChar) {
      let ret = "";
      if (intUtils_.isNumericString(str)) {
        ret = str;
      } else {
        if (str.charAt(0) === "(" || str.charAt(0) === "[") {
          ret = str;
        } else if (/[./* ]/.test(str)) {
          ret = startChar + str + endChar;
        } else {
          ret = str;
        }
      }
      return ret;
    }
    power(p) {
      if (this.cnv_ != null)
        throw new Error(`Attempt to raise a non-ratio unit, ${this.name_}, ` + "to a power.");
      let uStr = this.csCode_;
      let uArray = uStr.match(/([./]|[^./]+)/g);
      let arLen = uArray.length;
      for (let i = 0;i < arLen; i++) {
        let un = uArray[i];
        if (un !== "/" && un !== ".") {
          let nun = parseInt(un);
          if (isInteger(nun))
            uArray[i] = Math.pow(nun, p).toString();
          else {
            let uLen = un.length;
            for (let u = uLen - 1;u >= 0; u--) {
              let uChar = parseInt(un[u]);
              if (!isInteger(uChar)) {
                if (un[u] === "-" || un[u] === "+") {
                  u--;
                }
                if (u < uLen - 1) {
                  let exp = parseInt(un.substr(u));
                  exp = Math.pow(exp, p);
                  uArray[i] = un.substr(0, u) + exp.toString();
                  u = -1;
                } else {
                  uArray[i] += p.toString();
                  u = -1;
                }
                u = -1;
              }
            }
          }
        }
      }
      this.csCode_ = uArray.join("");
      this.magnitude_ = Math.pow(this.magnitude_, p);
      if (this.dim_) {
        this.dim_.mul(p);
      }
      return this;
    }
    isMoleMassCommensurable(unit2) {
      let tabs = this._getUnitTables();
      let d = tabs.getMassDimensionIndex();
      let commensurable = false;
      if (this.moleExp_ === 1 && unit2.moleExp_ === 0) {
        let testDim = this.dim_.clone();
        let curVal = testDim.getElementAt(d);
        testDim.setElementAt(d, curVal + this.moleExp_);
        commensurable = testDim.equals(unit2.dim_);
      } else if (unit2.moleExp_ === 1 && this.moleExp_ === 0) {
        let testDim = unit2.dim_.clone();
        let curVal = testDim.getElementAt(d);
        testDim.setElementAt(d, curVal + unit2.moleExp_);
        commensurable = testDim.equals(this.dim_);
      }
      return commensurable;
    }
    _getUnitTables() {
      if (!UnitTables)
        UnitTables = require_unitTables().UnitTables;
      return UnitTables.getInstance();
    }
  }
  exports.Unit = Unit;
});

// node_modules/@lhncbc/ucum-lhc/source-cjs/jsonArrayPack.js
var require_jsonArrayPack = __commonJS((exports) => {
  var isObject = function(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
  };
  var createConfig = function(refObj) {
    return Object.keys(refObj).reduce((config, key) => {
      if (isObject(refObj[key])) {
        pushFn.apply(config, createConfig(refObj[key]).map((keyTail) => [key, ...[].concat(keyTail)]));
      } else {
        config.push(key);
      }
      return config;
    }, []);
  };
  var prepareConfig = function(config) {
    return config.map((key) => Array.isArray(key) ? key : [key]);
  };
  var packItem = function(config, item) {
    if (config.join() !== prepareConfig(createConfig(item)).join()) {
      throw new Error("Object of unusual structure");
    }
    return config.map((keyArr) => {
      let place = item;
      keyArr.forEach((key) => {
        place = place[key];
        if (place === undefined) {
          throw new Error("Object of unusual structure");
        }
      });
      return place;
    });
  };
  var unpackItem = function(config, item) {
    let result = {};
    config.forEach((keyArr, i) => {
      let place = result;
      for (let i2 = 0;i2 < keyArr.length - 1; i2++) {
        place = place[keyArr[i2]] = place[keyArr[i2]] || {};
      }
      place[keyArr[keyArr.length - 1]] = item[i];
    });
    return result;
  };
  var packArray = function(arr) {
    if (arr && arr.length) {
      const config = createConfig(arr[0]), _config = prepareConfig(config);
      if (config.length) {
        return {
          config,
          data: arr.map(packItem.bind(null, _config))
        };
      }
    }
    return {
      config: [],
      data: arr
    };
  };
  var unpackArray = function(obj) {
    const config = obj && obj.config;
    if (config) {
      if (config.length && obj.data) {
        const _config = prepareConfig(config);
        return obj.data.map(unpackItem.bind(null, _config));
      } else {
        return obj.data;
      }
    }
    return obj;
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.packArray = packArray;
  exports.unpackArray = unpackArray;
  var pushFn = Array.prototype.push;
});

// node_modules/@lhncbc/ucum-lhc/data/ucumDefs.min.json
var require_ucumDefs_min = __commonJS((exports, module) => {
  module.exports = { license: "The following data (prefixes and units) was generated by the UCUM LHC code from the UCUM data and selected LOINC combinations of UCUM units.  The license for the UCUM LHC code (demo and library code as well as the combined units) is located at https://github.com/lhncbc/ucum-lhc/blob/LICENSE.md.", prefixes: { config: ["code_", "ciCode_", "name_", "printSymbol_", "value_", "exp_"], data: [["E", "EX", "exa", "E", 1000000000000000000, "18"], ["G", "GA", "giga", "G", 1e9, "9"], ["Gi", "GIB", "gibi", "Gi", 1073741824, null], ["Ki", "KIB", "kibi", "Ki", 1024, null], ["M", "MA", "mega", "M", 1e6, "6"], ["Mi", "MIB", "mebi", "Mi", 1048576, null], ["P", "PT", "peta", "P", 1000000000000000, "15"], ["T", "TR", "tera", "T", 1000000000000, "12"], ["Ti", "TIB", "tebi", "Ti", 1099511627776, null], ["Y", "YA", "yotta", "Y", 1000000000000000000000000, "24"], ["Z", "ZA", "zetta", "Z", 1000000000000000000000, "21"], ["a", "A", "atto", "a", 0.000000000000000001, "-18"], ["c", "C", "centi", "c", 0.01, "-2"], ["d", "D", "deci", "d", 0.1, "-1"], ["da", "DA", "deka", "da", 10, "1"], ["f", "F", "femto", "f", 0.000000000000001, "-15"], ["h", "H", "hecto", "h", 100, "2"], ["k", "K", "kilo", "k", 1000, "3"], ["m", "M", "milli", "m", 0.001, "-3"], ["n", "N", "nano", "n", 0.000000001, "-9"], ["p", "P", "pico", "p", 0.000000000001, "-12"], ["u", "U", "micro", "\u03BC", 0.000001, "-6"], ["y", "YO", "yocto", "y", 0.0000000000000000000000010000000000000001, "-24"], ["z", "ZO", "zepto", "z", 0.000000000000000000001, "-21"]] }, units: { config: ["isBase_", "name_", "csCode_", "ciCode_", "property_", "magnitude_", ["dim_", "dimVec_"], "printSymbol_", "class_", "isMetric_", "variable_", "cnv_", "cnvPfx_", "isSpecial_", "isArbitrary_", "moleExp_", "synonyms_", "source_", "loincProperty_", "category_", "guidance_", "csUnitString_", "ciUnitString_", "baseFactorStr_", "baseFactor_", "defError_"], data: [[true, "meter", "m", "M", "length", 1, [1, 0, 0, 0, 0, 0, 0], "m", null, false, "L", null, 1, false, false, 0, "meters; metres; distance", "UCUM", "Len", "Clinical", "unit of length = 1.09361 yards", null, null, null, null, false], [true, "second - time", "s", "S", "time", 1, [0, 1, 0, 0, 0, 0, 0], "s", null, false, "T", null, 1, false, false, 0, "seconds", "UCUM", "Time", "Clinical", "", null, null, null, null, false], [true, "gram", "g", "G", "mass", 1, [0, 0, 1, 0, 0, 0, 0], "g", null, false, "M", null, 1, false, false, 0, "grams; gm", "UCUM", "Mass", "Clinical", "", null, null, null, null, false], [true, "radian", "rad", "RAD", "plane angle", 1, [0, 0, 0, 1, 0, 0, 0], "rad", null, false, "A", null, 1, false, false, 0, "radians", "UCUM", "Angle", "Clinical", "unit of angular measure where 1 radian = 1/2\u03C0 turn =  57.296 degrees. ", null, null, null, null, false], [true, "degree Kelvin", "K", "K", "temperature", 1, [0, 0, 0, 0, 1, 0, 0], "K", null, false, "C", null, 1, false, false, 0, "Kelvin; degrees", "UCUM", "Temp", "Clinical", "absolute, thermodynamic temperature scale ", null, null, null, null, false], [true, "coulomb", "C", "C", "electric charge", 1, [0, 0, 0, 0, 0, 1, 0], "C", null, false, "Q", null, 1, false, false, 0, "coulombs", "UCUM", "", "Clinical", "defined as amount of 1 electron charge = 6.2415093\xD710^18 e, and equivalent to 1 Ampere-second", null, null, null, null, false], [true, "candela", "cd", "CD", "luminous intensity", 1, [0, 0, 0, 0, 0, 0, 1], "cd", null, false, "F", null, 1, false, false, 0, "candelas", "UCUM", "", "Clinical", "SI base unit of luminous intensity", null, null, null, null, false], [false, "the number ten for arbitrary powers", "10*", "10*", "number", 10, [0, 0, 0, 0, 0, 0, 0], "10", "dimless", false, null, null, 1, false, false, 0, "10^; 10 to the arbitrary powers", "UCUM", "Num", "Clinical", "10* by itself is the same as 10, but users can add digits after the *. For example, 10*3 = 1000.", "1", "1", "10", 10, false], [false, "the number ten for arbitrary powers", "10^", "10^", "number", 10, [0, 0, 0, 0, 0, 0, 0], "10", "dimless", false, null, null, 1, false, false, 0, "10*; 10 to the arbitrary power", "UCUM", "Num", "Clinical", "10* by itself is the same as 10, but users can add digits after the *. For example, 10*3 = 1000.", "1", "1", "10", 10, false], [false, "the number pi", "[pi]", "[PI]", "number", 3.141592653589793, [0, 0, 0, 0, 0, 0, 0], "\u03C0", "dimless", false, null, null, 1, false, false, 0, "\u03C0", "UCUM", "", "Constant", "a mathematical constant; the ratio of a circle's circumference to its diameter \u2248 3.14159", "1", "1", "3.1415926535897932384626433832795028841971693993751058209749445923", 3.141592653589793, false], [false, "", "%", "%", "fraction", 0.01, [0, 0, 0, 0, 0, 0, 0], "%", "dimless", false, null, null, 1, false, false, 0, "percents", "UCUM", "FR; NFR; MFR; CFR; SFR Rto; etc. ", "Clinical", "", "10*-2", "10*-2", "1", 1, false], [false, "parts per thousand", "[ppth]", "[PPTH]", "fraction", 0.001, [0, 0, 0, 0, 0, 0, 0], "ppth", "dimless", false, null, null, 1, false, false, 0, "ppth; 10^-3", "UCUM", "MCnc; MCnt", "Clinical", "[ppth] is often used in solution concentrations as 1 g/L or 1 g/kg.\n\nCan be ambigous and would be better if the metric units was used directly. ", "10*-3", "10*-3", "1", 1, false], [false, "parts per million", "[ppm]", "[PPM]", "fraction", 0.000001, [0, 0, 0, 0, 0, 0, 0], "ppm", "dimless", false, null, null, 1, false, false, 0, "ppm; 10^-6", "UCUM", "MCnt; MCnc; SFr", "Clinical", "[ppm] is often used in solution concentrations as 1 mg/L  or 1 mg/kg. Also used to express mole fractions as 1 mmol/mol.\n\n[ppm] is also used in nuclear magnetic resonance (NMR) to represent chemical shift - the difference of a measured frequency in parts per million from the reference frequency.\n\nCan be ambigous and would be better if the metric units was used directly. ", "10*-6", "10*-6", "1", 1, false], [false, "parts per billion", "[ppb]", "[PPB]", "fraction", 0.000000001, [0, 0, 0, 0, 0, 0, 0], "ppb", "dimless", false, null, null, 1, false, false, 0, "ppb; 10^-9", "UCUM", "MCnt; MCnc; SFr", "Clinical", "[ppb] is often used in solution concentrations as 1 ug/L  or 1 ug/kg. Also used to express mole fractions as 1 umol/mol.\n\nCan be ambigous and would be better if the metric units was used directly. ", "10*-9", "10*-9", "1", 1, false], [false, "parts per trillion", "[pptr]", "[PPTR]", "fraction", 0.000000000001, [0, 0, 0, 0, 0, 0, 0], "pptr", "dimless", false, null, null, 1, false, false, 0, "pptr; 10^-12", "UCUM", "MCnt; MCnc; SFr", "Clinical", "[pptr] is often used in solution concentrations as 1 ng/L or 1 ng/kg. Also used to express mole fractions as 1 nmol/mol.\n\nCan be ambigous and would be better if the metric units was used directly. ", "10*-12", "10*-12", "1", 1, false], [false, "mole", "mol", "MOL", "amount of substance", 602213670000000000000000, [0, 0, 0, 0, 0, 0, 0], "mol", "si", true, null, null, 1, false, false, 1, "moles", "UCUM", "Sub", "Clinical", "Measure the number of molecules ", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "steradian - solid angle", "sr", "SR", "solid angle", 1, [0, 0, 0, 2, 0, 0, 0], "sr", "si", true, null, null, 1, false, false, 0, "square radian; rad2; rad^2", "UCUM", "Angle", "Clinical", "unit of solid angle in three-dimensional geometry analagous to radian; used in photometry which measures the perceived brightness of object by human eye (e.g. radiant intensity = watt/steradian)", "rad2", "RAD2", "1", 1, false], [false, "hertz", "Hz", "HZ", "frequency", 1, [0, -1, 0, 0, 0, 0, 0], "Hz", "si", true, null, null, 1, false, false, 0, "Herz; frequency; frequencies", "UCUM", "Freq; Num", "Clinical", "equal to one cycle per second", "s-1", "S-1", "1", 1, false], [false, "newton", "N", "N", "force", 1000, [1, -2, 1, 0, 0, 0, 0], "N", "si", true, null, null, 1, false, false, 0, "Newtons", "UCUM", "Force", "Clinical", "unit of force with base units kg.m/s2", "kg.m/s2", "KG.M/S2", "1", 1, false], [false, "pascal", "Pa", "PAL", "pressure", 1000, [-1, -2, 1, 0, 0, 0, 0], "Pa", "si", true, null, null, 1, false, false, 0, "pascals", "UCUM", "Pres", "Clinical", "standard unit of pressure equal to 1 newton per square meter (N/m2)", "N/m2", "N/M2", "1", 1, false], [false, "joule", "J", "J", "energy", 1000, [2, -2, 1, 0, 0, 0, 0], "J", "si", true, null, null, 1, false, false, 0, "joules", "UCUM", "Enrg", "Clinical", "unit of energy defined as the work required to move an object 1 m with a force of 1 N (N.m) or an electric charge of 1 C through 1 V (C.V), or to produce 1 W for 1 s (W.s) ", "N.m", "N.M", "1", 1, false], [false, "watt", "W", "W", "power", 1000, [2, -3, 1, 0, 0, 0, 0], "W", "si", true, null, null, 1, false, false, 0, "watts", "UCUM", "EngRat", "Clinical", "unit of power equal to 1 Joule per second (J/s) =  kg\u22C5m2\u22C5s\u22123", "J/s", "J/S", "1", 1, false], [false, "Ampere", "A", "A", "electric current", 1, [0, -1, 0, 0, 0, 1, 0], "A", "si", true, null, null, 1, false, false, 0, "Amperes", "UCUM", "ElpotRat", "Clinical", "unit of electric current equal to flow rate of electrons equal to 16.2415\xD710^18 elementary charges moving past a boundary in one second or 1 Coulomb/second", "C/s", "C/S", "1", 1, false], [false, "volt", "V", "V", "electric potential", 1000, [2, -2, 1, 0, 0, -1, 0], "V", "si", true, null, null, 1, false, false, 0, "volts", "UCUM", "Elpot", "Clinical", "unit of electric potential (voltage) = 1 Joule per Coulomb (J/C)", "J/C", "J/C", "1", 1, false], [false, "farad", "F", "F", "electric capacitance", 0.001, [-2, 2, -1, 0, 0, 2, 0], "F", "si", true, null, null, 1, false, false, 0, "farads; electric capacitance", "UCUM", "", "Clinical", "CGS unit of electric capacitance with base units C/V (Coulomb per Volt)", "C/V", "C/V", "1", 1, false], [false, "ohm", "Ohm", "OHM", "electric resistance", 1000, [2, -1, 1, 0, 0, -2, 0], "\u03A9", "si", true, null, null, 1, false, false, 0, "\u03A9; resistance; ohms", "UCUM", "", "Clinical", "unit of electrical resistance with units of Volt per Ampere", "V/A", "V/A", "1", 1, false], [false, "siemens", "S", "SIE", "electric conductance", 0.001, [-2, 1, -1, 0, 0, 2, 0], "S", "si", true, null, null, 1, false, false, 0, "Reciprocal ohm; mho; \u03A9\u22121; conductance", "UCUM", "", "Clinical", "unit of electric conductance (the inverse of electrical resistance) equal to ohm^-1", "Ohm-1", "OHM-1", "1", 1, false], [false, "weber", "Wb", "WB", "magnetic flux", 1000, [2, -1, 1, 0, 0, -1, 0], "Wb", "si", true, null, null, 1, false, false, 0, "magnetic flux; webers", "UCUM", "", "Clinical", "unit of magnetic flux equal to Volt second", "V.s", "V.S", "1", 1, false], [false, "degree Celsius", "Cel", "CEL", "temperature", 1, [0, 0, 0, 0, 1, 0, 0], "\xB0C", "si", true, null, "Cel", 1, true, false, 0, "\xB0C; degrees", "UCUM", "Temp", "Clinical", "", "K", null, null, 1, false], [false, "tesla", "T", "T", "magnetic flux density", 1000, [0, -1, 1, 0, 0, -1, 0], "T", "si", true, null, null, 1, false, false, 0, "Teslas; magnetic field", "UCUM", "", "Clinical", "SI unit of magnetic field strength for magnetic field B equal to 1 Weber/square meter =  1 kg/(s2*A)", "Wb/m2", "WB/M2", "1", 1, false], [false, "henry", "H", "H", "inductance", 1000, [2, 0, 1, 0, 0, -2, 0], "H", "si", true, null, null, 1, false, false, 0, "henries; inductance", "UCUM", "", "Clinical", "unit of electrical inductance; usually expressed in millihenrys (mH) or microhenrys (uH).", "Wb/A", "WB/A", "1", 1, false], [false, "lumen", "lm", "LM", "luminous flux", 1, [0, 0, 0, 2, 0, 0, 1], "lm", "si", true, null, null, 1, false, false, 0, "luminous flux; lumens", "UCUM", "", "Clinical", "unit of luminous flux defined as 1 lm = 1 cd\u22C5sr (candela times sphere)", "cd.sr", "CD.SR", "1", 1, false], [false, "lux", "lx", "LX", "illuminance", 1, [-2, 0, 0, 2, 0, 0, 1], "lx", "si", true, null, null, 1, false, false, 0, "illuminance; luxes", "UCUM", "", "Clinical", "unit of illuminance equal to one lumen per square meter. ", "lm/m2", "LM/M2", "1", 1, false], [false, "becquerel", "Bq", "BQ", "radioactivity", 1, [0, -1, 0, 0, 0, 0, 0], "Bq", "si", true, null, null, 1, false, false, 0, "activity; radiation; becquerels", "UCUM", "", "Clinical", "measure of the atomic radiation rate with units s^-1", "s-1", "S-1", "1", 1, false], [false, "gray", "Gy", "GY", "energy dose", 1, [2, -2, 0, 0, 0, 0, 0], "Gy", "si", true, null, null, 1, false, false, 0, "absorbed doses; ionizing radiation doses; kerma; grays", "UCUM", "EngCnt", "Clinical", "unit of ionizing radiation dose with base units of 1 joule of radiation energy per kilogram of matter", "J/kg", "J/KG", "1", 1, false], [false, "sievert", "Sv", "SV", "dose equivalent", 1, [2, -2, 0, 0, 0, 0, 0], "Sv", "si", true, null, null, 1, false, false, 0, "sieverts; radiation dose quantities; equivalent doses; effective dose; operational dose; committed dose", "UCUM", "", "Clinical", "SI unit for radiation dose equivalent equal to 1 Joule/kilogram.", "J/kg", "J/KG", "1", 1, false], [false, "degree - plane angle", "deg", "DEG", "plane angle", 0.017453292519943295, [0, 0, 0, 1, 0, 0, 0], "\xB0", "iso1000", false, null, null, 1, false, false, 0, "\xB0; degree of arc; arc degree; arcdegree; angle", "UCUM", "Angle", "Clinical", "one degree is equivalent to \u03C0/180 radians.", "[pi].rad/360", "[PI].RAD/360", "2", 2, false], [false, "gon", "gon", "GON", "plane angle", 0.015707963267948967, [0, 0, 0, 1, 0, 0, 0], "\u25A1<sup>g</sup>", "iso1000", false, null, null, 1, false, false, 0, "gon (grade); gons", "UCUM", "Angle", "Nonclinical", "unit of plane angle measurement equal to 1/400 circle", "deg", "DEG", "0.9", 0.9, false], [false, "arc minute", "'", "'", "plane angle", 0.0002908882086657216, [0, 0, 0, 1, 0, 0, 0], "'", "iso1000", false, null, null, 1, false, false, 0, "arcminutes; arcmin; arc minutes; arc mins", "UCUM", "Angle", "Clinical", "equal to 1/60 degree; used in optometry and opthamology (e.g. visual acuity tests)", "deg/60", "DEG/60", "1", 1, false], [false, "arc second", "''", "''", "plane angle", 0.00000484813681109536, [0, 0, 0, 1, 0, 0, 0], "''", "iso1000", false, null, null, 1, false, false, 0, "arcseconds; arcsecs", "UCUM", "Angle", "Clinical", "equal to 1/60 arcminute = 1/3600 degree; used in optometry and opthamology (e.g. visual acuity tests)", "'/60", "'/60", "1", 1, false], [false, "Liters", "l", "L", "volume", 0.001, [3, 0, 0, 0, 0, 0, 0], "l", "iso1000", true, null, null, 1, false, false, 0, "cubic decimeters; decimeters cubed; decimetres; dm3; dm^3; litres; liters, LT ", "UCUM", "Vol", "Clinical", "Because lower case \"l\" can be read as the number \"1\", though this is a valid UCUM units. UCUM strongly reccomends using  \"L\"", "dm3", "DM3", "1", 1, false], [false, "Liters", "L", "L", "volume", 0.001, [3, 0, 0, 0, 0, 0, 0], "L", "iso1000", true, null, null, 1, false, false, 0, "cubic decimeters; decimeters cubed; decimetres; dm3; dm^3; litres; liters, LT ", "UCUM", "Vol", "Clinical", "Because lower case \"l\" can be read as the number \"1\", though this is a valid UCUM units. UCUM strongly reccomends using  \"L\"", "l", null, "1", 1, false], [false, "are", "ar", "AR", "area", 100, [2, 0, 0, 0, 0, 0, 0], "a", "iso1000", true, null, null, 1, false, false, 0, "100 m2; 100 m^2; 100 square meter; meters squared; metres", "UCUM", "Area", "Clinical", "metric base unit for area defined as 100 m^2", "m2", "M2", "100", 100, false], [false, "minute", "min", "MIN", "time", 60, [0, 1, 0, 0, 0, 0, 0], "min", "iso1000", false, null, null, 1, false, false, 0, "minutes", "UCUM", "Time", "Clinical", "", "s", "S", "60", 60, false], [false, "hour", "h", "HR", "time", 3600, [0, 1, 0, 0, 0, 0, 0], "h", "iso1000", false, null, null, 1, false, false, 0, "hours; hrs; age", "UCUM", "Time", "Clinical", "", "min", "MIN", "60", 60, false], [false, "day", "d", "D", "time", 86400, [0, 1, 0, 0, 0, 0, 0], "d", "iso1000", false, null, null, 1, false, false, 0, "days; age; dy; 24 hours; 24 hrs", "UCUM", "Time", "Clinical", "", "h", "HR", "24", 24, false], [false, "tropical year", "a_t", "ANN_T", "time", 31556925.216, [0, 1, 0, 0, 0, 0, 0], "a<sub>t</sub>", "iso1000", false, null, null, 1, false, false, 0, "solar years; a tropical; years", "UCUM", "Time", "Clinical", "has an average of 365.242181 days but is constantly changing.", "d", "D", "365.24219", 365.24219, false], [false, "mean Julian year", "a_j", "ANN_J", "time", 31557600, [0, 1, 0, 0, 0, 0, 0], "a<sub>j</sub>", "iso1000", false, null, null, 1, false, false, 0, "mean Julian yr; a julian; years", "UCUM", "Time", "Clinical", "has an average of 365.25 days, and in everyday use, has been replaced by the Gregorian year. However, this unit is used in astronomy to calculate light year. ", "d", "D", "365.25", 365.25, false], [false, "mean Gregorian year", "a_g", "ANN_G", "time", 31556952, [0, 1, 0, 0, 0, 0, 0], "a<sub>g</sub>", "iso1000", false, null, null, 1, false, false, 0, "mean Gregorian yr; a gregorian; years", "UCUM", "Time", "Clinical", "has an average of 365.2425 days and is the most internationally used civil calendar.", "d", "D", "365.2425", 365.2425, false], [false, "year", "a", "ANN", "time", 31557600, [0, 1, 0, 0, 0, 0, 0], "a", "iso1000", false, null, null, 1, false, false, 0, "years; a; yr, yrs; annum", "UCUM", "Time", "Clinical", "", "a_j", "ANN_J", "1", 1, false], [false, "week", "wk", "WK", "time", 604800, [0, 1, 0, 0, 0, 0, 0], "wk", "iso1000", false, null, null, 1, false, false, 0, "weeks; wks", "UCUM", "Time", "Clinical", "", "d", "D", "7", 7, false], [false, "synodal month", "mo_s", "MO_S", "time", 2551442.976, [0, 1, 0, 0, 0, 0, 0], "mo<sub>s</sub>", "iso1000", false, null, null, 1, false, false, 0, "Moon; synodic month; lunar month; mo-s; mo s; months; moons", "UCUM", "Time", "Nonclinical", "has an average of 29.53 days per month, unit used in astronomy", "d", "D", "29.53059", 29.53059, false], [false, "mean Julian month", "mo_j", "MO_J", "time", 2629800, [0, 1, 0, 0, 0, 0, 0], "mo<sub>j</sub>", "iso1000", false, null, null, 1, false, false, 0, "mo-julian; mo Julian; months", "UCUM", "Time", "Clinical", "has an average of 30.435 days per month", "a_j/12", "ANN_J/12", "1", 1, false], [false, "mean Gregorian month", "mo_g", "MO_G", "time", 2629746, [0, 1, 0, 0, 0, 0, 0], "mo<sub>g</sub>", "iso1000", false, null, null, 1, false, false, 0, "months; month-gregorian; mo-gregorian", "UCUM", "Time", "Clinical", "has an average 30.436875 days per month and is from the most internationally used civil calendar.", "a_g/12", "ANN_G/12", "1", 1, false], [false, "month", "mo", "MO", "time", 2629800, [0, 1, 0, 0, 0, 0, 0], "mo", "iso1000", false, null, null, 1, false, false, 0, "months; duration", "UCUM", "Time", "Clinical", "based on Julian calendar which has an average of 30.435 days per month (this unit is used in astronomy but not in everyday life - see mo_g)", "mo_j", "MO_J", "1", 1, false], [false, "metric ton", "t", "TNE", "mass", 1e6, [0, 0, 1, 0, 0, 0, 0], "t", "iso1000", true, null, null, 1, false, false, 0, "tonnes; megagrams; tons", "UCUM", "Mass", "Nonclinical", "equal to 1000 kg used in the US (recognized by NIST as metric ton), and internationally (recognized as tonne)", "kg", "KG", "1e3", 1000, false], [false, "bar", "bar", "BAR", "pressure", 1e8, [-1, -2, 1, 0, 0, 0, 0], "bar", "iso1000", true, null, null, 1, false, false, 0, "bars", "UCUM", "Pres", "Nonclinical", "unit of pressure equal to 10^5 Pascals, primarily used by meteorologists and in weather forecasting", "Pa", "PAL", "1e5", 1e5, false], [false, "unified atomic mass unit", "u", "AMU", "mass", 0.0000000000000000000000016605402, [0, 0, 1, 0, 0, 0, 0], "u", "iso1000", true, null, null, 1, false, false, 0, "unified atomic mass units; amu; Dalton; Da", "UCUM", "Mass", "Clinical", "the mass of 1/12 of an unbound Carbon-12 atom nuclide equal to 1.6606x10^-27 kg ", "g", "G", "1.6605402e-24", 0.0000000000000000000000016605402, false], [false, "astronomic unit", "AU", "ASU", "length", 149597870691, [1, 0, 0, 0, 0, 0, 0], "AU", "iso1000", false, null, null, 1, false, false, 0, "AU; units", "UCUM", "Len", "Clinical", "unit of length used in astronomy for measuring distance in Solar system", "Mm", "MAM", "149597.870691", 149597.870691, false], [false, "parsec", "pc", "PRS", "length", 30856780000000000, [1, 0, 0, 0, 0, 0, 0], "pc", "iso1000", true, null, null, 1, false, false, 0, "parsecs", "UCUM", "Len", "Clinical", "unit of length equal to 3.26 light years, nad used to measure large distances to objects outside our Solar System", "m", "M", "3.085678e16", 30856780000000000, false], [false, "velocity of light in a vacuum", "[c]", "[C]", "velocity", 299792458, [1, -1, 0, 0, 0, 0, 0], "<i>c</i>", "const", true, null, null, 1, false, false, 0, "speed of light", "UCUM", "Vel", "Constant", "equal to 299792458 m/s (approximately 3 x 10^8 m/s)", "m/s", "M/S", "299792458", 299792458, false], [false, "Planck constant", "[h]", "[H]", "action", 0.00000000000000000000000000000066260755, [2, -1, 1, 0, 0, 0, 0], "<i>h</i>", "const", true, null, null, 1, false, false, 0, "Planck's constant", "UCUM", "", "Constant", "constant = 6.62607004 \xD7 10-34 m2.kg/s; defined as quantum of action", "J.s", "J.S", "6.6260755e-34", 0.00000000000000000000000000000000066260755, false], [false, "Boltzmann constant", "[k]", "[K]", "(unclassified)", 0.00000000000000000001380658, [2, -2, 1, 0, -1, 0, 0], "<i>k</i>", "const", true, null, null, 1, false, false, 0, "k; kB", "UCUM", "", "Constant", "physical constant relating energy at the individual particle level with temperature = 1.38064852 \xD710^\u221223 J/K", "J/K", "J/K", "1.380658e-23", 0.00000000000000000000001380658, false], [false, "permittivity of vacuum - electric", "[eps_0]", "[EPS_0]", "electric permittivity", 0.000000000000008854187817000001, [-3, 2, -1, 0, 0, 2, 0], "<i>\u03B5<sub><r>0</r></sub></i>", "const", true, null, null, 1, false, false, 0, "\u03B50; Electric Constant; vacuum permittivity; permittivity of free space ", "UCUM", "", "Constant", "approximately equal to 8.854\u2009\xD7 10^\u221212 F/m (farads per meter)", "F/m", "F/M", "8.854187817e-12", 0.000000000008854187817, false], [false, "permeability of vacuum - magnetic", "[mu_0]", "[MU_0]", "magnetic permeability", 0.0012566370614359172, [1, 0, 1, 0, 0, -2, 0], "<i>\u03BC<sub><r>0</r></sub></i>", "const", true, null, null, 1, false, false, 0, "\u03BC0; vacuum permeability; permeability of free space; magnetic constant", "UCUM", "", "Constant", "equal to 4\u03C0\xD710^\u22127 N/A2 (Newtons per square ampere) \u2248 1.2566\xD710^\u22126 H/m (Henry per meter)", "N/A2", "4.[PI].10*-7.N/A2", "1", 0.0000012566370614359173, false], [false, "elementary charge", "[e]", "[E]", "electric charge", 0.000000000000000000160217733, [0, 0, 0, 0, 0, 1, 0], "<i>e</i>", "const", true, null, null, 1, false, false, 0, "e; q; electric charges", "UCUM", "", "Constant", "the magnitude of the electric charge carried by a single electron or proton \u2248 1.60217\xD710^-19 Coulombs", "C", "C", "1.60217733e-19", 0.000000000000000000160217733, false], [false, "electronvolt", "eV", "EV", "energy", 0.000000000000000160217733, [2, -2, 1, 0, 0, 0, 0], "eV", "iso1000", true, null, null, 1, false, false, 0, "Electron Volts; electronvolts", "UCUM", "Eng", "Clinical", "unit of kinetic energy = 1 V * 1.602\xD710^\u221219 C = 1.6\xD710\u221219 Joules", "[e].V", "[E].V", "1", 1, false], [false, "electron mass", "[m_e]", "[M_E]", "mass", 0.00000000000000000000000000091093897, [0, 0, 1, 0, 0, 0, 0], "<i>m<sub><r>e</r></sub></i>", "const", true, null, null, 1, false, false, 0, "electron rest mass; me", "UCUM", "Mass", "Constant", "approximately equal to 9.10938356 \xD7 10-31 kg; defined as the mass of a stationary electron", "g", "g", "9.1093897e-28", 0.00000000000000000000000000091093897, false], [false, "proton mass", "[m_p]", "[M_P]", "mass", 0.0000000000000000000000016726231, [0, 0, 1, 0, 0, 0, 0], "<i>m<sub><r>p</r></sub></i>", "const", true, null, null, 1, false, false, 0, "mp; masses", "UCUM", "Mass", "Constant", "approximately equal to 1.672622\xD710\u221227 kg", "g", "g", "1.6726231e-24", 0.0000000000000000000000016726231, false], [false, "Newtonian constant of gravitation", "[G]", "[GC]", "(unclassified)", 0.0000000000000667259, [3, -2, -1, 0, 0, 0, 0], "<i>G</i>", "const", true, null, null, 1, false, false, 0, "G; gravitational constant; Newton's constant", "UCUM", "", "Constant", "gravitational constant = 6.674\xD710\u221211 N\u22C5m2/kg2", "m3.kg-1.s-2", "M3.KG-1.S-2", "6.67259e-11", 0.0000000000667259, false], [false, "standard acceleration of free fall", "[g]", "[G]", "acceleration", 9.80665, [1, -2, 0, 0, 0, 0, 0], "<i>g<sub>n</sub></i>", "const", true, null, null, 1, false, false, 0, "standard gravity; g; \u02610; \u0261n", "UCUM", "Accel", "Constant", "defined by standard = 9.80665 m/s2", "m/s2", "M/S2", "980665e-5", 9.80665, false], [false, "Torr", "Torr", "Torr", "pressure", 133322, [-1, -2, 1, 0, 0, 0, 0], "Torr", "const", false, null, null, 1, false, false, 0, "torrs", "UCUM", "Pres", "Clinical", "1 torr = 1 mmHg; unit used to measure blood pressure", "Pa", "PAL", "133.322", 133.322, false], [false, "standard atmosphere", "atm", "ATM", "pressure", 101325000, [-1, -2, 1, 0, 0, 0, 0], "atm", "const", false, null, null, 1, false, false, 0, "reference pressure; atmos; std atmosphere", "UCUM", "Pres", "Clinical", "defined as being precisely equal to 101,325 Pa", "Pa", "PAL", "101325", 101325, false], [false, "light-year", "[ly]", "[LY]", "length", 9460730472580800, [1, 0, 0, 0, 0, 0, 0], "l.y.", "const", true, null, null, 1, false, false, 0, "light years; ly", "UCUM", "Len", "Constant", "unit of astronomal distance = 5.88\xD710^12 mi", "[c].a_j", "[C].ANN_J", "1", 1, false], [false, "gram-force", "gf", "GF", "force", 9.80665, [1, -2, 1, 0, 0, 0, 0], "gf", "const", true, null, null, 1, false, false, 0, "Newtons; gram forces", "UCUM", "Force", "Clinical", "May be specific to unit related to cardiac output", "g.[g]", "G.[G]", "1", 1, false], [false, "Kayser", "Ky", "KY", "lineic number", 100, [-1, 0, 0, 0, 0, 0, 0], "K", "cgs", true, null, null, 1, false, false, 0, "wavenumbers; kaysers", "UCUM", "InvLen", "Clinical", "unit of wavelength equal to cm^-1", "cm-1", "CM-1", "1", 1, false], [false, "Gal", "Gal", "GL", "acceleration", 0.01, [1, -2, 0, 0, 0, 0, 0], "Gal", "cgs", true, null, null, 1, false, false, 0, "galileos; Gals", "UCUM", "Accel", "Clinical", "unit of acceleration used in gravimetry; equivalent to cm/s2 ", "cm/s2", "CM/S2", "1", 1, false], [false, "dyne", "dyn", "DYN", "force", 0.01, [1, -2, 1, 0, 0, 0, 0], "dyn", "cgs", true, null, null, 1, false, false, 0, "dynes", "UCUM", "Force", "Clinical", "unit of force equal to 10^-5 Newtons", "g.cm/s2", "G.CM/S2", "1", 1, false], [false, "erg", "erg", "ERG", "energy", 0.0001, [2, -2, 1, 0, 0, 0, 0], "erg", "cgs", true, null, null, 1, false, false, 0, "10^-7 Joules, 10-7 Joules; 100 nJ; 100 nanoJoules; 1 dyne cm; 1 g.cm2/s2", "UCUM", "Eng", "Clinical", "unit of energy = 1 dyne centimeter = 10^-7 Joules", "dyn.cm", "DYN.CM", "1", 1, false], [false, "Poise", "P", "P", "dynamic viscosity", 100, [-1, -1, 1, 0, 0, 0, 0], "P", "cgs", true, null, null, 1, false, false, 0, "dynamic viscosity; poises", "UCUM", "Visc", "Clinical", "unit of dynamic viscosity where 1 Poise = 1/10 Pascal second", "dyn.s/cm2", "DYN.S/CM2", "1", 1, false], [false, "Biot", "Bi", "BI", "electric current", 10, [0, -1, 0, 0, 0, 1, 0], "Bi", "cgs", true, null, null, 1, false, false, 0, "Bi; abamperes; abA", "UCUM", "ElpotRat", "Clinical", "equal to 10 amperes", "A", "A", "10", 10, false], [false, "Stokes", "St", "ST", "kinematic viscosity", 0.0001, [2, -1, 0, 0, 0, 0, 0], "St", "cgs", true, null, null, 1, false, false, 0, "kinematic viscosity", "UCUM", "Visc", "Clinical", "unit of kimematic viscosity with units cm2/s", "cm2/s", "CM2/S", "1", 1, false], [false, "Maxwell", "Mx", "MX", "flux of magnetic induction", 0.00001, [2, -1, 1, 0, 0, -1, 0], "Mx", "cgs", true, null, null, 1, false, false, 0, "magnetix flux; Maxwells", "UCUM", "", "Clinical", "unit of magnetic flux", "Wb", "WB", "1e-8", 0.00000001, false], [false, "Gauss", "G", "GS", "magnetic flux density", 0.1, [0, -1, 1, 0, 0, -1, 0], "Gs", "cgs", true, null, null, 1, false, false, 0, "magnetic fields; magnetic flux density; induction; B", "UCUM", "magnetic", "Clinical", "CGS unit of magnetic flux density, known as magnetic field B; defined as one maxwell unit per square centimeter (see Oersted for CGS unit for H field)", "T", "T", "1e-4", 0.0001, false], [false, "Oersted", "Oe", "OE", "magnetic field intensity", 79.57747154594767, [-1, -1, 0, 0, 0, 1, 0], "Oe", "cgs", true, null, null, 1, false, false, 0, "H magnetic B field; Oersteds", "UCUM", "", "Clinical", "CGS unit of the auxiliary magnetic field H defined as 1 dyne per unit pole = 1000/4\u03C0 amperes per meter (see Gauss for CGS unit for B field)", "A/m", "/[PI].A/M", "250", 79.57747154594767, false], [false, "Gilbert", "Gb", "GB", "magnetic tension", 0.7957747154594768, [0, -1, 0, 0, 0, 1, 0], "Gb", "cgs", true, null, null, 1, false, false, 0, "Gi; magnetomotive force; Gilberts", "UCUM", "", "Clinical", "unit of magnetomotive force (magnetic potential)", "Oe.cm", "OE.CM", "1", 1, false], [false, "stilb", "sb", "SB", "lum. intensity density", 1e4, [-2, 0, 0, 0, 0, 0, 1], "sb", "cgs", true, null, null, 1, false, false, 0, "stilbs", "UCUM", "", "Obsolete", "unit of luminance; equal to and replaced by unit candela per square centimeter (cd/cm2)", "cd/cm2", "CD/CM2", "1", 1, false], [false, "Lambert", "Lmb", "LMB", "brightness", 3183.098861837907, [-2, 0, 0, 0, 0, 0, 1], "L", "cgs", true, null, null, 1, false, false, 0, "luminance; lamberts", "UCUM", "", "Clinical", "unit of luminance defined as 1 lambert = 1/ \u03C0 candela per square meter", "cd/cm2/[pi]", "CD/CM2/[PI]", "1", 1, false], [false, "phot", "ph", "PHT", "illuminance", 0.0001, [-2, 0, 0, 2, 0, 0, 1], "ph", "cgs", true, null, null, 1, false, false, 0, "phots", "UCUM", "", "Clinical", "CGS photometric unit of illuminance, or luminous flux through an area equal to 10000 lumens per square meter = 10000 lux", "lx", "LX", "1e-4", 0.0001, false], [false, "Curie", "Ci", "CI", "radioactivity", 37000000000, [0, -1, 0, 0, 0, 0, 0], "Ci", "cgs", true, null, null, 1, false, false, 0, "curies", "UCUM", "", "Obsolete", "unit for measuring atomic disintegration rate; replaced by the Bequerel (Bq) unit", "Bq", "BQ", "37e9", 37000000000, false], [false, "Roentgen", "R", "ROE", "ion dose", 0.000000258, [0, 0, -1, 0, 0, 1, 0], "R", "cgs", true, null, null, 1, false, false, 0, "r\xF6ntgen; Roentgens", "UCUM", "", "Clinical", "unit of exposure of X-rays and gamma rays in air; unit used primarily in the US but strongly discouraged by NIST", "C/kg", "C/KG", "2.58e-4", 0.000258, false], [false, "radiation absorbed dose", "RAD", "[RAD]", "energy dose", 0.01, [2, -2, 0, 0, 0, 0, 0], "RAD", "cgs", true, null, null, 1, false, false, 0, "doses", "UCUM", "", "Clinical", "unit of radiation absorbed dose used primarily in the US with base units 100 ergs per gram of material. Also see the SI unit Gray (Gy).", "erg/g", "ERG/G", "100", 100, false], [false, "radiation equivalent man", "REM", "[REM]", "dose equivalent", 0.01, [2, -2, 0, 0, 0, 0, 0], "REM", "cgs", true, null, null, 1, false, false, 0, "Roentgen Equivalent in Man; rems; dose equivalents", "UCUM", "", "Clinical", "unit of equivalent dose which measures the effect of radiation on humans equal to 0.01 sievert. Used primarily in the US. Also see SI unit Sievert (Sv)", "RAD", "[RAD]", "1", 1, false], [false, "inch", "[in_i]", "[IN_I]", "length", 0.025400000000000002, [1, 0, 0, 0, 0, 0, 0], "in", "intcust", false, null, null, 1, false, false, 0, "inches; in; international inch; body height", "UCUM", "Len", "Clinical", "standard unit for inch in the US and internationally", "cm", "CM", "254e-2", 2.54, false], [false, "foot", "[ft_i]", "[FT_I]", "length", 0.3048, [1, 0, 0, 0, 0, 0, 0], "ft", "intcust", false, null, null, 1, false, false, 0, "ft; fts; foot; international foot; feet; international feet; height", "UCUM", "Len", "Clinical", "unit used in the US and internationally", "[in_i]", "[IN_I]", "12", 12, false], [false, "yard", "[yd_i]", "[YD_I]", "length", 0.9144000000000001, [1, 0, 0, 0, 0, 0, 0], "yd", "intcust", false, null, null, 1, false, false, 0, "international yards; yds; distance", "UCUM", "Len", "Clinical", "standard unit used in the US and internationally", "[ft_i]", "[FT_I]", "3", 3, false], [false, "mile", "[mi_i]", "[MI_I]", "length", 1609.344, [1, 0, 0, 0, 0, 0, 0], "mi", "intcust", false, null, null, 1, false, false, 0, "international miles; mi I; statute mile", "UCUM", "Len", "Clinical", "standard unit used in the US and internationally", "[ft_i]", "[FT_I]", "5280", 5280, false], [false, "fathom", "[fth_i]", "[FTH_I]", "depth of water", 1.8288000000000002, [1, 0, 0, 0, 0, 0, 0], "fth", "intcust", false, null, null, 1, false, false, 0, "international fathoms", "UCUM", "Len", "Nonclinical", "unit used in the US and internationally to measure depth of water; same length as the US fathom", "[ft_i]", "[FT_I]", "6", 6, false], [false, "nautical mile", "[nmi_i]", "[NMI_I]", "length", 1852, [1, 0, 0, 0, 0, 0, 0], "n.mi", "intcust", false, null, null, 1, false, false, 0, "nautical mile; nautical miles; international nautical mile; international nautical miles; nm; n.m.; nmi", "UCUM", "Len", "Nonclinical", "standard unit used in the US and internationally", "m", "M", "1852", 1852, false], [false, "knot", "[kn_i]", "[KN_I]", "velocity", 0.5144444444444445, [1, -1, 0, 0, 0, 0, 0], "knot", "intcust", false, null, null, 1, false, false, 0, "kn; kt; international knots", "UCUM", "Vel", "Nonclinical", "defined as equal to one nautical mile (1.852 km) per hour", "[nmi_i]/h", "[NMI_I]/H", "1", 1, false], [false, "square inch", "[sin_i]", "[SIN_I]", "area", 0.0006451600000000001, [2, 0, 0, 0, 0, 0, 0], null, "intcust", false, null, null, 1, false, false, 0, "in2; in^2; inches squared; sq inch; inches squared; international", "UCUM", "Area", "Clinical", "standard unit used in the US and internationally", "[in_i]2", "[IN_I]2", "1", 1, false], [false, "square foot", "[sft_i]", "[SFT_I]", "area", 0.09290304, [2, 0, 0, 0, 0, 0, 0], null, "intcust", false, null, null, 1, false, false, 0, "ft2; ft^2; ft squared; sq ft; feet; international", "UCUM", "Area", "Clinical", "standard unit used in the US and internationally", "[ft_i]2", "[FT_I]2", "1", 1, false], [false, "square yard", "[syd_i]", "[SYD_I]", "area", 0.8361273600000002, [2, 0, 0, 0, 0, 0, 0], null, "intcust", false, null, null, 1, false, false, 0, "yd2; yd^2; sq. yds; yards squared; international", "UCUM", "Area", "Clinical", "standard unit used in the US and internationally", "[yd_i]2", "[YD_I]2", "1", 1, false], [false, "cubic inch", "[cin_i]", "[CIN_I]", "volume", 0.000016387064000000003, [3, 0, 0, 0, 0, 0, 0], null, "intcust", false, null, null, 1, false, false, 0, "in3; in^3; in*3; inches^3; inches*3; cu. in; cu in; cubic inches; inches cubed; cin", "UCUM", "Vol", "Clinical", "standard unit used in the US and internationally", "[in_i]3", "[IN_I]3", "1", 1, false], [false, "cubic foot", "[cft_i]", "[CFT_I]", "volume", 0.028316846592000004, [3, 0, 0, 0, 0, 0, 0], null, "intcust", false, null, null, 1, false, false, 0, "ft3; ft^3; ft*3; cu. ft; cubic feet; cubed; [ft_i]3; international", "UCUM", "Vol", "Clinical", "", "[ft_i]3", "[FT_I]3", "1", 1, false], [false, "cubic yard", "[cyd_i]", "[CYD_I]", "volume", 0.7645548579840002, [3, 0, 0, 0, 0, 0, 0], "cu.yd", "intcust", false, null, null, 1, false, false, 0, "cubic yards; cubic yds; cu yards; CYs; yards^3; yd^3; yds^3; yd3; yds3", "UCUM", "Vol", "Nonclinical", "standard unit used in the US and internationally", "[yd_i]3", "[YD_I]3", "1", 1, false], [false, "board foot", "[bf_i]", "[BF_I]", "volume", 0.002359737216, [3, 0, 0, 0, 0, 0, 0], null, "intcust", false, null, null, 1, false, false, 0, "BDFT; FBM; BF; board feet; international", "UCUM", "Vol", "Nonclinical", "unit of volume used to measure lumber", "[in_i]3", "[IN_I]3", "144", 144, false], [false, "cord", "[cr_i]", "[CR_I]", "volume", 3.6245563637760005, [3, 0, 0, 0, 0, 0, 0], null, "intcust", false, null, null, 1, false, false, 0, "crd I; international cords", "UCUM", "Vol", "Nonclinical", "unit of measure of dry volume used to measure firewood equal 128 ft3", "[ft_i]3", "[FT_I]3", "128", 128, false], [false, "mil", "[mil_i]", "[MIL_I]", "length", 0.000025400000000000004, [1, 0, 0, 0, 0, 0, 0], "mil", "intcust", false, null, null, 1, false, false, 0, "thou, thousandth; mils; international", "UCUM", "Len", "Clinical", "equal to 0.001 international inch", "[in_i]", "[IN_I]", "1e-3", 0.001, false], [false, "circular mil", "[cml_i]", "[CML_I]", "area", 0.0000000005067074790974979, [2, 0, 0, 0, 0, 0, 0], "circ.mil", "intcust", false, null, null, 1, false, false, 0, "circular mils; cml I; international", "UCUM", "Area", "Clinical", "", "[pi]/4.[mil_i]2", "[PI]/4.[MIL_I]2", "1", 1, false], [false, "hand", "[hd_i]", "[HD_I]", "height of horses", 0.10160000000000001, [1, 0, 0, 0, 0, 0, 0], "hd", "intcust", false, null, null, 1, false, false, 0, "hands; international", "UCUM", "Len", "Nonclinical", "used to measure horse height", "[in_i]", "[IN_I]", "4", 4, false], [false, "foot - US", "[ft_us]", "[FT_US]", "length", 0.3048006096012192, [1, 0, 0, 0, 0, 0, 0], "ft<sub>us</sub>", "us-lengths", false, null, null, 1, false, false, 0, "US foot; foot US; us ft; ft us; height; visual distance; feet", "UCUM", "Len", "Obsolete", "Better to use [ft_i] which refers to the length used worldwide, including in the US;  [ft_us] may be confused with land survey units. ", "m/3937", "M/3937", "1200", 1200, false], [false, "yard - US", "[yd_us]", "[YD_US]", "length", 0.9144018288036575, [1, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "US yards; us yds; distance", "UCUM", "Len; Nrat", "Obsolete", "Better to use [yd_i] which refers to the length used worldwide, including in the US; [yd_us] refers to unit used in land surveys in the US", "[ft_us]", "[FT_US]", "3", 3, false], [false, "inch - US", "[in_us]", "[IN_US]", "length", 0.0254000508001016, [1, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "US inches; in us; us in; inch US", "UCUM", "Len", "Obsolete", "Better to use [in_i] which refers to the length used worldwide, including in the US", "[ft_us]/12", "[FT_US]/12", "1", 1, false], [false, "rod - US", "[rd_us]", "[RD_US]", "length", 5.029210058420117, [1, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "US rod; US rods; rd US; US rd", "UCUM", "Len", "Obsolete", "", "[ft_us]", "[FT_US]", "16.5", 16.5, false], [false, "Gunter's chain - US", "[ch_us]", "[CH_US]", "length", 20.116840233680467, [1, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "surveyor's chain; Surveyor's chain USA; Gunter\u2019s measurement; surveyor\u2019s measurement; Gunter's Chain USA", "UCUM", "Len", "Obsolete", "historical unit used for land survey used only in the US", "[rd_us]", "[RD_US]", "4", 4, false], [false, "link for Gunter's chain - US", "[lk_us]", "[LK_US]", "length", 0.20116840233680466, [1, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "Links for Gunter's Chain USA", "UCUM", "Len", "Obsolete", "", "[ch_us]/100", "[CH_US]/100", "1", 1, false], [false, "Ramden's chain - US", "[rch_us]", "[RCH_US]", "length", 30.480060960121918, [1, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "Ramsden's chain; engineer's chains", "UCUM", "Len", "Obsolete", "distance measuring device used for\xA0land survey", "[ft_us]", "[FT_US]", "100", 100, false], [false, "link for Ramden's chain - US", "[rlk_us]", "[RLK_US]", "length", 0.3048006096012192, [1, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "links for Ramsden's chain", "UCUM", "Len", "Obsolete", "", "[rch_us]/100", "[RCH_US]/100", "1", 1, false], [false, "fathom - US", "[fth_us]", "[FTH_US]", "length", 1.828803657607315, [1, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "US fathoms; fathom USA; fth us", "UCUM", "Len", "Obsolete", "same length as the international fathom - better to use international fathom ([fth_i])", "[ft_us]", "[FT_US]", "6", 6, false], [false, "furlong - US", "[fur_us]", "[FUR_US]", "length", 201.16840233680466, [1, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "US furlongs; fur us", "UCUM", "Len", "Nonclinical", "distance unit in horse racing", "[rd_us]", "[RD_US]", "40", 40, false], [false, "mile - US", "[mi_us]", "[MI_US]", "length", 1609.3472186944373, [1, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "U.S. Survey Miles; US statute miles; survey mi; US mi; distance", "UCUM", "Len", "Nonclinical", "Better to use [mi_i] which refers to the length used worldwide, including in the US", "[fur_us]", "[FUR_US]", "8", 8, false], [false, "acre - US", "[acr_us]", "[ACR_US]", "area", 4046.872609874252, [2, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "Acre USA Survey; Acre USA; survey acres", "UCUM", "Area", "Nonclinical", "an older unit based on pre 1959 US statute lengths that is still sometimes used in the US only for land survey purposes. ", "[rd_us]2", "[RD_US]2", "160", 160, false], [false, "square rod - US", "[srd_us]", "[SRD_US]", "area", 25.292953811714074, [2, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "rod2; rod^2; sq. rod; rods squared", "UCUM", "Area", "Nonclinical", "Used only in the US to measure land area, based on US statute land survey length units", "[rd_us]2", "[RD_US]2", "1", 1, false], [false, "square mile - US", "[smi_us]", "[SMI_US]", "area", 2589998.470319521, [2, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "mi2; mi^2; sq mi; miles squared", "UCUM", "Area", "Nonclinical", "historical unit used only in the US for land survey purposes (based on the US survey mile), not the internationally recognized [mi_i]", "[mi_us]2", "[MI_US]2", "1", 1, false], [false, "section", "[sct]", "[SCT]", "area", 2589998.470319521, [2, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "sct; sections", "UCUM", "Area", "Nonclinical", "tract of land approximately equal to 1 mile square containing 640 acres", "[mi_us]2", "[MI_US]2", "1", 1, false], [false, "township", "[twp]", "[TWP]", "area", 93239944.93150276, [2, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "twp; townships", "UCUM", "Area", "Nonclinical", "land measurement equal to 6 mile square", "[sct]", "[SCT]", "36", 36, false], [false, "mil - US", "[mil_us]", "[MIL_US]", "length", 0.0000254000508001016, [1, 0, 0, 0, 0, 0, 0], null, "us-lengths", false, null, null, 1, false, false, 0, "thou, thousandth; mils", "UCUM", "Len", "Obsolete", "better to use [mil_i] which is based on the internationally recognized inch", "[in_us]", "[IN_US]", "1e-3", 0.001, false], [false, "inch - British", "[in_br]", "[IN_BR]", "length", 0.025399980000000003, [1, 0, 0, 0, 0, 0, 0], null, "brit-length", false, null, null, 1, false, false, 0, "imperial inches; imp in; br in; british inches", "UCUM", "Len", "Obsolete", "", "cm", "CM", "2.539998", 2.539998, false], [false, "foot - British", "[ft_br]", "[FT_BR]", "length", 0.30479976000000003, [1, 0, 0, 0, 0, 0, 0], null, "brit-length", false, null, null, 1, false, false, 0, "British Foot; Imperial Foot; feet; imp fts; br fts", "UCUM", "Len", "Obsolete", "", "[in_br]", "[IN_BR]", "12", 12, false], [false, "rod - British", "[rd_br]", "[RD_BR]", "length", 5.02919604, [1, 0, 0, 0, 0, 0, 0], null, "brit-length", false, null, null, 1, false, false, 0, "British rods; br rd", "UCUM", "Len", "Obsolete", "", "[ft_br]", "[FT_BR]", "16.5", 16.5, false], [false, "Gunter's chain - British", "[ch_br]", "[CH_BR]", "length", 20.11678416, [1, 0, 0, 0, 0, 0, 0], null, "brit-length", false, null, null, 1, false, false, 0, "Gunter's Chain British; Gunters Chain British; Surveyor's Chain British", "UCUM", "Len", "Obsolete", "historical unit used for land survey used only in Great Britain", "[rd_br]", "[RD_BR]", "4", 4, false], [false, "link for Gunter's chain - British", "[lk_br]", "[LK_BR]", "length", 0.2011678416, [1, 0, 0, 0, 0, 0, 0], null, "brit-length", false, null, null, 1, false, false, 0, "Links for Gunter's Chain British", "UCUM", "Len", "Obsolete", "", "[ch_br]/100", "[CH_BR]/100", "1", 1, false], [false, "fathom - British", "[fth_br]", "[FTH_BR]", "length", 1.82879856, [1, 0, 0, 0, 0, 0, 0], null, "brit-length", false, null, null, 1, false, false, 0, "British fathoms; imperial fathoms; br fth; imp fth", "UCUM", "Len", "Obsolete", "", "[ft_br]", "[FT_BR]", "6", 6, false], [false, "pace - British", "[pc_br]", "[PC_BR]", "length", 0.7619994000000001, [1, 0, 0, 0, 0, 0, 0], null, "brit-length", false, null, null, 1, false, false, 0, "British paces; br pc", "UCUM", "Len", "Nonclinical", "traditional unit of length equal to 152.4 centimeters, or 1.52 meter. ", "[ft_br]", "[FT_BR]", "2.5", 2.5, false], [false, "yard - British", "[yd_br]", "[YD_BR]", "length", 0.91439928, [1, 0, 0, 0, 0, 0, 0], null, "brit-length", false, null, null, 1, false, false, 0, "British yards; Br yds; distance", "UCUM", "Len", "Obsolete", "", "[ft_br]", "[FT_BR]", "3", 3, false], [false, "mile - British", "[mi_br]", "[MI_BR]", "length", 1609.3427328000002, [1, 0, 0, 0, 0, 0, 0], null, "brit-length", false, null, null, 1, false, false, 0, "imperial miles; British miles; English statute miles; imp mi, br mi", "UCUM", "Len", "Obsolete", "", "[ft_br]", "[FT_BR]", "5280", 5280, false], [false, "nautical mile - British", "[nmi_br]", "[NMI_BR]", "length", 1853.1825408000002, [1, 0, 0, 0, 0, 0, 0], null, "brit-length", false, null, null, 1, false, false, 0, "British nautical miles; Imperial nautical miles; Admiralty miles; n.m. br; imp nm", "UCUM", "Len", "Obsolete", "", "[ft_br]", "[FT_BR]", "6080", 6080, false], [false, "knot - British", "[kn_br]", "[KN_BR]", "velocity", 0.5147729280000001, [1, -1, 0, 0, 0, 0, 0], null, "brit-length", false, null, null, 1, false, false, 0, "British knots; kn br; kt", "UCUM", "Vel", "Obsolete", "based on obsolete British nautical mile ", "[nmi_br]/h", "[NMI_BR]/H", "1", 1, false], [false, "acre", "[acr_br]", "[ACR_BR]", "area", 4046.850049400269, [2, 0, 0, 0, 0, 0, 0], null, "brit-length", false, null, null, 1, false, false, 0, "Imperial acres; British; a; ac; ar; acr", "UCUM", "Area", "Nonclinical", "the standard unit for acre used in the US and internationally", "[yd_br]2", "[YD_BR]2", "4840", 4840, false], [false, "gallon - US", "[gal_us]", "[GAL_US]", "fluid volume", 0.0037854117840000006, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "US gallons; US liquid gallon; gal us; Queen Anne's wine gallon", "UCUM", "Vol", "Nonclinical", "only gallon unit used in the US; [gal_us] is only used in some other countries in South American and Africa to measure gasoline volume", "[in_i]3", "[IN_I]3", "231", 231, false], [false, "barrel - US", "[bbl_us]", "[BBL_US]", "fluid volume", 0.158987294928, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "bbl", "UCUM", "Vol", "Nonclinical", "[bbl_us] is the standard unit for oil barrel, which is a unit only used in the US to measure the volume oil. ", "[gal_us]", "[GAL_US]", "42", 42, false], [false, "quart - US", "[qt_us]", "[QT_US]", "fluid volume", 0.0009463529460000001, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "US quarts; us qts", "UCUM", "Vol", "Clinical", "Used only in the US", "[gal_us]/4", "[GAL_US]/4", "1", 1, false], [false, "pint - US", "[pt_us]", "[PT_US]", "fluid volume", 0.00047317647300000007, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "US pints; pint US; liquid pint; pt us; us pt", "UCUM", "Vol", "Clinical", "Used only in the US", "[qt_us]/2", "[QT_US]/2", "1", 1, false], [false, "gill - US", "[gil_us]", "[GIL_US]", "fluid volume", 0.00011829411825000002, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "US gills; gil us", "UCUM", "Vol", "Nonclinical", "only used in the context of alcohol volume in the US", "[pt_us]/4", "[PT_US]/4", "1", 1, false], [false, "fluid ounce - US", "[foz_us]", "[FOZ_US]", "fluid volume", 0.000029573529562500005, [3, 0, 0, 0, 0, 0, 0], "oz fl", "us-volumes", false, null, null, 1, false, false, 0, "US fluid ounces; fl ozs; FO; fl. oz.; foz us", "UCUM", "Vol", "Clinical", "unit used only in the US", "[gil_us]/4", "[GIL_US]/4", "1", 1, false], [false, "fluid dram - US", "[fdr_us]", "[FDR_US]", "fluid volume", 0.0000036966911953125006, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "US fluid drams; fdr us", "UCUM", "Vol", "Nonclinical", "equal to 1/8 US fluid ounce = 3.69 mL; used informally to mean small amount of liquor, especially Scotch whiskey", "[foz_us]/8", "[FOZ_US]/8", "1", 1, false], [false, "minim - US", "[min_us]", "[MIN_US]", "fluid volume", 0.000000061611519921875, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "min US; US min; \u264F US", "UCUM", "Vol", "Obsolete", "", "[fdr_us]/60", "[FDR_US]/60", "1", 1, false], [false, "cord - US", "[crd_us]", "[CRD_US]", "fluid volume", 3.6245563637760005, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "US cord; US cords; crd us; us crd", "UCUM", "Vol", "Nonclinical", "unit of measure of dry volume used to measure firewood equal 128 ft3 (the same as international cord [cr_i])", "[ft_i]3", "[FT_I]3", "128", 128, false], [false, "bushel - US", "[bu_us]", "[BU_US]", "dry volume", 0.03523907016688001, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "US bushels; US bsh; US bu", "UCUM", "Vol", "Obsolete", "Historical unit of dry volume that is rarely used today", "[in_i]3", "[IN_I]3", "2150.42", 2150.42, false], [false, "gallon - historical", "[gal_wi]", "[GAL_WI]", "dry volume", 0.004404883770860001, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "Corn Gallon British; Dry Gallon US; Gallons Historical; Grain Gallon British; Winchester Corn Gallon; historical winchester gallons; wi gal", "UCUM", "Vol", "Obsolete", "historical unit of dry volume no longer used", "[bu_us]/8", "[BU_US]/8", "1", 1, false], [false, "peck - US", "[pk_us]", "[PK_US]", "dry volume", 0.008809767541720002, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "US pecks; US pk", "UCUM", "Vol", "Nonclinical", "unit of dry volume rarely used today (can be used to measure volume of apples)", "[bu_us]/4", "[BU_US]/4", "1", 1, false], [false, "dry quart - US", "[dqt_us]", "[DQT_US]", "dry volume", 0.0011012209427150002, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "dry quarts; dry quart US; US dry quart; dry qt; us dry qt; dqt; dqt us", "UCUM", "Vol", "Nonclinical", "historical unit of dry volume only in the US, but is rarely used today", "[pk_us]/8", "[PK_US]/8", "1", 1, false], [false, "dry pint - US", "[dpt_us]", "[DPT_US]", "dry volume", 0.0005506104713575001, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "dry pints; dry pint US; US dry pint; dry pt; dpt; dpt us", "UCUM", "Vol", "Nonclinical", "historical unit of dry volume only in the US, but is rarely used today", "[dqt_us]/2", "[DQT_US]/2", "1", 1, false], [false, "tablespoon - US", "[tbs_us]", "[TBS_US]", "volume", 0.000014786764781250002, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "Tbs; tbsp; tbs us; US tablespoons", "UCUM", "Vol", "Clinical", "unit defined as 0.5 US fluid ounces or 3 teaspoons - used only in the US. See [tbs_m] for the unit used internationally and in the US for nutrional labelling. ", "[foz_us]/2", "[FOZ_US]/2", "1", 1, false], [false, "teaspoon - US", "[tsp_us]", "[TSP_US]", "volume", 0.0000049289215937500005, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "tsp; t; US teaspoons", "UCUM", "Vol", "Nonclinical", "unit defined as 1/6 US fluid ounces - used only in the US. See [tsp_m] for the unit used internationally and in the US for nutrional labelling. ", "[tbs_us]/3", "[TBS_US]/3", "1", 1, false], [false, "cup - US customary", "[cup_us]", "[CUP_US]", "volume", 0.00023658823650000004, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "cup us; us cups", "UCUM", "Vol", "Nonclinical", "Unit defined as 1/2 US pint or 16 US tablespoons \u2248 236.59 mL, which is not the standard unit defined by the FDA of 240 mL - see [cup_m] (metric cup)", "[tbs_us]", "[TBS_US]", "16", 16, false], [false, "fluid ounce - metric", "[foz_m]", "[FOZ_M]", "fluid volume", 0.000029999999999999997, [3, 0, 0, 0, 0, 0, 0], "oz fl", "us-volumes", false, null, null, 1, false, false, 0, "metric fluid ounces; fozs m; fl ozs m", "UCUM", "Vol", "Clinical", "unit used only in the US for nutritional labelling, as set by the FDA", "mL", "ML", "30", 30, false], [false, "cup - US legal", "[cup_m]", "[CUP_M]", "volume", 0.00023999999999999998, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "cup m; metric cups", "UCUM", "Vol", "Clinical", "standard unit equal to 240 mL used in the US for nutritional labelling, as defined by the FDA. Note that this is different from the US customary cup (236.59 mL) and the metric cup used in Commonwealth nations (250 mL).", "mL", "ML", "240", 240, false], [false, "teaspoon - metric", "[tsp_m]", "[TSP_M]", "volume", 0.0000049999999999999996, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "tsp; t; metric teaspoons", "UCUM", "Vol", "Clinical", "standard unit used in the US and internationally", "mL", "mL", "5", 5, false], [false, "tablespoon - metric", "[tbs_m]", "[TBS_M]", "volume", 0.000014999999999999999, [3, 0, 0, 0, 0, 0, 0], null, "us-volumes", false, null, null, 1, false, false, 0, "metric tablespoons; Tbs; tbsp; T; tbs m", "UCUM", "Vol", "Clinical", "standard unit used in the US and internationally", "mL", "mL", "15", 15, false], [false, "gallon- British", "[gal_br]", "[GAL_BR]", "volume", 0.004546090000000001, [3, 0, 0, 0, 0, 0, 0], null, "brit-volumes", false, null, null, 1, false, false, 0, "imperial gallons, UK gallons; British gallons; br gal; imp gal", "UCUM", "Vol", "Nonclinical", "Used only in Great Britain and other Commonwealth countries", "l", "L", "4.54609", 4.54609, false], [false, "peck - British", "[pk_br]", "[PK_BR]", "volume", 0.009092180000000002, [3, 0, 0, 0, 0, 0, 0], null, "brit-volumes", false, null, null, 1, false, false, 0, "imperial pecks; British pecks; br pk; imp pk", "UCUM", "Vol", "Nonclinical", "unit of dry volume rarely used today (can be used to measure volume of apples)", "[gal_br]", "[GAL_BR]", "2", 2, false], [false, "bushel - British", "[bu_br]", "[BU_BR]", "volume", 0.03636872000000001, [3, 0, 0, 0, 0, 0, 0], null, "brit-volumes", false, null, null, 1, false, false, 0, "British bushels; imperial; br bsh; br bu; imp", "UCUM", "Vol", "Obsolete", "Historical unit of dry volume that is rarely used today", "[pk_br]", "[PK_BR]", "4", 4, false], [false, "quart - British", "[qt_br]", "[QT_BR]", "volume", 0.0011365225000000002, [3, 0, 0, 0, 0, 0, 0], null, "brit-volumes", false, null, null, 1, false, false, 0, "British quarts; imperial quarts; br qts", "UCUM", "Vol", "Clinical", "Used only in Great Britain and other Commonwealth countries", "[gal_br]/4", "[GAL_BR]/4", "1", 1, false], [false, "pint - British", "[pt_br]", "[PT_BR]", "volume", 0.0005682612500000001, [3, 0, 0, 0, 0, 0, 0], null, "brit-volumes", false, null, null, 1, false, false, 0, "British pints; imperial pints; pt br; br pt; imp pt; pt imp", "UCUM", "Vol", "Clinical", "Used only in Great Britain and other Commonwealth countries", "[qt_br]/2", "[QT_BR]/2", "1", 1, false], [false, "gill - British", "[gil_br]", "[GIL_BR]", "volume", 0.00014206531250000003, [3, 0, 0, 0, 0, 0, 0], null, "brit-volumes", false, null, null, 1, false, false, 0, "imperial gills; British gills; imp gill, br gill", "UCUM", "Vol", "Nonclinical", "only used in the context of alcohol volume in Great Britain", "[pt_br]/4", "[PT_BR]/4", "1", 1, false], [false, "fluid ounce - British", "[foz_br]", "[FOZ_BR]", "volume", 0.000028413062500000005, [3, 0, 0, 0, 0, 0, 0], null, "brit-volumes", false, null, null, 1, false, false, 0, "British fluid ounces; Imperial fluid ounces; br fozs; imp fozs; br fl ozs", "UCUM", "Vol", "Clinical", "Used only in Great Britain and other Commonwealth countries", "[gil_br]/5", "[GIL_BR]/5", "1", 1, false], [false, "fluid dram - British", "[fdr_br]", "[FDR_BR]", "volume", 0.0000035516328125000006, [3, 0, 0, 0, 0, 0, 0], null, "brit-volumes", false, null, null, 1, false, false, 0, "British fluid drams; fdr br", "UCUM", "Vol", "Nonclinical", "equal to 1/8 Imperial fluid ounce = 3.55 mL; used informally to mean small amount of liquor, especially Scotch whiskey", "[foz_br]/8", "[FOZ_BR]/8", "1", 1, false], [false, "minim - British", "[min_br]", "[MIN_BR]", "volume", 0.00000005919388020833334, [3, 0, 0, 0, 0, 0, 0], null, "brit-volumes", false, null, null, 1, false, false, 0, "min br; br min; \u264F br", "UCUM", "Vol", "Obsolete", "", "[fdr_br]/60", "[FDR_BR]/60", "1", 1, false], [false, "grain", "[gr]", "[GR]", "mass", 0.06479891, [0, 0, 1, 0, 0, 0, 0], null, "avoirdupois", false, null, null, 1, false, false, 0, "gr; grains", "UCUM", "Mass", "Nonclinical", "an apothecary measure of mass rarely used today", "mg", "MG", "64.79891", 64.79891, false], [false, "pound", "[lb_av]", "[LB_AV]", "mass", 453.59237, [0, 0, 1, 0, 0, 0, 0], "lb", "avoirdupois", false, null, null, 1, false, false, 0, "avoirdupois pounds, international pounds; av lbs; pounds", "UCUM", "Mass", "Clinical", "standard unit used in the US and internationally", "[gr]", "[GR]", "7000", 7000, false], [false, "pound force - US", "[lbf_av]", "[LBF_AV]", "force", 4448.2216152605, [1, -2, 1, 0, 0, 0, 0], "lbf", "const", false, null, null, 1, false, false, 0, "lbfs; US lbf; US pound forces", "UCUM", "Force", "Clinical", "only rarely needed in health care - see [lb_av] which is the more common unit to express weight", "[lb_av].[g]", "[LB_AV].[G]", "1", 1, false], [false, "ounce", "[oz_av]", "[OZ_AV]", "mass", 28.349523125, [0, 0, 1, 0, 0, 0, 0], "oz", "avoirdupois", false, null, null, 1, false, false, 0, "ounces; international ounces; avoirdupois ounces; av ozs", "UCUM", "Mass", "Clinical", "standard unit used in the US and internationally", "[lb_av]/16", "[LB_AV]/16", "1", 1, false], [false, "Dram mass unit", "[dr_av]", "[DR_AV]", "mass", 1.7718451953125, [0, 0, 1, 0, 0, 0, 0], null, "avoirdupois", false, null, null, 1, false, false, 0, "Dram; drams avoirdupois; avoidupois dram; international dram", "UCUM", "Mass", "Clinical", "unit from the avoirdupois system, which is used in the US and internationally", "[oz_av]/16", "[OZ_AV]/16", "1", 1, false], [false, "short hundredweight", "[scwt_av]", "[SCWT_AV]", "mass", 45359.237, [0, 0, 1, 0, 0, 0, 0], null, "avoirdupois", false, null, null, 1, false, false, 0, "hundredweights; s cwt; scwt; avoirdupois", "UCUM", "Mass", "Nonclinical", "Used only in the US to equal 100 pounds", "[lb_av]", "[LB_AV]", "100", 100, false], [false, "long hundredweight", "[lcwt_av]", "[LCWT_AV]", "mass", 50802.345440000005, [0, 0, 1, 0, 0, 0, 0], null, "avoirdupois", false, null, null, 1, false, false, 0, "imperial hundredweights; imp cwt; lcwt; avoirdupois", "UCUM", "Mass", "Obsolete", "", "[lb_av]", "[LB_AV]", "112", 112, false], [false, "short ton - US", "[ston_av]", "[STON_AV]", "mass", 907184.74, [0, 0, 1, 0, 0, 0, 0], null, "avoirdupois", false, null, null, 1, false, false, 0, "ton; US tons; avoirdupois tons", "UCUM", "Mass", "Clinical", "Used only in the US", "[scwt_av]", "[SCWT_AV]", "20", 20, false], [false, "long ton - British", "[lton_av]", "[LTON_AV]", "mass", 1016046.9088000001, [0, 0, 1, 0, 0, 0, 0], null, "avoirdupois", false, null, null, 1, false, false, 0, "imperial tons; weight tons; British long tons; long ton avoirdupois", "UCUM", "Mass", "Nonclinical", "Used only in Great Britain and other Commonwealth countries", "[lcwt_av]", "[LCWT_AV]", "20", 20, false], [false, "stone - British", "[stone_av]", "[STONE_AV]", "mass", 6350.293180000001, [0, 0, 1, 0, 0, 0, 0], null, "avoirdupois", false, null, null, 1, false, false, 0, "British stones; avoirdupois", "UCUM", "Mass", "Nonclinical", "Used primarily in the UK and Ireland to measure body weight", "[lb_av]", "[LB_AV]", "14", 14, false], [false, "pennyweight - troy", "[pwt_tr]", "[PWT_TR]", "mass", 1.5551738400000001, [0, 0, 1, 0, 0, 0, 0], null, "troy", false, null, null, 1, false, false, 0, "dwt; denarius weights", "UCUM", "Mass", "Obsolete", "historical unit used to measure mass and cost of precious metals", "[gr]", "[GR]", "24", 24, false], [false, "ounce - troy", "[oz_tr]", "[OZ_TR]", "mass", 31.103476800000003, [0, 0, 1, 0, 0, 0, 0], null, "troy", false, null, null, 1, false, false, 0, "troy ounces; tr ozs", "UCUM", "Mass", "Nonclinical", "unit of mass for precious metals and gemstones only", "[pwt_tr]", "[PWT_TR]", "20", 20, false], [false, "pound - troy", "[lb_tr]", "[LB_TR]", "mass", 373.2417216, [0, 0, 1, 0, 0, 0, 0], null, "troy", false, null, null, 1, false, false, 0, "troy pounds; tr lbs", "UCUM", "Mass", "Nonclinical", "only used for weighing precious metals", "[oz_tr]", "[OZ_TR]", "12", 12, false], [false, "scruple", "[sc_ap]", "[SC_AP]", "mass", 1.2959782, [0, 0, 1, 0, 0, 0, 0], null, "apoth", false, null, null, 1, false, false, 0, "scruples; sc ap", "UCUM", "Mass", "Obsolete", "", "[gr]", "[GR]", "20", 20, false], [false, "dram - apothecary", "[dr_ap]", "[DR_AP]", "mass", 3.8879346, [0, 0, 1, 0, 0, 0, 0], null, "apoth", false, null, null, 1, false, false, 0, "\u0292; drachm; apothecaries drams; dr ap; dram ap", "UCUM", "Mass", "Nonclinical", "unit still used in the US occasionally to measure amount of drugs in pharmacies", "[sc_ap]", "[SC_AP]", "3", 3, false], [false, "ounce - apothecary", "[oz_ap]", "[OZ_AP]", "mass", 31.1034768, [0, 0, 1, 0, 0, 0, 0], null, "apoth", false, null, null, 1, false, false, 0, "apothecary ounces; oz ap; ap ozs; ozs ap", "UCUM", "Mass", "Obsolete", "", "[dr_ap]", "[DR_AP]", "8", 8, false], [false, "pound - apothecary", "[lb_ap]", "[LB_AP]", "mass", 373.2417216, [0, 0, 1, 0, 0, 0, 0], null, "apoth", false, null, null, 1, false, false, 0, "apothecary pounds; apothecaries pounds; ap lb; lb ap; ap lbs; lbs ap", "UCUM", "Mass", "Obsolete", "", "[oz_ap]", "[OZ_AP]", "12", 12, false], [false, "ounce - metric", "[oz_m]", "[OZ_M]", "mass", 28, [0, 0, 1, 0, 0, 0, 0], null, "apoth", false, null, null, 1, false, false, 0, "metric ounces; m ozs", "UCUM", "Mass", "Clinical", "see [oz_av] (the avoirdupois ounce) for the standard ounce used internationally; [oz_m] is equal to 28 grams and is based on the apothecaries' system of mass units which is used in some US pharmacies. ", "g", "g", "28", 28, false], [false, "line", "[lne]", "[LNE]", "length", 0.002116666666666667, [1, 0, 0, 0, 0, 0, 0], null, "typeset", false, null, null, 1, false, false, 0, "British lines; br L; L; l", "UCUM", "Len", "Obsolete", "", "[in_i]/12", "[IN_I]/12", "1", 1, false], [false, "point (typography)", "[pnt]", "[PNT]", "length", 0.0003527777777777778, [1, 0, 0, 0, 0, 0, 0], null, "typeset", false, null, null, 1, false, false, 0, "DTP points; desktop publishing point; pt; pnt", "UCUM", "Len", "Nonclinical", "typography unit for typesetter's length", "[lne]/6", "[LNE]/6", "1", 1, false], [false, "pica (typography)", "[pca]", "[PCA]", "length", 0.004233333333333334, [1, 0, 0, 0, 0, 0, 0], null, "typeset", false, null, null, 1, false, false, 0, "picas", "UCUM", "Len", "Nonclinical", "typography unit for typesetter's length", "[pnt]", "[PNT]", "12", 12, false], [false, "Printer's point (typography)", "[pnt_pr]", "[PNT_PR]", "length", 0.00035145980000000004, [1, 0, 0, 0, 0, 0, 0], null, "typeset", false, null, null, 1, false, false, 0, "pnt pr", "UCUM", "Len", "Nonclinical", "typography unit for typesetter's length", "[in_i]", "[IN_I]", "0.013837", 0.013837, false], [false, "Printer's pica  (typography)", "[pca_pr]", "[PCA_PR]", "length", 0.004217517600000001, [1, 0, 0, 0, 0, 0, 0], null, "typeset", false, null, null, 1, false, false, 0, "pca pr; Printer's picas", "UCUM", "Len", "Nonclinical", "typography unit for typesetter's length", "[pnt_pr]", "[PNT_PR]", "12", 12, false], [false, "pied", "[pied]", "[PIED]", "length", 0.3248, [1, 0, 0, 0, 0, 0, 0], null, "typeset", false, null, null, 1, false, false, 0, "pieds du roi; Paris foot; royal; French; feet", "UCUM", "Len", "Obsolete", "", "cm", "CM", "32.48", 32.48, false], [false, "pouce", "[pouce]", "[POUCE]", "length", 0.027066666666666666, [1, 0, 0, 0, 0, 0, 0], null, "typeset", false, null, null, 1, false, false, 0, "historical French inches; French royal inches", "UCUM", "Len", "Obsolete", "", "[pied]/12", "[PIED]/12", "1", 1, false], [false, "ligne", "[ligne]", "[LIGNE]", "length", 0.0022555555555555554, [1, 0, 0, 0, 0, 0, 0], null, "typeset", false, null, null, 1, false, false, 0, "Paris lines; lignes", "UCUM", "Len", "Obsolete", "", "[pouce]/12", "[POUCE]/12", "1", 1, false], [false, "didot", "[didot]", "[DIDOT]", "length", 0.0003759259259259259, [1, 0, 0, 0, 0, 0, 0], null, "typeset", false, null, null, 1, false, false, 0, "Didot point; dd; Didots Point; didots; points", "UCUM", "Len", "Obsolete", "typography unit for typesetter's length", "[ligne]/6", "[LIGNE]/6", "1", 1, false], [false, "cicero", "[cicero]", "[CICERO]", "length", 0.004511111111111111, [1, 0, 0, 0, 0, 0, 0], null, "typeset", false, null, null, 1, false, false, 0, "Didot's pica; ciceros; picas", "UCUM", "Len", "Obsolete", "typography unit for typesetter's length", "[didot]", "[DIDOT]", "12", 12, false], [false, "degrees Fahrenheit", "[degF]", "[DEGF]", "temperature", 0.5555555555555556, [0, 0, 0, 0, 1, 0, 0], "\xB0F", "heat", false, null, "degF", 1, true, false, 0, "\xB0F; deg F", "UCUM", "Temp", "Clinical", "", "K", null, null, 0.5555555555555556, false], [false, "degrees Rankine", "[degR]", "[degR]", "temperature", 0.5555555555555556, [0, 0, 0, 0, 1, 0, 0], "\xB0R", "heat", false, null, null, 1, false, false, 0, "\xB0R; \xB0Ra; Rankine", "UCUM", "Temp", "Obsolete", "Replaced by Kelvin", "K/9", "K/9", "5", 5, false], [false, "degrees R\xE9aumur", "[degRe]", "[degRe]", "temperature", 1.25, [0, 0, 0, 0, 1, 0, 0], "\xB0R\xE9", "heat", false, null, "degRe", 1, true, false, 0, "\xB0R\xE9, \xB0Re, \xB0r; R\xE9aumur; degree Reaumur; Reaumur", "UCUM", "Temp", "Obsolete", "replaced by Celsius", "K", null, null, 1.25, false], [false, "calorie at 15\xB0C", "cal_[15]", "CAL_[15]", "energy", 4185.8, [2, -2, 1, 0, 0, 0, 0], "cal<sub>15\xB0C</sub>", "heat", true, null, null, 1, false, false, 0, "calorie 15 C; cals 15 C; calories at 15 C", "UCUM", "Enrg", "Nonclinical", "equal to 4.1855 joules; calorie most often used in engineering", "J", "J", "4.18580", 4.1858, false], [false, "calorie at 20\xB0C", "cal_[20]", "CAL_[20]", "energy", 4181.9, [2, -2, 1, 0, 0, 0, 0], "cal<sub>20\xB0C</sub>", "heat", true, null, null, 1, false, false, 0, "calorie 20 C; cal 20 C; calories at 20 C", "UCUM", "Enrg", "Clinical", "equal to 4.18190  joules. ", "J", "J", "4.18190", 4.1819, false], [false, "mean calorie", "cal_m", "CAL_M", "energy", 4190.0199999999995, [2, -2, 1, 0, 0, 0, 0], "cal<sub>m</sub>", "heat", true, null, null, 1, false, false, 0, "mean cals; mean calories", "UCUM", "Enrg", "Clinical", "equal to 4.19002 joules. ", "J", "J", "4.19002", 4.19002, false], [false, "international table calorie", "cal_IT", "CAL_IT", "energy", 4186.8, [2, -2, 1, 0, 0, 0, 0], "cal<sub>IT</sub>", "heat", true, null, null, 1, false, false, 0, "calories IT; IT cals; international steam table calories", "UCUM", "Enrg", "Nonclinical", "used in engineering steam tables and defined as 1/860 international watt-hour; equal to 4.1868 joules", "J", "J", "4.1868", 4.1868, false], [false, "thermochemical calorie", "cal_th", "CAL_TH", "energy", 4184, [2, -2, 1, 0, 0, 0, 0], "cal<sub>th</sub>", "heat", true, null, null, 1, false, false, 0, "thermochemical calories; th cals", "UCUM", "Enrg", "Clinical", "equal to 4.184 joules; used as the unit in medicine and biochemistry (equal to cal)", "J", "J", "4.184", 4.184, false], [false, "calorie", "cal", "CAL", "energy", 4184, [2, -2, 1, 0, 0, 0, 0], "cal", "heat", true, null, null, 1, false, false, 0, "gram calories; small calories", "UCUM", "Enrg", "Clinical", "equal to 4.184 joules (the same value as the thermochemical calorie, which is the most common calorie used in medicine and biochemistry)", "cal_th", "CAL_TH", "1", 1, false], [false, "nutrition label Calories", "[Cal]", "[CAL]", "energy", 4184000, [2, -2, 1, 0, 0, 0, 0], "Cal", "heat", false, null, null, 1, false, false, 0, "food calories; Cal; kcal", "UCUM", "Eng", "Clinical", "", "kcal_th", "KCAL_TH", "1", 1, false], [false, "British thermal unit at 39\xB0F", "[Btu_39]", "[BTU_39]", "energy", 1059670, [2, -2, 1, 0, 0, 0, 0], "Btu<sub>39\xB0F</sub>", "heat", false, null, null, 1, false, false, 0, "BTU 39F; BTU 39 F; B.T.U. 39 F; B.Th.U. 39 F; BThU 39 F; British thermal units", "UCUM", "Eng", "Nonclinical", "equal to 1.05967 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries", "kJ", "kJ", "1.05967", 1.05967, false], [false, "British thermal unit at 59\xB0F", "[Btu_59]", "[BTU_59]", "energy", 1054800, [2, -2, 1, 0, 0, 0, 0], "Btu<sub>59\xB0F</sub>", "heat", false, null, null, 1, false, false, 0, "BTU 59 F; BTU 59F; B.T.U. 59 F; B.Th.U. 59 F; BThU 59F; British thermal units", "UCUM", "Eng", "Nonclinical", "equal to  1.05480 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries", "kJ", "kJ", "1.05480", 1.0548, false], [false, "British thermal unit at 60\xB0F", "[Btu_60]", "[BTU_60]", "energy", 1054680, [2, -2, 1, 0, 0, 0, 0], "Btu<sub>60\xB0F</sub>", "heat", false, null, null, 1, false, false, 0, "BTU 60 F; BTU 60F; B.T.U. 60 F; B.Th.U. 60 F; BThU 60 F; British thermal units 60 F", "UCUM", "Eng", "Nonclinical", "equal to 1.05468 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries", "kJ", "kJ", "1.05468", 1.05468, false], [false, "mean British thermal unit", "[Btu_m]", "[BTU_M]", "energy", 1055870, [2, -2, 1, 0, 0, 0, 0], "Btu<sub>m</sub>", "heat", false, null, null, 1, false, false, 0, "BTU mean; B.T.U. mean; B.Th.U. mean; BThU mean; British thermal units mean; ", "UCUM", "Eng", "Nonclinical", "equal to 1.05587 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries", "kJ", "kJ", "1.05587", 1.05587, false], [false, "international table British thermal unit", "[Btu_IT]", "[BTU_IT]", "energy", 1055055.85262, [2, -2, 1, 0, 0, 0, 0], "Btu<sub>IT</sub>", "heat", false, null, null, 1, false, false, 0, "BTU IT; B.T.U. IT; B.Th.U. IT; BThU IT; British thermal units IT", "UCUM", "Eng", "Nonclinical", "equal to 1.055 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries", "kJ", "kJ", "1.05505585262", 1.05505585262, false], [false, "thermochemical British thermal unit", "[Btu_th]", "[BTU_TH]", "energy", 1054350, [2, -2, 1, 0, 0, 0, 0], "Btu<sub>th</sub>", "heat", false, null, null, 1, false, false, 0, "BTU Th; B.T.U. Th; B.Th.U. Th; BThU Th; thermochemical British thermal units", "UCUM", "Eng", "Nonclinical", "equal to 1.054350 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries", "kJ", "kJ", "1.054350", 1.05435, false], [false, "British thermal unit", "[Btu]", "[BTU]", "energy", 1054350, [2, -2, 1, 0, 0, 0, 0], "btu", "heat", false, null, null, 1, false, false, 0, "BTU; B.T.U. ; B.Th.U.; BThU; British thermal units", "UCUM", "Eng", "Nonclinical", "equal to the thermochemical British thermal unit equal to 1.054350 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries", "[Btu_th]", "[BTU_TH]", "1", 1, false], [false, "horsepower - mechanical", "[HP]", "[HP]", "power", 745699.8715822703, [2, -3, 1, 0, 0, 0, 0], null, "heat", false, null, null, 1, false, false, 0, "imperial horsepowers", "UCUM", "EngRat", "Nonclinical", "refers to mechanical horsepower, which is unit used to measure engine power primarily in the US. ", "[ft_i].[lbf_av]/s", "[FT_I].[LBF_AV]/S", "550", 550, false], [false, "tex", "tex", "TEX", "linear mass density (of textile thread)", 0.001, [-1, 0, 1, 0, 0, 0, 0], "tex", "heat", true, null, null, 1, false, false, 0, "linear mass density; texes", "UCUM", "", "Clinical", "unit of linear mass density for fibers equal to gram per 1000 meters", "g/km", "G/KM", "1", 1, false], [false, "Denier (linear mass density)", "[den]", "[DEN]", "linear mass density (of textile thread)", 0.0001111111111111111, [-1, 0, 1, 0, 0, 0, 0], "den", "heat", false, null, null, 1, false, false, 0, "den; deniers", "UCUM", "", "Nonclinical", "equal to the mass in grams per 9000 meters of the fiber (1 denier = 1 strand of silk)", "g/9/km", "G/9/KM", "1", 1, false], [false, "meter of water column", "m[H2O]", "M[H2O]", "pressure", 9806650, [-1, -2, 1, 0, 0, 0, 0], "m\xA0HO<sub><r>2</r></sub>", "clinical", true, null, null, 1, false, false, 0, "mH2O; m H2O; meters of water column; metres; pressure", "UCUM", "Pres", "Clinical", "", "kPa", "KPAL", "980665e-5", 9.80665, false], [false, "meter of mercury column", "m[Hg]", "M[HG]", "pressure", 133322000, [-1, -2, 1, 0, 0, 0, 0], "m\xA0Hg", "clinical", true, null, null, 1, false, false, 0, "mHg; m Hg; meters of mercury column; metres; pressure", "UCUM", "Pres", "Clinical", "", "kPa", "KPAL", "133.3220", 133.322, false], [false, "inch of water column", "[in_i'H2O]", "[IN_I'H2O]", "pressure", 249088.91000000003, [-1, -2, 1, 0, 0, 0, 0], "in\xA0HO<sub><r>2</r></sub>", "clinical", false, null, null, 1, false, false, 0, "inches WC; inAq; in H2O; inch of water gauge; iwg; pressure", "UCUM", "Pres", "Clinical", "unit of pressure, especially in respiratory and ventilation care", "m[H2O].[in_i]/m", "M[H2O].[IN_I]/M", "1", 1, false], [false, "inch of mercury column", "[in_i'Hg]", "[IN_I'HG]", "pressure", 3386378.8000000003, [-1, -2, 1, 0, 0, 0, 0], "in\xA0Hg", "clinical", false, null, null, 1, false, false, 0, "inHg; in Hg; pressure; inches", "UCUM", "Pres", "Clinical", "unit of pressure used in US to measure barometric pressure and occasionally blood pressure (see mm[Hg] for unit used internationally)", "m[Hg].[in_i]/m", "M[HG].[IN_I]/M", "1", 1, false], [false, "peripheral vascular resistance unit", "[PRU]", "[PRU]", "fluid resistance", 133322000000, [-4, -1, 1, 0, 0, 0, 0], "P.R.U.", "clinical", false, null, null, 1, false, false, 0, "peripheral vascular resistance units; peripheral resistance unit; peripheral resistance units; PRU", "UCUM", "FldResist", "Clinical", "used to assess blood flow in the capillaries; equal to 1 mmH.min/mL = 133.3 Pa\xB7min/mL", "mm[Hg].s/ml", "MM[HG].S/ML", "1", 1, false], [false, "Wood unit", "[wood'U]", "[WOOD'U]", "fluid resistance", 7999320000, [-4, -1, 1, 0, 0, 0, 0], "Wood U.", "clinical", false, null, null, 1, false, false, 0, "hybrid reference units; HRU; mmHg.min/L; vascular resistance", "UCUM", "Pres", "Clinical", "simplified unit of measurement for for measuring pulmonary vascular resistance that uses pressure; equal to mmHg.min/L", "mm[Hg].min/L", "MM[HG].MIN/L", "1", 1, false], [false, "diopter (lens)", "[diop]", "[DIOP]", "refraction of a lens", 1, [1, 0, 0, 0, 0, 0, 0], "dpt", "clinical", false, null, "inv", 1, false, false, 0, "diopters; diop; dioptre; dpt; refractive power", "UCUM", "InvLen", "Clinical", "unit of optical power of lens represented by inverse meters (m^-1)", "m", "/M", "1", 1, false], [false, "prism diopter (magnifying power)", "[p'diop]", "[P'DIOP]", "refraction of a prism", 1, [0, 0, 0, 1, 0, 0, 0], "PD", "clinical", false, null, "tanTimes100", 1, true, false, 0, "diopters; dioptres; p diops; pdiop; dpt; pdptr; \u0394; cm/m; centimeter per meter; centimetre; metre", "UCUM", "Angle", "Clinical", "unit for prism correction in eyeglass prescriptions", "rad", null, null, 1, false], [false, "percent of slope", "%[slope]", "%[SLOPE]", "slope", 0.017453292519943295, [0, 0, 0, 1, 0, 0, 0], "%", "clinical", false, null, "100tan", 1, true, false, 0, "% slope; %slope; percents slopes", "UCUM", "VelFr; ElpotRatFr; VelRtoFr; AccelFr", "Clinical", "", "deg", null, null, 1, false], [false, "mesh", "[mesh_i]", "[MESH_I]", "lineic number", 0.025400000000000002, [1, 0, 0, 0, 0, 0, 0], null, "clinical", false, null, "inv", 1, false, false, 0, "meshes", "UCUM", "NLen (lineic number)", "Clinical", "traditional unit of length defined as the number of strands or particles per inch", "[in_i]", "/[IN_I]", "1", 1, false], [false, "French (catheter gauge) ", "[Ch]", "[CH]", "gauge of catheters", 0.0003333333333333333, [1, 0, 0, 0, 0, 0, 0], "Ch", "clinical", false, null, null, 1, false, false, 0, "Charri\xE8res, French scales; French gauges; Fr, Fg, Ga, FR, Ch", "UCUM", "Len; Circ; Diam", "Clinical", "", "mm/3", "MM/3", "1", 1, false], [false, "drop - metric (1/20 mL)", "[drp]", "[DRP]", "volume", 0.00000005, [3, 0, 0, 0, 0, 0, 0], "drp", "clinical", false, null, null, 1, false, false, 0, "drop dosing units; metric drops; gtt", "UCUM", "Vol", "Clinical", "standard unit used in the US and internationally for clinical medicine but note that although [drp] is defined as 1/20 milliliter, in practice, drop sizes will vary due to external factors", "ml/20", "ML/20", "1", 1, false], [false, "Hounsfield unit", "[hnsf'U]", "[HNSF'U]", "x-ray attenuation", 1, [0, 0, 0, 0, 0, 0, 0], "HF", "clinical", false, null, null, 1, false, false, 0, "HU; units", "UCUM", "", "Clinical", "used to measure X-ray attenuation, especially in CT scans.", "1", "1", "1", 1, false], [false, "Metabolic Equivalent of Task ", "[MET]", "[MET]", "metabolic cost of physical activity", 0.00000000005833333333333334, [3, -1, -1, 0, 0, 0, 0], "MET", "clinical", false, null, null, 1, false, false, 0, "metabolic equivalents", "UCUM", "RelEngRat", "Clinical", "unit used to measure rate of energy expenditure per power in treadmill and other functional tests", "mL/min/kg", "ML/MIN/KG", "3.5", 3.5, false], [false, "homeopathic potency of decimal series (retired)", "[hp'_X]", "[HP'_X]", "homeopathic potency (retired)", 1, [0, 0, 0, 0, 0, 0, 0], "X", "clinical", false, null, "hpX", 1, true, false, 0, null, "UCUM", null, null, null, "1", null, null, 1, false], [false, "homeopathic potency of centesimal series (retired)", "[hp'_C]", "[HP'_C]", "homeopathic potency (retired)", 1, [0, 0, 0, 0, 0, 0, 0], "C", "clinical", false, null, "hpC", 1, true, false, 0, null, "UCUM", null, null, null, "1", null, null, 1, false], [false, "homeopathic potency of millesimal series (retired)", "[hp'_M]", "[HP'_M]", "homeopathic potency (retired)", 1, [0, 0, 0, 0, 0, 0, 0], "M", "clinical", false, null, "hpM", 1, true, false, 0, null, "UCUM", null, null, null, "1", null, null, 1, false], [false, "homeopathic potency of quintamillesimal series (retired)", "[hp'_Q]", "[HP'_Q]", "homeopathic potency (retired)", 1, [0, 0, 0, 0, 0, 0, 0], "Q", "clinical", false, null, "hpQ", 1, true, false, 0, null, "UCUM", null, null, null, "1", null, null, 1, false], [false, "homeopathic potency of decimal hahnemannian series", "[hp_X]", "[HP_X]", "homeopathic potency (Hahnemann)", 1, [0, 0, 0, 0, 0, 0, 0], "X", "clinical", false, null, null, 1, false, true, 0, null, "UCUM", null, null, null, "1", "1", "1", 1, false], [false, "homeopathic potency of centesimal hahnemannian series", "[hp_C]", "[HP_C]", "homeopathic potency (Hahnemann)", 1, [0, 0, 0, 0, 0, 0, 0], "C", "clinical", false, null, null, 1, false, true, 0, null, "UCUM", null, null, null, "1", "1", "1", 1, false], [false, "homeopathic potency of millesimal hahnemannian series", "[hp_M]", "[HP_M]", "homeopathic potency (Hahnemann)", 1, [0, 0, 0, 0, 0, 0, 0], "M", "clinical", false, null, null, 1, false, true, 0, null, "UCUM", null, null, null, "1", "1", "1", 1, false], [false, "homeopathic potency of quintamillesimal hahnemannian series", "[hp_Q]", "[HP_Q]", "homeopathic potency (Hahnemann)", 1, [0, 0, 0, 0, 0, 0, 0], "Q", "clinical", false, null, null, 1, false, true, 0, null, "UCUM", null, null, null, "1", "1", "1", 1, false], [false, "homeopathic potency of decimal korsakovian series", "[kp_X]", "[KP_X]", "homeopathic potency (Korsakov)", 1, [0, 0, 0, 0, 0, 0, 0], "X", "clinical", false, null, null, 1, false, true, 0, null, "UCUM", null, null, null, "1", "1", "1", 1, false], [false, "homeopathic potency of centesimal korsakovian series", "[kp_C]", "[KP_C]", "homeopathic potency (Korsakov)", 1, [0, 0, 0, 0, 0, 0, 0], "C", "clinical", false, null, null, 1, false, true, 0, null, "UCUM", null, null, null, "1", "1", "1", 1, false], [false, "homeopathic potency of millesimal korsakovian series", "[kp_M]", "[KP_M]", "homeopathic potency (Korsakov)", 1, [0, 0, 0, 0, 0, 0, 0], "M", "clinical", false, null, null, 1, false, true, 0, null, "UCUM", null, null, null, "1", "1", "1", 1, false], [false, "homeopathic potency of quintamillesimal korsakovian series", "[kp_Q]", "[KP_Q]", "homeopathic potency (Korsakov)", 1, [0, 0, 0, 0, 0, 0, 0], "Q", "clinical", false, null, null, 1, false, true, 0, null, "UCUM", null, null, null, "1", "1", "1", 1, false], [false, "equivalent", "eq", "EQ", "amount of substance", 602213670000000000000000, [0, 0, 0, 0, 0, 0, 0], "eq", "chemical", true, null, null, 1, false, false, 1, "equivalents", "UCUM", "Sub", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "osmole", "osm", "OSM", "amount of substance (dissolved particles)", 602213670000000000000000, [0, 0, 0, 0, 0, 0, 0], "osm", "chemical", true, null, null, 1, false, false, 1, "osmoles; osmols", "UCUM", "Osmol", "Clinical", "the number of moles of solute that contribute to the osmotic pressure of a solution", "mol", "MOL", "1", 1, false], [false, "pH", "[pH]", "[PH]", "acidity", 602213669999999940000000000, [-3, 0, 0, 0, 0, 0, 0], "pH", "chemical", false, null, "pH", 1, true, false, 0, "pH scale", "UCUM", "LogCnc", "Clinical", "Log concentration of H+", "mol/l", null, null, 1, false], [false, "gram percent", "g%", "G%", "mass concentration", 1e4, [-3, 0, 1, 0, 0, 0, 0], "g%", "chemical", true, null, null, 1, false, false, 0, "gram %; gram%; grams per deciliter; g/dL; gm per dL; gram percents", "UCUM", "MCnc", "Clinical", "equivalent to unit gram per deciliter (g/dL), a unit often used in medical tests to represent solution concentrations", "g/dl", "G/DL", "1", 1, false], [false, "Svedberg unit", "[S]", "[S]", "sedimentation coefficient", 0.0000000000001, [0, 1, 0, 0, 0, 0, 0], "S", "chemical", false, null, null, 1, false, false, 0, "Sv; 10^-13 seconds; 100 fs; 100 femtoseconds", "UCUM", "Time", "Clinical", "unit of time used in measuring particle's sedimentation rate, usually after centrifugation. ", "s", "10*-13.S", "1", 0.0000000000001, false], [false, "high power field (microscope)", "[HPF]", "[HPF]", "view area in microscope", 1, [0, 0, 0, 0, 0, 0, 0], "HPF", "chemical", false, null, null, 1, false, false, 0, "HPF", "UCUM", "Area", "Clinical", "area visible under the maximum magnification power of the objective in microscopy (usually 400x)\n", "1", "1", "1", 1, false], [false, "low power field (microscope)", "[LPF]", "[LPF]", "view area in microscope", 1, [0, 0, 0, 0, 0, 0, 0], "LPF", "chemical", false, null, null, 1, false, false, 0, "LPF; fields", "UCUM", "Area", "Clinical", "area visible under the low magnification of the objective in microscopy (usually 100 x)\n", "1", "1", "100", 100, false], [false, "katal", "kat", "KAT", "catalytic activity", 602213670000000000000000, [0, -1, 0, 0, 0, 0, 0], "kat", "chemical", true, null, null, 1, false, false, 1, "mol/secs; moles per second; mol*sec-1; mol*s-1; mol.s-1; katals; catalytic activity; enzymatic; enzyme units; activities", "UCUM", "CAct", "Clinical", "kat is a unit of catalytic activity with base units = mol/s. Rarely used because its units are too large to practically express catalytic activity. See enzyme unit [U] which is the standard unit for catalytic activity.", "mol/s", "MOL/S", "1", 1, false], [false, "enzyme unit", "U", "U", "catalytic activity", 10036894500000000, [0, -1, 0, 0, 0, 0, 0], "U", "chemical", true, null, null, 1, false, false, 1, "micromoles per minute; umol/min; umol per minute; umol min-1; enzymatic activity; enzyme activity", "UCUM", "CAct", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "international unit - arbitrary", "[iU]", "[IU]", "arbitrary", 1, [0, 0, 0, 0, 0, 0, 0], "IU", "chemical", true, null, null, 1, false, true, 0, "international units; IE; F2", "UCUM", "Arb", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "1", "1", "1", 1, false], [false, "international unit - arbitrary", "[IU]", "[IU]", "arbitrary", 1, [0, 0, 0, 0, 0, 0, 0], "i.U.", "chemical", true, null, null, 1, false, true, 0, "international units; IE; F2", "UCUM", "Arb", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "arbitary unit", "[arb'U]", "[ARB'U]", "arbitrary", 1, [0, 0, 0, 0, 0, 0, 0], "arb. U", "chemical", false, null, null, 1, false, true, 0, "arbitary units; arb units; arbU", "UCUM", "Arb", "Clinical", "relative unit of measurement to show the ratio of test measurement to reference measurement", "1", "1", "1", 1, false], [false, "United States Pharmacopeia unit", "[USP'U]", "[USP'U]", "arbitrary", 1, [0, 0, 0, 0, 0, 0, 0], "U.S.P.", "chemical", false, null, null, 1, false, true, 0, "USP U; USP'U", "UCUM", "Arb", "Clinical", "a dose unit to express potency of drugs and vitamins defined by the United States Pharmacopoeia; usually 1 USP = 1 IU", "1", "1", "1", 1, false], [false, "GPL unit", "[GPL'U]", "[GPL'U]", "biologic activity of anticardiolipin IgG", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "GPL Units; GPL U; IgG anticardiolipin units; IgG Phospholipid", "UCUM", "ACnc; AMass", "Clinical", "Units for an antiphospholipid test", "1", "1", "1", 1, false], [false, "MPL unit", "[MPL'U]", "[MPL'U]", "biologic activity of anticardiolipin IgM", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "MPL units; MPL U; MPL'U; IgM anticardiolipin units; IgM Phospholipid Units ", "UCUM", "ACnc", "Clinical", "units for antiphospholipid test", "1", "1", "1", 1, false], [false, "APL unit", "[APL'U]", "[APL'U]", "biologic activity of anticardiolipin IgA", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "APL units; APL U; IgA anticardiolipin; IgA Phospholipid; biologic activity of", "UCUM", "AMass; ACnc", "Clinical", "Units for an anti phospholipid syndrome test", "1", "1", "1", 1, false], [false, "Bethesda unit", "[beth'U]", "[BETH'U]", "biologic activity of factor VIII inhibitor", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "BU", "UCUM", "ACnc", "Clinical", "measures of blood coagulation inhibitior for many blood factors", "1", "1", "1", 1, false], [false, "anti factor Xa unit", "[anti'Xa'U]", "[ANTI'XA'U]", "biologic activity of factor Xa inhibitor (heparin)", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "units", "UCUM", "ACnc", "Clinical", "[anti'Xa'U] unit is equivalent to and can be converted to IU/mL. ", "1", "1", "1", 1, false], [false, "Todd unit", "[todd'U]", "[TODD'U]", "biologic activity antistreptolysin O", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "units", "UCUM", "InvThres; RtoThres", "Clinical", "the unit for the results of the testing for antistreptolysin O (ASO)", "1", "1", "1", 1, false], [false, "Dye unit", "[dye'U]", "[DYE'U]", "biologic activity of amylase", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "units", "UCUM", "CCnc", "Obsolete", "equivalent to the Somogyi unit, which is an enzyme unit for amylase but better to use U, the standard enzyme unit for measuring catalytic activity", "1", "1", "1", 1, false], [false, "Somogyi unit", "[smgy'U]", "[SMGY'U]", "biologic activity of amylase", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "Somogyi units; smgy U", "UCUM", "CAct", "Clinical", "measures the enzymatic activity of amylase in blood serum - better to use base units mg/mL ", "1", "1", "1", 1, false], [false, "Bodansky unit", "[bdsk'U]", "[BDSK'U]", "biologic activity of phosphatase", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "", "UCUM", "ACnc", "Obsolete", "Enzyme unit specific to alkaline phosphatase - better to use standard enzyme unit of U", "1", "1", "1", 1, false], [false, "King-Armstrong unit", "[ka'U]", "[KA'U]", "biologic activity of phosphatase", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "King-Armstrong Units; King units", "UCUM", "AMass", "Obsolete", "enzyme units for acid phosphatase - better to use enzyme unit [U]", "1", "1", "1", 1, false], [false, "Kunkel unit", "[knk'U]", "[KNK'U]", "arbitrary biologic activity", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, null, "UCUM", null, null, null, "1", "1", "1", 1, false], [false, "Mac Lagan unit", "[mclg'U]", "[MCLG'U]", "arbitrary biologic activity", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "galactose index; galactose tolerance test; thymol turbidity test unit; mclg U; units; indexes", "UCUM", "ACnc", "Obsolete", "unit for liver tests - previously used in thymol turbidity tests for liver disease diagnoses, and now is sometimes referred to in the oral galactose tolerance test", "1", "1", "1", 1, false], [false, "tuberculin unit", "[tb'U]", "[TB'U]", "biologic activity of tuberculin", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "TU; units", "UCUM", "Arb", "Clinical", "amount of tuberculin antigen -usually in reference to a TB skin test ", "1", "1", "1", 1, false], [false, "50% cell culture infectious dose", "[CCID_50]", "[CCID_50]", "biologic activity (infectivity) of an infectious agent preparation", 1, [0, 0, 0, 0, 0, 0, 0], "CCID<sub>50</sub>", "chemical", false, null, null, 1, false, true, 0, "CCID50; 50% cell culture infective doses", "UCUM", "NumThres", "Clinical", "", "1", "1", "1", 1, false], [false, "50% tissue culture infectious dose", "[TCID_50]", "[TCID_50]", "biologic activity (infectivity) of an infectious agent preparation", 1, [0, 0, 0, 0, 0, 0, 0], "TCID<sub>50</sub>", "chemical", false, null, null, 1, false, true, 0, "TCID50; 50% tissue culture infective dose", "UCUM", "NumThres", "Clinical", "", "1", "1", "1", 1, false], [false, "50% embryo infectious dose", "[EID_50]", "[EID_50]", "biologic activity (infectivity) of an infectious agent preparation", 1, [0, 0, 0, 0, 0, 0, 0], "EID<sub>50</sub>", "chemical", false, null, null, 1, false, true, 0, "EID50; 50% embryo infective doses; EID50 Egg Infective Dosage", "UCUM", "thresNum", "Clinical", "", "1", "1", "1", 1, false], [false, "plaque forming units", "[PFU]", "[PFU]", "amount of an infectious agent", 1, [0, 0, 0, 0, 0, 0, 0], "PFU", "chemical", false, null, null, 1, false, true, 0, "PFU", "UCUM", "ACnc", "Clinical", "tests usually report unit as number of PFU per unit volume", "1", "1", "1", 1, false], [false, "focus forming units (cells)", "[FFU]", "[FFU]", "amount of an infectious agent", 1, [0, 0, 0, 0, 0, 0, 0], "FFU", "chemical", false, null, null, 1, false, true, 0, "FFU", "UCUM", "EntNum", "Clinical", "", "1", "1", "1", 1, false], [false, "colony forming units", "[CFU]", "[CFU]", "amount of a proliferating organism", 1, [0, 0, 0, 0, 0, 0, 0], "CFU", "chemical", false, null, null, 1, false, true, 0, "CFU", "UCUM", "Num", "Clinical", "", "1", "1", "1", 1, false], [false, "index of reactivity (allergen)", "[IR]", "[IR]", "amount of an allergen callibrated through in-vivo testing using the Stallergenes\xAE method.", 1, [0, 0, 0, 0, 0, 0, 0], "IR", "chemical", false, null, null, 1, false, true, 0, "IR; indexes", "UCUM", "Acnc", "Clinical", "amount of an allergen callibrated through in-vivo testing using the Stallergenes method. Usually reported in tests as IR/mL", "1", "1", "1", 1, false], [false, "bioequivalent allergen unit", "[BAU]", "[BAU]", "amount of an allergen callibrated through in-vivo testing based on the ID50EAL method of (intradermal dilution for 50mm sum of erythema diameters", 1, [0, 0, 0, 0, 0, 0, 0], "BAU", "chemical", false, null, null, 1, false, true, 0, "BAU; Bioequivalent Allergy Units; bioequivalent allergen units", "UCUM", "Arb", "Clinical", "", "1", "1", "1", 1, false], [false, "allergy unit", "[AU]", "[AU]", "procedure defined amount of an allergen using some reference standard", 1, [0, 0, 0, 0, 0, 0, 0], "AU", "chemical", false, null, null, 1, false, true, 0, "allergy units; allergen units; AU", "UCUM", "Arb", "Clinical", "Most standard test allergy units are reported as [IU] or as %. ", "1", "1", "1", 1, false], [false, "allergen unit for Ambrosia artemisiifolia", "[Amb'a'1'U]", "[AMB'A'1'U]", "procedure defined amount of the major allergen of ragweed.", 1, [0, 0, 0, 0, 0, 0, 0], "Amb a 1 U", "chemical", false, null, null, 1, false, true, 0, "Amb a 1 unit; Antigen E; AgE U; allergen units", "UCUM", "Arb", "Clinical", "Amb a 1 is the major allergen in short ragweed, and can be converted Bioequivalent allergen units (BAU) where 350 Amb a 1 U/mL = 100,000 BAU/mL", "1", "1", "1", 1, false], [false, "protein nitrogen unit (allergen testing)", "[PNU]", "[PNU]", "procedure defined amount of a protein substance", 1, [0, 0, 0, 0, 0, 0, 0], "PNU", "chemical", false, null, null, 1, false, true, 0, "protein nitrogen units; PNU", "UCUM", "Mass", "Clinical", "defined as 0.01 ug of phosphotungstic acid-precipitable protein nitrogen. Being replaced by bioequivalent allergy units (BAU).", "1", "1", "1", 1, false], [false, "Limit of flocculation", "[Lf]", "[LF]", "procedure defined amount of an antigen substance", 1, [0, 0, 0, 0, 0, 0, 0], "Lf", "chemical", false, null, null, 1, false, true, 0, "Lf doses", "UCUM", "Arb", "Clinical", "the antigen content  forming 1:1 ratio against 1 unit of antitoxin", "1", "1", "1", 1, false], [false, "D-antigen unit (polio)", "[D'ag'U]", "[D'AG'U]", "procedure defined amount of a poliomyelitis d-antigen substance", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "DAgU; units", "UCUM", "Acnc", "Clinical", "unit of potency of poliovirus vaccine used for poliomyelitis prevention reported as D antigen units/mL. The unit is poliovirus type-specific.", "1", "1", "1", 1, false], [false, "fibrinogen equivalent units", "[FEU]", "[FEU]", "amount of fibrinogen broken down into the measured d-dimers", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "FEU", "UCUM", "MCnc", "Clinical", "Note both the FEU and DDU units are used to report D-dimer measurements. 1 DDU = 1/2 FFU", "1", "1", "1", 1, false], [false, "ELISA unit", "[ELU]", "[ELU]", "arbitrary ELISA unit", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "Enzyme-Linked Immunosorbent Assay Units; ELU; EL. U", "UCUM", "ACnc", "Clinical", "", "1", "1", "1", 1, false], [false, "Ehrlich units (urobilinogen)", "[EU]", "[EU]", "Ehrlich unit", 1, [0, 0, 0, 0, 0, 0, 0], null, "chemical", false, null, null, 1, false, true, 0, "EU/dL; mg{urobilinogen}/dL", "UCUM", "ACnc", "Clinical", "", "1", "1", "1", 1, false], [false, "neper", "Np", "NEP", "level", 1, [0, 0, 0, 0, 0, 0, 0], "Np", "levels", true, null, "ln", 1, true, false, 0, "nepers", "UCUM", "LogRto", "Clinical", "logarithmic unit for ratios of measurements of physical field and power quantities, such as gain and loss of electronic signals", "1", null, null, 1, false], [false, "bel", "B", "B", "level", 1, [0, 0, 0, 0, 0, 0, 0], "B", "levels", true, null, "lg", 1, true, false, 0, "bels", "UCUM", "LogRto", "Clinical", "Logarithm of the ratio of power- or field-type quantities; usually expressed in decibels ", "1", null, null, 1, false], [false, "bel sound pressure", "B[SPL]", "B[SPL]", "pressure level", 0.02, [-1, -2, 1, 0, 0, 0, 0], "B(SPL)", "levels", true, null, "lgTimes2", 1, true, false, 0, "bel SPL; B SPL; sound pressure bels", "UCUM", "LogRto", "Clinical", "used to measure sound level in acoustics", "Pa", null, null, 0.00002, false], [false, "bel volt", "B[V]", "B[V]", "electric potential level", 1000, [2, -2, 1, 0, 0, -1, 0], "B(V)", "levels", true, null, "lgTimes2", 1, true, false, 0, "bel V; B V; volts bels", "UCUM", "LogRtoElp", "Clinical", "used to express power gain in electrical circuits", "V", null, null, 1, false], [false, "bel millivolt", "B[mV]", "B[MV]", "electric potential level", 1, [2, -2, 1, 0, 0, -1, 0], "B(mV)", "levels", true, null, "lgTimes2", 1, true, false, 0, "bel mV; B mV; millivolt bels; 10^-3V bels; 10*-3V ", "UCUM", "LogRtoElp", "Clinical", "used to express power gain in electrical circuits", "mV", null, null, 1, false], [false, "bel microvolt", "B[uV]", "B[UV]", "electric potential level", 0.001, [2, -2, 1, 0, 0, -1, 0], "B(\u03BCV)", "levels", true, null, "lgTimes2", 1, true, false, 0, "bel uV; B uV; microvolts bels; 10^-6V bel; 10*-6V bel", "UCUM", "LogRto", "Clinical", "used to express power gain in electrical circuits", "uV", null, null, 1, false], [false, "bel 10 nanovolt", "B[10.nV]", "B[10.NV]", "electric potential level", 0.000010000000000000003, [2, -2, 1, 0, 0, -1, 0], "B(10 nV)", "levels", true, null, "lgTimes2", 1, true, false, 0, "bel 10 nV; B 10 nV; 10 nanovolts bels", "UCUM", "LogRtoElp", "Clinical", "used to express power gain in electrical circuits", "nV", null, null, 10, false], [false, "bel watt", "B[W]", "B[W]", "power level", 1000, [2, -3, 1, 0, 0, 0, 0], "B(W)", "levels", true, null, "lg", 1, true, false, 0, "bel W; b W; b Watt; Watts bels", "UCUM", "LogRto", "Clinical", "used to express power", "W", null, null, 1, false], [false, "bel kilowatt", "B[kW]", "B[KW]", "power level", 1e6, [2, -3, 1, 0, 0, 0, 0], "B(kW)", "levels", true, null, "lg", 1, true, false, 0, "bel kW; B kW; kilowatt bel; kW bel; kW B", "UCUM", "LogRto", "Clinical", "used to express power", "kW", null, null, 1, false], [false, "stere", "st", "STR", "volume", 1, [3, 0, 0, 0, 0, 0, 0], "st", "misc", true, null, null, 1, false, false, 0, "st\xE8re; m3; cubic meter; m^3; meters cubed; metre", "UCUM", "Vol", "Nonclinical", "equal to one cubic meter, usually used for measuring firewoord", "m3", "M3", "1", 1, false], [false, "\xC5ngstr\xF6m", "Ao", "AO", "length", 0.00000000010000000000000002, [1, 0, 0, 0, 0, 0, 0], "\xC5", "misc", false, null, null, 1, false, false, 0, "\xC5; Angstroms; Ao; \xC5ngstr\xF6ms", "UCUM", "Len", "Clinical", "equal to 10^-10 meters; used to express wave lengths and atom scaled differences ", "nm", "NM", "0.1", 0.1, false], [false, "barn", "b", "BRN", "action area", 0.00000000000000000000000000009999999999999999, [2, 0, 0, 0, 0, 0, 0], "b", "misc", false, null, null, 1, false, false, 0, "barns", "UCUM", "Area", "Clinical", "used in high-energy physics to express cross-sectional areas", "fm2", "FM2", "100", 100, false], [false, "technical atmosphere", "att", "ATT", "pressure", 98066499.99999999, [-1, -2, 1, 0, 0, 0, 0], "at", "misc", false, null, null, 1, false, false, 0, "at; tech atm; tech atmosphere; kgf/cm2; atms; atmospheres", "UCUM", "Pres", "Obsolete", "non-SI unit of pressure equal to one kilogram-force per square centimeter", "kgf/cm2", "KGF/CM2", "1", 1, false], [false, "mho", "mho", "MHO", "electric conductance", 0.001, [-2, 1, -1, 0, 0, 2, 0], "mho", "misc", true, null, null, 1, false, false, 0, "siemens; ohm reciprocals; \u03A9^\u22121; \u03A9-1 ", "UCUM", "", "Obsolete", "unit of electric conductance (the inverse of electrical resistance) equal to ohm^-1", "S", "S", "1", 1, false], [false, "pound per square inch", "[psi]", "[PSI]", "pressure", 6894757.293168359, [-1, -2, 1, 0, 0, 0, 0], "psi", "misc", false, null, null, 1, false, false, 0, "psi; lb/in2; lb per in2", "UCUM", "Pres", "Clinical", "", "[lbf_av]/[in_i]2", "[LBF_AV]/[IN_I]2", "1", 1, false], [false, "circle - plane angle", "circ", "CIRC", "plane angle", 6.283185307179586, [0, 0, 0, 1, 0, 0, 0], "circ", "misc", false, null, null, 1, false, false, 0, "angles; circles", "UCUM", "Angle", "Clinical", "", "[pi].rad", "[PI].RAD", "2", 2, false], [false, "spere - solid angle", "sph", "SPH", "solid angle", 12.566370614359172, [0, 0, 0, 2, 0, 0, 0], "sph", "misc", false, null, null, 1, false, false, 0, "speres", "UCUM", "Angle", "Clinical", "equal to the solid angle of an entire sphere = 4\u03C0sr (sr = steradian) ", "[pi].sr", "[PI].SR", "4", 4, false], [false, "metric carat", "[car_m]", "[CAR_M]", "mass", 0.2, [0, 0, 1, 0, 0, 0, 0], "ct<sub>m</sub>", "misc", false, null, null, 1, false, false, 0, "carats; ct; car m", "UCUM", "Mass", "Nonclinical", "unit of mass for gemstones", "g", "G", "2e-1", 0.2, false], [false, "carat of gold alloys", "[car_Au]", "[CAR_AU]", "mass fraction", 0.041666666666666664, [0, 0, 0, 0, 0, 0, 0], "ct<sub><r>Au</r></sub>", "misc", false, null, null, 1, false, false, 0, "karats; k; kt; car au; carats", "UCUM", "MFr", "Nonclinical", "unit of purity for gold alloys", "/24", "/24", "1", 1, false], [false, "Smoot", "[smoot]", "[SMOOT]", "length", 1.7018000000000002, [1, 0, 0, 0, 0, 0, 0], null, "misc", false, null, null, 1, false, false, 0, "", "UCUM", "Len", "Nonclinical", "prank unit of length from MIT", "[in_i]", "[IN_I]", "67", 67, false], [false, "meter per square seconds per square root of hertz", "[m/s2/Hz^(1/2)]", "[M/S2/HZ^(1/2)]", "amplitude spectral density", 1, [2, -3, 0, 0, 0, 0, 0], null, "misc", false, null, "sqrt", 1, true, false, 0, "m/s2/(Hz^.5); m/s2/(Hz^(1/2)); m per s2 per Hz^1/2", "UCUM", "", "Constant", "measures amplitude spectral density, and is equal to the square root of power spectral density\n ", "m2/s4/Hz", null, null, 1, false], [false, "bit - logarithmic", "bit_s", "BIT_S", "amount of information", 1, [0, 0, 0, 0, 0, 0, 0], "bit<sub>s</sub>", "infotech", false, null, "ld", 1, true, false, 0, "bit-s; bit s; bit logarithmic", "UCUM", "LogA", "Nonclinical", "defined as the log base 2 of the number of distinct signals; cannot practically be used to express more than 1000 bits\n\nIn information theory, the definition of the amount of self-information and information entropy is often expressed with the binary logarithm (log base 2)", "1", null, null, 1, false], [false, "bit", "bit", "BIT", "amount of information", 1, [0, 0, 0, 0, 0, 0, 0], "bit", "infotech", true, null, null, 1, false, false, 0, "bits", "UCUM", "", "Nonclinical", "dimensionless information unit of 1 used in computing and digital communications", "1", "1", "1", 1, false], [false, "byte", "By", "BY", "amount of information", 8, [0, 0, 0, 0, 0, 0, 0], "B", "infotech", true, null, null, 1, false, false, 0, "bytes", "UCUM", "", "Nonclinical", "equal to 8 bits", "bit", "bit", "8", 8, false], [false, "baud", "Bd", "BD", "signal transmission rate", 1, [0, 1, 0, 0, 0, 0, 0], "Bd", "infotech", true, null, "inv", 1, false, false, 0, "Bd; bauds", "UCUM", "Freq", "Nonclinical", "unit to express rate in symbols per second or pulses per second. ", "s", "/s", "1", 1, false], [false, "per twelve hour", "/(12.h)", "/HR", "", 0.000023148148148148147, [0, -1, 0, 0, 0, 0, 0], "/h", null, false, null, null, 1, false, false, 0, "per 12 hours; 12hrs; 12 hrs; /12hrs", "LOINC", "Rat", "Clinical", "", null, null, null, null, false], [false, "per arbitrary unit", "/[arb'U]", "/[ARB'U]", "", 1, [0, 0, 0, 0, 0, 0, 0], "/arb/ U", null, false, null, null, 1, false, true, 0, "/arbU", "LOINC", "InvA ", "Clinical", "", null, null, null, null, false], [false, "per high power field", "/[HPF]", "/[HPF]", "", 1, [0, 0, 0, 0, 0, 0, 0], "/HPF", null, false, null, null, 1, false, false, 0, "/HPF; per HPF", "LOINC", "Naric", "Clinical", "", null, null, null, null, false], [false, "per international unit", "/[IU]", "/[IU]", "", 1, [0, 0, 0, 0, 0, 0, 0], "/i/U.", null, false, null, null, 1, false, true, 0, "international units; /IU; per IU", "LOINC", "InvA", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", null, null, null, null, false], [false, "per low power field", "/[LPF]", "/[LPF]", "", 1, [0, 0, 0, 0, 0, 0, 0], "/LPF", null, false, null, null, 1, false, false, 0, "/LPF; per LPF", "LOINC", "Naric", "Clinical", "", null, null, null, null, false], [false, "per 10 billion  ", "/10*10", "/10*10", "", 0.0000000001, [0, 0, 0, 0, 0, 0, 0], "/10<sup>10<.sup>", null, false, null, null, 1, false, false, 0, "/10^10; per 10*10", "LOINC", "NFr", "Clinical", "used for counting entities, e.g. blood cells; usually these kinds of terms have numerators such as moles or milligrams, and counting that amount per the number in the denominator", null, null, null, null, false], [false, "per trillion ", "/10*12", "/10*12", "", 0.000000000001, [0, 0, 0, 0, 0, 0, 0], "/10<sup>12<.sup>", null, false, null, null, 1, false, false, 0, "/10^12; per 10*12", "LOINC", "NFr", "Clinical", "used for counting entities, e.g. blood cells; usually these kinds of terms have numerators such as moles or milligrams, and counting that amount per the number in the denominator", null, null, null, null, false], [false, "per thousand", "/10*3", "/10*3", "", 0.001, [0, 0, 0, 0, 0, 0, 0], "/10<sup>3<.sup>", null, false, null, null, 1, false, false, 0, "/10^3; per 10*3", "LOINC", "NFr", "Clinical", "used for counting entities, e.g. blood cells; usually these kinds of terms have numerators such as moles or milligrams, and counting that amount per the number in the denominator", null, null, null, null, false], [false, "per million", "/10*6", "/10*6", "", 0.000001, [0, 0, 0, 0, 0, 0, 0], "/10<sup>6<.sup>", null, false, null, null, 1, false, false, 0, "/10^6; per 10*6;", "LOINC", "NFr", "Clinical", "used for counting entities, e.g. blood cells; usually these kinds of terms have numerators such as moles or milligrams, and counting that amount per the number in the denominator", null, null, null, null, false], [false, "per billion", "/10*9", "/10*9", "", 0.000000001, [0, 0, 0, 0, 0, 0, 0], "/10<sup>9<.sup>", null, false, null, null, 1, false, false, 0, "/10^9; per 10*9", "LOINC", "NFr", "Clinical", "used for counting entities, e.g. blood cells; usually these kinds of terms have numerators such as moles or milligrams, and counting that amount per the number in the denominator", null, null, null, null, false], [false, "per 100", "/100", "", "", 0.01, [0, 0, 0, 0, 0, 0, 0], null, null, false, null, null, 1, false, false, 0, "per hundred; 10^2; 10*2", "LOINC", "NFr", "Clinical", "used for counting entities, e.g. blood cells; usually these kinds of terms have numerators such as moles or milligrams, and counting that amount per the number in the denominator", null, null, null, null, false], [false, "per 100 cells", "/100{cells}", "", "", 0.01, [0, 0, 0, 0, 0, 0, 0], null, null, false, null, null, 1, false, false, 0, "/100 cells; /100cells; per hundred", "LOINC", "EntMass; EntNum; NFr", "Clinical", "", null, null, null, null, false], [false, "per 100 neutrophils", "/100{neutrophils}", "", "", 0.01, [0, 0, 0, 0, 0, 0, 0], null, null, false, null, null, 1, false, false, 0, "/100 neutrophils; /100neutrophils; per hundred", "LOINC", "EntMass; EntNum; NFr", "Clinical", "", null, null, null, null, false], [false, "per 100 spermatozoa", "/100{spermatozoa}", "", "", 0.01, [0, 0, 0, 0, 0, 0, 0], null, null, false, null, null, 1, false, false, 0, "/100 spermatozoa; /100spermatozoa; per hundred", "LOINC", "NFr", "Clinical", "", null, null, null, null, false], [false, "per 100 white blood cells", "/100{WBCs}", "", "", 0.01, [0, 0, 0, 0, 0, 0, 0], null, null, false, null, null, 1, false, false, 0, "/100 WBCs; /100WBCs; per hundred", "LOINC", "Ratio; NFr", "Clinical", "", null, null, null, null, false], [false, "per year", "/a", "/ANN", "", 0.00000003168808781402895, [0, -1, 0, 0, 0, 0, 0], "/a", null, false, null, null, 1, false, false, 0, "/Years; /yrs; yearly", "LOINC", "NRat", "Clinical", "", null, null, null, null, false], [false, "per centimeter of water", "/cm[H2O]", "/CM[H2O]", "", 0.000010197162129779282, [1, 2, -1, 0, 0, 0, 0], "/cm\xA0HO<sub><r>2<.r></sub>", null, false, null, null, 1, false, false, 0, "/cmH2O; /cm H2O; centimeters; centimetres", "LOINC", "InvPress", "Clinical", "", null, null, null, null, false], [false, "per day", "/d", "/D", "", 0.000011574074074074073, [0, -1, 0, 0, 0, 0, 0], "/d", null, false, null, null, 1, false, false, 0, "/dy; per day", "LOINC", "NRat", "Clinical", "", null, null, null, null, false], [false, "per deciliter", "/dL", "/DL", "", 1e4, [-3, 0, 0, 0, 0, 0, 0], "/dL", null, false, null, null, 1, false, false, 0, "per dL; /deciliter; decilitre", "LOINC", "NCnc", "Clinical", "", null, null, null, null, false], [false, "per gram", "/g", "/G", "", 1, [0, 0, -1, 0, 0, 0, 0], "/g", null, false, null, null, 1, false, false, 0, "/gm; /gram; per g", "LOINC", "NCnt", "Clinical", "", null, null, null, null, false], [false, "per hour", "/h", "/HR", "", 0.0002777777777777778, [0, -1, 0, 0, 0, 0, 0], "/h", null, false, null, null, 1, false, false, 0, "/hr; /hour; per hr", "LOINC", "NRat", "Clinical", "", null, null, null, null, false], [false, "per kilogram", "/kg", "/KG", "", 0.001, [0, 0, -1, 0, 0, 0, 0], "/kg", null, false, null, null, 1, false, false, 0, "per kg; per kilogram", "LOINC", "NCnt", "Clinical", "", null, null, null, null, false], [false, "per liter", "/L", "/L", "", 1000, [-3, 0, 0, 0, 0, 0, 0], "/L", null, false, null, null, 1, false, false, 0, "/liter; litre", "LOINC", "NCnc", "Clinical", "", null, null, null, null, false], [false, "per square meter", "/m2", "/M2", "", 1, [-2, 0, 0, 0, 0, 0, 0], "/m<sup>2<.sup>", null, false, null, null, 1, false, false, 0, "/m^2; /m*2; /sq. m; per square meter; meter squared; metre", "LOINC", "Naric", "Clinical", "", null, null, null, null, false], [false, "per cubic meter", "/m3", "/M3", "", 1, [-3, 0, 0, 0, 0, 0, 0], "/m<sup>3<.sup>", null, false, null, null, 1, false, false, 0, "/m^3; /m*3; /cu. m; per cubic meter; meter cubed; per m3; metre", "LOINC", "NCncn", "Clinical", "", null, null, null, null, false], [false, "per milligram", "/mg", "/MG", "", 1000, [0, 0, -1, 0, 0, 0, 0], "/mg", null, false, null, null, 1, false, false, 0, "/milligram; per mg", "LOINC", "NCnt", "Clinical", "", null, null, null, null, false], [false, "per minute", "/min", "/MIN", "", 0.016666666666666666, [0, -1, 0, 0, 0, 0, 0], "/min", null, false, null, null, 1, false, false, 0, "/minute; per mins; breaths beats per minute", "LOINC", "NRat", "Clinical", "", null, null, null, null, false], [false, "per milliliter", "/mL", "/ML", "", 1e6, [-3, 0, 0, 0, 0, 0, 0], "/mL", null, false, null, null, 1, false, false, 0, "/milliliter; per mL; millilitre", "LOINC", "NCncn", "Clinical", "", null, null, null, null, false], [false, "per millimeter", "/mm", "/MM", "", 1000, [-1, 0, 0, 0, 0, 0, 0], "/mm", null, false, null, null, 1, false, false, 0, "/millimeter; per mm; millimetre", "LOINC", "InvLen", "Clinical", "", null, null, null, null, false], [false, "per month", "/mo", "/MO", "", 0.0000003802570537683474, [0, -1, 0, 0, 0, 0, 0], "/mo", null, false, null, null, 1, false, false, 0, "/month; per mo; monthly; month", "LOINC", "NRat", "Clinical", "", null, null, null, null, false], [false, "per second", "/s", "/S", "", 1, [0, -1, 0, 0, 0, 0, 0], "/s", null, false, null, null, 1, false, false, 0, "/second; /sec; per sec; frequency; Hertz; Herz; Hz; becquerels; Bq; s-1; s^-1", "LOINC", "NRat", "Clinical", "", null, null, null, null, false], [false, "per enzyme unit", "/U", "/U", "", 0.00000000000000009963241120049633, [0, 1, 0, 0, 0, 0, 0], "/U", null, false, null, null, 1, false, false, -1, "/enzyme units; per U", "LOINC", "InvC; NCat", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", null, null, null, null, false], [false, "per microliter", "/uL", "/UL", "", 999999999.9999999, [-3, 0, 0, 0, 0, 0, 0], "/\u03BCL", null, false, null, null, 1, false, false, 0, "/microliter; microlitre; /mcl; per uL", "LOINC", "ACnc", "Clinical", "", null, null, null, null, false], [false, "per week", "/wk", "/WK", "", 0.0000016534391534391535, [0, -1, 0, 0, 0, 0, 0], "/wk", null, false, null, null, 1, false, false, 0, "/week; per wk; weekly, weeks", "LOINC", "NRat", "Clinical", "", null, null, null, null, false], [false, "APL unit per milliliter", "[APL'U]/mL", "[APL'U]/ML", "biologic activity of anticardiolipin IgA", 1e6, [-3, 0, 0, 0, 0, 0, 0], "/mL", "chemical", false, null, null, 1, false, true, 0, "APL/mL; APL'U/mL; APL U/mL; APL/milliliter; IgA anticardiolipin units per milliliter; IgA Phospholipid Units; millilitre; biologic activity of", "LOINC", "ACnc", "Clinical", "Units for an anti phospholipid syndrome test", "1", "1", "1", 1, false], [false, "arbitrary unit per milliliter", "[arb'U]/mL", "[ARB'U]/ML", "arbitrary", 1e6, [-3, 0, 0, 0, 0, 0, 0], "(arb. U)/mL", "chemical", false, null, null, 1, false, true, 0, "arb'U/mL; arbU/mL; arb U/mL; arbitrary units per milliliter; millilitre", "LOINC", "ACnc", "Clinical", "relative unit of measurement to show the ratio of test measurement to reference measurement", "1", "1", "1", 1, false], [false, "colony forming units per liter", "[CFU]/L", "[CFU]/L", "amount of a proliferating organism", 1000, [-3, 0, 0, 0, 0, 0, 0], "CFU/L", "chemical", false, null, null, 1, false, true, 0, "CFU per Liter; CFU/L", "LOINC", "NCnc", "Clinical", "", "1", "1", "1", 1, false], [false, "colony forming units per milliliter", "[CFU]/mL", "[CFU]/ML", "amount of a proliferating organism", 1e6, [-3, 0, 0, 0, 0, 0, 0], "CFU/mL", "chemical", false, null, null, 1, false, true, 0, "CFU per mL; CFU/mL", "LOINC", "NCnc", "Clinical", "", "1", "1", "1", 1, false], [false, "foot per foot - US", "[ft_us]/[ft_us]", "[FT_US]/[FT_US]", "length", 1, [0, 0, 0, 0, 0, 0, 0], "(ft<sub>us</sub>)/(ft<sub>us</sub>)", "us-lengths", false, null, null, 1, false, false, 0, "ft/ft; ft per ft; feet per feet; visual acuity", "", "LenRto", "Clinical", "distance ratio to measure 20:20 vision", "m/3937", "M/3937", "1200", 1200, false], [false, "GPL unit per milliliter", "[GPL'U]/mL", "[GPL'U]/ML", "biologic activity of anticardiolipin IgG", 1e6, [-3, 0, 0, 0, 0, 0, 0], "/mL", "chemical", false, null, null, 1, false, true, 0, "GPL U/mL; GPL'U/mL; GPL/mL; GPL U per mL; IgG Phospholipid Units per milliliters; IgG anticardiolipin units; millilitres ", "LOINC", "ACnc; AMass", "Clinical", "Units for an antiphospholipid test", "1", "1", "1", 1, false], [false, "international unit per 2 hour", "[IU]/(2.h)", "[IU]/HR", "arbitrary", 0.0001388888888888889, [0, -1, 0, 0, 0, 0, 0], "(i.U.)/h", "chemical", true, null, null, 1, false, true, 0, "IU/2hrs; IU/2 hours; IU per 2 hrs; international units per 2 hours", "LOINC", "ARat", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "international unit per 24 hour", "[IU]/(24.h)", "[IU]/HR", "arbitrary", 0.000011574074074074073, [0, -1, 0, 0, 0, 0, 0], "(i.U.)/h", "chemical", true, null, null, 1, false, true, 0, "IU/24hr; IU/24 hours; IU per 24 hrs; international units per 24 hours", "LOINC", "ARat", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "international unit per day", "[IU]/d", "[IU]/D", "arbitrary", 0.000011574074074074073, [0, -1, 0, 0, 0, 0, 0], "(i.U.)/d", "chemical", true, null, null, 1, false, true, 0, "IU/dy; IU/days; IU per dys; international units per day", "LOINC", "ARat", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "international unit per deciliter", "[IU]/dL", "[IU]/DL", "arbitrary", 1e4, [-3, 0, 0, 0, 0, 0, 0], "(i.U.)/dL", "chemical", true, null, null, 1, false, true, 0, "IU/dL; IU per dL; international units per deciliters; decilitres", "LOINC", "ACnc", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "international unit per gram", "[IU]/g", "[IU]/G", "arbitrary", 1, [0, 0, -1, 0, 0, 0, 0], "(i.U.)/g", "chemical", true, null, null, 1, false, true, 0, "IU/gm; IU/gram; IU per gm; IU per g; international units per gram", "LOINC", "ACnt", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "international unit per hour", "[IU]/h", "[IU]/HR", "arbitrary", 0.0002777777777777778, [0, -1, 0, 0, 0, 0, 0], "(i.U.)/h", "chemical", true, null, null, 1, false, true, 0, "IU/hrs; IU per hours; international units per hour", "LOINC", "ARat", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "international unit per kilogram", "[IU]/kg", "[IU]/KG", "arbitrary", 0.001, [0, 0, -1, 0, 0, 0, 0], "(i.U.)/kg", "chemical", true, null, null, 1, false, true, 0, "IU/kg; IU/kilogram; IU per kg; units", "LOINC", "ACnt", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "international unit per kilogram per day", "[IU]/kg/d", "[IU]/KG/D", "arbitrary", 0.000000011574074074074074, [0, -1, -1, 0, 0, 0, 0], "(i.U.)/kg/d", "chemical", true, null, null, 1, false, true, 0, "IU/kg/dy; IU/kg/day; IU/kilogram/day; IU per kg per day; units", "LOINC", "ACntRat", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "international unit per liter", "[IU]/L", "[IU]/L", "arbitrary", 1000, [-3, 0, 0, 0, 0, 0, 0], "(i.U.)/L", "chemical", true, null, null, 1, false, true, 0, "IU/L; IU/liter; IU per liter; units; litre", "LOINC", "ACnc", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "international unit per minute", "[IU]/min", "[IU]/MIN", "arbitrary", 0.016666666666666666, [0, -1, 0, 0, 0, 0, 0], "(i.U.)/min", "chemical", true, null, null, 1, false, true, 0, "IU/min; IU/minute; IU per minute; international units", "LOINC", "ARat", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "international unit per milliliter", "[IU]/mL", "[IU]/ML", "arbitrary", 1e6, [-3, 0, 0, 0, 0, 0, 0], "(i.U.)/mL", "chemical", true, null, null, 1, false, true, 0, "IU/mL; IU per mL; international units per milliliter; millilitre", "LOINC", "ACnc", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "MPL unit per milliliter", "[MPL'U]/mL", "[MPL'U]/ML", "biologic activity of anticardiolipin IgM", 1e6, [-3, 0, 0, 0, 0, 0, 0], "/mL", "chemical", false, null, null, 1, false, true, 0, "MPL/mL; MPL U/mL; MPL'U/mL; IgM anticardiolipin units; IgM Phospholipid Units; millilitre ", "LOINC", "ACnc", "Clinical", "units for antiphospholipid test\n", "1", "1", "1", 1, false], [false, "number per high power field", "{#}/[HPF]", "/[HPF]", "", 1, [0, 0, 0, 0, 0, 0, 0], "/HPF", null, false, null, null, 1, false, false, 0, "#/HPF; # per HPF; number/HPF; numbers per high power field", "LOINC", "Naric", "Clinical", "", null, null, null, null, false], [false, "number per low power field", "{#}/[LPF]", "/[LPF]", "", 1, [0, 0, 0, 0, 0, 0, 0], "/LPF", null, false, null, null, 1, false, false, 0, "#/LPF; # per LPF; number/LPF; numbers per low power field", "LOINC", "Naric", "Clinical", "", null, null, null, null, false], [false, "IgA antiphosphatidylserine unit ", "{APS'U}", "", "", 1, [0, 0, 0, 0, 0, 0, 0], null, null, false, null, null, 1, false, false, 0, "APS Unit; Phosphatidylserine Antibody IgA Units", "LOINC", "ACnc", "Clinical", "unit for antiphospholipid test", null, null, null, null, false], [false, "EIA index", "{EIA_index}", "", "", 1, [0, 0, 0, 0, 0, 0, 0], null, null, false, null, null, 1, false, false, 0, "enzyme immunoassay index", "LOINC", "ACnc", "Clinical", "", null, null, null, null, false], [false, "kaolin clotting time", "{KCT'U}", "", "", 1, [0, 0, 0, 0, 0, 0, 0], null, null, false, null, null, 1, false, false, 0, "KCT", "LOINC", "Time", "Clinical", "sensitive\xA0test to detect\xA0lupus anticoagulants; measured in seconds", null, null, null, null, false], [false, "IgM antiphosphatidylserine unit", "{MPS'U}", "", "", 1, [0, 0, 0, 0, 0, 0, 0], null, null, false, null, null, 1, false, false, 0, "Phosphatidylserine Antibody IgM Measurement ", "LOINC", "ACnc", "Clinical", "", null, null, null, null, false], [false, "trillion per liter", "10*12/L", "(10*12)/L", "number", 1000000000000000, [-3, 0, 0, 0, 0, 0, 0], "(10<sup>12</sup>)/L", "dimless", false, null, null, 1, false, false, 0, "10^12/L; 10*12 per Liter; trillion per liter; litre", "LOINC", "NCncn", "Clinical", "", "1", "1", "10", 10, false], [false, "10^3 (used for cell count)", "10*3", "10*3", "number", 1000, [0, 0, 0, 0, 0, 0, 0], "10<sup>3</sup>", "dimless", false, null, null, 1, false, false, 0, "10^3; thousand", "LOINC", "Num", "Clinical", "usually used for counting entities (e.g. blood cells) per volume", "1", "1", "10", 10, false], [false, "thousand per liter", "10*3/L", "(10*3)/L", "number", 1e6, [-3, 0, 0, 0, 0, 0, 0], "(10<sup>3</sup>)/L", "dimless", false, null, null, 1, false, false, 0, "10^3/L; 10*3 per liter; litre", "LOINC", "NCncn", "Clinical", "", "1", "1", "10", 10, false], [false, "thousand per milliliter", "10*3/mL", "(10*3)/ML", "number", 1e9, [-3, 0, 0, 0, 0, 0, 0], "(10<sup>3</sup>)/mL", "dimless", false, null, null, 1, false, false, 0, "10^3/mL; 10*3 per mL; thousand per milliliter; millilitre", "LOINC", "NCncn", "Clinical", "", "1", "1", "10", 10, false], [false, "thousand per microliter", "10*3/uL", "(10*3)/UL", "number", 999999999999.9999, [-3, 0, 0, 0, 0, 0, 0], "(10<sup>3</sup>)/\u03BCL", "dimless", false, null, null, 1, false, false, 0, "10^3/uL; 10*3 per uL; thousand per microliter; microlitre", "LOINC", "NCncn", "Clinical", "", "1", "1", "10", 10, false], [false, "10 thousand per microliter", "10*4/uL", "(10*4)/UL", "number", 10000000000000, [-3, 0, 0, 0, 0, 0, 0], "(10<sup>4</sup>)/\u03BCL", "dimless", false, null, null, 1, false, false, 0, "10^4/uL; 10*4 per uL; microlitre", "LOINC", "NCncn", "Clinical", "", "1", "1", "10", 10, false], [false, "10^5 ", "10*5", "10*5", "number", 1e5, [0, 0, 0, 0, 0, 0, 0], "10<sup>5</sup>", "dimless", false, null, null, 1, false, false, 0, "one hundred thousand", "LOINC", "Num", "Clinical", "", "1", "1", "10", 10, false], [false, "10^6", "10*6", "10*6", "number", 1e6, [0, 0, 0, 0, 0, 0, 0], "10<sup>6</sup>", "dimless", false, null, null, 1, false, false, 0, "", "LOINC", "Num", "Clinical", "", "1", "1", "10", 10, false], [false, "million colony forming unit per liter", "10*6.[CFU]/L", "(10*6).[CFU]/L", "number", 1e9, [-3, 0, 0, 0, 0, 0, 0], "(10<sup>6</sup>).CFU/L", "dimless", false, null, null, 1, false, true, 0, "10*6 CFU/L; 10^6 CFU/L; 10^6CFU; 10^6 CFU per liter; million colony forming units; litre", "LOINC", "ACnc", "Clinical", "", "1", "1", "10", 10, false], [false, "million international unit", "10*6.[IU]", "(10*6).[IU]", "number", 1e6, [0, 0, 0, 0, 0, 0, 0], "(10<sup>6</sup>).(i.U.)", "dimless", false, null, null, 1, false, true, 0, "10*6 IU; 10^6 IU; international units", "LOINC", "arb", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "1", "1", "10", 10, false], [false, "million per 24 hour", "10*6/(24.h)", "(10*6)/HR", "number", 11.574074074074074, [0, -1, 0, 0, 0, 0, 0], "(10<sup>6</sup>)/h", "dimless", false, null, null, 1, false, false, 0, "10*6/24hrs; 10^6/24 hrs; 10*6 per 24 hrs; 10^6 per 24 hours", "LOINC", "NRat", "Clinical", "", "1", "1", "10", 10, false], [false, "million per kilogram", "10*6/kg", "(10*6)/KG", "number", 1000, [0, 0, -1, 0, 0, 0, 0], "(10<sup>6</sup>)/kg", "dimless", false, null, null, 1, false, false, 0, "10^6/kg; 10*6 per kg; 10*6 per kilogram; millions", "LOINC", "NCnt", "Clinical", "", "1", "1", "10", 10, false], [false, "million per liter", "10*6/L", "(10*6)/L", "number", 1e9, [-3, 0, 0, 0, 0, 0, 0], "(10<sup>6</sup>)/L", "dimless", false, null, null, 1, false, false, 0, "10^6/L; 10*6 per Liter; 10^6 per Liter; litre", "LOINC", "NCncn", "Clinical", "", "1", "1", "10", 10, false], [false, "million per milliliter", "10*6/mL", "(10*6)/ML", "number", 1000000000000, [-3, 0, 0, 0, 0, 0, 0], "(10<sup>6</sup>)/mL", "dimless", false, null, null, 1, false, false, 0, "10^6/mL; 10*6 per mL; 10*6 per milliliter; millilitre", "LOINC", "NCncn", "Clinical", "", "1", "1", "10", 10, false], [false, "million per microliter", "10*6/uL", "(10*6)/UL", "number", 1000000000000000, [-3, 0, 0, 0, 0, 0, 0], "(10<sup>6</sup>)/\u03BCL", "dimless", false, null, null, 1, false, false, 0, "10^6/uL; 10^6 per uL; 10^6/mcl; 10^6 per mcl; 10^6 per microliter; microlitre", "LOINC", "NCncn", "Clinical", "", "1", "1", "10", 10, false], [false, "10^8", "10*8", "10*8", "number", 1e8, [0, 0, 0, 0, 0, 0, 0], "10<sup>8</sup>", "dimless", false, null, null, 1, false, false, 0, "100 million; one hundred million; 10^8", "LOINC", "Num", "Clinical", "", "1", "1", "10", 10, false], [false, "billion per liter", "10*9/L", "(10*9)/L", "number", 1000000000000, [-3, 0, 0, 0, 0, 0, 0], "(10<sup>9</sup>)/L", "dimless", false, null, null, 1, false, false, 0, "10^9/L; 10*9 per Liter; litre", "LOINC", "NCncn", "Clinical", "", "1", "1", "10", 10, false], [false, "billion per milliliter", "10*9/mL", "(10*9)/ML", "number", 1000000000000000, [-3, 0, 0, 0, 0, 0, 0], "(10<sup>9</sup>)/mL", "dimless", false, null, null, 1, false, false, 0, "10^9/mL; 10*9 per mL; 10^9 per mL; 10*9 per milliliter; millilitre", "LOINC", "NCncn", "Clinical", "", "1", "1", "10", 10, false], [false, "billion per microliter", "10*9/uL", "(10*9)/UL", "number", 1000000000000000000, [-3, 0, 0, 0, 0, 0, 0], "(10<sup>9</sup>)/\u03BCL", "dimless", false, null, null, 1, false, false, 0, "10^9/uL; 10^9 per uL; 10^9/mcl; 10^9 per mcl; 10*9 per uL; 10*9 per mcl; 10*9/mcl; 10^9 per microliter; microlitre", "LOINC", "NCncn", "Clinical", "", "1", "1", "10", 10, false], [false, "10 liter per minute per square meter", "10.L/(min.m2)", "L/(MIN.M2)", "", 0.00016666666666666666, [1, -1, 0, 0, 0, 0, 0], "L/(min.(m<sup>2</sup>))", null, false, null, null, 1, false, false, 0, "10 liters per minutes per square meter; 10 L per min per m2; m^2; 10 L/(min*m2); 10L/(min*m^2); litres; sq. meter; metre; meters squared", "LOINC", "ArVRat", "Clinical", "", null, null, null, null, false], [false, "10 liter per minute", "10.L/min", "L/MIN", "", 0.00016666666666666666, [3, -1, 0, 0, 0, 0, 0], "L/min", null, false, null, null, 1, false, false, 0, "10 liters per minute; 10 L per min; 10L; 10 L/min; litre", "LOINC", "VRat", "Clinical", "", null, null, null, null, false], [false, "10 micronewton second per centimeter to the fifth power per square meter", "10.uN.s/(cm5.m2)", "(UN.S)/(CM5.M2)", "", 1e8, [-6, -1, 1, 0, 0, 0, 0], "(\u03BCN.s)/(cm<sup>5</sup>).(m<sup>2</sup>)", null, false, null, null, 1, false, false, 0, "dyne seconds per centimeter5 and square meter; dyn.s/(cm5.m2); dyn.s/cm5/m2; cm^5; m^2", "LOINC", "", "Clinical", "unit to measure systemic vascular resistance per body surface area", null, null, null, null, false], [false, "24 hour", "24.h", "HR", "", 86400, [0, 1, 0, 0, 0, 0, 0], "h", null, false, null, null, 1, false, false, 0, "24hrs; 24 hrs; 24 hours; days; dy", "LOINC", "Time", "Clinical", "", null, null, null, null, false], [false, "ampere per meter", "A/m", "A/M", "electric current", 1, [-1, -1, 0, 0, 0, 1, 0], "A/m", "si", true, null, null, 1, false, false, 0, "A/m; amp/meter; magnetic field strength; H; B; amperes per meter; metre", "LOINC", "", "Clinical", "unit of magnetic field strength", "C/s", "C/S", "1", 1, false], [true, "centigram", "cg", "CG", "mass", 0.01, [0, 0, 1, 0, 0, 0, 0], "cg", null, false, "M", null, 1, false, false, 0, "centigrams; cg; cgm", "LOINC", "Mass", "Clinical", "", null, null, null, null, false], [false, "centiliter", "cL", "CL", "volume", 0.00001, [3, 0, 0, 0, 0, 0, 0], "cL", "iso1000", true, null, null, 1, false, false, 0, "centiliters; centilitres", "LOINC", "Vol", "Clinical", "", "l", null, "1", 1, false], [true, "centimeter", "cm", "CM", "length", 0.01, [1, 0, 0, 0, 0, 0, 0], "cm", null, false, "L", null, 1, false, false, 0, "centimeters; centimetres", "LOINC", "Len", "Clinical", "", null, null, null, null, false], [false, "centimeter of water", "cm[H2O]", "CM[H2O]", "pressure", 98066.5, [-1, -2, 1, 0, 0, 0, 0], "cm\xA0HO<sub><r>2</r></sub>", "clinical", true, null, null, 1, false, false, 0, "cm H2O; cmH2O; centimetres; pressure", "LOINC", "Pres", "Clinical", "unit of pressure mostly applies to blood pressure", "kPa", "KPAL", "980665e-5", 9.80665, false], [false, "centimeter of water per liter per second", "cm[H2O]/L/s", "(CM[H2O]/L)/S", "pressure", 98066500, [-4, -3, 1, 0, 0, 0, 0], "(cm\xA0HO<sub><r>2</r></sub>)/L/s", "clinical", true, null, null, 1, false, false, 0, "cm[H2O]/(L/s); cm[H2O].s/L; cm H2O/L/sec; cmH2O/L/sec; cmH2O/Liter; cmH2O per L per secs; centimeters of water per liters per second; centimetres; litres; cm[H2O]/(L/s)", "LOINC", "PresRat", "Clinical", "unit used to measure mean pulmonary resistance", "kPa", "KPAL", "980665e-5", 9.80665, false], [false, "centimeter of water per second per meter", "cm[H2O]/s/m", "(CM[H2O]/S)/M", "pressure", 98066.5, [-2, -3, 1, 0, 0, 0, 0], "(cm\xA0HO<sub><r>2</r></sub>)/s/m", "clinical", true, null, null, 1, false, false, 0, "cm[H2O]/(s.m); cm H2O/s/m; cmH2O; cmH2O/sec/m; cmH2O per secs per meters; centimeters of water per seconds per meter; centimetres; metre", "LOINC", "PresRat", "Clinical", "unit used to measure pulmonary pressure time product", "kPa", "KPAL", "980665e-5", 9.80665, false], [false, "centimeter of mercury", "cm[Hg]", "CM[HG]", "pressure", 1333220, [-1, -2, 1, 0, 0, 0, 0], "cm\xA0Hg", "clinical", true, null, null, 1, false, false, 0, "centimeters of mercury; centimetres; cmHg; cm Hg", "LOINC", "Pres", "Clinical", "unit of pressure where 1 cmHg = 10 torr", "kPa", "KPAL", "133.3220", 133.322, false], [true, "square centimeter", "cm2", "CM2", "length", 0.0001, [2, 0, 0, 0, 0, 0, 0], "cm<sup>2</sup>", null, false, "L", null, 1, false, false, 0, "cm^2; sq cm; centimeters squared; square centimeters; centimetre; area", "LOINC", "Area", "Clinical", "", null, null, null, null, false], [true, "square centimeter per second", "cm2/s", "CM2/S", "length", 0.0001, [2, -1, 0, 0, 0, 0, 0], "(cm<sup>2</sup>)/s", null, false, "L", null, 1, false, false, 0, "cm^2/sec; square centimeters per second; sq cm per sec; cm2; centimeters squared; centimetres", "LOINC", "AreaRat", "Clinical", "", null, null, null, null, false], [false, "centipoise", "cP", "CP", "dynamic viscosity", 1, [-1, -1, 1, 0, 0, 0, 0], "cP", "cgs", true, null, null, 1, false, false, 0, "cps; centiposes", "LOINC", "Visc", "Clinical", "unit of dynamic viscosity in the CGS system with base units: 10^\u22123 Pa.s = 1 mPa\xB7.s (1 millipascal second)", "dyn.s/cm2", "DYN.S/CM2", "1", 1, false], [false, "centistoke", "cSt", "CST", "kinematic viscosity", 0.0000010000000000000002, [2, -1, 0, 0, 0, 0, 0], "cSt", "cgs", true, null, null, 1, false, false, 0, "centistokes", "LOINC", "Visc", "Clinical", "unit for kinematic viscosity with base units of mm^2/s (square millimeter per second)", "cm2/s", "CM2/S", "1", 1, false], [false, "dekaliter per minute", "daL/min", "DAL/MIN", "volume", 0.00016666666666666666, [3, -1, 0, 0, 0, 0, 0], "daL/min", "iso1000", true, null, null, 1, false, false, 0, "dekalitres; dekaliters per minute; per min", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "dekaliter per minute per square meter", "daL/min/m2", "(DAL/MIN)/M2", "volume", 0.00016666666666666666, [1, -1, 0, 0, 0, 0, 0], "(daL/min)/(m<sup>2</sup>)", "iso1000", true, null, null, 1, false, false, 0, "daL/min/m^2; daL/minute/m2; sq. meter; dekaliters per minutes per square meter; meter squared; dekalitres; metre", "LOINC", "ArVRat", "Clinical", "The area usually is the body surface area used to normalize cardiovascular measures for patient's size", "l", null, "1", 1, false], [false, "decibel", "dB", "DB", "level", 1, [0, 0, 0, 0, 0, 0, 0], "dB", "levels", true, null, "lg", 0.1, true, false, 0, "decibels", "LOINC", "LogRto", "Clinical", "unit most commonly used in acoustics as unit of sound pressure level. (also see B[SPL] or bel sound pressure level). ", "1", null, null, 1, false], [false, "degree per second", "deg/s", "DEG/S", "plane angle", 0.017453292519943295, [0, -1, 0, 1, 0, 0, 0], "\xB0/s", "iso1000", false, null, null, 1, false, false, 0, "deg/sec; deg per sec; \xB0/sec; twist rate; angular speed; rotational speed", "LOINC", "ARat", "Clinical", "unit of angular (rotational) speed used to express turning rate", "[pi].rad/360", "[PI].RAD/360", "2", 2, false], [true, "decigram", "dg", "DG", "mass", 0.1, [0, 0, 1, 0, 0, 0, 0], "dg", null, false, "M", null, 1, false, false, 0, "decigrams; dgm; 0.1 grams; 1/10 gm", "LOINC", "Mass", "Clinical", "equal to 1/10 gram", null, null, null, null, false], [false, "deciliter", "dL", "DL", "volume", 0.0001, [3, 0, 0, 0, 0, 0, 0], "dL", "iso1000", true, null, null, 1, false, false, 0, "deciliters; decilitres; 0.1 liters; 1/10 L", "LOINC", "Vol", "Clinical", "equal to 1/10 liter", "l", null, "1", 1, false], [true, "decimeter", "dm", "DM", "length", 0.1, [1, 0, 0, 0, 0, 0, 0], "dm", null, false, "L", null, 1, false, false, 0, "decimeters; decimetres; 0.1 meters; 1/10 m; 10 cm; centimeters", "LOINC", "Len", "Clinical", "equal to 1/10 meter or 10 centimeters", null, null, null, null, false], [true, "square decimeter per square second", "dm2/s2", "DM2/S2", "length", 0.010000000000000002, [2, -2, 0, 0, 0, 0, 0], "(dm<sup>2</sup>)/(s<sup>2</sup>)", null, false, "L", null, 1, false, false, 0, "dm2 per s2; dm^2/s^2; decimeters squared per second squared; sq dm; sq sec", "LOINC", "EngMass (massic energy)", "Clinical", "units for energy per unit mass or Joules per kilogram (J/kg = kg.m2/s2/kg = m2/s2) ", null, null, null, null, false], [false, "dyne second per centimeter per square meter", "dyn.s/(cm.m2)", "(DYN.S)/(CM.M2)", "force", 1, [-2, -1, 1, 0, 0, 0, 0], "(dyn.s)/(cm.(m<sup>2</sup>))", "cgs", true, null, null, 1, false, false, 0, "(dyn*s)/(cm*m2); (dyn*s)/(cm*m^2); dyn s per cm per m2; m^2; dyne seconds per centimeters per square meter; centimetres; sq. meter; squared", "LOINC", "", "Clinical", "", "g.cm/s2", "G.CM/S2", "1", 1, false], [false, "dyne second per centimeter", "dyn.s/cm", "(DYN.S)/CM", "force", 1, [0, -1, 1, 0, 0, 0, 0], "(dyn.s)/cm", "cgs", true, null, null, 1, false, false, 0, "(dyn*s)/cm; dyn sec per cm; seconds; centimetre; dyne seconds", "LOINC", "", "Clinical", "", "g.cm/s2", "G.CM/S2", "1", 1, false], [false, "equivalent per liter", "eq/L", "EQ/L", "amount of substance", 602213669999999940000000000, [-3, 0, 0, 0, 0, 0, 0], "eq/L", "chemical", true, null, null, 1, false, false, 1, "eq/liter; eq/litre; eqs; equivalents per liter; litre", "LOINC", "SCnc", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "equivalent per milliliter", "eq/mL", "EQ/ML", "amount of substance", 602213670000000000000000000000, [-3, 0, 0, 0, 0, 0, 0], "eq/mL", "chemical", true, null, null, 1, false, false, 1, "equivalent/milliliter; equivalents per milliliter; eq per mL; millilitre", "LOINC", "SCnc", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "equivalent per millimole", "eq/mmol", "EQ/MMOL", "amount of substance", 1000, [0, 0, 0, 0, 0, 0, 0], "eq/mmol", "chemical", true, null, null, 1, false, false, 0, "equivalent/millimole; equivalents per millimole; eq per mmol", "LOINC", "SRto", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "equivalent per micromole", "eq/umol", "EQ/UMOL", "amount of substance", 1e6, [0, 0, 0, 0, 0, 0, 0], "eq/\u03BCmol", "chemical", true, null, null, 1, false, false, 0, "equivalent/micromole; equivalents per micromole; eq per umol", "LOINC", "SRto", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [true, "femtogram", "fg", "FG", "mass", 0.000000000000001, [0, 0, 1, 0, 0, 0, 0], "fg", null, false, "M", null, 1, false, false, 0, "fg; fgm; femtograms; weight", "LOINC", "Mass", "Clinical", "equal to 10^-15 grams", null, null, null, null, false], [false, "femtoliter", "fL", "FL", "volume", 0.000000000000000001, [3, 0, 0, 0, 0, 0, 0], "fL", "iso1000", true, null, null, 1, false, false, 0, "femtolitres; femtoliters", "LOINC", "Vol; EntVol", "Clinical", "equal to 10^-15 liters", "l", null, "1", 1, false], [true, "femtometer", "fm", "FM", "length", 0.000000000000001, [1, 0, 0, 0, 0, 0, 0], "fm", null, false, "L", null, 1, false, false, 0, "femtometres; femtometers", "LOINC", "Len", "Clinical", "equal to 10^-15 meters", null, null, null, null, false], [false, "femtomole", "fmol", "FMOL", "amount of substance", 602213670, [0, 0, 0, 0, 0, 0, 0], "fmol", "si", true, null, null, 1, false, false, 1, "femtomoles", "LOINC", "EntSub", "Clinical", "equal to 10^-15 moles", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "femtomole per gram", "fmol/g", "FMOL/G", "amount of substance", 602213670, [0, 0, -1, 0, 0, 0, 0], "fmol/g", "si", true, null, null, 1, false, false, 1, "femtomoles; fmol/gm; fmol per gm", "LOINC", "SCnt", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "femtomole per liter", "fmol/L", "FMOL/L", "amount of substance", 602213670000, [-3, 0, 0, 0, 0, 0, 0], "fmol/L", "si", true, null, null, 1, false, false, 1, "femtomoles; fmol per liter; litre", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "femtomole per milligram", "fmol/mg", "FMOL/MG", "amount of substance", 602213670000, [0, 0, -1, 0, 0, 0, 0], "fmol/mg", "si", true, null, null, 1, false, false, 1, "fmol per mg; femtomoles", "LOINC", "SCnt", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "femtomole per milliliter", "fmol/mL", "FMOL/ML", "amount of substance", 602213670000000, [-3, 0, 0, 0, 0, 0, 0], "fmol/mL", "si", true, null, null, 1, false, false, 1, "femtomoles; millilitre; fmol per mL; fmol per milliliter", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [true, "gram meter", "g.m", "G.M", "mass", 1, [1, 0, 1, 0, 0, 0, 0], "g.m", null, false, "M", null, 1, false, false, 0, "g*m; gxm; meters; metres", "LOINC", "Enrg", "Clinical", "Unit for measuring stroke work (heart work)", null, null, null, null, false], [true, "gram per 100 gram", "g/(100.g)", "G/G", "mass", 0.01, [0, 0, 0, 0, 0, 0, 0], "g/g", null, false, "M", null, 1, false, false, 0, "g/100 gm; 100gm; grams per 100 grams; gm per 100 gm", "LOINC", "MCnt", "Clinical", "", null, null, null, null, false], [true, "gram per 12 hour", "g/(12.h)", "G/HR", "mass", 0.000023148148148148147, [0, -1, 1, 0, 0, 0, 0], "g/h", null, false, "M", null, 1, false, false, 0, "gm/12hrs; 12 hrs; gm per 12 hrs; 12hrs; grams per 12 hours", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "gram per 24 hour", "g/(24.h)", "G/HR", "mass", 0.000011574074074074073, [0, -1, 1, 0, 0, 0, 0], "g/h", null, false, "M", null, 1, false, false, 0, "gm/24hrs; gm/24 hrs; gm per 24 hrs; 24hrs; grams per 24 hours; gm/dy; gm per dy; grams per day", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "gram per 3 days", "g/(3.d)", "G/D", "mass", 0.000003858024691358025, [0, -1, 1, 0, 0, 0, 0], "g/d", null, false, "M", null, 1, false, false, 0, "gm/3dy; gm/3 dy; gm per 3 days; grams", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "gram per 4 hour", "g/(4.h)", "G/HR", "mass", 0.00006944444444444444, [0, -1, 1, 0, 0, 0, 0], "g/h", null, false, "M", null, 1, false, false, 0, "gm/4hrs; gm/4 hrs; gm per 4 hrs; 4hrs; grams per 4 hours", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "gram per 48 hour", "g/(48.h)", "G/HR", "mass", 0.000005787037037037037, [0, -1, 1, 0, 0, 0, 0], "g/h", null, false, "M", null, 1, false, false, 0, "gm/48hrs; gm/48 hrs; gm per 48 hrs; 48hrs; grams per 48 hours", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "gram per 5 hour", "g/(5.h)", "G/HR", "mass", 0.00005555555555555556, [0, -1, 1, 0, 0, 0, 0], "g/h", null, false, "M", null, 1, false, false, 0, "gm/5hrs; gm/5 hrs; gm per 5 hrs; 5hrs; grams per 5 hours", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "gram per 6 hour", "g/(6.h)", "G/HR", "mass", 0.000046296296296296294, [0, -1, 1, 0, 0, 0, 0], "g/h", null, false, "M", null, 1, false, false, 0, "gm/6hrs; gm/6 hrs; gm per 6 hrs; 6hrs; grams per 6 hours", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "gram per 72 hour", "g/(72.h)", "G/HR", "mass", 0.000003858024691358025, [0, -1, 1, 0, 0, 0, 0], "g/h", null, false, "M", null, 1, false, false, 0, "gm/72hrs; gm/72 hrs; gm per 72 hrs; 72hrs; grams per 72 hours", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "gram per cubic centimeter", "g/cm3", "G/CM3", "mass", 999999.9999999999, [-3, 0, 1, 0, 0, 0, 0], "g/(cm<sup>3</sup>)", null, false, "M", null, 1, false, false, 0, "g/cm^3; gm per cm3; g per cm^3; grams per centimeter cubed; cu. cm; centimetre; g/mL; gram per milliliter; millilitre", "LOINC", "MCnc", "Clinical", "g/cm3 = g/mL", null, null, null, null, false], [true, "gram per day", "g/d", "G/D", "mass", 0.000011574074074074073, [0, -1, 1, 0, 0, 0, 0], "g/d", null, false, "M", null, 1, false, false, 0, "gm/dy; gm per dy; grams per day; gm/24hrs; gm/24 hrs; gm per 24 hrs; 24hrs; grams per 24 hours; serving", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "gram per deciliter", "g/dL", "G/DL", "mass", 1e4, [-3, 0, 1, 0, 0, 0, 0], "g/dL", null, false, "M", null, 1, false, false, 0, "gm/dL; gm per dL; grams per deciliter; decilitre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "gram per gram", "g/g", "G/G", "mass", 1, [0, 0, 0, 0, 0, 0, 0], "g/g", null, false, "M", null, 1, false, false, 0, "gm; grams", "LOINC", "MRto ", "Clinical", "", null, null, null, null, false], [true, "gram per hour", "g/h", "G/HR", "mass", 0.0002777777777777778, [0, -1, 1, 0, 0, 0, 0], "g/h", null, false, "M", null, 1, false, false, 0, "gm/hr; gm per hr; grams; intake; output", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "gram per hour per square meter", "g/h/m2", "(G/HR)/M2", "mass", 0.0002777777777777778, [-2, -1, 1, 0, 0, 0, 0], "(g/h)/(m<sup>2</sup>)", null, false, "M", null, 1, false, false, 0, "gm/hr/m2; gm/h/m2; /m^2; sq. m; g per hr per m2; grams per hours per square meter; meter squared; metre", "LOINC", "ArMRat", "Clinical", "", null, null, null, null, false], [true, "gram per kilogram", "g/kg ", "G/KG", "mass", 0.001, [0, 0, 0, 0, 0, 0, 0], "g/kg", null, false, "M", null, 1, false, false, 0, "g per kg; gram per kilograms", "LOINC", "MCnt", "Clinical", "", null, null, null, null, false], [true, "gram per kilogram per 8 hour ", "g/kg/(8.h)", "(G/KG)/HR", "mass", 0.00000003472222222222222, [0, -1, 0, 0, 0, 0, 0], "(g/kg)/h", null, false, "M", null, 1, false, false, 0, "g/(8.kg.h); gm/kg/8hrs; 8 hrs; g per kg per 8 hrs; 8hrs; grams per kilograms per 8 hours; shift", "LOINC", "MCntRat; RelMRat", "Clinical", "unit often used to describe mass in grams of protein consumed in a 8 hours, divided by the subject's body weight in kilograms. Also used to measure mass dose rate per body mass", null, null, null, null, false], [true, "gram per kilogram per day", "g/kg/d", "(G/KG)/D", "mass", 0.000000011574074074074074, [0, -1, 0, 0, 0, 0, 0], "(g/kg)/d", null, false, "M", null, 1, false, false, 0, "g/(kg.d); gm/kg/dy; gm per kg per dy; grams per kilograms per day", "LOINC", "RelMRat", "Clinical", "unit often used to describe mass in grams of protein consumed in a day, divided by the subject's body weight in kilograms. Also used to measure mass dose rate per body mass", null, null, null, null, false], [true, "gram per kilogram per hour", "g/kg/h", "(G/KG)/HR", "mass", 0.00000027777777777777776, [0, -1, 0, 0, 0, 0, 0], "(g/kg)/h", null, false, "M", null, 1, false, false, 0, "g/(kg.h); g/kg/hr; g per kg per hrs; grams per kilograms per hour", "LOINC", "MCntRat; RelMRat", "Clinical", "unit used to measure mass dose rate per body mass", null, null, null, null, false], [true, "gram per kilogram per minute", "g/kg/min", "(G/KG)/MIN", "mass", 0.000016666666666666667, [0, -1, 0, 0, 0, 0, 0], "(g/kg)/min", null, false, "M", null, 1, false, false, 0, "g/(kg.min); g/kg/min; g per kg per min; grams per kilograms per minute", "LOINC", "MCntRat; RelMRat", "Clinical", "unit used to measure mass dose rate per body mass", null, null, null, null, false], [true, "gram per liter", "g/L", "G/L", "mass", 1000, [-3, 0, 1, 0, 0, 0, 0], "g/L", null, false, "M", null, 1, false, false, 0, "gm per liter; g/liter; grams per liter; litre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "gram per square meter", "g/m2", "G/M2", "mass", 1, [-2, 0, 1, 0, 0, 0, 0], "g/(m<sup>2</sup>)", null, false, "M", null, 1, false, false, 0, "g/m^2; gram/square meter; g/sq m; g per m2; g per m^2; grams per square meter; meters squared; metre", "LOINC", "ArMass", "Clinical", "Tests measure myocardial mass (heart ventricle system) per body surface area; unit used to measure mass dose per body surface area", null, null, null, null, false], [true, "gram per milligram", "g/mg", "G/MG", "mass", 1000, [0, 0, 0, 0, 0, 0, 0], "g/mg", null, false, "M", null, 1, false, false, 0, "g per mg; grams per milligram", "LOINC", "MCnt; MRto", "Clinical", "", null, null, null, null, false], [true, "gram per minute", "g/min", "G/MIN", "mass", 0.016666666666666666, [0, -1, 1, 0, 0, 0, 0], "g/min", null, false, "M", null, 1, false, false, 0, "g per min; grams per minute; gram/minute", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "gram per milliliter", "g/mL", "G/ML", "mass", 1e6, [-3, 0, 1, 0, 0, 0, 0], "g/mL", null, false, "M", null, 1, false, false, 0, "g per mL; grams per milliliter; millilitre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "gram per millimole", "g/mmol", "G/MMOL", "mass", 0.0000000000000000000016605401866749388, [0, 0, 1, 0, 0, 0, 0], "g/mmol", null, false, "M", null, 1, false, false, -1, "grams per millimole; g per mmol", "LOINC", "Ratio", "Clinical", "", null, null, null, null, false], [false, "joule per liter", "J/L", "J/L", "energy", 1e6, [-1, -2, 1, 0, 0, 0, 0], "J/L", "si", true, null, null, 1, false, false, 0, "joules per liter; litre; J per L", "LOINC", "EngCnc", "Clinical", "", "N.m", "N.M", "1", 1, false], [true, "degree Kelvin per Watt", "K/W", "K/W", "temperature", 0.001, [-2, 3, -1, 0, 1, 0, 0], "K/W", null, false, "C", null, 1, false, false, 0, "degree Kelvin/Watt; K per W; thermal ohm; thermal resistance; degrees", "LOINC", "TempEngRat", "Clinical", "unit for absolute thermal resistance equal to the reciprocal of thermal conductance. Unit used for tests to measure work of breathing", null, null, null, null, false], [false, "kilo international unit per liter", "k[IU]/L", "K[IU]/L", "arbitrary", 1e6, [-3, 0, 0, 0, 0, 0, 0], "(ki.U.)/L", "chemical", true, null, null, 1, false, true, 0, "kIU/L; kIU per L; kIU per liter; kilo international units; litre; allergens; allergy units", "LOINC", "ACnc", "Clinical", "IgE has an WHO reference standard so IgE allergen testing can be reported as k[IU]/L", "[iU]", "[IU]", "1", 1, false], [false, "kilo international unit per milliliter", "k[IU]/mL", "K[IU]/ML", "arbitrary", 1e9, [-3, 0, 0, 0, 0, 0, 0], "(ki.U.)/mL", "chemical", true, null, null, 1, false, true, 0, "kIU/mL; kIU per mL; kIU per milliliter; kilo international units; millilitre; allergens; allergy units", "LOINC", "ACnc", "Clinical", "IgE has an WHO reference standard so IgE allergen testing can be reported as k[IU]/mL", "[iU]", "[IU]", "1", 1, false], [false, "katal per kilogram", "kat/kg", "KAT/KG", "catalytic activity", 602213670000000000000, [0, -1, -1, 0, 0, 0, 0], "kat/kg", "chemical", true, null, null, 1, false, false, 1, "kat per kg; katals per kilogram; mol/s/kg; moles per seconds per kilogram", "LOINC", "CCnt", "Clinical", "kat is a unit of catalytic activity with base units = mol/s. Rarely used because its units are too large to practically express catalytic activity. See enzyme unit [U] which is the standard unit for catalytic activity.", "mol/s", "MOL/S", "1", 1, false], [false, "katal per liter", "kat/L", "KAT/L", "catalytic activity", 602213669999999940000000000, [-3, -1, 0, 0, 0, 0, 0], "kat/L", "chemical", true, null, null, 1, false, false, 1, "kat per L; katals per liter; litre; mol/s/L; moles per seconds per liter", "LOINC", "CCnc", "Clinical", "kat is a unit of catalytic activity with base units = mol/s. Rarely used because its units are too large to practically express catalytic activity. See enzyme unit [U] which is the standard unit for catalytic activity.", "mol/s", "MOL/S", "1", 1, false], [false, "kilocalorie", "kcal", "KCAL", "energy", 4184000, [2, -2, 1, 0, 0, 0, 0], "kcal", "heat", true, null, null, 1, false, false, 0, "kilogram calories; large calories; food calories; kcals", "LOINC", "EngRat", "Clinical", "It is equal to 1000 calories (equal to 4.184 kJ). But in practical usage, kcal refers to food calories which excludes caloric content in fiber and other constitutes that is not digestible by humans. Also see nutrition label Calories ([Cal])", "cal_th", "CAL_TH", "1", 1, false], [false, "kilocalorie per 24 hour", "kcal/(24.h)", "KCAL/HR", "energy", 48.425925925925924, [2, -3, 1, 0, 0, 0, 0], "kcal/h", "heat", true, null, null, 1, false, false, 0, "kcal/24hrs; kcal/24 hrs; kcal per 24hrs; kilocalories per 24 hours; kilojoules; kJ/24hr; kJ/(24.h); kJ/dy; kilojoules per days; intake; calories burned; metabolic rate; food calories", "", "EngRat", "Clinical", "", "cal_th", "CAL_TH", "1", 1, false], [false, "kilocalorie per ounce", "kcal/[oz_av]", "KCAL/[OZ_AV]", "energy", 147586.25679704445, [2, -2, 0, 0, 0, 0, 0], "kcal/oz", "heat", true, null, null, 1, false, false, 0, "kcal/oz; kcal per ozs; large calories per ounces; food calories; servings; international", "LOINC", "EngCnt", "Clinical", "used in nutrition to represent calorie of food", "cal_th", "CAL_TH", "1", 1, false], [false, "kilocalorie per day", "kcal/d", "KCAL/D", "energy", 48.425925925925924, [2, -3, 1, 0, 0, 0, 0], "kcal/d", "heat", true, null, null, 1, false, false, 0, "kcal/dy; kcal per day; kilocalories per days; kilojoules; kJ/dy; kilojoules per days; intake; calories burned; metabolic rate; food calories", "LOINC", "EngRat", "Clinical", "unit in nutrition for food intake (measured in calories) in a day", "cal_th", "CAL_TH", "1", 1, false], [false, "kilocalorie per hour", "kcal/h", "KCAL/HR", "energy", 1162.2222222222222, [2, -3, 1, 0, 0, 0, 0], "kcal/h", "heat", true, null, null, 1, false, false, 0, "kcal/hrs; kcals per hr; intake; kilocalories per hours; kilojoules", "LOINC", "EngRat", "Clinical", "used in nutrition to represent caloric requirement or consumption", "cal_th", "CAL_TH", "1", 1, false], [false, "kilocalorie per kilogram per 24 hour", "kcal/kg/(24.h)", "(KCAL/KG)/HR", "energy", 0.04842592592592593, [2, -3, 0, 0, 0, 0, 0], "(kcal/kg)/h", "heat", true, null, null, 1, false, false, 0, "kcal/kg/24hrs; 24 hrs; kcal per kg per 24hrs; kilocalories per kilograms per 24 hours; kilojoules", "LOINC", "EngCntRat", "Clinical", "used in nutrition to represent caloric requirement per day based on subject's body weight in kilograms", "cal_th", "CAL_TH", "1", 1, false], [true, "kilogram", "kg", "KG", "mass", 1000, [0, 0, 1, 0, 0, 0, 0], "kg", null, false, "M", null, 1, false, false, 0, "kilograms; kgs", "LOINC", "Mass", "Clinical", "", null, null, null, null, false], [true, "kilogram meter per second", "kg.m/s", "(KG.M)/S", "mass", 1000, [1, -1, 1, 0, 0, 0, 0], "(kg.m)/s", null, false, "M", null, 1, false, false, 0, "kg*m/s; kg.m per sec; kg*m per sec; p; momentum", "LOINC", "", "Clinical", "unit for momentum =  mass times velocity", null, null, null, null, false], [true, "kilogram per second per square meter", "kg/(s.m2)", "KG/(S.M2)", "mass", 1000, [-2, -1, 1, 0, 0, 0, 0], "kg/(s.(m<sup>2</sup>))", null, false, "M", null, 1, false, false, 0, "kg/(s*m2); kg/(s*m^2); kg per s per m2; per sec; per m^2; kilograms per seconds per square meter; meter squared; metre", "LOINC", "ArMRat", "Clinical", "", null, null, null, null, false], [true, "kilogram per hour", "kg/h", "KG/HR", "mass", 0.2777777777777778, [0, -1, 1, 0, 0, 0, 0], "kg/h", null, false, "M", null, 1, false, false, 0, "kg/hr; kg per hr; kilograms per hour", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "kilogram per liter", "kg/L", "KG/L", "mass", 1e6, [-3, 0, 1, 0, 0, 0, 0], "kg/L", null, false, "M", null, 1, false, false, 0, "kg per liter; litre; kilograms", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "kilogram per square meter", "kg/m2", "KG/M2", "mass", 1000, [-2, 0, 1, 0, 0, 0, 0], "kg/(m<sup>2</sup>)", null, false, "M", null, 1, false, false, 0, "kg/m^2; kg/sq. m; kg per m2; per m^2; per sq. m; kilograms; meter squared; metre; BMI", "LOINC", "Ratio", "Clinical", "units for body mass index (BMI)", null, null, null, null, false], [true, "kilogram per cubic meter", "kg/m3", "KG/M3", "mass", 1000, [-3, 0, 1, 0, 0, 0, 0], "kg/(m<sup>3</sup>)", null, false, "M", null, 1, false, false, 0, "kg/m^3; kg/cu. m; kg per m3; per m^3; per cu. m; kilograms; meters cubed; metre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "kilogram per minute", "kg/min", "KG/MIN", "mass", 16.666666666666668, [0, -1, 1, 0, 0, 0, 0], "kg/min", null, false, "M", null, 1, false, false, 0, "kilogram/minute; kg per min; kilograms per minute", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "kilogram per mole", "kg/mol", "KG/MOL", "mass", 0.0000000000000000000016605401866749388, [0, 0, 1, 0, 0, 0, 0], "kg/mol", null, false, "M", null, 1, false, false, -1, "kilogram/mole; kg per mol; kilograms per mole", "LOINC", "SCnt", "Clinical", "", null, null, null, null, false], [true, "kilogram per second", "kg/s", "KG/S", "mass", 1000, [0, -1, 1, 0, 0, 0, 0], "kg/s", null, false, "M", null, 1, false, false, 0, "kg/sec; kilogram/second; kg per sec; kilograms; second", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [false, "kiloliter", "kL", "KL", "volume", 1, [3, 0, 0, 0, 0, 0, 0], "kL", "iso1000", true, null, null, 1, false, false, 0, "kiloliters; kilolitres; m3; m^3; meters cubed; metre", "LOINC", "Vol", "Clinical", "", "l", null, "1", 1, false], [true, "kilometer", "km", "KM", "length", 1000, [1, 0, 0, 0, 0, 0, 0], "km", null, false, "L", null, 1, false, false, 0, "kilometers; kilometres; distance", "LOINC", "Len", "Clinical", "", null, null, null, null, false], [false, "kilopascal", "kPa", "KPAL", "pressure", 1e6, [-1, -2, 1, 0, 0, 0, 0], "kPa", "si", true, null, null, 1, false, false, 0, "kilopascals; pressure", "LOINC", "Pres; PPresDiff", "Clinical", "", "N/m2", "N/M2", "1", 1, false], [true, "kilosecond", "ks", "KS", "time", 1000, [0, 1, 0, 0, 0, 0, 0], "ks", null, false, "T", null, 1, false, false, 0, "kiloseconds; ksec", "LOINC", "Time", "Clinical", "", null, null, null, null, false], [false, "kilo enzyme unit", "kU", "KU", "catalytic activity", 10036894500000000000, [0, -1, 0, 0, 0, 0, 0], "kU", "chemical", true, null, null, 1, false, false, 1, "units; mmol/min; millimoles per minute", "LOINC", "CAct", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 kU = 1 mmol/min", "umol/min", "UMOL/MIN", "1", 1, false], [false, "kilo enzyme unit per gram", "kU/g", "KU/G", "catalytic activity", 10036894500000000000, [0, -1, -1, 0, 0, 0, 0], "kU/g", "chemical", true, null, null, 1, false, false, 1, "units per grams; kU per gm", "LOINC", "CCnt", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 kU = 1 mmol/min", "umol/min", "UMOL/MIN", "1", 1, false], [false, "kilo enzyme unit per liter", "kU/L", "KU/L", "catalytic activity", 10036894500000000000000, [-3, -1, 0, 0, 0, 0, 0], "kU/L", "chemical", true, null, null, 1, false, false, 1, "units per liter; litre; enzymatic activity; enzyme activity per volume; activities", "LOINC", "ACnc; CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 kU = 1 mmol/min", "umol/min", "UMOL/MIN", "1", 1, false], [false, "kilo enzyme unit per milliliter", "kU/mL", "KU/ML", "catalytic activity", 10036894500000000000000000, [-3, -1, 0, 0, 0, 0, 0], "kU/mL", "chemical", true, null, null, 1, false, false, 1, "kU per mL; units per milliliter; millilitre; enzymatic activity per volume; enzyme activities", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 kU = 1 mmol/min", "umol/min", "UMOL/MIN", "1", 1, false], [false, "Liters per 24 hour", "L/(24.h)", "L/HR", "volume", 0.000000011574074074074074, [3, -1, 0, 0, 0, 0, 0], "L/h", "iso1000", true, null, null, 1, false, false, 0, "L/24hrs; L/24 hrs; L per 24hrs; liters per 24 hours; day; dy; litres; volume flow rate", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "Liters per 8 hour", "L/(8.h)", "L/HR", "volume", 0.00000003472222222222222, [3, -1, 0, 0, 0, 0, 0], "L/h", "iso1000", true, null, null, 1, false, false, 0, "L/8hrs; L/8 hrs; L per 8hrs; liters per 8 hours; litres; volume flow rate; shift", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "Liters per minute per square meter", "L/(min.m2) ", "L/(MIN.M2)", "volume", 0.000016666666666666667, [1, -1, 0, 0, 0, 0, 0], "L/(min.(m<sup>2</sup>))", "iso1000", true, null, null, 1, false, false, 0, "L/(min.m2); L/min/m^2; L/min/sq. meter; L per min per m2; m^2; liters per minutes per square meter; meter squared; litres; metre ", "LOINC", "ArVRat", "Clinical", "unit for tests that measure cardiac output per body surface area (cardiac index)", "l", null, "1", 1, false], [false, "Liters per day", "L/d", "L/D", "volume", 0.000000011574074074074074, [3, -1, 0, 0, 0, 0, 0], "L/d", "iso1000", true, null, null, 1, false, false, 0, "L/dy; L per day; 24hrs; 24 hrs; 24 hours; liters; litres", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "Liters per hour", "L/h", "L/HR", "volume", 0.00000027777777777777776, [3, -1, 0, 0, 0, 0, 0], "L/h", "iso1000", true, null, null, 1, false, false, 0, "L/hr; L per hr; litres", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "Liters per kilogram", "L/kg", "L/KG", "volume", 0.000001, [3, 0, -1, 0, 0, 0, 0], "L/kg", "iso1000", true, null, null, 1, false, false, 0, "L per kg; litre", "LOINC", "VCnt", "Clinical", "", "l", null, "1", 1, false], [false, "Liters per liter", "L/L", "L/L", "volume", 1, [0, 0, 0, 0, 0, 0, 0], "L/L", "iso1000", true, null, null, 1, false, false, 0, "L per L; liter/liter; litre", "LOINC", "VFr", "Clinical", "", "l", null, "1", 1, false], [false, "Liters per minute", "L/min", "L/MIN", "volume", 0.000016666666666666667, [3, -1, 0, 0, 0, 0, 0], "L/min", "iso1000", true, null, null, 1, false, false, 0, "liters per minute; litre", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "Liters per minute per square meter", "L/min/m2", "(L/MIN)/M2", "volume", 0.000016666666666666667, [1, -1, 0, 0, 0, 0, 0], "(L/min)/(m<sup>2</sup>)", "iso1000", true, null, null, 1, false, false, 0, "L/(min.m2); L/min/m^2; L/min/sq. meter; L per min per m2; m^2; liters per minutes per square meter; meter squared; litres; metre ", "", "ArVRat", "Clinical", "unit for tests that measure cardiac output per body surface area (cardiac index)", "l", null, "1", 1, false], [false, "Liters per second", "L/s", "L/S", "volume", 0.001, [3, -1, 0, 0, 0, 0, 0], "L/s", "iso1000", true, null, null, 1, false, false, 0, "L per sec; litres", "LOINC", "VRat", "Clinical", "unit used often to measure gas flow and peak expiratory flow", "l", null, "1", 1, false], [false, "Liters per second per square second", "L/s/s2", "(L/S)/S2", "volume", 0.001, [3, -3, 0, 0, 0, 0, 0], "(L/s)/(s<sup>2</sup>)", "iso1000", true, null, null, 1, false, false, 0, "L/s/s^2; L/sec/sec2; L/sec/sec^2; L/sec/sq. sec; L per s per s2; L per sec per sec2; s^2; sec^2; liters per seconds per square second; second squared; litres ", "LOINC", "ArVRat", "Clinical", "unit for tests that measure cardiac output/body surface area", "l", null, "1", 1, false], [false, "lumen square meter", "lm.m2", "LM.M2", "luminous flux", 1, [2, 0, 0, 2, 0, 0, 1], "lm.(m<sup>2</sup>)", "si", true, null, null, 1, false, false, 0, "lm*m2; lm*m^2; lumen meters squared; lumen sq. meters; metres", "LOINC", "", "Clinical", "", "cd.sr", "CD.SR", "1", 1, false], [true, "meter per second", "m/s", "M/S", "length", 1, [1, -1, 0, 0, 0, 0, 0], "m/s", null, false, "L", null, 1, false, false, 0, "meter/second; m per sec; meters per second; metres; velocity; speed", "LOINC", "Vel", "Clinical", "unit of velocity", null, null, null, null, false], [true, "meter per square second", "m/s2", "M/S2", "length", 1, [1, -2, 0, 0, 0, 0, 0], "m/(s<sup>2</sup>)", null, false, "L", null, 1, false, false, 0, "m/s^2; m/sq. sec; m per s2; per s^2; meters per square second; second squared; sq second; metres; acceleration", "LOINC", "Accel", "Clinical", "unit of acceleration", null, null, null, null, false], [false, "milli international unit per liter", "m[IU]/L", "M[IU]/L", "arbitrary", 1, [-3, 0, 0, 0, 0, 0, 0], "(mi.U.)/L", "chemical", true, null, null, 1, false, true, 0, "mIU/L; m IU/L; mIU per liter; units; litre", "LOINC", "ACnc", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "milli  international unit per milliliter", "m[IU]/mL", "M[IU]/ML", "arbitrary", 1000.0000000000001, [-3, 0, 0, 0, 0, 0, 0], "(mi.U.)/mL", "chemical", true, null, null, 1, false, true, 0, "mIU/mL; m IU/mL; mIU per mL; milli international units per milliliter; millilitre", "LOINC", "ACnc", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [true, "square meter", "m2", "M2", "length", 1, [2, 0, 0, 0, 0, 0, 0], "m<sup>2</sup>", null, false, "L", null, 1, false, false, 0, "m^2; sq m; square meters; meters squared; metres", "LOINC", "Area", "Clinical", "unit often used to represent body surface area", null, null, null, null, false], [true, "square meter per second", "m2/s", "M2/S", "length", 1, [2, -1, 0, 0, 0, 0, 0], "(m<sup>2</sup>)/s", null, false, "L", null, 1, false, false, 0, "m^2/sec; m2 per sec; m^2 per sec; sq m/sec; meters squared/seconds; sq m per sec; meters squared; metres", "LOINC", "ArRat", "Clinical", "", null, null, null, null, false], [true, "cubic meter per second", "m3/s", "M3/S", "length", 1, [3, -1, 0, 0, 0, 0, 0], "(m<sup>3</sup>)/s", null, false, "L", null, 1, false, false, 0, "m^3/sec; m3 per sec; m^3 per sec; cu m/sec; cubic meters per seconds; meters cubed; metres", "LOINC", "VRat", "Clinical", "", null, null, null, null, false], [false, "milliampere", "mA", "MA", "electric current", 0.001, [0, -1, 0, 0, 0, 1, 0], "mA", "si", true, null, null, 1, false, false, 0, "mamp; milliamperes", "LOINC", "ElpotRat", "Clinical", "unit of electric current", "C/s", "C/S", "1", 1, false], [false, "millibar", "mbar", "MBAR", "pressure", 1e5, [-1, -2, 1, 0, 0, 0, 0], "mbar", "iso1000", true, null, null, 1, false, false, 0, "millibars", "LOINC", "Pres", "Clinical", "unit of pressure", "Pa", "PAL", "1e5", 1e5, false], [false, "millibar second per liter", "mbar.s/L", "(MBAR.S)/L", "pressure", 1e8, [-4, -1, 1, 0, 0, 0, 0], "(mbar.s)/L", "iso1000", true, null, null, 1, false, false, 0, "mbar*s/L; mbar.s per L; mbar*s per L; millibar seconds per liter; millibar second per litre", "LOINC", "", "Clinical", "unit to measure expiratory resistance", "Pa", "PAL", "1e5", 1e5, false], [false, "millibar per liter per second", "mbar/L/s", "(MBAR/L)/S", "pressure", 1e8, [-4, -3, 1, 0, 0, 0, 0], "(mbar/L)/s", "iso1000", true, null, null, 1, false, false, 0, "mbar/(L.s); mbar/L/sec; mbar/liter/second; mbar per L per sec; mbar per liter per second; millibars per liters per seconds; litres", "LOINC", "PresCncRat", "Clinical", "unit to measure expiratory resistance", "Pa", "PAL", "1e5", 1e5, false], [false, "milliequivalent", "meq", "MEQ", "amount of substance", 602213670000000000000, [0, 0, 0, 0, 0, 0, 0], "meq", "chemical", true, null, null, 1, false, false, 1, "milliequivalents; meqs", "LOINC", "Sub", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "milliequivalent per 2 hour", "meq/(2.h)", "MEQ/HR", "amount of substance", 83640787500000000, [0, -1, 0, 0, 0, 0, 0], "meq/h", "chemical", true, null, null, 1, false, false, 1, "meq/2hrs; meq/2 hrs; meq per 2 hrs; milliequivalents per 2 hours", "LOINC", "SRat", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "milliequivalent per 24 hour", "meq/(24.h)", "MEQ/HR", "amount of substance", 6970065625000000, [0, -1, 0, 0, 0, 0, 0], "meq/h", "chemical", true, null, null, 1, false, false, 1, "meq/24hrs; meq/24 hrs; meq per 24 hrs; milliequivalents per 24 hours", "LOINC", "SRat", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "milliequivalent per 8 hour", "meq/(8.h)", "MEQ/HR", "amount of substance", 20910196875000000, [0, -1, 0, 0, 0, 0, 0], "meq/h", "chemical", true, null, null, 1, false, false, 1, "meq/8hrs; meq/8 hrs; meq per 8 hrs; milliequivalents per 8 hours; shift", "LOINC", "SRat", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "milliequivalent per day", "meq/d", "MEQ/D", "amount of substance", 6970065625000000, [0, -1, 0, 0, 0, 0, 0], "meq/d", "chemical", true, null, null, 1, false, false, 1, "meq/dy; meq per day; milliquivalents per days; meq/24hrs; meq/24 hrs; meq per 24 hrs; milliequivalents per 24 hours", "LOINC", "SRat", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "milliequivalent per deciliter", "meq/dL", "MEQ/DL", "amount of substance", 6022136699999999000000000, [-3, 0, 0, 0, 0, 0, 0], "meq/dL", "chemical", true, null, null, 1, false, false, 1, "meq per dL; milliequivalents per deciliter; decilitre", "LOINC", "SCnc", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "milliequivalent per gram", "meq/g", "MEQ/G", "amount of substance", 602213670000000000000, [0, 0, -1, 0, 0, 0, 0], "meq/g", "chemical", true, null, null, 1, false, false, 1, "mgq/gm; meq per gm; milliequivalents per gram", "LOINC", "MCnt", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "milliequivalent per hour", "meq/h", "MEQ/HR", "amount of substance", 167281575000000000, [0, -1, 0, 0, 0, 0, 0], "meq/h", "chemical", true, null, null, 1, false, false, 1, "meq/hrs; meq per hrs; milliequivalents per hour", "LOINC", "SRat", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "milliequivalent per kilogram", "meq/kg", "MEQ/KG", "amount of substance", 602213670000000000, [0, 0, -1, 0, 0, 0, 0], "meq/kg", "chemical", true, null, null, 1, false, false, 1, "meq per kg; milliequivalents per kilogram", "LOINC", "SCnt", "Clinical", "equivalence equals moles per valence; used to measure dose per patient body mass", "mol", "MOL", "1", 1, false], [false, "milliequivalent per kilogram per hour", "meq/kg/h", "(MEQ/KG)/HR", "amount of substance", 167281575000000, [0, -1, -1, 0, 0, 0, 0], "(meq/kg)/h", "chemical", true, null, null, 1, false, false, 1, "meq/(kg.h); meq/kg/hr; meq per kg per hr; milliequivalents per kilograms per hour", "LOINC", "SCntRat", "Clinical", "equivalence equals moles per valence; unit used to measure dose rate per patient body mass", "mol", "MOL", "1", 1, false], [false, "milliequivalent per liter", "meq/L", "MEQ/L", "amount of substance", 602213670000000000000000, [-3, 0, 0, 0, 0, 0, 0], "meq/L", "chemical", true, null, null, 1, false, false, 1, "milliequivalents per liter; litre; meq per l; acidity", "LOINC", "SCnc", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "milliequivalent per square meter", "meq/m2", "MEQ/M2", "amount of substance", 602213670000000000000, [-2, 0, 0, 0, 0, 0, 0], "meq/(m<sup>2</sup>)", "chemical", true, null, null, 1, false, false, 1, "meq/m^2; meq/sq. m; milliequivalents per square meter; meter squared; metre", "LOINC", "ArSub", "Clinical", "equivalence equals moles per valence; note that the use of m2 in clinical units ofter refers to body surface area", "mol", "MOL", "1", 1, false], [false, "milliequivalent per minute", "meq/min", "MEQ/MIN", "amount of substance", 10036894500000000000, [0, -1, 0, 0, 0, 0, 0], "meq/min", "chemical", true, null, null, 1, false, false, 1, "meq per min; milliequivalents per minute", "LOINC", "SRat", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [false, "milliequivalent per milliliter", "meq/mL", "MEQ/ML", "amount of substance", 602213670000000000000000000, [-3, 0, 0, 0, 0, 0, 0], "meq/mL", "chemical", true, null, null, 1, false, false, 1, "meq per mL; milliequivalents per milliliter; millilitre", "LOINC", "SCnc", "Clinical", "equivalence equals moles per valence", "mol", "MOL", "1", 1, false], [true, "milligram", "mg", "MG", "mass", 0.001, [0, 0, 1, 0, 0, 0, 0], "mg", null, false, "M", null, 1, false, false, 0, "milligrams", "LOINC", "Mass", "Clinical", "", null, null, null, null, false], [true, "milligram per 10 hour", "mg/(10.h)", "MG/HR", "mass", 0.000000027777777777777777, [0, -1, 1, 0, 0, 0, 0], "mg/h", null, false, "M", null, 1, false, false, 0, "mg/10hrs; mg/10 hrs; mg per 10 hrs; milligrams per 10 hours", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "milligram per 12 hour", "mg/(12.h)", "MG/HR", "mass", 0.000000023148148148148148, [0, -1, 1, 0, 0, 0, 0], "mg/h", null, false, "M", null, 1, false, false, 0, "mg/12hrs; mg/12 hrs; per 12 hrs; 12hrs; milligrams per 12 hours", "LOINC", "MRat", "Clinical", "units used for tests in urine", null, null, null, null, false], [true, "milligram per 2 hour", "mg/(2.h)", "MG/HR", "mass", 0.00000013888888888888888, [0, -1, 1, 0, 0, 0, 0], "mg/h", null, false, "M", null, 1, false, false, 0, "mg/2hrs; mg/2 hrs; mg per 2 hrs; 2hrs; milligrams per 2 hours", "LOINC", "MRat", "Clinical", "units used for tests in urine", null, null, null, null, false], [true, "milligram per 24 hour", "mg/(24.h)", "MG/HR", "mass", 0.000000011574074074074074, [0, -1, 1, 0, 0, 0, 0], "mg/h", null, false, "M", null, 1, false, false, 0, "mg/24hrs; mg/24 hrs; milligrams per 24 hours; mg/kg/dy; mg per kg per day; milligrams per kilograms per days", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "milligram per 6 hour", "mg/(6.h)", "MG/HR", "mass", 0.000000046296296296296295, [0, -1, 1, 0, 0, 0, 0], "mg/h", null, false, "M", null, 1, false, false, 0, "mg/6hrs; mg/6 hrs; mg per 6 hrs; 6hrs; milligrams per 6 hours", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "milligram per 72 hour", "mg/(72.h)", "MG/HR", "mass", 0.000000003858024691358025, [0, -1, 1, 0, 0, 0, 0], "mg/h", null, false, "M", null, 1, false, false, 0, "mg/72hrs; mg/72 hrs; 72 hrs; 72hrs; milligrams per 72 hours", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "milligram per 8 hour", "mg/(8.h)", "MG/HR", "mass", 0.00000003472222222222222, [0, -1, 1, 0, 0, 0, 0], "mg/h", null, false, "M", null, 1, false, false, 0, "mg/8hrs; mg/8 hrs; milligrams per 8 hours; shift", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "milligram per day", "mg/d", "MG/D", "mass", 0.000000011574074074074074, [0, -1, 1, 0, 0, 0, 0], "mg/d", null, false, "M", null, 1, false, false, 0, "mg/24hrs; mg/24 hrs; milligrams per 24 hours; mg/dy; mg per day; milligrams", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "milligram per deciliter", "mg/dL", "MG/DL", "mass", 10, [-3, 0, 1, 0, 0, 0, 0], "mg/dL", null, false, "M", null, 1, false, false, 0, "mg per dL; milligrams per deciliter; decilitre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "milligram per gram", "mg/g", "MG/G", "mass", 0.001, [0, 0, 0, 0, 0, 0, 0], "mg/g", null, false, "M", null, 1, false, false, 0, "mg per gm; milligrams per gram", "LOINC", "MCnt; MRto", "Clinical", "", null, null, null, null, false], [true, "milligram per hour", "mg/h", "MG/HR", "mass", 0.00000027777777777777776, [0, -1, 1, 0, 0, 0, 0], "mg/h", null, false, "M", null, 1, false, false, 0, "mg/hr; mg per hr; milligrams", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "milligram per kilogram", "mg/kg", "MG/KG", "mass", 0.000001, [0, 0, 0, 0, 0, 0, 0], "mg/kg", null, false, "M", null, 1, false, false, 0, "mg per kg; milligrams per kilograms", "LOINC", "MCnt", "Clinical", "", null, null, null, null, false], [true, "milligram per kilogram per 8 hour", "mg/kg/(8.h)", "(MG/KG)/HR", "mass", 0.00000000003472222222222222, [0, -1, 0, 0, 0, 0, 0], "(mg/kg)/h", null, false, "M", null, 1, false, false, 0, "mg/(8.h.kg); mg/kg/8hrs; mg/kg/8 hrs; mg per kg per 8hrs; 8 hrs; milligrams per kilograms per 8 hours; shift", "LOINC", "RelMRat; MCntRat", "Clinical", "unit used to measure mass dose rate per patient body mass", null, null, null, null, false], [true, "milligram per kilogram per day", "mg/kg/d", "(MG/KG)/D", "mass", 0.000000000011574074074074074, [0, -1, 0, 0, 0, 0, 0], "(mg/kg)/d", null, false, "M", null, 1, false, false, 0, "mg/(kg.d); mg/(kg.24.h)mg/kg/dy; mg per kg per day; milligrams per kilograms per days; mg/kg/(24.h); mg/kg/24hrs; 24 hrs; 24 hours", "LOINC", "RelMRat ", "Clinical", "unit used to measure mass dose rate per patient body mass", null, null, null, null, false], [true, "milligram per kilogram per hour", "mg/kg/h", "(MG/KG)/HR", "mass", 0.00000000027777777777777777, [0, -1, 0, 0, 0, 0, 0], "(mg/kg)/h", null, false, "M", null, 1, false, false, 0, "mg/(kg.h); mg/kg/hr; mg per kg per hr; milligrams per kilograms per hour", "LOINC", "RelMRat; MCntRat", "Clinical", "unit used to measure mass dose rate per patient body mass", null, null, null, null, false], [true, "milligram per kilogram per minute", "mg/kg/min", "(MG/KG)/MIN", "mass", 0.000000016666666666666667, [0, -1, 0, 0, 0, 0, 0], "(mg/kg)/min", null, false, "M", null, 1, false, false, 0, "mg/(kg.min); mg per kg per min; milligrams per kilograms per minute", "LOINC", "RelMRat; MCntRat", "Clinical", "unit used to measure mass dose rate per patient body mass", null, null, null, null, false], [true, "milligram per liter", "mg/L", "MG/L", "mass", 1, [-3, 0, 1, 0, 0, 0, 0], "mg/L", null, false, "M", null, 1, false, false, 0, "mg per l; milligrams per liter; litre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "milligram per square meter", "mg/m2", "MG/M2", "mass", 0.001, [-2, 0, 1, 0, 0, 0, 0], "mg/(m<sup>2</sup>)", null, false, "M", null, 1, false, false, 0, "mg/m^2; mg/sq. m; mg per m2; mg per m^2; mg per sq. milligrams; meter squared; metre", "LOINC", "ArMass", "Clinical", "", null, null, null, null, false], [true, "milligram per cubic meter", "mg/m3", "MG/M3", "mass", 0.001, [-3, 0, 1, 0, 0, 0, 0], "mg/(m<sup>3</sup>)", null, false, "M", null, 1, false, false, 0, "mg/m^3; mg/cu. m; mg per m3; milligrams per cubic meter; meter cubed; metre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "milligram per milligram", "mg/mg", "MG/MG", "mass", 1, [0, 0, 0, 0, 0, 0, 0], "mg/mg", null, false, "M", null, 1, false, false, 0, "mg per mg; milligrams; milligram/milligram", "LOINC", "MRto", "Clinical", "", null, null, null, null, false], [true, "milligram per minute", "mg/min", "MG/MIN", "mass", 0.000016666666666666667, [0, -1, 1, 0, 0, 0, 0], "mg/min", null, false, "M", null, 1, false, false, 0, "mg per min; milligrams per minutes; milligram/minute", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "milligram per milliliter", "mg/mL", "MG/ML", "mass", 1000.0000000000001, [-3, 0, 1, 0, 0, 0, 0], "mg/mL", null, false, "M", null, 1, false, false, 0, "mg per mL; milligrams per milliliters; millilitre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "milligram per millimole", "mg/mmol", "MG/MMOL", "mass", 0.000000000000000000000001660540186674939, [0, 0, 1, 0, 0, 0, 0], "mg/mmol", null, false, "M", null, 1, false, false, -1, "mg per mmol; milligrams per millimole; ", "LOINC", "Ratio", "Clinical", "", null, null, null, null, false], [true, "milligram per week", "mg/wk", "MG/WK", "mass", 0.0000000016534391534391535, [0, -1, 1, 0, 0, 0, 0], "mg/wk", null, false, "M", null, 1, false, false, 0, "mg/week; mg per wk; milligrams per weeks; milligram/week", "LOINC", "Mrat", "Clinical", "", null, null, null, null, false], [false, "milliliter", "mL", "ML", "volume", 0.000001, [3, 0, 0, 0, 0, 0, 0], "mL", "iso1000", true, null, null, 1, false, false, 0, "milliliters; millilitres", "LOINC", "Vol", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per 10 hour", "mL/(10.h)", "ML/HR", "volume", 0.000000000027777777777777777, [3, -1, 0, 0, 0, 0, 0], "mL/h", "iso1000", true, null, null, 1, false, false, 0, "ml/10hrs; ml/10 hrs; mL per 10hrs; 10 hrs; milliliters per 10 hours; millilitres", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per 12 hour", "mL/(12.h)", "ML/HR", "volume", 0.000000000023148148148148147, [3, -1, 0, 0, 0, 0, 0], "mL/h", "iso1000", true, null, null, 1, false, false, 0, "ml/12hrs; ml/12 hrs; mL per 12hrs; 12 hrs; milliliters per 12 hours; millilitres", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per 2 hour", "mL/(2.h)", "ML/HR", "volume", 0.00000000013888888888888888, [3, -1, 0, 0, 0, 0, 0], "mL/h", "iso1000", true, null, null, 1, false, false, 0, "ml/2hrs; ml/2 hrs; mL per 2hrs; 2 hrs; milliliters per 2 hours; millilitres ", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per 24 hour", "mL/(24.h)", "ML/HR", "volume", 0.000000000011574074074074074, [3, -1, 0, 0, 0, 0, 0], "mL/h", "iso1000", true, null, null, 1, false, false, 0, "ml/24hrs; ml/24 hrs; mL per 24hrs; 24 hrs; milliliters per 24 hours; millilitres; ml/dy; /day; ml per dy; days; fluid outputs; fluid inputs; flow rate", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per 4 hour", "mL/(4.h)", "ML/HR", "volume", 0.00000000006944444444444444, [3, -1, 0, 0, 0, 0, 0], "mL/h", "iso1000", true, null, null, 1, false, false, 0, "ml/4hrs; ml/4 hrs; mL per 4hrs; 4 hrs; milliliters per 4 hours; millilitres", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per 5 hour", "mL/(5.h)", "ML/HR", "volume", 0.000000000055555555555555553, [3, -1, 0, 0, 0, 0, 0], "mL/h", "iso1000", true, null, null, 1, false, false, 0, "ml/5hrs; ml/5 hrs; mL per 5hrs; 5 hrs; milliliters per 5 hours; millilitres", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per 6 hour", "mL/(6.h)", "ML/HR", "volume", 0.000000000046296296296296294, [3, -1, 0, 0, 0, 0, 0], "mL/h", "iso1000", true, null, null, 1, false, false, 0, "ml/6hrs; ml/6 hrs; mL per 6hrs; 6 hrs; milliliters per 6 hours; millilitres", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per 72 hour", "mL/(72.h)", "ML/HR", "volume", 0.0000000000038580246913580245, [3, -1, 0, 0, 0, 0, 0], "mL/h", "iso1000", true, null, null, 1, false, false, 0, "ml/72hrs; ml/72 hrs; mL per 72hrs; 72 hrs; milliliters per 72 hours; millilitres", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per 8 hour", "mL/(8.h)", "ML/HR", "volume", 0.00000000003472222222222222, [3, -1, 0, 0, 0, 0, 0], "mL/h", "iso1000", true, null, null, 1, false, false, 0, "ml/8hrs; ml/8 hrs; mL per 8hrs; 8 hrs; milliliters per 8 hours; millilitres; shift", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per 8 hour per kilogram", "mL/(8.h)/kg", "(ML/HR)/KG", "volume", 0.00000000000003472222222222222, [3, -1, -1, 0, 0, 0, 0], "(mL/h)/kg", "iso1000", true, null, null, 1, false, false, 0, "mL/kg/(8.h); ml/8h/kg; ml/8 h/kg; ml/8hr/kg; ml/8 hr/kgr; mL per 8h per kg; 8 h; 8hr; 8 hr; milliliters per 8 hours per kilogram; millilitres; shift", "LOINC", "VRatCnt", "Clinical", "unit used to measure renal excretion volume rate per body mass", "l", null, "1", 1, false], [false, "milliliter per square inch (international)", "mL/[sin_i]", "ML/[SIN_I]", "volume", 0.0015500031000061998, [1, 0, 0, 0, 0, 0, 0], "mL", "iso1000", true, null, null, 1, false, false, 0, "mL/sin; mL/in2; mL/in^2; mL per sin; in2; in^2; sq. in; milliliters per square inch; inch squared", "LOINC", "ArVol", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per centimeter of water", "mL/cm[H2O]", "ML/CM[H2O]", "volume", 0.000000000010197162129779282, [4, 2, -1, 0, 0, 0, 0], "mL/(cm\xA0HO<sub><r>2</r></sub>)", "iso1000", true, null, null, 1, false, false, 0, "milliliters per centimeter of water; millilitre per centimetre of water; millilitres per centimetre of water; mL/cmH2O; mL/cm H2O; mL per cmH2O; mL per cm H2O", "LOINC", "Compli", "Clinical", "unit used to measure dynamic lung compliance", "l", null, "1", 1, false], [false, "milliliter per day", "mL/d", "ML/D", "volume", 0.000000000011574074074074074, [3, -1, 0, 0, 0, 0, 0], "mL/d", "iso1000", true, null, null, 1, false, false, 0, "ml/day; ml per day; milliliters per day; 24 hours; 24hrs; millilitre;", "LOINC", "VRat", "Clinical", "usually used to measure fluid output or input; flow rate", "l", null, "1", 1, false], [false, "milliliter per deciliter", "mL/dL", "ML/DL", "volume", 0.009999999999999998, [0, 0, 0, 0, 0, 0, 0], "mL/dL", "iso1000", true, null, null, 1, false, false, 0, "mL per dL; millilitres; decilitre; milliliters", "LOINC", "VFr; VFrDiff", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per hour", "mL/h", "ML/HR", "volume", 0.00000000027777777777777777, [3, -1, 0, 0, 0, 0, 0], "mL/h", "iso1000", true, null, null, 1, false, false, 0, "mL/hr; mL per hr; milliliters per hour; millilitres; fluid intake; fluid output", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per kilogram", "mL/kg", "ML/KG", "volume", 0.0000000009999999999999999, [3, 0, -1, 0, 0, 0, 0], "mL/kg", "iso1000", true, null, null, 1, false, false, 0, "mL per kg; milliliters per kilogram; millilitres", "LOINC", "VCnt", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per kilogram per 8 hour", "mL/kg/(8.h)", "(ML/KG)/HR", "volume", 0.00000000000003472222222222222, [3, -1, -1, 0, 0, 0, 0], "(mL/kg)/h", "iso1000", true, null, null, 1, false, false, 0, "mL/(8.h.kg); mL/kg/8hrs; mL/kg/8 hrs; mL per kg per 8hrs; 8 hrs; milliliters per kilograms per 8 hours; millilitres; shift", "LOINC", "VCntRat; RelEngRat", "Clinical", "unit used to measure renal excretion volume rate per body mass", "l", null, "1", 1, false], [false, "milliliter per kilogram per day", "mL/kg/d", "(ML/KG)/D", "volume", 0.000000000000011574074074074072, [3, -1, -1, 0, 0, 0, 0], "(mL/kg)/d", "iso1000", true, null, null, 1, false, false, 0, "mL/(kg.d); mL/kg/dy; mL per kg per day; milliliters per kilograms per day; mg/kg/24hrs; 24 hrs; per 24 hours millilitres", "LOINC", "VCntRat; RelEngRat", "Clinical", "unit used to measure renal excretion volume rate per body mass", "l", null, "1", 1, false], [false, "milliliter per kilogram per hour", "mL/kg/h", "(ML/KG)/HR", "volume", 0.00000000000027777777777777774, [3, -1, -1, 0, 0, 0, 0], "(mL/kg)/h", "iso1000", true, null, null, 1, false, false, 0, "mL/(kg.h); mL/kg/hr; mL per kg per hr; milliliters per kilograms per hour; millilitres", "LOINC", "VCntRat; RelEngRat", "Clinical", "unit used to measure renal excretion volume rate per body mass", "l", null, "1", 1, false], [false, "milliliter per kilogram per minute", "mL/kg/min", "(ML/KG)/MIN", "volume", 0.000000000016666666666666664, [3, -1, -1, 0, 0, 0, 0], "(mL/kg)/min", "iso1000", true, null, null, 1, false, false, 0, "mL/(kg.min); mL/kg/dy; mL per kg per day; milliliters per kilograms per day; millilitres", "LOINC", "RelEngRat", "Clinical", "used for tests that measure activity metabolic rate compared to standard resting metabolic rate ", "l", null, "1", 1, false], [false, "milliliter per square meter", "mL/m2", "ML/M2", "volume", 0.000001, [1, 0, 0, 0, 0, 0, 0], "mL/(m<sup>2</sup>)", "iso1000", true, null, null, 1, false, false, 0, "mL/m^2; mL/sq. meter; mL per m2; m^2; sq. meter; milliliters per square meter; millilitres; meter squared", "LOINC", "ArVol", "Clinical", "used for tests that relate to heart work - e.g. ventricular stroke volume; atrial volume per body surface area", "l", null, "1", 1, false], [false, "milliliter per millibar", "mL/mbar", "ML/MBAR", "volume", 0.00000000001, [4, 2, -1, 0, 0, 0, 0], "mL/mbar", "iso1000", true, null, null, 1, false, false, 0, "mL per mbar; milliliters per millibar; millilitres", "LOINC", "", "Clinical", "unit used to measure dynamic lung compliance", "l", null, "1", 1, false], [false, "milliliter per minute", "mL/min", "ML/MIN", "volume", 0.000000016666666666666667, [3, -1, 0, 0, 0, 0, 0], "mL/min", "iso1000", true, null, null, 1, false, false, 0, "mL per min; milliliters; millilitres", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per minute per square meter", "mL/min/m2", "(ML/MIN)/M2", "volume", 0.000000016666666666666667, [1, -1, 0, 0, 0, 0, 0], "(mL/min)/(m<sup>2</sup>)", "iso1000", true, null, null, 1, false, false, 0, "ml/min/m^2; ml/min/sq. meter; mL per min per m2; m^2; sq. meter; milliliters per minutes per square meter; millilitres; metre; meter squared", "LOINC", "ArVRat", "Clinical", "unit used to measure volume per body surface area; oxygen consumption index", "l", null, "1", 1, false], [false, "milliliter per millimeter", "mL/mm", "ML/MM", "volume", 0.001, [2, 0, 0, 0, 0, 0, 0], "mL/mm", "iso1000", true, null, null, 1, false, false, 0, "mL per mm; milliliters per millimeter; millilitres; millimetre", "LOINC", "Lineic Volume", "Clinical", "", "l", null, "1", 1, false], [false, "milliliter per second", "mL/s", "ML/S", "volume", 0.000001, [3, -1, 0, 0, 0, 0, 0], "mL/s", "iso1000", true, null, null, 1, false, false, 0, "ml/sec; mL per sec; milliliters per second; millilitres", "LOINC", "Vel; VelRat; VRat", "Clinical", "", "l", null, "1", 1, false], [true, "millimeter", "mm", "MM", "length", 0.001, [1, 0, 0, 0, 0, 0, 0], "mm", null, false, "L", null, 1, false, false, 0, "millimeters; millimetres; height; length; diameter; thickness; axis; curvature; size", "LOINC", "Len", "Clinical", "", null, null, null, null, false], [true, "millimeter per hour", "mm/h", "MM/HR", "length", 0.00000027777777777777776, [1, -1, 0, 0, 0, 0, 0], "mm/h", null, false, "L", null, 1, false, false, 0, "mm/hr; mm per hr; millimeters per hour; millimetres", "LOINC", "Vel", "Clinical", "unit to measure sedimentation rate", null, null, null, null, false], [true, "millimeter per minute", "mm/min", "MM/MIN", "length", 0.000016666666666666667, [1, -1, 0, 0, 0, 0, 0], "mm/min", null, false, "L", null, 1, false, false, 0, "mm per min; millimeters per minute; millimetres", "LOINC", "Vel", "Clinical", "", null, null, null, null, false], [false, "millimeter of water", "mm[H2O]", "MM[H2O]", "pressure", 9806.65, [-1, -2, 1, 0, 0, 0, 0], "mm\xA0HO<sub><r>2</r></sub>", "clinical", true, null, null, 1, false, false, 0, "mmH2O; mm H2O; millimeters of water; millimetres", "LOINC", "Pres", "Clinical", "", "kPa", "KPAL", "980665e-5", 9.80665, false], [false, "millimeter of mercury", "mm[Hg]", "MM[HG]", "pressure", 133322, [-1, -2, 1, 0, 0, 0, 0], "mm\xA0Hg", "clinical", true, null, null, 1, false, false, 0, "mmHg; mm Hg; millimeters of mercury; millimetres", "LOINC", "Pres; PPres; Ratio", "Clinical", "1 mm[Hg] = 1 torr; unit to measure blood pressure", "kPa", "KPAL", "133.3220", 133.322, false], [true, "square millimeter", "mm2", "MM2", "length", 0.000001, [2, 0, 0, 0, 0, 0, 0], "mm<sup>2</sup>", null, false, "L", null, 1, false, false, 0, "mm^2; sq. mm.; sq. millimeters; millimeters squared; millimetres", "LOINC", "Area", "Clinical", "", null, null, null, null, false], [false, "millimole", "mmol", "MMOL", "amount of substance", 602213670000000000000, [0, 0, 0, 0, 0, 0, 0], "mmol", "si", true, null, null, 1, false, false, 1, "millimoles", "LOINC", "Sub", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per 12 hour", "mmol/(12.h)", "MMOL/HR", "amount of substance", 13940131250000000, [0, -1, 0, 0, 0, 0, 0], "mmol/h", "si", true, null, null, 1, false, false, 1, "mmol/12hrs; mmol/12 hrs; mmol per 12 hrs; 12hrs; millimoles per 12 hours", "LOINC", "SRat", "Clinical", "unit for tests related to urine", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per 2 hour", "mmol/(2.h)", "MMOL/HR", "amount of substance", 83640787500000000, [0, -1, 0, 0, 0, 0, 0], "mmol/h", "si", true, null, null, 1, false, false, 1, "mmol/2hrs; mmol/2 hrs; mmol per 2 hrs; 2hrs; millimoles per 2 hours", "LOINC", "SRat", "Clinical", "unit for tests related to urine", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per 24 hour", "mmol/(24.h)", "MMOL/HR", "amount of substance", 6970065625000000, [0, -1, 0, 0, 0, 0, 0], "mmol/h", "si", true, null, null, 1, false, false, 1, "mmol/24hrs; mmol/24 hrs; mmol per 24 hrs; 24hrs; millimoles per 24 hours", "LOINC", "SRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per 5 hour", "mmol/(5.h)", "MMOL/HR", "amount of substance", 33456315000000000, [0, -1, 0, 0, 0, 0, 0], "mmol/h", "si", true, null, null, 1, false, false, 1, "mmol/5hrs; mmol/5 hrs; mmol per 5 hrs; 5hrs; millimoles per 5 hours", "LOINC", "SRat", "Clinical", "unit for tests related to doses", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per 6 hour", "mmol/(6.h)", "MMOL/HR", "amount of substance", 27880262500000000, [0, -1, 0, 0, 0, 0, 0], "mmol/h", "si", true, null, null, 1, false, false, 1, "mmol/6hrs; mmol/6 hrs; mmol per 6 hrs; 6hrs; millimoles per 6 hours", "LOINC", "SRat", "Clinical", "unit for tests related to urine", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per 8 hour", "mmol/(8.h)", "MMOL/HR", "amount of substance", 20910196875000000, [0, -1, 0, 0, 0, 0, 0], "mmol/h", "si", true, null, null, 1, false, false, 1, "mmol/8hrs; mmol/8 hrs; mmol per 8 hrs; 8hrs; millimoles per 8 hours; shift", "LOINC", "SRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per day", "mmol/d", "MMOL/D", "amount of substance", 6970065625000000, [0, -1, 0, 0, 0, 0, 0], "mmol/d", "si", true, null, null, 1, false, false, 1, "mmol/24hrs; mmol/24 hrs; mmol per 24 hrs; 24hrs; millimoles per 24 hours", "LOINC", "SRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per deciliter", "mmol/dL", "MMOL/DL", "amount of substance", 6022136699999999000000000, [-3, 0, 0, 0, 0, 0, 0], "mmol/dL", "si", true, null, null, 1, false, false, 1, "mmol per dL; millimoles; decilitre", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per gram", "mmol/g", "MMOL/G", "amount of substance", 602213670000000000000, [0, 0, -1, 0, 0, 0, 0], "mmol/g", "si", true, null, null, 1, false, false, 1, "mmol per gram; millimoles", "LOINC", "SCnt", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per hour", "mmol/h", "MMOL/HR", "amount of substance", 167281575000000000, [0, -1, 0, 0, 0, 0, 0], "mmol/h", "si", true, null, null, 1, false, false, 1, "mmol/hr; mmol per hr; millimoles per hour", "LOINC", "SRat", "Clinical", "unit for tests related to urine", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per kilogram", "mmol/kg", "MMOL/KG", "amount of substance", 602213670000000000, [0, 0, -1, 0, 0, 0, 0], "mmol/kg", "si", true, null, null, 1, false, false, 1, "mmol per kg; millimoles per kilogram", "LOINC", "SCnt", "Clinical", "unit for tests related to stool", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per kilogram per 8 hour", "mmol/kg/(8.h)", "(MMOL/KG)/HR", "amount of substance", 20910196875000, [0, -1, -1, 0, 0, 0, 0], "(mmol/kg)/h", "si", true, null, null, 1, false, false, 1, "mmol/(8.h.kg); mmol/kg/8hrs; mmol/kg/8 hrs; mmol per kg per 8hrs; 8 hrs; millimoles per kilograms per 8 hours; shift", "LOINC", "CCnt", "Clinical", "unit used to measure molar dose rate per patient body mass", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per kilogram per day", "mmol/kg/d", "(MMOL/KG)/D", "amount of substance", 6970065625000, [0, -1, -1, 0, 0, 0, 0], "(mmol/kg)/d", "si", true, null, null, 1, false, false, 1, "mmol/kg/dy; mmol/kg/day; mmol per kg per dy; millimoles per kilograms per day", "LOINC", "RelSRat", "Clinical", "unit used to measure molar dose rate per patient body mass", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per kilogram per hour", "mmol/kg/h", "(MMOL/KG)/HR", "amount of substance", 167281575000000, [0, -1, -1, 0, 0, 0, 0], "(mmol/kg)/h", "si", true, null, null, 1, false, false, 1, "mmol/kg/hr; mmol per kg per hr; millimoles per kilograms per hour", "LOINC", "CCnt", "Clinical", "unit used to measure molar dose rate per patient body mass", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per kilogram per minute", "mmol/kg/min", "(MMOL/KG)/MIN", "amount of substance", 10036894500000000, [0, -1, -1, 0, 0, 0, 0], "(mmol/kg)/min", "si", true, null, null, 1, false, false, 1, "mmol/(kg.min); mmol/kg/min; mmol per kg per min; millimoles per kilograms per minute", "LOINC", "CCnt", "Clinical", "unit used to measure molar dose rate per patient body mass; note that the unit for the enzyme unit U = umol/min. mmol/kg/min = kU/kg; ", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per liter", "mmol/L", "MMOL/L", "amount of substance", 602213670000000000000000, [-3, 0, 0, 0, 0, 0, 0], "mmol/L", "si", true, null, null, 1, false, false, 1, "mmol per L; millimoles per liter; litre", "LOINC", "SCnc", "Clinical", "unit for tests related to doses", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per square meter", "mmol/m2", "MMOL/M2", "amount of substance", 602213670000000000000, [-2, 0, 0, 0, 0, 0, 0], "mmol/(m<sup>2</sup>)", "si", true, null, null, 1, false, false, 1, "mmol/m^2; mmol/sq. meter; mmol per m2; m^2; sq. meter; millimoles; meter squared; metre", "LOINC", "ArSub", "Clinical", "unit used to measure molar dose per patient body surface area", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per minute", "mmol/min", "MMOL/MIN", "amount of substance", 10036894500000000000, [0, -1, 0, 0, 0, 0, 0], "mmol/min", "si", true, null, null, 1, false, false, 1, "mmol per min; millimoles per minute", "LOINC", "Srat; CAct", "Clinical", "unit for the enzyme unit U = umol/min. mmol/min = kU", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per millimole", "mmol/mmol", "MMOL/MMOL", "amount of substance", 1, [0, 0, 0, 0, 0, 0, 0], "mmol/mmol", "si", true, null, null, 1, false, false, 0, "mmol per mmol; millimoles per millimole", "LOINC", "SRto", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per mole", "mmol/mol", "MMOL/MOL", "amount of substance", 0.001, [0, 0, 0, 0, 0, 0, 0], "mmol/mol", "si", true, null, null, 1, false, false, 0, "mmol per mol; millimoles per mole", "LOINC", "SRto", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "millimole per second per liter", "mmol/s/L", "(MMOL/S)/L", "amount of substance", 602213670000000000000000, [-3, -1, 0, 0, 0, 0, 0], "(mmol/s)/L", "si", true, null, null, 1, false, false, 1, "mmol/sec/L; mmol per s per L; per sec; millimoles per seconds per liter; litre", "LOINC", "CCnc ", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "mole per kilogram", "mol/kg", "MOL/KG", "amount of substance", 602213670000000000000, [0, 0, -1, 0, 0, 0, 0], "mol/kg", "si", true, null, null, 1, false, false, 1, "mol per kg; moles; mols", "LOINC", "SCnt", "Clinical", "unit for tests related to stool", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "mole per kilogram per second", "mol/kg/s", "(MOL/KG)/S", "amount of substance", 602213670000000000000, [0, -1, -1, 0, 0, 0, 0], "(mol/kg)/s", "si", true, null, null, 1, false, false, 1, "mol/kg/sec; mol per kg per sec; moles per kilograms per second; mols", "LOINC", "CCnt", "Clinical", "unit of catalytic activity (mol/s) per mass (kg)", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "mole per liter", "mol/L", "MOL/L", "amount of substance", 602213669999999940000000000, [-3, 0, 0, 0, 0, 0, 0], "mol/L", "si", true, null, null, 1, false, false, 1, "mol per L; moles per liter; litre; moles; mols", "LOINC", "SCnc", "Clinical", "unit often used in tests measuring oxygen content", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "mole per cubic meter", "mol/m3", "MOL/M3", "amount of substance", 602213670000000000000000, [-3, 0, 0, 0, 0, 0, 0], "mol/(m<sup>3</sup>)", "si", true, null, null, 1, false, false, 1, "mol/m^3; mol/cu. m; mol per m3; m^3; cu. meter; mols; moles; meters cubed; metre; mole per kiloliter; kilolitre; mol/kL", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "mole per milliliter", "mol/mL", "MOL/ML", "amount of substance", 602213670000000000000000000000, [-3, 0, 0, 0, 0, 0, 0], "mol/mL", "si", true, null, null, 1, false, false, 1, "mol per mL; moles; millilitre; mols", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "mole per mole", "mol/mol", "MOL/MOL", "amount of substance", 1, [0, 0, 0, 0, 0, 0, 0], "mol/mol", "si", true, null, null, 1, false, false, 0, "mol per mol; moles per mol; mols", "LOINC", "SRto", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "mole per second", "mol/s", "MOL/S", "amount of substance", 602213670000000000000000, [0, -1, 0, 0, 0, 0, 0], "mol/s", "si", true, null, null, 1, false, false, 1, "mol per sec; moles per second; mols", "LOINC", "SRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "milliosmole", "mosm", "MOSM", "amount of substance (dissolved particles)", 602213670000000000000, [0, 0, 0, 0, 0, 0, 0], "mosm", "chemical", true, null, null, 1, false, false, 1, "milliosmoles", "LOINC", "Osmol", "Clinical", "equal to 1/1000 of an osmole", "mol", "MOL", "1", 1, false], [false, "milliosmole per kilogram", "mosm/kg", "MOSM/KG", "amount of substance (dissolved particles)", 602213670000000000, [0, 0, -1, 0, 0, 0, 0], "mosm/kg", "chemical", true, null, null, 1, false, false, 1, "mosm per kg; milliosmoles per kilogram", "LOINC", "Osmol", "Clinical", "", "mol", "MOL", "1", 1, false], [false, "milliosmole per liter", "mosm/L", "MOSM/L", "amount of substance (dissolved particles)", 602213670000000000000000, [-3, 0, 0, 0, 0, 0, 0], "mosm/L", "chemical", true, null, null, 1, false, false, 1, "mosm per liter; litre; milliosmoles", "LOINC", "Osmol", "Clinical", "", "mol", "MOL", "1", 1, false], [false, "millipascal", "mPa", "MPAL", "pressure", 1, [-1, -2, 1, 0, 0, 0, 0], "mPa", "si", true, null, null, 1, false, false, 0, "millipascals", "LOINC", "Pres", "Clinical", "unit of pressure", "N/m2", "N/M2", "1", 1, false], [false, "millipascal second", "mPa.s", "MPAL.S", "pressure", 1, [-1, -1, 1, 0, 0, 0, 0], "mPa.s", "si", true, null, null, 1, false, false, 0, "mPa*s; millipoise; mP; dynamic viscosity", "LOINC", "Visc", "Clinical", "base units for millipoise, a measurement of dynamic viscosity", "N/m2", "N/M2", "1", 1, false], [true, "megasecond", "Ms", "MAS", "time", 1e6, [0, 1, 0, 0, 0, 0, 0], "Ms", null, false, "T", null, 1, false, false, 0, "megaseconds", "LOINC", "Time", "Clinical", "", null, null, null, null, false], [true, "millisecond", "ms", "MS", "time", 0.001, [0, 1, 0, 0, 0, 0, 0], "ms", null, false, "T", null, 1, false, false, 0, "milliseconds; duration", "LOINC", "Time", "Clinical", "", null, null, null, null, false], [false, "milli enzyme unit per gram", "mU/g", "MU/G", "catalytic activity", 10036894500000, [0, -1, -1, 0, 0, 0, 0], "mU/g", "chemical", true, null, null, 1, false, false, 1, "mU per gm; milli enzyme units per gram; enzyme activity; enzymatic activity per mass", "LOINC", "CCnt", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 mU = 1 nmol/min", "umol/min", "UMOL/MIN", "1", 1, false], [false, "milli enzyme unit per liter", "mU/L", "MU/L", "catalytic activity", 10036894500000000, [-3, -1, 0, 0, 0, 0, 0], "mU/L", "chemical", true, null, null, 1, false, false, 1, "mU per liter; litre; milli enzyme units enzymatic activity per volume; enzyme activity", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 mU = 1 nmol/min", "umol/min", "UMOL/MIN", "1", 1, false], [false, "milli enzyme unit per milligram", "mU/mg", "MU/MG", "catalytic activity", 10036894500000000, [0, -1, -1, 0, 0, 0, 0], "mU/mg", "chemical", true, null, null, 1, false, false, 1, "mU per mg; milli enzyme units per milligram", "LOINC", "CCnt", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 mU = 1 nmol/min", "umol/min", "UMOL/MIN", "1", 1, false], [false, "milli enzyme unit per milliliter", "mU/mL", "MU/ML", "catalytic activity", 10036894500000000000, [-3, -1, 0, 0, 0, 0, 0], "mU/mL", "chemical", true, null, null, 1, false, false, 1, "mU per mL; milli enzyme units per milliliter; millilitre; enzymatic activity per volume; enzyme activity", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 mU = 1 nmol/min", "umol/min", "UMOL/MIN", "1", 1, false], [false, "milli enzyme unit per milliliter per minute", "mU/mL/min", "(MU/ML)/MIN", "catalytic activity", 167281575000000000, [-3, -2, 0, 0, 0, 0, 0], "(mU/mL)/min", "chemical", true, null, null, 1, false, false, 1, "mU per mL per min; mU per milliliters per minute; millilitres; milli enzyme units; enzymatic activity; enzyme activity", "LOINC", "CCncRat", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 mU = 1 nmol/min", "umol/min", "UMOL/MIN", "1", 1, false], [false, "millivolt", "mV", "MV", "electric potential", 1, [2, -2, 1, 0, 0, -1, 0], "mV", "si", true, null, null, 1, false, false, 0, "millivolts", "LOINC", "Elpot", "Clinical", "unit of electric potential (voltage)", "J/C", "J/C", "1", 1, false], [false, "Newton centimeter", "N.cm", "N.CM", "force", 10, [2, -2, 1, 0, 0, 0, 0], "N.cm", "si", true, null, null, 1, false, false, 0, "N*cm; Ncm; N cm; Newton*centimeters; Newton* centimetres; torque; work", "LOINC", "", "Clinical", "as a measurement of work, N.cm = 1/100 Joules;\nnote that N.m is the standard unit of measurement for torque (although dimensionally equivalent to Joule), and N.cm can also be thought of as a torqe unit", "kg.m/s2", "KG.M/S2", "1", 1, false], [false, "Newton second", "N.s", "N.S", "force", 1000, [1, -1, 1, 0, 0, 0, 0], "N.s", "si", true, null, null, 1, false, false, 0, "Newton*seconds; N*s; N s; Ns; impulse; imp", "LOINC", "", "Clinical", "standard unit of impulse", "kg.m/s2", "KG.M/S2", "1", 1, false], [true, "nanogram", "ng", "NG", "mass", 0.000000001, [0, 0, 1, 0, 0, 0, 0], "ng", null, false, "M", null, 1, false, false, 0, "nanograms", "LOINC", "Mass", "Clinical", "", null, null, null, null, false], [true, "nanogram per 24 hour", "ng/(24.h)", "NG/HR", "mass", 0.000000000000011574074074074075, [0, -1, 1, 0, 0, 0, 0], "ng/h", null, false, "M", null, 1, false, false, 0, "ng/24hrs; ng/24 hrs; nanograms per 24 hours", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "nanogram per 8 hour", "ng/(8.h)", "NG/HR", "mass", 0.000000000000034722222222222224, [0, -1, 1, 0, 0, 0, 0], "ng/h", null, false, "M", null, 1, false, false, 0, "ng/8hrs; ng/8 hrs; nanograms per 8 hours", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "nanogram per million", "ng/10*6", "NG/(10*6)", "mass", 0.000000000000001, [0, 0, 1, 0, 0, 0, 0], "ng/(10<sup>6</sup>)", null, false, "M", null, 1, false, false, 0, "ng/10^6; ng per 10*6; 10^6; nanograms", "LOINC", "MNum", "Clinical", "", null, null, null, null, false], [true, "nanogram per day", "ng/d", "NG/D", "mass", 0.000000000000011574074074074075, [0, -1, 1, 0, 0, 0, 0], "ng/d", null, false, "M", null, 1, false, false, 0, "ng/dy; ng per day; nanograms ", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "nanogram per deciliter", "ng/dL", "NG/DL", "mass", 0.00001, [-3, 0, 1, 0, 0, 0, 0], "ng/dL", null, false, "M", null, 1, false, false, 0, "ng per dL; nanograms per deciliter; decilitre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "nanogram per gram", "ng/g", "NG/G", "mass", 0.000000001, [0, 0, 0, 0, 0, 0, 0], "ng/g", null, false, "M", null, 1, false, false, 0, "ng/gm; ng per gm; nanograms per gram", "LOINC", "MCnt", "Clinical", "", null, null, null, null, false], [true, "nanogram per hour", "ng/h", "NG/HR", "mass", 0.0000000000002777777777777778, [0, -1, 1, 0, 0, 0, 0], "ng/h", null, false, "M", null, 1, false, false, 0, "ng/hr; ng per hr; nanograms per hour", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "nanogram per kilogram", "ng/kg", "NG/KG", "mass", 0.000000000001, [0, 0, 0, 0, 0, 0, 0], "ng/kg", null, false, "M", null, 1, false, false, 0, "ng per kg; nanograms per kilogram", "LOINC", "MCnt", "Clinical", "", null, null, null, null, false], [true, "nanogram per kilogram per 8 hour", "ng/kg/(8.h)", "(NG/KG)/HR", "mass", 0.00000000000000003472222222222222, [0, -1, 0, 0, 0, 0, 0], "(ng/kg)/h", null, false, "M", null, 1, false, false, 0, "ng/(8.h.kg); ng/kg/8hrs; ng/kg/8 hrs; ng per kg per 8hrs; 8 hrs; nanograms per kilograms per 8 hours; shift", "LOINC", "MRtoRat ", "Clinical", "unit used to measure mass dose rate per patient body mass", null, null, null, null, false], [true, "nanogram per kilogram per hour", "ng/kg/h", "(NG/KG)/HR", "mass", 0.00000000000000027777777777777775, [0, -1, 0, 0, 0, 0, 0], "(ng/kg)/h", null, false, "M", null, 1, false, false, 0, "ng/(kg.h); ng/kg/hr; ng per kg per hr; nanograms per kilograms per hour", "LOINC", "MRtoRat ", "Clinical", "unit used to measure mass dose rate per patient body mass", null, null, null, null, false], [true, "nanogram per kilogram per minute", "ng/kg/min", "(NG/KG)/MIN", "mass", 0.000000000000016666666666666667, [0, -1, 0, 0, 0, 0, 0], "(ng/kg)/min", null, false, "M", null, 1, false, false, 0, "ng/(kg.min); ng per kg per min; nanograms per kilograms per minute", "LOINC", "MRtoRat ", "Clinical", "unit used to measure mass dose rate per patient body mass", null, null, null, null, false], [true, "nanogram per liter", "ng/L", "NG/L", "mass", 0.000001, [-3, 0, 1, 0, 0, 0, 0], "ng/L", null, false, "M", null, 1, false, false, 0, "ng per L; nanograms per liter; litre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "nanogram per square meter", "ng/m2", "NG/M2", "mass", 0.000000001, [-2, 0, 1, 0, 0, 0, 0], "ng/(m<sup>2</sup>)", null, false, "M", null, 1, false, false, 0, "ng/m^2; ng/sq. m; ng per m2; m^2; sq. meter; nanograms; meter squared; metre", "LOINC", "ArMass", "Clinical", "unit used to measure mass dose per patient body surface area", null, null, null, null, false], [true, "nanogram per milligram", "ng/mg", "NG/MG", "mass", 0.000001, [0, 0, 0, 0, 0, 0, 0], "ng/mg", null, false, "M", null, 1, false, false, 0, "ng per mg; nanograms", "LOINC", "MCnt", "Clinical", "", null, null, null, null, false], [true, "nanogram per milligram per hour", "ng/mg/h", "(NG/MG)/HR", "mass", 0.00000000027777777777777777, [0, -1, 0, 0, 0, 0, 0], "(ng/mg)/h", null, false, "M", null, 1, false, false, 0, "ng/mg/hr; ng per mg per hr; nanograms per milligrams per hour", "LOINC", "MRtoRat ", "Clinical", "", null, null, null, null, false], [true, "nanogram per minute", "ng/min", "NG/MIN", "mass", 0.000000000016666666666666667, [0, -1, 1, 0, 0, 0, 0], "ng/min", null, false, "M", null, 1, false, false, 0, "ng per min; nanograms", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "nanogram per millliiter", "ng/mL", "NG/ML", "mass", 0.001, [-3, 0, 1, 0, 0, 0, 0], "ng/mL", null, false, "M", null, 1, false, false, 0, "ng per mL; nanograms; millilitre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "nanogram per milliliter per hour", "ng/mL/h", "(NG/ML)/HR", "mass", 0.00000027777777777777776, [-3, -1, 1, 0, 0, 0, 0], "(ng/mL)/h", null, false, "M", null, 1, false, false, 0, "ng/mL/hr; ng per mL per mL; nanograms per milliliter per hour; nanogram per millilitre per hour; nanograms per millilitre per hour; enzymatic activity per volume; enzyme activity per milliliters", "LOINC", "CCnc", "Clinical", "tests that measure enzymatic activity", null, null, null, null, false], [true, "nanogram per second", "ng/s", "NG/S", "mass", 0.000000001, [0, -1, 1, 0, 0, 0, 0], "ng/s", null, false, "M", null, 1, false, false, 0, "ng/sec; ng per sec; nanograms per second", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "nanogram per enzyme unit", "ng/U", "NG/U", "mass", 0.00000000000000000000000009963241120049634, [0, 1, 1, 0, 0, 0, 0], "ng/U", null, false, "M", null, 1, false, false, -1, "ng per U; nanograms per enzyme unit", "LOINC", "CMass", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", null, null, null, null, false], [false, "nanokatal", "nkat", "NKAT", "catalytic activity", 602213670000000, [0, -1, 0, 0, 0, 0, 0], "nkat", "chemical", true, null, null, 1, false, false, 1, "nanokatals", "LOINC", "CAct", "Clinical", "kat is a unit of catalytic activity with base units = mol/s. Rarely used because its units are too large to practically express catalytic activity. See enzyme unit [U] which is the standard unit for catalytic activity.", "mol/s", "MOL/S", "1", 1, false], [false, "nanoliter", "nL", "NL", "volume", 0.0000000000010000000000000002, [3, 0, 0, 0, 0, 0, 0], "nL", "iso1000", true, null, null, 1, false, false, 0, "nanoliters; nanolitres", "LOINC", "Vol", "Clinical", "", "l", null, "1", 1, false], [true, "nanometer", "nm", "NM", "length", 0.000000001, [1, 0, 0, 0, 0, 0, 0], "nm", null, false, "L", null, 1, false, false, 0, "nanometers; nanometres", "LOINC", "Len", "Clinical", "", null, null, null, null, false], [true, "nanometer per second per liter", "nm/s/L", "(NM/S)/L", "length", 0.000001, [-2, -1, 0, 0, 0, 0, 0], "(nm/s)/L", null, false, "L", null, 1, false, false, 0, "nm/sec/liter; nm/sec/litre; nm per s per l; nm per sec per l; nanometers per second per liter; nanometre per second per litre; nanometres per second per litre", "LOINC", "VelCnc", "Clinical", "", null, null, null, null, false], [false, "nanomole", "nmol", "NMOL", "amount of substance", 602213670000000, [0, 0, 0, 0, 0, 0, 0], "nmol", "si", true, null, null, 1, false, false, 1, "nanomoles", "LOINC", "Sub", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per 24 hour", "nmol/(24.h)", "NMOL/HR", "amount of substance", 6970065625, [0, -1, 0, 0, 0, 0, 0], "nmol/h", "si", true, null, null, 1, false, false, 1, "nmol/24hr; nmol/24 hr; nanomoles per 24 hours; nmol/day; nanomoles per day; nmol per day; nanomole/day; nanomol/day", "LOINC", "SRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per day", "nmol/d", "NMOL/D", "amount of substance", 6970065625, [0, -1, 0, 0, 0, 0, 0], "nmol/d", "si", true, null, null, 1, false, false, 1, "nmol/day; nanomoles per day; nmol per day; nanomole/day; nanomol/day; nmol/24hr; nmol/24 hr; nanomoles per 24 hours; ", "LOINC", "SRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per deciliter", "nmol/dL", "NMOL/DL", "amount of substance", 6022136700000000000, [-3, 0, 0, 0, 0, 0, 0], "nmol/dL", "si", true, null, null, 1, false, false, 1, "nmol per dL; nanomoles per deciliter; nanomole per decilitre; nanomoles per decilitre; nanomole/deciliter; nanomole/decilitre; nanomol/deciliter; nanomol/decilitre", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per gram", "nmol/g", "NMOL/G", "amount of substance", 602213670000000, [0, 0, -1, 0, 0, 0, 0], "nmol/g", "si", true, null, null, 1, false, false, 1, "nmol per gram; nanomoles per gram; nanomole/gram", "LOINC", "SCnt", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per hour per liter", "nmol/h/L", "(NMOL/HR)/L", "amount of substance", 167281575000000, [-3, -1, 0, 0, 0, 0, 0], "(nmol/h)/L", "si", true, null, null, 1, false, false, 1, "nmol/hrs/L; nmol per hrs per L; nanomoles per hours per liter; litre; enzymatic activity per volume; enzyme activities", "LOINC", "CCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per liter", "nmol/L", "NMOL/L", "amount of substance", 602213670000000000, [-3, 0, 0, 0, 0, 0, 0], "nmol/L", "si", true, null, null, 1, false, false, 1, "nmol per L; nanomoles per liter; litre", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per milligram", "nmol/mg", "NMOL/MG", "amount of substance", 602213670000000000, [0, 0, -1, 0, 0, 0, 0], "nmol/mg", "si", true, null, null, 1, false, false, 1, "nmol per mg; nanomoles per milligram", "LOINC", "SCnt", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per milligram per hour", "nmol/mg/h", "(NMOL/MG)/HR", "amount of substance", 167281575000000, [0, -1, -1, 0, 0, 0, 0], "(nmol/mg)/h", "si", true, null, null, 1, false, false, 1, "nmol/mg/hr; nmol per mg per hr; nanomoles per milligrams per hour", "LOINC", "SCntRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per milligram of protein", "nmol/mg{prot}", "NMOL/MG", "amount of substance", 602213670000000000, [0, 0, -1, 0, 0, 0, 0], "nmol/mg", "si", true, null, null, 1, false, false, 1, "nanomoles; nmol/mg prot; nmol per mg prot", "LOINC", "Ratio; CCnt", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per minute", "nmol/min", "NMOL/MIN", "amount of substance", 10036894500000, [0, -1, 0, 0, 0, 0, 0], "nmol/min", "si", true, null, null, 1, false, false, 1, "nmol per min; nanomoles per minute; milli enzyme units; enzyme activity per volume; enzymatic activity", "LOINC", "CCnc", "Clinical", "unit for the enzyme unit U = umol/min. nmol/min = mU (milli enzyme unit)", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per minute per milliliter", "nmol/min/mL", "(NMOL/MIN)/ML", "amount of substance", 10036894500000000000, [-3, -1, 0, 0, 0, 0, 0], "(nmol/min)/mL", "si", true, null, null, 1, false, false, 1, "nmol per min per mL; nanomoles per minutes per milliliter; millilitre; milli enzyme units per volume; enzyme activity; enzymatic activity", "LOINC", "CCnc", "Clinical", "unit for the enzyme unit U = umol/min. nmol/mL/min = mU/mL", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per milliliter", "nmol/mL", "NMOL/ML", "amount of substance", 602213670000000000000, [-3, 0, 0, 0, 0, 0, 0], "nmol/mL", "si", true, null, null, 1, false, false, 1, "nmol per mL; nanomoles per milliliter; millilitre", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per milliliter per hour", "nmol/mL/h", "(NMOL/ML)/HR", "amount of substance", 167281575000000000, [-3, -1, 0, 0, 0, 0, 0], "(nmol/mL)/h", "si", true, null, null, 1, false, false, 1, "nmol/mL/hr; nmol per mL per hr; nanomoles per milliliters per hour; millilitres; milli enzyme units per volume; enzyme activity; enzymatic activity", "LOINC", "CCnc", "Clinical", "unit for the enzyme unit U = umol/min.", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per milliliter per minute", "nmol/mL/min", "(NMOL/ML)/MIN", "amount of substance", 10036894500000000000, [-3, -1, 0, 0, 0, 0, 0], "(nmol/mL)/min", "si", true, null, null, 1, false, false, 1, "nmol per mL per min; nanomoles per milliliters per min; millilitres; milli enzyme units per volume; enzyme activity; enzymatic activity", "LOINC", "CCnc", "Clinical", "unit for the enzyme unit U = umol/min. nmol/mL/min = mU/mL", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per millimole", "nmol/mmol", "NMOL/MMOL", "amount of substance", 0.000001, [0, 0, 0, 0, 0, 0, 0], "nmol/mmol", "si", true, null, null, 1, false, false, 0, "nmol per mmol; nanomoles per millimole", "LOINC", "SRto", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per millimole of creatinine", "nmol/mmol{creat}", "NMOL/MMOL", "amount of substance", 0.000001, [0, 0, 0, 0, 0, 0, 0], "nmol/mmol", "si", true, null, null, 1, false, false, 0, "nanomoles", "LOINC", "SRto", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per mole", "nmol/mol", "NMOL/MOL", "amount of substance", 0.000000001, [0, 0, 0, 0, 0, 0, 0], "nmol/mol", "si", true, null, null, 1, false, false, 0, "nmol per mole; nanomoles", "LOINC", "SRto", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per nanomole", "nmol/nmol", "NMOL/NMOL", "amount of substance", 1, [0, 0, 0, 0, 0, 0, 0], "nmol/nmol", "si", true, null, null, 1, false, false, 0, "nmol per nmol; nanomoles", "LOINC", "SRto", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per second", "nmol/s", "NMOL/S", "amount of substance", 602213670000000, [0, -1, 0, 0, 0, 0, 0], "nmol/s", "si", true, null, null, 1, false, false, 1, "nmol/sec; nmol per sec; nanomoles per sercond; milli enzyme units; enzyme activity; enzymatic activity", "LOINC", "CCnc", "Clinical", "unit for the enzyme unit U = umol/min.", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "nanomole per second per liter", "nmol/s/L", "(NMOL/S)/L", "amount of substance", 602213670000000000, [-3, -1, 0, 0, 0, 0, 0], "(nmol/s)/L", "si", true, null, null, 1, false, false, 1, "nmol/sec/L; nmol per s per L; nmol per sec per L; nanomoles per seconds per liter; litre; milli enzyme units per volume; enzyme activity; enzymatic activity", "LOINC", "CCnc", "Clinical", "unit for the enzyme unit U = umol/min.", "10*23", "10*23", "6.0221367", 6.0221367, false], [true, "nanosecond", "ns", "NS", "time", 0.000000001, [0, 1, 0, 0, 0, 0, 0], "ns", null, false, "T", null, 1, false, false, 0, "nanoseconds", "LOINC", "Time", "Clinical", "", null, null, null, null, false], [false, "nanoenzyme unit per milliliter", "nU/mL", "NU/ML", "catalytic activity", 10036894500000, [-3, -1, 0, 0, 0, 0, 0], "nU/mL", "chemical", true, null, null, 1, false, false, 1, "nU per mL; nanoenzyme units per milliliter; millilitre; enzymatic activity per volume; enzyme activity", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 fU = pmol/min", "umol/min", "UMOL/MIN", "1", 1, false], [false, "Ohm meter", "Ohm.m", "OHM.M", "electric resistance", 1000, [3, -1, 1, 0, 0, -2, 0], "\u03A9.m", "si", true, null, null, 1, false, false, 0, "electric resistivity; meters; metres", "LOINC", "", "Clinical", "unit of electric resistivity", "V/A", "V/A", "1", 1, false], [false, "osmole per kilogram", "osm/kg", "OSM/KG", "amount of substance (dissolved particles)", 602213670000000000000, [0, 0, -1, 0, 0, 0, 0], "osm/kg", "chemical", true, null, null, 1, false, false, 1, "osm per kg; osmoles per kilogram; osmols", "LOINC", "Osmol", "Clinical", "", "mol", "MOL", "1", 1, false], [false, "osmole per liter", "osm/L", "OSM/L", "amount of substance (dissolved particles)", 602213669999999940000000000, [-3, 0, 0, 0, 0, 0, 0], "osm/L", "chemical", true, null, null, 1, false, false, 1, "osm per L; osmoles per liter; litre; osmols", "LOINC", "Osmol", "Clinical", "", "mol", "MOL", "1", 1, false], [false, "picoampere", "pA", "PA", "electric current", 0.000000000001, [0, -1, 0, 0, 0, 1, 0], "pA", "si", true, null, null, 1, false, false, 0, "picoamperes", "LOINC", "", "Clinical", "equal to 10^-12 amperes", "C/s", "C/S", "1", 1, false], [true, "picogram", "pg", "PG", "mass", 0.000000000001, [0, 0, 1, 0, 0, 0, 0], "pg", null, false, "M", null, 1, false, false, 0, "picograms", "LOINC", "Mass; EntMass", "Clinical", "", null, null, null, null, false], [true, "picogram per deciliter", "pg/dL", "PG/DL", "mass", 0.000000009999999999999999, [-3, 0, 1, 0, 0, 0, 0], "pg/dL", null, false, "M", null, 1, false, false, 0, "pg per dL; picograms; decilitre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "picogram per liter", "pg/L", "PG/L", "mass", 0.000000001, [-3, 0, 1, 0, 0, 0, 0], "pg/L", null, false, "M", null, 1, false, false, 0, "pg per L; picograms; litre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "picogram per milligram", "pg/mg", "PG/MG", "mass", 0.000000001, [0, 0, 0, 0, 0, 0, 0], "pg/mg", null, false, "M", null, 1, false, false, 0, "pg per mg; picograms", "LOINC", "MCnt", "Clinical", "", null, null, null, null, false], [true, "picogram per milliliter", "pg/mL", "PG/ML", "mass", 0.000001, [-3, 0, 1, 0, 0, 0, 0], "pg/mL", null, false, "M", null, 1, false, false, 0, "pg per mL; picograms per milliliter; millilitre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "picogram per millimeter", "pg/mm", "PG/MM", "mass", 0.000000001, [-1, 0, 1, 0, 0, 0, 0], "pg/mm", null, false, "M", null, 1, false, false, 0, "pg per mm; picogram/millimeter; picogram/millimetre; picograms per millimeter; millimetre", "LOINC", "Lineic Mass", "Clinical", "", null, null, null, null, false], [false, "picokatal", "pkat", "PKAT", "catalytic activity", 602213670000, [0, -1, 0, 0, 0, 0, 0], "pkat", "chemical", true, null, null, 1, false, false, 1, "pkats; picokatals", "LOINC", "CAct", "Clinical", "kat is a unit of catalytic activity with base units = mol/s. Rarely used because its units are too large to practically express catalytic activity. See enzyme unit [U] which is the standard unit for catalytic activity.", "mol/s", "MOL/S", "1", 1, false], [false, "picoliter", "pL", "PL", "volume", 0.000000000000001, [3, 0, 0, 0, 0, 0, 0], "pL", "iso1000", true, null, null, 1, false, false, 0, "picoliters; picolitres", "LOINC", "Vol", "Clinical", "", "l", null, "1", 1, false], [true, "picometer", "pm", "PM", "length", 0.000000000001, [1, 0, 0, 0, 0, 0, 0], "pm", null, false, "L", null, 1, false, false, 0, "picometers; picometres", "LOINC", "Len", "Clinical", "", null, null, null, null, false], [false, "picomole", "pmol", "PMOL", "amount of substance", 602213670000, [0, 0, 0, 0, 0, 0, 0], "pmol", "si", true, null, null, 1, false, false, 1, "picomoles; pmols", "LOINC", "Sub", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "picomole per 24 hour", "pmol/(24.h)", "PMOL/HR", "amount of substance", 6970065.625, [0, -1, 0, 0, 0, 0, 0], "pmol/h", "si", true, null, null, 1, false, false, 1, "pmol/24hrs; pmol/24 hrs; pmol per 24 hrs; 24hrs; days; dy; picomoles per 24 hours", "LOINC", "SRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "picomole per day", "pmol/d", "PMOL/D", "amount of substance", 6970065.625, [0, -1, 0, 0, 0, 0, 0], "pmol/d", "si", true, null, null, 1, false, false, 1, "pmol/dy; pmol per day; 24 hours; 24hrs; 24 hrs; picomoles", "LOINC", "SRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "picomole per deciliter", "pmol/dL", "PMOL/DL", "amount of substance", 6022136700000000, [-3, 0, 0, 0, 0, 0, 0], "pmol/dL", "si", true, null, null, 1, false, false, 1, "pmol per dL; picomoles per deciliter; decilitre", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "picomole per gram", "pmol/g", "PMOL/G", "amount of substance", 602213670000, [0, 0, -1, 0, 0, 0, 0], "pmol/g", "si", true, null, null, 1, false, false, 1, "pmol per gm; picomoles per gram; picomole/gram", "LOINC", "SCnt", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "picomole per hour per milliliter ", "pmol/h/mL", "(PMOL/HR)/ML", "amount of substance", 167281575000000, [-3, -1, 0, 0, 0, 0, 0], "(pmol/h)/mL", "si", true, null, null, 1, false, false, 1, "pmol/hrs/mL; pmol per hrs per mL; picomoles per hour per milliliter; millilitre; micro enzyme units per volume; enzymatic activity; enzyme activity", "LOINC", "CCnc", "Clinical", "unit for the enzyme unit U = umol/min. ", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "picomole per liter", "pmol/L", "PMOL/L", "amount of substance", 602213670000000, [-3, 0, 0, 0, 0, 0, 0], "pmol/L", "si", true, null, null, 1, false, false, 1, "picomole/liter; pmol per L; picomoles; litre", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "picomole per minute", "pmol/min", "PMOL/MIN", "amount of substance", 10036894500, [0, -1, 0, 0, 0, 0, 0], "pmol/min", "si", true, null, null, 1, false, false, 1, "picomole/minute; pmol per min; picomoles per minute; micro enzyme units; enzymatic activity; enzyme activity", "LOINC", "CCnc", "Clinical", "unit for the enzyme unit U = umol/min. pmol/min = uU (micro enzyme unit)", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "picomole per milliliter", "pmol/mL", "PMOL/ML", "amount of substance", 602213670000000000, [-3, 0, 0, 0, 0, 0, 0], "pmol/mL", "si", true, null, null, 1, false, false, 1, "picomole/milliliter; picomole/millilitre; pmol per mL; picomoles; millilitre; picomols; pmols", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "picomole per micromole", "pmol/umol", "PMOL/UMOL", "amount of substance", 0.000001, [0, 0, 0, 0, 0, 0, 0], "pmol/\u03BCmol", "si", true, null, null, 1, false, false, 0, "pmol/mcgmol; picomole/micromole; pmol per umol; pmol per mcgmol; picomoles ", "LOINC", "SRto", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [true, "picosecond", "ps", "PS", "time", 0.000000000001, [0, 1, 0, 0, 0, 0, 0], "ps", null, false, "T", null, 1, false, false, 0, "picoseconds; psec", "LOINC", "Time", "Clinical", "", null, null, null, null, false], [false, "picotesla", "pT", "PT", "magnetic flux density", 0.000000001, [0, -1, 1, 0, 0, -1, 0], "pT", "si", true, null, null, 1, false, false, 0, "picoteslas", "LOINC", "", "Clinical", "SI unit of magnetic field strength for magnetic field B", "Wb/m2", "WB/M2", "1", 1, false], [false, "enzyme unit per 12 hour", "U/(12.h)", "U/HR", "catalytic activity", 232335520833.33334, [0, -2, 0, 0, 0, 0, 0], "U/h", "chemical", true, null, null, 1, false, false, 1, "U/12hrs; U/ 12hrs; U per 12 hrs; 12hrs; enzyme units per 12 hours; enzyme activity; enzymatic activity per time; umol per min per 12 hours; micromoles per minute per 12 hours; umol/min/12hr", "LOINC", "CRat", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per 2 hour", "U/(2.h)", "U/HR", "catalytic activity", 1394013125000, [0, -2, 0, 0, 0, 0, 0], "U/h", "chemical", true, null, null, 1, false, false, 1, "U/2hrs; U/ 2hrs; U per 2 hrs; 2hrs; enzyme units per 2 hours; enzyme activity; enzymatic activity per time; umol per minute per 2 hours; micromoles per minute; umol/min/2hr; umol per min per 2hr", "LOINC", "CRat", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per 24 hour", "U/(24.h)", "U/HR", "catalytic activity", 116167760416.66667, [0, -2, 0, 0, 0, 0, 0], "U/h", "chemical", true, null, null, 1, false, false, 1, "U/24hrs; U/ 24hrs; U per 24 hrs; 24hrs; enzyme units per 24 hours; enzyme activity; enzymatic activity per time; micromoles per minute per 24 hours; umol/min/24hr; umol per min per 24hr", "LOINC", "CRat", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per 10", "U/10", "U", "catalytic activity", 1003689450000000, [0, -1, 0, 0, 0, 0, 0], "U", "chemical", true, null, null, 1, false, false, 1, "enzyme unit/10; U per 10; enzyme units per 10; enzymatic activity; enzyme activity; micromoles per minute; umol/min/10", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per 10 billion", "U/10*10", "U/(10*10)", "catalytic activity", 1003689.45, [0, -1, 0, 0, 0, 0, 0], "U/(10<sup>10</sup>)", "chemical", true, null, null, 1, false, false, 1, "U per 10*10; enzyme units per 10*10; U per 10 billion; enzyme units; enzymatic activity; micromoles per minute per 10 billion; umol/min/10*10", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per trillion", "U/10*12", "U/(10*12)", "catalytic activity", 10036.8945, [0, -1, 0, 0, 0, 0, 0], "U/(10<sup>12</sup>)", "chemical", true, null, null, 1, false, false, 1, "enzyme unit/10*12; U per 10*12; enzyme units per 10*12; enzyme units per trillion; enzymatic activity; micromoles per minute per trillion; umol/min/10*12; umol per min per 10*12", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per million", "U/10*6", "U/(10*6)", "catalytic activity", 10036894500, [0, -1, 0, 0, 0, 0, 0], "U/(10<sup>6</sup>)", "chemical", true, null, null, 1, false, false, 1, "enzyme unit/10*6; U per 10*6; enzyme units per 10*6; enzyme units; enzymatic activity per volume; micromoles per minute per million; umol/min/10*6; umol per min per 10*6", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per billion", "U/10*9", "U/(10*9)", "catalytic activity", 10036894.5, [0, -1, 0, 0, 0, 0, 0], "U/(10<sup>9</sup>)", "chemical", true, null, null, 1, false, false, 1, "enzyme unit/10*9; U per 10*9; enzyme units per 10*9; enzymatic activity per volume; micromoles per minute per billion; umol/min/10*9; umol per min per 10*9", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per day", "U/d", "U/D", "catalytic activity", 116167760416.66667, [0, -2, 0, 0, 0, 0, 0], "U/d", "chemical", true, null, null, 1, false, false, 1, "U/dy; enzyme units per day; enzyme units; enzyme activity; enzymatic activity per time; micromoles per minute per day; umol/min/day; umol per min per day", "LOINC", "CRat", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per deciliter", "U/dL", "U/DL", "catalytic activity", 100368945000000000000, [-3, -1, 0, 0, 0, 0, 0], "U/dL", "chemical", true, null, null, 1, false, false, 1, "U per dL; enzyme units per deciliter; decilitre; micromoles per minute per deciliter; umol/min/dL; umol per min per dL", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per gram", "U/g", "U/G", "catalytic activity", 10036894500000000, [0, -1, -1, 0, 0, 0, 0], "U/g", "chemical", true, null, null, 1, false, false, 1, "U/gm; U per gm; enzyme units per gram; micromoles per minute per gram; umol/min/g; umol per min per g", "LOINC", "CCnt", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per hour", "U/h", "U/HR", "catalytic activity", 2788026250000, [0, -2, 0, 0, 0, 0, 0], "U/h", "chemical", true, null, null, 1, false, false, 1, "U/hr; U per hr; enzyme units per hour; micromoles per minute per hour; umol/min/hr; umol per min per hr", "LOINC", "CRat", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per liter", "U/L", "U/L", "catalytic activity", 10036894500000000000, [-3, -1, 0, 0, 0, 0, 0], "U/L", "chemical", true, null, null, 1, false, false, 1, "enzyme unit/liter; enzyme unit/litre; U per L; enzyme units per liter; enzyme unit per litre; micromoles per minute per liter; umol/min/L; umol per min per L", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per minute", "U/min", "U/MIN", "catalytic activity", 167281575000000, [0, -2, 0, 0, 0, 0, 0], "U/min", "chemical", true, null, null, 1, false, false, 1, "enzyme unit/minute; U per min; enzyme units; umol/min/min; micromoles per minute per minute; micromoles per min per min; umol", "LOINC", "CRat", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per milliliter", "U/mL", "U/ML", "catalytic activity", 10036894500000000000000, [-3, -1, 0, 0, 0, 0, 0], "U/mL", "chemical", true, null, null, 1, false, false, 1, "U per mL; enzyme units per milliliter; millilitre; micromoles per minute per milliliter; umol/min/mL; umol per min per mL", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "enzyme unit per second", "U/s", "U/S", "catalytic activity", 10036894500000000, [0, -2, 0, 0, 0, 0, 0], "U/s", "chemical", true, null, null, 1, false, false, 1, "U/sec; U per second; enzyme units per second; micromoles per minute per second; umol/min/sec; umol per min per sec", "LOINC", "CRat", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)", "umol/min", "UMOL/MIN", "1", 1, false], [false, "micro international unit", "u[IU]", "U[IU]", "arbitrary", 0.000001, [0, 0, 0, 0, 0, 0, 0], "\u03BCi.U.", "chemical", true, null, null, 1, false, true, 0, "uIU; u IU; microinternational units", "LOINC", "Arb", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "micro international unit per liter", "u[IU]/L", "U[IU]/L", "arbitrary", 0.001, [-3, 0, 0, 0, 0, 0, 0], "(\u03BCi.U.)/L", "chemical", true, null, null, 1, false, true, 0, "uIU/L; u IU/L; uIU per L; microinternational units per liter; litre; ", "LOINC", "ACnc", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "micro international unit per milliliter", "u[IU]/mL", "U[IU]/ML", "arbitrary", 1, [-3, 0, 0, 0, 0, 0, 0], "(\u03BCi.U.)/mL", "chemical", true, null, null, 1, false, true, 0, "uIU/mL; u IU/mL; uIU per mL; microinternational units per milliliter; millilitre", "LOINC", "ACnc", "Clinical", "International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)", "[iU]", "[IU]", "1", 1, false], [false, "microequivalent", "ueq", "UEQ", "amount of substance", 602213670000000000, [0, 0, 0, 0, 0, 0, 0], "\u03BCeq", "chemical", true, null, null, 1, false, false, 1, "microequivalents; 10^-6 equivalents; 10-6 equivalents", "LOINC", "Sub", "Clinical", "", "mol", "MOL", "1", 1, false], [false, "microequivalent per liter", "ueq/L", "UEQ/L", "amount of substance", 602213670000000000000, [-3, 0, 0, 0, 0, 0, 0], "\u03BCeq/L", "chemical", true, null, null, 1, false, false, 1, "ueq per liter; litre; microequivalents", "LOINC", "MCnc", "Clinical", "", "mol", "MOL", "1", 1, false], [false, "microequivalent per milliliter", "ueq/mL", "UEQ/ML", "amount of substance", 602213670000000030000000, [-3, 0, 0, 0, 0, 0, 0], "\u03BCeq/mL", "chemical", true, null, null, 1, false, false, 1, "ueq per milliliter; millilitre; microequivalents", "LOINC", "MCnc", "Clinical", "", "mol", "MOL", "1", 1, false], [true, "microgram", "ug", "UG", "mass", 0.000001, [0, 0, 1, 0, 0, 0, 0], "\u03BCg", null, false, "M", null, 1, false, false, 0, "mcg; micrograms; 10^-6 grams; 10-6 grams", "LOINC", "Mass", "Clinical", "", null, null, null, null, false], [true, "microgram per 100 gram", "ug/(100.g)", "UG/G", "mass", 0.00000001, [0, 0, 0, 0, 0, 0, 0], "\u03BCg/g", null, false, "M", null, 1, false, false, 0, "ug/100gm; ug/100 gm; mcg; ug per 100g; 100 gm; mcg per 100g; micrograms per 100 grams", "LOINC", "MCnt", "Clinical", "", null, null, null, null, false], [true, "microgram per 24 hour", "ug/(24.h)", "UG/HR", "mass", 0.000000000011574074074074074, [0, -1, 1, 0, 0, 0, 0], "\u03BCg/h", null, false, "M", null, 1, false, false, 0, "ug/24hrs; ug/24 hrs; mcg/24hrs; ug per 24hrs; mcg per 24hrs; 24 hrs; micrograms per 24 hours", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "microgram per 8 hour", "ug/(8.h)", "UG/HR", "mass", 0.00000000003472222222222222, [0, -1, 1, 0, 0, 0, 0], "\u03BCg/h", null, false, "M", null, 1, false, false, 0, "ug/8hrs; ug/8 hrs; mcg/8hrs; ug per 8hrs; mcg per 8hrs; 8 hrs; micrograms per 8 hours; shift", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "microgram per square foot (international)", "ug/[sft_i]", "UG/[SFT_I]", "mass", 0.000010763910416709721, [-2, 0, 1, 0, 0, 0, 0], "\u03BCg", null, false, "M", null, 1, false, false, 0, "ug/sft; ug/ft2; ug/ft^2; ug/sq. ft; micrograms; sq. foot; foot squared", "LOINC", "ArMass", "Clinical", "", null, null, null, null, false], [true, "microgram per day", "ug/d", "UG/D", "mass", 0.000000000011574074074074074, [0, -1, 1, 0, 0, 0, 0], "\u03BCg/d", null, false, "M", null, 1, false, false, 0, "ug/dy; mcg/dy; ug per day; mcg; micrograms per day", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "microgram per deciliter", "ug/dL", "UG/DL", "mass", 0.009999999999999998, [-3, 0, 1, 0, 0, 0, 0], "\u03BCg/dL", null, false, "M", null, 1, false, false, 0, "ug per dL; mcg/dl; mcg per dl; micrograms per deciliter; decilitre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "microgram per gram", "ug/g", "UG/G", "mass", 0.000001, [0, 0, 0, 0, 0, 0, 0], "\u03BCg/g", null, false, "M", null, 1, false, false, 0, "ug per gm; mcg/gm; mcg per g; micrograms per gram", "LOINC", "MCnt", "Clinical", "", null, null, null, null, false], [true, "microgram per hour", "ug/h", "UG/HR", "mass", 0.00000000027777777777777777, [0, -1, 1, 0, 0, 0, 0], "\u03BCg/h", null, false, "M", null, 1, false, false, 0, "ug/hr; mcg/hr; mcg per hr; ug per hr; ug per hour; micrograms", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "microgram per kilogram", "ug/kg", "UG/KG", "mass", 0.0000000009999999999999999, [0, 0, 0, 0, 0, 0, 0], "\u03BCg/kg", null, false, "M", null, 1, false, false, 0, "ug per kg; mcg/kg; mcg per kg; micrograms per kilogram", "LOINC", "MCnt", "Clinical", "", null, null, null, null, false], [true, "microgram per kilogram per 8 hour", "ug/kg/(8.h)", "(UG/KG)/HR", "mass", 0.00000000000003472222222222222, [0, -1, 0, 0, 0, 0, 0], "(\u03BCg/kg)/h", null, false, "M", null, 1, false, false, 0, "ug/kg/8hrs; mcg/kg/8hrs; ug/kg/8 hrs; mcg/kg/8 hrs; ug per kg per 8hrs; 8 hrs; mcg per kg per 8hrs; micrograms per kilograms per 8 hours; shift", "LOINC", "", "Clinical", "unit used to measure mass dose rate per patient body mass", null, null, null, null, false], [true, "microgram per kilogram per day", "ug/kg/d", "(UG/KG)/D", "mass", 0.000000000000011574074074074072, [0, -1, 0, 0, 0, 0, 0], "(\u03BCg/kg)/d", null, false, "M", null, 1, false, false, 0, "ug/(kg.d); ug/kg/dy; mcg/kg/day; ug per kg per dy; 24 hours; 24hrs; mcg; kilograms; microgram per kilogram and day", "LOINC", "", "Clinical", "unit used to measure mass dose rate per patient body mass", null, null, null, null, false], [true, "microgram per kilogram per hour", "ug/kg/h", "(UG/KG)/HR", "mass", 0.00000000000027777777777777774, [0, -1, 0, 0, 0, 0, 0], "(\u03BCg/kg)/h", null, false, "M", null, 1, false, false, 0, "ug/(kg.h); ug/kg/hr; mcg/kg/hr; ug per kg per hr; mcg per kg per hr; kilograms", "LOINC", "", "Clinical", "unit used to measure mass dose rate per patient body mass", null, null, null, null, false], [true, "microgram per kilogram per minute", "ug/kg/min", "(UG/KG)/MIN", "mass", 0.000000000016666666666666664, [0, -1, 0, 0, 0, 0, 0], "(\u03BCg/kg)/min", null, false, "M", null, 1, false, false, 0, "ug/kg/min; ug/kg/min; mcg/kg/min; ug per kg per min; mcg; micrograms per kilograms per minute ", "LOINC", "", "Clinical", "unit used to measure mass dose rate per patient body mass", null, null, null, null, false], [true, "microgram per liter", "ug/L", "UG/L", "mass", 0.001, [-3, 0, 1, 0, 0, 0, 0], "\u03BCg/L", null, false, "M", null, 1, false, false, 0, "mcg/L; ug per L; mcg; micrograms per liter; litre ", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "microgram per liter per 24 hour", "ug/L/(24.h)", "(UG/L)/HR", "mass", 0.000000011574074074074074, [-3, -1, 1, 0, 0, 0, 0], "(\u03BCg/L)/h", null, false, "M", null, 1, false, false, 0, "ug/L/24hrs; ug/L/24 hrs; mcg/L/24hrs; ug per L per 24hrs; 24 hrs; day; dy mcg; micrograms per liters per 24 hours; litres", "LOINC", "", "Clinical", "unit used to measure mass dose rate per patient body mass", null, null, null, null, false], [true, "microgram per square meter", "ug/m2", "UG/M2", "mass", 0.000001, [-2, 0, 1, 0, 0, 0, 0], "\u03BCg/(m<sup>2</sup>)", null, false, "M", null, 1, false, false, 0, "ug/m^2; ug/sq. m; mcg/m2; mcg/m^2; mcg/sq. m; ug per m2; m^2; sq. meter; mcg; micrograms per square meter; meter squared; metre", "LOINC", "ArMass", "Clinical", "unit used to measure mass dose per patient body surface area", null, null, null, null, false], [true, "microgram per cubic meter", "ug/m3", "UG/M3", "mass", 0.000001, [-3, 0, 1, 0, 0, 0, 0], "\u03BCg/(m<sup>3</sup>)", null, false, "M", null, 1, false, false, 0, "ug/m^3; ug/cu. m; mcg/m3; mcg/m^3; mcg/cu. m; ug per m3; ug per m^3; ug per cu. m; mcg; micrograms per cubic meter; meter cubed; metre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "microgram per milligram", "ug/mg", "UG/MG", "mass", 0.001, [0, 0, 0, 0, 0, 0, 0], "\u03BCg/mg", null, false, "M", null, 1, false, false, 0, "ug per mg; mcg/mg; mcg per mg; micromilligrams per milligram", "LOINC", "MCnt", "Clinical", "", null, null, null, null, false], [true, "microgram per minute", "ug/min", "UG/MIN", "mass", 0.000000016666666666666667, [0, -1, 1, 0, 0, 0, 0], "\u03BCg/min", null, false, "M", null, 1, false, false, 0, "ug per min; mcg/min; mcg per min; microminutes per minute", "LOINC", "MRat", "Clinical", "", null, null, null, null, false], [true, "microgram per milliliter", "ug/mL", "UG/ML", "mass", 1, [-3, 0, 1, 0, 0, 0, 0], "\u03BCg/mL", null, false, "M", null, 1, false, false, 0, "ug per mL; mcg/mL; mcg per mL; micrograms per milliliter; millilitre", "LOINC", "MCnc", "Clinical", "", null, null, null, null, false], [true, "microgram per millimole", "ug/mmol", "UG/MMOL", "mass", 0.000000000000000000000000001660540186674939, [0, 0, 1, 0, 0, 0, 0], "\u03BCg/mmol", null, false, "M", null, 1, false, false, -1, "ug per mmol; mcg/mmol; mcg per mmol; micrograms per millimole", "LOINC", "Ratio", "Clinical", "", null, null, null, null, false], [true, "microgram per nanogram", "ug/ng", "UG/NG", "mass", 999.9999999999999, [0, 0, 0, 0, 0, 0, 0], "\u03BCg/ng", null, false, "M", null, 1, false, false, 0, "ug per ng; mcg/ng; mcg per ng; micrograms per nanogram", "LOINC", "MCnt", "Clinical", "", null, null, null, null, false], [false, "microkatal", "ukat", "UKAT", "catalytic activity", 602213670000000000, [0, -1, 0, 0, 0, 0, 0], "\u03BCkat", "chemical", true, null, null, 1, false, false, 1, "microkatals; ukats", "LOINC", "CAct", "Clinical", "kat is a unit of catalytic activity with base units = mol/s. Rarely used because its units are too large to practically express catalytic activity. See enzyme unit [U] which is the standard unit for catalytic activity.", "mol/s", "MOL/S", "1", 1, false], [false, "microliter", "uL", "UL", "volume", 0.000000001, [3, 0, 0, 0, 0, 0, 0], "\u03BCL", "iso1000", true, null, null, 1, false, false, 0, "microliters; microlitres; mcl", "LOINC", "Vol", "Clinical", "", "l", null, "1", 1, false], [false, "microliter per 2 hour", "uL/(2.h)", "UL/HR", "volume", 0.0000000000001388888888888889, [3, -1, 0, 0, 0, 0, 0], "\u03BCL/h", "iso1000", true, null, null, 1, false, false, 0, "uL/2hrs; uL/2 hrs; mcg/2hr; mcg per 2hr; uL per 2hr; uL per 2 hrs; microliters per 2 hours; microlitres ", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [false, "microliter per hour", "uL/h", "UL/HR", "volume", 0.0000000000002777777777777778, [3, -1, 0, 0, 0, 0, 0], "\u03BCL/h", "iso1000", true, null, null, 1, false, false, 0, "uL/hr; mcg/hr; mcg per hr; uL per hr; microliters per hour; microlitres", "LOINC", "VRat", "Clinical", "", "l", null, "1", 1, false], [true, "micrometer", "um", "UM", "length", 0.000001, [1, 0, 0, 0, 0, 0, 0], "\u03BCm", null, false, "L", null, 1, false, false, 0, "micrometers; micrometres; \u03BCm; microns", "LOINC", "Len", "Clinical", "Unit of length that is usually used in tests related to the eye", null, null, null, null, false], [true, "microns per second", "um/s", "UM/S", "length", 0.000001, [1, -1, 0, 0, 0, 0, 0], "\u03BCm/s", null, false, "L", null, 1, false, false, 0, "um/sec; micron/second; microns/second; um per sec; micrometers per second; micrometres", "LOINC", "Vel", "Clinical", "", null, null, null, null, false], [false, "micromole", "umol", "UMOL", "amount of substance", 602213670000000000, [0, 0, 0, 0, 0, 0, 0], "\u03BCmol", "si", true, null, null, 1, false, false, 1, "micromoles; umols", "LOINC", "Sub", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per 2 hour", "umol/(2.h)", "UMOL/HR", "amount of substance", 83640787500000, [0, -1, 0, 0, 0, 0, 0], "\u03BCmol/h", "si", true, null, null, 1, false, false, 1, "umol/2hrs; umol/2 hrs; umol per 2 hrs; 2hrs; micromoles per 2 hours", "LOINC", "SRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per 24 hour", "umol/(24.h)", "UMOL/HR", "amount of substance", 6970065625000, [0, -1, 0, 0, 0, 0, 0], "\u03BCmol/h", "si", true, null, null, 1, false, false, 1, "umol/24hrs; umol/24 hrs; umol per 24 hrs; per 24hrs; micromoles per 24 hours", "LOINC", "SRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per 8 hour", "umol/(8.h)", "UMOL/HR", "amount of substance", 20910196875000, [0, -1, 0, 0, 0, 0, 0], "\u03BCmol/h", "si", true, null, null, 1, false, false, 1, "umol/8hr; umol/8 hr; umol per 8 hr; umol per 8hr; umols per 8hr; umol per 8 hours; micromoles per 8 hours; shift", "LOINC", "SRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per day", "umol/d", "UMOL/D", "amount of substance", 6970065625000, [0, -1, 0, 0, 0, 0, 0], "\u03BCmol/d", "si", true, null, null, 1, false, false, 1, "umol/day; umol per day; umols per day; umol per days; micromoles per days; umol/24hr; umol/24 hr; umol per 24 hr; umol per 24hr; umols per 24hr; umol per 24 hours; micromoles per 24 hours", "LOINC", "SRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per deciliter", "umol/dL", "UMOL/DL", "amount of substance", 6022136700000000000000, [-3, 0, 0, 0, 0, 0, 0], "\u03BCmol/dL", "si", true, null, null, 1, false, false, 1, "micromole/deciliter; micromole/decilitre; umol per dL; micromoles per deciliters; micromole per decilitres", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per gram", "umol/g", "UMOL/G", "amount of substance", 602213670000000000, [0, 0, -1, 0, 0, 0, 0], "\u03BCmol/g", "si", true, null, null, 1, false, false, 1, "micromole/gram; umol per g; micromoles per gram", "LOINC", "SCnt; Ratio", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per hour", "umol/h", "UMOL/HR", "amount of substance", 167281575000000, [0, -1, 0, 0, 0, 0, 0], "\u03BCmol/h", "si", true, null, null, 1, false, false, 1, "umol/hr; umol per hr; umol per hour; micromoles per hours", "LOINC", "SRat", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per kilogram", "umol/kg", "UMOL/KG", "amount of substance", 602213670000000, [0, 0, -1, 0, 0, 0, 0], "\u03BCmol/kg", "si", true, null, null, 1, false, false, 1, "umol per kg; micromoles per kilogram", "LOINC", "SCnt", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per liter", "umol/L", "UMOL/L", "amount of substance", 602213670000000000000, [-3, 0, 0, 0, 0, 0, 0], "\u03BCmol/L", "si", true, null, null, 1, false, false, 1, "micromole/liter; micromole/litre; umol per liter; micromoles per liter; litre", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per liter per hour", "umol/L/h", "(UMOL/L)/HR", "amount of substance", 167281575000000000, [-3, -1, 0, 0, 0, 0, 0], "(\u03BCmol/L)/h", "si", true, null, null, 1, false, false, 1, "umol/liter/hr; umol/litre/hr; umol per L per hr; umol per liter per hour; micromoles per liters per hour; litre", "LOINC", "CCnc", "Clinical", "unit for the enzyme unit U = umol/min; umol/L/h is a derived unit of enzyme units", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per milligram", "umol/mg", "UMOL/MG", "amount of substance", 602213670000000000000, [0, 0, -1, 0, 0, 0, 0], "\u03BCmol/mg", "si", true, null, null, 1, false, false, 1, "micromole/milligram; umol per mg; micromoles per milligram", "LOINC", "SCnt", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per minute", "umol/min", "UMOL/MIN", "amount of substance", 10036894500000000, [0, -1, 0, 0, 0, 0, 0], "\u03BCmol/min", "si", true, null, null, 1, false, false, 1, "micromole/minute; umol per min; micromoles per minute; enzyme units", "LOINC", "CAct", "Clinical", "unit for the enzyme unit U = umol/min", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per minute per gram", "umol/min/g", "(UMOL/MIN)/G", "amount of substance", 10036894500000000, [0, -1, -1, 0, 0, 0, 0], "(\u03BCmol/min)/g", "si", true, null, null, 1, false, false, 1, "umol/min/gm; umol per min per gm; micromoles per minutes per gram; U/g; enzyme units", "LOINC", "CCnt", "Clinical", "unit for the enzyme unit U = umol/min. umol/min/g = U/g", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per minute per liter", "umol/min/L", "(UMOL/MIN)/L", "amount of substance", 10036894500000000000, [-3, -1, 0, 0, 0, 0, 0], "(\u03BCmol/min)/L", "si", true, null, null, 1, false, false, 1, "umol/min/liter; umol/minute/liter; micromoles per minutes per liter; litre; enzyme units; U/L", "LOINC", "CCnc", "Clinical", "unit for the enzyme unit U = umol/min. umol/min/L = U/L", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per milliliter", "umol/mL", "UMOL/ML", "amount of substance", 602213670000000030000000, [-3, 0, 0, 0, 0, 0, 0], "\u03BCmol/mL", "si", true, null, null, 1, false, false, 1, "umol per mL; micromoles per milliliter; millilitre", "LOINC", "SCnc", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per milliliter per minute", "umol/mL/min", "(UMOL/ML)/MIN", "amount of substance", 10036894500000000000000, [-3, -1, 0, 0, 0, 0, 0], "(\u03BCmol/mL)/min", "si", true, null, null, 1, false, false, 1, "umol per mL per min; micromoles per milliliters per minute; millilitres", "LOINC", "CCnc", "Clinical", "unit for the enzyme unit U = umol/min. umol/mL/min = U/mL", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per millimole", "umol/mmol", "UMOL/MMOL", "amount of substance", 0.001, [0, 0, 0, 0, 0, 0, 0], "\u03BCmol/mmol", "si", true, null, null, 1, false, false, 0, "umol per mmol; micromoles per millimole", "LOINC", "SRto", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per mole", "umol/mol", "UMOL/MOL", "amount of substance", 0.000001, [0, 0, 0, 0, 0, 0, 0], "\u03BCmol/mol", "si", true, null, null, 1, false, false, 0, "umol per mol; micromoles per mole", "LOINC", "SRto", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "micromole per micromole", "umol/umol", "UMOL/UMOL", "amount of substance", 1, [0, 0, 0, 0, 0, 0, 0], "\u03BCmol/\u03BCmol", "si", true, null, null, 1, false, false, 0, "umol per umol; micromoles per micromole", "LOINC", "Srto; SFr; EntSRto", "Clinical", "", "10*23", "10*23", "6.0221367", 6.0221367, false], [false, "microOhm", "uOhm", "UOHM", "electric resistance", 0.001, [2, -1, 1, 0, 0, -2, 0], "\u03BC\u03A9", "si", true, null, null, 1, false, false, 0, "microOhms; \xB5\u03A9", "LOINC", "", "Clinical", "unit of electric resistance", "V/A", "V/A", "1", 1, false], [true, "microsecond", "us", "US", "time", 0.000001, [0, 1, 0, 0, 0, 0, 0], "\u03BCs", null, false, "T", null, 1, false, false, 0, "microseconds", "LOINC", "Time", "Clinical", "", null, null, null, null, false], [false, "micro enzyme unit per gram", "uU/g", "UU/G", "catalytic activity", 10036894500, [0, -1, -1, 0, 0, 0, 0], "\u03BCU/g", "chemical", true, null, null, 1, false, false, 1, "uU per gm; micro enzyme units per gram; micro enzymatic activity per mass; enzyme activity", "LOINC", "CCnt", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 uU = 1pmol/min", "umol/min", "UMOL/MIN", "1", 1, false], [false, "micro enzyme unit per liter", "uU/L", "UU/L", "catalytic activity", 10036894500000, [-3, -1, 0, 0, 0, 0, 0], "\u03BCU/L", "chemical", true, null, null, 1, false, false, 1, "uU per L; micro enzyme units per liter; litre; enzymatic activity per volume; enzyme activity ", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 uU = 1pmol/min", "umol/min", "UMOL/MIN", "1", 1, false], [false, "micro enzyme unit per milliliter", "uU/mL", "UU/ML", "catalytic activity", 10036894500000000, [-3, -1, 0, 0, 0, 0, 0], "\u03BCU/mL", "chemical", true, null, null, 1, false, false, 1, "uU per mL; micro enzyme units per milliliter; millilitre; enzymatic activity per volume; enzyme activity", "LOINC", "CCnc", "Clinical", "1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 uU = 1pmol/min", "umol/min", "UMOL/MIN", "1", 1, false], [false, "microvolt", "uV", "UV", "electric potential", 0.001, [2, -2, 1, 0, 0, -1, 0], "\u03BCV", "si", true, null, null, 1, false, false, 0, "microvolts", "LOINC", "Elpot", "Clinical", "unit of electric potential (voltage)", "J/C", "J/C", "1", 1, false]] } };
});

// node_modules/@lhncbc/ucum-lhc/source-cjs/ucumJsonDefs.js
var require_ucumJsonDefs = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ucumJsonDefs = exports.UcumJsonDefs = undefined;
  var Pfx = require_prefix();
  var PfxT = require_prefixTables();
  var Un = require_unit();
  var Utab = require_unitTables();
  var unpackArray = require_jsonArrayPack().unpackArray;

  class UcumJsonDefs {
    loadJsonDefs() {
      const jsonDefs = require_ucumDefs_min();
      jsonDefs.prefixes = unpackArray(jsonDefs.prefixes);
      jsonDefs.units = unpackArray(jsonDefs.units);
      if (Utab.UnitTables.getInstance().unitsCount() === 0) {
        let pTab = PfxT.PrefixTables.getInstance();
        let prefixes = jsonDefs["prefixes"];
        let plen = prefixes.length;
        for (let p = 0;p < plen; p++) {
          let newPref = new Pfx.Prefix(prefixes[p]);
          pTab.add(newPref);
        }
        let uTab = Utab.UnitTables.getInstance();
        let units = jsonDefs["units"];
        let ulen = units.length;
        for (let u = 0;u < ulen; u++) {
          let newUnit = new Un.Unit(units[u]);
          uTab.addUnit(newUnit);
        }
      }
    }
  }
  exports.UcumJsonDefs = UcumJsonDefs;
  var ucumJsonDefs = new UcumJsonDefs;
  exports.ucumJsonDefs = ucumJsonDefs;
});

// node_modules/@lhncbc/ucum-lhc/source-cjs/unitString.js
var require_unitString = __commonJS((exports) => {
  var _getRequireWildcardCache = function() {
    if (typeof WeakMap !== "function")
      return null;
    var cache = new WeakMap;
    _getRequireWildcardCache = function() {
      return cache;
    };
    return cache;
  };
  var _interopRequireWildcard = function(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      return { default: obj };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    newObj.default = obj;
    if (cache) {
      cache.set(obj, newObj);
    }
    return newObj;
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UnitString = undefined;
  var intUtils_ = _interopRequireWildcard(require_ucumInternalUtils());
  var Ucum = require_config().Ucum;
  var Unit = require_unit().Unit;
  var UnitTables = require_unitTables().UnitTables;
  var PrefixTables = require_prefixTables().PrefixTables;

  class UnitString {
    constructor() {
      this.utabs_ = UnitTables.getInstance();
      this.pfxTabs_ = PrefixTables.getInstance();
      this.openEmph_ = Ucum.openEmph_;
      this.closeEmph_ = Ucum.closeEmph_;
      this.bracesMsg_ = "";
      this.parensFlag_ = "parens_placeholder";
      this.pFlagLen_ = this.parensFlag_.length;
      this.braceFlag_ = "braces_placeholder";
      this.bFlagLen_ = this.braceFlag_.length;
      this.vcMsgStart_ = null;
      this.vcMsgEnd_ = null;
      this.retMsg_ = [];
      this.parensUnits_ = [];
      this.annotations_ = [];
      this.suggestions = [];
    }
    useHTMLInMessages(use) {
      if (use === undefined || use) {
        this.openEmph_ = Ucum.openEmphHTML_;
        this.closeEmph_ = Ucum.closeEmphHTML_;
      } else {
        this.openEmph_ = Ucum.openEmph_;
        this.closeEmph_ = Ucum.closeEmph_;
      }
    }
    useBraceMsgForEachString(use) {
      if (use === undefined || use)
        this.bracesMsg_ = Ucum.bracesMsg_;
      else
        this.bracesMsg_ = "";
    }
    parseString(uStr, valConv, suggest) {
      uStr = uStr.trim();
      if (uStr === "" || uStr === null) {
        throw new Error("Please specify a unit expression to be validated.");
      }
      if (valConv === "validate") {
        this.vcMsgStart_ = Ucum.valMsgStart_;
        this.vcMsgEnd_ = Ucum.valMsgEnd_;
      } else {
        this.vcMsgStart_ = Ucum.cnvMsgStart_;
        this.vcMsgEnd_ = Ucum.cnvMsgEnd_;
      }
      if (suggest === undefined || suggest === false) {
        this.suggestions_ = null;
      } else {
        this.suggestions_ = [];
      }
      this.retMsg_ = [];
      this.parensUnits_ = [];
      this.annotations_ = [];
      let origString = uStr;
      let retObj = [];
      uStr = this._getAnnotations(uStr);
      if (this.retMsg_.length > 0) {
        retObj[0] = null;
        retObj[1] = null;
      } else {
        let endProcessing = this.retMsg_.length > 0;
        let sUnit = null;
        for (sUnit in Ucum.specUnits_) {
          while (uStr.indexOf(sUnit) !== -1)
            uStr = uStr.replace(sUnit, Ucum.specUnits_[sUnit]);
        }
        if (uStr.indexOf(" ") > -1) {
          throw new Error("Blank spaces are not allowed in unit expressions.");
        }
        retObj = this._parseTheString(uStr, origString);
        let finalUnit = retObj[0];
        if (intUtils_.isIntegerUnit(finalUnit) || typeof finalUnit === "number") {
          finalUnit = new Unit({
            csCode_: origString,
            magnitude_: finalUnit,
            name_: origString
          });
          retObj[0] = finalUnit;
        }
      }
      retObj[2] = this.retMsg_;
      if (this.suggestions_ && this.suggestions_.length > 0)
        retObj[3] = this.suggestions_;
      return retObj;
    }
    _parseTheString(uStr, origString) {
      let finalUnit = null;
      let endProcessing = this.retMsg_.length > 0;
      let parensResp = this._processParens(uStr, origString);
      endProcessing = parensResp[2];
      let uArray = [];
      if (!endProcessing) {
        uStr = parensResp[0];
        origString = parensResp[1];
        let mkUArray = this._makeUnitsArray(uStr, origString);
        endProcessing = mkUArray[2];
        if (!endProcessing) {
          uArray = mkUArray[0];
          origString = mkUArray[1];
          let uLen = uArray.length;
          for (let u1 = 0;u1 < uLen; u1++) {
            let curCode = uArray[u1]["un"];
            if (intUtils_.isIntegerUnit(curCode)) {
              uArray[u1]["un"] = Number(curCode);
            } else {
              if (curCode.indexOf(this.parensFlag_) >= 0) {
                let parenUnit = this._getParensUnit(curCode, origString);
                if (!endProcessing)
                  endProcessing = parenUnit[1];
                if (!endProcessing) {
                  uArray[u1]["un"] = parenUnit[0];
                }
              } else {
                let uRet = this._makeUnit(curCode, origString);
                if (uRet[0] === null) {
                  endProcessing = true;
                } else {
                  uArray[u1]["un"] = uRet[0];
                  origString = uRet[1];
                }
              }
            }
          }
        }
      }
      if (!endProcessing) {
        if ((uArray[0] === null || uArray[0] === " " || uArray[0]["un"] === undefined || uArray[0]["un"] === null) && this.retMsg_.length === 0) {
          this.retMsg_.push(`Unit string (${origString}) did not contain ` + `anything that could be used to create a unit, or else something that is not handled yet by this package.  Sorry`);
          endProcessing = true;
        }
      }
      if (!endProcessing) {
        finalUnit = this._performUnitArithmetic(uArray, origString);
      }
      return [finalUnit, origString];
    }
    _getAnnotations(uString) {
      let openBrace = uString.indexOf("{");
      while (openBrace >= 0) {
        let closeBrace2 = uString.indexOf("}");
        if (closeBrace2 < 0) {
          this.retMsg_.push("Missing closing brace for annotation starting at " + this.openEmph_ + uString.substr(openBrace) + this.closeEmph_);
          openBrace = -1;
        } else {
          let braceStr = uString.substring(openBrace, closeBrace2 + 1);
          let aIdx = this.annotations_.length.toString();
          uString = uString.replace(braceStr, this.braceFlag_ + aIdx + this.braceFlag_);
          this.annotations_.push(braceStr);
          openBrace = uString.indexOf("{");
        }
      }
      let closeBrace = uString.indexOf("}");
      if (closeBrace >= 0)
        this.retMsg_.push("Missing opening brace for closing brace found at " + this.openEmph_ + uString.substring(0, closeBrace + 1) + this.closeEmph_);
      return uString;
    }
    _processParens(uString, origString) {
      let uStrArray = [];
      let uStrAryPos = 0;
      let stopProcessing = false;
      let pu = this.parensUnits_.length;
      let trimmedCt = 0;
      while (uString !== "" && !stopProcessing) {
        let openCt = 0;
        let closeCt = 0;
        let openPos = uString.indexOf("(");
        if (openPos < 0) {
          let closePos = uString.indexOf(")");
          if (closePos >= 0) {
            let theMsg = `Missing open parenthesis for close ` + `parenthesis at ${uString.substring(0, closePos + trimmedCt)}` + `${this.openEmph_}${uString.substr(closePos, 1)}${this.closeEmph_}`;
            if (closePos < uString.length - 1) {
              theMsg += `${uString.substr(closePos + 1)}`;
            }
            this.retMsg_.push(theMsg);
            uStrArray[uStrAryPos] = uString;
            stopProcessing = true;
          } else {
            uStrArray[uStrAryPos] = uString;
            uString = "";
          }
        } else {
          openCt += 1;
          let uLen = uString.length;
          if (openPos > 0) {
            uStrArray[uStrAryPos++] = uString.substr(0, openPos);
          }
          let closePos = 0;
          let c = openPos + 1;
          for (;c < uLen && openCt != closeCt; c++) {
            if (uString[c] === "(")
              openCt += 1;
            else if (uString[c] === ")")
              closeCt += 1;
          }
          if (openCt === closeCt) {
            closePos = c;
            uStrArray[uStrAryPos++] = this.parensFlag_ + pu.toString() + this.parensFlag_;
            let parseResp = this._parseTheString(uString.substring(openPos + 1, closePos - 1), origString);
            if (parseResp[0] === null)
              stopProcessing = true;
            else {
              origString = parseResp[1];
              this.parensUnits_[pu++] = parseResp[0];
              uString = uString.substr(closePos);
              trimmedCt = closePos;
            }
          } else {
            uStrArray.push(origString.substr(openPos));
            this.retMsg_.push(`Missing close parenthesis for open parenthesis at ` + `${origString.substring(0, openPos + trimmedCt)}` + `${this.openEmph_}${origString.substr(openPos, 1)}` + `${this.closeEmph_}${origString.substr(openPos + 1)}`);
            stopProcessing = true;
          }
        }
      }
      if (stopProcessing)
        this.parensUnits_ = [];
      return [uStrArray.join(""), origString, stopProcessing];
    }
    _makeUnitsArray(uStr, origString) {
      let uArray1 = uStr.match(/([./]|[^./]+)/g);
      let endProcessing = false;
      let uArray = [];
      let startNumCheck = /(^[0-9]+)(\[?[a-zA-Z\_0-9a-zA-Z\_]+\]?$)/;
      if (uArray1[0] === "/") {
        uArray1.unshift("1");
      } else if (uArray1[0] === ".") {
        this.retMsg_.push(`${origString} is not a valid UCUM code. ` + `The multiplication operator at the beginning of the expression is not valid. A multiplication operator must appear only between two codes.`);
        endProcessing = true;
      }
      if (!endProcessing) {
        if (!intUtils_.isNumericString(uArray1[0])) {
          let numRes = uArray1[0].match(startNumCheck);
          if (numRes && numRes.length === 3 && numRes[1] !== "" && numRes[2] !== "" && numRes[2].indexOf(this.braceFlag_) !== 0) {
            let dispVal = numRes[2];
            if (!endProcessing && numRes[2].indexOf(this.parensFlag_) !== -1) {
              let parensback = this._getParensUnit(numRes[2], origString);
              numRes[2] = parensback[0]["csCode_"];
              dispVal = `(${numRes[2]})`;
              endProcessing = parensback[1];
            }
            if (!endProcessing) {
              this.retMsg_.push(`${numRes[1]}${dispVal} is not a valid UCUM code.` + `  ${this.vcMsgStart_}${numRes[1]}.${dispVal}${this.vcMsgEnd_}`);
              origString = origString.replace(`${numRes[1]}${dispVal}`, `${numRes[1]}.${dispVal}`);
              uArray1[0] = numRes[2];
              uArray1.unshift(numRes[1], ".");
            }
          }
        }
        if (!endProcessing) {
          let u1 = uArray1.length;
          uArray = [{
            op: "",
            un: uArray1[0]
          }];
          for (let n = 1;n < u1; n++) {
            let theOp = uArray1[n++];
            if (!uArray1[n]) {
              this.retMsg_.push(`${origString} is not a valid UCUM code. ` + `It is terminated with the operator ${this.openEmph_}` + `${theOp}${this.closeEmph_}.`);
              n = u1;
              endProcessing = true;
            } else if (Ucum.validOps_.indexOf(uArray1[n]) !== -1) {
              this.retMsg_.push(`${origString} is not a valid UCUM code. ` + `A unit code is missing between${this.openEmph_}` + `${theOp}${this.closeEmph_}and${this.openEmph_}` + `${uArray1[n]}${this.closeEmph_}in${this.openEmph_}` + `${theOp}${uArray1[n]}${this.closeEmph_}.`);
              n = u1;
              endProcessing = true;
            } else {
              if (!intUtils_.isNumericString(uArray1[n])) {
                let numRes2 = uArray1[n].match(startNumCheck);
                if (numRes2 && numRes2.length === 3 && numRes2[1] !== "" && numRes2[2] !== "" && numRes2[2].indexOf(this.braceFlag_) !== 0) {
                  let invalidString = numRes2[0];
                  if (!endProcessing && numRes2[2].indexOf(this.parensFlag_) !== -1) {
                    let parensback = this._getParensUnit(numRes2[2], origString);
                    numRes2[2] = parensback[0]["csCode_"];
                    invalidString = `(${numRes2[2]})`;
                    endProcessing = parensback[1];
                    if (!endProcessing) {
                      this.retMsg_.push(`${numRes2[1]}${invalidString} is not a ` + `valid UCUM code.  ${this.vcMsgStart_}${numRes2[1]}.${invalidString}` + `${this.vcMsgEnd_}`);
                      let parensString = `(${numRes2[1]}.${invalidString})`;
                      origString = origString.replace(`${numRes2[1]}${invalidString}`, parensString);
                      let nextParens = this._processParens(parensString, origString);
                      endProcessing = nextParens[2];
                      if (!endProcessing) {
                        uArray.push({
                          op: theOp,
                          un: nextParens[0]
                        });
                      }
                    }
                  } else {
                    let parensStr = "(" + numRes2[1] + "." + numRes2[2] + ")";
                    let parensResp = this._processParens(parensStr, origString);
                    if (parensResp[2]) {
                      n = u1;
                      endProcessing = true;
                    } else {
                      this.retMsg_.push(`${numRes2[0]} is not a ` + `valid UCUM code.  ${this.vcMsgStart_}${numRes2[1]}.${numRes2[2]}` + `${this.vcMsgEnd_}`);
                      origString = origString.replace(numRes2[0], parensStr);
                      uArray.push({
                        op: theOp,
                        un: parensResp[0]
                      });
                    }
                  }
                } else {
                  uArray.push({
                    op: theOp,
                    un: uArray1[n]
                  });
                }
              } else {
                uArray.push({
                  op: theOp,
                  un: uArray1[n]
                });
              }
            }
          }
        }
      }
      return [uArray, origString, endProcessing];
    }
    _getParensUnit(pStr, origString) {
      let endProcessing = false;
      let retAry = [];
      let retUnit = null;
      let befAnnoText = null;
      let aftAnnoText = null;
      let psIdx = pStr.indexOf(this.parensFlag_);
      let befText = null;
      if (psIdx > 0) {
        befText = pStr.substr(0, psIdx - 1);
      }
      let peIdx = pStr.lastIndexOf(this.parensFlag_);
      let aftText = null;
      if (peIdx + this.pFlagLen_ < pStr.length) {
        aftText = pStr.substr(peIdx + this.pFlagLen_);
      }
      let pNumText = pStr.substring(psIdx + this.pFlagLen_, peIdx);
      if (intUtils_.isNumericString(pNumText)) {
        retUnit = this.parensUnits_[Number(pNumText)];
        if (!intUtils_.isIntegerUnit(retUnit)) {
          pStr = retUnit.csCode_;
        } else {
          pStr = retUnit;
        }
      } else {
        throw new Error(`Processing error - invalid parens number ${pNumText} ` + `found in ${pStr}.`);
      }
      if (befText) {
        if (intUtils_.isNumericString(befText)) {
          let nMag = retUnit.getProperty("magnitude_");
          nMag *= Number(befText);
          retUnit.assignVals({
            magnitude_: nMag
          });
          pStr = `${befText}.${pStr}`;
          this.retMsg_.push(`${befText}${pStr} is not a valid UCUM code.\n` + this.vcMsgStart_ + pStr + this.vcMsgEnd_);
        } else {
          if (befText.indexOf(this.braceFlag_) >= 0) {
            let annoRet = this._getAnnoText(befText, origString);
            if (annoRet[1] || annoRet[2]) {
              throw new Error(`Text found before the parentheses (` + `${befText}) included an annotation along with other text ` + `for parenthetical unit ${retUnit.csCode_}`);
            }
            pStr += annoRet[0];
            this.retMsg_.push(`The annotation ${annoRet[0]} before the unit ` + `code is invalid.\n` + this.vcMsgStart_ + pStr + this.vcMsgEnd_);
          } else if (!this.suggestions_) {
            this.retMsg_.push(`${befText} preceding the unit code ${pStr} ` + `is invalid.  Unable to make a substitution.`);
            endProcessing = true;
          } else {
            let suggestStat = this._getSuggestions(befText);
            endProcessing = suggestStat !== "succeeded";
          }
        }
      }
      if (aftText) {
        if (aftText.indexOf(this.braceFlag_) >= 0) {
          let annoRet = this._getAnnoText(aftText, origString);
          if (annoRet[1] || annoRet[2]) {
            throw new Error(`Text found after the parentheses (` + `${aftText}) included an annotation along with other text ` + `for parenthetical unit ${retUnit.csCode_}`);
          }
          pStr += annoRet[0];
        } else {
          if (intUtils_.isNumericString(aftText)) {
            pStr += aftText;
            retUnit = retUnit.power(Number(aftText));
            this.retMsg_.push(`An exponent (${aftText}) following a parenthesis ` + `is invalid as of revision 1.9 of the UCUM Specification.\n  ` + this.vcMsgStart_ + pStr + this.vcMsgEnd_);
          } else if (!this.suggestions_) {
            this.retMsg_.push(`Text ${aftText} following the unit code ${pStr} ` + `is invalid.  Unable to make a substitution.`);
            endProcessing = true;
          } else {
            let suggestStat = this._getSuggestions(befText);
            endProcessing = suggestStat !== "succeeded";
          }
        }
      }
      if (!endProcessing) {
        if (!retUnit) {
          retUnit = new Unit({
            csCode_: pStr,
            magnitude_: 1,
            name_: pStr
          });
        } else if (intUtils_.isIntegerUnit(retUnit)) {
          retUnit = new Unit({
            csCode_: retUnit,
            magnitude_: retUnit,
            name_: retUnit
          });
        } else {
          retUnit.csCode_ = pStr;
        }
      }
      return [retUnit, endProcessing];
    }
    _getAnnoText(pStr, origString) {
      let asIdx = pStr.indexOf(this.braceFlag_);
      let startText = asIdx > 0 ? pStr.substring(0, asIdx) : null;
      if (asIdx !== 0) {
        pStr = pStr.substr(asIdx);
      }
      let aeIdx = pStr.indexOf(this.braceFlag_, 1);
      let endText = aeIdx + this.bFlagLen_ < pStr.length ? pStr.substr(aeIdx + this.bFlagLen_) : null;
      let idx = pStr.substring(this.bFlagLen_, aeIdx);
      let idxNum = Number(idx);
      if (!intUtils_.isNumericString(idx) || idxNum >= this.annotations_.length) {
        throw new Error(`Processing Error - invalid annotation index ${idx} found ` + `in ${pStr} that was created from ${origString}`);
      }
      pStr = this.annotations_[idxNum];
      return [pStr, startText, endText];
    }
    _getSuggestions(pStr) {
      let retObj = intUtils_.getSynonyms(pStr);
      if (retObj["status"] === "succeeded") {
        let suggSet = {};
        suggSet["msg"] = `${pStr} is not a valid UCUM code.  We found possible ` + `units that might be what was meant:`;
        suggSet["invalidUnit"] = pStr;
        let synLen = retObj["units"].length;
        suggSet["units"] = [];
        for (let s = 0;s < synLen; s++) {
          let unit = retObj["units"][s];
          let unitArray = [unit["code"], unit["name"], unit["guidance"]];
          suggSet["units"].push(unitArray);
        }
        this.suggestions_.push(suggSet);
      } else {
        this.retMsg_.push(`${pStr} is not a valid UCUM code.  No alternatives ` + `were found.`);
      }
      return retObj["status"];
    }
    _makeUnit(uCode, origString) {
      let retUnit = this.utabs_.getUnitByCode(uCode);
      if (retUnit) {
        retUnit = retUnit.clone();
      } else if (uCode.indexOf(this.braceFlag_) >= 0) {
        let getAnnoRet = this._getUnitWithAnnotation(uCode, origString);
        retUnit = getAnnoRet[0];
        if (retUnit) {
          origString = getAnnoRet[1];
        }
      } else {
        if (uCode.indexOf("^") > -1) {
          let tryCode = uCode.replace("^", "*");
          retUnit = this.utabs_.getUnitByCode(tryCode);
          if (retUnit) {
            retUnit = retUnit.clone();
            retUnit.csCode_ = retUnit.csCode_.replace("*", "^");
            retUnit.ciCode_ = retUnit.ciCode_.replace("*", "^");
          }
        }
        if (!retUnit) {
          let addBrackets = "[" + uCode + "]";
          retUnit = this.utabs_.getUnitByCode(addBrackets);
          if (retUnit) {
            retUnit = retUnit.clone();
            origString = origString.replace(uCode, addBrackets);
            this.retMsg_.push(`${uCode} is not a valid unit expression, but ` + `${addBrackets} is.\n` + this.vcMsgStart_ + `${addBrackets} (${retUnit.name_})${this.vcMsgEnd_}`);
          }
        }
        if (!retUnit) {
          let retUnitAry = this.utabs_.getUnitByName(uCode);
          if (retUnitAry && retUnitAry.length > 0) {
            retUnit = retUnitAry[0].clone();
            let mString = "The UCUM code for " + uCode + " is " + retUnit.csCode_ + ".\n" + this.vcMsgStart_ + retUnit.csCode_ + this.vcMsgEnd_;
            let dupMsg = false;
            for (let r = 0;r < this.retMsg_.length && !dupMsg; r++)
              dupMsg = this.retMsg_[r] === mString;
            if (!dupMsg)
              this.retMsg_.push(mString);
            let rStr = new RegExp("(^|[./({])(" + uCode + ")($|[./)}])");
            let res = origString.match(rStr);
            origString = origString.replace(rStr, res[1] + retUnit.csCode_ + res[3]);
            uCode = retUnit.csCode_;
          }
        }
        if (!retUnit) {
          let sUnit = null;
          for (sUnit in Ucum.specUnits_) {
            if (uCode.indexOf(Ucum.specUnits_[sUnit]) !== -1)
              uCode = uCode.replace(Ucum.specUnits_[sUnit], sUnit);
          }
          retUnit = this.utabs_.getUnitByCode(uCode);
          if (retUnit)
            retUnit = retUnit.clone();
        }
        if (!retUnit) {
          let origCode = uCode;
          let origUnit = null;
          let exp = null;
          let pfxCode = null;
          let pfxObj = null;
          let pfxVal = null;
          let pfxExp = null;
          let codeAndExp = this._isCodeWithExponent(uCode);
          if (codeAndExp) {
            uCode = codeAndExp[0];
            exp = codeAndExp[1];
            origUnit = this.utabs_.getUnitByCode(uCode);
          }
          if (!origUnit) {
            pfxCode = uCode.charAt(0);
            pfxObj = this.pfxTabs_.getPrefixByCode(pfxCode);
            if (pfxObj) {
              pfxVal = pfxObj.getValue();
              pfxExp = pfxObj.getExp();
              let pCodeLen = pfxCode.length;
              uCode = uCode.substr(pCodeLen);
              origUnit = this.utabs_.getUnitByCode(uCode);
              if (!origUnit && pfxCode == "d" && uCode.substr(0, 1) == "a") {
                pfxCode = "da";
                pfxObj = this.pfxTabs_.getPrefixByCode(pfxCode);
                pfxVal = pfxObj.getValue();
                uCode = uCode.substr(1);
                origUnit = this.utabs_.getUnitByCode(uCode);
              }
            }
          }
          if (!origUnit) {
            retUnit = null;
            if (this.suggestions_) {
              let suggestStat = this._getSuggestions(origCode);
            } else {
              this.retMsg_.push(`${origCode} is not a valid UCUM code.`);
            }
          } else {
            retUnit = origUnit.clone();
            retUnit.guidance_ = "";
            let theDim = retUnit.getProperty("dim_");
            let theMag = retUnit.getProperty("magnitude_");
            let theName = retUnit.getProperty("name_");
            let theCiCode = retUnit.getProperty("ciCode_");
            let thePrintSymbol = retUnit.getProperty("printSymbol_");
            if (exp) {
              exp = parseInt(exp);
              let expMul = exp;
              if (theDim)
                theDim = theDim.mul(exp);
              theMag = Math.pow(theMag, exp);
              retUnit.assignVals({
                magnitude_: theMag
              });
              if (pfxObj) {
                if (pfxExp) {
                  expMul *= pfxObj.getExp();
                  pfxVal = Math.pow(10, expMul);
                }
              }
            }
            if (pfxObj) {
              if (retUnit.cnv_) {
                retUnit.assignVals({
                  cnvPfx_: pfxVal
                });
              } else {
                theMag *= pfxVal;
                retUnit.assignVals({
                  magnitude_: theMag
                });
              }
            }
            let theCode = retUnit.csCode_;
            if (pfxObj) {
              theName = pfxObj.getName() + theName;
              theCode = pfxCode + theCode;
              theCiCode = pfxObj.getCiCode() + theCiCode;
              thePrintSymbol = pfxObj.getPrintSymbol() + thePrintSymbol;
              retUnit.assignVals({
                name_: theName,
                csCode_: theCode,
                ciCode_: theCiCode,
                printSymbol_: thePrintSymbol
              });
            }
            if (exp) {
              let expStr = exp.toString();
              retUnit.assignVals({
                name_: theName + "<sup>" + expStr + "</sup>",
                csCode_: theCode + expStr,
                ciCode_: theCiCode + expStr,
                printSymbol_: thePrintSymbol + "<sup>" + expStr + "</sup>"
              });
            }
          }
        }
      }
      return [retUnit, origString];
    }
    _getUnitWithAnnotation(uCode, origString) {
      let retUnit = null;
      let annoRet = this._getAnnoText(uCode, origString);
      let annoText = annoRet[0];
      let befAnnoText = annoRet[1];
      let aftAnnoText = annoRet[2];
      if (this.bracesMsg_ && this.retMsg_.indexOf(this.bracesMsg_) === -1)
        this.retMsg_.push(this.bracesMsg_);
      let msgLen = this.retMsg_.length;
      if (!befAnnoText && !aftAnnoText) {
        let tryBrackets = "[" + annoText.substring(1, annoText.length - 1) + "]";
        let mkUnitRet = this._makeUnit(tryBrackets, origString);
        if (mkUnitRet[0]) {
          retUnit = mkUnitRet[0];
          origString = origString.replace(annoText, tryBrackets);
          this.retMsg_.push(`${annoText} is not a valid unit expression, but ` + `${tryBrackets} is.\n` + this.vcMsgStart_ + `${tryBrackets} (${retUnit.name_})${this.vcMsgEnd_}`);
        } else {
          if (this.retMsg_.length > msgLen) {
            this.retMsg_.pop();
          }
          uCode = 1;
          retUnit = 1;
        }
      } else {
        if (befAnnoText && !aftAnnoText) {
          if (intUtils_.isIntegerUnit(befAnnoText)) {
            retUnit = befAnnoText;
          } else {
            let mkUnitRet = this._makeUnit(befAnnoText, origString);
            if (mkUnitRet[0]) {
              retUnit = mkUnitRet[0];
              retUnit.csCode_ += annoText;
              origString = mkUnitRet[1];
            } else {
              this.retMsg_.push(`Unable to find a unit for ${befAnnoText} that ` + `precedes the annotation ${annoText}.`);
            }
          }
        } else if (!befAnnoText && aftAnnoText) {
          if (intUtils_.isIntegerUnit(aftAnnoText)) {
            retUnit = aftAnnoText + annoText;
            this.retMsg_.push(`The annotation ${annoText} before the ``${aftAnnoText} is invalid.\n` + this.vcMsgStart_ + retUnit + this.vcMsgEnd_);
          } else {
            let mkUnitRet = this._makeUnit(aftAnnoText, origString);
            if (mkUnitRet[0]) {
              retUnit = mkUnitRet[0];
              retUnit.csCode_ += annoText;
              origString = retUnit.csCode_;
              this.retMsg_.push(`The annotation ${annoText} before the unit ` + `code is invalid.\n` + this.vcMsgStart_ + retUnit.csCode_ + this.vcMsgEnd_);
            } else {
              this.retMsg_.push(`Unable to find a unit for ${befAnnoText} that ` + `follows the annotation ${annoText}.`);
            }
          }
        } else {
          this.retMsg_.push(`Unable to find a unit for ${befAnnoText}${annoText}` + `${aftAnnoText}.\nWe are not sure how to interpret text both before ` + `and after the annotation.  Sorry`);
        }
      }
      return [retUnit, origString];
    }
    _performUnitArithmetic(uArray, origString) {
      let finalUnit = uArray[0]["un"];
      if (intUtils_.isIntegerUnit(finalUnit)) {
        finalUnit = new Unit({
          csCode_: finalUnit,
          magnitude_: Number(finalUnit),
          name_: finalUnit
        });
      }
      let uLen = uArray.length;
      let endProcessing = false;
      for (let u2 = 1;u2 < uLen && !endProcessing; u2++) {
        let nextUnit = uArray[u2]["un"];
        if (intUtils_.isIntegerUnit(nextUnit)) {
          nextUnit = new Unit({
            csCode_: nextUnit,
            magnitude_: Number(nextUnit),
            name_: nextUnit
          });
        }
        if (nextUnit === null || typeof nextUnit !== "number" && !nextUnit.getProperty) {
          let msgString = `Unit string (${origString}) contains unrecognized ` + "element";
          if (nextUnit) {
            msgString += ` (${this.openEmph_}${nextUnit.toString()}` + `${this.closeEmph_})`;
          }
          msgString += "; could not parse full string.  Sorry";
          this.retMsg_.push(msgString);
          endProcessing = true;
        } else {
          try {
            let thisOp = uArray[u2]["op"];
            let isDiv = thisOp === "/";
            isDiv ? finalUnit = finalUnit.divide(nextUnit) : finalUnit = finalUnit.multiplyThese(nextUnit);
          } catch (err) {
            this.retMsg_.unshift(err.message);
            endProcessing = true;
            finalUnit = null;
          }
        }
      }
      return finalUnit;
    }
    _isCodeWithExponent(uCode) {
      let ret = [];
      let res = uCode.match(/(^[^\-\+]+?)([\-\+\d]+)$/);
      if (res && res[2] && res[2] !== "") {
        ret.push(res[1]);
        ret.push(res[2]);
      } else {
        ret = null;
      }
      return ret;
    }
  }
  exports.UnitString = UnitString;
  UnitString.getInstance = function() {
    return new UnitString;
  };
});

// node_modules/@lhncbc/ucum-lhc/source-cjs/ucumLhcUtils.js
var require_ucumLhcUtils = __commonJS((exports) => {
  var _getRequireWildcardCache = function() {
    if (typeof WeakMap !== "function")
      return null;
    var cache = new WeakMap;
    _getRequireWildcardCache = function() {
      return cache;
    };
    return cache;
  };
  var _interopRequireWildcard = function(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      return { default: obj };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    newObj.default = obj;
    if (cache) {
      cache.set(obj, newObj);
    }
    return newObj;
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UcumLhcUtils = undefined;
  var _ucumJsonDefs = require_ucumJsonDefs();
  var intUtils_ = _interopRequireWildcard(require_ucumInternalUtils());
  var Ucum = require_config().Ucum;
  var UnitTables = require_unitTables().UnitTables;
  var UnitString = require_unitString().UnitString;

  class UcumLhcUtils {
    constructor() {
      if (UnitTables.getInstance().unitsCount() === 0) {
        _ucumJsonDefs.ucumJsonDefs.loadJsonDefs();
      }
      this.uStrParser_ = UnitString.getInstance();
    }
    useHTMLInMessages(use) {
      if (use === undefined)
        use = true;
      this.uStrParser_.useHTMLInMessages(use);
    }
    useBraceMsgForEachString(use) {
      if (use === undefined)
        use = true;
      this.uStrParser_.useBraceMsgForEachString(use);
    }
    validateUnitString(uStr, suggest, valConv) {
      if (suggest === undefined)
        suggest = false;
      if (valConv === undefined)
        valConv = "validate";
      let resp = this.getSpecifiedUnit(uStr, valConv, suggest);
      let theUnit = resp["unit"];
      let retObj = {};
      if (!theUnit) {
        retObj = {
          status: !resp["origString"] || resp["origString"] === null ? "error" : "invalid",
          ucumCode: null
        };
      } else {
        retObj = {
          status: resp["origString"] === uStr ? "valid" : "invalid",
          ucumCode: resp["origString"],
          unit: {
            code: theUnit.csCode_,
            name: theUnit.name_,
            guidance: theUnit.guidance_
          }
        };
      }
      if (resp["suggestions"]) {
        retObj["suggestions"] = resp["suggestions"];
      }
      retObj["msg"] = resp["retMsg"];
      return retObj;
    }
    convertUnitTo(fromUnitCode, fromVal, toUnitCode, suggest, molecularWeight) {
      if (suggest === undefined)
        suggest = false;
      if (molecularWeight === undefined)
        molecularWeight = null;
      let returnObj = {
        status: "failed",
        toVal: null,
        msg: []
      };
      if (fromUnitCode) {
        fromUnitCode = fromUnitCode.trim();
      }
      if (!fromUnitCode || fromUnitCode == "") {
        returnObj["status"] = "error";
        returnObj["msg"].push('No "from" unit expression specified.');
      }
      if (fromVal === null || isNaN(fromVal) || typeof fromVal !== "number" && !intUtils_.isNumericString(fromVal)) {
        returnObj["status"] = "error";
        returnObj["msg"].push('No "from" value, or an invalid "from" value, was specified.');
      }
      if (toUnitCode) {
        toUnitCode = toUnitCode.trim();
      }
      if (!toUnitCode || toUnitCode == "") {
        returnObj["status"] = "error";
        returnObj["msg"].push('No "to" unit expression specified.');
      }
      if (returnObj["status"] !== "error") {
        try {
          let fromUnit = null;
          let parseResp = this.getSpecifiedUnit(fromUnitCode, "convert", suggest);
          fromUnit = parseResp["unit"];
          if (parseResp["retMsg"])
            returnObj["msg"] = returnObj["msg"].concat(parseResp["retMsg"]);
          if (parseResp["suggestions"]) {
            returnObj["suggestions"] = {};
            returnObj["suggestions"]["from"] = parseResp["suggestions"];
          }
          if (!fromUnit) {
            returnObj["msg"].push(`Unable to find a unit for ${fromUnitCode}, ` + `so no conversion could be performed.`);
          }
          let toUnit = null;
          parseResp = this.getSpecifiedUnit(toUnitCode, "convert", suggest);
          toUnit = parseResp["unit"];
          if (parseResp["retMsg"])
            returnObj["msg"] = returnObj["msg"].concat(parseResp["retMsg"]);
          if (parseResp["suggestions"]) {
            if (!returnObj["suggestions"])
              returnObj["suggestions"] = {};
            returnObj["suggestions"]["to"] = parseResp["suggestions"];
          }
          if (!toUnit) {
            returnObj["msg"].push(`Unable to find a unit for ${toUnitCode}, ` + `so no conversion could be performed.`);
          }
          if (fromUnit && toUnit) {
            try {
              if (!molecularWeight) {
                returnObj["toVal"] = toUnit.convertFrom(fromVal, fromUnit);
              } else {
                if (fromUnit.moleExp_ !== 0 && toUnit.moleExp_ !== 0) {
                  throw new Error("A molecular weight was specified but a mass <-> mole conversion cannot be executed for two mole-based units.  No conversion was attempted.");
                }
                if (fromUnit.moleExp_ === 0 && toUnit.moleExp_ === 0) {
                  throw new Error("A molecular weight was specified but a mass <-> mole conversion cannot be executed when neither unit is mole-based.  No conversion was attempted.");
                }
                if (!fromUnit.isMoleMassCommensurable(toUnit)) {
                  throw new Error(`Sorry.  ${fromUnitCode} cannot be ` + `converted to ${toUnitCode}.`);
                }
                if (fromUnit.moleExp_ !== 0) {
                  returnObj["toVal"] = fromUnit.convertMolToMass(fromVal, toUnit, molecularWeight);
                } else {
                  returnObj["toVal"] = fromUnit.convertMassToMol(fromVal, toUnit, molecularWeight);
                }
              }
              returnObj["status"] = "succeeded";
              returnObj["fromUnit"] = fromUnit;
              returnObj["toUnit"] = toUnit;
            } catch (err) {
              returnObj["status"] = "failed";
              returnObj["msg"].push(err.message);
            }
          }
        } catch (err) {
          if (err.message == Ucum.needMoleWeightMsg_)
            returnObj["status"] = "failed";
          else
            returnObj["status"] = "error";
          returnObj["msg"].push(err.message);
        }
      }
      return returnObj;
    }
    checkSynonyms(theSyn) {
      let retObj = {};
      if (theSyn === undefined || theSyn === null) {
        retObj["status"] = "error";
        retObj["msg"] = "No term specified for synonym search.";
      } else {
        retObj = intUtils_.getSynonyms(theSyn);
      }
      return retObj;
    }
    getSpecifiedUnit(uName, valConv, suggest) {
      if (suggest === undefined)
        suggest = false;
      let retObj = {};
      retObj["retMsg"] = [];
      if (!uName) {
        retObj["retMsg"].push("No unit string specified.");
      } else {
        let utab = UnitTables.getInstance();
        uName = uName.trim();
        let theUnit = utab.getUnitByCode(uName);
        if (theUnit) {
          retObj["unit"] = theUnit;
          retObj["origString"] = uName;
        } else {
          try {
            let resp = this.uStrParser_.parseString(uName, valConv, suggest);
            retObj["unit"] = resp[0];
            retObj["origString"] = resp[1];
            if (resp[2])
              retObj["retMsg"] = resp[2];
            retObj["suggestions"] = resp[3];
          } catch (err) {
            console.log(`Unit requested for unit string ${uName}.` + "request unsuccessful; error thrown = " + err.message);
            retObj["retMsg"].unshift(`${uName} is not a valid unit.  ` + `${err.message}`);
          }
        }
      }
      return retObj;
    }
    commensurablesList(fromName) {
      let retMsg = [];
      let commUnits = null;
      let parseResp = this.getSpecifiedUnit(fromName, "validate", false);
      let fromUnit = parseResp["unit"];
      if (parseResp["retMsg"].length > 0)
        retMsg = parseResp["retMsg"];
      if (!fromUnit) {
        retMsg.push(`Could not find unit ${fromName}.`);
      } else {
        let dimVec = null;
        let fromDim = fromUnit.getProperty("dim_");
        if (!fromDim) {
          retMsg.push("No commensurable units were found for " + fromName);
        } else {
          try {
            dimVec = fromDim.getProperty("dimVec_");
          } catch (err) {
            retMsg.push(err.message);
            if (err.message === "Dimension does not have requested property(dimVec_)")
              dimVec = null;
          }
          if (dimVec) {
            let utab = UnitTables.getInstance();
            commUnits = utab.getUnitsByDimension(dimVec);
          }
        }
      }
      return [commUnits, retMsg];
    }
  }
  exports.UcumLhcUtils = UcumLhcUtils;
  UcumLhcUtils.getInstance = function() {
    return new UcumLhcUtils;
  };
});

// node_modules/@lhncbc/ucum-lhc/source-cjs/ucumPkg.js
var require_ucumPkg = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UnitTables = exports.UcumLhcUtils = exports.Ucum = undefined;
  var Ucum = require_config().Ucum;
  exports.Ucum = Ucum;
  var UcumLhcUtils = require_ucumLhcUtils().UcumLhcUtils;
  exports.UcumLhcUtils = UcumLhcUtils;
  var UnitTables = require_unitTables().UnitTables;
  exports.UnitTables = UnitTables;
});

// src/numbers.js
var require_numbers = __commonJS((exports, module) => {
  var decimalPlaces = function(x) {
    const s = "" + +x, match = /(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(s);
    if (!match) {
      return 0;
    }
    const fraction = match[2], exponent = match[3];
    return Math.max(0, (fraction === "0" ? 0 : (fraction || "").length) - (exponent || 0));
  };
  var roundToDecimalPlaces = function(x, n) {
    const scale = Math.pow(10, n);
    return Math.round(x * scale) / scale;
  };
  var numberFns = {};
  var PRECISION_STEP = 0.00000001;
  var roundToMaxPrecision = numberFns.roundToMaxPrecision = function(x) {
    return Math.round(x / PRECISION_STEP) * PRECISION_STEP;
  };
  numberFns.isEquivalent = function(actual, expected) {
    if (Number.isInteger(actual) && Number.isInteger(expected)) {
      return actual === expected;
    }
    const prec = Math.min(decimalPlaces(actual), decimalPlaces(expected));
    if (prec === 0) {
      return Math.round(actual) === Math.round(expected);
    } else {
      return roundToDecimalPlaces(actual, prec) === roundToDecimalPlaces(expected, prec);
    }
  };
  numberFns.isEqual = function(actual, expected) {
    return roundToMaxPrecision(actual) === roundToMaxPrecision(expected);
  };
  module.exports = numberFns;
});

// node_modules/date-fns/get_days_in_month/index.js
var require_get_days_in_month = __commonJS((exports, module) => {
  var getDaysInMonth = function(dirtyDate) {
    var date = parse(dirtyDate);
    var year = date.getFullYear();
    var monthIndex = date.getMonth();
    var lastDayOfMonth = new Date(0);
    lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);
    return lastDayOfMonth.getDate();
  };
  var parse = require_parse();
  module.exports = getDaysInMonth;
});

// node_modules/date-fns/add_months/index.js
var require_add_months = __commonJS((exports, module) => {
  var addMonths = function(dirtyDate, dirtyAmount) {
    var date = parse(dirtyDate);
    var amount = Number(dirtyAmount);
    var desiredMonth = date.getMonth() + amount;
    var dateWithDesiredMonth = new Date(0);
    dateWithDesiredMonth.setFullYear(date.getFullYear(), desiredMonth, 1);
    dateWithDesiredMonth.setHours(0, 0, 0, 0);
    var daysInMonth = getDaysInMonth(dateWithDesiredMonth);
    date.setMonth(desiredMonth, Math.min(daysInMonth, date.getDate()));
    return date;
  };
  var parse = require_parse();
  var getDaysInMonth = require_get_days_in_month();
  module.exports = addMonths;
});

// node_modules/date-fns/add_years/index.js
var require_add_years = __commonJS((exports, module) => {
  var addYears = function(dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return addMonths(dirtyDate, amount * 12);
  };
  var addMonths = require_add_months();
  module.exports = addYears;
});

// node_modules/date-fns/add_days/index.js
var require_add_days = __commonJS((exports, module) => {
  var addDays = function(dirtyDate, dirtyAmount) {
    var date = parse(dirtyDate);
    var amount = Number(dirtyAmount);
    date.setDate(date.getDate() + amount);
    return date;
  };
  var parse = require_parse();
  module.exports = addDays;
});

// node_modules/date-fns/add_weeks/index.js
var require_add_weeks = __commonJS((exports, module) => {
  var addWeeks = function(dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    var days = amount * 7;
    return addDays(dirtyDate, days);
  };
  var addDays = require_add_days();
  module.exports = addWeeks;
});

// node_modules/date-fns/add_hours/index.js
var require_add_hours = __commonJS((exports, module) => {
  var addHours = function(dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_HOUR);
  };
  var addMilliseconds = require_add_milliseconds();
  var MILLISECONDS_IN_HOUR = 3600000;
  module.exports = addHours;
});

// node_modules/date-fns/add_seconds/index.js
var require_add_seconds = __commonJS((exports, module) => {
  var addSeconds = function(dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return addMilliseconds(dirtyDate, amount * 1000);
  };
  var addMilliseconds = require_add_milliseconds();
  module.exports = addSeconds;
});

// src/types.js
var require_types = __commonJS((exports, module) => {
  var formatNum = function(num, len) {
    var rtn = num;
    if (len === 3 && num < 100)
      rtn = "0" + num;
    if (num < 10)
      rtn = "0" + rtn;
    return rtn;
  };
  var typeFn = function(coll) {
    return coll.map((value) => {
      return TypeInfo.fromValue(value);
    });
  };
  var isFn = function(coll, typeInfo) {
    if (coll.length === 0) {
      return [];
    }
    if (coll.length > 1) {
      throw new Error("Expected singleton on left side of 'is', got " + JSON.stringify(coll));
    }
    return TypeInfo.fromValue(coll[0]).is(typeInfo);
  };
  var asFn = function(coll, typeInfo) {
    if (coll.length === 0) {
      return [];
    }
    if (coll.length > 1) {
      throw new Error("Expected singleton on left side of 'as', got " + JSON.stringify(coll));
    }
    return TypeInfo.fromValue(coll[0]).is(typeInfo) ? coll : [];
  };
  var addMinutes = require_add_minutes();
  var ucumUtils = require_ucumPkg().UcumLhcUtils.getInstance();
  var numbers = require_numbers();
  var ucumSystemUrl = "http://unitsofmeasure.org";
  var timeFormat = "[0-9][0-9](\\:[0-9][0-9](\\:[0-9][0-9](\\.[0-9]+)?)?)?(Z|(\\+|-)[0-9][0-9]\\:[0-9][0-9])?";
  var timeRE = new RegExp("^T?" + timeFormat + "$");
  var dateTimeRE = new RegExp("^[0-9][0-9][0-9][0-9](-[0-9][0-9](-[0-9][0-9](T" + timeFormat + ")?)?)?Z?$");
  var dateRE = new RegExp("^[0-9][0-9][0-9][0-9](-[0-9][0-9](-[0-9][0-9])?)?$");

  class FP_Type {
    equals() {
      return false;
    }
    equivalentTo() {
      return false;
    }
    toString() {
      return this.asStr ? this.asStr : super.toString();
    }
    toJSON() {
      return this.toString();
    }
    compare() {
      throw "Not implemented";
    }
  }

  class FP_Quantity extends FP_Type {
    constructor(value, unit) {
      super();
      this.asStr = value + " " + unit;
      this.value = value;
      this.unit = unit;
    }
    equals(otherQuantity) {
      if (!(otherQuantity instanceof this.constructor)) {
        return false;
      }
      if (this.unit === otherQuantity.unit) {
        return numbers.isEqual(this.value, otherQuantity.value);
      }
      const compareYearsAndMonths = this._compareYearsAndMonths(otherQuantity);
      if (compareYearsAndMonths) {
        return compareYearsAndMonths.isEqual;
      }
      const thisQuantity = FP_Quantity.toUcumQuantity(this.value, this.unit), normalizedOtherQuantity = FP_Quantity.toUcumQuantity(otherQuantity.value, otherQuantity.unit), convResult = ucumUtils.convertUnitTo(normalizedOtherQuantity.unit, normalizedOtherQuantity.value, thisQuantity.unit);
      if (convResult.status !== "succeeded") {
        return false;
      }
      return numbers.isEqual(thisQuantity.value, convResult.toVal);
    }
    equivalentTo(otherQuantity) {
      if (!(otherQuantity instanceof this.constructor)) {
        return false;
      }
      if (this.unit === otherQuantity.unit) {
        return numbers.isEquivalent(this.value, otherQuantity.value);
      }
      const ucumUnitCode = FP_Quantity.getEquivalentUcumUnitCode(this.unit), otherUcumUnitCode = FP_Quantity.getEquivalentUcumUnitCode(otherQuantity.unit), convResult = ucumUtils.convertUnitTo(otherUcumUnitCode, otherQuantity.value, ucumUnitCode);
      if (convResult.status !== "succeeded") {
        return false;
      }
      return numbers.isEquivalent(this.value, convResult.toVal);
    }
    _compareYearsAndMonths(otherQuantity) {
      const magnitude1 = FP_Quantity._yearMonthConversionFactor[this.unit], magnitude2 = FP_Quantity._yearMonthConversionFactor[otherQuantity.unit];
      if (magnitude1 && magnitude2) {
        return {
          isEqual: numbers.isEqual(this.value * magnitude1, otherQuantity.value * magnitude2)
        };
      }
      return null;
    }
  }
  var surroundingApostrophesRegex = /^'|'$/g;
  FP_Quantity.getEquivalentUcumUnitCode = function(unit) {
    return FP_Quantity.mapTimeUnitsToUCUMCode[unit] || unit.replace(surroundingApostrophesRegex, "");
  };
  FP_Quantity.toUcumQuantity = function(value, unit) {
    const magnitude = FP_Quantity._calendarDuration2Seconds[unit];
    if (magnitude) {
      return {
        value: magnitude * value,
        unit: "s"
      };
    }
    return {
      value,
      unit: unit.replace(surroundingApostrophesRegex, "")
    };
  };
  FP_Quantity.convUnitTo = function(fromUnit, value, toUnit) {
    const fromYearMonthMagnitude = FP_Quantity._yearMonthConversionFactor[fromUnit], toYearMonthMagnitude = FP_Quantity._yearMonthConversionFactor[toUnit];
    if (fromYearMonthMagnitude && toYearMonthMagnitude) {
      return new FP_Quantity(fromYearMonthMagnitude * value / toYearMonthMagnitude, toUnit);
    }
    const fromMagnitude = FP_Quantity._calendarDuration2Seconds[fromUnit], toMagnitude = FP_Quantity._calendarDuration2Seconds[toUnit];
    if (toMagnitude) {
      if (fromMagnitude) {
        return new FP_Quantity(fromMagnitude * value / toMagnitude, toUnit);
      } else {
        const convResult = ucumUtils.convertUnitTo(fromUnit.replace(/^'|'$/g, ""), value, "s");
        if (convResult.status === "succeeded") {
          return new FP_Quantity(convResult.toVal / toMagnitude, toUnit);
        }
      }
    } else {
      const convResult = fromMagnitude ? ucumUtils.convertUnitTo("s", fromMagnitude * value, toUnit.replace(/^'|'$/g, "")) : ucumUtils.convertUnitTo(fromUnit.replace(/^'|'$/g, ""), value, toUnit.replace(/^'|'$/g, ""));
      if (convResult.status === "succeeded") {
        return new FP_Quantity(convResult.toVal, toUnit);
      }
    }
    return null;
  };
  FP_Quantity._calendarDuration2Seconds = {
    years: 365 * 24 * 60 * 60,
    months: 30 * 24 * 60 * 60,
    weeks: 7 * 24 * 60 * 60,
    days: 24 * 60 * 60,
    hours: 60 * 60,
    minutes: 60,
    seconds: 1,
    milliseconds: 0.001,
    year: 365 * 24 * 60 * 60,
    month: 30 * 24 * 60 * 60,
    week: 7 * 24 * 60 * 60,
    day: 24 * 60 * 60,
    hour: 60 * 60,
    minute: 60,
    second: 1,
    millisecond: 0.001
  };
  FP_Quantity._yearMonthConversionFactor = {
    years: 12,
    months: 1,
    year: 12,
    month: 1
  };
  FP_Quantity.arithmeticDurationUnits = {
    years: "year",
    months: "month",
    weeks: "week",
    days: "day",
    hours: "hour",
    minutes: "minute",
    seconds: "second",
    milliseconds: "millisecond",
    year: "year",
    month: "month",
    week: "week",
    day: "day",
    hour: "hour",
    minute: "minute",
    second: "second",
    millisecond: "millisecond",
    "'wk'": "week",
    "'d'": "day",
    "'h'": "hour",
    "'min'": "minute",
    "'s'": "second",
    "'ms'": "millisecond"
  };
  FP_Quantity.mapUCUMCodeToTimeUnits = {
    a: "year",
    mo: "month",
    wk: "week",
    d: "day",
    h: "hour",
    min: "minute",
    s: "second",
    ms: "millisecond"
  };
  FP_Quantity.mapTimeUnitsToUCUMCode = Object.keys(FP_Quantity.mapUCUMCodeToTimeUnits).reduce(function(res, key) {
    res[FP_Quantity.mapUCUMCodeToTimeUnits[key]] = key;
    res[FP_Quantity.mapUCUMCodeToTimeUnits[key] + "s"] = key;
    return res;
  }, {});

  class FP_TimeBase extends FP_Type {
    constructor(timeStr) {
      super();
      this.asStr = timeStr;
    }
    plus(timeQuantity) {
      const unit = timeQuantity.unit;
      let timeUnit = FP_Quantity.arithmeticDurationUnits[unit];
      if (!timeUnit) {
        throw new Error("For date/time arithmetic, the unit of the quantity must be one of the following time-based units: " + Object.keys(FP_Quantity.arithmeticDurationUnits));
      }
      const cls = this.constructor;
      const unitPrecision = cls._timeUnitToDatePrecision[timeUnit];
      if (unitPrecision === undefined) {
        throw new Error("Unsupported unit for +.  The unit should be one of " + Object.keys(cls._timeUnitToDatePrecision).join(", ") + ".");
      }
      let qVal = timeQuantity.value;
      const isTime = cls === FP_Time;
      if (isTime ? unitPrecision < 2 : unitPrecision < 5) {
        qVal = Math.trunc(qVal);
      }
      if (this._getPrecision() < unitPrecision) {
        const neededUnit = cls._datePrecisionToTimeUnit[this._getPrecision()];
        if (neededUnit !== "second") {
          const newQuantity = FP_Quantity.convUnitTo(timeUnit, qVal, neededUnit);
          timeUnit = newQuantity.unit;
          qVal = Math.trunc(newQuantity.value);
        }
      }
      const newDate = FP_TimeBase.timeUnitToAddFn[timeUnit](this._getDateObj(), qVal);
      let precision = this._getPrecision();
      if (isTime)
        precision += 3;
      let newDateStr = FP_DateTime.isoDateTime(newDate, precision);
      if (isTime) {
        newDateStr = newDateStr.slice(newDateStr.indexOf("T") + 1);
      }
      return new cls(newDateStr);
    }
    equals(otherDateTime) {
      var rtn;
      if (!(otherDateTime instanceof this.constructor) && !(this instanceof otherDateTime.constructor))
        rtn = false;
      else {
        var thisPrec = this._getPrecision();
        var otherPrec = otherDateTime._getPrecision();
        if (thisPrec == otherPrec) {
          rtn = this._getDateObj().getTime() == otherDateTime._getDateObj().getTime();
        } else {
          var commonPrec = thisPrec <= otherPrec ? thisPrec : otherPrec;
          var thisUTCStr = this._getDateObj().toISOString();
          var otherUTCStr = otherDateTime._getDateObj().toISOString();
          if (this.constructor === FP_Time) {
            commonPrec += 3;
            thisPrec += 3;
            otherPrec += 3;
          }
          var thisAdj = thisPrec > 2 ? new FP_DateTime(thisUTCStr)._getTimeParts() : this._getTimeParts();
          var otherAdj = otherPrec > 2 ? new FP_DateTime(otherUTCStr)._getTimeParts() : otherDateTime._getTimeParts();
          for (var i = 0;i <= commonPrec && rtn !== false; ++i) {
            rtn = thisAdj[i] == otherAdj[i];
          }
          if (rtn)
            rtn = undefined;
        }
      }
      return rtn;
    }
    equivalentTo(otherDateTime) {
      var rtn = otherDateTime instanceof this.constructor;
      if (rtn) {
        var thisPrec = this._getPrecision();
        var otherPrec = otherDateTime._getPrecision();
        rtn = thisPrec == otherPrec;
        if (rtn) {
          rtn = this._getDateObj().getTime() == otherDateTime._getDateObj().getTime();
        }
      }
      return rtn;
    }
    compare(otherTime) {
      var thisPrecision = this._getPrecision();
      var otherPrecision = otherTime._getPrecision();
      var thisTimeInt = thisPrecision <= otherPrecision ? this._getDateObj().getTime() : this._dateAtPrecision(otherPrecision).getTime();
      var otherTimeInt = otherPrecision <= thisPrecision ? otherTime._getDateObj().getTime() : otherTime._dateAtPrecision(thisPrecision).getTime();
      if (thisPrecision !== otherPrecision && thisTimeInt === otherTimeInt) {
        return null;
      }
      return thisTimeInt - otherTimeInt;
    }
    _getPrecision() {
      if (this.precision === undefined)
        this._getMatchData();
      return this.precision;
    }
    _getMatchData(regEx, maxPrecision) {
      if (this.timeMatchData === undefined) {
        this.timeMatchData = this.asStr.match(regEx);
        if (this.timeMatchData) {
          for (let i = maxPrecision;i >= 0 && this.precision === undefined; --i) {
            if (this.timeMatchData[i])
              this.precision = i;
          }
        }
      }
      return this.timeMatchData;
    }
    _getTimeParts(timeMatchData) {
      var timeParts = [];
      timeParts = [timeMatchData[0]];
      var timeZone = timeMatchData[4];
      if (timeZone) {
        let hours = timeParts[0];
        timeParts[0] = hours.slice(0, hours.length - timeZone.length);
      }
      var min = timeMatchData[1];
      if (min) {
        let hours = timeParts[0];
        timeParts[0] = hours.slice(0, hours.length - min.length);
        timeParts[1] = min;
        var sec = timeMatchData[2];
        if (sec) {
          timeParts[1] = min.slice(0, min.length - sec.length);
          timeParts[2] = sec;
          var ms = timeMatchData[3];
          if (ms) {
            timeParts[2] = sec.slice(0, sec.length - ms.length);
            timeParts[3] = ms;
          }
        }
      }
      return timeParts;
    }
    _getDateObj() {
      if (!this.dateObj) {
        var precision = this._getPrecision();
        this.dateObj = this._dateAtPrecision(precision);
      }
      return this.dateObj;
    }
    _createDate(year, month, day, hour, minutes, seconds, ms, timezoneOffset) {
      var d = new Date(year, month, day, hour, minutes, seconds, ms);
      if (timezoneOffset) {
        var localTimezoneMinutes = d.getTimezoneOffset();
        var timezoneMinutes = 0;
        if (timezoneOffset != "Z") {
          var timezoneParts = timezoneOffset.split(":");
          var hours = parseInt(timezoneParts[0]);
          timezoneMinutes = parseInt(timezoneParts[1]);
          if (hours < 0)
            timezoneMinutes = -timezoneMinutes;
          timezoneMinutes += 60 * hours;
        }
        d = addMinutes(d, -localTimezoneMinutes - timezoneMinutes);
      }
      return d;
    }
  }
  FP_TimeBase.timeUnitToAddFn = {
    year: require_add_years(),
    month: require_add_months(),
    week: require_add_weeks(),
    day: require_add_days(),
    hour: require_add_hours(),
    minute: require_add_minutes(),
    second: require_add_seconds(),
    millisecond: require_add_milliseconds()
  };

  class FP_DateTime extends FP_TimeBase {
    constructor(dateStr) {
      super(dateStr);
    }
    compare(otherDateTime) {
      if (!(otherDateTime instanceof FP_DateTime))
        throw "Invalid comparison of a DateTime with something else";
      return super.compare(otherDateTime);
    }
    _getMatchData() {
      return super._getMatchData(dateTimeRE, 5);
    }
    _getTimeParts() {
      if (!this.timeParts) {
        let timeMatchData = this._getMatchData();
        let year = timeMatchData[0];
        this.timeParts = [year];
        var month = timeMatchData[1];
        if (month) {
          this.timeParts[0] = year.slice(0, year.length - month.length);
          this.timeParts[1] = month;
          let day = timeMatchData[2];
          if (day) {
            this.timeParts[1] = month.slice(0, month.length - day.length);
            this.timeParts[2] = day;
            let time = timeMatchData[3];
            if (time) {
              this.timeParts[2] = day.slice(0, day.length - time.length);
              if (time[0] === "T")
                timeMatchData[3] = time.slice(1);
              this.timeParts = this.timeParts.concat(super._getTimeParts(timeMatchData.slice(3)));
            }
          }
        }
      }
      return this.timeParts;
    }
    _dateAtPrecision(precision) {
      var timeParts = this._getTimeParts();
      var timezoneOffset = this._getMatchData()[7];
      var thisPrecision = this._getPrecision();
      var year = parseInt(timeParts[0]);
      var month = thisPrecision > 0 ? parseInt(timeParts[1].slice(1)) - 1 : 0;
      var day = thisPrecision > 1 ? parseInt(timeParts[2].slice(1)) : 1;
      var hour = thisPrecision > 2 ? parseInt(timeParts[3]) : 0;
      var minutes = thisPrecision > 3 ? parseInt(timeParts[4].slice(1)) : 0;
      var seconds = thisPrecision > 4 ? parseInt(timeParts[5].slice(1)) : 0;
      var ms = timeParts.length > 6 ? parseInt(timeParts[6].slice(1)) : 0;
      var d = this._createDate(year, month, day, hour, minutes, seconds, ms, timezoneOffset);
      if (precision < thisPrecision) {
        year = d.getFullYear();
        month = precision > 0 ? d.getMonth() : 0;
        day = precision > 1 ? d.getDate() : 1;
        hour = precision > 2 ? d.getHours() : 0;
        minutes = precision > 3 ? d.getMinutes() : 0;
        d = new Date(year, month, day, hour, minutes);
      }
      return d;
    }
  }
  FP_DateTime.checkString = function(str) {
    let d = new FP_DateTime(str);
    if (!d._getMatchData())
      d = null;
    return d;
  };
  FP_DateTime._timeUnitToDatePrecision = {
    year: 0,
    month: 1,
    week: 2,
    day: 2,
    hour: 3,
    minute: 4,
    second: 5,
    millisecond: 6
  };
  FP_DateTime._datePrecisionToTimeUnit = [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond"
  ];

  class FP_Time extends FP_TimeBase {
    constructor(timeStr) {
      if (timeStr[0] == "T")
        timeStr = timeStr.slice(1);
      super(timeStr);
    }
    compare(otherTime) {
      if (!(otherTime instanceof FP_Time))
        throw "Invalid comparison of a time with something else";
      return super.compare(otherTime);
    }
    _dateAtPrecision(precision) {
      var timeParts = this._getTimeParts();
      var timezoneOffset = this._getMatchData()[4];
      var thisPrecision = this._getPrecision();
      var year = 2010;
      var month = 0;
      var day = 1;
      var hour = parseInt(timeParts[0]);
      var minutes = thisPrecision > 0 ? parseInt(timeParts[1].slice(1)) : 0;
      var seconds = thisPrecision > 1 ? parseInt(timeParts[2].slice(1)) : 0;
      var ms = timeParts.length > 3 ? parseInt(timeParts[3].slice(1)) : 0;
      var d = this._createDate(year, month, day, hour, minutes, seconds, ms, timezoneOffset);
      if (timezoneOffset) {
        d.setYear(year);
        d.setMonth(month);
        d.setDate(day);
      }
      if (precision < thisPrecision) {
        hour = d.getHours();
        minutes = precision > 0 ? d.getMinutes() : 0;
        d = new Date(year, month, day, hour, minutes);
      }
      return d;
    }
    _getMatchData() {
      return super._getMatchData(timeRE, 2);
    }
    _getTimeParts() {
      if (!this.timeParts) {
        this.timeParts = super._getTimeParts(this._getMatchData());
      }
      return this.timeParts;
    }
  }
  FP_Time.checkString = function(str) {
    let d = new FP_Time(str);
    if (!d._getMatchData())
      d = null;
    return d;
  };
  FP_Time._timeUnitToDatePrecision = {
    hour: 0,
    minute: 1,
    second: 2,
    millisecond: 3
  };
  FP_Time._datePrecisionToTimeUnit = ["hour", "minute", "second", "millisecond"];
  FP_DateTime.isoDateTime = function(date, precision) {
    if (precision === undefined)
      precision = 5;
    var rtn = "" + date.getFullYear();
    if (precision > 0) {
      rtn += "-" + formatNum(date.getMonth() + 1);
      if (precision > 1) {
        rtn += "-" + formatNum(date.getDate());
        if (precision > 2) {
          rtn += "T" + FP_DateTime.isoTime(date, precision - 3);
        }
      }
    }
    if (precision > 2) {
      var tzOffset = date.getTimezoneOffset();
      var tzSign = tzOffset < 0 ? "+" : "-";
      tzOffset = Math.abs(tzOffset);
      var tzMin = tzOffset % 60;
      var tzHour = (tzOffset - tzMin) / 60;
      rtn += tzSign + formatNum(tzHour) + ":" + formatNum(tzMin);
    }
    return rtn;
  };
  FP_DateTime.isoTime = function(date, precision) {
    if (precision === undefined)
      precision = 2;
    let rtn = "" + formatNum(date.getHours());
    if (precision > 0) {
      rtn += ":" + formatNum(date.getMinutes());
      if (precision > 1) {
        rtn += ":" + formatNum(date.getSeconds());
        if (date.getMilliseconds())
          rtn += "." + formatNum(date.getMilliseconds(), 3);
      }
    }
    return rtn;
  };

  class FP_Date extends FP_DateTime {
    constructor(dateStr) {
      super(dateStr);
    }
    _getMatchData() {
      return FP_TimeBase.prototype._getMatchData.apply(this, [dateRE, 2]);
    }
  }
  FP_Date.checkString = function(str) {
    let d = new FP_Date(str);
    if (!d._getMatchData())
      d = null;
    return d;
  };
  FP_Date.isoDate = function(date, precision) {
    if (precision === undefined || precision > 2)
      precision = 2;
    return FP_DateTime.isoDateTime(date, precision);
  };

  class ResourceNode {
    constructor(data, path, _data) {
      if (data?.resourceType)
        path = data.resourceType;
      this.path = path;
      this.data = data;
      this._data = _data || {};
    }
    getTypeInfo() {
      const namespace = TypeInfo.FHIR;
      if (/^System\.(.*)$/.test(this.path)) {
        return new TypeInfo({ namespace: TypeInfo.System, name: RegExp.$1 });
      } else if (this.path.indexOf(".") === -1) {
        return new TypeInfo({ namespace, name: this.path });
      }
      if (!TypeInfo.model) {
        return TypeInfo.createByValueInNamespace({ namespace, value: this.data });
      }
      return new TypeInfo({ namespace, name: "BackboneElement" });
    }
    toJSON() {
      return JSON.stringify(this.data);
    }
    convertData() {
      var data = this.data;
      if (TypeInfo.isType(this.path, "Quantity")) {
        if (data?.system === ucumSystemUrl) {
          if (typeof data.value === "number" && typeof data.code === "string") {
            if (data.comparator !== undefined)
              throw new Error("Cannot convert a FHIR.Quantity that has a comparator");
            data = new FP_Quantity(data.value, FP_Quantity.mapUCUMCodeToTimeUnits[data.code] || "\'" + data.code + "\'");
          }
        }
      } else if (this.path === "date") {
        data = FP_Date.checkString(data) || data;
      } else if (this.path === "dateTime") {
        data = FP_DateTime.checkString(data) || data;
      } else if (this.path === "time") {
        data = FP_Time.checkString(data) || data;
      }
      return data;
    }
  }
  ResourceNode.makeResNode = function(data, path, _data) {
    return data instanceof ResourceNode ? data : new ResourceNode(data, path, _data);
  };

  class TypeInfo {
    constructor({ name, namespace }) {
      this.name = name;
      this.namespace = namespace;
    }
    static model = null;
    is(other) {
      if (other instanceof TypeInfo && (!this.namespace || !other.namespace || this.namespace === other.namespace)) {
        return TypeInfo.model && (!this.namespace || this.namespace === TypeInfo.FHIR) ? TypeInfo.isType(this.name, other.name) : this.name === other.name;
      }
      return false;
    }
  }
  TypeInfo.isType = function(type, superType) {
    do {
      if (type === superType) {
        return true;
      }
    } while (type = TypeInfo.model?.type2Parent[type]);
    return false;
  };
  TypeInfo.System = "System";
  TypeInfo.FHIR = "FHIR";
  TypeInfo.createByValueInNamespace = function({ namespace, value }) {
    let name = typeof value;
    if (Number.isInteger(value)) {
      name = "integer";
    } else if (name === "number") {
      name = "decimal";
    } else if (value instanceof FP_Date) {
      name = "date";
    } else if (value instanceof FP_DateTime) {
      name = "dateTime";
    } else if (value instanceof FP_Time) {
      name = "time";
    } else if (value instanceof FP_Quantity) {
      name = "Quantity";
    }
    if (namespace === TypeInfo.System) {
      name = name.replace(/^\w/, (c) => c.toUpperCase());
    }
    return new TypeInfo({ namespace, name });
  };
  TypeInfo.fromValue = function(value) {
    return value instanceof ResourceNode ? value.getTypeInfo() : TypeInfo.createByValueInNamespace({ namespace: TypeInfo.System, value });
  };
  module.exports = {
    FP_Type,
    FP_TimeBase,
    FP_Date,
    FP_DateTime,
    FP_Time,
    FP_Quantity,
    timeRE,
    dateTimeRE,
    ResourceNode,
    TypeInfo,
    typeFn,
    isFn,
    asFn
  };
});

// src/utilities.js
var require_utilities = __commonJS((exports, module) => {
  var util = {};
  var types = require_types();
  var { ResourceNode } = types;
  util.raiseError = function(message, fnName) {
    fnName = fnName ? fnName + ": " : "";
    throw fnName + message;
  };
  util.assertAtMostOne = function(collection, errorMsgPrefix) {
    if (collection.length > 1) {
      util.raiseError("Was expecting no more than one element but got " + JSON.stringify(collection), errorMsgPrefix);
    }
  };
  util.assertType = function(data, types2, errorMsgPrefix) {
    let val = this.valData(data);
    if (types2.indexOf(typeof val) < 0) {
      let typeList = types2.length > 1 ? "one of " + types2.join(", ") : types2[0];
      util.raiseError("Found type '" + typeof data + "' but was expecting " + typeList, errorMsgPrefix);
    }
    return val;
  };
  util.isEmpty = function(x) {
    return Array.isArray(x) && x.length == 0;
  };
  util.isSome = function(x) {
    return x !== null && x !== undefined && !util.isEmpty(x);
  };
  util.isTrue = function(x) {
    return x !== null && x !== undefined && (x === true || x.length == 1 && x[0] === true);
  };
  util.isFalse = function(x) {
    return x !== null && x !== undefined && (x === false || x.length == 1 && x[0] === false);
  };
  util.isCapitalized = function(x) {
    return x && x[0] === x[0].toUpperCase();
  };
  util.flatten = function(x) {
    return x.reduce(function(acc, x2) {
      if (Array.isArray(x2)) {
        acc = acc.concat(x2);
      } else {
        acc.push(x2);
      }
      return acc;
    }, []);
  };
  util.arraify = function(x) {
    if (Array.isArray(x)) {
      return x;
    }
    if (util.isSome(x)) {
      return [x];
    }
    return [];
  };
  util.valData = function(val) {
    return val instanceof ResourceNode ? val.data : val;
  };
  util.valDataConverted = function(val) {
    if (val instanceof ResourceNode) {
      val = val.convertData();
    }
    return val;
  };
  util.escapeStringForRegExp = function(str) {
    return str.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&");
  };
  module.exports = util;
});

// src/polyfill.js
var exports_polyfill = {};
var slice;
var init_polyfill = __esm(() => {
  slice = Function.prototype.call.bind(Array.prototype.slice);
  Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  };
  if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, "startsWith", {
      value: function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
      }
    });
  }
  if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, "endsWith", {
      value: function(searchString, position) {
        var subjectString = this.toString();
        if (position === undefined || position > subjectString.length) {
          position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
      }
    });
  }
  if (!String.prototype.includes) {
    Object.defineProperty(String.prototype, "includes", {
      value: function() {
        return this.indexOf.apply(this, arguments) !== -1;
      }
    });
  }
  if (!Object.assign) {
    Object.defineProperty(Object, "assign", {
      value: function(target) {
        if (target === undefined || target === null) {
          throw new TypeError("Cannot convert undefined or null to object");
        }
        return slice(arguments, 1).reduce(function(to, nextSource) {
          Object.keys(Object(nextSource)).forEach(function(nextKey) {
            to[nextKey] = nextSource[nextKey];
          });
          return to;
        }, Object(target));
      }
    });
  }
  if (typeof btoa === "undefined") {
    global.btoa = function(str) {
      return new Buffer.from(str, "binary").toString("base64");
    };
  }
  if (typeof atob === "undefined") {
    global.atob = function(b64Encoded) {
      return new Buffer.from(b64Encoded, "base64").toString("binary");
    };
  }
});

// src/constants.js
var require_constants = __commonJS((exports, module) => {
  module.exports = {
    reset: function() {
      this.nowDate = new Date;
      this.today = null;
      this.now = null;
      this.timeOfDay = null;
      this.localTimezoneOffset = null;
    },
    today: null,
    now: null,
    timeOfDay: null
  };
});

// src/hash-object.js
var require_hash_object = __commonJS((exports, module) => {
  var hashObject = function(obj) {
    return JSON.stringify(prepareObject(obj));
  };
  var prepareObject = function(value) {
    value = valDataConverted(value);
    if (typeof value === "number") {
      return roundToMaxPrecision(value);
    } else if (value instanceof Date) {
      return value.toISOString();
    }
    if (value instanceof FP_Quantity) {
      const magnitude = FP_Quantity._yearMonthConversionFactor[value.unit];
      if (magnitude) {
        return "_!yearMonth!_:" + magnitude * value.value;
      } else {
        const ucumQuantity = FP_Quantity.toUcumQuantity(value.value, value.unit);
        const unit = ucumUtils.getSpecifiedUnit(ucumQuantity.unit).unit;
        return "_!" + unit.property_ + "!_:" + unit.magnitude_ * ucumQuantity.value;
      }
    } else if (value instanceof FP_Type) {
      return value.toString();
    } else if (typeof value === "object" && value !== null) {
      return Array.isArray(value) ? value.map(prepareObject) : Object.keys(value).sort().reduce((o, key) => {
        const v = value[key];
        o[key] = prepareObject(v);
        return o;
      }, {});
    }
    return value;
  };
  var ucumUtils = require_ucumPkg().UcumLhcUtils.getInstance();
  var { roundToMaxPrecision } = require_numbers();
  var { valDataConverted } = require_utilities();
  var { FP_Type, FP_Quantity } = require_types();
  module.exports = hashObject;
});

// src/filtering.js
var require_filtering = __commonJS((exports, module) => {
  var util = require_utilities();
  var { TypeInfo, ResourceNode } = require_types();
  var hashObject = require_hash_object();
  var engine = {};
  engine.whereMacro = function(parentData, expr) {
    if (parentData !== false && !parentData) {
      return [];
    }
    return util.flatten(parentData.filter((x, i) => {
      this.$index = i;
      return expr(x)[0];
    }));
  };
  engine.extension = function(parentData, url) {
    if (parentData !== false && !parentData || !url) {
      return [];
    }
    return util.flatten(parentData.map((x, i) => {
      this.$index = i;
      const extensions = x && (x.data && x.data.extension || x._data && x._data.extension);
      if (extensions) {
        return extensions.filter((extension) => extension.url === url).map((x2) => ResourceNode.makeResNode(x2, "Extension"));
      }
      return [];
    }));
  };
  engine.selectMacro = function(data, expr) {
    if (data !== false && !data) {
      return [];
    }
    return util.flatten(data.map((x, i) => {
      this.$index = i;
      return expr(x);
    }));
  };
  engine.repeatMacro = function(parentData, expr) {
    if (parentData !== false && !parentData) {
      return [];
    }
    let res = [];
    const unique = {};
    const length = parentData.length;
    for (let i = 0;i < length; ++i) {
      let newItems = parentData[i];
      do {
        newItems = expr(newItems).filter((item) => {
          const key = hashObject(item);
          const isUnique = !unique[key];
          if (isUnique) {
            unique[key] = true;
          }
          return isUnique;
        });
      } while (res.length < res.push.apply(res, newItems));
    }
    return res;
  };
  engine.singleFn = function(x) {
    if (x.length == 1) {
      return x;
    } else if (x.length == 0) {
      return [];
    } else {
      return { $status: "error", $error: "Expected single" };
    }
  };
  engine.firstFn = function(x) {
    return x[0];
  };
  engine.lastFn = function(x) {
    return x[x.length - 1];
  };
  engine.tailFn = function(x) {
    return x.slice(1, x.length);
  };
  engine.takeFn = function(x, n) {
    return x.slice(0, n);
  };
  engine.skipFn = function(x, num) {
    return x.slice(num, x.length);
  };
  engine.ofTypeFn = function(coll, typeInfo) {
    return coll.filter((value) => {
      return TypeInfo.fromValue(value).is(typeInfo);
    });
  };
  engine.distinctFn = function(x) {
    let unique = [];
    if (x.length > 0) {
      let uniqueHash = {};
      for (let i = 0, len = x.length;i < len; ++i) {
        let xObj = x[i];
        let xStr = hashObject(xObj);
        if (!uniqueHash[xStr]) {
          unique.push(xObj);
          uniqueHash[xStr] = true;
        }
      }
    }
    return unique;
  };
  module.exports = engine;
});

// src/misc.js
var require_misc = __commonJS((exports, module) => {
  var defineTimeConverter = function(timeType) {
    let timeName = timeType.slice(3);
    engine["to" + timeName] = function(coll) {
      var rtn = [];
      if (coll.length > 1)
        throw Error("to " + timeName + " called for a collection of length " + coll.length);
      if (coll.length === 1) {
        var t = types[timeType].checkString(util.valData(coll[0]));
        if (t)
          rtn = t;
      }
      return rtn;
    };
  };
  var isPrimitiveDefault = function(data) {
    switch (typeof data) {
      case "string":
      case "number":
      case "boolean":
        return true;
      default:
        return false;
    }
  };
  var util = require_utilities();
  var types = require_types();
  var { FP_Quantity } = types;
  var engine = {};
  engine.iifMacro = function(data, cond, ok, fail) {
    if (util.isTrue(cond(data))) {
      return ok(data);
    } else {
      return fail ? fail(data) : [];
    }
  };
  engine.traceFn = function(x, label, expr) {
    if (this.customTraceFn) {
      if (expr) {
        this.customTraceFn(expr(x), label ?? "");
      } else {
        this.customTraceFn(x, label ?? "");
      }
    } else {
      if (expr) {
        console.log("TRACE:[" + (label || "") + "]", JSON.stringify(expr(x), null, " "));
      } else {
        console.log("TRACE:[" + (label || "") + "]", JSON.stringify(x, null, " "));
      }
    }
    return x;
  };
  var intRegex = /^[+-]?\d+$/;
  engine.toInteger = function(coll) {
    if (coll.length !== 1) {
      return [];
    }
    var v = util.valData(coll[0]);
    if (v === false) {
      return 0;
    }
    if (v === true) {
      return 1;
    }
    if (typeof v === "number") {
      if (Number.isInteger(v)) {
        return v;
      } else {
        return [];
      }
    }
    if (typeof v === "string" && intRegex.test(v)) {
      return parseInt(v);
    }
    return [];
  };
  var quantityRegex = /^((\+|-)?\d+(\.\d+)?)\s*(('[^']+')|([a-zA-Z]+))?$/;
  var quantityRegexMap = { value: 1, unit: 5, time: 6 };
  engine.toQuantity = function(coll, toUnit) {
    let result;
    if (toUnit && !FP_Quantity.mapTimeUnitsToUCUMCode[toUnit]) {
      toUnit = `'${toUnit}'`;
    }
    if (coll.length > 1) {
      throw new Error("Could not convert to quantity: input collection contains multiple items");
    } else if (coll.length === 1) {
      var v = util.valDataConverted(coll[0]);
      let quantityRegexRes;
      if (typeof v === "number") {
        result = new FP_Quantity(v, "\'1\'");
      } else if (v instanceof FP_Quantity) {
        result = v;
      } else if (typeof v === "boolean") {
        result = new FP_Quantity(v ? 1 : 0, "\'1\'");
      } else if (typeof v === "string" && (quantityRegexRes = quantityRegex.exec(v))) {
        const value = quantityRegexRes[quantityRegexMap.value], unit = quantityRegexRes[quantityRegexMap.unit], time = quantityRegexRes[quantityRegexMap.time];
        if (!time || FP_Quantity.mapTimeUnitsToUCUMCode[time]) {
          result = new FP_Quantity(Number(value), unit || time || "\'1\'");
        }
      }
      if (result && toUnit && result.unit !== toUnit) {
        result = FP_Quantity.convUnitTo(result.unit, result.value, toUnit);
      }
    }
    return result || [];
  };
  var numRegex = /^[+-]?\d+(\.\d+)?$/;
  engine.toDecimal = function(coll) {
    if (coll.length !== 1) {
      return [];
    }
    var v = util.valData(coll[0]);
    if (v === false) {
      return 0;
    }
    if (v === true) {
      return 1;
    }
    if (typeof v === "number") {
      return v;
    }
    if (typeof v === "string" && numRegex.test(v)) {
      return parseFloat(v);
    }
    return [];
  };
  engine.toString = function(coll) {
    if (coll.length !== 1) {
      return [];
    }
    var v = util.valDataConverted(coll[0]);
    return v.toString();
  };
  defineTimeConverter("FP_Date");
  defineTimeConverter("FP_DateTime");
  defineTimeConverter("FP_Time");
  var trueStrings = ["true", "t", "yes", "y", "1", "1.0"].reduce((acc, val) => {
    acc[val] = true;
    return acc;
  }, {});
  var falseStrings = ["false", "f", "no", "n", "0", "0.0"].reduce((acc, val) => {
    acc[val] = true;
    return acc;
  }, {});
  engine.toBoolean = function(coll) {
    if (coll.length !== 1) {
      return [];
    }
    const v = util.valData(coll[0]);
    switch (typeof v) {
      case "boolean":
        return v;
      case "number":
        if (v === 1) {
          return true;
        }
        if (v === 0) {
          return false;
        }
        break;
      case "string":
        const lowerCaseValue = v.toLowerCase();
        if (trueStrings[lowerCaseValue]) {
          return true;
        }
        if (falseStrings[lowerCaseValue]) {
          return false;
        }
    }
    return [];
  };
  engine.createConvertsToFn = function(toFunction, type) {
    if (typeof type === "string") {
      return function(coll) {
        if (coll.length !== 1) {
          return [];
        }
        return typeof toFunction(coll) === type;
      };
    }
    return function(coll) {
      if (coll.length !== 1) {
        return [];
      }
      return toFunction(coll) instanceof type;
    };
  };
  var singletonEvalByType = {
    Integer: function(coll) {
      const d = util.valData(coll[0]);
      if (Number.isInteger(d)) {
        return d;
      }
    },
    Boolean: function(coll) {
      const d = util.valData(coll[0]);
      if (d === true || d === false) {
        return d;
      } else if (coll.length === 1) {
        return true;
      }
    },
    Number: function(coll) {
      const d = util.valData(coll[0]);
      if (typeof d === "number") {
        return d;
      }
    },
    String: function(coll) {
      const d = util.valData(coll[0]);
      if (typeof d === "string") {
        return d;
      }
    }
  };
  engine.singleton = function(coll, type) {
    if (coll.length > 1) {
      throw new Error("Unexpected collection" + JSON.stringify(coll) + "; expected singleton of type " + type);
    } else if (coll.length === 0) {
      return [];
    }
    const toSingleton = singletonEvalByType[type];
    if (toSingleton) {
      const value = toSingleton(coll);
      if (value !== undefined) {
        return value;
      }
      throw new Error(`Expected ${type.toLowerCase()}, but got: ${JSON.stringify(coll)}`);
    }
    throw new Error("Not supported type " + type);
  };
  var fhirPrimitives = new Set([
    "instant",
    "time",
    "date",
    "dateTime",
    "base64Binary",
    "decimal",
    "integer64",
    "boolean",
    "string",
    "code",
    "markdown",
    "id",
    "integer",
    "unsignedInt",
    "positiveInt",
    "uri",
    "oid",
    "uuid",
    "canonical",
    "url"
  ]);
  engine.hasValueFn = function(coll) {
    let model = this.model;
    if (coll.length === 1) {
      if (model) {
        return [fhirPrimitives.has(coll[0].path)];
      } else {
        return [isPrimitiveDefault(util.valData(coll[0]))];
      }
    } else {
      return [false];
    }
  };
  module.exports = engine;
});

// src/existence.js
var require_existence = __commonJS((exports, module) => {
  var subsetOf = function(coll1, coll2) {
    const coll1Length = coll1.length;
    let rtn = coll1Length <= coll2.length;
    if (rtn && coll1Length) {
      const c2Hash = coll2.reduce((hash, item) => {
        hash[hashObject(item)] = true;
        return hash;
      }, {});
      rtn = !coll1.some((item) => !c2Hash[hashObject(item)]);
    }
    return rtn;
  };
  var util = require_utilities();
  var { whereMacro, distinctFn } = require_filtering();
  var misc = require_misc();
  var hashObject = require_hash_object();
  var engine = {};
  engine.emptyFn = util.isEmpty;
  engine.notFn = function(coll) {
    let d = misc.singleton(coll, "Boolean");
    return typeof d === "boolean" ? !d : [];
  };
  engine.existsMacro = function(coll, expr) {
    var vec = coll;
    if (expr) {
      return engine.existsMacro(whereMacro(coll, expr));
    }
    return !util.isEmpty(vec);
  };
  engine.allMacro = function(coll, expr) {
    for (let i = 0, len = coll.length;i < len; ++i) {
      this.$index = i;
      if (!util.isTrue(expr(coll[i]))) {
        return [false];
      }
    }
    return [true];
  };
  engine.allTrueFn = function(x) {
    let rtn = true;
    for (let i = 0, len = x.length;i < len && rtn; ++i) {
      let xi = util.assertType(x[i], ["boolean"], "allTrue");
      rtn = xi === true;
    }
    return [rtn];
  };
  engine.anyTrueFn = function(x) {
    let rtn = false;
    for (let i = 0, len = x.length;i < len && !rtn; ++i) {
      let xi = util.assertType(x[i], ["boolean"], "anyTrue");
      rtn = xi === true;
    }
    return [rtn];
  };
  engine.allFalseFn = function(x) {
    let rtn = true;
    for (let i = 0, len = x.length;i < len && rtn; ++i) {
      let xi = util.assertType(x[i], ["boolean"], "allFalse");
      rtn = xi === false;
    }
    return [rtn];
  };
  engine.anyFalseFn = function(x) {
    let rtn = false;
    for (let i = 0, len = x.length;i < len && !rtn; ++i) {
      let xi = util.assertType(x[i], ["boolean"], "anyFalse");
      rtn = xi === false;
    }
    return [rtn];
  };
  engine.subsetOfFn = function(coll1, coll2) {
    return [subsetOf(coll1, coll2)];
  };
  engine.supersetOfFn = function(coll1, coll2) {
    return [subsetOf(coll2, coll1)];
  };
  engine.isDistinctFn = function(x) {
    return [x.length === distinctFn(x).length];
  };
  module.exports = engine;
});

// src/math.js
var require_math = __commonJS((exports, module) => {
  var ensureNumberSingleton = function(x) {
    let d = util.valData(x);
    if (typeof d !== "number") {
      if (d.length == 1 && typeof (d = util.valData(d[0])) === "number") {
        return d;
      } else {
        throw new Error("Expected number, but got " + JSON.stringify(d || x));
      }
    } else
      return d;
  };
  var isEmpty = function(x) {
    if (typeof x == "number") {
      return false;
    }
    return x.length == 0;
  };
  var types = require_types();
  var { FP_TimeBase, FP_Quantity } = types;
  var util = require_utilities();
  var engine = {};
  engine.amp = function(x, y) {
    return (x || "") + (y || "");
  };
  engine.plus = function(xs, ys) {
    if (xs.length == 1 && ys.length == 1) {
      var x = util.valDataConverted(xs[0]);
      var y = util.valDataConverted(ys[0]);
      if (typeof x == "string" && typeof y == "string") {
        return x + y;
      }
      if (typeof x == "number" && typeof y == "number") {
        return x + y;
      }
      if (x instanceof FP_TimeBase && y instanceof FP_Quantity) {
        return x.plus(y);
      }
    }
    throw new Error("Cannot " + JSON.stringify(xs) + " + " + JSON.stringify(ys));
  };
  engine.minus = function(xs, ys) {
    if (xs.length == 1 && ys.length == 1) {
      var x = util.valDataConverted(xs[0]);
      var y = util.valDataConverted(ys[0]);
      if (typeof x == "number" && typeof y == "number")
        return x - y;
      if (x instanceof FP_TimeBase && y instanceof FP_Quantity)
        return x.plus(new FP_Quantity(-y.value, y.unit));
    }
    throw new Error("Cannot " + JSON.stringify(xs) + " - " + JSON.stringify(ys));
  };
  engine.mul = function(x, y) {
    return x * y;
  };
  engine.div = function(x, y) {
    if (y === 0)
      return [];
    return x / y;
  };
  engine.intdiv = function(x, y) {
    if (y === 0)
      return [];
    return Math.floor(x / y);
  };
  engine.mod = function(x, y) {
    if (y === 0)
      return [];
    return x % y;
  };
  engine.abs = function(x) {
    if (isEmpty(x)) {
      return [];
    } else {
      let num = ensureNumberSingleton(x);
      return Math.abs(num);
    }
  };
  engine.ceiling = function(x) {
    if (isEmpty(x)) {
      return [];
    } else {
      let num = ensureNumberSingleton(x);
      return Math.ceil(num);
    }
  };
  engine.exp = function(x) {
    if (isEmpty(x)) {
      return [];
    } else {
      let num = ensureNumberSingleton(x);
      return Math.exp(num);
    }
  };
  engine.floor = function(x) {
    if (isEmpty(x)) {
      return [];
    } else {
      let num = ensureNumberSingleton(x);
      return Math.floor(num);
    }
  };
  engine.ln = function(x) {
    if (isEmpty(x)) {
      return [];
    } else {
      let num = ensureNumberSingleton(x);
      return Math.log(num);
    }
  };
  engine.log = function(x, base) {
    if (isEmpty(x) || isEmpty(base)) {
      return [];
    } else {
      let num = ensureNumberSingleton(x);
      let num2 = ensureNumberSingleton(base);
      return Math.log(num) / Math.log(num2);
    }
  };
  engine.power = function(x, degree) {
    if (isEmpty(x) || isEmpty(degree)) {
      return [];
    } else {
      let num = ensureNumberSingleton(x);
      let num2 = ensureNumberSingleton(degree);
      if (num < 0 && Math.floor(num2) != num2) {
        return [];
      } else {
        return Math.pow(num, num2);
      }
    }
  };
  engine.round = function(x, acc) {
    if (isEmpty(x)) {
      return [];
    } else {
      let num = ensureNumberSingleton(x);
      if (isEmpty(acc)) {
        return Math.round(num);
      } else {
        let num2 = ensureNumberSingleton(acc);
        let degree = Math.pow(10, num2);
        return Math.round(num * degree) / degree;
      }
    }
  };
  engine.sqrt = function(x) {
    if (isEmpty(x)) {
      return [];
    } else {
      let num = ensureNumberSingleton(x);
      if (num < 0) {
        return [];
      } else {
        return Math.sqrt(num);
      }
    }
  };
  engine.truncate = function(x) {
    if (isEmpty(x)) {
      return [];
    } else {
      let num = ensureNumberSingleton(x);
      return Math.trunc(num);
    }
  };
  module.exports = engine;
});

// src/deep-equal.js
var require_deep_equal = __commonJS((exports, module) => {
  var isString = function(myVar) {
    return typeof myVar === "string" || myVar instanceof String;
  };
  var isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };
  var normalizeStr = function(x) {
    return x.toUpperCase().replace(/\s+/, " ");
  };
  var deepEqual = function(actual, expected, opts) {
    actual = util.valDataConverted(actual);
    expected = util.valDataConverted(expected);
    if (!opts)
      opts = {};
    if (actual === expected) {
      return true;
    }
    if (opts.fuzzy) {
      if (isString(actual) && isString(expected)) {
        return normalizeStr(actual) == normalizeStr(expected);
      }
      if (isNumber(actual) && isNumber(expected)) {
        return numbers.isEquivalent(actual, expected);
      }
    } else {
      if (typeof actual === "number" && typeof expected === "number") {
        return numbers.isEqual(actual, expected);
      }
    }
    if (actual instanceof Date && expected instanceof Date) {
      return actual.getTime() === expected.getTime();
    } else if (!actual || !expected || typeof actual != "object" && typeof expected != "object") {
      return actual === expected;
    } else {
      var actualIsFPT = actual instanceof FP_Type;
      var expectedIsFPT = expected instanceof FP_Type;
      if (actualIsFPT && expectedIsFPT) {
        return opts.fuzzy ? actual.equivalentTo(expected) : actual.equals(expected);
      } else if (actualIsFPT || expectedIsFPT) {
        return false;
      }
      return objEquiv(actual, expected, opts);
    }
  };
  var isUndefinedOrNull = function(value) {
    return value === null || value === undefined;
  };
  var objEquiv = function(a, b, opts) {
    var i, key;
    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
      return false;
    if (a.prototype !== b.prototype)
      return false;
    if (isArguments(a) || isArguments(b)) {
      a = isArguments(a) ? pSlice.call(a) : a;
      b = isArguments(b) ? pSlice.call(b) : b;
      return deepEqual(a, b, opts);
    }
    try {
      var ka = objectKeys(a), kb = objectKeys(b);
    } catch (e) {
      return false;
    }
    if (ka.length != kb.length)
      return false;
    ka.sort();
    kb.sort();
    for (i = ka.length - 1;i >= 0; i--) {
      if (ka[i] != kb[i])
        return false;
    }
    if (ka.length === 1) {
      key = ka[0];
      return deepEqual(a[key], b[key], opts);
    }
    for (i = ka.length - 1;i >= 0; i--) {
      key = ka[i];
      if (!deepEqual(a[key], b[key], opts))
        return false;
    }
    return typeof a === typeof b;
  };
  var types = require_types();
  var FP_Type = types.FP_Type;
  var util = require_utilities();
  var numbers = require_numbers();
  var pSlice = Array.prototype.slice;
  var objectKeys = Object.keys;
  var isArguments = function(object) {
    return Object.prototype.toString.call(object) == "[object Arguments]";
  };
  module.exports = deepEqual;
});

// src/equality.js
var require_equality = __commonJS((exports, module) => {
  var equality = function(x, y) {
    if (util.isEmpty(x) || util.isEmpty(y)) {
      return [];
    }
    return deepEqual(x, y);
  };
  var equivalence = function(x, y) {
    if (util.isEmpty(x) && util.isEmpty(y)) {
      return [true];
    }
    if (util.isEmpty(x) || util.isEmpty(y)) {
      return [];
    }
    return deepEqual(x, y, { fuzzy: true });
  };
  var typecheck = function(a, b) {
    util.assertAtMostOne(a, "Singleton was expected");
    util.assertAtMostOne(b, "Singleton was expected");
    a = util.valDataConverted(a[0]);
    b = util.valDataConverted(b[0]);
    let lClass = a.constructor === FP_Date ? FP_DateTime : a.constructor;
    let rClass = b.constructor === FP_Date ? FP_DateTime : b.constructor;
    if (lClass !== rClass) {
      util.raiseError('Type of "' + a + '" (' + lClass.name + ') did not match type of "' + b + '" (' + rClass.name + ")", "InequalityExpression");
    }
    return [a, b];
  };
  var util = require_utilities();
  var deepEqual = require_deep_equal();
  var types = require_types();
  var FP_Type = types.FP_Type;
  var FP_Date = types.FP_Date;
  var FP_DateTime = types.FP_DateTime;
  var engine = {};
  engine.equal = function(a, b) {
    return equality(a, b);
  };
  engine.unequal = function(a, b) {
    var eq = equality(a, b);
    return eq === undefined ? undefined : !eq;
  };
  engine.equival = function(a, b) {
    return equivalence(a, b);
  };
  engine.unequival = function(a, b) {
    return !equivalence(a, b);
  };
  engine.lt = function(a, b) {
    if (!a.length || !b.length)
      return [];
    const [a0, b0] = typecheck(a, b);
    if (a0 instanceof FP_Type) {
      const compare = a0.compare(b0);
      return compare === null ? [] : compare < 0;
    }
    return a0 < b0;
  };
  engine.gt = function(a, b) {
    if (!a.length || !b.length)
      return [];
    const [a0, b0] = typecheck(a, b);
    if (a0 instanceof FP_Type) {
      const compare = a0.compare(b0);
      return compare === null ? [] : compare > 0;
    }
    return a0 > b0;
  };
  engine.lte = function(a, b) {
    if (!a.length || !b.length)
      return [];
    const [a0, b0] = typecheck(a, b);
    if (a0 instanceof FP_Type) {
      const compare = a0.compare(b0);
      return compare === null ? [] : compare <= 0;
    }
    return a0 <= b0;
  };
  engine.gte = function(a, b) {
    if (!a.length || !b.length)
      return [];
    const [a0, b0] = typecheck(a, b);
    if (a0 instanceof FP_Type) {
      const compare = a0.compare(b0);
      return compare === null ? [] : compare >= 0;
    }
    return a0 >= b0;
  };
  module.exports = engine;
});

// src/aggregate.js
var require_aggregate = __commonJS((exports, module) => {
  var engine = {};
  var math = require_math();
  var equality = require_equality();
  var util = require_utilities();
  engine.aggregateMacro = function(data, expr, initialValue) {
    return data.reduce((total, x, i) => {
      this.$index = i;
      return this.$total = expr(x);
    }, this.$total = initialValue);
  };
  engine.countFn = function(x) {
    if (x && x.length) {
      return x.length;
    } else {
      return 0;
    }
  };
  engine.sumFn = function(data) {
    return engine.aggregateMacro.apply(this, [data, ($this) => {
      return math.plus(util.arraify($this), util.arraify(this.$total));
    }, 0]);
  };
  engine.minFn = function(data) {
    return engine.aggregateMacro.apply(this, [data, (curr) => {
      const $this = util.arraify(curr);
      const $total = util.arraify(this.$total);
      return util.isEmpty($total) ? $this : equality.lt($this, $total) ? $this : $total;
    }]);
  };
  engine.maxFn = function(data) {
    return engine.aggregateMacro.apply(this, [data, (curr) => {
      const $this = util.arraify(curr);
      const $total = util.arraify(this.$total);
      return util.isEmpty($total) ? $this : equality.gt($this, $total) ? $this : $total;
    }]);
  };
  engine.avgFn = function(data) {
    return math.div(engine.sumFn(data), engine.countFn(data));
  };
  module.exports = engine;
});

// src/combining.js
var require_combining = __commonJS((exports, module) => {
  var combineFns = {};
  var { distinctFn } = require_filtering();
  var hashObject = require_hash_object();
  combineFns.union = function(coll1, coll2) {
    return distinctFn(coll1.concat(coll2));
  };
  combineFns.combineFn = function(coll1, coll2) {
    return coll1.concat(coll2);
  };
  combineFns.intersect = function(coll1, coll2) {
    let result = [];
    const coll1Length = coll1.length;
    let uncheckedLength = coll2.length;
    if (coll1Length && uncheckedLength) {
      let coll2hash = {};
      coll2.forEach((item) => {
        const hash = hashObject(item);
        if (coll2hash[hash]) {
          uncheckedLength--;
        } else {
          coll2hash[hash] = true;
        }
      });
      for (let i = 0;i < coll1Length && uncheckedLength > 0; ++i) {
        let item = coll1[i];
        let hash = hashObject(item);
        if (coll2hash[hash]) {
          result.push(item);
          coll2hash[hash] = false;
          uncheckedLength--;
        }
      }
    }
    return result;
  };
  module.exports = combineFns;
});

// src/collections.js
var require_collections = __commonJS((exports, module) => {
  var containsImpl = function(a, b) {
    if (b.length == 0) {
      return true;
    }
    for (var i = 0;i < a.length; i++) {
      if (deepEqual(a[i], b[0])) {
        return true;
      }
    }
    return false;
  };
  var deepEqual = require_deep_equal();
  var engine = {};
  engine.contains = function(a, b) {
    if (b.length == 0) {
      return [];
    }
    if (a.length == 0) {
      return false;
    }
    if (b.length > 1) {
      throw new Error("Expected singleton on right side of contains, got " + JSON.stringify(b));
    }
    return containsImpl(a, b);
  };
  engine.in = function(a, b) {
    if (a.length == 0) {
      return [];
    }
    if (b.length == 0) {
      return false;
    }
    if (a.length > 1) {
      throw new Error("Expected singleton on right side of in, got " + JSON.stringify(b));
    }
    return containsImpl(b, a);
  };
  module.exports = engine;
});

// src/strings.js
var require_strings = __commonJS((exports, module) => {
  var rewritePatternForDotAll = function(pattern) {
    if (!cachedRegExp[pattern]) {
      cachedRegExp[pattern] = pattern.replace(/\./g, (_, offset, entirePattern) => {
        const precedingPart = entirePattern.substr(0, offset);
        const cleanPrecedingPart = precedingPart.replace(/\\\\/g, "").replace(/\\[\][]/g, "");
        const escaped = cleanPrecedingPart[cleanPrecedingPart.length - 1] === "\\";
        const lastIndexOfOpenBracket = cleanPrecedingPart.lastIndexOf("[");
        const lastIndexOfCloseBracket = cleanPrecedingPart.lastIndexOf("]");
        return escaped || lastIndexOfOpenBracket > lastIndexOfCloseBracket ? "." : "[^]";
      });
    }
    return cachedRegExp[pattern];
  };
  var util = require_utilities();
  var misc = require_misc();
  var engine = {};
  var cachedRegExp = {};
  engine.indexOf = function(coll, substr) {
    const str = misc.singleton(coll, "String");
    return util.isEmpty(substr) || util.isEmpty(str) ? [] : str.indexOf(substr);
  };
  engine.substring = function(coll, start, length) {
    const str = misc.singleton(coll, "String");
    if (util.isEmpty(str) || util.isEmpty(start) || start < 0 || start >= str.length) {
      return [];
    }
    if (length === undefined || util.isEmpty(length)) {
      return str.substring(start);
    }
    return str.substring(start, start + length);
  };
  engine.startsWith = function(coll, prefix) {
    const str = misc.singleton(coll, "String");
    return util.isEmpty(prefix) || util.isEmpty(str) ? [] : str.startsWith(prefix);
  };
  engine.endsWith = function(coll, postfix) {
    const str = misc.singleton(coll, "String");
    return util.isEmpty(postfix) || util.isEmpty(str) ? [] : str.endsWith(postfix);
  };
  engine.containsFn = function(coll, substr) {
    const str = misc.singleton(coll, "String");
    return util.isEmpty(substr) || util.isEmpty(str) ? [] : str.includes(substr);
  };
  engine.upper = function(coll) {
    const str = misc.singleton(coll, "String");
    return util.isEmpty(str) ? [] : str.toUpperCase();
  };
  engine.lower = function(coll) {
    const str = misc.singleton(coll, "String");
    return util.isEmpty(str) ? [] : str.toLowerCase();
  };
  engine.joinFn = function(coll, separator) {
    const stringValues = coll.map((n) => {
      const d = util.valData(n);
      if (typeof d === "string") {
        return d;
      }
      throw new Error("Join requires a collection of strings.");
    });
    if (separator === undefined) {
      separator = "";
    }
    return stringValues.join(separator);
  };
  engine.splitFn = function(coll, separator) {
    const strToSplit = misc.singleton(coll, "String");
    return util.isEmpty(strToSplit) ? [] : strToSplit.split(separator);
  };
  engine.trimFn = function(coll) {
    const strToTrim = misc.singleton(coll, "String");
    return util.isEmpty(strToTrim) ? [] : strToTrim.trim();
  };
  engine.encodeFn = function(coll, format) {
    const strToEncode = misc.singleton(coll, "String");
    if (util.isEmpty(strToEncode)) {
      return [];
    }
    if (format === "urlbase64" || format === "base64url") {
      return btoa(strToEncode).replace(/\+/g, "-").replace(/\//g, "_");
    }
    if (format === "base64") {
      return btoa(strToEncode);
    }
    if (format === "hex") {
      return Array.from(strToEncode).map((c) => c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) : encodeURIComponent(c).replace(/%/g, "")).join("");
    }
    return [];
  };
  engine.decodeFn = function(coll, format) {
    const strDecode = misc.singleton(coll, "String");
    if (util.isEmpty(strDecode)) {
      return [];
    }
    if (format === "urlbase64" || format === "base64url") {
      return atob(strDecode.replace(/-/g, "+").replace(/_/g, "/"));
    }
    if (format === "base64") {
      return atob(strDecode);
    }
    if (format === "hex") {
      if (strDecode.length % 2 !== 0) {
        throw new Error("Decode \'hex\' requires an even number of characters.");
      }
      return decodeURIComponent("%" + strDecode.match(/.{2}/g).join("%"));
    }
    return [];
  };
  var dotAllIsSupported = new RegExp("").dotAll === false;
  if (dotAllIsSupported) {
    engine.matches = function(coll, regex) {
      const str = misc.singleton(coll, "String");
      if (util.isEmpty(regex) || util.isEmpty(str)) {
        return [];
      }
      const reg = new RegExp(regex, "s");
      return reg.test(str);
    };
  } else {
    engine.matches = function(coll, regex) {
      const str = misc.singleton(coll, "String");
      if (util.isEmpty(regex) || util.isEmpty(str)) {
        return [];
      }
      const reg = new RegExp(rewritePatternForDotAll(regex));
      return reg.test(str);
    };
  }
  engine.replace = function(coll, pattern, repl) {
    const str = misc.singleton(coll, "String");
    if (util.isEmpty(pattern) || util.isEmpty(repl) || util.isEmpty(str)) {
      return [];
    }
    const reg = new RegExp(util.escapeStringForRegExp(pattern), "g");
    return str.replace(reg, repl);
  };
  engine.replaceMatches = function(coll, regex, repl) {
    const str = misc.singleton(coll, "String");
    if (util.isEmpty(regex) || util.isEmpty(repl) || util.isEmpty(str)) {
      return [];
    }
    const reg = new RegExp(regex, "g");
    return str.replace(reg, repl);
  };
  engine.length = function(coll) {
    const str = misc.singleton(coll, "String");
    return util.isEmpty(str) ? [] : str.length;
  };
  engine.toChars = function(coll) {
    const str = misc.singleton(coll, "String");
    return util.isEmpty(str) ? [] : str.split("");
  };
  module.exports = engine;
});

// src/navigation.js
var require_navigation = __commonJS((exports, module) => {
  var util = require_utilities();
  var { ResourceNode } = require_types();
  var makeResNode = ResourceNode.makeResNode;
  var engine = {};
  engine.children = function(coll) {
    let model = this.model;
    return coll.reduce(function(acc, x) {
      let d = util.valData(x);
      x = makeResNode(x);
      if (typeof d === "object") {
        for (var prop of Object.keys(d)) {
          var v = d[prop];
          var childPath = x.path + "." + prop;
          if (model) {
            let defPath = model.pathsDefinedElsewhere[childPath];
            if (defPath)
              childPath = defPath;
          }
          if (Array.isArray(v)) {
            acc.push.apply(acc, v.map((n) => makeResNode(n, childPath)));
          } else {
            acc.push(makeResNode(v, childPath));
          }
        }
        return acc;
      } else {
        return acc;
      }
    }, []);
  };
  engine.descendants = function(coll) {
    var ch = engine.children.call(this, coll);
    var res = [];
    while (ch.length > 0) {
      res.push.apply(res, ch);
      ch = engine.children.call(this, ch);
    }
    return res;
  };
  module.exports = engine;
});

// src/datetime.js
var require_datetime = __commonJS((exports, module) => {
  var engine = {};
  var types = require_types();
  var constants = require_constants();
  var FP_Date = types.FP_Date;
  var FP_DateTime = types.FP_DateTime;
  var FP_Time = types.FP_Time;
  engine.now = function() {
    if (!constants.now) {
      var now = constants.nowDate;
      var isoStr = FP_DateTime.isoDateTime(now);
      constants.now = new FP_DateTime(isoStr);
    }
    return constants.now;
  };
  engine.today = function() {
    if (!constants.today) {
      var now = constants.nowDate;
      var isoStr = FP_Date.isoDate(now);
      constants.today = new FP_Date(isoStr);
    }
    return constants.today;
  };
  engine.timeOfDay = function() {
    if (!constants.timeOfDay) {
      const now = constants.nowDate;
      const isoStr = FP_DateTime.isoTime(now);
      constants.timeOfDay = new FP_Time(isoStr);
    }
    return constants.timeOfDay;
  };
  module.exports = engine;
});

// src/logic.js
var require_logic = __commonJS((exports, module) => {
  var engine = {};
  engine.orOp = function(a, b) {
    if (Array.isArray(b)) {
      if (a === true) {
        return true;
      } else if (a === false) {
        return [];
      } else if (Array.isArray(a)) {
        return [];
      }
    }
    if (Array.isArray(a)) {
      if (b === true) {
        return true;
      } else {
        return [];
      }
    }
    return a || b;
  };
  engine.andOp = function(a, b) {
    if (Array.isArray(b)) {
      if (a === true) {
        return [];
      } else if (a === false) {
        return false;
      } else if (Array.isArray(a)) {
        return [];
      }
    }
    if (Array.isArray(a)) {
      if (b === true) {
        return [];
      } else {
        return false;
      }
    }
    return a && b;
  };
  engine.xorOp = function(a, b) {
    if (Array.isArray(a) || Array.isArray(b))
      return [];
    return a && !b || !a && b;
  };
  engine.impliesOp = function(a, b) {
    if (Array.isArray(b)) {
      if (a === true) {
        return [];
      } else if (a === false) {
        return true;
      } else if (Array.isArray(a)) {
        return [];
      }
    }
    if (Array.isArray(a)) {
      if (b === true) {
        return true;
      } else {
        return [];
      }
    }
    if (a === false) {
      return true;
    }
    return a && b;
  };
  module.exports = engine;
});

// src/fhirpath.js
var require_fhirpath = __commonJS((exports, module) => {
  var makeParam = function(ctx, parentData, type, param) {
    if (type === "Expr") {
      return function(data) {
        const $this = util.arraify(data);
        return engine.doEval({ ...ctx, $this }, $this, param);
      };
    }
    if (type === "AnyAtRoot") {
      const $this = ctx.$this || ctx.dataRoot;
      return engine.doEval({ ...ctx, $this }, $this, param);
    }
    if (type === "Identifier") {
      if (param.type === "TermExpression") {
        return param.text;
      } else {
        throw new Error("Expected identifier node, got " + JSON.stringify(param));
      }
    }
    if (type === "TypeSpecifier") {
      return engine.TypeSpecifier(ctx, parentData, param);
    }
    const res = engine.doEval(ctx, parentData, param);
    if (type === "Any") {
      return res;
    }
    if (Array.isArray(type)) {
      if (res.length === 0) {
        return [];
      } else {
        type = type[0];
      }
    }
    return misc.singleton(res, type);
  };
  var doInvoke = function(ctx, fnName, data, rawParams) {
    var invoc = engine.invocationTable[fnName];
    if (ctx?.vars?._fns?.[fnName[0]]) {
      invoc = {
        fn: function(...args) {
          return ctx.vars._fns[fnName[0]].apply(this, args.map((a, i2) => i2 === 0 ? a : a[0]));
        },
        ...rawParams?.length ? {
          arity: {
            [rawParams?.length || 0]: Array(rawParams?.length || 0).fill("Any")
          }
        } : {}
      };
    }
    var res;
    if (invoc) {
      if (!invoc.arity) {
        if (!rawParams) {
          res = invoc.fn.call(ctx, util.arraify(data));
          return util.arraify(res);
        } else {
          throw new Error(fnName + " expects no params");
        }
      } else {
        var paramsNumber = rawParams ? rawParams.length : 0;
        var argTypes = invoc.arity[paramsNumber];
        if (argTypes) {
          var params = [];
          for (var i = 0;i < paramsNumber; i++) {
            var tp = argTypes[i];
            var pr = rawParams[i];
            params.push(makeParam(ctx, data, tp, pr));
          }
          params.unshift(data);
          if (invoc.nullable) {
            if (params.some(isNullable)) {
              return [];
            }
          }
          res = invoc.fn.apply(ctx, params);
          return util.arraify(res);
        } else {
          console.log(fnName + " wrong arity: got " + paramsNumber);
          return [];
        }
      }
    } else {
      throw new Error("Not implemented: " + fnName);
    }
  };
  var isNullable = function(x) {
    return x === null || x === undefined || util.isEmpty(x);
  };
  var infixInvoke = function(ctx, fnName, data, rawParams) {
    var invoc = engine.invocationTable[fnName];
    if (invoc && invoc.fn) {
      var paramsNumber = rawParams ? rawParams.length : 0;
      if (paramsNumber !== 2) {
        throw new Error("Infix invoke should have arity 2");
      }
      var argTypes = invoc.arity[paramsNumber];
      if (argTypes) {
        var params = [];
        for (var i = 0;i < paramsNumber; i++) {
          var tp = argTypes[i];
          var pr = rawParams[i];
          params.push(makeParam(ctx, data, tp, pr));
        }
        if (invoc.nullable) {
          if (params.some(isNullable)) {
            return [];
          }
        }
        var res = invoc.fn.apply(ctx, params);
        return util.arraify(res);
      } else {
        console.log(fnName + " wrong arity: got " + paramsNumber);
        return [];
      }
    } else {
      throw new Error("Not impl " + fnName);
    }
  };
  var parse = function(path) {
    return parser.parse(path);
  };
  var applyParsedPath = function(resource, parsedPath, context, model, options) {
    constants.reset();
    let dataRoot = util.arraify(resource).map((i) => i?.__path__ ? makeResNode(i, i?.__path__) : i);
    let vars = { context: dataRoot, ucum: "http://unitsofmeasure.org" };
    if (context) {
      context = Object.keys(context).reduce((restoredContext, key) => {
        if (Array.isArray(context[key])) {
          restoredContext[key] = context[key].map((i) => i?.__path__ ? makeResNode(i, i.__path__) : i);
        } else {
          restoredContext[key] = context[key]?.__path__ ? makeResNode(context[key], context[key].__path__) : context[key];
        }
        return restoredContext;
      }, {});
    }
    let ctx = { dataRoot, vars: Object.assign(vars, context), model };
    if (options && options.traceFn) {
      ctx.customTraceFn = options.traceFn;
    }
    return engine.doEval(ctx, dataRoot, parsedPath.children[0]).map((n) => {
      let path = n instanceof ResourceNode ? n.path : null;
      n = util.valData(n);
      if (n instanceof FP_Type) {
        if (options.resolveInternalTypes) {
          n = n.toString();
        }
      }
      if (path && typeof n === "object") {
        Object.defineProperty(n, "__path__", { value: path });
      }
      return n;
    });
  };
  var resolveInternalTypes = function(val) {
    if (Array.isArray(val)) {
      for (let i = 0, len = val.length;i < len; ++i)
        val[i] = resolveInternalTypes(val[i]);
    } else if (val instanceof FP_Type) {
      val = val.toString();
    } else if (typeof val === "object") {
      for (let k of Object.keys(val))
        val[k] = resolveInternalTypes(val[k]);
    }
    return val;
  };
  var evaluate = function(fhirData, path, context, model, options) {
    return compile(path, model, options)(fhirData, context);
  };
  var compile = function(path, model, options) {
    options = {
      resolveInternalTypes: true,
      ...options
    };
    if (typeof path === "object") {
      const node = parse(path.expression);
      return function(fhirData, context) {
        const resource = path.base ? makeResNode(fhirData, path.base) : fhirData;
        TypeInfo.model = model;
        return applyParsedPath(resource, node, context, model, options);
      };
    } else {
      const node = parse(path);
      return function(fhirData, context) {
        TypeInfo.model = model;
        return applyParsedPath(fhirData, node, context, model, options);
      };
    }
  };
  var typesFn = function(fhirpathResult) {
    return util.arraify(fhirpathResult).map((value) => {
      const ti = TypeInfo.fromValue(value?.__path__ ? new ResourceNode(value, value.__path__) : value);
      return `${ti.namespace}.${ti.name}`;
    });
  };
  var { version } = require_package();
  var parser = require_parser();
  var util = require_utilities();
  init_polyfill();
  var constants = require_constants();
  var engine = {};
  var existence = require_existence();
  var filtering = require_filtering();
  var aggregate = require_aggregate();
  var combining = require_combining();
  var misc = require_misc();
  var equality = require_equality();
  var collections = require_collections();
  var math = require_math();
  var strings = require_strings();
  var navigation = require_navigation();
  var datetime = require_datetime();
  var logic = require_logic();
  var types = require_types();
  var {
    FP_Date,
    FP_DateTime,
    FP_Time,
    FP_Quantity,
    FP_Type,
    ResourceNode,
    TypeInfo
  } = types;
  var makeResNode = ResourceNode.makeResNode;
  engine.invocationTable = {
    empty: { fn: existence.emptyFn },
    not: { fn: existence.notFn },
    exists: { fn: existence.existsMacro, arity: { 0: [], 1: ["Expr"] } },
    all: { fn: existence.allMacro, arity: { 1: ["Expr"] } },
    allTrue: { fn: existence.allTrueFn },
    anyTrue: { fn: existence.anyTrueFn },
    allFalse: { fn: existence.allFalseFn },
    anyFalse: { fn: existence.anyFalseFn },
    subsetOf: { fn: existence.subsetOfFn, arity: { 1: ["AnyAtRoot"] } },
    supersetOf: { fn: existence.supersetOfFn, arity: { 1: ["AnyAtRoot"] } },
    isDistinct: { fn: existence.isDistinctFn },
    distinct: { fn: filtering.distinctFn },
    count: { fn: aggregate.countFn },
    where: { fn: filtering.whereMacro, arity: { 1: ["Expr"] } },
    extension: { fn: filtering.extension, arity: { 1: ["String"] } },
    select: { fn: filtering.selectMacro, arity: { 1: ["Expr"] } },
    aggregate: { fn: aggregate.aggregateMacro, arity: { 1: ["Expr"], 2: ["Expr", "Any"] } },
    sum: { fn: aggregate.sumFn },
    min: { fn: aggregate.minFn },
    max: { fn: aggregate.maxFn },
    avg: { fn: aggregate.avgFn },
    single: { fn: filtering.singleFn },
    first: { fn: filtering.firstFn },
    last: { fn: filtering.lastFn },
    type: { fn: types.typeFn, arity: { 0: [] } },
    ofType: { fn: filtering.ofTypeFn, arity: { 1: ["TypeSpecifier"] } },
    is: { fn: types.isFn, arity: { 1: ["TypeSpecifier"] } },
    as: { fn: types.asFn, arity: { 1: ["TypeSpecifier"] } },
    tail: { fn: filtering.tailFn },
    take: { fn: filtering.takeFn, arity: { 1: ["Integer"] } },
    skip: { fn: filtering.skipFn, arity: { 1: ["Integer"] } },
    combine: { fn: combining.combineFn, arity: { 1: ["AnyAtRoot"] } },
    union: { fn: combining.union, arity: { 1: ["AnyAtRoot"] } },
    intersect: { fn: combining.intersect, arity: { 1: ["AnyAtRoot"] } },
    iif: { fn: misc.iifMacro, arity: { 2: ["Expr", "Expr"], 3: ["Expr", "Expr", "Expr"] } },
    trace: { fn: misc.traceFn, arity: { 1: ["String"], 2: ["String", "Expr"] } },
    toInteger: { fn: misc.toInteger },
    toDecimal: { fn: misc.toDecimal },
    toString: { fn: misc.toString },
    toDate: { fn: misc.toDate },
    toDateTime: { fn: misc.toDateTime },
    toTime: { fn: misc.toTime },
    toBoolean: { fn: misc.toBoolean },
    toQuantity: { fn: misc.toQuantity, arity: { 0: [], 1: ["String"] } },
    hasValue: { fn: misc.hasValueFn },
    convertsToBoolean: { fn: misc.createConvertsToFn(misc.toBoolean, "boolean") },
    convertsToInteger: { fn: misc.createConvertsToFn(misc.toInteger, "number") },
    convertsToDecimal: { fn: misc.createConvertsToFn(misc.toDecimal, "number") },
    convertsToString: { fn: misc.createConvertsToFn(misc.toString, "string") },
    convertsToDate: { fn: misc.createConvertsToFn(misc.toDate, FP_Date) },
    convertsToDateTime: { fn: misc.createConvertsToFn(misc.toDateTime, FP_DateTime) },
    convertsToTime: { fn: misc.createConvertsToFn(misc.toTime, FP_Time) },
    convertsToQuantity: { fn: misc.createConvertsToFn(misc.toQuantity, FP_Quantity) },
    indexOf: { fn: strings.indexOf, arity: { 1: ["String"] } },
    substring: { fn: strings.substring, arity: { 1: ["Integer"], 2: ["Integer", "Integer"] } },
    startsWith: { fn: strings.startsWith, arity: { 1: ["String"] } },
    endsWith: { fn: strings.endsWith, arity: { 1: ["String"] } },
    contains: { fn: strings.containsFn, arity: { 1: ["String"] } },
    upper: { fn: strings.upper },
    lower: { fn: strings.lower },
    replace: { fn: strings.replace, arity: { 2: ["String", "String"] } },
    matches: { fn: strings.matches, arity: { 1: ["String"] } },
    replaceMatches: { fn: strings.replaceMatches, arity: { 2: ["String", "String"] } },
    length: { fn: strings.length },
    toChars: { fn: strings.toChars },
    join: { fn: strings.joinFn, arity: { 0: [], 1: ["String"] } },
    split: { fn: strings.splitFn, arity: { 1: ["String"] } },
    trim: { fn: strings.trimFn },
    encode: { fn: strings.encodeFn, arity: { 1: ["String"] } },
    decode: { fn: strings.decodeFn, arity: { 1: ["String"] } },
    abs: { fn: math.abs },
    ceiling: { fn: math.ceiling },
    exp: { fn: math.exp },
    floor: { fn: math.floor },
    ln: { fn: math.ln },
    log: { fn: math.log, arity: { 1: ["Number"] }, nullable: true },
    power: { fn: math.power, arity: { 1: ["Number"] }, nullable: true },
    round: { fn: math.round, arity: { 1: ["Number"] } },
    sqrt: { fn: math.sqrt },
    truncate: { fn: math.truncate },
    now: { fn: datetime.now },
    today: { fn: datetime.today },
    timeOfDay: { fn: datetime.timeOfDay },
    repeat: { fn: filtering.repeatMacro, arity: { 1: ["Expr"] } },
    children: { fn: navigation.children },
    descendants: { fn: navigation.descendants },
    "|": { fn: combining.union, arity: { 2: ["Any", "Any"] } },
    "=": { fn: equality.equal, arity: { 2: ["Any", "Any"] }, nullable: true },
    "!=": { fn: equality.unequal, arity: { 2: ["Any", "Any"] }, nullable: true },
    "~": { fn: equality.equival, arity: { 2: ["Any", "Any"] } },
    "!~": { fn: equality.unequival, arity: { 2: ["Any", "Any"] } },
    "<": { fn: equality.lt, arity: { 2: ["Any", "Any"] }, nullable: true },
    ">": { fn: equality.gt, arity: { 2: ["Any", "Any"] }, nullable: true },
    "<=": { fn: equality.lte, arity: { 2: ["Any", "Any"] }, nullable: true },
    ">=": { fn: equality.gte, arity: { 2: ["Any", "Any"] }, nullable: true },
    containsOp: { fn: collections.contains, arity: { 2: ["Any", "Any"] } },
    inOp: { fn: collections.in, arity: { 2: ["Any", "Any"] } },
    isOp: { fn: types.isFn, arity: { 2: ["Any", "TypeSpecifier"] } },
    asOp: { fn: types.asFn, arity: { 2: ["Any", "TypeSpecifier"] } },
    "&": { fn: math.amp, arity: { 2: ["String", "String"] } },
    "+": { fn: math.plus, arity: { 2: ["Any", "Any"] }, nullable: true },
    "-": { fn: math.minus, arity: { 2: ["Any", "Any"] }, nullable: true },
    "*": { fn: math.mul, arity: { 2: ["Number", "Number"] }, nullable: true },
    "/": { fn: math.div, arity: { 2: ["Number", "Number"] }, nullable: true },
    mod: { fn: math.mod, arity: { 2: ["Number", "Number"] }, nullable: true },
    div: { fn: math.intdiv, arity: { 2: ["Number", "Number"] }, nullable: true },
    or: { fn: logic.orOp, arity: { 2: [["Boolean"], ["Boolean"]] } },
    and: { fn: logic.andOp, arity: { 2: [["Boolean"], ["Boolean"]] } },
    xor: { fn: logic.xorOp, arity: { 2: [["Boolean"], ["Boolean"]] } },
    implies: { fn: logic.impliesOp, arity: { 2: [["Boolean"], ["Boolean"]] } }
  };
  engine.InvocationExpression = function(ctx, parentData, node) {
    return node.children.reduce(function(acc, ch) {
      return engine.doEval(ctx, acc, ch);
    }, parentData);
  };
  engine.TermExpression = function(ctx, parentData, node) {
    if (parentData) {
      parentData = parentData.map((x) => {
        if (x instanceof Object && x.resourceType) {
          return makeResNode(x, x.resourceType);
        }
        return x;
      });
    }
    return engine.doEval(ctx, parentData, node.children[0]);
  };
  engine.PolarityExpression = function(ctx, parentData, node) {
    var sign = node.terminalNodeText[0];
    var rtn = engine.doEval(ctx, parentData, node.children[0]);
    if (rtn.length !== 1) {
      throw new Error("Unary " + sign + " can only be applied to an individual number.");
    }
    if (typeof rtn[0] != "number" || isNaN(rtn[0]))
      throw new Error("Unary " + sign + " can only be applied to a number.");
    if (sign === "-")
      rtn[0] = -rtn[0];
    return rtn;
  };
  engine.TypeSpecifier = function(ctx, parentData, node) {
    let namespace, name;
    const identifiers = node.text.split(".").map((i) => i.replace(/(^`|`$)/g, ""));
    switch (identifiers.length) {
      case 2:
        [namespace, name] = identifiers;
        break;
      case 1:
        [name] = identifiers;
        break;
      default:
        throw new Error("Expected TypeSpecifier node, got " + JSON.stringify(node));
    }
    return new TypeInfo({ namespace, name });
  };
  engine.ExternalConstantTerm = function(ctx, parentData, node) {
    var extConstant = node.children[0];
    var identifier = extConstant.children[0];
    var varName = engine.Identifier(ctx, parentData, identifier)[0];
    var value = ctx.vars[varName];
    if (!(varName in ctx.vars)) {
      throw new Error("Attempting to access an undefined environment variable: " + varName);
    }
    return value === undefined || value === null ? [] : value instanceof Array ? value : [value];
  };
  engine.LiteralTerm = function(ctx, parentData, node) {
    var term = node.children[0];
    if (term) {
      return engine.doEval(ctx, parentData, term);
    } else {
      return [node.text];
    }
  };
  engine.StringLiteral = function(ctx, parentData, node) {
    var rtn = node.text.replace(/(^'|'$)/g, "");
    rtn = rtn.replace(/\\(u\d{4}|.)/g, function(match, submatch) {
      switch (match) {
        case "\\r":
          return "\r";
        case "\\n":
          return "\n";
        case "\\t":
          return "\t";
        case "\\f":
          return "\f";
        default:
          if (submatch.length > 1)
            return String.fromCharCode("0x" + submatch.slice(1));
          else
            return submatch;
      }
    });
    return [rtn];
  };
  engine.BooleanLiteral = function(ctx, parentData, node) {
    if (node.text === "true") {
      return [true];
    } else {
      return [false];
    }
  };
  engine.QuantityLiteral = function(ctx, parentData, node) {
    var valueNode = node.children[0];
    var value = Number(valueNode.terminalNodeText[0]);
    var unitNode = valueNode.children[0];
    var unit = unitNode.terminalNodeText[0];
    if (!unit && unitNode.children)
      unit = unitNode.children[0].terminalNodeText[0];
    return [new FP_Quantity(value, unit)];
  };
  engine.DateTimeLiteral = function(ctx, parentData, node) {
    var dateStr = node.text.slice(1);
    return [new FP_DateTime(dateStr)];
  };
  engine.TimeLiteral = function(ctx, parentData, node) {
    var timeStr = node.text.slice(1);
    return [new FP_Time(timeStr)];
  };
  engine.NumberLiteral = function(ctx, parentData, node) {
    return [Number(node.text)];
  };
  engine.Identifier = function(ctx, parentData, node) {
    return [node.text.replace(/(^`|`$)/g, "")];
  };
  engine.InvocationTerm = function(ctx, parentData, node) {
    return engine.doEval(ctx, parentData, node.children[0]);
  };
  engine.MemberInvocation = function(ctx, parentData, node) {
    const key = engine.doEval(ctx, parentData, node.children[0])[0];
    const model = ctx.model;
    if (parentData) {
      if (util.isCapitalized(key)) {
        return parentData.filter((x) => x instanceof ResourceNode && x.path === key);
      } else {
        const path = parentData.path || parentData.__path__;
        return parentData.reduce(function(acc, res) {
          res = makeResNode(res, path);
          var childPath = res.path + "." + key;
          if (model) {
            let defPath = model.pathsDefinedElsewhere[childPath];
            if (defPath)
              childPath = defPath;
          }
          let toAdd, _toAdd;
          let actualTypes = model && model.choiceTypePaths[childPath];
          if (actualTypes) {
            for (let t of actualTypes) {
              let field = key + t;
              toAdd = res.data?.[field];
              _toAdd = res.data?.["_" + field];
              if (toAdd !== undefined || _toAdd !== undefined) {
                childPath += t;
                break;
              }
            }
          } else {
            toAdd = res.data?.[key];
            _toAdd = res.data?.["_" + key];
            if (toAdd === undefined && _toAdd === undefined) {
              toAdd = res._data[key];
            }
            if (key === "extension") {
              childPath = "Extension";
            }
          }
          childPath = model && model.path2Type[childPath] || childPath;
          if (util.isSome(toAdd) || util.isSome(_toAdd)) {
            if (Array.isArray(toAdd)) {
              acc = acc.concat(toAdd.map((x, i) => makeResNode(x, childPath, _toAdd && _toAdd[i])));
            } else {
              acc.push(makeResNode(toAdd, childPath, _toAdd));
            }
            return acc;
          } else {
            return acc;
          }
        }, []);
      }
    } else {
      return [];
    }
  };
  engine.IndexerExpression = function(ctx, parentData, node) {
    const coll_node = node.children[0];
    const idx_node = node.children[1];
    var coll = engine.doEval(ctx, parentData, coll_node);
    var idx = engine.doEval(ctx, parentData, idx_node);
    if (util.isEmpty(idx)) {
      return [];
    }
    var idxNum = parseInt(idx[0]);
    if (coll && util.isSome(idxNum) && coll.length > idxNum && idxNum >= 0) {
      return [coll[idxNum]];
    } else {
      return [];
    }
  };
  engine.Functn = function(ctx, parentData, node) {
    return node.children.map(function(x) {
      return engine.doEval(ctx, parentData, x);
    });
  };
  engine.realizeParams = function(ctx, parentData, args) {
    if (args && args[0] && args[0].children) {
      return args[0].children.map(function(x) {
        return engine.doEval(ctx, parentData, x);
      });
    } else {
      return [];
    }
  };
  engine.FunctionInvocation = function(ctx, parentData, node) {
    var args = engine.doEval(ctx, parentData, node.children[0]);
    const fnName = args[0];
    args.shift();
    var rawParams = args && args[0] && args[0].children;
    return doInvoke(ctx, fnName, parentData, rawParams);
  };
  engine.ParamList = function(ctx, parentData, node) {
    return node;
  };
  engine.UnionExpression = function(ctx, parentData, node) {
    return infixInvoke(ctx, "|", parentData, node.children);
  };
  engine.ThisInvocation = function(ctx) {
    return ctx.$this;
  };
  engine.TotalInvocation = function(ctx) {
    return util.arraify(ctx.$total);
  };
  engine.IndexInvocation = function(ctx) {
    return util.arraify(ctx.$index);
  };
  engine.OpExpression = function(ctx, parentData, node) {
    var op = node.terminalNodeText[0];
    return infixInvoke(ctx, op, parentData, node.children);
  };
  engine.AliasOpExpression = function(map) {
    return function(ctx, parentData, node) {
      var op = node.terminalNodeText[0];
      var alias = map[op];
      if (!alias) {
        throw new Error("Do not know how to alias " + op + " by " + JSON.stringify(map));
      }
      return infixInvoke(ctx, alias, parentData, node.children);
    };
  };
  engine.NullLiteral = function() {
    return [];
  };
  engine.ParenthesizedTerm = function(ctx, parentData, node) {
    return engine.doEval(ctx, parentData, node.children[0]);
  };
  engine.evalTable = {
    BooleanLiteral: engine.BooleanLiteral,
    EqualityExpression: engine.OpExpression,
    FunctionInvocation: engine.FunctionInvocation,
    Functn: engine.Functn,
    Identifier: engine.Identifier,
    IndexerExpression: engine.IndexerExpression,
    InequalityExpression: engine.OpExpression,
    InvocationExpression: engine.InvocationExpression,
    AdditiveExpression: engine.OpExpression,
    MultiplicativeExpression: engine.OpExpression,
    TypeExpression: engine.AliasOpExpression({ is: "isOp", as: "asOp" }),
    MembershipExpression: engine.AliasOpExpression({ contains: "containsOp", in: "inOp" }),
    NullLiteral: engine.NullLiteral,
    EntireExpression: engine.InvocationTerm,
    InvocationTerm: engine.InvocationTerm,
    LiteralTerm: engine.LiteralTerm,
    MemberInvocation: engine.MemberInvocation,
    NumberLiteral: engine.NumberLiteral,
    ParamList: engine.ParamList,
    ParenthesizedTerm: engine.ParenthesizedTerm,
    StringLiteral: engine.StringLiteral,
    TermExpression: engine.TermExpression,
    ThisInvocation: engine.ThisInvocation,
    TotalInvocation: engine.TotalInvocation,
    IndexInvocation: engine.IndexInvocation,
    UnionExpression: engine.UnionExpression,
    OrExpression: engine.OpExpression,
    ImpliesExpression: engine.OpExpression,
    AndExpression: engine.OpExpression,
    XorExpression: engine.OpExpression
  };
  engine.doEval = function(ctx, parentData, node) {
    const evaluator = engine.evalTable[node.type] || engine[node.type];
    if (evaluator) {
      return evaluator.call(engine, ctx, parentData, node);
    } else {
      throw new Error("No " + node.type + " evaluator ");
    }
  };
  module.exports = {
    version,
    parse,
    compile,
    evaluate,
    resolveInternalTypes,
    types: typesFn,
    ucumUtils: require_ucumPkg().UcumLhcUtils.getInstance()
  };
});
export default require_fhirpath();
