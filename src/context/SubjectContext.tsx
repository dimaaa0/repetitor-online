"use client";

import React, { createContext, useContext, useState } from "react";

interface SubjectContextType {
  selectedSubjects: string[];
  addSubject: (subject: string) => void;
  removeSubject: (subject: string) => void;
  // Добавляем новый метод для массовой установки (из БД)
  setSelectedSubjects: (subjects: string[]) => void;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export function SubjectProvider({ children }: { children: React.ReactNode }) {
  const [selectedSubjects, setSelectedSubjectsState] = useState<string[]>([]);

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
    <SubjectContext.Provider
      value={{
        selectedSubjects,
        addSubject,
        removeSubject,
        setSelectedSubjects, // Передаем его в провайдер
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
}

export const useSubject = () => {
  const context = useContext(SubjectContext);
  if (!context) {
    throw new Error("useSubject must be used within a SubjectProvider");
  }
  return context;
};
