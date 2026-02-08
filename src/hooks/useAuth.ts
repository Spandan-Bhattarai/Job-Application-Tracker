import { useSignInEmailPassword, useSignUpEmailPassword, useSignOut, useAuthenticationStatus, useUserData } from '@nhost/react';

export function useAuth() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const user = useUserData();
  
  const { 
    signInEmailPassword, 
    isLoading: isSigningIn,
    isError: signInError,
    error: signInErrorDetails,
    needsEmailVerification: signInNeedsVerification
  } = useSignInEmailPassword();
  
  const { 
    signUpEmailPassword, 
    isLoading: isSigningUp,
    isError: signUpError,
    error: signUpErrorDetails,
    needsEmailVerification: signUpNeedsVerification,
    isSuccess: signUpSuccess
  } = useSignUpEmailPassword();
  
  const { signOut: nhostSignOut } = useSignOut();

  const signIn = async (email: string, password: string) => {
    const result = await signInEmailPassword(email, password);
    
    if (result.isError) {
      return { 
        data: null, 
        error: { message: result.error?.message || 'Sign in failed' },
        needsEmailVerification: false
      };
    }
    
    if (result.needsEmailVerification) {
      return {
        data: null,
        error: { message: 'Please verify your email before signing in. Check your inbox.' },
        needsEmailVerification: true
      };
    }
    
    return { data: result, error: null, needsEmailVerification: false };
  };

  const signUp = async (email: string, password: string) => {
    const result = await signUpEmailPassword(email, password);
    
    if (result.isError) {
      return { 
        data: null, 
        error: { message: result.error?.message || 'Sign up failed' },
        needsEmailVerification: false,
        isSuccess: false
      };
    }
    
    // Check if email verification is needed
    if (result.needsEmailVerification) {
      return {
        data: result,
        error: null,
        needsEmailVerification: true,
        isSuccess: true
      };
    }
    
    return { 
      data: result, 
      error: null, 
      needsEmailVerification: false,
      isSuccess: true 
    };
  };

  const signOut = async () => {
    if (!isAuthenticated) {
      return { error: null };
    }
    
    const result = await nhostSignOut();
    if (result.isSuccess) {
      return { error: null };
    }
    return { error: { message: 'Sign out failed' } };
  };

  return {
    user,
    session: isAuthenticated ? { user } : null,
    loading: isLoading,
    isSigningIn,
    isSigningUp,
    signIn,
    signUp,
    signOut,
  };
}