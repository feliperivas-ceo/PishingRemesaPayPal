import { useEffect, useState } from 'react';
import api from '../services/api';
import { STATUS_LABELS, TransferRequest } from '../services/types';

const STATUS_COLORS: Record<string, string> = {
  pendiente: 'bg-slate-100 text-slate-700',
  en_revision: 'bg-blue-100 text-blue-700',
  aprobada: 'bg-green-100 text-green-700',
  rechazada: 'bg-red-100 text-red-700',
  completada: 'bg-brand-gold/40 text-brand-navy',
};

export default function History() {
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/requests')
      .then((res) => setRequests(res.data))
      .catch(() => setError('No se pudo cargar el historial'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-navy mb-6">Historial de solicitudes</h1>

      {loading && <p className="text-slate-500">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && requests.length === 0 && (
        <p className="text-slate-500">Aun no tienes solicitudes registradas.</p>
      )}

      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r._id} className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-brand-navy">{r.requestNumber}</p>
              <p className="text-sm text-slate-500">
                {r.amount} {r.currency} · {r.beneficiary.fullName} · {new Date(r.createdAt).toLocaleDateString('es-CO')}
              </p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[r.status]}`}>
              {STATUS_LABELS[r.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
