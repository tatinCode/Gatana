import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface TableContent {
  headers: string[];
  rows: string[][];
}

interface TableBlockProps {
  content: TableContent;
  onChange: (content: TableContent) => void;
}

export function TableBlock({ content, onChange }: TableBlockProps) {
  const [tableData, setTableData] = useState(content);

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...tableData.headers];
    newHeaders[index] = value;
    const newData = { ...tableData, headers: newHeaders };
    setTableData(newData);
    onChange(newData);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...tableData.rows];
    newRows[rowIndex][colIndex] = value;
    const newData = { ...tableData, rows: newRows };
    setTableData(newData);
    onChange(newData);
  };

  const addRow = () => {
    const newRow = tableData.headers.map(() => '');
    const newData = { ...tableData, rows: [...tableData.rows, newRow] };
    setTableData(newData);
    onChange(newData);
  };

  const deleteRow = (index: number) => {
    const newData = { ...tableData, rows: tableData.rows.filter((_, i) => i !== index) };
    setTableData(newData);
    onChange(newData);
  };

  const addColumn = () => {
    const newHeaders = [...tableData.headers, `Column ${tableData.headers.length + 1}`];
    const newRows = tableData.rows.map(row => [...row, '']);
    const newData = { headers: newHeaders, rows: newRows };
    setTableData(newData);
    onChange(newData);
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-700/50 rounded-lg overflow-hidden">
      <div className="p-3 bg-zinc-800/30 border-b border-zinc-700/50 flex items-center justify-between">
        <span className="text-sm text-zinc-400">Table</span>
        <div className="flex gap-2">
          <button
            onClick={addColumn}
            className="px-2 py-1 text-xs rounded bg-zinc-700/50 hover:bg-zinc-700 transition-colors"
          >
            + Column
          </button>
          <button
            onClick={addRow}
            className="px-2 py-1 text-xs rounded bg-zinc-700/50 hover:bg-zinc-700 transition-colors"
          >
            + Row
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700/50">
              {tableData.headers.map((header, index) => (
                <th key={index} className="p-2 text-left">
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => updateHeader(index, e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </th>
              ))}
              <th className="p-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-zinc-800/50 group hover:bg-zinc-800/20">
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-2">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="w-full bg-transparent border border-transparent hover:border-zinc-700 focus:border-purple-500 rounded px-2 py-1 text-sm focus:outline-none focus:bg-zinc-800/50"
                    />
                  </td>
                ))}
                <td className="p-2">
                  <button
                    onClick={() => deleteRow(rowIndex)}
                    className="p-1 rounded hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
