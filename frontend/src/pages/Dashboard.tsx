import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [showTip, setShowTip] = useState(true);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-navy mb-1">
        Hola, {user?.fullName?.split(' ')[0]}
      </h1>
      <p className="text-slate-600 mb-8">Este es tu panel para gestionar tus solicitudes.</p>

      <section className="bg-white border border-slate-200 rounded-xl p-5 mb-8">
        <h2 className="font-semibold text-brand-navy mb-2">
          Sobre la recepcion de pagos por servicios externos
        </h2>
        <p className="text-sm text-slate-600">
          Para recibir pagos mediante servicios externos, asegurate de que tu cuenta este
          habilitada para recibir fondos y de cumplir con los requisitos de seguridad y
          verificacion establecidos por el proveedor que uses.
        </p>
      </section>

      {showTip && (
        <div className="relative bg-amber-50 border border-brand-gold rounded-xl p-4 mb-8">
          <button
            onClick={() => setShowTip(false)}
            aria-label="Cerrar aviso"
            className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
          >
            ×
          </button>
          <p className="text-sm text-slate-700 pr-6">
            <strong>Recuerda:</strong> Si la verificación en dos pasos ya está desactivada, no realices ningún cambio y continúa con el siguiente paso. Si está activada, ve a la configuración de tu Cuenta de Google → Seguridad → Verificación en 2 pasos → Desactivar y confirma la desactivación.
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          to="/solicitud"
          className="bg-brand-accent text-white rounded-xl p-5 hover:bg-brand-blue transition-colors"
        >
          <h3 className="font-semibold mb-1">Nueva solicitud</h3>
          <p className="text-sm text-blue-100">Registra una solicitud de recepcion de dinero.</p>
        </Link>
        <Link
          to="/historial"
          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-accent transition-colors"
        >
          <h3 className="font-semibold text-brand-navy mb-1">Historial</h3>
          <p className="text-sm text-slate-600">Consulta el estado de tus solicitudes.</p>
        </Link>
      </div>
    </div>
  );
}
