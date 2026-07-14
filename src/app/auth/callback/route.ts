import { createClient } from '../../../utils/supabase/server'; // Или ваш путь к серверному клиенту
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Переменная 'next' скажет бэкенду, куда кинуть юзера после обмена кода (в нашем случае на /update-password)
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Если это сброс пароля, перенаправляем на страницу ввода нового пароля
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}`);
}
