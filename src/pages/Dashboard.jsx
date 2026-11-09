import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowDown, BarChart3, Check, Command, Database, FileText, LayoutDashboard, ShieldCheck, Sparkles, Table2, Upload } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import UploadSection from "../components/UploadSection.jsx";
import StatsCards from "../components/StatsCards.jsx";
import HealthScore from "../components/HealthScore.jsx";
import Insights from "../components/Insights.jsx";
import DataTable from "../components/DataTable.jsx";
import Charts from "../components/Charts.jsx";

const navigation = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard },
  { label: "Data quality", href: "#health", icon: ShieldCheck },
  { label: "Insights", href: "#insights", icon: Sparkles },
  { label: "Visualizations", href: "#visualizations", icon: BarChart3 },
  { label: "Sample data", href: "#data", icon: Table2 },
  { label: "EDA report", href: "#report", icon: FileText },
];

const emptyData = { rows: 0, columns: 0, duplicates: 0, health_score: 0, insights: [], recommendations: [], business_insights: [], sample_data: [], column_names: [], charts: [], correlation: {}, missing_values: {} };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [filename, setFilename] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("ai-analyst-theme") || "light");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dashboardData = data || emptyData;
  const missingEntries = useMemo(() => Object.entries(dashboardData.missing_values || {}).filter(([, count]) => Number(count) > 0), [dashboardData.missing_values]);
  const correlationPairs = useMemo(() => {
    const pairs = [];
    for (const [left, values] of Object.entries(dashboardData.correlation || {})) {
      for (const [right, value] of Object.entries(values || {})) {
        if (left < right && Math.abs(Number(value)) >= 0.7) pairs.push({ left, right, value: Number(value) });
      }
    }
    return pairs;
  }, [dashboardData.correlation]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("ai-analyst-theme", theme);
  }, [theme]);

  function handleUpload(result, file) {
    setData(result);
    setFilename(file.name);
    window.setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }

  return (
    <div className="app-shell" id="overview">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <a className="sidebar-brand" href="#overview"><span className="brand-mark"><Command size={17} /></span><span>data<span className="brand-light">wise</span></span><span className="brand-beta">AI</span></a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">{navigation.map(({ label, href, icon: Icon }, index) => <a className={`side-link ${index === 0 ? "active" : ""}`} href={href} key={href} onClick={() => setMobileNavOpen(false)}><Icon size={17} /><span>{label}</span>{label === "Insights" && data && <span className="side-nav-count">{dashboardData.insights?.length || 0}</span>}</a>)}</nav>
        <div className="sidebar-bottom"><div className="sidebar-tip"><div className="tip-icon"><Sparkles size={15} /></div><strong>Small file, big picture.</strong><p>Start with a CSV and let your data tell its story.</p><a href="#upload" onClick={() => setMobileNavOpen(false)}>Get started <ArrowDown size={13} /></a></div><div className="sidebar-version"><span className="version-dot" /> AI Data Analyst <span>v1.0</span></div></div>
      </aside>
      {mobileNavOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      <div className="main-area">
        <Navbar theme={theme} onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")} onMenuClick={() => setMobileNavOpen((open) => !open)} />
        <main className="dashboard-content">
          <div className="page-intro"><div><div className="greeting-label"><span className="greeting-dot" /> YOUR ANALYTICS WORKSPACE</div><h1>AI Data Analyst<span className="title-period">.</span></h1><p>Upload CSV files and get automated EDA, visualizations, business insights and health score.</p></div><div className="intro-date"><Activity size={14} /> {data ? "Analysis ready" : "Ready when you are"}</div></div>
          <UploadSection onUploadComplete={handleUpload} hasData={Boolean(data)} />
          {data && <div className="active-file"><span className="active-file-icon"><Database size={14} /></span><span>Currently exploring <strong>{filename}</strong></span><span className="file-ready"><Check size={12} /> Analyzed</span></div>}
          <div className="results-section" id="results">
            <div className="section-title-row"><div><div className="section-kicker">AT A GLANCE</div><h2>Dataset overview</h2></div><span className="section-caption">{data ? "Your data, summarized" : "Your overview will appear after upload"}</span></div>
            <StatsCards data={dashboardData} />
            <div className="overview-lower"><HealthScore score={dashboardData.health_score} /><section className="panel schema-panel"><div className="panel-heading"><div><div className="section-kicker">DATASET STRUCTURE</div><h3>Column profile</h3></div><Database size={19} className="heading-icon" /></div>{dashboardData.column_names.length ? <div className="column-list">{dashboardData.column_names.map((column) => <div className="column-chip" key={column}><span className="column-type">{dashboardData.data_types?.[column]?.includes("int") || dashboardData.data_types?.[column]?.includes("float") ? "123" : "Aa"}</span>{column}<span className="column-missing">{Number(dashboardData.missing_values?.[column] || 0)} missing</span></div>)}</div> : <div className="section-placeholder"><Database size={18} /><span>Upload a CSV to see its columns and data types.</span></div>}</section></div>
            <Insights insights={dashboardData.insights || []} recommendations={dashboardData.recommendations || []} businessInsights={dashboardData.business_insights || []} />
            <Charts charts={dashboardData.charts || []} correlation={dashboardData.correlation || {}} />
            <DataTable rows={dashboardData.sample_data || []} columns={dashboardData.column_names || []} />
            <section className="panel report-panel" id="report">
              <div className="panel-heading"><div><div className="section-kicker">YOUR TAKEAWAY</div><h3>EDA report</h3></div><FileText size={19} className="heading-icon" /></div>
              <div className="report-grid">
                <article className="report-block"><div className="report-block-title"><span className="report-icon report-violet"><ShieldCheck size={15} /></span><strong>Dataset health</strong></div><p>{data ? `Your dataset scores ${Number(dashboardData.health_score || 0).toFixed(1)} out of 100 for completeness and uniqueness.` : "A quality summary will be generated after your dataset is analyzed."}</p></article>
                <article className="report-block"><div className="report-block-title"><span className="report-icon report-orange"><Database size={15} /></span><strong>Missing values</strong></div><p>{data ? missingEntries.length ? `${missingEntries.map(([column, count]) => `${column} (${count})`).join(", ")} ${missingEntries.length === 1 ? "has" : "have"} missing values.` : "No missing values found across your columns." : "Missing value details will appear here."}</p></article>
                <article className="report-block"><div className="report-block-title"><span className="report-icon report-blue"><Activity size={15} /></span><strong>Correlation summary</strong></div><p>{data ? correlationPairs.length ? correlationPairs.map(({ left, right, value }) => `${left} and ${right} are ${value > 0 ? "positively" : "negatively"} correlated (${value.toFixed(2)})`).join(". ") + "." : Object.keys(dashboardData.correlation || {}).length ? "No strong feature correlations (|r| ≥ 0.70) detected." : "Not enough numeric columns to calculate correlations." : "Relationships between numeric variables will be summarized here."}</p></article>
                <article className="report-block"><div className="report-block-title"><span className="report-icon report-green"><Sparkles size={15} /></span><strong>Business insights</strong></div><p>{data ? dashboardData.business_insights?.length ? dashboardData.business_insights.join(". ") + "." : "No recognized business patterns in this dataset yet." : "Key business patterns from your data will appear here."}</p></article>
              </div>
              <div className="report-footer"><span><Sparkles size={13} /> Generated from {filename || "your uploaded dataset"}</span><span>AI Data Analyst · EDA summary</span></div>
            </section>
            <footer className="page-footer"><span><span className="footer-mark"><Command size={13} /></span> Thoughtful analysis starts with good data.</span><span>Made for curious minds <span className="footer-heart">✳</span></span></footer>
          </div>
        </main>
      </div>
    </div>
  );
}
