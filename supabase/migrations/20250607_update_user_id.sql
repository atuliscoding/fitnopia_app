-- Create a function to update user ID and all related records
CREATE OR REPLACE FUNCTION update_user_id(old_id UUID, new_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update all related tables in a transaction
    -- This ensures either all updates succeed or none do
    
    -- First update profiles since it references users
    UPDATE profiles 
    SET user_id = new_id 
    WHERE user_id = old_id;
    
    -- Then update the user record itself
    UPDATE users 
    SET id = new_id 
    WHERE id = old_id;
    
    -- Update any other tables that reference user_id
    UPDATE workout_plans 
    SET user_id = new_id 
    WHERE user_id = old_id;
    
    UPDATE sessions 
    SET user_id = new_id 
    WHERE user_id = old_id;
    
    UPDATE progress 
    SET user_id = new_id 
    WHERE user_id = old_id;
END;
$$; 