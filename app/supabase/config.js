import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bytklkkdewxuxlfznweg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5dGtsa2tkZXd4dXhsZnpud2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MjA0MDcsImV4cCI6MjA1NjQ5NjQwN30.VEeKybV9VYcTy4BXu3Uf61v2RdtVg_-4kG2e7BgO1Pc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export async function uploadFile(bucket, path, file) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}
export function getPublicUrl(bucket, path) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}
