"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (authUser) {
                // Забираем данные из твоей таблицы profiles
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", authUser.id)
                    .single();

                setUser({ ...authUser, ...profile });
            } else {
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();

        // Слушаем изменения авторизации (логин/логаут)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            fetchProfile();
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, refreshUser: fetchProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);