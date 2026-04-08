import getFriendlyError from "../../app/functions/errorTranslator";

import React, { useState } from "react";

const ErrorNotification = () => {
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };
};

return () => {};

export default ErrorNotification;

// ИМПОРТИРОВАТЬ getFriendlyError везде, где нужно показывать ошибки пользователю, и вместо сырых сообщений из API вызывать showAlert("error", getFriendlyError(rawMessage)) для отображения понятных уведомлений.


