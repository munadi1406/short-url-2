import Article from '@/models/article';
import { literal } from 'sequelize';
export const metadata = {
  title: "Redirecting...",
  description: "Redirecting...",
};
export default async function page({ params }) {
  const data = await Article.findOne({
    order: literal('RAND()'),
    attributes: ['slug'],
    limit: 1, // Batasi ke satu artikel
  });

  const { slug } = await params;

  // Redirect dan simpan slug di sessionStorage pada sisi client
  // Gunakan script untuk menyimpan slug di sessionStorage pada client side
  const redirectUrl = `/${data.slug}`;

  return (
    <>
      <h1>Redirecting...</h1>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            sessionStorage.setItem('slug', '${slug}');
            window.location.href = '${redirectUrl}';
          `,
        }}
      />
    </>
  );
}
