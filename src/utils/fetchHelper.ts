export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  }
  
  export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('Making login request to:', `${process.env.NEXT_PUBLIC_BASE_URL_BE}auth/login`);
      console.log('With credentials:', credentials);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data = await response.json();
      console.log('Login response:', data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }