import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // Получаем локаль из запроса, а если она не определилась — берем дефолтную 'ru'
  let locale = await requestLocale;
  
  if (!locale || !['ru', 'uz', 'en'].includes(locale)) {
    locale = 'ru';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});