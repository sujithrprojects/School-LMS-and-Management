import React from 'react';

const SignIn = ({ role = 'admin', isLoading = false }) => {
  const roleStyles = {
    admin: 'from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-500/25',
    accountant: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/25',
    teacher: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25',
    student: 'from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25',
    librarian: 'from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-500/25'
  };

  const activeGradient = roleStyles[role] || roleStyles.admin;

  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`group relative w-full overflow-hidden rounded-xl bg-gradient-to-r ${activeGradient} py-3 px-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      {/* Subtle shine effect overlay */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      <div className="relative flex items-center justify-center space-x-2">
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Authenticating Session...</span>
          </>
        ) : (
          <>
            <span>Launch EduPulse ERP Portal</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </div>
    </button>
  );
};

export default SignIn;
