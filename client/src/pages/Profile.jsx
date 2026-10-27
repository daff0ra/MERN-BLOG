function Profile({ profile, setProfile, onSave, onSavePortfolio, articles, busy, userId }) {
  const update = (key, value) => setProfile((current) => ({ ...current, [key]: value }))
  const selectedIds = profile.portfolioArticleIds || []
  const eligibleArticles = articles.filter((article) => article.status === 'published' && article.visibility === 'public')
  const selectedArticles = selectedIds.map((id) => eligibleArticles.find((article) => String(article._id) === String(id))).filter(Boolean)
  const toggleArticle = (id, checked) => update('portfolioArticleIds', checked
    ? [...selectedIds, id]
    : selectedIds.filter((selectedId) => String(selectedId) !== String(id)))
  const moveArticle = (index, offset) => {
    const next = [...selectedArticles]
    const [article] = next.splice(index, 1)
    next.splice(index + offset, 0, article)
    update('portfolioArticleIds', next.map((item) => String(item._id)))
  }

  return (
    <section className="profile-page">
      <div className="eyebrow">IDENTITAS PROFESIONAL</div>
      <h1>Profil kamu</h1>
      <p className="welcome-copy">Perkenalkan dirimu dengan cara yang terasa paling mewakili.</p>
      {profile.portfolioPublic && userId && (
        <a className="mt-3 inline-flex items-center gap-1 bg-transparent py-1 text-xs font-extrabold text-black underline decoration-2 underline-offset-4 hover:text-[#536d00]" href={`/portfolio/${userId}`}>
          Lihat portofolio publik ↗
        </a>
      )}

      <form className="profile-form" onSubmit={onSave}>
        <label>Nama tampilan<input value={profile.displayName || ''} onChange={(e) => update('displayName', e.target.value)} minLength="2" maxLength="60" required /></label>
        <label>Bidang yang kamu tekuni<input value={profile.field || ''} onChange={(e) => update('field', e.target.value)} maxLength="80" placeholder="mis. Product design" /></label>
        <label className="wide-field">Ringkasan profesional<textarea value={profile.summary || ''} onChange={(e) => update('summary', e.target.value)} maxLength="500" rows="4" placeholder="Apa yang kamu kerjakan dan hal apa yang ingin kamu eksplorasi?" /></label>
        <label className="wide-field">Keahlian <span className="field-hint">pisahkan dengan koma, maksimal 10</span><input value={(profile.skills || []).join(', ')} onChange={(e) => update('skills', e.target.value.split(',').map((x) => x.trim()).filter(Boolean).slice(0, 10))} placeholder="mis. riset, komunikasi, strategi" /></label>
        <label className="wide-field">Tautan profesional <span className="field-hint">satu tautan per baris, maksimal 5</span><textarea value={(profile.links || []).join('\n')} onChange={(e) => update('links', e.target.value.split('\n').map((x) => x.trim()).filter(Boolean).slice(0, 5))} rows="3" placeholder="https://…" /></label>
        <label className="col-span-full !flex items-start gap-3 border-2 border-black bg-[#c9efff] p-4 shadow-[3px_3px_0_#171717]">
          <input className="!mt-0 !h-[17px] !w-[17px] !shrink-0 accent-black" type="checkbox" checked={Boolean(profile.portfolioPublic)} onChange={(e) => update('portfolioPublic', e.target.checked)} />
          <span><strong className="block text-sm font-extrabold text-black">Aktifkan portofolio publik</strong><small className="mt-1 block text-xs leading-relaxed text-[#55534d]">Profil dan karya berstatus publik dapat dilihat siapa pun yang memiliki tautan.</small></span>
        </label>
        <div className="profile-submit"><button className="primary-button" disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan perubahan'}</button></div>
      </form>

      <section className="mt-10 grid max-w-[800px] grid-cols-12 gap-x-6 rounded-[5px] border-2 border-black bg-[#fffef8] p-[clamp(20px,4vw,30px)] shadow-[6px_6px_0_#171717] max-sm:mt-8 max-sm:gap-x-4" aria-labelledby="portfolio-selection-title">
        <div className="eyebrow col-span-full mb-2.5">PILIHAN KARYA</div>
        <h2 className="col-span-full m-0 text-[clamp(1.3rem,2.6vw,1.75rem)] font-extrabold tracking-tight" id="portfolio-selection-title">Atur karya portofolio</h2>
        <p className="col-span-full mb-0 mt-2.5 max-w-[58ch] text-[0.82rem] leading-relaxed text-[#615e55]">Pilih hingga 20 karya yang berstatus publik. Urutan di bawah akan menjadi urutan kartu di portofolio.</p>
        {!eligibleArticles.length ? (
          <p className="col-span-full mb-0 mt-5 border-[1.5px] border-dashed border-black bg-white p-4 text-sm leading-relaxed text-[#615e55]">
            Belum ada karya publik. Terbitkan karya dengan visibilitas Publik untuk memilihnya di sini.
          </p>
        ) : (
          <>
            <ol className="col-span-full mt-6 grid list-none gap-2 p-0" aria-label="Urutan karya portofolio">
              {selectedArticles.map((article, index) => (
                <li className="grid min-w-0 grid-cols-[30px_minmax(0,1fr)_auto_auto] items-center gap-2.5 border-[1.5px] border-black bg-white p-3 max-sm:grid-cols-[28px_minmax(0,1fr)_auto] max-sm:gap-2" key={article._id}>
                  <span className="grid h-[26px] w-[26px] place-items-center rounded-full border-[1.5px] border-black bg-[#d4ff3f] text-xs font-extrabold">{index + 1}</span>
                  <span className="min-w-0 break-words text-[0.84rem] font-bold leading-relaxed">{article.title}</span>
                  <button type="button" className="border-[1.5px] border-black bg-white px-2 py-1.5 text-[0.7rem] font-bold hover:bg-[#d4ff3f] disabled:cursor-not-allowed disabled:opacity-40 max-sm:col-start-2" aria-label={`Geser ${article.title} ke atas`} disabled={busy || index === 0} onClick={() => moveArticle(index, -1)}>Naik</button>
                  <button type="button" className="border-[1.5px] border-black bg-white px-2 py-1.5 text-[0.7rem] font-bold hover:bg-[#d4ff3f] disabled:cursor-not-allowed disabled:opacity-40 max-sm:col-start-3" aria-label={`Geser ${article.title} ke bawah`} disabled={busy || index === selectedArticles.length - 1} onClick={() => moveArticle(index, 1)}>Turun</button>
                </li>
              ))}
            </ol>
            <div className="col-span-full mt-7">
              <h3 className="mb-3 mt-0 text-sm font-extrabold">Pilih karya publik</h3>
              {eligibleArticles.map((article) => (
                <label className="grid cursor-pointer grid-cols-[18px_minmax(0,1fr)] items-start gap-3 border-t border-[#c9c6bb] py-3" key={article._id}>
                  <input className="!mt-0 !h-[17px] !w-[17px] accent-black" type="checkbox" checked={selectedIds.some((id) => String(id) === String(article._id))} disabled={busy || (!selectedIds.some((id) => String(id) === String(article._id)) && selectedIds.length >= 20)} onChange={(event) => toggleArticle(String(article._id), event.target.checked)} />
                  <span><strong className="block break-words text-[0.82rem] font-bold leading-relaxed">{article.title}</strong>{article.summary && <small className="mt-1 block break-words text-xs leading-relaxed text-[#68645b]">{article.summary}</small>}</span>
                </label>
              ))}
            </div>
          </>
        )}
        <div className="col-span-full mt-6 flex items-center justify-between gap-4 border-t-2 border-black pt-4 max-sm:flex-col max-sm:items-stretch">
          <span className="text-xs font-bold text-[#615e55]">{selectedArticles.length} / 20 dipilih</span>
          <button type="button" className="primary-button max-sm:w-full" onClick={onSavePortfolio} disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan pilihan karya'}</button>
        </div>
      </section>
    </section>
  )
}

export default Profile
