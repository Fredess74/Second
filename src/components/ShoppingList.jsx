import { useState } from "react";

const ShoppingList = ({ items, onAddItem, onToggleItem }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await onAddItem(text.trim());
      setText("");
      setError("");
    } catch (err) {
      setError(err.message || "Не удалось добавить пункт");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (index) => {
    try {
      await onToggleItem(index);
      setError("");
    } catch (err) {
      setError(err.message || "Не удалось обновить пункт");
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-3xl p-6">
      <h3 className="text-xl font-semibold mb-4">Список покупок</h3>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Добавить пункт..."
          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold disabled:opacity-60"
        >
          {loading ? "..." : "Добавить"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-400 bg-red-900/40 border border-red-500 rounded-xl px-3 py-2 mb-3">{error}</p>
      )}
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={`${item.text}-${index}`}
            className="flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggle(index)}
                className="h-5 w-5 rounded border-slate-700 bg-slate-800 text-emerald-500"
              />
              <span className={`text-sm ${item.completed ? "line-through text-slate-500" : "text-white"}`}>
                {item.text}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
