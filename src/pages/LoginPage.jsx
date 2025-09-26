import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: displayName || email });
        await setDoc(doc(db, "users", result.user.uid), {
          email,
          displayName: displayName || email,
          squadId: null,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Fetch Squads</h1>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsRegister(false)}
            className={`px-4 py-2 rounded-l-full border border-slate-700 transition-colors ${
              !isRegister ? "bg-orange-500 text-white" : "bg-slate-900"
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`px-4 py-2 rounded-r-full border border-slate-700 transition-colors ${
              isRegister ? "bg-orange-500 text-white" : "bg-slate-900"
            }`}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm mb-1">Имя (отображаемое)</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Например, Анна"
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/40 border border-red-500 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors font-semibold disabled:opacity-60"
          >
            {loading ? "Обработка..." : isRegister ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
