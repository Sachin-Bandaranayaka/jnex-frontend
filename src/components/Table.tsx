// components/Table.tsx
import { TableProps } from "@/interfaces/interfaces";
import React from "react";

const Table: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td
                key={column.key}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
              >
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
