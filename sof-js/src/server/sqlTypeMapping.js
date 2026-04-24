/*
 * Maps between SQL column types, ViewDefinition column types, and FHIR
 * value[x] encodings. The canonical mapping is defined in
 * input/pagecontent/OperationDefinition-SQLQueryRun-notes.md under the
 * heading "SQL to FHIR type mapping".
 *
 * Author: John Grimes.
 */

/**
 * SQL types that the specification explicitly marks as unsupported when
 * returning rows under `_format=fhir`. Encountering any of these MUST produce
 * a 422 Unprocessable Entity per the spec.
 */
export const UNSUPPORTED_SQL_TYPES = ['INTERVAL', 'ARRAY', 'XML', 'ROW', 'MULTISET'];

// ViewDefinition column `type` values mapped to the SQL declared type that
// should be used when materialising a temporary table. The declared type
// informs SQLite's column affinity and is visible to `PRAGMA table_info`.
const FHIR_TO_SQL = {
  string: 'TEXT',
  integer: 'INTEGER',
  integer64: 'BIGINT',
  decimal: 'DECIMAL',
  boolean: 'BOOLEAN',
  date: 'DATE',
  dateTime: 'TIMESTAMP',
  instant: 'TIMESTAMP WITH TIME ZONE',
  time: 'TIME',
  base64Binary: 'BLOB',
};

// Normalised SQL type names (upper case, collapsed whitespace, any width
// specifier stripped) mapped to the corresponding FHIR `value[x]` key.
const SQL_TO_FHIR_VALUE_KEY = {
  BOOLEAN: 'valueBoolean',

  TINYINT: 'valueInteger',
  SMALLINT: 'valueInteger',
  INT: 'valueInteger',
  INTEGER: 'valueInteger',

  BIGINT: 'valueInteger64',

  DECIMAL: 'valueDecimal',
  NUMERIC: 'valueDecimal',
  REAL: 'valueDecimal',
  FLOAT: 'valueDecimal',
  'DOUBLE PRECISION': 'valueDecimal',
  DOUBLE: 'valueDecimal',

  CHARACTER: 'valueString',
  'CHARACTER VARYING': 'valueString',
  'CHARACTER LARGE OBJECT': 'valueString',
  CHAR: 'valueString',
  VARCHAR: 'valueString',
  TEXT: 'valueString',
  CLOB: 'valueString',

  BINARY: 'valueBase64Binary',
  'BINARY VARYING': 'valueBase64Binary',
  'BINARY LARGE OBJECT': 'valueBase64Binary',
  BLOB: 'valueBase64Binary',
  VARBINARY: 'valueBase64Binary',

  DATE: 'valueDate',

  TIME: 'valueTime',
  'TIME WITH TIME ZONE': 'valueTime',

  TIMESTAMP: 'valueDateTime',
  'TIMESTAMP WITH TIME ZONE': 'valueInstant',
};

/**
 * Normalise an SQL type name so that lookups become case-insensitive and
 * tolerate width specifiers (e.g. `VARCHAR(255)` or `DECIMAL(10,2)`).
 *
 * @param {string} type
 * @returns {string}
 */
function normaliseSqlType(type) {
  // Strip any parenthesised width or precision specifier then collapse
  // whitespace so that "character   varying" and "CHARACTER VARYING" compare
  // equal.
  return type
    .replace(/\(.*?\)/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

/**
 * Map a ViewDefinition column's declared FHIR type to an SQL declared type
 * suitable for use in a `CREATE TEMP TABLE` statement. Unknown or missing
 * types fall back to TEXT; the declared type is advisory in SQLite so this
 * soft fallback does not risk data loss.
 *
 * @param {string | undefined} fhirType
 * @returns {string}
 */
export function fhirTypeToSqlType(fhirType) {
  if (!fhirType) {
    return 'TEXT';
  }
  return FHIR_TO_SQL[fhirType] || 'TEXT';
}

/**
 * Map a declared SQL type (as reported by `PRAGMA table_info`) to the FHIR
 * `value[x]` key that should wrap values of that column.
 *
 * Returns `null` for blank declared types so that callers can fall back to
 * runtime-type inference. Throws for spec-unsupported types (INTERVAL,
 * ARRAY, XML, ROW, MULTISET) so that callers can propagate a 422 response.
 *
 * @param {string | null | undefined} sqlType
 * @returns {string | null}
 * @throws {Error} When the SQL type is explicitly unsupported by the spec.
 */
export function sqlTypeToFhirValueKey(sqlType) {
  if (sqlType === null || sqlType === undefined || sqlType === '') {
    return null;
  }
  const normalised = normaliseSqlType(sqlType);
  if (normalised === '') {
    return null;
  }
  if (UNSUPPORTED_SQL_TYPES.includes(normalised)) {
    throw new Error(`unsupported SQL column type for _format=fhir: ${sqlType}`);
  }
  const key = SQL_TO_FHIR_VALUE_KEY[normalised];
  if (!key) {
    // An unrecognised SQL type still needs a decision; treat it as blank
    // so the caller falls back to runtime inference. A hard error here
    // would reject many legitimate SQLite expression columns.
    return null;
  }
  return key;
}

/**
 * Infer a FHIR `value[x]` key from the JavaScript runtime type of a value.
 * Used only when the SQL column has no usable declared type. Throws when the
 * value cannot be represented in a FHIR primitive.
 *
 * @param {unknown} value
 * @returns {string}
 * @throws {Error} When the runtime type is not supported.
 */
export function inferFhirValueKeyFromRuntime(value) {
  if (typeof value === 'boolean') {
    return 'valueBoolean';
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'valueInteger' : 'valueDecimal';
  }
  if (typeof value === 'bigint') {
    return 'valueInteger64';
  }
  if (typeof value === 'string') {
    return 'valueString';
  }
  if (Buffer.isBuffer(value)) {
    return 'valueBase64Binary';
  }
  throw new Error(`unsupported runtime value type for _format=fhir: ${typeof value}`);
}

/**
 * Round an ISO-8601 instant's sub-millisecond fractional seconds to the
 * nearest millisecond. Values at millisecond precision or coarser pass
 * through unchanged.
 *
 * @param {string} instant
 * @returns {string}
 */
function roundInstantToMilliseconds(instant) {
  // Match "YYYY-MM-DDTHH:MM:SS.<fraction><offset>" where <offset> is either
  // "Z", a numeric offset, or empty. Only rewrite when the fractional part
  // is longer than three digits.
  const match = /^(.*\.)(\d+)(Z|[+-]\d{2}:?\d{2})?$/.exec(instant);
  if (!match) {
    return instant;
  }
  const fraction = match[2];
  if (fraction.length <= 3) {
    return instant;
  }
  // Round half-away-from-zero using integer arithmetic on the fractional
  // digits so we do not introduce floating-point drift.
  const millis = Math.round(Number('0.' + fraction) * 1000);
  const offset = match[3] ?? '';
  if (millis === 1000) {
    // A carry into the seconds field is rare and would require rewriting
    // the whole timestamp; keep the conservative behaviour of clamping to
    // 999 milliseconds to avoid changing the wall-clock time.
    return `${match[1]}999${offset}`;
  }
  return `${match[1]}${String(millis).padStart(3, '0')}${offset}`;
}

/**
 * Encode a cell value as a FHIR `value[x]` property, applying any necessary
 * coercions: Buffer to base64, BigInt or large integer to string for
 * integer64, 0/1 to boolean, and sub-millisecond rounding for instants.
 *
 * @param {unknown} value
 * @param {string} valueKey
 * @returns {object}
 */
export function encodeFhirValue(value, valueKey) {
  switch (valueKey) {
    case 'valueBoolean': {
      if (typeof value === 'boolean') {
        return { valueBoolean: value };
      }
      if (value === 0 || value === 1) {
        return { valueBoolean: value === 1 };
      }
      if (value === '0' || value === '1') {
        return { valueBoolean: value === '1' };
      }
      return { valueBoolean: Boolean(value) };
    }

    case 'valueInteger': {
      if (typeof value === 'number') {
        return { valueInteger: value };
      }
      if (typeof value === 'string') {
        return { valueInteger: Number.parseInt(value, 10) };
      }
      if (typeof value === 'bigint') {
        return { valueInteger: Number(value) };
      }
      return { valueInteger: value };
    }

    case 'valueInteger64': {
      // FHIR integer64 is represented as a JSON string so that values above
      // 2^53 survive JSON round-trips without precision loss.
      return { valueInteger64: String(value) };
    }

    case 'valueDecimal': {
      if (typeof value === 'number') {
        return { valueDecimal: value };
      }
      if (typeof value === 'string') {
        const parsed = Number.parseFloat(value);
        return { valueDecimal: Number.isNaN(parsed) ? value : parsed };
      }
      return { valueDecimal: value };
    }

    case 'valueBase64Binary': {
      if (Buffer.isBuffer(value)) {
        return { valueBase64Binary: value.toString('base64') };
      }
      return { valueBase64Binary: String(value) };
    }

    case 'valueInstant': {
      return { valueInstant: roundInstantToMilliseconds(String(value)) };
    }

    default: {
      // valueString, valueDate, valueTime, valueDateTime and any other
      // string-shaped primitive all share the same pass-through behaviour.
      return { [valueKey]: value };
    }
  }
}
