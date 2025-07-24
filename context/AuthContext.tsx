import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Impor dari file konfigurasi yang kita buat di Langkah 1

// Tipe data untuk user dan fungsi yang akan kita sediakan
interface AuthContextType {
  user: User | null; // Objek user dari Firebase, atau null jika belum login
  isLoading: boolean; // Status untuk loading awal
}

// Membuat Context dengan nilai awal
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

// Membuat "Provider" yang akan membungkus aplikasi kita
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged adalah pendengar real-time dari Firebase.
    // Fungsi ini akan otomatis terpanggil setiap kali status login berubah (login/logout).
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set state user dengan data dari Firebase
      setIsLoading(false); // Selesai loading, kita sudah tahu status loginnya
    });

    // Membersihkan listener saat komponen tidak lagi digunakan
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Membuat custom hook agar lebih mudah digunakan di komponen lain
export const useAuth = () => {
  return useContext(AuthContext);
};
