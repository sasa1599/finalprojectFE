// services/auth.service.ts
import {
  LoginFormCustomerValues,
  LoginResponse,
  ApiError,
  RegisterFormCustomerValues,
  RegisterResponse,
  VerifyAndSetPassValues,
  VerifyResponse,
  ResetPassValues,
  ResetPassResponse,
  VerifyResetPassValues,
  TokenCheckResponse
} from "../types/auth-types";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
}

const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

export class AuthService {
  static async register(
    credentials: RegisterFormCustomerValues
  ): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${base_url_be}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw new Error(error.message || "Login failed");
      }

      const data = (await response.json()) as RegisterResponse;

      if (data.token) {
        localStorage.setItem("verify_email", "true");
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async verifikasiAndSetPass(
    credentials: VerifyAndSetPassValues
  ): Promise<VerifyResponse> {
    try {
      console.log(credentials);
      const response = await fetch(`${base_url_be}/auth/verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw new Error(error.message || "Login failed");
      }

      const data = (await response.json()) as VerifyResponse;

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async resetPass(
    credentials: ResetPassValues
  ): Promise<ResetPassResponse> {
    try {
      const response = await fetch(`${base_url_be}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw new Error(error.message || "Login failed");
      }

      const data = (await response.json()) as ResetPassResponse;

      if (data.token) {
        localStorage.setItem("verify_reset_pass", "true");
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async verifikasResetPass(
    credentials: VerifyResetPassValues
  ): Promise<VerifyResponse> {
    try {
      const response = await fetch(
        `${base_url_be}/auth/verify/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw new Error(error.message || "Reset Password failed");
      }

      const data = (await response.json()) as VerifyResponse;

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async login(
    credentials: LoginFormCustomerValues
  ): Promise<LoginResponse> {
    try {
      const response = await fetch(`${base_url_be}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw new Error(error.message || "Login failed");
      }

      const data = (await response.json()) as LoginResponse;

      if (data.token) {
        // Explicitly log token storage for debugging
        console.log("Token received:", data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("exp_token", "24 Hours");
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    localStorage.removeItem("token");
    localStorage.removeItem("exp_token");
  }

  static async checkTokenVerifyEmailExp(): Promise<TokenCheckResponse> {
    try {
      const response = await fetch(
        `${base_url_be}/auth/check-email-token/${localStorage.getItem(
          "token"
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw new Error(error.message || "Token Expired");
      }

      const data = (await response.json()) as TokenCheckResponse;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static parseToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const [, payloadB64] = token.split(".");
      if (!payloadB64) return null;

      const payload = JSON.parse(atob(payloadB64));
      return payload as DecodedToken;
    } catch {
      // If token parsing fails, clear it
      this.logout();
      return null;
    }
  }
}
