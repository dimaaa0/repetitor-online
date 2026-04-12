"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

import TeacherPanel from "@/src/components/UI/TeacherPanel";
import StudentPanel from "@/src/components/UI/StudentPanel";

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
} from "lucide-react";

// Компоненты UI
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
  const [formData, setFormData] = useState({ name: "", surname: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const [subjects, setSubjects] = useState<string[]>([]); // Локальное состояние для отображения выбранных предметов
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [isPublishing, setIsPublishing] = useState(false);

  const [hasAd, setHasAd] = useState(false); // Есть ли уже объявление в базе

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
          data.subject ? data.subject.split(", ").map((s) => s.trim()) : [],
        );
      }

      if (data && data.subject) {
        // Превращаем строку из базы в массив
        const subjectsArray = data.subject.split(", ").map((s) => s.trim());

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

              console.log("Удаляем старый файл:", oldFilePath);

              // 3. Вызываем удаление
              const { data, error: removeError } = await supabase.storage
                .from("avatars")
                .remove([oldFilePath]);

              if (removeError) {
                console.error("Supabase Storage Error:", removeError);
              } else {
                console.log("Результат удаления:", data);
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
              {/* Иконки для красоты (опционально) */}
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
        {/* Шапка профиля */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 pb-4 sm:p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Секция Аватара */}
            <div className="relative group">
              <div className="h-24 w-24 mt-4 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shrink-0 overflow-hidden">
                {/* Приоритет: выбранный файл -> ссылка из базы -> первая буква имени */}
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
                  <div className="w-26 h-26 bg-blue-600 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                    <span className="text-white text-[32px] font-bold">
                      {user.name ? user.name[0].toUpperCase() : "?"}
                    </span>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="absolute inset-0 mt-4 flex items-center justify-center bg-black/30 rounded-2xl animate-in fade-in zoom-in duration-200">
                  <AddAvatar uploadAvatar={handleFileSelect} />
                </div>
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              {isEditing ? (
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 outline-none bg-blue-50/30 px-2 py-1 rounded-t-md w-full sm:w-auto"
                    placeholder="Имя"
                  />
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) =>
                      setFormData({ ...formData, surname: e.target.value })
                    }
                    className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 outline-none bg-blue-50/30 px-2 py-1 rounded-t-md w-full sm:w-auto"
                    placeholder="Фамилия"
                  />
                </div>
              ) : (
                <div className="flex flex-col min-[400px]:flex-row min-[400px]:gap-2 justify-center sm:justify-start">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name || "Пользователь"} {user.surname}
                  </h1>
                </div>
              )}
              <p className="text-gray-500 mt-2 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="h-4 w-4" /> {user.email}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl mt-4 font-bold text-xs transition-all shadow-sm active:scale-95 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
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
                    className="flex items-center gap-2 px-4 py-2 rounded-xl mt-4 font-bold text-xs transition-all shadow-sm active:scale-95 bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    <XCircle className="h-4 w-4" /> Отмена
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="group cursor-pointer relative flex items-center gap-2 px-4 py-2 rounded-xl mt-4 font-bold text-xs transition-all duration-300 shadow-sm active:scale-95 bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/10"
                >
                  Настроить профиль
                </button>
              )}
            </div>
          </div>
        </div>

        {user.role === "Tutor" ? <TeacherPanel /> : <StudentPanel />}

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-2 mb-4 text-red-500 hover:text-red-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" /> Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
