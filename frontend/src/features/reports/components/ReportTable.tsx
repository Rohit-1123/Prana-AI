import { useState } from "react";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, FileText, Download } from "lucide-react";
import { type ReportTemplate } from "./ReportCard";

interface ReportTableProps {
  logs: ReportTemplate[];
  onPreview: (report: ReportTemplate) => void;
}

type SortKey = "title" | "type" | "lastGenerated";

export function ReportTable({ logs, onPreview }: ReportTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lastGenerated");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const filtered = logs.filter(l => 
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.type.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];
    
    return sortDesc 
      ? bVal.localeCompare(aVal)
      : aVal.localeCompare(bVal);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const paginated = sorted.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="glass-card p-6 flex flex-col gap-5">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="font-bold text-sm text-foreground">Briefing compilation history</h4>
          <span className="text-[10px] text-muted mt-1 block">Ledger tracking generated summaries and exports</span>
        </div>

        <div className="relative w-full sm:w-64 bg-muted/5 border border-border rounded-xl flex items-center px-3 py-1.5 shadow-theme">
          <Search className="w-3.5 h-3.5 text-muted mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search report logs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-transparent border-none outline-none text-xs text-foreground placeholder-muted w-full focus:ring-0"
          />
        </div>
      </div>

      {/* Grid Canvas Table */}
      <div className="overflow-x-auto border border-border rounded-xl mt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/5 text-muted font-bold uppercase tracking-wider text-[9px]">
              <th className="p-3.5 pr-4 cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("title")}>
                <div className="flex items-center gap-1">Report Name {sortKey === "title" && (sortDesc ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}</div>
              </th>
              <th className="p-3.5 pr-4 cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("type")}>
                <div className="flex items-center gap-1">Type {sortKey === "type" && (sortDesc ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}</div>
              </th>
              <th className="p-3.5 pr-4 text-center">Compiled By</th>
              <th className="p-3.5 pr-4 text-center cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("lastGenerated")}>
                <div className="flex items-center justify-center gap-1">Compile Date {sortKey === "lastGenerated" && (sortDesc ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}</div>
              </th>
              <th className="p-3.5 pr-4 text-center">Status</th>
              <th className="p-3.5 pr-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground">
            {paginated.length > 0 ? (
              paginated.map((row) => (
                <tr key={row.id} className="hover:bg-muted/5 transition-colors">
                  <td className="p-3.5 font-bold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <span>{row.title}</span>
                  </td>
                  <td className="p-3.5 font-semibold text-muted">{row.type}</td>
                  <td className="p-3.5 text-center font-medium">PranaAI Decision Engine</td>
                  <td className="p-3.5 text-center font-medium">{row.lastGenerated}</td>
                  <td className="p-3.5 text-center">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border border-success/20 text-success bg-success/5 inline-block">
                      Compiled
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => onPreview(row)}
                        className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        Preview
                      </button>
                      <button 
                        onClick={() => alert("CSV data brief download triggered.")}
                        className="text-muted hover:text-foreground cursor-pointer"
                        title="Download CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-xs text-muted italic">No reports found matching query</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center text-xs text-muted mt-2 px-1">
        <span>Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sorted.length)} of {sorted.length} records</span>
        
        <div className="flex gap-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted/10 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted/10 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

    </div>
  );
}
