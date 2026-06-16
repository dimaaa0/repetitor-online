import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ModalProvider } from "../../context/ModalContext";
import "../globals.css";
import { UserProvider } from "../../context/UserContext";
import QueryProvider from "../../providers/QueryProvider";
import { TeacherSubjectProvider } from "../../context/TeacherSubjectContext";
import { StudentSubjectProvider } from "../../context/StudentSubjectContext";
import { StudentAnnouncementProvider } from "../../context/StudentAnnouncementContext";
import { TutorAnnouncementProvider } from "../../context/TeacherAnnouncementContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import LocaleShell from "../../components/Layout/LocaleShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>; // 1. Меняем тип на Promise
}): Promise<Metadata> {
  const { locale } = await params; // 2. Добавляем await здесь
  const t = await getTranslations("Layout");

  return {
    title: t("title"),
    description: t("description"),
  };
}

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
                        <LocaleShell>{children}</LocaleShell>
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
