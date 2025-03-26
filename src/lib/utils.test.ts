import { describe, it, expect } from 'vitest';
import { isValidJSON } from '../lib/utils';

describe('isValidJSON', () => {
  it('should parse valid JSON string', () => {
    const validJSON = '{"name": "test", "value": 123}';
    const result = isValidJSON(validJSON);
    expect(result).toEqual({ name: 'test', value: 123 });
  });

  it('should parse valid JSON array', () => {
    const validJSON = '[1, 2, 3]';
    const result = isValidJSON(validJSON);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should parse valid JSON with nested objects', () => {
    const validJSON = '{"user": {"name": "John", "age": 30}, "active": true}';
    const result = isValidJSON(validJSON);
    expect(result).toEqual({
      user: { name: 'John', age: 30 },
      active: true,
    });
  });

  it('should return undefined for invalid JSON string', () => {
    const invalidJSON = '{invalid json}';
    const result = isValidJSON(invalidJSON);
    expect(result).toBeUndefined();
  });

  it('should return undefined for empty string', () => {
    const result = isValidJSON('');
    expect(result).toBeUndefined();
  });

  it('should return undefined for non-JSON string', () => {
    const result = isValidJSON('Hello, World!');
    expect(result).toBeUndefined();
  });
});
