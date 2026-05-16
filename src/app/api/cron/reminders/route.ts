import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface UserNotification {
  email: string;        // Куда физически уйдет письмо
  realEmail: string;    // Чья подписка реально заканчивается (для логов и текста)
  expiresAt: string;
  subject: string;
}

export async function GET(request: Request) {
  try {
    // Автоматическое определение окружения: true на локалке, false на продакшене
    const isLocal = process.env.NODE_ENV === "development";
    const MY_VERIFIED_EMAIL = "pisarenkodimarik@gmail.com";

    // 1. Получаем историю платежей
    const { data: payments, error: paymentsError } = await supabase
      .from("payment_history")
      .select("user_id, paid_at, months_paid");

    if (paymentsError) throw paymentsError;
    if (!payments || payments.length === 0) {
      return NextResponse.json({ message: "Нет данных о платежах." });
    }

    // 2. Получаем пользователей из Auth системы Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    const userEmailMap = new Map<string, string>();
    authData.users.forEach((user) => {
      if (user.email) userEmailMap.set(user.id, user.email);
    });

    // Текущая дата без учета времени и часовых поясов
    const currentLocalDate = new Date();
    const cleanToday = new Date(
      currentLocalDate.getFullYear(),
      currentLocalDate.getMonth(),
      currentLocalDate.getDate()
    );

    const usersToNotify: UserNotification[] = [];
    const userLatestSubscriptions: Record<string, Date> = {};
    const debugLogs: any[] = [];

    // 3. Находим самую последнюю дату окончания подписки для каждого пользователя
    for (const payment of payments) {
      const paidDate = new Date(payment.paid_at);

      const expiresDate = new Date(
        paidDate.getFullYear(),
        paidDate.getMonth() + payment.months_paid,
        paidDate.getDate()
      );

      if (
        !userLatestSubscriptions[payment.user_id] ||
        expiresDate > userLatestSubscriptions[payment.user_id]
      ) {
        userLatestSubscriptions[payment.user_id] = expiresDate;
      }
    }

    // 4. Проверяем, у кого осталось от 1 до 3 календарных дней
    for (const userId in userLatestSubscriptions) {
      const expiresAt = userLatestSubscriptions[userId];
      const userEmail = userEmailMap.get(userId) || "Не найден email";

      // Считаем чистую календарную разницу между днями
      const diffTime = expiresAt.getTime() - cleanToday.getTime();
      const diffDays = Math.floor (diffTime / (1000 * 60 * 60 * 24));

      // Сохраняем данные для дебага
      debugLogs.push({
        email: userEmail,
        expiresAt: expiresAt.toLocaleDateString("ru-RU"),
        daysRemaining: diffDays,
      });

      // Если осталось 3, 2 или ровно 1 день
      if (diffDays >= 1 && diffDays <= 3) {
        const email = userEmailMap.get(userId);

        if (email) {
          // Если локалка — шлем на твою почту, если продакшен — на реальную почту юзера
          const targetEmail = isLocal ? MY_VERIFIED_EMAIL : email;

          let subjectText = `До конца подписки осталось ${diffDays} дня! ⏳`;
          if (diffDays === 1) {
            subjectText = `Ваша подписка заканчивается завтра! 🚨`;
          }

          // На локалке добавляем пометку в тему, для кого этот тест
          const finalSubject = isLocal ? `${subjectText} (Тест для: ${email})` : subjectText;

          usersToNotify.push({
            email: targetEmail,
            realEmail: email,
            expiresAt: expiresAt.toLocaleDateString("ru-RU"),
            subject: finalSubject,
          });
        }
      }
    }

    // Если никто не подошел под условия
    if (usersToNotify.length === 0) {
      return NextResponse.json({
        message: "Сегодня нет подходящих пользователей (у кого осталось от 1 до 3 дней).",
        debugData: debugLogs,
      });
    }

    // 5. Формируем батч писем для Resend
    const emailBatch = usersToNotify.map((user) => ({
      // На локалке шлем от тестового домена, на продакшене — от твоего подтвержденного
      from: isLocal ? "onboarding@resend.com" : "Репетиторы Онлайн <noreply@yourdomain.com>",
      to: user.email,
      subject: user.subject,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2>Здравствуйте!</h2>
          <p>Напоминаем, что оплаченный доступ к платформе для аккаунта <strong>${user.realEmail}</strong> заканчивается <strong>${user.expiresAt}</strong>.</p>
          <p>Чтобы занятия не прерывались, вы можете продлить подписку в личном кабинете.</p>
          <br>
          <a href="https://yourdomain.com/dashboard" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Продлить подписку</a>
        </div>
      `,
    }));

    // Отправляем батч через Resend
    const { data: resendData, error: resendError } = await resend.batch.send(emailBatch);
    if (resendError) throw resendError;

    return NextResponse.json({
      success: true,
      environment: isLocal ? "development (тестовый режим на локалке)" : "production (живой продакшен)",
      sentCount: emailBatch.length,
      resendData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}