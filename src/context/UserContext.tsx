"use client";
import { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../utils/supabase/client";

const supabase = createClient();

interface UserContextType {
  user: any;
  loading: boolean;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  // Основной запрос данных профиля
  const {
    data: user = null,
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
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

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
