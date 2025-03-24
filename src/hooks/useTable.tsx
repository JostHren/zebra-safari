import { generateData } from '@/lib/dataGenerator';
import * as d3 from 'd3';
import { useCallback, useEffect, useMemo, useRef } from 'react';

interface HierarchyNodeData {
  name: string;
  value?: number;
  state?: 0 | 1 | 2; // 0 = Original, 1 = Inverted, 2 = Excluded
}

export interface HierarchicalTableProps {
  showTotal?: boolean;
  decimalPlaces?: number;
  paddingSize?: number;
  nodeSign?: string;
  yearsGenerated?: number;
}

export const useTable = ({
  showTotal = true,
  decimalPlaces = 1,
  paddingSize = 20,
  nodeSign = '⌵ ',
  yearsGenerated = 200,
}: HierarchicalTableProps) => {
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const root = useMemo(() => generateData(yearsGenerated), [yearsGenerated]);

  root.each((node: d3.HierarchyNode<HierarchyNodeData>) => {
    if (!node.children) {
      node.data.state = 0; // 0 = Original, 1 = Inverted, 2 = Excluded
    }
  });

  // Function to compute branch values
  const computeBranchValues = (node: d3.HierarchyNode<HierarchyNodeData>) => {
    if (node.children) {
      node.children.forEach(computeBranchValues);
      const sum = d3.sum(node.children, (d) => d.data.value ?? 0);
      node.data.value = Number(sum.toFixed(decimalPlaces));
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateAllChildNodes = (parentNode: d3.HierarchyNode<HierarchyNodeData>) => {
    // Get all leaf nodes under this parent
    const leafNodes: d3.HierarchyNode<HierarchyNodeData>[] = [];
    const collectLeafNodes = (node: d3.HierarchyNode<HierarchyNodeData>) => {
      if (!node.children) {
        leafNodes.push(node);
      } else {
        node.children.forEach(collectLeafNodes);
      }
    };
    collectLeafNodes(parentNode);

    // Cycle through states for all leaf nodes
    leafNodes.forEach((leafNode) => {
      if (leafNode.data.state === 0) {
        leafNode.data.state = 2;
      } else if (leafNode.data.state === 2) {
        leafNode.data.state = 1;
      } else {
        leafNode.data.state = 0;
      }
      updateValues(leafNode);
    });
  };

  // Compute initial values for branches
  computeBranchValues(root);

  // Function to update values in hierarchy
  const updateValues = useCallback(
    (node: d3.HierarchyNode<HierarchyNodeData>) => {
      // Update clicked node's value display
      d3.selectAll('tr')
        .filter((d) => d === node)
        .select('.value-cell')
        .text((node.data.value ?? 0).toString())
        .classed('text-red-500', node.data.state === 1)
        .classed('text-gray-300', node.data.state === 2);

      // Apply styling for excluded values
      d3.selectAll('tr')
        .filter((d) => d === node)
        .select('.leaf')
        .classed('text-red-500 before:content-["-_"]', node.data.state === 1)
        .classed('text-gray-300', node.data.state === 2);

      // Recursively update parent values
      let parent = node.parent;
      while (parent && parent.children) {
        const sum = d3.sum(parent.children, (d) => {
          if (d.data.state === 1) return -(d.data.value ?? 0);
          if (d.data.state === 2) return 0;
          return d.data.value ?? 0;
        });
        parent.data.value = Number(sum.toFixed(decimalPlaces));
        d3.selectAll('tr')
          .filter((d) => d === parent)
          .select('.value-cell')
          .text((parent.data.value ?? 0).toString());
        parent = parent.parent;
      }
    },
    [decimalPlaces],
  );

  useEffect(() => {
    // Function to cycle leaf values (Original → Inverted → Excluded)
    const cycleValue = (node: d3.HierarchyNode<HierarchyNodeData>) => {
      if (node.data.state === 0) {
        node.data.state = 2;
      } else if (node.data.state === 2) {
        node.data.state = 1;
      } else {
        node.data.state = 0;
      }

      updateValues(node);
    };

    // Function to render table
    const renderTable = () => {
      const tbody = d3.select(tableRef.current);

      // Flatten only visible nodes for rendering
      const visibleNodes: d3.HierarchyNode<HierarchyNodeData>[] = [];

      const collectNodes = (node: d3.HierarchyNode<HierarchyNodeData>, depth = 0) => {
        if (depth !== 0 || showTotal) visibleNodes.push(node);
        if (node.children) {
          node.children.forEach((child) => collectNodes(child, depth + 1));
        }
      };

      collectNodes(root);

      // Bind data to rows
      const rows = tbody.selectAll('tr').data(visibleNodes);

      // Enter: Create new rows
      const newRows = rows
        .enter()
        .append('tr')
        .attr('class', (d) => `depth-${d.depth}`);

      newRows
        .append('td')
        .attr('class', (d) => (d.children ? 'toggle' : 'leaf'))
        .style('padding-left', (d) => `${(d.depth - (showTotal ? 0 : 1)) * paddingSize}px`)
        .style('text-align', 'left')
        .style('font-weight', (d) => (d.height !== 0 ? 'bold' : 'normal'))
        .style('cursor', 'pointer')
        .classed('select-none border-b-1', true)
        .text((d) => (d.children ? `${nodeSign} ${d.data.name}` : d.data.name))
        .on('click', function (_event, d) {
          if (d.children) {
            updateAllChildNodes(d);
          } else {
            cycleValue(d);
          }
        });

      newRows
        .append('td')
        .attr('class', 'value-cell')
        .text((d) => (d.data.value ?? 0).toString())
        .style('font-weight', (d) => (d.height !== 0 ? 'bold' : 'normal'))
        .style('text-align', 'right')
        .style('cursor', 'pointer')
        .classed('select-none border-b-1', true)
        .on('click', (_event, d) => {
          if (d.children) {
            //do nothing
          } else {
            cycleValue(d);
          }
        });

      // Update existing rows
      rows.select('.toggle').text((d) => `${nodeSign} ${d.data.name}`);
      rows.select('.value-cell').text((d) => (d.data.value ?? 0).toString());

      // Remove old rows
      rows.exit().remove();
    };

    // Compute initial values and render
    renderTable();

    // Cleanup function
    return () => {
      d3.select(tableRef.current).selectAll('tr').remove();
    };
  }, [decimalPlaces, nodeSign, paddingSize, root, showTotal, updateAllChildNodes, updateValues]);

  return { tableRef };
};
