import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Only throw errors in production or when Supabase is actually needed
if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
  }
}

// Create a Supabase client with the service role key for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Admin operations
export async function createUser(email: string, password: string) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    throw error;
  }

  return data.user;
}

export async function deleteUser(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    throw error;
  }

  return data;
}

export async function listUsers() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserById(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error) {
    throw error;
  }

  return data;
}

export async function updateUserById(userId: string, attributes: { email?: string; password?: string; email_confirm?: boolean }) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, attributes);

  if (error) {
    throw error;
  }

  return data;
}

export async function generatePasswordResetLink(email: string) {
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function generateEmailChangeLink(currentEmail: string, newEmail: string) {
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'email_change_new',
    email: currentEmail,
    newEmail,
  });

  if (error) {
    throw error;
  }

  return data;
} 