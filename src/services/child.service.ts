import { supabase } from '@/lib/supabase';

export interface Child {
  id: string;
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
}

export async function getChildren() {
  const { data, error } = await supabase
    .from('children_data')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch children data');
  }

  return data;
}

export async function getChildById(id: string) {
  const { data, error } = await supabase
    .from('children_data')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error('Failed to fetch child data');
  }

  return data;
}

export async function getChildRecords(childId: string) {
  const { data, error } = await supabase
    .from('child_records')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch child records');
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