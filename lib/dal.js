'use server';

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session'; // Helper untuk mendekripsi sesi
import User from '@/models/users'; // Model Sequelize

/**
 * Verifikasi Sesi
 */
export const verifySession = async () => {
  // Ambil semua cookie
  const cookiesObject = await cookies(); // Await cookies() first
  const cookieData = await cookiesObject.getAll(); // Then get the cookies

  // Cari cookie 'session'
  const sessionCookie = cookieData.find(cookie => cookie.name === 'session')?.value;

  if (!sessionCookie) {
    throw new Error('Sesi tidak ditemukan. Harap login.');
  }

  const session = await decrypt(sessionCookie);

  if (!session || !session.userId) {
    throw new Error('Sesi tidak valid. Harap login.');
  }

  return { isAuth: true, userId: session.userId };
};

/**
 * Ambil Data Pengguna Berdasarkan Sesi
 */
export const getUser = async () => {
  try {
    // Verifikasi sesi
    const session = await verifySession();

    if (!session) {
      return null;
    }

    // Cari pengguna berdasarkan userId
    const user = await User.findOne({
      where: { id: session.userId },
      attributes: ['id', 'name', 'email'], // Kolom eksplisit untuk diambil
    });

    return user?.dataValues || null;
  } catch (error) {
    console.error('Gagal mengambil data pengguna:', error);
    return null;
  }
};


export const isAdmin = async () => {
  try {
    const cookiesObject = await cookies(); // Await cookies() first
    const cookieData = cookiesObject.get('session'); // Then get the cookies
    
    if (!cookieData) {
      return false
    }

    const session = await decrypt(cookieData.value);

    if (!session || !session.userId) {
      return false
    }

    return true
  } catch (error) {
  
    return false
  }
}

