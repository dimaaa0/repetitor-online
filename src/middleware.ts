import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr'; // Стандартный подход для SSR

const intlMiddleware = createMiddleware({
    locales: ['ru', 'uz', 'en'],
    defaultLocale: 'ru'
});

export async function middleware(request: NextRequest) {
    // 1. Сначала получаем ответ от next-intl (он управляет редиректами на /ru, /uz и т.д.)
    const response = intlMiddleware(request);

    // 2. Передаем этот ЖЕ ответ в Supabase, чтобы он работал с его куками
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    // Записываем куки и в запрос, и в ответ
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // 3. Обязательно вызываем getUser(), чтобы Supabase освежил сессию в куках
    await supabase.auth.getUser();

    // 4. Возвращаем единый модифицированный ответ
    return response;
}

export const config = {
    // matcher оставляем без изменений
    matcher: ['/', '/(ru|uz|en)/:path*']
};