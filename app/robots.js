export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '/dashboard/',
      },
      sitemap: `${process.env.NEXTAUTH_URL}sitemap.xml`,
    }
  }