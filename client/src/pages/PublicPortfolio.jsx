import { Link } from 'react-router-dom'

function PublicPortfolio({ portfolio, error }) {
  if (!portfolio && !error) return <div className="loading-screen"><span className="brand-mark">r.</span><span>Membuka portofolio…</span></div>
  if (!portfolio) return <div className="not-found"><span className="brand-mark">r.</span><h1>Portofolio tidak ditemukan</h1><p>{error}</p><Link to="/">Kembali</Link></div>

  const { profile, articles } = portfolio
  const professionalLinks = profile.links.filter((link) => /^https?:\/\//i.test(link))

  return (
    <main className="flex min-h-screen flex-col bg-[#f7f5ed] px-[22px] text-[#171717] max-sm:px-[17px]">
      <header className="mx-auto flex h-[76px] w-full max-w-[1120px] items-center justify-between border-b-2 border-black text-xs font-bold max-sm:h-[60px]">
        <Link className="brand" to="/">
          <span className="brand-mark">r.</span>
          <span>ruang<span className="brand-light">karya</span></span>
        </Link>
        <span className="text-[#625f56] max-sm:hidden">Portofolio profesional</span>
      </header>

      <div className="mx-auto w-full max-w-[1000px] flex-1 px-5">
        <section className="grid grid-cols-12 content-start gap-x-6 pb-[clamp(44px,7vw,76px)] pt-[clamp(52px,9vw,104px)] max-sm:pt-14" aria-labelledby="portfolio-title">
          <div className="eyebrow col-span-full mb-4">PORTOFOLIO NARATIF</div>
          <h1 id="portfolio-title" className="col-span-full m-0 max-w-[900px] break-words text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.065em]">
            {profile.displayName}
          </h1>
          {profile.field && <p className="col-span-full mt-4 text-[clamp(1rem,2vw,1.25rem)] font-bold">{profile.field}</p>}
          {profile.summary && (
            <p className="col-span-full mt-6 whitespace-pre-line text-[clamp(1rem,2vw,1.2rem)] leading-[1.8] text-[#615e55] md:col-span-8">
              {profile.summary}
            </p>
          )}

          {!!profile.skills.length && (
            <ul className="col-span-full mt-7 flex flex-wrap gap-2.5 p-0" aria-label="Keahlian">
              {profile.skills.map((skill) => (
                <li key={skill} className="list-none border-2 border-black bg-[#fffef8] px-3 py-2 text-xs font-bold shadow-[2px_2px_0_#171717]">
                  {skill}
                </li>
              ))}
            </ul>
          )}

          {!!professionalLinks.length && (
            <nav className="col-span-full mt-7 flex flex-wrap gap-x-5 gap-y-3" aria-label="Tautan profesional">
              {professionalLinks.map((link) => (
                <a key={link} className="font-extrabold underline decoration-2 underline-offset-4" href={link} target="_blank" rel="noopener noreferrer">
                  {new URL(link).hostname} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          )}
        </section>

        <section className="border-t-2 border-black py-[clamp(32px,5vw,52px)] pb-[clamp(48px,7vw,72px)]" aria-labelledby="portfolio-work-title">
          <div className="mb-7 grid grid-cols-12 gap-x-6 gap-y-3">
            <div className="eyebrow col-span-full">KARYA PILIHAN</div>
            <h2 id="portfolio-work-title" className="col-span-full m-0 text-[clamp(1.5rem,3vw,2.1rem)] font-extrabold leading-tight tracking-[-0.04em]">
              Cerita di balik proses
            </h2>
          </div>
          {articles.length ? (
            <div className="grid grid-cols-12 gap-5 max-sm:gap-4">
              {articles.map((article) => (
                <Link
                  className="col-span-full flex min-h-[190px] min-w-0 flex-col items-start rounded-[5px] border-2 border-black bg-[#fffef8] p-[clamp(20px,3vw,30px)] text-inherit no-underline shadow-[6px_6px_0_#171717] transition duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#171717] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#6d8a00] md:col-span-6 md:min-h-[230px]"
                  key={article._id}
                  to={`/read/${article.shareSlug}`}
                >
                  <div className="break-words text-[0.68rem] font-extrabold uppercase leading-relaxed tracking-[0.1em] text-[#615e55]">
                    {article.topics.join(' · ') || 'CERITA & PEMIKIRAN'}
                  </div>
                  <h3 className="mt-[18px] break-words text-[clamp(1.15rem,2vw,1.5rem)] font-extrabold leading-snug tracking-[-0.035em]">
                    {article.title}
                  </h3>
                  {article.summary && <p className="mb-6 mt-3 break-words text-sm leading-[1.7] text-[#615e55]">{article.summary}</p>}
                  <span className="mt-auto inline-flex gap-2 pt-6 text-xs font-extrabold">Baca karya <span aria-hidden="true">↗</span></span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="m-0 border-2 border-dashed border-black bg-[#fffef8] p-6 text-sm leading-relaxed text-[#615e55]">
              Belum ada karya publik yang dibagikan.
            </p>
          )}
        </section>
      </div>

      <footer className="mx-auto w-full max-w-[1000px] border-t-2 border-black px-5 py-[17px] text-center text-[10px] text-[#5d594f]">
        © 2026 Ruang Karya <span className="px-1">·</span> Portofolio yang tumbuh dari proses.
      </footer>
    </main>
  )
}

export default PublicPortfolio
