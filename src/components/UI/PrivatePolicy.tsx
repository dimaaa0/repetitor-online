import Link from "next/link";

interface PrivacyPolicyPageProps {
  // Исправил тип пропса, чтобы TypeScript не ругался при передаче функции из useState
  setPrivatePolicy: (value: boolean) => void; 
}

export default function PrivacyPolicyPage({
  setPrivatePolicy,
}: PrivacyPolicyPageProps) {
  return (
    <div className="fixed inset-0 z-9999 overflow-y-auto bg-gray-50 text-gray-800 font-sans antialiased selection:bg-blue-100">
      <main className="max-w-3xl mx-auto px-6 py-12 relative">
        
        <article className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-8 sm:p-10 relative">
          
          {/* УДОБНАЯ КНОПКА-КРЕСТИК В ВЕРХНЕМ ПРАВОМ УГЛУ */}
          <button
            onClick={() => setPrivatePolicy(false)}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all active:scale-90"
            title="Закрыть"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-8 text-[15px] leading-relaxed">
            {/* 1. Что мы собираем */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                1. Что мы собираем и зачем?
              </h2>
              <p>
                Мы берем только те данные, без которых сайт просто не сможет
                работать. Ничего лишнего:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <h3 className="font-bold text-sm mb-1 text-blue-600">
                    Если вы Репетитор:
                  </h3>
                  <p className="text-xs text-gray-500">
                    Имя, фамилия, telephone или почту (чтобы ученики могли
                    связаться), фото (по желанию), информация об опыте и ваше
                    расписание занятий.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <h3 className="font-bold text-sm mb-1 text-green-600">
                    Если вы Ученик:
                  </h3>
                  <p className="text-xs text-gray-500">
                    Ваше имя, telephone или почту для связи, а также предметы,
                    которые вы хотите подтянуть.
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                🛠 <strong>Техническая штука:</strong> Для входа в аккаунт мы
                используем надежную систему <em>Supabase</em>. Она шифрует ваши
                пароли так, что даже мы сами их не знаем и не видим.
              </p>
            </section>

            {/* 2. Зачем это нужно */}
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                2. Как мы используем эти данные?
              </h2>
              <p>Тут всё прозрачно. Данные нужны, чтобы:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                <li>Создать вам личный кабинет.</li>
                <li>Помочь ученику и репетитору найти друг друга.</li>
              </ul>
            </section>

            {/* 3. Передача третьим лицам */}
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                3. Делимся ли мы данными с кем-то еще?
              </h2>
              <p>
                <strong>Нет.</strong> Мы никому не продаем и не передаем ваши
                телефоны или почту ради спама или рекламы.
              </p>
              <p>
                Их видят только пользователи внутри платформы (например, ученик
                видит анкету репетитора, чтобы записаться на урок). Исключение —
                если этого официально потребуют законы Республики Узбекистан.
              </p>
            </section>

            {/* 4. Безопасность */}
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                4. Безопасность и файлы Cookie
              </h2>
              <p>
                Наш сайт работает по защищенному протоколу HTTPS — это значит,
                что весь трафик между вашим телефоном/компьютером и сервером
                зашифрован.
              </p>
              <p>
                Мы также используем <strong>куки (cookies)</strong>. Это
                крошечные текстовые файлы, благодаря которым сайт «помнит», что
                вы уже залогинились. Без них вам пришлось бы вводить пароль
                заново при каждом переходе на новую страницу.
              </p>
            </section>

            {/* 5. Права */}
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                5. Вы полностью контролируете свои данные
              </h2>
              <p>
                Вы — полноправный хозяин своей информации. В любой момент в
                настройках профиля вы можете изменить имя, телефон или фото.
                Если вы решите полностью удалить свой аккаунт — напишите нам, и
                мы сотрем все данные из базы без остатка.
              </p>
            </section>

            {/* 6. Контакты */}
            <section className="border-t border-gray-100 pt-6 space-y-2">
              <h2 className="text-lg font-bold text-gray-900">
                Остались вопросы?
              </h2>
              <p>
                Если что-то непонятно или вы хотите удалить профиль, просто
                напишите нам на Telegram - мы на связи:
              </p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 inline-block text-sm">
                <p>
                  📬 <strong>Telegram для связи:</strong>{" "}
                  <a
                    href="https://t.me/dimaaa_o"
                    className="text-blue-600 hover:underline"
                  >
                    @dimaaa_o
                  </a>
                </p>
              </div>
            </section>
          </div>

          <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
            <button
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all active:scale-95 duration-150"
              onClick={() => setPrivatePolicy(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Закрыть документ
            </button>
          </div>

        </article>
      </main>
    </div>
  );
}