import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import googleLogo from '../Google-Logo.png';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
        Gestiona tus solicitudes de recepcion de dinero
      </h1>
      <p className="text-slate-600 mb-8">
        Registra y da seguimiento a tus solicitudes de dinero enviado desde Canada hacia
        Colombia, de forma sencilla y organizada.
      </p>
      {user ? (
        <Link
          to="/solicitud"
          className="inline-block bg-brand-accent text-white font-medium px-6 py-3 rounded-lg hover:bg-brand-blue transition-colors"
        >
          Crear nueva solicitud
        </Link>
      ) : (
        <div className="flex justify-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 border border-brand-blue text-brand-blue font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <img src={googleLogo} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
            Iniciar sesión
          </Link>
        </div>
      )}
    </div>
  );
}
