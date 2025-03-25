import { DeepData, HierarchyNode } from './dataGenerator';

export const transformToHierarchy = (data: DeepData): HierarchyNode => {
  const processNode = (node: DeepData): HierarchyNode | null => {
    // Handle leaf nodes (nodes with numeric values)
    if (typeof node === 'number') {
      return null; // Parent function will handle this case
    }

    const nodeKey = Object.keys(node)[0];
    const nodeValue = node[nodeKey];

    // Handle leaf nodes (objects with single numeric value)
    if (typeof nodeValue === 'number') {
      return {
        name: nodeKey,
        value: nodeValue,
      };
    }

    // Handle array of nodes
    if (Array.isArray(nodeValue)) {
      return {
        name: nodeKey,
        children: nodeValue
          .map((child) => processNode(child))
          .filter((child): child is HierarchyNode => child !== null),
      };
    }

    //Handle nested object
    if (typeof nodeValue === 'object' && nodeValue !== null) {
      const processedChild = processNode(nodeValue);
      if (processedChild) {
        return {
          name: nodeKey,
          children: [processedChild],
        };
      }
    }

    return null;
  };

  // Handle root level
  return {
    name: Object.keys(data)[0],
    children: Array.isArray(Object.values(data)[0])
      ? (Object.values(data)[0] as DeepData[])
          .map((node) => processNode(node))
          .filter((node): node is HierarchyNode => node !== null)
      : [],
  };
};
