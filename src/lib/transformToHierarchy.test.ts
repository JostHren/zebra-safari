import { describe, it, expect } from 'vitest';
import { transformToHierarchy } from './transformToHierarchy';
import { DeepData, HierarchyNode } from '@/hooks/useTable';

describe('transformToHierarchy', () => {
  it('should transform a simple leaf node', () => {
    const input: DeepData = { root: [{ value: 42 }] };
    const expected: HierarchyNode = {
      name: 'root',
      children: [{ name: 'value', value: 42 }],
    };
    expect(transformToHierarchy(input)).toEqual(expected);
  });

  it('should transform a nested structure with multiple levels', () => {
    const input: DeepData = {
      root: [
        { level1: 10 },
        { level1: { level2: 20 } },
        { level1: { level2: { level3: 30 } } },
      ],
    };
    const expected: HierarchyNode = {
      name: 'root',
      children: [
        { name: 'level1', value: 10 },
        { name: 'level1', children: [{ name: 'level2', value: 20 }] },
        { name: 'level1', children: [{ name: 'level2', children: [{ name: 'level3', value: 30 }] }] },
      ],
    };
    expect(transformToHierarchy(input)).toEqual(expected);
  });

  it('should handle empty arrays', () => {
    const input: DeepData = { root: [] };
    const expected: HierarchyNode = {
      name: 'root',
      children: [],
    };
    expect(transformToHierarchy(input)).toEqual(expected);
  });

  it('should handle multiple siblings at the same level', () => {
    const input: DeepData = {
      root: [
        { sibling1: 10 },
        { sibling2: 20 },
        { sibling3: 30 },
      ],
    };
    const expected: HierarchyNode = {
      name: 'root',
      children: [
        { name: 'sibling1', value: 10 },
        { name: 'sibling2', value: 20 },
        { name: 'sibling3', value: 30 },
      ],
    };
    expect(transformToHierarchy(input)).toEqual(expected);
  });

  it('should handle complex nested structure with mixed types', () => {
    const input: DeepData = {
      root: [
        { simple: 10 },
        { nested: { value: 20 } },
        { array: [{ item1: 30 }, { item2: 40 }] },
      ],
    };
    const expected: HierarchyNode = {
      name: 'root',
      children: [
        { name: 'simple', value: 10 },
        { name: 'nested', children: [{ name: 'value', value: 20 }] },
        {
          name: 'array',
          children: [
            { name: 'item1', value: 30 },
            { name: 'item2', value: 40 },
          ],
        },
      ],
    };
    expect(transformToHierarchy(input)).toEqual(expected);
  });
}); 