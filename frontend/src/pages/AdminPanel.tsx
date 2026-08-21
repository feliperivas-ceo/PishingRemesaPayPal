import { useEffect, useState } from 'react';
import api from '../services/api';
import { RequestStatus, STATUS_LABELS, TransferRequest } from '../services/types';

interface AdminListResponse {
  items: (TransferRequest & { user: { fullName: string; email: string } })[];
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_OPTIONS: RequestStatus[] = [
  'pendiente',
  'en_revision',
  'aprobada',
  'rechazada',
  'completada',
];

export default function AdminPanel() {
  const [data, setData] = useState<AdminListResponse | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/requests', {
        params: {
          search: search || undefined,
          status: statusFilter || undefined,
        },
      });
      setData(res.data);
    } catch {
      setError('No se pudo cargar la lista de solicitudes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStatusChange(id: string, status: RequestStatus) {
    try {
      await api.patch(`/admin/requests/${id}/status`, { status });
      load();
    } catch {
      setError('No se pudo actualizar el estado');
    }
  }

  async function handleAddNote(id: string) {
    if (!note.trim()) return;
    try {
      await api.post(`/admin/requests/${id}/notes`, { note });
      setNote('');
      setSelectedId(null);
      load();
    } catch {
      setError('No se pudo agregar la observacion');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-navy mb-6">Panel administrativo</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por numero de solicitud o correo"
          className="flex-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          onClick={load}
          className="bg-brand-accent text-white font-medium px-4 py-2 rounded-md hover:bg-brand-blue transition-colors"
        >
          Filtrar
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-slate-500">Cargando...</p>}

      {!loading && data && (
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>
                <th className="px-4 py-3">N. Solicitud</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Beneficiario</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((r) => (
                <tr key={r._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-brand-navy">{r.requestNumber}</td>
                  <td className="px-4 py-3">{r.user?.email}</td>
                  <td className="px-4 py-3">{r.beneficiary.fullName}</td>
                  <td className="px-4 py-3">
                    {r.amount} {r.currency}
                  </td>
                  <td className="px-4 py-3">{new Date(r.createdAt).toLocaleString('es-CO')}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r._id, e.target.value as RequestStatus)}
                      className="border border-slate-300 rounded-md px-2 py-1"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {selectedId === r._id ? (
                      <div className="flex gap-2">
                        <input
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="border border-slate-300 rounded-md px-2 py-1 text-xs w-32"
                          placeholder="Observacion"
                        />
                        <button
                          onClick={() => handleAddNote(r._id)}
                          className="text-brand-accent font-medium text-xs"
                        >
                          Guardar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedId(r._id)}
                        className="text-brand-accent text-xs font-medium"
                      >
                        Agregar nota
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.items.length === 0 && (
            <p className="text-slate-500 text-center py-8">No hay solicitudes que coincidan.</p>
          )}
        </div>
      )}
    </div>
  );
}
