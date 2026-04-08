"use client"

import React, { createContext, useContext, useState } from 'react';

interface SubjectContextType {
    selectedSubjects: string[];
    addSubject: (subject: string) => void;
    removeSubject: (subject: string) => void;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export function SubjectProvider({ children }: { children: React.ReactNode }) {
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    const addSubject = (subject: string) => {
        const trimmed = subject.trim();
        if (trimmed && !selectedSubjects.includes(trimmed)) {
            setSelectedSubjects([...selectedSubjects, trimmed]);
        }
    };

    const removeSubject = (subject: string) => {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    };

    return (
        <SubjectContext.Provider value={{ selectedSubjects, addSubject, removeSubject }}>
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
}