'use client'

import { useState, useEffect } from 'react';

export default function LocalTime({ date }) {
  const [localDate, setLocalDate] = useState(null);

  useEffect(() => {
    // Menggunakan useEffect untuk memastikan bahwa pemformatan terjadi di sisi klien
    setLocalDate(new Date(date).toLocaleString());
  }, [date]);

  if (!localDate) {
    return null; // Menunggu hingga pemformatan selesai
  }

  return <span>{localDate}</span>;
}
