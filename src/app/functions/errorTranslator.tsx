const getFriendlyError = (
  message: string,
  t: (id: string, values?: Record<string, unknown>) => string,
) => {
  // 1. Ошибки входа и регистрации
  if (message.includes("Invalid login credentials"))
    return t("errors.invalidLogin");
  if (message.includes("User already registered"))
    return t("errors.userAlreadyRegistered");
  if (message.includes("Password should be at least 6 characters"))
    return t("errors.passwordTooShort");
  if (message.includes("Email not confirmed"))
    return t("errors.emailNotConfirmed");

  if (message.includes("Error sending confirmation email")) {
    return t("errors.confirmationEmailFailure");
  }

  // 2. Ошибки при сбросе пароля
  if (message.includes("User not found")) return t("errors.userNotFound");
  if (
    message.includes("New password should be different from the old password")
  )
    return t("errors.passwordMustDiffer");

  // 3. Лимиты и безопасность (очень важно!)
  if (message.includes("Rate limit exceeded"))
    return t("errors.rateLimitExceeded");
  if (message.includes("Email rate limit exceeded"))
    return t("errors.emailRateLimitExceeded");
  if (message.includes("Captcha check failed"))
    return t("errors.captchaFailed");

  // 4. Проблемы с данными
  if (message.includes("Invalid email address"))
    return t("errors.invalidEmailAddress");
  if (message.includes("Anonymous sign-ins are disabled"))
    return t("errors.anonymousSignInsDisabled");

  // 5. Сетевые проблемы
  if (
    message.includes("Failed to fetch") ||
    message.includes("Network request failed")
  ) {
    return t("errors.connectionProblem");
  }

  return t("errors.genericError");
};

export default getFriendlyError;
