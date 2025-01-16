import { TableProps } from "@/interfaces/interfaces";
import { MdDelete, MdEdit } from "react-icons/md";
import React from "react";

const Table: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {/* Fixed first column for row numbers */}
            <th className="sticky left-0 px-6 py-3 bg-table-header text-left text-xs font-medium text-table-headerText uppercase tracking-wider z-10">
              #
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 bg-table-header text-left text-xs font-medium text-table-headerText uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            {/* Fixed "Actions" column */}
            <th className="sticky right-0 px-6 py-3 bg-table-header text-left text-xs font-medium text-table-headerText uppercase tracking-wider z-10">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 0
                  ? "bg-table-row-default"
                  : "bg-table-row-alternate" // Zebra effect
              } hover:bg-table-row-hover transition-colors duration-200`} // Hover effect
            >
              {/* Fixed first column for row numbers */}
              <td className="sticky left-0 px-6 py-4 whitespace-nowrap text-sm text-table-rowText bg-table-header z-10">
                {rowIndex + 1}
              </td>
              {/* Dynamic columns */}
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-table-rowText"
                >
                  {row[column.key]}
                </td>
              ))}
              {/* Fixed "Actions" column */}
              <td className="sticky right-0 px-6 py-4 whitespace-nowrap text-sm text-table-rowText bg-table-header z-10">
                {/* Add your action buttons or links here */}
                <button className="text-table-edit-default hover:text-table-edit-hover mr-2">
                  <MdEdit size={16} />
                </button>
                <button className="text-table-delete-default hover:text-table-delete-default">
                  <MdDelete size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
