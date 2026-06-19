"use client";

import { useTranslations } from "next-intl";

interface PrivacyPolicyPageProps {
  setPrivatePolicy: (value: boolean) => void;
}

export default function PrivacyPolicyPage({
  setPrivatePolicy,
}: PrivacyPolicyPageProps) {
  const t = useTranslations("PrivatePolicy");

  const sections = [
    {
      title: t("sections.collection.title"),
      body: [t("sections.collection.intro")],
      cards: [
        {
          title: t("sections.collection.tutorTitle"),
          titleClassName: "text-blue-600",
          body: t("sections.collection.tutorDesc"),
        },
        {
          title: t("sections.collection.studentTitle"),
          titleClassName: "text-green-600",
          body: t("sections.collection.studentDesc"),
        },
      ],
      note: t("sections.collection.note"),
    },
    {
      title: t("sections.usage.title"),
      body: [t("sections.usage.intro")],
      list: [t("sections.usage.itemOne"), t("sections.usage.itemTwo")],
    },
    {
      title: t("sections.sharing.title"),
      body: [
        t("sections.sharing.paragraphOne"),
        t("sections.sharing.paragraphTwo"),
      ],
    },
    {
      title: t("sections.security.title"),
      body: [
        t("sections.security.paragraphOne"),
        t("sections.security.paragraphTwo"),
      ],
    },
    {
      title: t("sections.rights.title"),
      body: [t("sections.rights.paragraphOne")],
    },
  ];

  return (
    <div className="fixed inset-0 z-9999 overflow-y-auto bg-gray-50 text-gray-800 font-sans antialiased selection:bg-blue-100">
      <main className="max-w-3xl mx-auto px-6 py-12 relative">
        <article className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-8 sm:p-10 relative">
          <button
            onClick={() => setPrivatePolicy(false)}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all active:scale-90"
            title={t("close")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-8 text-[15px] leading-relaxed">
            {sections.map((section, index) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                  {index + 1}. {section.title}
                </h2>

                <div className="space-y-2">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {section.cards ? (
                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    {section.cards.map((card) => (
                      <div
                        key={card.title}
                        className="p-4 bg-gray-50 border border-gray-100 rounded-xl"
                      >
                        <h3 className={`font-bold text-sm mb-1 ${card.titleClassName}`}>
                          {card.title}
                        </h3>
                        <p className="text-xs text-gray-500">{card.body}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {section.list ? (
                  <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                {section.note ? (
                  <p className="text-sm text-gray-500 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                    🛠 <strong>{t("sections.collection.noteLabel")}</strong>{" "}
                    {section.note}
                  </p>
                ) : null}
              </section>
            ))}

            <section className="border-t border-gray-100 pt-6 space-y-2">
              <h2 className="text-lg font-bold text-gray-900">
                {t("sections.contact.title")}
              </h2>
              <p>{t("sections.contact.intro")}</p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 inline-block text-sm">
                <p>
                  📬 <strong>{t("sections.contact.telegramLabel")}</strong>{" "}
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
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {t("closeDocument")}
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}