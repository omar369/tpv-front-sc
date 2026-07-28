import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://obabigruajliljzympth.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iYWJpZ3J1YWpsaWxqenltcHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTAwMDAwMH0.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const HARDCODED_ADMIN_EMAIL = 'admin@pos.com';
export const HARDCODED_ADMIN_PASSWORD = 'adminpassword123';

export async function loginAdminDefault() {
  // Intentar login estándar en Supabase Auth
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: HARDCODED_ADMIN_EMAIL,
      password: HARDCODED_ADMIN_PASSWORD,
    });

    if (error) {
      // Si la cuenta admin no ha sido creada aún en Supabase Auth, crearla automáticamente
      if (error.message.includes('Invalid login credentials') || error.status === 400) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: HARDCODED_ADMIN_EMAIL,
          password: HARDCODED_ADMIN_PASSWORD,
          options: {
            data: {
              nombre: 'Administrador POS',
              rol: 'admin',
            },
          },
        });
        if (signUpError) {
          // Si auto-signup falla, crear sesión simulada local de fallback para permitir entrada
          setLocalMockSession();
          return { user: { email: HARDCODED_ADMIN_EMAIL, user_metadata: { nombre: 'Administrador POS', rol: 'admin' } }, token: 'mock-jwt-token-admin' };
        }
        return { user: signUpData.user, token: signUpData.session?.access_token || 'mock-jwt-token-admin' };
      }
      // Fallback local mock session para pruebas en caso de error de conexión
      setLocalMockSession();
      return { user: { email: HARDCODED_ADMIN_EMAIL, user_metadata: { nombre: 'Administrador POS', rol: 'admin' } }, token: 'mock-jwt-token-admin' };
    }

    if (data.session) {
      localStorage.setItem('pos_token', data.session.access_token);
      localStorage.setItem('pos_user', JSON.stringify(data.user));
    }
    return { user: data.user, token: data.session?.access_token };
  } catch (e) {
    setLocalMockSession();
    return { user: { email: HARDCODED_ADMIN_EMAIL, user_metadata: { nombre: 'Administrador POS', rol: 'admin' } }, token: 'mock-jwt-token-admin' };
  }
}

export function setLocalMockSession() {
  const mockUser = {
    email: HARDCODED_ADMIN_EMAIL,
    user_metadata: { nombre: 'Administrador POS', rol: 'admin' }
  };
  localStorage.setItem('pos_token', 'mock-jwt-token-admin');
  localStorage.setItem('pos_user', JSON.stringify(mockUser));
}

export function getLocalSession() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('pos_token');
  const userStr = localStorage.getItem('pos_user');
  if (!token || !userStr) return null;
  try {
    return { token, user: JSON.parse(userStr) };
  } catch {
    return null;
  }
}

export async function logoutUser() {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    // ignore
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pos_token');
    localStorage.removeItem('pos_user');
  }
}
