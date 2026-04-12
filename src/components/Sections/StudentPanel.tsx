"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { useUser } from "../../context/UserContext";
import { useSubject } from "../../context/StudentSubjectContext";
import StudentSubjectPicker from "../UI/StudentSubjectPicker";
import { Check, Loader2, Search, XCircle } from "lucide-react";

const StudentPanel = () => {
  const { user } = useUser();
  const { selectedSubjects, setSelectedSubjects } = useSubject();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [hasAd, setHasAd] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const checkEmptyFields = (
    title: string,
    selectedSubjects: string[],
    price: string,
    description: string,
  ) => {
    if (!title || title.trim().length < 10) {
      showAlert("error", "Пожалуйста, укажите, кого вы ищете (минимум 10 символов)");
      return false;
    }
    if (selectedSubjects.length === 0) {
      showAlert("error", "Пожалуйста, выберите хотя бы один предмет");
      return false;
    }
    if (!price) {
      showAlert("error", "Пожалуйста, введите бюджет");
      return false;
    }
    if (!description || description.trim().length < 10) {
      showAlert("error", "Пожалуйста, опишите свои цели и пожелания (минимум 10 символов)");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchAd = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("student_ads")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setHasAd(true);
        setTitle(data.title || "");
        setPrice(data.price ? Number(data.price).toLocaleString() : "");
        setDescription(data.description || "");
        const subjectsArray = data.subject
          ? data.subject.split(",").map((subject: string) => subject.trim())
          : [];
        setSelectedSubjects(subjectsArray);
      }

      if (error && error.code !== "PGRST116") {
        console.error("Ошибка при загрузке объявления студента:", error);
      }
    };

    fetchAd();
  }, [user, supabase, setSelectedSubjects]);

  const handlePublishAd = async () => {
    setIsPublishing(true);

    if (!checkEmptyFields(title, selectedSubjects, price, description)) {
      setIsPublishing(false);
      return;
    }

    const payload = {
      title: title.trim(),
      price: Number(price.replace(/,/g, "")),
      description: description.trim(),
      subject: selectedSubjects.join(", "),
    };

    const response = hasAd
      ? await supabase
          .from("student_ads")
          .update(payload)
          .eq("user_id", user?.id)
      : await supabase
          .from("student_ads")
          .insert({ ...payload, user_id: user?.id });

    if (response?.error) {
      showAlert("error", response.error.message);
    } else {
      setHasAd(true);
      showAlert("success", hasAd ? "Заявка обновлена" : "Заявка опубликована");
    }

    setIsPublishing(false);
  };

  return (
    <div>
      <div className="space-y-8 bg-white py-6 mt-6 px-4 sm:px-8 rounded-[32px] shadow-md border border-gray-100">
        {alert && (
          <div
            className={`p-4 rounded-2xl border ${
              alert.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {alert.type === "success" ? <Check size={18} /> : <XCircle size={18} />}
              {alert.message}
            </div>
          </div>
        )}

        <h1 className="text-[14px] font-black text-gray-500 uppercase tracking-[0.1em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Ваше объявление
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
              Кого вы ищете?
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-100 border-2 border-transparent focus:border-orange-500/10 focus:bg-white rounded-2xl px-5 py-4 font-bold text-gray-800 outline-none transition-all"
                placeholder="Например: Ищу репетитора по физике для подготовки к вузу"
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
              Ваш бюджет (до)
            </label>
            <div className="relative">
              <input
                type="text"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value
                      .replace(/\D/g, "")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  )
                }
                className="w-full bg-gray-100 border-2 border-transparent focus:border-orange-500/10 focus:bg-white rounded-2xl px-5 py-4 font-bold text-gray-800 outline-none transition-all"
                placeholder="100,000"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                UZS / 60 МИН
              </span>
            </div>
          </div>
        </div>

        <StudentSubjectPicker />

        <div>
          <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
            Цели обучения и пожелания
          </label>
          <div className="bg-gray-100 rounded-[24px] p-5 border-2 border-transparent focus-within:border-orange-500/10 focus-within:bg-white transition-all">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 p-0 text-[15px] font-medium text-gray-700 placeholder:text-gray-400 resize-none h-32 leading-relaxed"
              placeholder="Опишите ваш текущий уровень, цель занятий и удобное время..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handlePublishAd}
          disabled={isPublishing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-5 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-[0.97] flex items-center justify-center gap-2"
        >
          {isPublishing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Загрузка...
            </>
          ) : hasAd ? (
            "Обновить заявку"
          ) : (
            "Разместить заявку"
          )}
        </button>
      </div>
    </div>
  );
};

export default StudentPanel;
