import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function DataTable({ rows = [], columns = [] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const visibleColumns = columns.length ? columns : Object.keys(rows[0] || {});
  const filtered = useMemo(() => rows.filter((row) => Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(query.toLowerCase()))), [rows, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const rangeStart = filtered.length ? page * pageSize + 1 : 0;
  const rangeEnd = Math.min((page + 1) * pageSize, filtered.length);

  function updateQuery(value) {
    setQuery(value);
    setPage(0);
  }

  return (
    <section className="panel table-panel" id="data">
      <div className="panel-heading table-heading"><div><div className="section-kicker">A CLOSER LOOK</div><h3>Sample data <span className="count-pill">first 5 rows</span></h3></div><label className="search-box"><Search size={15} /><input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search records..." aria-label="Search sample records" /></label></div>
      <div className="table-scroll">
        <table><thead><tr><th className="row-number">#</th>{visibleColumns.map((column) => <th key={column}>{column.replaceAll("_", " ")}</th>)}</tr></thead>
          <tbody>{pageRows.length ? pageRows.map((row, index) => <tr key={`${page}-${index}`}><td className="row-number">{page * pageSize + index + 1}</td>{visibleColumns.map((column) => <td key={column} title={String(row[column] ?? "—")}>{String(row[column] ?? "—") || <span className="null-value">—</span>}</td>)}</tr>) : <tr><td className="no-results" colSpan={visibleColumns.length + 1}>No matching records found.</td></tr>}</tbody>
        </table>
      </div>
      <div className="table-footer"><span>Showing <strong>{rangeStart}–{rangeEnd}</strong> of <strong>{filtered.length}</strong> sample records</span><div className="pagination"><button aria-label="Previous page" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}><ChevronLeft size={16} /></button><span>{page + 1} / {pageCount}</span><button aria-label="Next page" disabled={page >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}><ChevronRight size={16} /></button></div></div>
    </section>
  );
}
