import { useState } from "react";

const InviteButton = ({ link }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Не удалось скопировать ссылку", err);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-3xl p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-semibold">Приглашение в отряд</h3>
        <p className="text-sm text-slate-300 mt-1">
          Скопируйте ссылку и отправьте друзьям, чтобы они присоединились.
        </p>
      </div>
      <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm break-all">
        {link || "Ссылка появится после создания отряда"}
      </div>
      <button
        onClick={handleCopy}
        disabled={!link}
        className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 font-semibold disabled:opacity-50"
      >
        {copied ? "Ссылка скопирована" : "Скопировать ссылку"}
      </button>
    </div>
  );
};

export default InviteButton;
