import { Copy, Database, Rows3, Sparkles } from "lucide-react";

const stats = [
  { key: "rows", label: "Total rows", icon: Rows3, format: (value) => Number(value || 0).toLocaleString(), color: "violet", note: "records analyzed" },
  { key: "columns", label: "Total columns", icon: Database, format: (value) => Number(value || 0).toLocaleString(), color: "blue", note: "data attributes" },
  { key: "health_score", label: "Health score", icon: Sparkles, format: (value) => `${Number(value || 0).toFixed(0)}%`, color: "green", note: "overall data quality" },
  { key: "duplicates", label: "Duplicates", icon: Copy, format: (value) => Number(value || 0).toLocaleString(), color: "orange", note: "duplicate records" },
];

export default function StatsCards({ data }) {
  return (
    <div className="stats-grid">
      {stats.map(({ key, label, icon: Icon, format, color, note }, index) => (
        <article className={`stat-card stat-${color} stagger-${index}`} key={key}>
          <div className="stat-top"><span className="stat-label">{label}</span><span className="stat-icon"><Icon size={17} /></span></div>
          <div className="stat-value">{format(data?.[key])}</div>
          <div className="stat-note">{note}</div>
        </article>
      ))}
    </div>
  );
}
