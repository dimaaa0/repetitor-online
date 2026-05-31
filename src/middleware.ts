import { type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';

const intlMiddleware = createMiddleware({
    locales: ['ru', 'uz', 'en'],
    defaultLocale: 'ru'
});

export default async function middleware(request: NextRequest) {
    // Получаем базовый ответ от next-intl для локализации
    const response = intlMiddleware(request);

    // Подключаем Supabase с твоим рабочим ключом франкфуртского сервера
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // Обновляем сессию пользователя, чтобы куки не протухали
    await supabase.auth.getUser();

    return response;
}

export const config = {
    // Этот matcher идеально подходит для структуры страниц /ru/teachers, /uz/teachers и т.д.
    matcher: ['/', '/(ru|uz|en)/:path*']
};