import { ShieldCheck } from "lucide-react";

export default function HealthScore({ score = 0 }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  const tone = value >= 80 ? "good" : value >= 55 ? "medium" : "low";
  const label = value >= 80 ? "Looking healthy" : value >= 55 ? "Room to improve" : "Needs attention";
  return (
    <section className="panel health-panel" id="health">
      <div className="panel-heading"><div><div className="section-kicker">DATA QUALITY</div><h3>Dataset health</h3></div><ShieldCheck size={19} className="heading-icon" /></div>
      <div className="health-content">
        <div className={`health-ring health-${tone}`} style={{ "--score": `${value * 3.6}deg` }}>
          <div className="health-ring-inner"><strong>{value.toFixed(0)}<small>%</small></strong><span>score</span></div>
        </div>
        <div className="health-copy"><strong>{label}</strong><p>A quick read on completeness and consistency across your dataset.</p><div className="health-legend"><span><i className="legend-dot green-dot" /> Completeness</span><span><i className="legend-dot purple-dot" /> Uniqueness</span></div></div>
      </div>
    </section>
  );
}
