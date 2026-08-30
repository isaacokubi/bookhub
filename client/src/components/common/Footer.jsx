import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link to="/" className="text-2xl font-black text-white">📚 BookHub Kenya</Link>
            <p className="mt-4 max-w-md leading-7 text-slate-400">
              A trusted Kenyan marketplace for discovering, buying and selling books online.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white">Explore</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Link className="block transition hover:text-white" to="/books">Browse books</Link>
              <Link className="block transition hover:text-white" to="/login">Sign in</Link>
              <Link className="block transition hover:text-white" to="/register">Create account</Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white">Sell on BookHub</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Link className="block transition hover:text-white" to="/seller/register">Become a seller</Link>
              <p className="text-slate-400">Reach readers across Kenya with your book listings.</p>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BookHub Kenya. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built for readers and sellers in Kenya 🇰🇪</p>
        </div>
      </div>
    </footer>
  );
}
