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
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
// Убрали неиспользуемый импорт React
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
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!["ru", "uz", "en"].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <UserProvider>
              <TeacherSubjectProvider>
                <StudentSubjectProvider>
                  <TutorAnnouncementProvider>
                    <StudentAnnouncementProvider>
                      <ModalProvider>
                        <Header />
                        <ScheduleReminder />
                        <main className="flex-grow">{children}</main>
                        <Footer />
                      </ModalProvider>
                    </StudentAnnouncementProvider>
                  </TutorAnnouncementProvider>
                </StudentSubjectProvider>
              </TeacherSubjectProvider>
            </UserProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
