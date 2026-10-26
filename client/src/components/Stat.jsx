function Stat({ icon, label, value, note, tone }) 
{ return <article className="stat-card"><span className={`stat-icon ${tone}`}>{icon}</span><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div><span className="stat-arrow">â†—</span></article> }


export default Stat

