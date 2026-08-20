'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  showAuthModal: () => void;
  closeAuthModal: () => void;
  authModalOpen: boolean;
  signup: (email: string, password: string, name: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  showAuthModal: () => {},
  closeAuthModal: () => {},
  authModalOpen: false,
  signup: async () => null,
  login: async () => null,
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(email: string, password: string, name?: string): string | null {
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 128) return 'Password is too long';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain a number';
  if (name !== undefined) {
    const n = name.trim();
    if (n.length < 1) return 'Name is required';
    if (n.length > 100) return 'Name is too long';
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showAuthModal = useCallback(() => setAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const validationErr = validateForm(email, password, name);
    if (validationErr) return validationErr;

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password, name: name.trim() }),
    });
    const data = await res.json();
    if (!res.ok) return data.error || 'Signup failed';
    setUser(data.user);
    setAuthModalOpen(false);
    return null;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const validationErr = validateForm(email, password);
    if (validationErr) return validationErr;

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const data = await res.json();
    if (!res.ok) return data.error || 'Login failed';
    setUser(data.user);
    setAuthModalOpen(false);
    return null;
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, showAuthModal, closeAuthModal, authModalOpen, signup, login, logout }}>
      {children}
      {authModalOpen && <AuthModal />}
    </AuthContext.Provider>
  );
}

function AuthModal() {
  const { closeAuthModal, signup, login } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errs: Record<string, string> = {};
    if (!EMAIL_REGEX.test(email.trim())) errs.email = 'Invalid email format';
    if (password.length < 8) errs.password = 'At least 8 characters';
    else if (!/[A-Z]/.test(password)) errs.password = 'Need an uppercase letter';
    else if (!/[a-z]/.test(password)) errs.password = 'Need a lowercase letter';
    else if (!/[0-9]/.test(password)) errs.password = 'Need a number';
    if (mode === 'signup' && name.trim().length === 0) errs.name = 'Name is required';

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const err = mode === 'signup'
        ? await signup(email, password, name)
        : await login(email, password);
      if (err) setError(err);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setFieldErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={closeAuthModal}>
      <div className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button onClick={closeAuthModal} className="text-slate-400 hover:text-slate-200 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
            <p className="text-sm text-slate-400">
              {mode === 'login'
                ? 'Sign in to track your progress and save your activities.'
                : 'Create an account to track your progress through the toolkit.'}
            </p>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                    fieldErrors.name ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Your name"
                />
                {fieldErrors.name && <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                maxLength={254}
                className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                  fieldErrors.email ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="you@example.com"
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                maxLength={128}
                className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                  fieldErrors.password ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Min 8 chars, upper + lower + number"
              />
              {fieldErrors.password && <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>}
              <p className="mt-1 text-xs text-slate-500">Must be at least 8 characters with uppercase, lowercase, and a number</p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={submitting}
              className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-slate-400">
              {mode === 'login' ? (
                <>Don&apos;t have an account?{' '}
                  <button type="button" onClick={switchMode}
                    className="text-cyan-400 hover:text-cyan-300">Sign up</button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button type="button" onClick={switchMode}
                    className="text-cyan-400 hover:text-cyan-300">Sign in</button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
