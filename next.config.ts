import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Твои текущие настройки проекта (например, supabase, images и т.д.) если они есть
};

export default withNextIntl(nextConfig);