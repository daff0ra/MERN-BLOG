function ArticleCard({ article, onEdit, onPreview, onPublish, onUnpublish, onDelete, onCopyLink, onOpenPublic }) {
  const published = article.status === 'published'
  const visibility = article.visibility === 'public' ? 'Publik' : article.visibility === 'private' ? 'Pribadi' : 'Tautan saja'

  return (
    <article className="article-card">
      <div className="article-main">
        <div className="article-title-row">
          <h3>{article.title}</h3>
          <span className={`status-pill ${published ? 'published' : 'draft'}`}>
            <i aria-hidden="true" />
            {published ? 'Diterbitkan' : 'Draft'}
          </span>
        </div>
        <p className="article-summary">
          {article.summary || (article.content || '').replace(/\s+/g, ' ').slice(0, 150) || 'Belum ada ringkasan.'}
        </p>
        <div className="article-meta">
          <span>{article.updatedAt ? `Diperbarui ${dateOf(article.updatedAt)}` : 'Baru dibuat'}</span>
          {(article.topics || []).slice(0, 3).map((topic) => <span className="topic" key={topic}>{topic}</span>)}
          {published && <span className="visibility-label">· {visibility}</span>}
        </div>
      </div>

      <div className="article-actions" role="group" aria-label={`Aksi untuk ${article.title}`}>
        <button className="row-action" type="button" aria-label={`Edit ${article.title}`} onClick={onEdit}>Edit</button>
        <button className="row-action" type="button" aria-label={`Pratinjau ${article.title}`} onClick={onPreview}>Pratinjau</button>
        {published ? (
          <>
            {article.shareSlug && <>
              <button className="row-action" type="button" aria-label={`Buka artikel ${article.title}`} onClick={onOpenPublic}>Buka artikel ↗</button>
              <button className="row-action" type="button" aria-label={`Salin tautan ${article.title}`} onClick={onCopyLink}>Salin tautan</button>
            </>}
            <button className="row-action" type="button" aria-label={`Tarik ${article.title}`} onClick={onUnpublish}>Tarik</button>
          </>
        ) : (
          <button className="row-action row-primary" type="button" onClick={onPublish}>Terbitkan ↗</button>
        )}
        <button className="row-more" type="button" aria-label={`Hapus ${article.title}`} title={`Hapus ${article.title}`} onClick={onDelete}>⌫</button>
      </div>
    </article>
  )
}

const dateOf = (value) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))

export default ArticleCard
