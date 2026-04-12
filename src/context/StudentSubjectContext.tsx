"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

interface SubjectContextType {
  selectedSubjects: string[];
  addSubject: (subject: string) => void;
  removeSubject: (subject: string) => void;
  setSelectedSubjects: (subjects: string[]) => void;
}

const StudentSubjectContext = createContext<SubjectContextType | undefined>(
  undefined,
);

export function StudentSubjectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const userContext = useUser();
  const user = userContext?.user;
  const [selectedSubjects, setSelectedSubjectsState] = useState<string[]>([]);

  // Очищаем предметы при смене роли пользователя
  useEffect(() => {
    if (user && user.role !== "Student") {
      setSelectedSubjectsState([]);
    }
  }, [user?.role]);

  const addSubject = (subject: string) => {
    const trimmed = subject.trim();
    if (trimmed && !selectedSubjects.includes(trimmed)) {
      setSelectedSubjectsState([...selectedSubjects, trimmed]);
    }
  };

  const removeSubject = (subject: string) => {
    setSelectedSubjectsState(selectedSubjects.filter((s) => s !== subject));
  };

  // Обертка для установки стейта напрямую
  const setSelectedSubjects = (subjects: string[]) => {
    setSelectedSubjectsState(subjects);
  };

  return (
    <StudentSubjectContext.Provider
      value={{
        selectedSubjects,
        addSubject,
        removeSubject,
        setSelectedSubjects, // Передаем его в провайдер
      }}
    >
      {children}
    </StudentSubjectContext.Provider>
  );
}

export const useSubject = () => {
  const context = useContext(StudentSubjectContext);
  if (!context) {
    throw new Error("useSubject must be used within a StudentSubjectProvider");
  }
  return context;
};
