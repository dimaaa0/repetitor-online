
const getFriendlyError = (message: string) => {
    // 1. Ошибки входа и регистрации
    if (message.includes("Invalid login credentials"))
        return "Неверная почта или пароль";
    if (message.includes("User already registered"))
        return "Этот email уже занят";
    if (message.includes("Password should be at least 6 characters"))
        return "Пароль должен быть не менее 6 символов";
    if (message.includes("Email not confirmed"))
        return "Пожалуйста, подтвердите вашу почту";

    if (message.includes("Error sending confirmation email")) {
        return "Не удалось отправить письмо подтверждения. Повторите попытку позже";
    }

    // 2. Ошибки при сбросе пароля
    if (message.includes("User not found"))
        return "Пользователь с такой почтой не найден";
    if (
        message.includes("New password should be different from the old password")
    )
        return "Новый пароль должен отличаться от старого";

    // 3. Лимиты и безопасность (очень важно!)
    if (message.includes("Rate limit exceeded"))
        return "Слишком много попыток. Подождите пару минут";
    if (message.includes("Email rate limit exceeded"))
        return "Мы уже отправили письмо. Подождите немного перед повторной попыткой";
    if (message.includes("Captcha check failed"))
        return "Ошибка проверки капчи. Попробуйте еще раз";

    // 4. Проблемы с данными
    if (message.includes("Invalid email address"))
        return "Некорректный адрес почты";
    if (message.includes("Anonymous sign-ins are disabled"))
        return "Вход без регистрации отключен";

    // 5. Сетевые проблемы
    if (
        message.includes("Failed to fetch") ||
        message.includes("Network request failed")
    ) {
        return "Проблема с интернет-соединением";
    }

    return "Произошла ошибка. Попробуйте еще раз";
};

export default getFriendlyError;
