// utils/auth.ts

export const getAuthToken = (): string | null => {
    // For client components
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    
    return null;
  };
  
  export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
  };
  
  export const getUserRole = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userRole');
    }
    
    return null;
  };
  
  export const isSuperAdmin = (): boolean => {
    return getUserRole() === 'super_admin';
  };