/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { createCookie } from "@/app/actions";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Fungsi untuk mendapatkan informasi IP
async function getIpAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
   
    return "Unknown";
  }
}

// Fungsi untuk mendapatkan informasi OS dan Browser
function getUserAgentInfo() {
  const userAgent = navigator.userAgent;
  const os = navigator.platform;
  return { userAgent, os };
}

// Fungsi untuk mendapatkan referer (URL asal)
function getReferer() {
  return document.referrer || "";
}

export default function LogSender() {
  const [accessToken, setAccessToken] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const socketRef = useRef(null); // Menyimpan referensi ke WebSocket
  const reconnectTimeoutRef = useRef(null); // Untuk mengatur waktu tunggu sebelum reconnect
  const isReconnecting = useRef(false); // Flag untuk menghindari reconnect berulang
  const isSocketConnected = useRef(false); // Menyimpan status apakah socket sudah terhubung

  // Fungsi untuk mendapatkan sessionId dan accessToken
  const getSession = async () => {
    try {
      const datass = await createCookie();
    
      setSessionId(datass?.sessionId);
      setAccessToken(datass?.accessToken);
    } catch (error) {
      
    }
  };

  // Fungsi untuk menyusun data log
  const getData = async (status) => {
    try {
      const ip_address = await getIpAddress();
      const { userAgent, os } = getUserAgentInfo();
      const referer = getReferer();
      return {
        session_id: sessionId,
        status,
        ip_address,
        referer,
        user_agent: userAgent,
        os,
      };
    } catch (error) {
     
      return null;
    }
  };

  // Fungsi untuk memeriksa status online/offline
  const isOnline = () => {
    return navigator.onLine; // Mengembalikan true jika online, false jika offline
  };

  // Fungsi untuk menginisialisasi WebSocket
  const initializeSocket = () => {
    if (!sessionId || !accessToken || isSocketConnected.current) return; // Tidak inisialisasi jika sudah terhubung

   

    const socket = io(process.env.NEXT_PUBLIC_API_ENDPOINT, {
      auth: {
        token: accessToken,
      },
    });

    // Saat berhasil terhubung
    socket.on("connect", async () => {
  
      const data = await getData("active");
      if (data) {
        socket.emit("logData", data);
   
      }
    });

    // Saat terputus
    socket.on("disconnect", async (reason) => {
     

      if (isOnline()) {
      
        await getSession(); // Refresh sessionId dan accessToken
        
        // Jika reconnect belum pernah dicoba atau sudah lama, maka coba reconnect
        if (!isReconnecting.current) {
          isReconnecting.current = true; // Tandai bahwa reconnect sedang diproses
          
          // Tunggu sebentar sebelum mencoba reconnect
          reconnectTimeoutRef.current = setTimeout(() => {
            initializeSocket(); // Reinitialize socket setelah token diperbarui
            isReconnecting.current = false; // Reset flag reconnect
          }, 2000); // Waktu tunggu 2 detik (sesuaikan dengan kebutuhan Anda)
        }
      } else {
      
        // Menunggu sampai perangkat kembali online
        window.addEventListener("online", async () => {
       
          await getSession();

          // Jika ada timeout sebelumnya, bersihkan
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }

          // Tunggu sebentar sebelum mencoba reconnect
          reconnectTimeoutRef.current = setTimeout(() => {
            initializeSocket(); // Reinitialize socket
          }, 2000); // Waktu tunggu 2 detik (sesuaikan dengan kebutuhan Anda)
        }, { once: true }); // Pastikan event listener hanya dipicu sekali
      }
    });

    // Simpan referensi socket dan tandai bahwa socket sudah terhubung
    socketRef.current = socket;
    isSocketConnected.current = true;

    // Bersihkan koneksi saat komponen di-unmount
    return () => {
      if (socket) {
        socket.disconnect();
      
        isSocketConnected.current = false;
      }
    };
  };

  // Mendapatkan session saat komponen dimuat
  useEffect(() => {
    getSession();
  }, []);

  // Membuat koneksi WebSocket hanya jika sessionId dan accessToken tersedia dan WebSocket belum terhubung
  useEffect(() => {
    if (sessionId && accessToken) {
      initializeSocket();
    }
  }, [sessionId, accessToken]);

  return <div>{/* Komponen ini tidak perlu menampilkan apapun */}</div>;
}
