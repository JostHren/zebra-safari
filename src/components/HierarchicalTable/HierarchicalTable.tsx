import * as d3 from 'd3';
import { generateData } from './GenerateData';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface HierarchicalTableProps {
  showTotal?: boolean;
  decimalPlaces?: number;
  paddingSize?: number;
  nodeSign?: string;
  yearsGenerated?: number;
}

export const HierarchicalTable = ({
  showTotal = true,
  decimalPlaces = 1,
  paddingSize = 20,
  nodeSign = '⌵ ',
  yearsGenerated = 200,
}: HierarchicalTableProps) => {
  const ref = useRef(null);
  const root = useMemo(() => generateData(yearsGenerated), [yearsGenerated]);

  root.each((node) => {
    if (!node.children) {
      node.data.state = 0; // 0 = Original, 1 = Inverted, 2 = Excluded
    }
  });

  // Function to compute branch values
  const computeBranchValues = (node) => {
    if (node.children) {
      node.children.forEach(computeBranchValues);
      node.data.value = d3
        .sum(node.children, (d) => (d.data.value !== null ? d.data.value : 0))
        .toFixed(decimalPlaces);
    }
  };

  // Compute initial values for branches
  computeBranchValues(root);

  // Function to update values in hierarchy
  const updateValues = useCallback(
    (node) => {
      console.log('UPDATING');
      // Update clicked node's value display
      d3.selectAll('tr')
        .filter((d) => d === node)
        .select('.value-cell')
        .text(node.data.value !== null ? node.data.value : 0)
        .classed('text-red-500', node.data.state === 2)
        .classed('text-gray-300', node.data.state === 1);

      // Apply styling for excluded values
      d3.selectAll('tr')
        .filter((d) => d === node)
        .select('.leaf')
        .classed('text-red-500 before:content-["-_"]', node.data.state === 2)
        .classed('text-gray-300', node.data.state === 1);

      // Recursively update parent values
      let parent = node.parent;
      while (parent) {
        parent.data.value = d3
          .sum(parent.children, (d) => {
            if (d.data.state === 1) return -d.data.value;
            if (d.data.state === 2) return 0;

            return d.data.value !== null ? d.data.value : 0;
          })
          .toFixed(decimalPlaces);
        d3.selectAll('tr')
          .filter((d) => d === parent)
          .select('.value-cell')
          .text(parent.data.value);
        parent = parent.parent;
      }

      console.log('DONE UPDATING!');
    },
    [decimalPlaces],
  );

  useEffect(() => {
    console.log('UE start');
    // Function to cycle leaf values (Original → Inverted → Excluded)
    const cycleValue = (node) => {
      if (node.data.state === 0) {
        node.data.state = 1;
      } else if (node.data.state === 1) {
        node.data.state = 2;
      } else {
        node.data.state = 0;
      }

      updateValues(node);
    };
    // Function to render table
    const renderTable = () => {
      const tbody = d3.select(ref.current);

      // Flatten only visible nodes for rendering
      let visibleNodes = [];

      const collectNodes = (node, depth = 0) => {
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
        .style('padding-left', (d) => `${d.depth * paddingSize}px`)
        .style('text-align', 'left')
        .style('font-weight', (d) => (d.height !== 0 ? 'bold' : 'normal'))
        .style('cursor', 'pointer')
        .classed('select-none border-b-1', true)
        .text((d) => (d.children ? `${nodeSign} ${d.data.name}` : d.data.name))
        .on('click', function (_event, d) {
          if (d.children) {
            //do nothing
          } else {
            cycleValue(d);
          }
        });

      newRows
        .append('td')
        .attr('class', 'value-cell')
        .text((d) => (d.data.value !== null ? d.data.value : 0))
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
      rows.select('.value-cell').text((d) => d.data.value);

      // Remove old rows
      rows.exit().remove();
    };

    // Compute initial values and render
    renderTable();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => d3.select(ref.current).selectAll('tr').remove();
  }, [decimalPlaces, nodeSign, paddingSize, root, showTotal, updateValues]);

  return (
    <>
      <table className={'w-[260px] border-separate border-spacing-x-4'}>
        <tbody ref={ref}></tbody>
      </table>
    </>
  );
};
