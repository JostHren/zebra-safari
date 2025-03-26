import { transformToHierarchy } from '@/lib/transformToHierarchy';
import * as d3 from 'd3';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export interface DeepData {
  [key: string]: DeepData | DeepData[] | number;
}

export interface HierarchyNode {
  name: string;
  children?: HierarchyNode[];
  value?: number;
}
interface HierarchyNodeData {
  name: string;
  value?: number;
  state?: 'original' | 'inverted' | 'excluded';
}

export interface HierarchicalTableProps {
  showTotal?: boolean;
  paddingSize?: number;
  nodeSign?: string;
  data: DeepData;
}

export const useTable = ({
  showTotal = true,
  paddingSize = 20,
  nodeSign = '⌵ ',
  data,
}: HierarchicalTableProps) => {
  const tableRef = useRef<HTMLTableSectionElement>(null);

  const root = useMemo(() => {
    const transformedData = transformToHierarchy(data);

    return d3.hierarchy(transformedData, (node: HierarchyNode) => {
      if (node.children) return node.children;
      return null;
    });
  }, [data]);

  root.each((node: d3.HierarchyNode<HierarchyNodeData>) => {
    if (!node.children) {
      node.data.state = 'original';
    }
  });

  // Function to compute branch values
  const computeBranchValues = (node: d3.HierarchyNode<HierarchyNodeData>) => {
    if (node.children) {
      node.children.forEach(computeBranchValues);
      const sum = d3.sum(node.children, (d) => d.data.value ?? 0);
      node.data.value = Number(sum.toFixed(4));
    }
  };

  // Compute initial values for branches
  computeBranchValues(root);

  // Function to update values in hierarchy
  const updateValues = useCallback((node: d3.HierarchyNode<HierarchyNodeData>) => {
    // Update clicked node's value display
    d3.selectAll('tr')
      .filter((d) => d === node)
      .select('.value-cell')
      .text((node.data.value ?? 0).toString())
      .classed('text-red-500', node.data.state === 'inverted')
      .classed('text-gray-300', node.data.state === 'excluded');

    // Apply styling for excluded values
    d3.selectAll('tr')
      .filter((d) => d === node)
      .select('.leaf')
      .classed('text-red-500 before:content-["-_"]', node.data.state === 'inverted')
      .classed('text-gray-300', node.data.state === 'excluded');

    // Recursively update parent values
    let parent = node.parent;
    while (parent && parent.children) {
      const sum = d3.sum(parent.children, (d) => {
        if (d.data.state === 'inverted') return -(d.data.value ?? 0);
        if (d.data.state === 'excluded') return 0;
        return d.data.value ?? 0;
      });
      parent.data.value = Number(sum.toFixed(4));
      d3.selectAll('tr')
        .filter((d) => d === parent)
        .select('.value-cell')
        .text((parent.data.value ?? 0).toString());
      parent = parent.parent;
    }
  }, []);

  const updateAllChildNodes = useCallback(
    (parentNode: d3.HierarchyNode<HierarchyNodeData>) => {
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
        if (leafNode.data.state === 'original') {
          leafNode.data.state = 'excluded';
        } else if (leafNode.data.state === 'excluded') {
          leafNode.data.state = 'inverted';
        } else {
          leafNode.data.state = 'original';
        }
        updateValues(leafNode);
      });
    },
    [updateValues],
  );

  useEffect(() => {
    // Function to cycle leaf values (Original → Inverted → Excluded)
    const cycleValue = (node: d3.HierarchyNode<HierarchyNodeData>) => {
      if (node.data.state === 'original') {
        node.data.state = 'excluded';
      } else if (node.data.state === 'excluded') {
        node.data.state = 'inverted';
      } else {
        node.data.state = 'original';
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
            updateAllChildNodes(d);
          } else {
            cycleValue(d);
          }
        });

      // Update existing rows
      rows.select('.toggle').text((d) => `${nodeSign} ${d.data.name}`);
      rows.select('.value-cell').text((d) => (d.data.value ?? 0).toString());
    };

    // Compute initial values and render
    renderTable();

    // Cleanup function
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      d3.select(tableRef.current).selectAll('tr').remove();
    };
  }, [nodeSign, paddingSize, root, showTotal, updateAllChildNodes, updateValues]);

  return { tableRef };
};
