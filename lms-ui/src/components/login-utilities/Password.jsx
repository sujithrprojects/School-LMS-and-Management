import React, { useState } from 'react'
import lockIcon from '../../assets/lock.svg'
import eyecrossIcon from '../../assets/eyecross.svg'
import eyeopenIcon from '../../assets/eyeopen.svg'

const Password = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor="password-input" className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
          Password
        </label>
      </div>

      <div className="relative flex items-center rounded-xl glass-input px-3.5 py-2.5 transition-all">
        {/* Lock Icon */}
        <div className="flex items-center justify-center mr-3 pointer-events-none text-slate-400">
          <img
            src={lockIcon}
            alt="Lock icon"
            className="w-5 h-5 opacity-70"
          />
        </div>

        {/* Input Field */}
        <input
          id="password-input"
          type={showPassword ? 'text' : 'password'}
          required
          autoComplete="current-password"
          value={value}
          onChange={onChange}
          placeholder="••••••••••••"
          className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none pr-2"
        />

        {/* Toggle Show/Hide Password */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors focus:outline-none"
        >
          <img
            src={showPassword ? eyeopenIcon : eyecrossIcon}
            alt={showPassword ? 'Hide password' : 'Show password'}
            className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
          />
        </button>
      </div>
    </div>
  )
}

export default Password
