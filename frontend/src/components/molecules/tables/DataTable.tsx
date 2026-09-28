import { ReactNode } from "react";

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (value: unknown, row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  className?: string;
}

export default function DataTable<T>({
  columns,
  data,
  className = "",
}: DataTableProps<T>) {
  return (
    <div
      className={`
        w-full
        overflow-hidden
        rounded-[2px]
        border
        border-outline-default
        bg-surface-default
        
        ${className}
      `}
    >
      <table className="w-full table-fixed border-collapse">
        <thead className="">
          <tr className=" h-[28px] border-b border-outline-strong bg-[#F5F5F4] ">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`
                 px-[24px]
                  py-[24px]
                  text-left
                  align-middle
                  text-[12px]
                  leading-none
                  text-content-secondary
                  font-semibold!
                  ${column.className ?? ""}
                `}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`
                h-[34px]
                border-b
                border-outline-default
                last:border-b-0
                      px-[24px]
        py-[12px]
                ${"bg-surface-raised"}
              `}
            >
              {columns.map((column) => {
                const value =
                  typeof column.key === "string"
                    ? row[column.key as keyof T]
                    : row[column.key];

                return (
                  <td
                    key={String(column.key)}
                    className={`
               
                      py-[16px]
                      px-[24px]
                      align-middle
                      text-[10px]
                      font-normal
                      leading-none
                      text-content-primary
                      
                      ${column.className ?? ""}
                    `}
                  >
                    {column.render
                      ? column.render(value, row)
                      : String(value ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
