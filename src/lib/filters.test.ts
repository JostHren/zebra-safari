import { describe, it, expect } from 'vitest';
import { filterDeepData, filterBy, filterData } from './filters';
import { Filters } from '@/App';
import { DeepData } from '@/hooks/useTable';

describe('filterDeepData', () => {
  it('should return empty object when no matches found', () => {
    const data: DeepData = {
      name: { value: 30 },
      age: { value: 30 },
    };

    const result = filterDeepData(data, () => false);

    expect(result).toEqual({});
  });
});

describe('filterBy', () => {
  it('should filter data by specified keys', () => {
    const data: DeepData = {
      name: { value: 30 },
      age: { value: 30 },
      address: {
        street: { value: 123 },
        city: { value: 456 },
      },
    };

    const result = filterBy(data, ['name', 'street']);

    expect(result).toEqual({
      name: { value: 30 },
      address: {
        street: { value: 123 },
      },
    });
  });

  it('should handle nested paths', () => {
    const data: DeepData = {
      user: {
        profile: {
          name: { value: 30 },
        },
      },
    };

    const result = filterBy(data, ['profile']);

    expect(result).toEqual({
      user: {
        profile: {
          name: { value: 30 },
        },
      },
    });
  });
});

describe('filterData', () => {
  it('should apply multiple filters', () => {
    const data: DeepData = {
      name: { value: 30 },
      age: { value: 30 },
      address: {
        street: { house: { value: 123 }, flat: { value: 10 } },
        city: { value: 456 },
      },
      hobbies: [{ value: 789 }, { value: 101 }],
    };

    const filters: Filters = {
      first: 'address',
      second: 'street',
      third: 'house',
    };

    const result = filterData(data, filters);

    expect(result).toEqual({
      address: {
        street: { house: { value: 123 } },
      },
    });
  });

  it('should handle empty filters', () => {
    const data: DeepData = {
      name: { value: 30 },
      age: { value: 30 },
    };

    const filters: Filters = {
      first: '',
      second: '',
      third: '',
    };

    const result = filterData(data, filters);

    expect(result).toEqual(data);
  });

  it('should handle multiple words in filters', () => {
    const data: DeepData = {
      first_name: { value: 30 },
      last_name: { value: 40 },
      age: { value: 30 },
    };

    const filters: Filters = {
      first: 'first_name last_name',
      second: '',
      third: '',
    };

    const result = filterData(data, filters);

    expect(result).toEqual({
      first_name: { value: 30 },
      last_name: { value: 40 },
    });
  });
});
