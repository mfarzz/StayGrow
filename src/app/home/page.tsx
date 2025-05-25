'use client';

import React from 'react';
import { useAuth } from "../_hooks/useAuth";

export default function HomePage() {
  const { loading, userId } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading dulu saat cek token
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Selamat datang, user dengan ID: {userId}</p>
    </div>
  );
}