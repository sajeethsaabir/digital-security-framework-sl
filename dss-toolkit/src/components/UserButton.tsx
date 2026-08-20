'use client';

import { useAuth } from './AuthProvider';

export function UserButton() {
  const { user, showAuthModal, logout } = useAuth();

  if (user) {
    return (
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 hover:bg-slate-700 transition-colors">
          <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <span className="text-xs text-cyan-400 font-medium">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="max-w-24 truncate">{user.name}</span>
        </button>
        <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-3 border-b border-slate-700">
            <div className="text-sm font-medium text-slate-200 truncate">{user.name}</div>
            <div className="text-xs text-slate-400 truncate">{user.email}</div>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-slate-700/50 transition-colors rounded-b-lg"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={showAuthModal}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span>Sign In</span>
    </button>
  );
}
