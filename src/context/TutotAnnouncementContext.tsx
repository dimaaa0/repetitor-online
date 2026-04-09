"use client";
import { createContext, useContext, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

const TutotAnnouncementContext = createContext<any>(null);

export const TutorAnnouncementProvider = ({ children }: { children: React.ReactNode }) => {
    const supabase = createClient();
    const tutorAnnouncement = async (announcementData: any) => {
        const { data, error } = await supabase
            .from("ads")
            .select("*")
            .eq("id", announcementData.id)

//!ДОДЕЛАТЬ КОНТЕКСТ ДЛЯ ОБЪЯВЛЕНИЙ РЕПЕТИТОРОВ