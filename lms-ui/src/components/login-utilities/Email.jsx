import React from 'react';
import emailIcon from '../../assets/email.svg';

const Email = ({ value, onChange, role = 'admin' }) => {
  const rolePlaceholders = {
    admin: 'admin.director@edupulse.edu',
    accountant: 'bursar.sterling@edupulse.edu',
    teacher: 'david.vance@edupulse.edu',
    student: 'aiden.alexander@student.edupulse.edu',
    librarian: 'miriam.library@edupulse.edu'
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor="email-input" className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
          Email / Institutional ID
        </label>
      </div>

      <div className="relative flex items-center rounded-xl glass-input px-3.5 py-2.5 transition-all">
        {/* Email Icon */}
        <div className="flex items-center justify-center mr-3 pointer-events-none text-slate-400">
          <img
            src={emailIcon}
            alt="Email icon"
            className="w-5 h-5 opacity-70 transition-opacity group-focus-within:opacity-100"
          />
        </div>

        {/* Input Field */}
        <input
          id="email-input"
          type="email"
          required
          autoComplete="email"
          value={value}
          onChange={onChange}
          placeholder={rolePlaceholders[role] || 'name@edupulse.edu'}
          className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default Email;
