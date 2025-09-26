const SharedGoal = ({ totalPoints, goal }) => {
  const target = goal?.targetPoints || 1;
  const progress = Math.min(100, Math.round((totalPoints / target) * 100));

  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-3xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">Общая цель</h3>
          <p className="text-sm text-slate-300 mt-1">{goal?.name}</p>
        </div>
        <span className="text-sm text-emerald-400 font-semibold">
          {totalPoints.toLocaleString()} / {target.toLocaleString()} очков
        </span>
      </div>

      <div className="mt-4 bg-slate-800 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Осталось {(target - totalPoints > 0 ? target - totalPoints : 0).toLocaleString()} очков до цели.
      </p>
    </div>
  );
};

export default SharedGoal;
