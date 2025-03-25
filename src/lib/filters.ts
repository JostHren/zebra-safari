import { Filters } from '@/App';
import { DeepData } from './dataGenerator';

export const filterDeepData = (
  data: DeepData,
  predicate: (key: string, value: DeepData | DeepData[] | number, path: string[]) => boolean,
): DeepData => {
  const filterObject = (obj: DeepData, currentPath: string[]): DeepData | null => {
    const result: DeepData = {};
    let hasValidChildren = false;

    for (const [key, value] of Object.entries(obj)) {
      const newPath = [...currentPath, key];

      if (Array.isArray(value)) {
        const filteredArray = value
          .map((item) => filterObject(item, newPath))
          .filter((item): item is DeepData => item !== null);

        if (filteredArray.length > 0) {
          result[key] = filteredArray;
          hasValidChildren = true;
        }
      } else if (typeof value === 'object') {
        const filtered = filterObject(value, newPath);
        if (filtered !== null) {
          result[key] = filtered;
          hasValidChildren = true;
        }
      } else if (predicate(key, value, newPath)) {
        result[key] = value;
        hasValidChildren = true;
      }
    }

    return hasValidChildren ? result : null;
  };

  return filterObject(data, []) ?? {};
};

export const filterBy = (data: DeepData, filter: string[]) => {
  return filterDeepData(data, (key, _value, path) => {
    if (filter.includes(key)) return true;
    return path.some((segment) => filter.includes(segment));
  });
};

export const filterData = (data: DeepData, filters: Filters) => {
  let filteredData = data;

  const trimString = (string: string): string[] => string.trim().split(/\s+/);

  if (filters.first) filteredData = filterBy(filteredData, trimString(filters.first));
  if (filters.second) filteredData = filterBy(filteredData, trimString(filters.second));
  if (filters.third) filteredData = filterBy(filteredData, trimString(filters.third));

  return filteredData;
};
