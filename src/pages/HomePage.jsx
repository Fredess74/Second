import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase/config";
import { useAuth } from "../App";
import SquadPage from "./SquadPage";

const DEFAULT_GOAL = {
  name: "Общая копилка",
  targetPoints: 25000,
};

const DEFAULT_MASCOT =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f43f.svg";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [squadName, setSquadName] = useState("");
  const [inviteValue, setInviteValue] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile({ id: snap.id, ...snap.data() });
        } else {
          const freshProfile = {
            email: user.email,
            displayName: user.displayName || user.email,
            squadId: null,
          };
          await setDoc(ref, freshProfile);
          setProfile({ id: ref.id, ...freshProfile });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const createSquad = async () => {
    if (!user) return;
    setProcessing(true);
    setError("");
    try {
      const newSquadName = squadName.trim() || `${user.displayName || "Сквад"}`;
      const squadRef = await addDoc(collection(db, "squads"), {
        squadName: newSquadName,
        members: [user.uid],
        totalPoints: 0,
        goal: DEFAULT_GOAL,
        shoppingList: [],
        mascotUrl: DEFAULT_MASCOT,
        lastReceipt: null,
      });

      await updateDoc(doc(db, "users", user.uid), {
        squadId: squadRef.id,
      });

      setProfile((prev) => (prev ? { ...prev, squadId: squadRef.id } : prev));
      setSquadName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const parseSquadId = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "";

    const urlMatch = trimmed.match(/squadId=([a-zA-Z0-9-]+)/);
    if (urlMatch) {
      return urlMatch[1];
    }

    return trimmed.split("/").filter(Boolean).pop() || trimmed;
  };

  const joinSquad = async () => {
    if (!user) return;
    setProcessing(true);
    setError("");
    try {
      const squadId = parseSquadId(inviteValue);
      if (!squadId) {
        throw new Error("Укажите корректную ссылку или ID отряда");
      }

      const squadRef = doc(db, "squads", squadId);
      const snapshot = await getDoc(squadRef);
      if (!snapshot.exists()) {
        throw new Error("Отряд не найден");
      }

      await updateDoc(squadRef, {
        members: arrayUnion(user.uid),
      });

      await updateDoc(doc(db, "users", user.uid), {
        squadId,
      });

      setProfile((prev) => (prev ? { ...prev, squadId } : prev));
      setInviteValue("");
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const shareLink = useMemo(() => {
    if (!profile?.squadId) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/join?squadId=${profile.squadId}`;
  }, [profile?.squadId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Загрузка профиля...
      </div>
    );
  }

  if (!profile?.squadId) {
    return (
      <div className="min-h-screen bg-slate-900 text-white px-4 py-10">
        <div className="max-w-3xl mx-auto bg-slate-800 rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Добро пожаловать, {user?.displayName || user?.email}</h2>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
            >
              Выйти
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Создать новый отряд</h3>
              <label className="block text-sm mb-2 text-slate-300">
                Название отряда
              </label>
              <input
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                placeholder="Например, Охотники за чеками"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={createSquad}
                disabled={processing}
                className="mt-4 w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 font-semibold disabled:opacity-60"
              >
                {processing ? "Создание..." : "Создать отряд"}
              </button>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Присоединиться по ссылке</h3>
              <label className="block text-sm mb-2 text-slate-300">
                Пригласительная ссылка или ID отряда
              </label>
              <input
                value={inviteValue}
                onChange={(e) => setInviteValue(e.target.value)}
                placeholder="Вставьте ссылку вида https://...squadId=XXX"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={joinSquad}
                disabled={processing}
                className="mt-4 w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 font-semibold disabled:opacity-60"
              >
                {processing ? "Присоединяем..." : "Присоединиться"}
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-6 text-red-400 bg-red-900/40 border border-red-500 rounded-xl px-4 py-3">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <SquadPage
      squadId={profile.squadId}
      onLogout={handleLogout}
      shareLink={shareLink}
    />
  );
};

export default HomePage;
