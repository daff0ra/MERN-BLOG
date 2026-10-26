function ArticleCard({ article, onEdit, onPreview, onPublish, onUnpublish, onDelete, onCopyLink }) {
  const published = article.status === 'published'
  return <article className="article-card"><div className="article-main"><div className="article-title-row"><h3>{article.title}</h3><span className={`status-pill ${published ? 'published' : 'draft'}`}><i/>{published ? 'Diterbitkan' : 'Draft'}</span></div><p className="article-summary">{article.summary || (article.content || '').replace(/\s+/g, ' ').slice(0, 150) || 'Belum ada ringkasan.'}</p><div className="article-meta"><span>{article.updatedAt ? `Diperbarui ${dateOf(article.updatedAt)}` : 'Baru dibuat'}</span>{(article.topics || []).slice(0, 3).map((topic) => <span className="topic" key={topic}>{topic}</span>)}{published && <span className="visibility-label">Â· {article.visibility === 'public' ? 'Publik' : article.visibility === 'private' ? 'Pribadi' : 'Tautan saja'}</span>}</div></div><div className="article-actions"><button className="row-action" onClick={onEdit}>Edit</button><button className="row-action" onClick={onPreview}>Pratinjau</button>{published ? <><button className="row-action" onClick={onCopyLink}>Salin tautan</button><button className="row-action" onClick={onUnpublish}>Tarik</button></> : <button className="row-action row-primary" onClick={onPublish}>Terbitkan â†—</button>}<button className="row-more" aria-label="Hapus karya" title="Hapus karya" onClick={onDelete}>âŒ«</button></div></article>
}

const dateOf = (value) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))


export default ArticleCard

