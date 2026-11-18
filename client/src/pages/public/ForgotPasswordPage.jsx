import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { forgotPasswordSchema } from '../../validations/auth.js';
import { authService } from '../../services/api.js';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary">CareerBridge</h1>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle size={48} className="text-success mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">Check your email</h2>
              <p className="text-text-light mb-6">
                If an account exists for that email, we've sent a password reset link.
              </p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2 py-2.5 px-6">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center gap-1 text-text-light text-sm hover:text-text mb-6">
                <ArrowLeft size={16} /> Back to login
              </Link>
              <h2 className="text-2xl font-bold text-text mb-1">Forgot password?</h2>
              <p className="text-text-light mb-6">
                Enter your email and we'll send you a reset link.
              </p>

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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
                >
                  {isLoading && <Loader2 size={18} className="animate-spin" />}
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
