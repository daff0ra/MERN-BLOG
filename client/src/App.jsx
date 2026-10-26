import { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthContext from './context/AuthContext'
import { articleApi, profileApi } from './services/api.js'
import Stat from './components/Stat.jsx'
import ArticleCard from './components/ArticleCard.jsx'
import Editor from './pages/Editor.jsx'
import Profile from './pages/Profile.jsx'
import AuthScreen from './pages/AuthScreen.jsx'
import PublicArticle from './pages/PublicArticle.jsx'

const blankArticle = { title: '', summary: '', content: '', topics: '' }
const messageOf = (error) => error.response?.data?.message || 'Terjadi kesalahan. Coba lagi.'

function App() {
  const { user, ready, loading, login, register, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const page = location.state?.previewMode ? 'preview' : pathname.startsWith('/read/') ? 'read' : pathname === '/dashboard/write' ? 'editor' : pathname === '/dashboard/profile' ? 'profile' : 'dashboard'
  const [articles, setArticles] = useState([])
  const [profile, setProfile] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('Semua karya')
  const [editor, setEditor] = useState(null)
  const [publishTarget, setPublishTarget] = useState(null)
  const [visibility, setVisibility] = useState('unlisted')
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' })
  const [readArticle, setReadArticle] = useState(null)

  useEffect(() => {
    if (!user || page === 'read') return
    let active = true
    Promise.all([articleApi.list(), profileApi.get()])
      .then(([articleResponse, profileResponse]) => {
        if (!active) return
        setArticles(articleResponse.data)
        setProfile(profileResponse.data)
      })
      .catch((e) => active && setError(messageOf(e)))
      .finally(() => active && setDataLoading(false))
    return () => { active = false }
  }, [user, page])

  useEffect(() => {
    if (page !== 'read') return
    const slug = pathname.split('/').filter(Boolean).at(-1)
    articleApi.getPublic(slug)
      .then(({ data }) => setReadArticle(data))
      .catch((e) => setError(messageOf(e)))
  }, [page, pathname])

  const visibleArticles = useMemo(() => articles.filter((article) => {
    if (filter === 'Semua karya') return true
    if (filter === 'Draft') return article.status === 'draft'
    return article.status === 'published'
  }), [articles, filter])

  const flash = (text) => { setNotice(text); setError(''); window.setTimeout(() => setNotice(''), 3500) }
  const fail = (e) => { setError(messageOf(e)); setNotice('') }
  const openEditor = (article = null) => {
    setEditor(article ? { ...article, topics: (article.topics || []).join(', ') } : { ...blankArticle })
    navigate('/dashboard/write')
  }
  const backDashboard = () => navigate('/dashboard')
  const saveArticle = async (event) => {
    event.preventDefault(); setBusy(true); setError('')
    const payload = { title: editor.title, content: editor.content, summary: editor.summary, topics: editor.topics.split(',').map((item) => item.trim()).filter(Boolean) }
    try {
      const response = editor._id ? await articleApi.update(editor._id, payload) : await articleApi.create(payload)
      setArticles((items) => editor._id ? items.map((item) => item._id === editor._id ? response.data : item) : [response.data, ...items])
      setEditor({ ...response.data, topics: (response.data.topics || []).join(', ') })
      flash('Draft tersimpan.')
    } catch (e) { fail(e) } finally { setBusy(false) }
  }
  const saveProfile = async (event) => {
    event.preventDefault(); setBusy(true)
    try { const { data } = await profileApi.update(profile); setProfile(data); flash('Profil diperbarui.') }
    catch (e) { fail(e) } finally { setBusy(false) }
  }
  const publish = async () => {
    setBusy(true)
    try {
      const { data } = await articleApi.publish(publishTarget._id, visibility)
      setArticles((items) => items.map((item) => item._id === data._id ? data : item))
      setPublishTarget(null); flash('Karya berhasil diterbitkan.')
    } catch (e) { fail(e) } finally { setBusy(false) }
  }
  const unpublish = async (article) => {
    if (!window.confirm('Tarik karya ini dari tautan publik?')) return
    try { const { data } = await articleApi.unpublish(article._id); setArticles((items) => items.map((item) => item._id === data._id ? data : item)); flash('Karya kembali menjadi draft.') }
    catch (e) { fail(e) }
  }
  const copyArticleLink = async (article) => {
    if (!article.shareSlug) return flash('Tautan belum tersedia. Terbitkan ulang karya untuk membuat tautan baru.')
    try { await navigator.clipboard.writeText(`${window.location.origin}/read/${article.shareSlug}`); flash('Tautan karya disalin.') }
    catch { setError('Clipboard tidak tersedia. Salin tautan dari browser setelah membuka karya.'); setNotice('') }
  }
  const removeArticle = async (article) => {
    if (!window.confirm(`Hapus “${article.title}”? Tindakan ini tidak dapat dibatalkan.`)) return
    try { await articleApi.remove(article._id); setArticles((items) => items.filter((item) => item._id !== article._id)); flash('Karya dihapus.') }
    catch (e) { fail(e) }
  }
  const preview = async (article) => {
    try { const { data } = await articleApi.preview(article._id); setReadArticle({ ...data, author: profile?.displayName || user.username }); navigate(pathname, { state: { previewMode: true } }) }
    catch (e) { fail(e) }
  }
  const submitAuth = async (event) => {
    event.preventDefault(); setError('')
    const ok = authMode === 'login' ? await login(authForm.email, authForm.password) : await register(authForm.username, authForm.email, authForm.password)
    if (!ok) setError('Periksa kembali data akun. Email atau kata sandi mungkin tidak sesuai.')
    else navigate('/dashboard')
  }

  if (!ready) return <div className="loading-screen"><span className="brand-mark">r.</span><span>Menyiapkan ruang kerjamu…</span></div>
  if (page === 'read' || page === 'preview') return <PublicArticle article={readArticle} error={error} preview={page === 'preview'} onBack={backDashboard} />
  if (!user) return <AuthScreen mode={authMode} setMode={setAuthMode} form={authForm} setForm={setAuthForm} onSubmit={submitAuth} loading={loading} error={error} />

  const countDrafts = articles.filter((a) => a.status === 'draft').length
  const countPublished = articles.filter((a) => a.status === 'published').length
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="/dashboard" onClick={(e) => { e.preventDefault(); backDashboard() }}><span className="brand-mark">r.</span><span>ruang<span className="brand-light">karya</span></span></a>
      <div className="workspace-label">RUANG KERJAMU</div>
      <nav className="side-nav" aria-label="Navigasi utama">
        <button className={`nav-item ${page === 'dashboard' ? 'active' : ''}`} onClick={backDashboard}><span>▦</span> Dashboard</button>
        <button className={`nav-item ${page === 'editor' ? 'active' : ''}`} onClick={() => openEditor()}><span>＋</span> Tulis karya</button>
        <button className={`nav-item ${page === 'profile' ? 'active' : ''}`} onClick={() => navigate('/dashboard/profile')}><span>◉</span> Profil saya</button>
      </nav>
      <div className="sidebar-bottom"><div className="sidebar-tip"><span className="tip-icon">✳</span><strong>Cerita prosesmu.</strong><p>Bagikan cara kamu berpikir, mengambil keputusan, dan belajar dari hasilnya.</p></div><button className="user-chip" onClick={() => navigate('/dashboard/profile')}><span className="avatar">{(profile?.displayName || user.username).slice(0, 1).toUpperCase()}</span><span className="user-meta"><strong>{profile?.displayName || user.username}</strong><small>Akun penulis</small></span><span className="user-menu">···</span></button></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumbs"><span>Ruang kerja</span><i>/</i><strong>{page === 'editor' ? (editor?._id ? 'Edit karya' : 'Karya baru') : page === 'profile' ? 'Profil saya' : 'Dashboard'}</strong></div><div className="top-actions"><button className="icon-button" title="Bantuan">?</button><button className="user-top" onClick={logout}><span className="avatar small">{(profile?.displayName || user.username).slice(0, 1).toUpperCase()}</span><span>{profile?.displayName || user.username}</span><span className="chevron">⌄</span></button></div></header>
      {(notice || error) && <div className={`toast ${error ? 'toast-error' : ''}`} role="status">{error || notice}<button onClick={() => { setError(''); setNotice('') }}>×</button></div>}
      {page === 'editor' && editor && <Editor editor={editor} setEditor={setEditor} onSave={saveArticle} onPreview={() => editor._id ? preview(editor) : flash('Simpan draft terlebih dahulu untuk melihat pratinjau.')} onBack={backDashboard} busy={busy} />}
      {page === 'profile' && profile && <Profile profile={profile} setProfile={setProfile} onSave={saveProfile} busy={busy} />}
      {page === 'dashboard' && <>
        <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot" /> RUANG KERJAMU</div><h1>Selamat datang kembali, {profile?.displayName || user.username.split(' ')[0]}.</h1><p className="welcome-copy">Setiap karya adalah jendela ke cara kamu melihat dan menyelesaikan masalah.</p></div><button className="primary-button" onClick={() => openEditor()}><span>＋</span> Tulis karya baru</button></section>
        <section className="stats-grid" aria-label="Ringkasan karya"><Stat icon="▤" label="Total karya" value={articles.length} note="tersimpan di ruangmu" tone="lavender"/><Stat icon="◷" label="Draft" value={countDrafts} note="siap dilanjutkan" tone="sand"/><Stat icon="↗" label="Diterbitkan" value={countPublished} note="dibagikan ke pembaca" tone="mint"/></section>
        <section className="content-section"><div className="section-heading"><div><h2>Karya kamu</h2><p>Ruang untuk menyimpan proses dan pemikiranmu.</p></div><div className="list-controls"><label className="search-box"><span>⌕</span><input aria-label="Cari karya" placeholder="Cari karya..." onChange={(e) => setFilter(e.target.value ? `search:${e.target.value.toLowerCase()}` : 'Semua karya')} /></label><select aria-label="Filter karya" value={filter.startsWith('search:') ? 'Semua karya' : filter} onChange={(e) => setFilter(e.target.value)}><option>Semua karya</option><option>Draft</option><option>Diterbitkan</option></select></div></div>
          <div className="filter-tabs"><button className={filter === 'Semua karya' || filter.startsWith('search:') ? 'selected' : ''} onClick={() => setFilter('Semua karya')}>Semua <span>{articles.length}</span></button><button className={filter === 'Draft' ? 'selected' : ''} onClick={() => setFilter('Draft')}>Draft <span>{countDrafts}</span></button><button className={filter === 'Diterbitkan' ? 'selected' : ''} onClick={() => setFilter('Diterbitkan')}>Diterbitkan <span>{countPublished}</span></button></div>
          {dataLoading && !articles.length ? <div className="empty-state"><span className="spinner"/>Memuat karya…</div> : visibleArticles.length ? <div className="article-list">{visibleArticles.filter((a) => !filter.startsWith('search:') || `${a.title} ${a.summary}`.toLowerCase().includes(filter.slice(7))).map((article) => <ArticleCard key={article._id} article={article} onEdit={() => openEditor(article)} onPreview={() => preview(article)} onPublish={() => { setPublishTarget(article); setVisibility('unlisted') }} onUnpublish={() => unpublish(article)} onDelete={() => removeArticle(article)} onCopyLink={() => copyArticleLink(article)} />)}</div> : <div className="empty-state"><span className="empty-icon">✳</span><h3>{filter === 'Draft' ? 'Belum ada draft' : filter === 'Diterbitkan' ? 'Belum ada karya terbit' : 'Mulai ceritakan prosesmu'}</h3><p>Tuliskan pengalaman, pertimbangan, dan hal yang kamu pelajari dari sebuah pekerjaan.</p><button className="secondary-button" onClick={() => openEditor()}>Buat karya pertama <span>↗</span></button></div>}
        </section>
      </>}
      <footer className="footer"><span>© 2026 Ruang Karya</span><span>Portofolio yang tumbuh dari proses.</span><button onClick={logout}>Keluar</button></footer>
    </main>
    {publishTarget && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setPublishTarget(null)}><section className="publish-modal" role="dialog" aria-modal="true" aria-labelledby="publish-title"><button className="modal-close" onClick={() => setPublishTarget(null)} aria-label="Tutup">×</button><div className="modal-icon">↗</div><div className="eyebrow">BAGIKAN KARYA</div><h2 id="publish-title">Siapa yang boleh membaca?</h2><p>Pilih jangkauan yang paling nyaman untuk cerita ini.</p><div className="visibility-options">{[['unlisted','Melalui tautan','Siapa pun yang memiliki tautan dapat membaca.'],['public','Publik','Karya dapat dibagikan dan ditemukan lewat tautan.'],['private','Pribadi','Simpan sebagai terbitan pribadi tanpa tautan publik.']].map(([value,title,desc]) => <label className={visibility === value ? 'visibility-option chosen' : 'visibility-option'} key={value}><input type="radio" name="visibility" value={value} checked={visibility === value} onChange={() => setVisibility(value)}/><span className="radio-custom"/><span><strong>{title}</strong><small>{desc}</small></span></label>)}</div><div className="modal-actions"><button className="text-button" onClick={() => setPublishTarget(null)}>Batal</button><button className="primary-button" disabled={busy} onClick={publish}>{busy ? 'Menyimpan…' : 'Konfirmasi publikasi'}</button></div></section></div>}
  </div>
}

export default App

