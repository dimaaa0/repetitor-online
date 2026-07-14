"use client";
import { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../utils/supabase/client";

// Создаем один экземпляр клиента вне компонента, чтобы ссылка не менялась
const supabase = createClient();

// Описываем интерфейс контекста для нормального автодополнения в VS Code
interface UserContextType {
  user: any; // Здесь вместо any в идеале подставить твой тип User (Auth + Profile)
  loading: boolean;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  // Основной запрос данных профиля
  const {
    data: user = null, // По умолчанию null, пока идет загрузка
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, name, surname, role, avatar_url, is_subscribed, is_banned, availability, last_schedule_check")
        .eq("id", authUser.id)
        .single();

      return { ...authUser, ...profile };
    },
    // Защита: не спамить запросами, если пользователь просто переключает вкладки браузере
    staleTime: 1000 * 60 * 10, // Считаем профиль свежим 10 минут
  });

  // Слушаем изменения сессии (логин/логаут)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Сбрасываем кэш профиля при смене авторизации
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]); // supabase больше не нужен в зависимостях, так как он снаружи

  return (
    <UserContext.Provider
      value={{ user, loading: isLoading, refreshUser: refetch }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser должен использоваться строго внутри UserProvider");
  }
  return context;
};
