import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const filters = await request.json()
    
    // AJAX API endpoint for car search
    let query = supabase
      .from('cars')
      .select('*')
      .eq('status', 'tersedia')
    
    // Apply search filter
    if (filters.search) {
      query = query.or(`brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%`)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    
    return Response.json({ 
      success: true, 
      data: data || [],
      count: data?.length || 0
    })
    
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}