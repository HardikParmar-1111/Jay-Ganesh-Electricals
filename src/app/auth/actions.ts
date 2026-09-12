'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export type AuthActionResult = {
  error?: string | null
  success?: string | null
}

export async function login(
  prevStateOrFormData: AuthActionResult | FormData,
  maybeFormData?: FormData
): Promise<AuthActionResult> {
  const formData = (maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData) as FormData

  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return { error: 'Please enter both email and password.' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Return readable error messages
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid email or password. Please try again.' }
    }
    return { error: error.message }
  }

  if (!data?.user) {
    return { error: 'Authentication failed. Please check your credentials.' }
  }

  // Retrieve user role from profiles table
  let targetRoute = '/catalog'
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle()

    if (profile?.role === 'admin') {
      targetRoute = '/admin/dashboard'
    }
  } catch {
    targetRoute = '/catalog'
  }

  revalidatePath('/', 'layout')
  redirect(targetRoute)
}

export async function signup(
  prevStateOrFormData: AuthActionResult | FormData,
  maybeFormData?: FormData
): Promise<AuthActionResult> {
  const formData = (maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData) as FormData

  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString()
  const fullName = formData.get('fullName')?.toString().trim() || ''
  const phone = formData.get('phone')?.toString().trim() || ''

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'An account with this email already exists. Please log in.' }
    }
    return { error: error.message }
  }

  // If email confirmation is disabled and session is active immediately
  if (data?.session) {
    revalidatePath('/', 'layout')
    redirect('/catalog')
  }

  return {
    success: 'Registration successful! If required, please verify your email before logging in.',
  }
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
