"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ScheduleReminder from "../UI/ScheduleReminder";

export default function LocaleShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <Header />
      <ScheduleReminder />
      <main className="grow">{children}</main>
      <Footer />
    </>
  );
}
