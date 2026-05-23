import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ModalProvider } from "../../context/ModalContext";
import "../globals.css";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import { UserProvider } from "../../context/UserContext";
import QueryProvider from "../../providers/QueryProvider";
import { TeacherSubjectProvider } from "../../context/TeacherSubjectContext";
import { StudentSubjectProvider } from "../../context/StudentSubjectContext";
import { StudentAnnouncementProvider } from "../../context/StudentAnnouncementContext";
import { TutorAnnouncementProvider } from "../../context/TeacherAnnouncementContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import React from "react";
// Импортируем наш новый компонент-триггер
import ScheduleReminder from "../../components/UI/ScheduleReminder";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Поиск репетиторов и учеников в Узбекистане - Repetitor Online",
  description:
    "Платформа для образования в Узбекистане: найдите репетитора или свежие вакансии для учителей и преподавателей. Разместите резюме или объявление о поиске учеников. Все предметы и города Узбекистана.",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Дожидаемся параметров роута, чтобы узнать текущий язык
  const { locale } = await params;

  // Проверяем, поддерживается ли этот язык (ru, uz, en)
  if (!['ru', 'uz', 'en'].includes(locale)) {
    notFound();
  }

  // Загружаем JSON-переводы для текущего языка на сервере
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <TeacherSubjectProvider>
              <StudentSubjectProvider>
                <TutorAnnouncementProvider>
                  <ModalProvider>
                    <UserProvider>
                      <StudentAnnouncementProvider>
                        <Header />

                        {/* 🔔 Вставляем триггер внутрь UserProvider, чтобы он имел доступ к контексту юзера */}
                        <ScheduleReminder />

                        <main className="flex-grow">{children}</main>
                        <Footer />
                      </StudentAnnouncementProvider>
                    </UserProvider>
                  </ModalProvider>
                </TutorAnnouncementProvider>
              </StudentSubjectProvider>
            </TeacherSubjectProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}