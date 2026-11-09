import { ArrowUpRight, Lightbulb, ScanSearch, Sparkles, TriangleAlert } from "lucide-react";

function businessLabel(insight) {
  const text = insight.toLowerCase();
  if (text.includes("successful")) return { label: "Success rate", icon: "↗", tint: "teal" };
  if (text.includes("vehicle")) return { label: "Most used vehicle", icon: "✳", tint: "blue" };
  if (text.includes("pickup")) return { label: "Busiest pickup", icon: "⌖", tint: "orange" };
  if (text.includes("drop")) return { label: "Popular destination", icon: "⌖", tint: "purple" };
  if (text.includes("average booking")) return { label: "Average booking value", icon: "₹", tint: "green" };
  if (text.includes("payment")) return { label: "Preferred payment", icon: "◈", tint: "pink" };
  return { label: "Business insight", icon: "✦", tint: "purple" };
}

export default function Insights({ insights = [], recommendations = [], businessInsights = [] }) {
  return (
    <div className="insights-layout" id="insights">
      <section className="panel insight-panel">
        <div className="panel-heading"><div><div className="section-kicker">WHAT WE FOUND</div><h3>Dataset insights <span className="count-pill">{insights.length}</span></h3></div><ScanSearch size={19} className="heading-icon" /></div>
        {insights.length ? <div className="insight-list">{insights.map((item, index) => <div className="insight-row" key={`${item}-${index}`}><span className="insight-bullet"><TriangleAlert size={14} /></span><span>{item}</span></div>)}</div> : <div className="empty-insight"><span className="calm-icon"><Sparkles size={17} /></span><div><strong>Looking good so far</strong><p>No data quality issues were detected.</p></div></div>}
      </section>
      <section className="panel recommendation-panel">
        <div className="panel-heading"><div><div className="section-kicker">NEXT BEST STEPS</div><h3>Recommendations</h3></div><Lightbulb size={19} className="heading-icon" /></div>
        {recommendations.length ? <div className="recommendation-list">{recommendations.map((item, index) => <div className="recommendation-row" key={`${item}-${index}`}><span className="recommendation-number">0{index + 1}</span><span>{item}</span><ArrowUpRight size={14} /></div>)}</div> : <div className="empty-insight"><span className="calm-icon"><CheckIcon /></span><div><strong>All clear</strong><p>No recommendations right now.</p></div></div>}
      </section>
      <section className="panel business-panel">
        <div className="panel-heading"><div><div className="section-kicker">THE BIG PICTURE</div><h3>Business insights</h3></div><Sparkles size={19} className="heading-icon" /></div>
        {businessInsights.length ? <div className="business-grid">{businessInsights.map((item, index) => { const meta = businessLabel(item); return <article className={`business-card business-${meta.tint}`} key={`${item}-${index}`}><span className="business-symbol">{meta.icon}</span><span className="business-label">{meta.label}</span><strong>{item}</strong></article>; })}</div> : <div className="empty-insight"><span className="calm-icon"><Sparkles size={17} /></span><div><strong>Insights will show up here</strong><p>We’ll look for patterns in the columns we recognize.</p></div></div>}
      </section>
    </div>
  );
}

function CheckIcon() {
  return <Sparkles size={17} />;
}
