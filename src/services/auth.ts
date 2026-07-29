import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const defaultUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://obabigruajliljzympth.supabase.co';
const defaultAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(url?: string, anonKey?: string): SupabaseClient {
  const targetUrl = url || defaultUrl;
  const targetKey = anonKey || defaultAnonKey;

  if (!clientInstance) {
    clientInstance = createClient(targetUrl, targetKey);
  }
  return clientInstance;
}

export const supabase = getSupabaseClient();

export interface UserSession {
  token: string;
  user: any;
}

export async function loginWithCredentials(email: string, pass: string, customUrl?: string, customKey?: string): Promise<UserSession> {
  const client = getSupabaseClient(customUrl, customKey);
  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password: pass.trim(),
  });

  if (error) {
    throw new Error(error.message || 'Credenciales de acceso incorrectas');
  }

  if (!data.session || !data.user) {
    throw new Error('No se pudo establecer la sesión con Supabase Auth');
  }

  localStorage.setItem('pos_token', data.session.access_token);
  localStorage.setItem('pos_user', JSON.stringify(data.user));

  return {
    token: data.session.access_token,
    user: data.user,
  };
}

export function getLocalSession(): UserSession | null {
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

export async function logoutUser(): Promise<void> {
  try {
    const client = getSupabaseClient();
    await client.auth.signOut();
  } catch {
    // Ignore signout errors
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pos_token');
    localStorage.removeItem('pos_user');
  }
}
