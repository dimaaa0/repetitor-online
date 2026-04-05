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

const getFriendlyError = (message: string) => {
  // 1. Ошибки входа и регистрации
  if (message.includes("Invalid login credentials"))
    return "Неверная почта или пароль";
  if (message.includes("User already registered"))
    return "Этот email уже занят";
  if (message.includes("Password should be at least 6 characters"))
    return "Пароль должен быть не менее 6 символов";
  if (message.includes("Email not confirmed"))
    return "Пожалуйста, подтвердите вашу почту";
  
  if (message.includes("Error sending confirmation email")) {
    return "Не удалось отправить письмо подтверждения. Повторите попытку позже";
  }

  // 2. Ошибки при сбросе пароля
  if (message.includes("User not found"))
    return "Пользователь с такой почтой не найден";
  if (
    message.includes("New password should be different from the old password")
  )
    return "Новый пароль должен отличаться от старого";

  // 3. Лимиты и безопасность (очень важно!)
  if (message.includes("Rate limit exceeded"))
    return "Слишком много попыток. Подождите пару минут";
  if (message.includes("Email rate limit exceeded"))
    return "Мы уже отправили письмо. Подождите немного перед повторной попыткой";
  if (message.includes("Captcha check failed"))
    return "Ошибка проверки капчи. Попробуйте еще раз";

  // 4. Проблемы с данными
  if (message.includes("Invalid email address"))
    return "Некорректный адрес почты";
  if (message.includes("Anonymous sign-ins are disabled"))
    return "Вход без регистрации отключен";

  // 5. Сетевые проблемы
  if (
    message.includes("Failed to fetch") ||
    message.includes("Network request failed")
  ) {
    return "Проблема с интернет-соединением";
  }

  return "Произошла ошибка. Попробуйте еще раз";
};

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

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

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

  // Пример для Входа
  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      showAlert("success", "С возвращением!");
      closeModal();
    } catch (error: any) {
      // Вот тут магия перевода
      const errorMessage = getFriendlyError(error.message);
      showAlert("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } },
      });
      if (error) throw error;

      // Если identities пустой — email уже занят
      if (data.user && data.user.identities?.length === 0) {
        showAlert(
          "error",
          "Этот email уже зарегистрирован. Войдите в аккаунт.",
        );

        setIsLogin(true);
        return;
      }

      showAlert(
        "success",
        "Проверьте почту для подтверждения! После подтверждения войдите в аккаунт.",
      );
      setIsLogin(true);
    } catch (error: any) {
      showAlert("error", error.message);
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

  const handleResetPassword = async () => {
    if (!email) {
      showAlert("error", "Пожалуйста, введите email");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      showAlert("error", error.message);
    } else {
      showAlert("success", "Ссылка для сброса отправлена на почту!");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed min-h-screen inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      {/* Кастомное уведомление */}
      {alert && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[10000] animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 font-bold text-sm
      ${
        alert.type === "error"
          ? "bg-red-50 border-red-100 text-red-600"
          : alert.type === "success"
            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
            : "bg-blue-50 border-blue-100 text-blue-600"
      }`}
          >
            {alert.type === "error" && <X size={18} />}
            {alert.type === "success" && (
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
            {alert.message}
          </div>
        </div>
      )}
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
                    onClick={handleResetPassword}
                    className="text-[10px] font-bold text-blue-600 uppercase cursor-pointer"
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
