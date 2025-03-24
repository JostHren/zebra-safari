import * as d3 from 'd3';
interface DeepObject {
  [key: string]: string | number | boolean | null | DeepObject | DeepObject[];
}

const generateLargeHierarchicalData = (generatedYears: number) => {
  const getMonth = (monthNumber: number) => {
    const months = [
      'Unk',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[monthNumber] || 'Unk';
  };

  console.log('Start data generation');
  const data = {
    Total: [],
  };

  for (let y = 1; y <= generatedYears; y++) {
    const master = {
      [`Year ${1973 + y}`]: [],
    };

    for (let q = 1; q <= 4; q++) {
      const branchL1 = {
        [`Q${q}`]: [],
      };

      for (let m = 1; m <= 3; m++) {
        const branchL2 = {
          [`${getMonth(m + (q - 1) * 3)}`]: [],
        };

        for (let d = 1; d <= 4; d++) {
          const leaf = {
            [`w${d}`]: 1.1,
          };

          branchL2[`${getMonth(m + (q - 1) * 3)}`].push(leaf);
        }

        branchL1[`Q${q}`].push(branchL2);
      }

      master[`Year ${1973 + y}`].push(branchL1);
    }

    data.Total.push(master);
  }

  return data;
};

// Function to extract children dynamically
const getChildren = (node) => {
  if (Array.isArray(node)) {
    // If it's an array, extract each object inside
    return node.map((obj) => {
      const key = Object.keys(obj)[0];
      const value = obj[key];

      if (Array.isArray(value)) {
        return { name: key, children: value }; // Recursive case
      } else {
        return { name: key, value: value }; // Leaf node with numerical value
      }
    });
  } else if (typeof node === 'object' && node !== null) {
    // If it's an object, process it (should not happen at root level)
    const key = Object.keys(node)[0];
    return [{ name: key, children: node[key] }];
  }
  return null; // Leaf node (numerical values)
};

export const generateData = (generatedYears: number) => {
  const root = d3.hierarchy(
    { name: 'Total', children: generateLargeHierarchicalData(generatedYears).Total }, // Root node
    (node: { children }) => {
      if (node.children) return getChildren(node.children); // Process children recursively
      return null;
    },
  );
  console.log('GENERATED DATA!');
  return root;
};
