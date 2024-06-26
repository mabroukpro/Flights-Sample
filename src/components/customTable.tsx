import React, { useState, useEffect } from "react";
import { Spinner } from "@phosphor-icons/react";
import classNames from "classnames";

export interface TableColumn<T> {
  title: string;
  dataIndex: keyof T;
  tableClassName?: string;
  render?: ({
    value,
    record,
    rowIndex,
  }: {
    value: T[keyof T];
    record: T;
    rowIndex: number;
  }) => React.ReactNode;
}

interface CustomTableProps<T> {
  columns: TableColumn<T>[];
  loading?: boolean;
  data: T[];
  rowKey: keyof T; // Add rowKey to the props to specify the unique identifier
}

const CustomTable = <T,>({
  columns,
  data,
  loading,
  rowKey,
}: CustomTableProps<T>) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize(); // Check screen size on mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loading) {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-p-6">
        <Spinner className="tw-animate-spin tw-text-gray-500" size={32} />
        <span className="tw-ml-3 tw-text-gray-500 tw-font-medium">
          Loading...
        </span>
      </div>
    );
  }

  if (isSmallScreen) {
    return (
      <div className="tw-flex tw-flex-wrap tw-gap-4 tw-justify-center">
        {data.length > 0 ? (
          data.map((record) => (
            <div
              key={String(record[rowKey])}
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-lg tw-p-4 tw-shadow-md"
            >
              {columns.map((column) => (
                <div
                  key={String(column.dataIndex)}
                  className="tw-mb-2 tw-flex tw-items-center tw-justify-between"
                >
                  <div className="tw-font-semibold">{column.title}</div>
                  <div>
                    {column.render
                      ? column.render({
                          value: record[column.dataIndex],
                          record,
                          rowIndex: data.indexOf(record),
                        })
                      : (record[column.dataIndex] as React.ReactNode)}
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="tw-text-center tw-p-4 tw-text-gray-500">
            No data available
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="tw-overflow-x-auto tw-max-w-full tw-shadow-lg tw-rounded-lg">
      <table className="tw-w-full tw-table-auto tw-border-collapse tw-rounded">
        <thead className="tw-rounded">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.dataIndex)}
                className={classNames(
                  "tw-border tw-border-gray-300 tw-p-2 tw-font-semibold tw-text-left",
                  column.tableClassName
                )}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tw-rounded">
          {!data ? (
            <tr>
              <td>No Data</td>
            </tr>
          ) : data.length > 0 ? (
            data.map((record, rowIndex) => (
              <tr key={String(record[rowKey])} className="tw-even:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={String(column.dataIndex)}
                    className={classNames(
                      "tw-border tw-border-gray-300 tw-p-2",
                      column.tableClassName
                    )}
                  >
                    {column.render
                      ? column.render({
                          value: record[column.dataIndex],
                          record,
                          rowIndex,
                        })
                      : (record[column.dataIndex] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="tw-text-center tw-p-4 tw-text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
