"use client";
import { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../utils/supabase/client";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Основной запрос данных профиля
  const {
    data: user,
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
        .select("*")
        .eq("id", authUser.id)
        .single();

      return { ...authUser, ...profile };
    },
  });

  // Слушаем изменения сессии (логин/логаут)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    });

    return () => subscription.unsubscribe();
  }, [supabase, queryClient]);

  return (
    <UserContext.Provider
      value={{ user, loading: isLoading, refreshUser: refetch }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
