function Editor({ editor, setEditor, onSave, onPreview, onBack, busy }) {
  const set = (key, value) => setEditor((current) => ({ ...current, [key]: value }))
  const contentLength = (editor.content || '').length

  return (
    <section className="editor-page">
      <div className="editor-top">
        <button className="back-button" type="button" onClick={onBack}>
          <span>Kembali ke dashboard</span>
        </button>
        <div className="editor-tools">
          <span className="save-state"><i aria-hidden="true" /> Simpan draft untuk menyimpan perubahan</span>
          <button className="secondary-button" type="button" onClick={onPreview}>Pratinjau</button>
          <button className="primary-button" type="button" onClick={onSave} disabled={busy}>
            {busy ? 'Menyimpan' : 'Simpan draft'}
          </button>
        </div>
      </div>

      <div className="editor-layout">
        <form className="writing-area" onSubmit={onSave}>
          <div className="eyebrow">RUANG UNTUK BERTUMBUH</div>
          <label className="sr-only" htmlFor="article-title">Judul karya</label>
          <input
            id="article-title"
            className="title-input"
            value={editor.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Beri judul pada ceritamu"
            required
            minLength="3"
            maxLength="120"
          />
          <label className="sr-only" htmlFor="article-summary">Ringkasan karya</label>
          <textarea
            id="article-summary"
            className="summary-input"
            value={editor.summary || ''}
            onChange={(e) => set('summary', e.target.value)}
            placeholder="Ringkasan singkat — apa inti cerita ini?"
            maxLength="300"
            rows="2"
          />
          <div className="editor-divider" />
          <label className="content-label" htmlFor="article-content">CERITAKAN PROSESMU</label>
          <p className="writing-prompt">Apa tantangannya? Apa yang kamu pertimbangkan? Apa yang kamu lakukan, dan apa yang kamu pelajari?</p>
          <textarea
            id="article-content"
            className="content-input"
            value={editor.content}
            onChange={(e) => set('content', e.target.value)}
            placeholder={'Mulai dari konteks yang paling penting bagi pembaca…\n\nKamu bisa menceritakan situasi, keputusan yang diambil, hasil, dan refleksi setelahnya. Tidak harus sempurna — ini ruang untuk berpikir.'}
            required
            maxLength="20000"
          />
          <div className="content-count" aria-label={`${contentLength.toLocaleString('id-ID')} dari 20.000 karakter`}>{contentLength.toLocaleString('id-ID')} / 20.000 karakter</div>
          <button className="mobile-save primary-button" type="submit" disabled={busy}>{busy ? 'Menyimpan' : 'Simpan draft'}</button>
        </form>

        <aside className="editor-aside" aria-label="Panduan menulis">
          <div className="aside-card">
            <span className="aside-spark" aria-hidden="true">✳</span>
            <h3>Ceritakan cara berpikirmu.</h3>
            <p>Pembaca ingin memahami proses di balik hasil. Detailkan pertimbangan dan kontribusimu.</p>
            <div className="prompt-list">
              <span><b>01</b> Konteks & tantangan</span>
              <span><b>02</b> Pertimbangan & pilihan</span>
              <span><b>03</b> Tindakan & kontribusi</span>
              <span><b>04</b> Hasil & pembelajaran</span>
            </div>
          </div>
          <label className="topic-field">TOPIK <span>pisahkan dengan koma</span><input value={editor.topics || ''} onChange={(e) => set('topics', e.target.value)} placeholder="mis. produk, riset, kepemimpinan" /></label>
          <div className="private-note"><span aria-hidden="true">□</span><p><strong>Draft bersifat pribadi</strong><br />Karyamu hanya akan dibagikan setelah kamu memilih untuk menerbitkannya.</p></div>
        </aside>
      </div>
    </section>
  )
}

export default Editor
