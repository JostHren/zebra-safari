import * as d3 from 'd3';

interface LeafNode {
  [key: string]: number;
}

interface BranchNode {
  [key: string]: LeafNode[];
}

interface QuarterNode {
  [key: string]: BranchNode[];
}

interface YearNode {
  [key: string]: QuarterNode[];
}

interface RootData {
  Total: YearNode[];
}

interface HierarchyNode {
  name: string;
  children?: HierarchyNode[];
  value?: number;
}

const generateLargeHierarchicalData = (generatedYears: number): RootData => {
  const getMonth = (monthNumber: number): string => {
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

  const data: RootData = {
    Total: [],
  };

  for (let y = 1; y <= generatedYears; y++) {
    const master: YearNode = {
      [`Year ${1973 + y}`]: [],
    };

    for (let q = 1; q <= 4; q++) {
      const branchL1: QuarterNode = {
        [`Q${q}`]: [],
      };

      for (let m = 1; m <= 3; m++) {
        const branchL2: BranchNode = {
          [`${getMonth(m + (q - 1) * 3)}`]: [],
        };

        for (let d = 1; d <= 4; d++) {
          const leaf: LeafNode = {
            [`w${d}`]: Number((Math.random() + 1).toFixed(2)),
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

export const generateData = (generatedYears: number): d3.HierarchyNode<HierarchyNode> => {
  const rootData: HierarchyNode = {
    name: 'Total',
    children: generateLargeHierarchicalData(generatedYears).Total.map((year) => {
      const yearKey = Object.keys(year)[0];
      return {
        name: yearKey,
        children: year[yearKey].map((quarter) => {
          const quarterKey = Object.keys(quarter)[0];
          return {
            name: quarterKey,
            children: quarter[quarterKey].map((month) => {
              const monthKey = Object.keys(month)[0];
              return {
                name: monthKey,
                children: month[monthKey].map((leaf) => {
                  const leafKey = Object.keys(leaf)[0];
                  return {
                    name: leafKey,
                    value: leaf[leafKey],
                  };
                }),
              };
            }),
          };
        }),
      };
    }),
  };

  const root = d3.hierarchy(rootData, (node: HierarchyNode) => {
    if (node.children) return node.children;
    return null;
  });
  return root;
};
