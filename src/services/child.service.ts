import { supabase } from '@/lib/supabase';

export interface Child {
  id: string;
  nik?: string;  // NIK anak (optional, bisa duplicate - satu anak bisa punya banyak pemeriksaan)
  gender: 'male' | 'female';
  age: number;
  birth_weight: number;
  birth_length: number;
  body_weight: number;
  body_length: number;
  breast_feeding: boolean;
  stunting: boolean;
  image_is_stunting: boolean;
  latitude?: number;
  longitude?: number;
  created_at: string;
  alamat_id?: string;
  alamat?: Alamat;
}

export interface Alamat {
  id: string;
  latitude: number;
  longitude: number;
  state: string;
  city: string;
  city_district: string;
  village: string;
  created_at: string;
}

export async function getChildren() {
  const { data, error } = await supabase
    .from('children_data')
    .select(`
      *,
      alamat:alamat_id (
        id,
        latitude,
        longitude,
        state,
        city,
        city_district,
        village,
        created_at
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch children data');
  }

  return data;
}

export async function getChildById(id: string) {
  const { data, error } = await supabase
    .from('children_data')
    .select(`
      *,
      alamat:alamat_id (
        id,
        latitude,
        longitude,
        state,
        city,
        city_district,
        village,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error('Failed to fetch child data');
  }

  return data;
}

export async function getChildStats() {
  const { data: children, error } = await supabase
    .from('children_data')
    .select('*');

  if (error) {
    throw new Error('Failed to fetch children stats');
  }

  const totalChildren = children.length;
  const stuntingCases = children.filter(child => child.stunting).length;
  const imageStuntingCases = children.filter(child => child.image_is_stunting).length;
  const nonStuntingCases = totalChildren - stuntingCases;
  const todayData = children.filter(
    child => new Date(child.created_at).toDateString() === new Date().toDateString()
  ).length;

  return {
    totalChildren,
    stuntingCases,
    imageStuntingCases,
    nonStuntingCases,
    todayData,
  };
}

export async function getChildGrowthTrend() {
  const { data, error } = await supabase
    .from('children_data')
    .select('age, body_weight, body_length, created_at')
    .order('age', { ascending: true });

  if (error) {
    throw new Error('Failed to fetch growth trend data');
  }

  return data;
}

export async function getStuntingDistribution() {
  const { data: children, error } = await supabase
    .from('children_data')
    .select('stunting');

  if (error) {
    throw new Error('Failed to fetch stunting distribution');
  }

  const total = children.length;
  const stuntingCases = children.filter(child => child.stunting).length;
  const nonStuntingCases = total - stuntingCases;

  return [
    { name: 'Tidak Stunting', value: nonStuntingCases },
    { name: 'Stunting', value: stuntingCases },
  ];
}

// Fungsi-fungsi baru untuk mengelola alamat
export async function createAlamat(alamatData: Omit<Alamat, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('alamat')
    .insert([alamatData])
    .select()
    .single();

  if (error) {
    throw new Error('Failed to create alamat');
  }

  return data;
}

export async function getAlamatById(id: string) {
  const { data, error } = await supabase
    .from('alamat')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error('Failed to fetch alamat data');
  }

  return data;
}

export async function updateAlamat(id: string, alamatData: Partial<Omit<Alamat, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('alamat')
    .update(alamatData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error('Failed to update alamat');
  }

  return data;
}

export async function deleteAlamat(id: string) {
  const { error } = await supabase
    .from('alamat')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error('Failed to delete alamat');
  }

  return true;
}

export async function getAlamatByLocation(latitude: number, longitude: number, radius: number = 1) {
  const { data, error } = await supabase
    .from('alamat')
    .select('*')
    .gte('latitude', latitude - radius)
    .lte('latitude', latitude + radius)
    .gte('longitude', longitude - radius)
    .lte('longitude', longitude + radius);

  if (error) {
    throw new Error('Failed to fetch alamat by location');
  }

  return data;
}

export async function createChild(childData: Omit<Child, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('children_data')
    .insert([childData])
    .select()
    .single();

  if (error) {
    throw new Error('Failed to create child');
  }

  return data;
}

export async function updateChild(id: string, childData: Partial<Omit<Child, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('children_data')
    .update(childData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error('Failed to update child');
  }

  return data;
}

export async function deleteChild(id: string) {
  const { error } = await supabase
    .from('children_data')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error('Failed to delete child');
  }

  return true;
}