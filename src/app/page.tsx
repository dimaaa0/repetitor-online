import React from "react";
import Header from "../components/Layout/Header";
import Home from "../components/Sections/Home";

const page = () => {
  return (
    <>
      <main>
        <Home />
        <a href="/SupabaseData">Supabase</a>
      </main>
    </>
  );
};

export default page;
