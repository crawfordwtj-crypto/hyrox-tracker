import { supabase } from './supabase'
import type { Database } from '../types/database'

type Exercise = Database['public']['Tables']['exercises']['Row']
type TrainingLog = Database['public']['Tables']['training_logs']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

export interface PersonalBest {
  exercise_id: string
  exercise_name: string
  best_amount: number
  comp_amount: number
  unit: string
}

export interface TeamMemberWithBests {
  user_id: string
  full_name: string | null
  personal_bests: PersonalBest[]
}

export async function getExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('name')

  if (error) throw error
  return data || []
}

export async function getUserLogs(userId: string): Promise<TrainingLog[]> {
  const { data, error } = await supabase
    .from('training_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getPersonalBests(userId: string): Promise<PersonalBest[]> {
  // Get all exercises
  const exercises = await getExercises()
  
  // Get user's logs
  const logs = await getUserLogs(userId)

  // Calculate personal best for each exercise
  const bests: PersonalBest[] = exercises.map((exercise) => {
    const exerciseLogs = logs.filter((log) => log.exercise_id === exercise.id)
    const bestAmount = exerciseLogs.length > 0
      ? Math.max(...exerciseLogs.map((log) => log.amount))
      : 0

    return {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      best_amount: bestAmount,
      comp_amount: exercise.comp_amount,
      unit: exercise.unit,
    }
  })

  return bests
}

export async function getTeamMembers(teamId: string): Promise<TeamMemberWithBests[]> {
  // Get team members
  const { data: teamMembers, error: membersError } = await supabase
    .from('team_members')
    .select('user_id, profiles(id, full_name)')
    .eq('team_id', teamId)

  if (membersError) throw membersError

  // Get personal bests for each member
  const membersWithBests = await Promise.all(
    (teamMembers || []).map(async (member: any) => {
      const profile = member.profiles as Profile
      const bests = await getPersonalBests(member.user_id)
      
      return {
        user_id: member.user_id,
        full_name: profile.full_name,
        personal_bests: bests,
      }
    })
  )

  return membersWithBests
}

export async function getUserTeamId(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching team:', error)
    return null
  }
  
  return (data as any)?.team_id || null
}

export interface InsertTrainingLogParams {
  user_id: string
  exercise_id: string
  amount: number
  weight?: number | null
}

export async function insertTrainingLog(params: InsertTrainingLogParams): Promise<void> {
  const { error } = await supabase
    .from('training_logs')
    .insert({
      user_id: params.user_id,
      exercise_id: params.exercise_id,
      amount: params.amount,
      weight: params.weight || null,
      logged_at: new Date().toISOString(),
    } as any)

  if (error) throw error
}
