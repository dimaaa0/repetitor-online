import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { createClient } from './utils/supabase/middleware'; // Изменили импорт здесь

const intlMiddleware = createMiddleware({
    locales: ['ru', 'uz', 'en'],
    defaultLocale: 'ru'
});

export async function middleware(request: NextRequest) {
    // Вызываем функцию так, как она экспортирована в вашем файле Supabase
    const supabaseResponse = await createClient(request);

    const intlResponse = intlMiddleware(request);

    if (supabaseResponse) {
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            intlResponse.cookies.set(cookie.name, cookie.value);
        });
    }

    return intlResponse;
}

export const config = {
    matcher: ['/', '/(ru|uz|en)/:path*']
};