import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import empresaFelodsi from '../empresaFelodsi.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate('/login');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="bg-brand-navy text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0"
            aria-label="Inicio"
            onClick={closeMenu}
          >
            <img
              src={empresaFelodsi}
              alt="Empresa Felodsi"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Navegación escritorio */}
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-brand-gold transition-colors"
                >
                  Panel
                </Link>

                <Link
                  to="/solicitud"
                  className="hover:text-brand-gold transition-colors"
                >
                  Nueva solicitud
                </Link>

                <Link
                  to="/historial"
                  className="hover:text-brand-gold transition-colors"
                >
                  Historial
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hover:text-brand-gold transition-colors"
                  >
                    Administracion
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-brand-accent hover:bg-brand-blue transition-colors px-3 py-1.5 rounded-md"
                >
                  Cerrar sesion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-brand-gold transition-colors"
                >
                  Iniciar sesion
                </Link>

                <Link
                  to="/registro"
                  className="bg-brand-gold text-brand-navy font-medium px-3 py-1.5 rounded-md hover:brightness-95 transition"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </nav>

          {/* Botón hamburguesa móvil */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-brand-blue transition-colors"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            <span className="sr-only">
              {menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            </span>

            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <nav className="md:hidden border-t border-white/10 py-4">
            {user ? (
              <div className="flex flex-col gap-2">
                
                {/* Usuario */}
                <div className="px-3 py-2 mb-2 border-b border-white/10">
                  <p className="text-xs text-slate-300">
                    Sesión iniciada como
                  </p>
                  <p className="font-medium truncate">
                    {user.fullName}
                  </p>
                </div>

                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="px-3 py-3 rounded-md hover:bg-brand-blue transition-colors"
                >
                  Panel
                </Link>

                <Link
                  to="/solicitud"
                  onClick={closeMenu}
                  className="px-3 py-3 rounded-md hover:bg-brand-blue transition-colors"
                >
                  Nueva solicitud
                </Link>

                <Link
                  to="/historial"
                  onClick={closeMenu}
                  className="px-3 py-3 rounded-md hover:bg-brand-blue transition-colors"
                >
                  Historial
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="px-3 py-3 rounded-md hover:bg-brand-blue transition-colors"
                  >
                    Administracion
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-3 mt-2 bg-brand-accent hover:bg-brand-blue rounded-md transition-colors"
                >
                  Cerrar sesion
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="px-3 py-3 rounded-md hover:bg-brand-blue transition-colors"
                >
                  Iniciar sesion
                </Link>

                <Link
                  to="/registro"
                  onClick={closeMenu}
                  className="px-3 py-3 bg-brand-gold text-brand-navy font-medium rounded-md hover:brightness-95 transition"
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}