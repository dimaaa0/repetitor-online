import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ModalProvider } from "../context/ModalContext";
import "./globals.css";
import Header from "../components/Layout/Header";
import { UserProvider } from "../context/UserContext";
import QueryProvider from "../providers/QueryProvider";
import { TeacherSubjectProvider } from "../context/TeacherSubjectContext";
import { StudentSubjectProvider } from "../context/StudentSubjectContext";
import { StudentAnnouncementProvider } from "../context/StudentAnnouncementContext";
import { TutorAnnouncementProvider } from "../context/TeacherAnnouncementContext";

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
    "Платформа для образования в Узбекистане: найдите учителя или свежие вакансии для учителей и преподавателей. Разместите резюме или объявление о поиске учеников. Все предметы и города Узбекистана.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <TeacherSubjectProvider>
            <StudentSubjectProvider>
              <TutorAnnouncementProvider>
                <ModalProvider>
                  <UserProvider>
                    <StudentAnnouncementProvider>
                      <Header />
                      {children}
                    </StudentAnnouncementProvider>
                  </UserProvider>
                </ModalProvider>
              </TutorAnnouncementProvider>
            </StudentSubjectProvider>
          </TeacherSubjectProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
