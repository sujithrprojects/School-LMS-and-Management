import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import DashboardLayout from './components/layout/DashboardLayout';
import ExecutiveOverview from './components/modules/ExecutiveOverview';
import AccountsModule from './components/modules/AccountsModule';
import AdmissionsModule from './components/modules/AdmissionsModule';
import FacultyModule from './components/modules/FacultyModule';
import AcademicsModule from './components/modules/AcademicsModule';
import AdminGovernanceModule from './components/modules/AdminGovernanceModule';
import LibraryModule from './components/modules/LibraryModule';
import StudentPortalModule from './components/modules/StudentPortalModule';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentRole, setCurrentRole] = useState('admin');
  const [activeTab, setActiveTab] = useState('overview');

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    // Set appropriate default tab when role switches
    if (newRole === 'admin') setActiveTab('overview');
    else if (newRole === 'accountant') setActiveTab('accounts');
    else if (newRole === 'teacher') setActiveTab('academics');
    else if (newRole === 'student') setActiveTab('student-portal');
    else if (newRole === 'librarian') setActiveTab('library');
  };

  const handleLoginSuccess = (role) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    handleRoleChange(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // Render the active module based on tab & role
  const renderActiveModule = () => {
    if (activeTab === 'overview') {
      return <ExecutiveOverview onNavigateModule={(tab) => setActiveTab(tab)} />;
    }
    if (activeTab.startsWith('accounts')) {
      return <AccountsModule activeSubTab={activeTab} />;
    }
    if (activeTab === 'admissions') {
      return <AdmissionsModule />;
    }
    if (activeTab.startsWith('faculty')) {
      return <FacultyModule activeSubTab={activeTab} />;
    }
    if (activeTab.startsWith('academics')) {
      return <AcademicsModule activeSubTab={activeTab} />;
    }
    if (activeTab.startsWith('library')) {
      return <LibraryModule activeSubTab={activeTab} />;
    }
    if (activeTab === 'governance') {
      return <AdminGovernanceModule />;
    }
    if (activeTab === 'student-portal') {
      return <StudentPortalModule onNavigateTab={(tab) => setActiveTab(tab)} />;
    }

    return <ExecutiveOverview onNavigateModule={(tab) => setActiveTab(tab)} />;
  };

  return (
    <DashboardLayout
      currentRole={currentRole}
      onRoleChange={handleRoleChange}
      onLogout={handleLogout}
      activeTab={activeTab}
      onSelectTab={(tab) => setActiveTab(tab)}
    >
      {renderActiveModule()}
    </DashboardLayout>
  );
}

export default App;
