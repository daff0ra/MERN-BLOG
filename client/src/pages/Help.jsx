function Help({ onNavigate }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 lg:px-12" aria-labelledby="help-title">
      <div className="mb-8 max-w-2xl">
        <p className="eyebrow">RUANG KERJAMU</p>
        <h1 id="help-title" className="mt-3 font-serif text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">Bantuan</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">Pilih bagian yang ingin kamu lanjutkan. Tautan di bawah membuka halaman terkait langsung.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-md border-2 border-stone-950 bg-white p-5 shadow-[4px_4px_0_#171717]">
          <h2 className="font-serif text-lg font-bold text-stone-950">Menulis karya</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">Buat draft, susun cerita proses, lalu simpan perubahanmu.</p>
          <button className="secondary-button mt-5" type="button" onClick={() => onNavigate('/dashboard/write')}>Buka editor <span aria-hidden="true">↗</span></button>
        </article>
        <article className="rounded-md border-2 border-stone-950 bg-white p-5 shadow-[4px_4px_0_#171717]">
          <h2 className="font-serif text-lg font-bold text-stone-950">Menerbitkan karya</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">Dari dashboard, pilih Terbitkan pada karya untuk mengatur siapa yang dapat membacanya.</p>
          <button className="secondary-button mt-5" type="button" onClick={() => onNavigate('/dashboard')}>Buka dashboard <span aria-hidden="true">↗</span></button>
        </article>
        <article className="rounded-md border-2 border-stone-950 bg-white p-5 shadow-[4px_4px_0_#171717]">
          <h2 className="font-serif text-lg font-bold text-stone-950">Mengatur profil</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">Ubah informasi penulis dan pilih karya publik untuk portofoliomu.</p>
          <button className="secondary-button mt-5" type="button" onClick={() => onNavigate('/dashboard/profile')}>Buka profil <span aria-hidden="true">↗</span></button>
        </article>
        <article className="rounded-md border-2 border-stone-950 bg-[#f4f6f2] p-5 shadow-[4px_4px_0_#171717]">
          <h2 className="font-serif text-lg font-bold text-stone-950">Butuh panduan menulis?</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">Di editor, panel panduan berisi empat bagian: konteks, pertimbangan, tindakan, serta hasil dan pembelajaran.</p>
          <button className="secondary-button mt-5" type="button" onClick={() => onNavigate('/dashboard/write')}>Lihat panduan editor <span aria-hidden="true">↗</span></button>
        </article>
      </div>
    </section>
  )
}

export default Help
