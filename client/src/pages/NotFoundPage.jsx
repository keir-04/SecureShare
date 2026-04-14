import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card max-w-lg p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-100 text-3xl font-bold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
          404
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Page not found</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          The page you requested does not exist or the link is outdated.
        </p>
        <Link className="btn-primary mt-6" to="/">
          Return home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
