import { jsonResponse } from '@/lib/jsonResponse';
import { load } from 'cheerio';



export async function POST(req) {
    const { url } = await req.json();

    try {
        // Ambil konten HTML dari URL yang diberikan
        const response = await fetch(url);
        const html = await response.text();

        // Muat HTML menggunakan Cheerio
        const $ = load(html);

        // Pilih elemen konten yang ingin diproses
        const content = $('#pryc-wp-acctp-original-content');

        // Inisialisasi array untuk menyimpan hasil
        const episodes = [];

        // Variabel untuk melacak episode yang sedang diproses
        let currentEpisode = null;
        let linksByQuality = {};

        // Iterasi setiap paragraf dalam konten
        content.find('p').each((_, pElement) => {
            let paragraph = $(pElement).html()?.trim();
            if (!paragraph) return; // Lewati paragraf kosong atau undefined
            paragraph = paragraph.replace(/<br\s*\/?>/gi, ' '); // Normalisasi line breaks

            // Periksa apakah paragraf dimulai dengan "Episode"
            const episodeMatch = paragraph.match(/Episode\s(\d+)/);
            if (episodeMatch) {
                // Simpan episode sebelumnya jika ada
                if (currentEpisode) {
                    const formattedLinks = Object.entries(linksByQuality).map(([quality, links]) => ({
                        quality,
                        links,
                    }));
                    episodes.push({
                        episode: currentEpisode,
                        links: formattedLinks,
                    });
                }

                // Tentukan episode baru dan reset links
                currentEpisode = episodeMatch[1];
                linksByQuality = {}; // Reset links untuk episode baru
            } else {
                // Ekstrak kualitas dan link untuk format berbasis paragraf dengan beberapa versi
                const qualityMatches = [...paragraph.matchAll(/(\d{3}p):?\s/g)];
                qualityMatches.forEach((match, index) => {
                    const quality = match[1]; // Misalnya, 360p, 480p, 720p, dll.

                    // Tentukan batasan untuk segmentasi link berdasarkan kualitas
                    const startIndex = match.index + match[0].length;
                    const endIndex = qualityMatches[index + 1]?.index || paragraph.length;

                    // Ekstrak segmen yang berisi link untuk kualitas ini
                    const qualitySegment = paragraph.substring(startIndex, endIndex);

                    const quality$ = load(qualitySegment);
                    const links = [];
                    quality$('a').each((_, anchor) => {
                        const href = quality$(anchor).attr('href');
                        if (href && !links.includes(href)) {
                            links.push(href);
                        }
                    });

                    // Simpan link untuk kualitas yang sesuai
                    if (links.length > 0) {
                        linksByQuality[quality] = linksByQuality[quality] || [];
                        linksByQuality[quality].push(...links);
                    }
                });
            }
        });

        // Simpan episode terakhir yang sedang diproses
        if (currentEpisode) {
            const formattedLinks = Object.entries(linksByQuality).map(([quality, links]) => ({
                quality,
                links,
            }));

            episodes.push({
                episode: currentEpisode,
                links: formattedLinks,
            });
        }

        // Kembalikan data yang terstruktur
        return jsonResponse({ msg: "success", data: episodes }, 200);
    } catch (error) {
        console.error(error);
        return jsonResponse({ msg: 'Terjadi kesalahan saat memproses permintaan' }, 500);
    }
}








// export async function POST(req) {
//     const { url } = await req.json();

//     try {
//         // Fetch the HTML content from the given URL
//         const response = await fetch(url);
//         const html = await response.text();

//         // Load the HTML using Cheerio
//         const $ = load(html);

//         // Select the target element
//         const content = $('#pryc-wp-acctp-original-content');

//         // Initialize an array to store the result
//         const episodes = [];

//         // Variables to track the current episode being processed
//         let currentEpisode = null;
//         let linksByQuality = {};

//         // Iterate over each paragraph in the content
//         content.find('p').each((_, pElement) => {
//             let paragraph = $(pElement).html()?.trim();
//             if (!paragraph) return; // Skip empty or undefined paragraphs
//             paragraph = paragraph.replace(/<br\s*\/?>/gi, ' '); // Normalize line breaks

//             // console.log("Processing paragraph:", paragraph);

//             // Check if the paragraph starts with "Episode"
//             const episodeMatch = paragraph.match(/Episode\s(\d+)/);
//             if (episodeMatch) {
//                 // console.log("Found new episode:", episodeMatch[1]);

//                 // Push the previous episode data if available
//                 if (currentEpisode) {
//                     const formattedLinks = Object.entries(linksByQuality).map(([quality, links]) => ({
//                         quality,
//                         links,
//                     }));
//                     episodes.push({
//                         episode: currentEpisode,
//                         links: formattedLinks,
//                     });
//                 }

//                 // Set new episode and reset links
//                 currentEpisode = episodeMatch[1];
//                 linksByQuality = {}; // Reset the links for the new episode
//             } else {
//                 // Extract all qualities and links within this paragraph
//                 const qualityMatches = [...paragraph.matchAll(/(\d{3}p):/g)];


//                 if (qualityMatches.length === 0) {
//                     // console.log("No qualities found in paragraph:", paragraph);
//                     return;
//                 }

//                 qualityMatches.forEach((match, index) => {
//                     const quality = match[1]; // e.g., 360p, 480p, etc.
//                     // console.log("Detected quality:", quality);

//                     const startIndex = match.index + match[0].length;
//                     const endIndex = qualityMatches[index + 1]?.index || paragraph.length; // Next quality or end of paragraph

//                     // Extract the segment containing the links for the current quality
//                     const qualitySegment = paragraph.substring(startIndex, endIndex);
//                     // console.log("Segment for quality", quality, ":", qualitySegment);
//                     console.log({ qualitySegment })

//                     const quality$ = load(qualitySegment);


//                     const links = [];
//                     quality$('a').each((_, anchor) => {
//                         const href = quality$(anchor).attr('href');
//                         // console.log({ href });
//                         if (href) {
//                             links.push(href);
//                         }
//                     });

//                     // console.log("Links found for quality", quality, ":", links);

//                     // Store the links under the appropriate quality
//                     if (links.length > 0) {
//                         linksByQuality[quality] = linksByQuality[quality] || [];
//                         linksByQuality[quality].push(...links);
//                     }
//                 });
//             }
//         });

//         // Push the last episode being processed
//         if (currentEpisode) {
//             const formattedLinks = Object.entries(linksByQuality).map(([quality, links]) => ({
//                 quality,
//                 links,
//             }));

//             episodes.push({
//                 episode: currentEpisode,
//                 links: formattedLinks,
//             });
//         }

//         // Respond with the structured data
//         // console.log("Final episodes structure:", episodes);
//         return jsonResponse({ msg: "success", data: episodes }, 200);
//     } catch (error) {
//         // console.error("Error processing request:", error);
//         return jsonResponse({ msg: 'Error occurred while processing the request' }, 500);
//     }
// }



