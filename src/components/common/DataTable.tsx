import type { ReactNode } from 'react'

interface Column<T> {
  label: string
  key: keyof T | string
  align?: 'left' | 'right' | 'center'
  width?: string
  render?: (row: T) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  zebra?: boolean
}

export default function DataTable<T>({
  columns,
  rows,
  zebra,
}: DataTableProps<T>) {
  return (
    <div className={`data-table__wrapper ${zebra ? 'data-table__wrapper--zebra' : ''}`}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} style={{ textAlign: col.align ?? 'left', width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => {
                const content = col.render ? col.render(row) : (row[col.key as keyof T] as ReactNode)
                return (
                  <td key={String(col.key)} style={{ textAlign: col.align ?? 'left' }}>
                    {content}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
