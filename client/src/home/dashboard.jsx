import React from "react";

// SimpleHomepage.jsx
// Single-file React component (Tailwind CSS classes assumed available)
// Default export a functional React component

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Top navigation */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-400 rounded-lg flex items-center justify-center text-white font-bold">N</div>
          <div>
            <h1 className="text-lg font-semibold">Nikita</h1>
            <p className="text-xs text-slate-500 -mt-1">Simple homepage</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a className="hover:underline cursor-pointer">Home</a>
          <a className="hover:underline cursor-pointer">Features</a>
          <a className="hover:underline cursor-pointer">Pricing</a>
          <a className="hover:underline cursor-pointer">Contact</a>
          <button className="ml-3 rounded-md px-4 py-2 bg-indigo-600 text-white text-sm shadow-sm hover:bg-indigo-700">Sign in</button>
        </nav>

        <div className="md:hidden">
          <button className="p-2 rounded-md bg-gray-100">☰</button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">Build beautiful UIs fast.</h2>
            <p className="mt-4 text-slate-600">A minimal, responsive homepage template using Tailwind CSS. Use it as a starting point for apps, portfolios, or marketing pages.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-md px-5 py-3 bg-emerald-500 text-white font-medium shadow hover:brightness-95">Get started</button>
              <button className="rounded-md px-5 py-3 bg-transparent border border-slate-200 text-slate-700 hover:bg-slate-50">Live demo</button>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <li>• Lightweight</li>
              <li>• Responsive</li>
              <li>• Tailwind-ready</li>
              <li>• Accessible</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-xl flex items-center justify-center text-indigo-700 font-semibold">Preview Card</div>

              <div className="mt-4">
                <h3 className="font-semibold">Product name</h3>
                <p className="text-sm text-slate-500 mt-2">Short description of the product and why people will love it. Clean, simple, and fast.</p>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Starting at</p>
                    <p className="font-bold">$9 / month</p>
                  </div>
                  <button className="rounded-md px-4 py-2 bg-indigo-600 text-white">Try free</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-14">
          <h4 className="text-xl font-semibold">Features</h4>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Fast to build", desc: "Reusable building blocks." },
              { title: "Responsive", desc: "Looks great on any screen." },
              { title: "Accessible", desc: "Keyboard + screen reader friendly." },
              { title: "Customizable", desc: "Adapt colors and spacing." },
            ].map((f) => (
              <div key={f.title} className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-indigo-600 font-bold">{f.title}</div>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-14 bg-indigo-600 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h5 className="text-lg font-semibold">Ready to start?</h5>
            <p className="text-sm text-indigo-100 mt-1">Create your project and ship faster.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="rounded-md px-4 py-2 bg-white text-indigo-700 font-semibold">Create project</button>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-slate-500 flex justify-between">
          <span>© {new Date().getFullYear()} Nikita • All rights reserved</span>
          <span>Made with ❤️</span>
        </div>
      </footer>
    </div>
  );
}
