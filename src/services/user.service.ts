import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'puskesmas';
  kecamatan?: string;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function loginUser(credentials: LoginCredentials): Promise<User | null> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, role, kecamatan, created_at')
      .eq('username', credentials.username)
      .eq('password', credentials.password)
      .single();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      kecamatan: user.kecamatan,
      created_at: user.created_at
    };
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, role, kecamatan, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function createUser(userData: {
  username: string;
  password: string;
  role: 'puskesmas';
  kecamatan: string;
}): Promise<User | null> {
  try {
    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', userData.username)
      .single();

    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        username: userData.username,
        password: userData.password,
        role: userData.role,
        kecamatan: userData.kecamatan
      })
      .select('id, username, role, kecamatan, created_at')
      .single();

    if (error) throw error;
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}
