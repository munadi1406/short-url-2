'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { badgeVariants } from "../ui/badge"
import { quality } from "@/lib/quality";


// Urutan kualitas secara otomatis


export default function Links({ data }) {
  const defaultValue = data[0]?.id;

  // Fungsi untuk mengurutkan dan mengelompokkan link berdasarkan kualitas
  const groupAndSortLinks = (postLinks) => {
    // Urutkan berdasarkan kualitas
    const sortedLinks = postLinks.sort((a, b) => {
      const qualityIndexA = quality.indexOf(a.quality);
      const qualityIndexB = quality.indexOf(b.quality);
      return qualityIndexA - qualityIndexB;
    });

    // Kelompokkan berdasarkan kualitas
    return sortedLinks.reduce((acc, link) => {
      // Jika kelompok untuk quality belum ada, buat baru
      if (!acc[link.quality]) {
        acc[link.quality] = [];
      }
      acc[link.quality].push(link); // Tambahkan link ke dalam kelompok yang sesuai
      return acc;
    }, {});
  };

  return (
    <div>
      <Tabs defaultValue={defaultValue} className="w-full" orientation="vertical">
        <TabsList>
          {data?.map((e, i) => (
            <TabsTrigger value={e.id} key={i}>{e.title}</TabsTrigger>
          ))}
        </TabsList>

        {data?.map((e, i) => (
          <TabsContent value={e.id} key={i}>
            <h3>{e.title}</h3>


            {/* Kelompokkan dan urutkan post_links berdasarkan kualitas */}
            {Object.keys(groupAndSortLinks(e.post_links)).map((quality) => (
              <div key={quality} className="border-l-2 border-blue-600 px-2">
                <h4 className="mt-4">{quality}</h4>
                <div className="flex flex-wrap gap-2">
                  {groupAndSortLinks(e.post_links)[quality].map((link, subIndex) => (
                    <div key={subIndex}>
                      <a href={link.url} rel="noopener noreferrer" target="_blank" className={badgeVariants({ className: 'capitalize' })}>Link {subIndex + 1}</a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}