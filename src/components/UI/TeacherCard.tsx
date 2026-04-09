import React from "react";
import TeacherSkeleton from "./SkeletonLoader";

const TeacherCard = ({ teacher, isLoading }) => {
  // Если еще грузимся — возвращаем скелетон
  if (isLoading) {
    return <TeacherSkeleton />;
  }

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 p-2 pb-4 sm:p-6 md:p-8 transition-all duration-500 ...">
      {/* Весь твой код карточки здесь */}
      <div className="flex items-start gap-4 mb-4">
        <img src={teacher.avatar} alt={teacher.name} ... />
        
      </div>
    </div>
  );
};