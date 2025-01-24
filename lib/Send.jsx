// 'use client';

// import { useEffect } from 'react';
// import { usePathname } from 'next/navigation';  // Import usePathname from next/navigation

// // Fungsi untuk mendapatkan informasi IP
// async function getIpAddress() {
//   try {
//     const response = await fetch('https://api.ipify.org?format=json'); // Menggunakan ipify API untuk mendapatkan IP publik
//     const data = await response.json();
//     return data.ip;
//   } catch (error) {
//     console.error('Error fetching IP address:', error);
//     return 'Unknown';  // Jika gagal mendapatkan IP, kembalikan 'Unknown'
//   }
// }

// // Fungsi untuk mendapatkan informasi OS dan Browser
// function getUserAgentInfo() {
//   const userAgent = navigator.userAgent;
//   const os = navigator.platform;
//   return { userAgent, os };
// }

// // Fungsi untuk mendapatkan referer (URL asal)
// function getReferer() {
//   return document.referrer || '';  // Jika tidak ada referer, kembalikan string kosong
// }

// // Fungsi untuk mendapatkan session_id (bisa disesuaikan dengan kebutuhan, misal menggunakan cookies)
// function getSessionId() {
//   let sessionId = localStorage.getItem('session_id');  // Cek apakah session_id ada di localStorage
//   if (!sessionId) {
//     // Jika belum ada, buat session_id baru dan simpan ke localStorage
//     sessionId = `session_${Math.random().toString(36).substring(2)}`;
//     localStorage.setItem('session_id', sessionId);
//   }
//   return sessionId;
// }

// // Fungsi untuk menyusun data log dan mengirimnya
// async function sendLogData(path, status) {
//   try {
//     const ip_address = await getIpAddress();
//     const { userAgent, os } = getUserAgentInfo();
//     const referer = getReferer();
//     const session_id = getSessionId();

//     const logData = {
//       session_id,
//       status,
//       ip_address,
//       path,
//       referer,
//       user_agent: userAgent,
//       os,
//     };

//     const response = await fetch('/api/logs', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(logData),
//     });

//     const data = await response.json();
//     if (response.ok) {
//       console.log('Log berhasil disimpan atau diperbarui:', data);
//     } else {
//       console.error('Error menyimpan atau memperbarui log:', data);
//     }
//   } catch (error) {
//     console.error('Error mengirim data log:', error);
//   }
// }

// // Komponen untuk mengirim log data setiap kali path berubah dan status aplikasi (aktif/inaktif)
// export default function LogSender() {
//   const pathname = usePathname();  // Dapatkan path saat ini dengan usePathname dari next/navigation

//   useEffect(() => {
//     // Fungsi untuk menangani perubahan path dan mengirim log
//     sendLogData(pathname, 'active'); // Kirim log dengan status 'active' ketika path berubah

//     // Fungsi untuk menangani ketika tab aplikasi tidak aktif (away)
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'hidden') {
//         // Ketika tab tidak aktif (user pergi dari tab)
//         console.log('Tab tidak aktif - Status Away');
//         sendLogData(pathname, 'inactive');
//       } else if (document.visibilityState === 'visible') {
//         // Ketika tab aktif kembali
//         console.log('Tab aktif kembali - Status Active');
//         sendLogData(pathname, 'active');
//       }
//     };

   

//     // Menambahkan event listener untuk visibilitychange
//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     // Menambahkan event listener untuk beforeunload
  

//     // Bersihkan event listener saat komponen di-unmount
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
      
//     };
//   }, [pathname]);  // Efek akan dijalankan ulang setiap kali path berubah

//   return <div>{/* Komponen ini tidak perlu menampilkan apapun */}</div>;
// }

