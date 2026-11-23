import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

// Public pages
import HomePage from './pages/public/HomePage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import RegisterPage from './pages/public/RegisterPage.jsx';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/public/ResetPasswordPage.jsx';
import BrowseOpportunitiesPage from './pages/public/BrowseOpportunitiesPage.jsx';
import OpportunityDetailsPage from './pages/public/OpportunityDetailsPage.jsx';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import StudentMessagesPage from './pages/student/MessagesPage.jsx';
import {
  StudentProfilePage,
  StudentEducationPage,
  StudentExperiencePage,
  StudentSkillsPage,
  StudentCVsPage,
  StudentSavedJobsPage,
  StudentApplicationsPage,
  StudentApplicationDetailPage,
  StudentApplyPage,
} from './pages/student/StudentPages.jsx';

// Employer pages
import EmployerDashboard from './pages/employer/EmployerDashboard.jsx';
import EmployerMessagesPage from './pages/employer/MessagesPage.jsx';
import {
  EmployerProfilePage,
  EmployerVerificationPage,
  EmployerOpportunitiesPage,
  EmployerOpportunityCreatePage,
  EmployerSchedulePage,
  EmployerApplicationsPage,
  EmployerApplicationDetailPage,
} from './pages/employer/EmployerPages.jsx';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import {
  AdminEmployers,
  AdminOpportunities,
  AdminCategories,
  AdminAnalytics,
  AdminActivityLogs,
  AdminAccounts,
} from './pages/admin/AdminPages.jsx';
import NotificationsPage from './pages/shared/NotificationsPage.jsx';

// Feature pages
import { JobAlertsPage, StudentInterviewsPage, EmployerInterviewsPage, RecommendationsPage } from './pages/features/FeaturePages.jsx';

const STUDENT_ROLES = ['student', 'graduate', 'job_seeker'];
const EMPLOYER_ROLES = ['employer'];
const ADMIN_ROLES = ['admin', 'super_admin'];

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/opportunities" element={<BrowseOpportunitiesPage />} />
            <Route path="/opportunities/:id" element={<OpportunityDetailsPage />} />

            {/* Student */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <StudentProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/student/education" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <StudentEducationPage />
              </ProtectedRoute>
            } />
            <Route path="/student/experience" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <StudentExperiencePage />
              </ProtectedRoute>
            } />
            <Route path="/student/skills" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <StudentSkillsPage />
              </ProtectedRoute>
            } />
            <Route path="/student/cvs" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <StudentCVsPage />
              </ProtectedRoute>
            } />
            <Route path="/student/saved" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <StudentSavedJobsPage />
              </ProtectedRoute>
            } />
            <Route path="/student/applications" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <StudentApplicationsPage />
              </ProtectedRoute>
            } />
            <Route path="/student/applications/:id" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <StudentApplicationDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/student/apply/:id" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <StudentApplyPage />
              </ProtectedRoute>
            } />
            <Route path="/student/messages" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <StudentMessagesPage />
              </ProtectedRoute>
            } />
            <Route path="/student/notifications" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <NotificationsPage />
              </ProtectedRoute>
            } />
            <Route path="/student/settings" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <StudentProfilePage />
              </ProtectedRoute>
            } />

            {/* Employer */}
            <Route path="/employer/dashboard" element={
              <ProtectedRoute roles={EMPLOYER_ROLES}>
                <EmployerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employer/profile" element={
              <ProtectedRoute roles={EMPLOYER_ROLES}>
                <EmployerProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/employer/verification" element={
              <ProtectedRoute roles={EMPLOYER_ROLES}>
                <EmployerVerificationPage />
              </ProtectedRoute>
            } />
            <Route path="/employer/opportunities" element={
              <ProtectedRoute roles={EMPLOYER_ROLES}>
                <EmployerOpportunitiesPage />
              </ProtectedRoute>
            } />
            <Route path="/employer/opportunities/create" element={
              <ProtectedRoute roles={EMPLOYER_ROLES}>
                <EmployerOpportunityCreatePage />
              </ProtectedRoute>
            } />
            <Route path="/employer/applications" element={
              <ProtectedRoute roles={EMPLOYER_ROLES}>
                <EmployerApplicationsPage />
              </ProtectedRoute>
            } />
            <Route path="/employer/candidates" element={
              <ProtectedRoute roles={EMPLOYER_ROLES}>
                <EmployerApplicationsPage />
              </ProtectedRoute>
            } />
            <Route path="/employer/schedule" element={
              <ProtectedRoute roles={EMPLOYER_ROLES}>
                <EmployerSchedulePage />
              </ProtectedRoute>
            } />
            <Route path="/employer/settings" element={
              <ProtectedRoute roles={EMPLOYER_ROLES}>
                <EmployerProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/employer/applications/:id" element={
              <ProtectedRoute roles={EMPLOYER_ROLES}>
                <EmployerApplicationDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/employer/messages" element={
              <ProtectedRoute roles={EMPLOYER_ROLES}>
                <EmployerMessagesPage />
              </ProtectedRoute>
            } />
            <Route path="/employer/notifications" element={
              <ProtectedRoute roles={EMPLOYER_ROLES}>
                <NotificationsPage />
              </ProtectedRoute>
            } />

            {/* Shared */}
            <Route path="/notifications" element={
              <ProtectedRoute roles={[...STUDENT_ROLES, ...EMPLOYER_ROLES, ...ADMIN_ROLES]}>
                <NotificationsPage />
              </ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute roles={ADMIN_ROLES}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute roles={ADMIN_ROLES}><AdminUsers /></ProtectedRoute>
            } />
            <Route path="/admin/employers" element={
              <ProtectedRoute roles={ADMIN_ROLES}><AdminEmployers /></ProtectedRoute>
            } />
            <Route path="/admin/verification" element={
              <ProtectedRoute roles={ADMIN_ROLES}><AdminEmployers verificationOnly /></ProtectedRoute>
            } />
            <Route path="/admin/opportunities" element={
              <ProtectedRoute roles={ADMIN_ROLES}><AdminOpportunities /></ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute roles={ADMIN_ROLES}><AdminCategories /></ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute roles={ADMIN_ROLES}><AdminAnalytics /></ProtectedRoute>
            } />
            <Route path="/admin/activity-logs" element={
              <ProtectedRoute roles={ADMIN_ROLES}><AdminActivityLogs /></ProtectedRoute>
            } />
            <Route path="/admin/admins" element={
              <ProtectedRoute roles={ADMIN_ROLES}><AdminAccounts /></ProtectedRoute>
            } />

            {/* Feature Pages - Student */}
            <Route path="/student/job-alerts" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <JobAlertsPage />
              </ProtectedRoute>
            } />
            <Route path="/student/recommendations" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <RecommendationsPage />
              </ProtectedRoute>
            } />
            <Route path="/student/interviews" element={
              <ProtectedRoute roles={STUDENT_ROLES}>
                <StudentInterviewsPage />
              </ProtectedRoute>
            } />

            {/* Feature Pages - Employer */}
            <Route path="/employer/interviews" element={
              <ProtectedRoute roles={EMPLOYER_ROLES}>
                <EmployerInterviewsPage />
              </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
