import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import googleLogo from '../Google-Logo.png';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Credenciales invalidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-header">
          <img className="login-logo" src={googleLogo} alt="Google" />
          <h1 id="login-title">Iniciar sesión</h1>
          <p>Ingresa a tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" name="email" placeholder="Ingresa tu correo" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="input-group">
            <div className="password-label">
              <label htmlFor="password">Contraseña</label>
              <button type="button" className="forgot-password" disabled>¿Olvidaste tu contraseña?</button>
            </div>
            <div className="password-container">
              <input id="password" type={showPassword ? 'text' : 'password'} name="password" placeholder="Ingresa tu contraseña" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="show-password" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-button" disabled={loading}>{loading ? 'Ingresando...' : 'Iniciar sesión'}</button>
        </form>

        <div className="register-section">
          <span>¿No tienes una cuenta?</span>
          <Link to="/registro" className="register-button">Crear cuenta</Link>
        </div>
      </section>

      <footer className="login-footer">
        <span>© 2026 Recepción de dinero</span>
        <div>
          <button type="button" disabled>Privacidad</button>
          <button type="button" disabled>Términos</button>
        </div>
      </footer>
    </main>
  );
}
