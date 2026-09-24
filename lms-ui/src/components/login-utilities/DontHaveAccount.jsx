import React from 'react'

const DontHaveAccount = ({ role = 'student' }) => {
  const roleContact = {
    student: { text: 'New Student Enrollment', linkText: 'Request Access' },
    educator: { text: 'Faculty onboarding', linkText: 'Contact IT Admin' },
    admin: { text: 'Administrative rights', linkText: 'System Operations' }
  }

  const currentInfo = roleContact[role] || roleContact.student

  return (
    <div className="w-full space-y-4 pt-1">
      {/* Remember me & Forgot Password */}
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-white select-none">
          <input
            type="checkbox"
            className="w-4 h-4 rounded bg-slate-800/80 border border-white/20 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-indigo-500"
          />
          <span className="text-slate-300 text-xs">Remember me</span>
        </label>

        <a
          href="#forgot-password"
          onClick={(e) => {
            e.preventDefault()
            alert('Password reset link has been dispatched to institutional support.')
          }}
          className="text-indigo-300 hover:text-indigo-200 transition-colors font-medium hover:underline text-xs"
        >
          Forgot password?
        </a>
      </div>

      {/* Decorative divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-white/10 w-full" />
        <span className="bg-slate-900/80 px-2 text-[11px] text-slate-400 absolute">
          or
        </span>
      </div>

      {/* Need Account / Request Access */}
      <div className="text-center text-xs text-slate-400">
        <span>{currentInfo.text}? </span>
        <button
          type="button"
          onClick={() => alert(`For new ${role} access, please consult your department administrator or admissions desk.`)}
          className="text-white hover:text-indigo-300 font-semibold transition-colors underline underline-offset-2 cursor-pointer"
        >
          {currentInfo.linkText}
        </button>
      </div>
    </div>
  )
}

export default DontHaveAccount
