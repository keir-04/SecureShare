const EmptyState = ({ title, description, action }) => {
  return (
    <div className="card overflow-hidden p-8 text-center">
      <div className="empty-illustration mx-auto mb-6 h-24 w-24 rounded-3xl border border-brand-200 bg-brand-50 dark:border-brand-900/40 dark:bg-brand-950/20" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
