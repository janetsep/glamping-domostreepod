
// Utilidades para peticiones HTTP a Supabase
export const createHeaders = (supabaseKey: string) => ({
  'Authorization': `Bearer ${supabaseKey}`,
  'apikey': supabaseKey,
  'Content-Type': 'application/json'
});

// Función para hacer peticiones GET a Supabase
export async function fetchFromSupabase(url: string, headers: Record<string, string>): Promise<any> {
  const response = await fetch(url, {
    method: 'GET',
    headers
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error en petición a Supabase: ${errorText}`);
    throw new Error(`Error en petición: ${response.status}`);
  }
  
  return await response.json();
}

// Función para hacer peticiones PATCH a Supabase
export async function updateSupabase(
  url: string, 
  headers: Record<string, string>, 
  data: any
): Promise<boolean> {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error en actualización a Supabase: ${errorText}`);
    return false;
  }
  
  return true;
}
