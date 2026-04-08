"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import { createClient } from "../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  LogOut,
  ShieldCheck,
  CreditCard,
  Loader2,
  Check,
  XCircle,
} from "lucide-react";
import CopyButton from "@/src/components/UI/HandleCopyButton";
import AddAvatar from "@/src/components/UI/AddAvatar";
import SubjectPicker from "@/src/components/UI/SubjectPicker";

const Profile = () => {
  const { user, loading, refreshUser } = useUser();
  const supabase = createClient();
  const router = useRouter();

  // Состояния
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", surname: "" });
  const [selectedFile, setSelectedFile] = useState(null); // Файл, который выбрал пользователь

  // Синхронизация данных формы с пользователем
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

  // 1. Функция только для ВЫБОРА файла в AddAvatar
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showAlert("Файл слишком большой (макс. 2МБ)");
        return;
      }
      setSelectedFile(file);
    }
  };

  // 2. Основная функция сохранения всего профиля
  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      let finalAvatarUrl = user.avatar_url;

      // Если выбран новый файл — сначала загружаем его
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const filePath = `${user.id}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        finalAvatarUrl = publicUrl;
      }

      // Обновляем данные в таблице profiles
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          surname: formData.surname,
          avatar_url: finalAvatarUrl, // Обновляем ссылку на фото
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      await refreshUser(); // Обновляем контекст
      setIsEditing(false);
      setSelectedFile(null); // Очищаем временный файл
      alert("Профиль обновлен успешно!");
    } catch (error) {
      alert("Ошибка при обновлении профиля");
      console.error(error);
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
        {/* Шапка профиля */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 pb-4 sm:p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Секция Аватара */}
            <div className="relative group">
              <div className="h-24 w-24 mt-4 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shrink-0 overflow-hidden">
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
                  (user.name?.[0] || user.email?.[0]).toUpperCase()
                )}
              </div>

              {isEditing && (
                <div className="absolute inset-0 mt-4 flex items-center justify-center bg-black/30 rounded-full animate-in fade-in zoom-in duration-200">
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

        {/* Инфо-карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <div className="bg-white rounded-2xl py-6 shadow-sm border border-gray-100 p-2 pb-6 sm:p-6 md:p-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Данные аккаунта
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Роль</p>
                <p className="font-medium text-gray-800">
                  {user.role || "User"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  ID Пользователя
                </p>
                <p className="font-medium text-gray-800 truncate">{user.id}</p>
                <CopyButton textToCopy={user.id} label="ID" />
              </div>
            </div>
          </div>

          <div className="bg-white flex flex-col justify-between rounded-2xl py-6 shadow-sm border border-gray-100 p-2 pb-6 sm:p-6 md:p-8">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Тарифный план
              </h3>
              <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter border border-green-100">
                Активен
              </span>
            </div>
            {/* ... тут остальной код подписки ... */}
          </div>
        </div>

        {/* Секция объявления */}
        <div className="space-y-8 bg-white py-6 mt-6 px-4 sm:px-8 rounded-[32px] shadow-md border border-gray-100">
          <h1 className="text-[14px] font-black text-gray-500 uppercase tracking-[0.1em] mb-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Ваше
            объявление
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
                Стоимость занятия
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500/10 focus:bg-white rounded-2xl px-5 py-4 font-bold text-gray-800 outline-none transition-all"
                  placeholder="100,000"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                  UZS / 60 МИН
                </span>
              </div>
            </div>
          </div>

          <SubjectPicker />

          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
              О себе и методике
            </label>
            <div className="bg-gray-50 rounded-[24px] p-5 border-2 border-transparent focus-within:border-blue-500/10 focus-within:bg-white transition-all">
              <textarea
                className="w-full bg-transparent border-none focus:ring-0 p-0 text-[15px] font-medium text-gray-700 placeholder:text-gray-400 resize-none h-32 leading-relaxed"
                placeholder="Например: Опыт работы..."
              />
            </div>
          </div>

          <div className="pt-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-[0.97]">
              Опубликовать объявление
            </button>
          </div>
        </div>

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
