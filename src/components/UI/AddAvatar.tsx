import React, { useRef, useState } from "react";

interface AddAvatarProps {
  uploadAvatar: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => Promise<void> | void;
}

const AddAvatar = ({ uploadAvatar }: AddAvatarProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null); // Сам файл для отправки в БД
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Ссылка для отображения картинки в UI
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Реф для вызова окна выбора файла

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Создаем временную ссылку для превью
      await uploadAvatar(e);
    }
  };

  return (
    <div className="flex items-start gap-6 flex-col sm:flex-row">
      <div className="relative group">
        {/* Скрытый настоящий инпут */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Визуальный блок */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer overflow-hidden
        ${
          previewUrl
            ? "border-blue-500 bg-white"
            : "bg-gray-50 border-gray-200 group-hover:border-blue-500 group-hover:bg-blue-50"
        }`}
        >
          {previewUrl ? (
            // Если фото выбрано — показываем превью
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            // Если фото нет — показываем иконку плюса
            <>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-[10px] font-black text-gray-400 group-hover:text-blue-600 uppercase tracking-tighter">
                Фото
              </span>
            </>
          )}
        </div>

        {/* Кнопка удаления (крестик), появляется только если фото выбрано */}
        {previewUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewUrl(null);
              setImageFile(null);
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AddAvatar;
