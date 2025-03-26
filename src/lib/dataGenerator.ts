import { DeepData } from '@/hooks/useTable';

export const generateLargeHierarchicalData = (generatedYears: number): DeepData => {
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

  const data: DeepData = {
    Total: [],
  };

  for (let y = 1; y <= generatedYears; y++) {
    const master: DeepData = {
      [`${1973 + y}`]: [],
    };

    for (let q = 1; q <= 4; q++) {
      const branchL1: DeepData = {
        [`Q${q}`]: [],
      };

      for (let m = 1; m <= 3; m++) {
        const branchL2: DeepData = {
          [`${getMonth(m + (q - 1) * 3)}`]: [],
        };

        for (let d = 1; d <= 4; d++) {
          const leaf: DeepData = {
            [`w${d}`]: Number(`10.${d + 3}`),
          };

          const L2 = branchL2[`${getMonth(m + (q - 1) * 3)}`];
          if (Array.isArray(L2)) L2.push(leaf);
        }

        const L1 = branchL1[`Q${q}`];
        if (Array.isArray(L1)) L1.push(branchL2);
      }

      const m = master[`${1973 + y}`];
      if (Array.isArray(m)) m.push(branchL1);
    }
    const d = data.Total;
    if (Array.isArray(d)) d.push(master);
  }

  return data;
};
