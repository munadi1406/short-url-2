'use server';

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session'; // Helper untuk mendekripsi sesi
import User from '@/models/users'; // Model Sequelize

/**
 * Verifikasi Sesi
 */
export const verifySession = async () => {
  const sessionCookie = (await cookies()).get('session')?.value;

  if (!sessionCookie) {
    throw new Error('Session not found. Please log in.');
  } 

  const session = await decrypt(sessionCookie);

  if (!session || !session.userId) {
    throw new Error('Invalid session. Please log in.');
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

    return user.dataValues || null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
};
