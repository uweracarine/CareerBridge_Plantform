import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { registerSchema } from '../../validations/auth.js';
import { authService } from '../../services/api.js';

const ROLES = [
  { value: 'student', label: 'Student', desc: 'Currently enrolled in university' },
  { value: 'graduate', label: 'Graduate', desc: 'Recently completed studies' },
  { value: 'job_seeker', label: 'Job Seeker', desc: 'Looking for employment' },
  { value: 'employer', label: 'Employer / Organization', desc: 'Post jobs and find talent' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      await authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-xl shadow-md p-8">
            <CheckCircle size={56} className="text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text mb-2">Account Created!</h2>
            <p className="text-text-light mb-6">
              We've sent a verification email to your inbox. Please verify your email to activate your account.
            </p>
            <p className="text-text-light text-sm mb-6">
              (Email is disabled in development — your account is active immediately.)
            </p>
            <button onClick={() => navigate('/login')} className="btn-primary w-full py-2.5">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary">CareerBridge</h1>
            <p className="text-text-light text-sm mt-1">Connecting Talent to Opportunity</p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-text mb-1">Create your account</h2>
          <p className="text-text-light mb-6">Join thousands of professionals on CareerBridge</p>

          {serverError && (
            <div className="mb-4 p-3 bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg text-error text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Account Type */}
            <div>
              <label className="form-label">I am a...</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === r.value
                        ? 'border-secondary bg-secondary bg-opacity-5'
                        : 'border-border hover:border-secondary hover:border-opacity-50'
                    }`}
                  >
                    <input type="radio" value={r.value} className="sr-only" {...register('role')} />
                    <span className="font-semibold text-text text-sm">{r.label}</span>
                    <span className="text-text-light text-xs mt-0.5">{r.desc}</span>
                  </label>
                ))}
              </div>
              {errors.role && <p className="error-message">{errors.role.message}</p>}
            </div>

            {/* Full Name */}
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="input-field"
                autoComplete="name"
                {...register('fullName')}
              />
              {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  className="input-field pr-10"
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label className="form-label">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  className="input-field pr-10"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 accent-secondary cursor-pointer"
                {...register('agreeToTerms')}
              />
              <label htmlFor="terms" className="text-sm text-text-light cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-secondary hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-secondary hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.agreeToTerms && <p className="error-message">{errors.agreeToTerms.message}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-text-light text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
