export default function UserHome() {
  return (
    <div className="grid grid-rows-[2px_1fr_2px] items-center justify-items-center min-h-screen pb-0 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
         user home
      </main>
      <footer className="row-start-3 flex gap-[2px] flex-wrap items-center justify-center">
         <p> by <a href="https://www.modelscope.cn/" target="_blank" rel="noopener noreferrer">luckcoder.com</a></p>
      </footer>
    </div>
  );
}
