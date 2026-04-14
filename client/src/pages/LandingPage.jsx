import { ArrowRight, Lock, Share2, Timer } from "lucide-react";
import { Link } from "react-router-dom";

const featureCards = [
  {
    title: "Secure by default",
    description: "Protect access with HTTP-only cookie auth, file-level ownership checks, and optional share passwords.",
    icon: Lock,
  },
  {
    title: "Fast team sharing",
    description: "Generate expiring links in seconds for coursework handoffs, project assets, or small team collaboration.",
    icon: Share2,
  },
  {
    title: "Audit-friendly",
    description: "Track uploads, renames, deletions, downloads, and login activity in a clean admin-friendly trail.",
    icon: Timer,
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
              Secure file sharing for students and small teams
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Share files confidently without losing control.
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
              SecureShare helps you upload files, organize them, create expiring links, protect downloads with passwords,
              and monitor activity from a polished dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className="btn-primary gap-2" to="/register">
                Get Started
                <ArrowRight size={18} />
              </Link>
              <Link className="btn-secondary" to="/login">
                Sign In
              </Link>
            </div>
          </div>
          <div className="card p-6">
            <div className="rounded-3xl bg-slate-950 p-6 text-white dark:bg-slate-900">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-sm text-slate-400">Link security</p>
                  <p className="mt-2 text-2xl font-semibold">Expiry + password</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-sm text-slate-400">Access control</p>
                  <p className="mt-2 text-2xl font-semibold">Role-aware</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-sm text-slate-400">Visibility</p>
                  <p className="mt-2 text-2xl font-semibold">Private / shared</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-sm text-slate-400">Audit events</p>
                  <p className="mt-2 text-2xl font-semibold">Tracked</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {featureCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card p-6">
                <div className="mb-4 inline-flex rounded-2xl bg-brand-100 p-3 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                  <Icon size={20} />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{item.title}</h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
