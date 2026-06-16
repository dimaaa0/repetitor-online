"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  GraduationCap,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useModal } from "../../context/ModalContext";
import { createClient } from "../../utils/supabase/client";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import getFriendlyError from "../../app/functions/errorTranslator";
import PrivacyPolicyPage from "../UI/PrivatePolicy";

export default function SignInForm() {
  const supabase = createClient();
  const { isOpen, closeModal } = useModal();
  const t = useTranslations("RegistrationModal");

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [role, setRole] = useState("Student");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);

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

      showAlert("success", t("alert_welcome_back"));
      closeModal();
    } catch (error: any) {
        const errorMessage = getFriendlyError(
          error.message,
          t as unknown as (id: string, values?: Record<string, unknown>) => string,
        );
      showAlert("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // 1. Переносим пользователя на самый верх
      window.scrollTo({ top: 0, behavior: "smooth" });

      // 2. Блокируем скролл основного контента
      document.body.style.overflow = "hidden";
    } else {
      // 3. Возвращаем скролл при закрытии
      document.body.style.overflow = "unset";
    }

    // Чистим эффект при размонтировании компонента
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSignUp = async () => {
    // Регулярное выражение: разрешаем только буквы (латиница + кириллица) и пробелы
    // Цифры (\d) запрещены
    const nameRegex = /^[A-Za-zА-Яа-яЁё\s]+$/;

    // 1. Проверка Имени
    if (!nameRegex.test(name)) {
      showAlert("error", t("alert_name_only_letters"));
      return;
    }

    // 2. Проверка Фамилии
    if (!nameRegex.test(surname)) {
      showAlert("error", t("alert_surname_only_letters"));
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, surname, role },
        },
      });

      if (error) throw error;

      if (data.user && data.user.identities?.length === 0) {
        showAlert("error", t("alert_email_already_registered"));
        setIsLogin(true);
        return;
      }

      showAlert("success", t("alert_check_email"));
      setIsLogin(true);
    } catch (error: any) {
      const errorMessage = getFriendlyError(
        error.message,
        t as unknown as (id: string, values?: Record<string, unknown>) => string,
      );
      showAlert("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isLogin ? handleSignIn() : handleSignUp();
  };

  const handleResetPassword = async () => {
    if (!email) {
      showAlert("error", t("alert_enter_email"));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      showAlert("error", error.message);
    } else {
      showAlert("success", t("alert_password_reset_sent"));
    }
    setLoading(false);
  };

  const [privatePolicy, setPrivatePolicy] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="absolute min-h-screen inset-0 z-9999 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      {/* Кастомное уведомление */}
      {alert && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-10000 animate-in fade-in slide-in-from-top-4 duration-300">
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
      {privatePolicy && (
        <PrivacyPolicyPage setPrivatePolicy={setPrivatePolicy} />
      )}
      <div
        className="w-full max-w-110 bg-white rounded-4xl shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all z-10"
          onClick={closeModal}
        >
          <X size={20} />
        </button>

        <div className="p-10 w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isLogin ? t("title_signin") : t("title_signup")}
            </h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              {isLogin ? t("desc_signin") : t("desc_signup")}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    {t("label_role_who")}
                  </label>
                  <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
                    <button
                      type="button"
                      onClick={() => setRole("Student")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${role === "Student" ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}
                    >
                      <UserIcon size={16} /> {t("role_student")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("Tutor")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${role === "Tutor" ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}
                    >
                      <GraduationCap size={16} /> {t("role_tutor")}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    {t("label_name")}
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
                      placeholder={t("placeholder_name")}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    {t("label_surname")}
                  </label>
                  <div className="relative">
                    <UserIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      required
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder={t("placeholder_surname")}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2.5 mb-5 px-1"></div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                {t("label_email")}
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
                  placeholder={t("placeholder_email")}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t("label_password")}
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-[10px] font-bold text-blue-600 uppercase cursor-pointer"
                  >
                    {t("btn_forgot_password")}
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
            {isLogin ? (
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-slate-900 text-white font-black py-4 rounded-2xl ${isAgreed ? "hover:bg-blue-600 cursor-pointer" : ""} shadow-xl shadow-slate-200 hover:shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70  mt-4`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {t("btn_login")}
                    <ArrowRight
                      size={18}
                      className={`${isAgreed && "group-hover:translate-x-1"} transition-transform`}
                    />
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !isAgreed}
                className={`w-full bg-slate-900 text-white font-black py-4 rounded-2xl ${isAgreed ? "hover:bg-blue-600 cursor-pointer" : ""} shadow-xl shadow-slate-200 hover:shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70  mt-4`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {t("btn_create_account")}
                    <ArrowRight
                      size={18}
                      className={`${isAgreed && "group-hover:translate-x-1"} transition-transform`}
                    />
                  </>
                )}
              </button>
            )}
            {!isLogin && (
              <div className="flex items-start gap-2.5 mb-5 px-1">
                <input
                  id="privacy"
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-colors"
                  required
                />
                <label
                  htmlFor="privacy"
                  className="text-xs text-gray-500 leading-snug cursor-pointer select-none"
                >
                  Я принимаю условия{" "}
                  <span
                    className="text-blue-600 hover:underline font-medium transition-all cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault(); // Стопаем стандартный клик лейбла, чтобы чекбокс не прыгал
                      e.stopPropagation(); // Изолируем событие
                      setPrivatePolicy(true);
                      console.log("Открываем политику");
                    }}
                  >
                    Политики конфиденциальности
                  </span>{" "}
                  и даю согласие на обработку персональных данных.
                </label>
              </div>
            )}
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-50">
            <p className="text-sm text-slate-500 font-medium">
              {!isLogin ? t("text_have_account") : t("text_new_here")}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 cursor-pointer font-bold transition-colors ml-1"
              >
                {!isLogin ? t("action_login") : t("action_register")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
