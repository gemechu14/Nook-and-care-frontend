"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/authStore";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      // Small delay to ensure state is updated
      const timer = setTimeout(() => {
        // Check for redirect parameter first
        const redirect = searchParams.get("redirect");
        if (redirect) {
          router.push(redirect);
          return;
        }
        
        // Redirect based on role
        if (user.role === "ADMIN") {
          router.push("/admin");
        } else if (user.role === "PROVIDER") {
          router.push("/providers/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, loading, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("✅ Form submitted with:", { email: form.email, passwordLength: form.password.length });
    
    // Basic validation
    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!form.password.trim()) {
      setError("Please enter your password.");
      return;
    }
    
    setError(null);
    setLoggingIn(true);
    
    try {
      console.log("🚀 Calling login function...");
      await login(form.email.trim(), form.password);
      console.log("✅ Login successful, user state should update");
      // Don't set loggingIn to false here - let useEffect handle redirect
      // The user state will update and trigger redirect
    } catch (err) {
      console.error("Login error caught:", err);
      setLoggingIn(false);
      // Extract error message safely
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object") {
        // Fallback for any other error format
        const errObj = err as any;
        errorMessage = errObj.message || errObj.detail || errObj.error || errorMessage;
      }
      
      setError(errorMessage);
      console.error("Login error details:", err);
    }
  };

  // Show loading only on initial auth check, not when user is already logged in
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is already logged in, show a brief message before redirect
  if (user && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          {/* Logo/Brand - Inside Card */}
          <div className="text-center mb-8">
            <div className="inline-flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full border-2 border-teal-600 bg-teal-50 flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-teal-600">Nook</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Nook</h1>
            <p className="text-slate-500 text-sm">Sign in to continue</p>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            className="w-full bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* OR Separator */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loggingIn ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/forgot-password" className="text-slate-600 hover:text-slate-900 transition-colors">
              Forgot password?
            </Link>
            <span className="text-slate-600">
              Need an account?{" "}
              <Link href="/register" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
