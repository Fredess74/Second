import { useEffect, useState } from "react";

const ShareReceiptModal = ({ open, onClose, onSubmit, membersCount }) => {
  const [points, setPoints] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setPoints("");
      setError("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const parsedPoints = Number(points) || 0;
  const share = membersCount > 0 ? Math.floor((parsedPoints / membersCount) * 100) / 100 : 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const numericPoints = Number(points);
    if (!numericPoints || numericPoints <= 0) {
      setError("Введите количество очков больше нуля");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(numericPoints);
      onClose();
    } catch (err) {
      setError(err.message || "Не удалось отправить очки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Отсканировать общий чек</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Сумма очков</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              min="0"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Например, 500"
            />
          </div>

          <div className="text-sm text-slate-300 bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">
            <p>Участников: {membersCount}</p>
            <p>Каждый получит примерно: <span className="text-emerald-400 font-semibold">{share.toLocaleString()}</span> очков</p>
          </div>

          {error && (
            <p className="text-red-400 bg-red-900/40 border border-red-500 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 font-semibold disabled:opacity-60"
          >
            {loading ? "Отправляем..." : "Разделить очки"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShareReceiptModal;
