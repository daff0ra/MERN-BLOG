function PublicArticle({ article, error, preview, onBack }) {
  if (!article && !error) return <div className="loading-screen"><span className="brand-mark">r.</span><span>Membuka karyaâ€¦</span></div>
  if (!article) return <div className="not-found"><span className="brand-mark">r.</span><h1>Karya tidak ditemukan</h1><p>{error}</p><a href="/">Kembali</a></div>
  return <main className="reading-page"><header className="reading-header"><a className="brand" href="/"><span className="brand-mark">r.</span><span>ruang<span className="brand-light">karya</span></span></a><span>{preview ? 'Pratinjau privat' : 'Sebuah cerita proses'}</span>{preview && <button className="text-button" onClick={onBack}>â† Kembali ke editor</button>}</header><article className="reading-article">{preview && <div className="preview-banner">Pratinjau hanya terlihat olehmu</div>}<div className="eyebrow">{(article.topics || []).join(' Â· ') || 'CERITA & PEMIKIRAN'}</div><h1>{article.title}</h1>{article.summary && <p className="reading-summary">{article.summary}</p>}<div className="author-line"><span className="avatar">{(article.author || 'P').slice(0,1).toUpperCase()}</span><span><strong>{article.author || 'Penulis'}</strong><small>{article.updatedAt ? dateOf(article.updatedAt) : 'Pratinjau'}</small></span></div><div className="reading-divider"/><div className="reading-content">{(article.content || '').split('\n').map((paragraph, index) => paragraph ? <p key={index}>{paragraph}</p> : <br key={index}/>)}</div><div className="reading-end"><span>âœ³</span><p>Terima kasih sudah membaca cerita ini.</p></div></article>{!preview && article.authorPortfolioId && <p className="reading-footer"><a href={`/portfolio/${article.authorPortfolioId}`}>Lihat portofolio penulis ↗</a></p>}<footer className="reading-footer">Â© 2026 Ruang Karya <span>Â·</span> Cerita yang tumbuh dari proses.</footer></main>
}

const dateOf = (value) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))


export default PublicArticle

