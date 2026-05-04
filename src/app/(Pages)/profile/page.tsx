"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TeacherPanel from "@/src/components/Sections/TeacherPanel";
import StudentPanel from "@/src/components/Sections/StudentPanel";
import AdminPanel from "@/src/components/Sections/AdminPanel";

import { useUser } from "../../../context/UserContext";
import { useSubject } from "../../../context/TeacherSubjectContext";

import {
  Mail,
  LogOut,
  ShieldCheck,
  CreditCard,
  Loader2,
  Check,
  XCircle,
  Wallet,
  RefreshCw,
} from "lucide-react";

import CopyButton from "@/src/components/UI/HandleCopyButton";
import AddAvatar from "@/src/components/UI/AddAvatar";
import SubjectPicker from "@/src/components/UI/TeacherSubjectPicker";

const Profile = () => {
  const { user, loading, refreshUser } = useUser();
  const { selectedSubjects, setSelectedSubjects } = useSubject();
  const supabase = createClient();
  const router = useRouter();

  // Состояния
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    role: "Student",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const [subjects, setSubjects] = useState<string[]>([]); // Локальное состояние для отображения выбранных предметов
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [isPublishing, setIsPublishing] = useState(false);

  const [hasAd, setHasAd] = useState(false);

  const [confirmation, setConfirmation] = useState(false);

  const roleStyles: any = {
    Tutor: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    Student: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    Admin: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  };

  //* СИНХРОНИЗАЦИЯ ДАННЫХ ОБЪЯВЛЕНИЯ ПРИ ЗАГРУЗКЕ ПРОФИЛЯ
  useEffect(() => {
    const fetchAd = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        //* Заполняем поля данными из базы
        setHasAd(true);
        setPrice(data.price.toLocaleString());
        setDescription(data.description || "");
        setSubjects(
          data.subject
            ? data.subject.split(", ").map((s: string) => s.trim())
            : [],
        );
      }

      if (data && data.subject) {
        // Превращаем строку из базы в массив
        const subjectsArray = data.subject
          .split(", ")
          .map((s: string) => s.trim());

        // Синхронизируем контекст с данными из БД
        setSelectedSubjects(subjectsArray);
      }

      if (error && error.code !== "PGRST116") {
        // PGRST116 — это код "запись не найдена", его игнорируем
        console.error("Ошибка при загрузке объявления:", error);
      }
    };

    fetchAd();
  }, [user, supabase]);

  useEffect(() => {
    setSubjects(selectedSubjects);
  }, [selectedSubjects]);

  //* Синхронизация данных формы с пользователем
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        role: user.role || "Student",
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  //* ВЫБОР АВАТАРА И ПУБЛИКАЦИЯ ОБЪЯВЛЕНИЯ
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showAlert("error", "Файл слишком большой (макс. 2МБ)");
        return;
      }
      setSelectedFile(file);
    }
  };

  //* ОБРАБОТКА ОБНОВЛЕНИЯ ПРОФИЛЯ
  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      let finalAvatarUrl = user.avatar_url;

      if (selectedFile) {
        //* УДАЛЕНИЕ СТАРОГО ФАЙЛА (если он есть)
        // ... внутри handleUpdateProfile перед загрузкой нового файла

        if (user.avatar_url) {
          try {
            // 1. Используем конструктор URL, чтобы корректно распарсить строку
            const url = new URL(user.avatar_url);
            const pathParts = url.pathname.split("avatars/");

            if (pathParts.length > 1) {
              // 2. Декодируем URL (на случай пробелов или спецсимволов %20 и т.д.)
              const oldFilePath = decodeURIComponent(pathParts[1]);

              // 3. Вызываем удаление
              const { data, error: removeError } = await supabase.storage
                .from("avatars")
                .remove([oldFilePath]);

              if (removeError) {
                console.error("Supabase Storage Error:", removeError);
              } else {
                null; // Файл успешно удален, можно продолжать загрузку нового
              }
            }
          } catch (e) {
            console.error("Ошибка парсинга URL или удаления:", e);
          }
        }

        //* ЗАГРУЗКА НОВОГО ФАЙЛА
        const fileExt = selectedFile.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`; // Используем Date.now() вместо Math.random() для надежности

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        finalAvatarUrl = publicUrl;
      }

      //* ОБНОВЛЕНИЕ ПРОФИЛЯ
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          surname: formData.surname,
          avatar_url: finalAvatarUrl,
          role: formData.role,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      await refreshUser();
      setIsEditing(false);
      setSelectedFile(null);
      showAlert("success", "Профиль обновлен успешно!");
    } catch (error) {
      console.error(error);
      showAlert("error", "Ошибка при обновлении профиля");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRole = () => {
    setFormData((prev) => ({
      ...prev,
      role: prev.role === "Tutor" ? "Student" : "Tutor",
    }));
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Пользователь не найден</p>
        <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Войти
        </Link>
      </div>
    );
  }

  let panel;

  if (user.role === "Tutor") {
    panel = <TeacherPanel />;
  } else if (user.role === "Admin") {
    panel = <AdminPanel />;
  } else {
    panel = <StudentPanel />;
  }
  return (
    <div className="bg-gray-50 py-6 px-0 sm:px-4 lg:px-8">
      <div className="max-w-[1250px] px-2 sm:px-6 mx-auto">
        {alert && (
          <div className="fixed top-6 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none">
            <div
              className={`
        pointer-events-auto
        flex items-center gap-3
        px-6 py-4 rounded-2xl shadow-2xl border
        animate-in fade-in slide-in-from-top-4 duration-300
        ${
          alert.type === "success"
            ? "bg-white border-green-100 text-green-800"
            : alert.type === "error"
              ? "bg-white border-red-100 text-red-800"
              : "bg-white border-blue-100 text-blue-800"
        }
      `}
            >
              {alert.type === "success" && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {alert.type === "error" && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}

              <span className="font-bold text-sm">{alert.message}</span>
            </div>
          </div>
        )}

        {confirmation && (
          <div
            onClick={() => {
              setConfirmation(false);
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-all pointer-events-auto scale-100 border border-gray-100"
            >
              {/* Иконка или Заголовок (опционально для красоты) */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <LogOut className="w-6 h-6 text-[#C92222]" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  Выход из аккаунта
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  Вы уверены, что хотите выйти? Вам придется заново вводить
                  логин и пароль.
                </p>
              </div>

              {/* Кнопки действий */}
              <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse sm:gap-3">
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-1/2 px-4 py-2.5 bg-[#C92222] text-white text-sm font-medium rounded-xl 
                   hover:bg-[#b01e1e] active:scale-[0.97] transition-all shadow-md shadow-red-200 cursor-pointer"
                >
                  Подтвердить
                </button>

                <button
                  onClick={() => {
                    setConfirmation(false);
                  }}
                  className="w-full sm:w-1/2 px-4 py-2.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-xl 
                   hover:bg-gray-100 active:scale-[0.97] transition-all cursor-pointer border border-gray-200"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Шапка профиля */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Аватар */}
            <div className="relative shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    className="h-full w-full object-cover"
                  />
                ) : user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-600 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                    <span className="text-white text-[32px] font-bold">
                      {user.name ? user.name[0].toUpperCase() : "?"}
                    </span>
                  </div>
                )}
              </div>
              {user.role === "Tutor" && isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl animate-in fade-in zoom-in duration-200">
                  <AddAvatar uploadAvatar={handleFileSelect} />
                </div>
              )}
            </div>

            {/* Информация */}
            <div className="text-center sm:text-left flex-1 w-full min-w-0">
              {isEditing ? (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 outline-none bg-blue-50/30 px-2 py-1 rounded-t-md w-full focus:bg-blue-50 transition-colors"
                      placeholder="Имя"
                    />
                    <input
                      type="text"
                      value={formData.surname}
                      onChange={(e) =>
                        setFormData({ ...formData, surname: e.target.value })
                      }
                      className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 outline-none bg-blue-50/30 px-2 py-1 rounded-t-md w-full focus:bg-blue-50 transition-colors"
                      placeholder="Фамилия"
                    />
                  </div>
                  <div className="flex justify-center sm:justify-start my-1">
                    <button
                      type="button"
                      title="Сменить роль"
                      onClick={toggleRole}
                      className={`cursor-pointer flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border-2 transition-all duration-300 active:scale-95 shadow-sm
                ${
                  formData.role === "Tutor"
                    ? "bg-green-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                }`}
                    >
                      <span className="mr-2 italic opacity-70">Роль:</span>
                      <span className="uppercase">
                        {formData.role === "Tutor" ? "Репетитор" : "Ученик"}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center sm:flex-row sm:items-center sm:flex-wrap gap-1.5 sm:gap-3 justify-center sm:justify-start">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate max-w-full">
                    {user.name || "Пользователь"} {user.surname}
                  </h1>
                  <span
                    className={`
            inline-flex items-center shrink-0
            px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider
            border transition-all duration-300 shadow-sm
            ${roleStyles[user.role] || roleStyles.Student}
          `}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-2 animate-pulse ${
                        user.role === "Admin"
                          ? "bg-red-500"
                          : user.role === "Tutor"
                            ? "bg-blue-500"
                            : "bg-green-500"
                      }`}
                    />
                    {!user.role
                      ? "User"
                      : user.role === "Admin"
                        ? "Администратор"
                        : user.role === "Tutor"
                          ? "Репетитор"
                          : "Ученик"}
                  </span>
                </div>
              )}

              <p className="text-gray-500 text-sm mt-2 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
            </div>

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl font-bold text-sm sm:text-xs transition-all shadow-sm active:scale-95 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 w-full sm:w-auto"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Сохранить
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl font-bold text-sm sm:text-xs transition-all shadow-sm active:scale-95 bg-gray-100 text-gray-600 hover:bg-gray-200 w-full sm:w-auto"
                  >
                    <XCircle className="h-4 w-4" /> Отмена
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl font-bold text-sm sm:text-xs transition-all duration-300 shadow-sm active:scale-95 bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/10 w-full sm:w-auto"
                >
                  Настроить профиль
                </button>
              )}
            </div>
          </div>
        </div>

        <div>{panel}</div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setConfirmation(true);
            }}
            className="flex items-center gap-2 mb-1 px-4 py-2 rounded-lg font-medium transition-all 
             border border-red-400 bg-transparent text-red-500 hover:bg-red-400 hover:text-white hover:border-red-400 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
