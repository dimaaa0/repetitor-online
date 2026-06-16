"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "../../../../../../utils/supabase/client";
import { useUser } from "../../../../../../context/UserContext";
import { Check, XCircle } from "lucide-react";

export default function CommentForm({
  adId,
  comments,
}: {
  adId: number;
  comments: any[];
}) {
  const [commentContent, setCommentContent] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [hasCommented, setHasCommented] = useState(false);

  const supabase = createClient();
  const { user } = useUser();
  const t = useTranslations("CommentForm");

  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  useEffect(() => {
    if (!user?.id || !adId) return;

    const checkComment = async () => {
      try {
        const { data, error } = await supabase
          .from("comments")
          .select("id")
          .eq("ad_id", adId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        setHasCommented(!!data);
      } catch (err) {
        console.error("Ошибка при проверке комментария:", err);
      }
    };

    checkComment();
  }, [adId, user?.id]);

  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    // Нам нужен только user.id, adId тут не при чем
    if (!user?.id) return;

    const checkBanList = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles") // ЗАПРАШИВАЕМ ПРОФИЛИ
          .select("is_banned")
          .eq("id", user.id) // Ищем по ID текущего юзера
          .maybeSingle();

        if (error) throw error;

        // Если в базе стоит true, сетим в стейт
        if (data?.is_banned) {
          setIsBanned(true);
        } else {
          setIsBanned(false);
        }
      } catch (err) {
        console.error("Ошибка при проверке статуса блокировки:", err);
        setIsBanned(false);
      }
    };

    checkBanList();
  }, [user?.id]); // Следим только за сменой юзера

  const postComment = async () => {
    if (!user?.id) {
      showAlert("error", t("error_sign_in_to_comment"));
      return;
    }
    if (!commentContent.trim()) {
      showAlert("error", t("error_enter_comment_text"));
      return;
    }

    setPublishing(true);

    try {
      const { error } = await supabase.from("comments").insert({
        user_id: user.id,
        ad_id: adId,
        content: commentContent.trim(),
      });

      if (error) {
        setPublishing(false);
        if (error.code === "23505") {
          showAlert("error", t("error_already_commented"));
        } else {
          showAlert("error", t("error_submit_comment"));
        }
        return;
      }

      setTimeout(() => {
        setCommentContent("");
        setPublishing(false);
        showAlert("success", t("success_comment_submitted"));
        setTimeout(() => location.reload(), 1500);
      }, 2000);
    } catch (err) {
      setPublishing(false);
      showAlert("error", t("error_unexpected"));
    }
  };

  const [tooManySymbols, setTooManySymbols] = useState(false);

  useEffect(() => {
    if (commentContent.length > 500) {
      setTooManySymbols(true);
    } else {
      setTooManySymbols(false);
    }
  }, [commentContent]);

  useEffect(() => {
    if (tooManySymbols) {
      showAlert("error", t("error_comment_too_long"))
    }
  }, [tooManySymbols])

  if (isBanned) {
    return (
      <div className="bg-red-50/50 p-4 md:p-6 rounded-[2rem] border border-red-200">
        <h3 className="text-sm font-bold text-red-700 mb-2 uppercase tracking-wider">
          {t("access_denied_title")}
        </h3>
        <p className="text-red-600 text-sm">{t("access_denied_description")}</p>
      </div>
    );
  }

  if (hasCommented) {
    return null;
  }
  return (
    <div className="bg-slate-50/50 p-4 md:p-6 rounded-[2rem] border border-slate-200">
      {alert && (
        <div className="fixed top-6 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none">
          <div
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in fade-in slide-in-from-top-4 duration-300 ${
              alert.type === "success"
                ? "bg-white border-green-100 text-green-800"
                : "bg-white border-red-100 text-red-800"
            }`}
          >
            {alert.type === "success" ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="font-bold text-sm">{alert.message}</span>
          </div>
        </div>
      )}

      <h3 className="text-sm font-bold text-slate-700 mb-4 px-1 uppercase tracking-wider">
        {t("title")}
      </h3>

      <div className="space-y-4">
        <textarea
          value={commentContent}
          disabled={publishing}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder={t("placeholder")}
          className="w-full min-h-[120px] p-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none text-slate-700 resize-none"
        />
        <div className="flex justify-end">
          <button
            onClick={postComment}
            disabled={publishing || tooManySymbols}
            className="flex items-center justify-center w-[200px] h-[46px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {publishing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t("btn_submit_comment")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
