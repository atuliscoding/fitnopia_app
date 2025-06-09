import { supabase } from '../lib/supabase-client';

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow');

  // Test 1: Sign Up
  console.log('\n📝 Test 1: Sign Up');
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (signUpError) {
      throw signUpError;
    }

    console.log('✅ Sign Up successful');
    console.log('User ID:', signUpData.user?.id);
  } catch (error) {
    console.error('❌ Sign Up failed:', error);
    process.exit(1);
  }

  // Test 2: Sign In
  console.log('\n🔑 Test 2: Sign In');
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      throw signInError;
    }

    console.log('✅ Sign In successful');
    console.log('Session:', signInData.session?.access_token ? '(Token available)' : 'No session');
  } catch (error) {
    console.error('❌ Sign In failed:', error);
    process.exit(1);
  }

  // Test 3: Get User Profile
  console.log('\n👤 Test 3: Get User Profile');
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error('No user found');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    console.log('✅ Profile fetch successful');
    console.log('Profile:', profile);
  } catch (error) {
    console.error('❌ Profile fetch failed:', error);
    process.exit(1);
  }

  // Test 4: Sign Out
  console.log('\n👋 Test 4: Sign Out');
  try {
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      throw signOutError;
    }

    console.log('✅ Sign Out successful');
  } catch (error) {
    console.error('❌ Sign Out failed:', error);
    process.exit(1);
  }

  // Test 5: Verify Signed Out State
  console.log('\n🔍 Test 5: Verify Signed Out State');
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (user) {
      throw new Error('User still signed in');
    }

    console.log('✅ Signed out state verified');
  } catch (error) {
    if (error instanceof Error && error.message === 'User still signed in') {
      console.error('❌ Sign out verification failed:', error);
      process.exit(1);
    }
    console.log('✅ Signed out state verified');
  }

  console.log('\n🎉 All tests completed successfully!');
}

testAuthFlow().catch(console.error); 