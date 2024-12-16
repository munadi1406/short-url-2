/**
 * Fungsi untuk mencatat data pengunjung
 * 
 * @param {string} page - Halaman yang dikunjungi
 * @param {string} userAgent - User-agent dari pengunjung
 * @param {string} ipAddress - IP address pengunjung
 * @param {string} slug - Slug artikel yang dikunjungi (jika ada)
 * @returns {Promise<Object>} - Data statistik pengunjung yang berhasil disimpan
 */
export async function recordVisitorStat(page, userAgent, ipAddress, slug,cookie) {
    "use server"
  try {
   


    const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}api/visitor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookie, // Menambahkan cookie ke header
      },
     
      body: JSON.stringify({ page, userAgent, ipAddress, slug }),
    });

   
    
    return "success"
  } catch (error) {
    console.error("Failed to record visitor:", error);
    
  }
}
