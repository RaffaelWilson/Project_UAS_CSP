import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    const [carsResult, usersResult] = await Promise.all([
      supabase.from('cars').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' })
    ])
    
    return Response.json({
      success: true,
      data: {
        totalCars: carsResult.count || 0,
        totalUsers: usersResult.count || 0,
        availableCars: carsResult.data?.length || 0
      }
    })
    
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}