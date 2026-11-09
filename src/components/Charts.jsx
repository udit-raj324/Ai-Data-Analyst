import { Activity, BarChart3, ChartNoAxesColumn, Grid2X2 } from "lucide-react";
import { getChartUrl } from "../services/api.js";

export default function Charts({ charts = [], correlation = {} }) {
  const heatmap = charts.find((chart) => chart.file?.toLowerCase().includes("heatmap") || chart.column === "correlation");
  const histograms = charts.filter((chart) => chart !== heatmap);
  const matrix = Object.entries(correlation || {});
  const matrixColumns = matrix.map(([column]) => column);
  const hasCorrelation = matrix.length > 0;
  return (
    <div className="visuals-layout" id="visualizations">
      <section className="panel chart-panel">
        <div className="panel-heading"><div><div className="section-kicker">PATTERNS AT A GLANCE</div><h3>Visualizations</h3></div><ChartNoAxesColumn size={19} className="heading-icon" /></div>
        {charts.length ? <div className="chart-grid">{histograms.map((chart) => <article className="chart-tile" key={chart.file}><div className="chart-title"><span className="chart-icon"><BarChart3 size={15} /></span><strong>{chart.column}</strong><span className="chart-type">HISTOGRAM</span></div><div className="chart-image-wrap"><img src={getChartUrl(chart.file)} alt={`Histogram showing the distribution of ${chart.column}`} loading="lazy" /></div></article>)}</div> : <div className="visual-empty"><div className="visual-empty-icon"><BarChart3 size={22} /></div><strong>Your charts will appear here</strong><span>Upload a dataset with numeric columns to generate visualizations.</span></div>}
      </section>
      <section className="panel correlation-panel" id="correlation">
        <div className="panel-heading"><div><div className="section-kicker">HOW VARIABLES RELATE</div><h3>Correlation matrix</h3></div><Grid2X2 size={19} className="heading-icon" /></div>
        {heatmap ? <div className="heatmap-preview"><img src={getChartUrl(heatmap.file)} alt="Correlation heatmap for numeric columns" loading="lazy" /></div> : null}
        {hasCorrelation ? <div className="matrix-wrap"><table className="matrix-table"><thead><tr><th></th>{matrixColumns.map((column) => <th key={column}>{shorten(column)}</th>)}</tr></thead><tbody>{matrix.map(([row, values]) => <tr key={row}><th title={row}>{shorten(row)}</th>{matrixColumns.map((column) => { const value = Number(values?.[column] ?? 0); return <td key={column} title={`${row} and ${column}: ${value.toFixed(2)}`} style={{ "--heat": `${Math.min(1, Math.abs(value)) * 0.8 + 0.1}`, "--positive": value >= 0 ? 1 : 0 }} className={value >= 0 ? "corr-positive" : "corr-negative"}>{value.toFixed(2)}</td>; })}</tr>)}</tbody></table></div> : !heatmap ? <div className="correlation-empty"><Activity size={19} /><span>Correlation appears when your dataset has at least two numeric columns.</span></div> : null}
        {hasCorrelation && <div className="correlation-legend"><span><i className="legend-dot green-dot" /> Positive</span><span><i className="legend-dot purple-dot" /> Negative</span></div>}
      </section>
    </div>
  );
}

function shorten(value) {
  return value.length > 12 ? `${value.slice(0, 10)}…` : value;
}
