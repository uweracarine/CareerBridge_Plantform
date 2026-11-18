import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { resetPasswordSchema } from '../../validations/auth.js';
import { authService } from '../../services/api.js';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <p className="text-error mb-4">Invalid or missing reset token.</p>
          <Link to="/forgot-password" className="btn-primary inline-block py-2.5 px-6">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      await authService.resetPassword(token, data.password);
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <CheckCircle size={48} className="text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text mb-2">Password Reset!</h2>
          <p className="text-text-light mb-6">Your password has been updated successfully.</p>
          <button onClick={() => navigate('/login')} className="btn-primary w-full py-2.5">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/"><h1 className="text-3xl font-bold text-primary">CareerBridge</h1></Link>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-text mb-1">Set new password</h2>
          <p className="text-text-light mb-6">Choose a strong password for your account.</p>

          {serverError && (
            <div className="mb-4 p-3 bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg text-error text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  className="input-field pr-10"
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

            <div>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                placeholder="Repeat new password"
                className="input-field"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
