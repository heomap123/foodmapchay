import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [loading, navigate, user]);

  async function handleEmailSubmit(mode) {
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập email và mật khẩu.');
      setMessage('');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const action = mode === 'login' ? signIn : signUp;
      const { error: authError } = await action(email.trim(), password);

      if (authError) {
        throw authError;
      }

      if (mode === 'login') {
        setMessage('Đăng nhập thành công. Đang chuyển hướng...');
        navigate('/', { replace: true });
        return;
      }

      setMessage('Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản.');
    } catch (caughtError) {
      setError(caughtError?.message || 'Đã xảy ra lỗi.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: authError } = await signInWithGoogle();

      if (authError) {
        throw authError;
      }

      setMessage('Đang chuyển hướng đến Google để hoàn tất đăng nhập...');
    } catch (caughtError) {
      setError(caughtError?.message || 'Không thể đăng nhập bằng Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <main className="veggie-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <section style={{ width: '100%', maxWidth: 440, padding: '32px 24px', borderRadius: 28, background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(19,37,30,0.08)', boxShadow: '0 20px 50px rgba(40, 62, 53, 0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="brand-mark" style={{ margin: '0 auto 12px' }}>🌿</div>
          <div className="brand-name" style={{ fontSize: '2rem' }}>LocaFood</div>
          <p style={{ margin: '8px 0 0', color: '#587062', fontWeight: 600 }}>Chào mừng bạn quay lại</p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleEmailSubmit('login');
          }}
          style={{ display: 'grid', gap: 16 }}
        >
          <label style={{ display: 'grid', gap: 8, fontWeight: 700, color: '#214b38' }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(20,42,34,0.1)', fontSize: '1rem' }}
            />
          </label>

          <label style={{ display: 'grid', gap: 8, fontWeight: 700, color: '#214b38' }}>
            Mật khẩu
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(20,42,34,0.1)', fontSize: '1rem' }}
            />
          </label>

          {error && (
            <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(180, 75, 62, 0.08)', color: '#8C3D2C', fontWeight: 600 }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(58, 146, 99, 0.1)', color: '#214b38', fontWeight: 600 }}>
              {message}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button
              type="submit"
              className="cta-button"
              disabled={isSubmitting || isGoogleLoading}
              style={{ width: '100%' }}
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <button
              type="button"
              className="feature-cta"
              disabled={isSubmitting || isGoogleLoading}
              onClick={() => handleEmailSubmit('signup')}
              style={{ width: '100%' }}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </div>

          <button
            type="button"
            className="login-button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting || isGoogleLoading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isGoogleLoading ? 'Đang chuyển hướng...' : 'Đăng nhập với Google'}
          </button>
        </form>
      </section>
    </main>
  );
}
