import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import SquadDashboard from "../components/SquadDashboard";
import ShareReceiptModal from "../components/ShareReceiptModal";
import { db } from "../firebase/config";

const SquadPage = ({ squadId, onLogout, shareLink }) => {
  const [squad, setSquad] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const functionsBaseUrl = useMemo(() => {
    const envUrl = import.meta.env.VITE_CLOUD_FUNCTIONS_BASE_URL;
    if (envUrl) return envUrl.replace(/\/$/, "");
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    return projectId
      ? `https://us-central1-${projectId}.cloudfunctions.net`
      : "";
  }, []);

  useEffect(() => {
    if (!squadId) return;

    const ref = doc(db, "squads", squadId);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setSquad({ id: snapshot.id, ...snapshot.data() });
          setError("");
        } else {
          setError("Отряд не найден");
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [squadId]);

  useEffect(() => {
    const loadMembers = async () => {
      if (!squad?.members?.length) {
        setMembers([]);
        return;
      }

      try {
        const results = await Promise.all(
          squad.members.map(async (memberId) => {
            const userSnap = await getDoc(doc(db, "users", memberId));
            if (userSnap.exists()) {
              return { id: userSnap.id, ...userSnap.data() };
            }
            return { id: memberId, displayName: "Неизвестный", email: "n/a" };
          })
        );
        setMembers(results);
      } catch (err) {
        setError(err.message);
      }
    };

    loadMembers();
  }, [squad?.members]);

  const handleAddShoppingItem = async (text) => {
    if (!squad) return;
    const nextList = [...(squad.shoppingList || []), { text, completed: false }];
    try {
      await updateDoc(doc(db, "squads", squadId), {
        shoppingList: nextList,
      });
    } catch (err) {
      console.error('Не удалось добавить пункт списка', err);
      throw new Error('Не удалось добавить пункт списка');
    }
  };

  const handleToggleShoppingItem = async (index) => {
    if (!squad) return;
    const list = [...(squad.shoppingList || [])];
    if (!list[index]) return;
    list[index] = { ...list[index], completed: !list[index].completed };
    try {
      await updateDoc(doc(db, "squads", squadId), {
        shoppingList: list,
      });
    } catch (err) {
      console.error('Не удалось обновить пункт списка', err);
      throw new Error('Не удалось обновить пункт списка');
    }
  };

  const handleShareReceipt = async (points) => {
    if (!functionsBaseUrl) {
      throw new Error("Укажите VITE_CLOUD_FUNCTIONS_BASE_URL в .env");
    }

    const response = await fetch(`${functionsBaseUrl}/shareReceiptPoints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ squadId, points }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Не удалось распределить очки");
    }

    return response.json();
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
        <p className="text-red-400">Ошибка: {error}</p>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
        >
          Вернуться на экран входа
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Загрузка отряда...
      </div>
    );
  }

  if (!squad) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-3">
        <p>Данные отряда недоступны.</p>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <>
      <SquadDashboard
        squad={squad}
        members={members}
        shareLink={shareLink}
        onLogout={onLogout}
        onOpenReceiptModal={() => setIsModalOpen(true)}
        onAddShoppingItem={handleAddShoppingItem}
        onToggleShoppingItem={handleToggleShoppingItem}
      />
      <ShareReceiptModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleShareReceipt}
        membersCount={members.length || 1}
      />
    </>
  );
};

export default SquadPage;
