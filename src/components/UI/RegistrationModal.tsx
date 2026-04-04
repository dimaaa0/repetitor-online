"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  GraduationCap,
  LogOut,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useModal } from "../../context/ModalContext";
import { createClient } from "../../utils/supabase/client";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";

export default function SignInForm() {
  const supabase = createClient();
  const { isOpen, closeModal } = useModal();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Student");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email ?? null);
    };
    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUserEmail(session?.user?.email ?? null);
      },
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      closeModal();
    } catch (error: any) {
      alert("Ошибка входа: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } },
      });
      if (error) throw error;
      alert("Проверьте почту для подтверждения!");
      closeModal();
    } catch (error: any) {
      alert("Ошибка регистрации: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserEmail(null);
    } catch (error: any) {
      console.error("Ошибка при выходе:", error.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isLogin ? handleSignIn() : handleSignUp();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed min-h-screen inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
    >
      <div
        className="w-full max-w-[440px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Декоративный элемент сверху */}

        <button
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all z-10"
          onClick={closeModal}
        >
          <X size={20} />
        </button>

        <div className="p-10 w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isLogin ? "С возвращением" : "Создать аккаунт"}
            </h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              {isLogin
                ? "Войдите, чтобы продолжить обучение"
                : "Присоединяйтесь к сообществу репетиторов"}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    Вы — кто?
                  </label>
                  <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
                    <button
                      type="button"
                      onClick={() => setRole("Student")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${role === "Student" ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}
                    >
                      <UserIcon size={16} /> Ученик
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("Tutor")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${role === "Tutor" ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}
                    >
                      <GraduationCap size={16} /> Репетитор
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    Имя
                  </label>
                  <div className="relative">
                    <UserIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ваше имя"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Почта
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Пароль
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-[10px] font-bold text-blue-600 uppercase"
                  >
                    Забыли?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 shadow-xl shadow-slate-200 hover:shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 cursor-pointer mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? "ВОЙТИ" : "СОЗДАТЬ АККАУНТ"}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-50">
            <p className="text-sm text-slate-500 font-medium">
              {!isLogin ? "Уже есть аккаунт?" : "Впервые здесь?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 cursor-pointer font-bold transition-colors ml-1"
              >
                {!isLogin ? "Войти в профиль" : "Зарегистрироваться"}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
