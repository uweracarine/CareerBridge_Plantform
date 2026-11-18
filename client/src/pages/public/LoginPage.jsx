import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginSchema } from '../../validations/auth.js';
import { authService } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const ROLE_REDIRECTS = {
  student: '/student/dashboard',
  graduate: '/student/dashboard',
  job_seeker: '/student/dashboard',
  employer: '/employer/dashboard',
  admin: '/admin/dashboard',
  super_admin: '/admin/dashboard',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      const res = await authService.login(data);
      login(res.data.user, res.data.token);
      const from = location.state?.from || ROLE_REDIRECTS[res.data.user.role] || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary">CareerBridge</h1>
            <p className="text-text-light text-sm mt-1">Connecting Talent to Opportunity</p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-text mb-1">Welcome back</h2>
          <p className="text-text-light mb-6">Sign in to your account</p>

          {serverError && (
            <div className="mb-4 p-3 bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg text-error text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="form-label mb-0">Password</label>
                <Link to="/forgot-password" className="text-secondary text-sm hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="input-field pr-10"
                  autoComplete="current-password"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-text-light text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-secondary font-semibold hover:underline">
              Create one
            </Link>
          </p>

          {/* Dev hint */}
          <div className="mt-6 p-3 bg-background rounded-lg border border-border text-xs text-text-light">
            <p className="font-semibold mb-1">Test accounts:</p>
            <p>Student: student@test.rw / Test@123</p>
            <p>Employer: employer@test.rw / Test@123</p>
            <p>Admin: admin@careerbridge.rw / Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
