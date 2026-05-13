"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../../utils/supabase/client"; // Укажите ваш путь к клиенту
import { Check, Pencil, X, Save, Trash2, XCircle } from "lucide-react";
import { useUser } from "../../../../../context/UserContext";
import { Router } from "next/router";

interface Profile {
  name: string;
  surname: string;
  avatar_url: string | null;
  is_banned: boolean;
}

export interface commentType {
  id: number;
  created_at: string;
  content: string;
  user_id: string;
  ad_id: string;
  profiles: Profile;
}

export default function CommentsList({
  comments,
  adId,
}: {
  comments: commentType[];
  adId: string;
}) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { user } = useUser();

  const sortedComments = [...comments].sort((a, b) => {
    if (a.user_id === user?.id) return -1;
    if (b.user_id === user?.id) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const showMore = () => setVisibleCount((prev) => prev + 5);

  const handleUpdate = async (id: number) => {
    if (!editContent.trim() || !user) return;
    setIsSaving(true);

    const supabase = await createClient();

    // Строим запрос
    let query = supabase
      .from("comments")
      .update({ content: editContent.trim() })
      .eq("id", id);

    // Если НЕ админ, проверяем владение комментарием
    if (user.role !== "Admin") {
      query = query.eq("user_id", user.id);
    }

    const { error } = await query;

    if (error) {
      showAlert("error", "Ошибка при обновлении.");
      setIsSaving(false);
    } else {
      setTimeout(() => {
        showAlert("success", "Отзыв обновлен");
        setTimeout(() => window.location.reload(), 500);
      }, 2000);
    }
  };

  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [commentToDeleteId, setCommentToDeleteId] = useState(
    null as number | null,
  );

  const openDeleteConfirm = (commentId: number | null) => {
    setCommentToDeleteId(commentId);
    setOpenConfirmModal(true);
  };

  const closeDeleteConfirm = () => {
    setCommentToDeleteId(null);
    setOpenConfirmModal(false);
  };

  const handleDelete = async (id: number | null) => {
    if (!user || !id) return;

    const supabase = await createClient();

    let query = supabase.from("comments").delete().eq("id", id);

    if (user.role !== "Admin") {
      query = query.eq("user_id", user.id);
    }

    const { error } = await query;

    if (error) {
      console.error("Error deleting:", error);
      showAlert("error", "Не удалось удалить комментарий");
    } else {
      showAlert("success", "Удалено");
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  if (comments.length === 0) {
    return (
      <p className="text-slate-400 italic text-center py-10">
        Отзывов пока нет. Будьте первым!
      </p>
    );
  }

  const remainingCount = comments.length - visibleCount;

  return (
    <div className="space-y-3">
      {alert && (
        <div className="fixed top-6 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none">
          <div
            className={`
        pointer-events-auto
        flex items-center gap-3
        px-6 py-4 rounded-2xl shadow-2xl border
        animate-in fade-in slide-in-from-top-4 duration-300
        ${alert.type === "success"
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
      )}{" "}
      {openConfirmModal && (
        <div className="fixed inset-0 h-full z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">Подтвердите удаление</h3>
            <p className="text-slate-600 mb-6">
              Вы уверены, что хотите удалить этот отзыв? Это действие нельзя
              будет отменить.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-slate-500 font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  handleDelete(commentToDeleteId);
                  closeDeleteConfirm();
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Плотное расположение карточек */}
      {sortedComments.slice(0, visibleCount).map((comment) => {
        const isMyComment =
          comment.user_id === user?.id || user?.role === "Admin";
        const isEditing = editingId === comment.id;

        return (
          <div
            key={comment.id}
            className={`group p-3 sm:p-5 rounded-2xl md:rounded-[2rem] border transition-all duration-300 ${isMyComment
              ? "bg-blue-50/30 border-blue-100 shadow-sm"
              : "bg-gray-50/40 border-transparent hover:bg-white hover:border-slate-200"
              }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {comment.profiles?.avatar_url ? (
                  <img
                    src={comment.profiles.avatar_url}
                    className="w-7 h-7 md:w-9 md:h-9 rounded-full object-cover border border-white"
                    alt="avatar"
                  />
                ) : (
                  <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] md:text-sm font-bold">
                    {comment.profiles?.name?.[0] || "U"}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-[13px] md:text-base leading-none">
                      {comment.profiles?.name} {comment.profiles?.surname}
                    </h4>
                    {isMyComment && (
                      <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md font-bold">
                        Вы
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {
                      new Date(comment.created_at)
                        .toLocaleString("ru-RU", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        .replace(",", "") // Убираем запятую между датой и временем
                        .replace(" г.", "") // Убираем " г." после года
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="flex mb-2 items-center gap-1">
              {user?.role === "Admin" && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(comment.user_id);
                    // Опционально: можно добавить здесь toast-уведомление
                  }}
                  title="Нажмите, чтобы скопировать ID"
                  className="cursor-pointer active:scale-95 transition-transform bot-0 text-[11px] sm:text-[12px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-md font-bold"
                >
                  {comment.user_id}
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2 animate-in fade-in duration-200">
                <textarea
                  autoFocus
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[180px] p-2 rounded-lg border hyphens-auto text-justify border-blue-200 bg-white text-[15px] outline-none"
                />
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-1.5">
                  <button
                    onClick={() => setEditingId(null)}
                    className="py-2 mr-2 text-[11px] bg-gray-100 hover:bg-gray-200 duration-300 p-2 px-4 rounded-lg cursor-pointer font-semibold text-slate-500"
                  >
                    Отмена
                  </button>
                  <button
                    disabled={isSaving}
                    onClick={() => handleUpdate(comment.id)}
                    className="flex items-center justify-center cursor-pointer duration-300 hover:bg-blue-700 py-2 w-[110px] h-[32px] text-[11px] font-bold bg-blue-600 text-white rounded-lg transition-all"
                  >
                    {isSaving ? (
                      // Контейнер лоадера: центрируем строго по середине
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    ) : (
                      <span>Сохранить</span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-600 leading-normal hyphens-auto text-justify text-[13px] whitespace-pre-line break-words md:text-base whitespace-pre-line px-0.5">
                {comment.content}

              </p>
            )}


            {isMyComment && !isEditing && (
              <div className="flex justify-end">
                <div className="translate-y-2">
                  <button
                    onClick={() => {
                      openDeleteConfirm(comment.id);
                    }}
                    className="p-2 flex justify-center items-center cursor-pointer hover:bg-gray-100 rounded-full  text-red-400 hover:text-red-600 active:scale-90"
                  >
                    <Trash2 className=" w-4 h-4 " />
                  </button>
                </div>
                {!comment.profiles.is_banned && (
                  <div className="translate-y-2">
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="p-2 flex justify-center items-center cursor-pointer hover:bg-gray-100 rounded-full  text-blue-400 hover:text-blue-600 active:scale-90"
                    >
                      <Pencil className=" w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        );
      })}
      {visibleCount < comments.length && (
        <button
          onClick={showMore}
          className="w-full py-3 text-[11px] text-slate-400 font-bold hover:text-blue-600 transition-all border border-dashed border-slate-200 rounded-xl"
        >
          Еще отзывы ({remainingCount})
        </button>
      )}
    </div>
  );
}
