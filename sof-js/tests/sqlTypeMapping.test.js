import { describe, expect, test } from '@jest/globals'
import {
  UNSUPPORTED_SQL_TYPES,
  encodeFhirValue,
  fhirTypeToSqlType,
  inferFhirValueKeyFromRuntime,
  sqlTypeToFhirValueKey,
} from '../src/server/sqlTypeMapping.js'

/*
 * Unit tests for the SQL to FHIR type mapping module.
 *
 * The mapping is defined in input/pagecontent/OperationDefinition-SQLQueryRun-notes.md
 * under "SQL to FHIR type mapping". Each test below corresponds to a row or rule in
 * that table so that the reference implementation matches the specification.
 */

describe('fhirTypeToSqlType', () => {
  test('maps each FHIR primitive column type to the expected declared SQL type', () => {
    expect(fhirTypeToSqlType('string')).toBe('TEXT')
    expect(fhirTypeToSqlType('integer')).toBe('INTEGER')
    expect(fhirTypeToSqlType('integer64')).toBe('BIGINT')
    expect(fhirTypeToSqlType('decimal')).toBe('DECIMAL')
    expect(fhirTypeToSqlType('boolean')).toBe('BOOLEAN')
    expect(fhirTypeToSqlType('date')).toBe('DATE')
    expect(fhirTypeToSqlType('dateTime')).toBe('TIMESTAMP')
    expect(fhirTypeToSqlType('instant')).toBe('TIMESTAMP WITH TIME ZONE')
    expect(fhirTypeToSqlType('time')).toBe('TIME')
    expect(fhirTypeToSqlType('base64Binary')).toBe('BLOB')
  })

  test('falls back to TEXT for unknown or missing types', () => {
    expect(fhirTypeToSqlType('uri')).toBe('TEXT')
    expect(fhirTypeToSqlType(undefined)).toBe('TEXT')
    expect(fhirTypeToSqlType('')).toBe('TEXT')
  })
})

describe('sqlTypeToFhirValueKey', () => {
  test('maps SQL BOOLEAN to valueBoolean', () => {
    expect(sqlTypeToFhirValueKey('BOOLEAN')).toBe('valueBoolean')
  })

  test('maps small integer SQL types to valueInteger', () => {
    expect(sqlTypeToFhirValueKey('TINYINT')).toBe('valueInteger')
    expect(sqlTypeToFhirValueKey('SMALLINT')).toBe('valueInteger')
    expect(sqlTypeToFhirValueKey('INT')).toBe('valueInteger')
    expect(sqlTypeToFhirValueKey('INTEGER')).toBe('valueInteger')
  })

  test('maps BIGINT to valueInteger64', () => {
    expect(sqlTypeToFhirValueKey('BIGINT')).toBe('valueInteger64')
  })

  test('maps DECIMAL and NUMERIC to valueDecimal', () => {
    expect(sqlTypeToFhirValueKey('DECIMAL')).toBe('valueDecimal')
    expect(sqlTypeToFhirValueKey('NUMERIC')).toBe('valueDecimal')
  })

  test('maps floating point SQL types to valueDecimal', () => {
    expect(sqlTypeToFhirValueKey('REAL')).toBe('valueDecimal')
    expect(sqlTypeToFhirValueKey('FLOAT')).toBe('valueDecimal')
    expect(sqlTypeToFhirValueKey('DOUBLE PRECISION')).toBe('valueDecimal')
  })

  test('maps character SQL types to valueString', () => {
    expect(sqlTypeToFhirValueKey('CHARACTER')).toBe('valueString')
    expect(sqlTypeToFhirValueKey('CHARACTER VARYING')).toBe('valueString')
    expect(sqlTypeToFhirValueKey('CHARACTER LARGE OBJECT')).toBe('valueString')
  })

  test('maps common SQLite character aliases to valueString', () => {
    expect(sqlTypeToFhirValueKey('TEXT')).toBe('valueString')
    expect(sqlTypeToFhirValueKey('VARCHAR')).toBe('valueString')
    expect(sqlTypeToFhirValueKey('CHAR')).toBe('valueString')
    expect(sqlTypeToFhirValueKey('CLOB')).toBe('valueString')
  })

  test('maps binary SQL types to valueBase64Binary', () => {
    expect(sqlTypeToFhirValueKey('BINARY')).toBe('valueBase64Binary')
    expect(sqlTypeToFhirValueKey('BINARY VARYING')).toBe('valueBase64Binary')
    expect(sqlTypeToFhirValueKey('BINARY LARGE OBJECT')).toBe('valueBase64Binary')
    expect(sqlTypeToFhirValueKey('BLOB')).toBe('valueBase64Binary')
  })

  test('maps DATE to valueDate', () => {
    expect(sqlTypeToFhirValueKey('DATE')).toBe('valueDate')
  })

  test('maps TIME and TIME WITH TIME ZONE to valueTime', () => {
    expect(sqlTypeToFhirValueKey('TIME')).toBe('valueTime')
    expect(sqlTypeToFhirValueKey('TIME WITH TIME ZONE')).toBe('valueTime')
  })

  test('maps TIMESTAMP to valueDateTime', () => {
    expect(sqlTypeToFhirValueKey('TIMESTAMP')).toBe('valueDateTime')
  })

  test('maps TIMESTAMP WITH TIME ZONE to valueInstant', () => {
    expect(sqlTypeToFhirValueKey('TIMESTAMP WITH TIME ZONE')).toBe('valueInstant')
  })

  test('matches case insensitively', () => {
    expect(sqlTypeToFhirValueKey('bigint')).toBe('valueInteger64')
    expect(sqlTypeToFhirValueKey('Timestamp With Time Zone')).toBe('valueInstant')
    expect(sqlTypeToFhirValueKey('date')).toBe('valueDate')
  })

  test('ignores surrounding whitespace', () => {
    expect(sqlTypeToFhirValueKey('  INTEGER  ')).toBe('valueInteger')
  })

  test('ignores column widths and precision specifiers', () => {
    // SQLite often stores types like "VARCHAR(255)" or "DECIMAL(10,2)".
    expect(sqlTypeToFhirValueKey('VARCHAR(255)')).toBe('valueString')
    expect(sqlTypeToFhirValueKey('DECIMAL(10,2)')).toBe('valueDecimal')
    expect(sqlTypeToFhirValueKey('CHARACTER(20)')).toBe('valueString')
  })

  test('returns null for blank declared type, signalling fallback to runtime inference', () => {
    expect(sqlTypeToFhirValueKey('')).toBeNull()
    expect(sqlTypeToFhirValueKey(null)).toBeNull()
    expect(sqlTypeToFhirValueKey(undefined)).toBeNull()
  })
})

describe('UNSUPPORTED_SQL_TYPES', () => {
  test('exposes the spec-defined unsupported types', () => {
    // The spec lists these as requiring 422 Unprocessable Entity when they appear in a FHIR-format response.
    expect(UNSUPPORTED_SQL_TYPES).toEqual(
      expect.arrayContaining(['INTERVAL', 'ARRAY', 'XML', 'ROW', 'MULTISET']),
    )
  })

  test('sqlTypeToFhirValueKey throws for spec-unsupported types', () => {
    expect(() => sqlTypeToFhirValueKey('INTERVAL')).toThrow(/unsupported/i)
    expect(() => sqlTypeToFhirValueKey('array')).toThrow(/unsupported/i)
    expect(() => sqlTypeToFhirValueKey('XML')).toThrow(/unsupported/i)
    expect(() => sqlTypeToFhirValueKey('ROW')).toThrow(/unsupported/i)
    expect(() => sqlTypeToFhirValueKey('MULTISET')).toThrow(/unsupported/i)
  })
})

describe('inferFhirValueKeyFromRuntime', () => {
  test('integer-valued numbers become valueInteger', () => {
    expect(inferFhirValueKeyFromRuntime(0)).toBe('valueInteger')
    expect(inferFhirValueKeyFromRuntime(42)).toBe('valueInteger')
    expect(inferFhirValueKeyFromRuntime(-7)).toBe('valueInteger')
  })

  test('fractional numbers become valueDecimal', () => {
    expect(inferFhirValueKeyFromRuntime(1.5)).toBe('valueDecimal')
    expect(inferFhirValueKeyFromRuntime(-0.25)).toBe('valueDecimal')
  })

  test('booleans become valueBoolean', () => {
    expect(inferFhirValueKeyFromRuntime(true)).toBe('valueBoolean')
    expect(inferFhirValueKeyFromRuntime(false)).toBe('valueBoolean')
  })

  test('strings become valueString', () => {
    expect(inferFhirValueKeyFromRuntime('hello')).toBe('valueString')
    expect(inferFhirValueKeyFromRuntime('')).toBe('valueString')
  })

  test('Buffer instances become valueBase64Binary', () => {
    expect(inferFhirValueKeyFromRuntime(Buffer.from([1, 2, 3]))).toBe('valueBase64Binary')
  })

  test('throws for unrepresentable runtime types', () => {
    expect(() => inferFhirValueKeyFromRuntime({})).toThrow(/unsupported/i)
    expect(() => inferFhirValueKeyFromRuntime([])).toThrow(/unsupported/i)
  })
})

describe('encodeFhirValue', () => {
  test('valueString passes through', () => {
    expect(encodeFhirValue('hello', 'valueString')).toEqual({ valueString: 'hello' })
  })

  test('valueInteger passes through', () => {
    expect(encodeFhirValue(42, 'valueInteger')).toEqual({ valueInteger: 42 })
  })

  test('valueInteger coerces numeric strings', () => {
    // SQLite may return integer-typed columns as strings in some circumstances;
    // preserve the declared-type intent by coercing.
    expect(encodeFhirValue('42', 'valueInteger')).toEqual({ valueInteger: 42 })
  })

  test('valueInteger64 is emitted as a JSON string to preserve precision past 2^53', () => {
    expect(encodeFhirValue(1, 'valueInteger64')).toEqual({ valueInteger64: '1' })
    expect(encodeFhirValue('9999999999999999', 'valueInteger64')).toEqual({
      valueInteger64: '9999999999999999',
    })
    // BigInt values survive the round-trip as strings too.
    expect(encodeFhirValue(9999999999999999n, 'valueInteger64')).toEqual({
      valueInteger64: '9999999999999999',
    })
  })

  test('valueDecimal preserves numbers', () => {
    expect(encodeFhirValue(1.5, 'valueDecimal')).toEqual({ valueDecimal: 1.5 })
  })

  test('valueDecimal parses numeric strings', () => {
    expect(encodeFhirValue('1.5', 'valueDecimal')).toEqual({ valueDecimal: 1.5 })
  })

  test('valueBoolean passes booleans through', () => {
    expect(encodeFhirValue(true, 'valueBoolean')).toEqual({ valueBoolean: true })
    expect(encodeFhirValue(false, 'valueBoolean')).toEqual({ valueBoolean: false })
  })

  test('valueBoolean coerces SQLite 0/1 integers', () => {
    // SQLite has no native BOOLEAN; BOOLEAN columns store 0 or 1.
    expect(encodeFhirValue(1, 'valueBoolean')).toEqual({ valueBoolean: true })
    expect(encodeFhirValue(0, 'valueBoolean')).toEqual({ valueBoolean: false })
  })

  test('valueBase64Binary encodes Buffer values as base64 strings', () => {
    const buf = Buffer.from('hello', 'utf8')
    expect(encodeFhirValue(buf, 'valueBase64Binary')).toEqual({
      valueBase64Binary: buf.toString('base64'),
    })
  })

  test('valueBase64Binary passes pre-encoded strings through', () => {
    expect(encodeFhirValue('aGVsbG8=', 'valueBase64Binary')).toEqual({
      valueBase64Binary: 'aGVsbG8=',
    })
  })

  test('valueDate preserves the string form', () => {
    expect(encodeFhirValue('2024-01-15', 'valueDate')).toEqual({ valueDate: '2024-01-15' })
  })

  test('valueTime preserves the string form', () => {
    expect(encodeFhirValue('13:45:00', 'valueTime')).toEqual({ valueTime: '13:45:00' })
  })

  test('valueDateTime preserves the string form', () => {
    expect(encodeFhirValue('2024-01-15T13:45:00', 'valueDateTime')).toEqual({
      valueDateTime: '2024-01-15T13:45:00',
    })
  })

  test('valueInstant rounds sub-millisecond precision to milliseconds', () => {
    // Spec note: FHIR instant supports at most millisecond precision; implementations
    // SHOULD round to the nearest millisecond when converting TIMESTAMP WITH TIME ZONE.
    expect(encodeFhirValue('2024-01-15T13:45:00.123456Z', 'valueInstant')).toEqual({
      valueInstant: '2024-01-15T13:45:00.123Z',
    })
    expect(encodeFhirValue('2024-01-15T13:45:00.123999Z', 'valueInstant')).toEqual({
      valueInstant: '2024-01-15T13:45:00.124Z',
    })
  })

  test('valueInstant preserves values already at millisecond precision', () => {
    expect(encodeFhirValue('2024-01-15T13:45:00.500Z', 'valueInstant')).toEqual({
      valueInstant: '2024-01-15T13:45:00.500Z',
    })
  })

  test('valueInstant preserves values without sub-second precision', () => {
    expect(encodeFhirValue('2024-01-15T13:45:00Z', 'valueInstant')).toEqual({
      valueInstant: '2024-01-15T13:45:00Z',
    })
  })
})
