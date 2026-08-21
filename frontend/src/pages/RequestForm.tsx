import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  METHOD_LABELS,
  REASON_LABELS,
  RELATION_LABELS,
} from '../services/types';

interface FormState {
  amount: string;
  currency: string;
  reason: string;
  senderRelation: string;
  beneficiaryFullName: string;
  beneficiaryEmail: string;
  beneficiaryCountry: string;
  beneficiaryCity: string;
  beneficiaryPhone: string;
  receivingMethod: string;
}

const initialState: FormState = {
  amount: '',
  currency: 'CAD',
  reason: '',
  senderRelation: '',
  beneficiaryFullName: '',
  beneficiaryEmail: '',
  beneficiaryCountry: 'Colombia',
  beneficiaryCity: '',
  beneficiaryPhone: '',
  receivingMethod: '',
};

const STEPS = ['Pago', 'Remitente', 'Beneficiario', 'Confirmar'];

export default function RequestForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    setError(null);
    if (step === 0 && (!form.amount || Number(form.amount) <= 0 || !form.currency || !form.reason)) {
      setError('Completa la cantidad, moneda y motivo antes de continuar.');
      return;
    }
    if (step === 1 && !form.senderRelation) {
      setError('Selecciona la relacion con el remitente.');
      return;
    }
    if (
      step === 2 &&
      (!form.beneficiaryFullName || !form.beneficiaryEmail || !form.beneficiaryCountry || !form.beneficiaryCity || !form.receivingMethod)
    ) {
      setError('Completa los datos del beneficiario y el metodo de recepcion.');
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/requests', {
        amount: Number(form.amount),
        currency: form.currency,
        reason: form.reason,
        senderRelation: form.senderRelation,
        beneficiary: {
          fullName: form.beneficiaryFullName,
          email: form.beneficiaryEmail,
          country: form.beneficiaryCountry,
          city: form.beneficiaryCity,
          phone: form.beneficiaryPhone || undefined,
        },
        receivingMethod: form.receivingMethod,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo registrar la solicitud');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h1 className="text-xl font-bold text-brand-navy mb-3">Solicitud registrada</h1>
        <p className="text-slate-600 mb-8">
          Tu solicitud fue registrada correctamente. Nuestro sistema procesara la informacion y
          te notificara por correo electronico cuando exista una actualizacion sobre tu
          solicitud. El tiempo de recepcion depende del metodo de transferencia y de las
          verificaciones correspondientes.
        </p>
        <button
          onClick={() => navigate('/historial')}
          className="bg-brand-accent text-white font-medium px-6 py-2.5 rounded-lg hover:bg-brand-blue transition-colors"
        >
          Ver mis solicitudes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-navy mb-2">Nueva solicitud</h1>

      <ol className="flex items-center gap-2 mb-8 text-xs">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2 flex-1">
            <span
              className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-medium ${
                i <= step ? 'bg-brand-accent text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {i + 1}
            </span>
            <span className={i <= step ? 'text-brand-navy font-medium' : 'text-slate-400'}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="flex-1 h-px bg-slate-200" />}
          </li>
        ))}
      </ol>

      <form
        onSubmit={step === STEPS.length - 1 ? handleSubmit : (e) => e.preventDefault()}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
      >
        {step === 0 && (
          <>
            <Field label="Pais de origen">
              <input disabled value="Canada" className="w-full border border-slate-200 bg-slate-50 rounded-md px-3 py-2" />
            </Field>
            <Field label="Pais de destino">
              <input disabled value="Colombia" className="w-full border border-slate-200 bg-slate-50 rounded-md px-3 py-2" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Cantidad que espera recibir">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => update('amount', e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </Field>
              <Field label="Moneda">
                <select
                  value={form.currency}
                  onChange={(e) => update('currency', e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="COP">COP</option>
                </select>
              </Field>
            </div>
            <Field label="Motivo de la transferencia">
              <select
                value={form.reason}
                onChange={(e) => update('reason', e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="">Selecciona una opcion</option>
                {Object.entries(REASON_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}

        {step === 1 && (
          <Field label="¿Quien envia el dinero?">
            <select
              value={form.senderRelation}
              onChange={(e) => update('senderRelation', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              <option value="">Selecciona una opcion</option>
              {Object.entries(RELATION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        )}

        {step === 2 && (
          <>
            <Field label="Nombre completo del beneficiario">
              <input
                value={form.beneficiaryFullName}
                onChange={(e) => update('beneficiaryFullName', e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </Field>
            <Field label="Correo electronico del beneficiario">
              <input
                type="email"
                value={form.beneficiaryEmail}
                onChange={(e) => update('beneficiaryEmail', e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Pais">
                <input
                  value={form.beneficiaryCountry}
                  onChange={(e) => update('beneficiaryCountry', e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </Field>
              <Field label="Ciudad">
                <input
                  value={form.beneficiaryCity}
                  onChange={(e) => update('beneficiaryCity', e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </Field>
            </div>
            <Field label="Telefono (opcional)">
              <input
                value={form.beneficiaryPhone}
                onChange={(e) => update('beneficiaryPhone', e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </Field>
            <Field label="Metodo mediante el cual espera recibir el dinero">
              <select
                value={form.receivingMethod}
                onChange={(e) => update('receivingMethod', e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="">Selecciona una opcion</option>
                {Object.entries(METHOD_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}

        {step === 3 && (
          <div className="space-y-2 text-sm">
            <SummaryRow label="Beneficiario" value={form.beneficiaryFullName} />
            <SummaryRow label="Pais de origen" value="Canada" />
            <SummaryRow label="Pais de destino" value="Colombia" />
            <SummaryRow label="Cantidad" value={`${form.amount} ${form.currency}`} />
            <SummaryRow label="Motivo" value={REASON_LABELS[form.reason] || form.reason} />
            <SummaryRow label="Relacion con el remitente" value={RELATION_LABELS[form.senderRelation] || form.senderRelation} />
            <SummaryRow label="Metodo de recepcion" value={METHOD_LABELS[form.receivingMethod] || form.receivingMethod} />
            <p className="text-slate-500 pt-2">
              Verifica que la informacion sea correcta antes de enviar la solicitud.
            </p>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="px-4 py-2 rounded-md text-slate-600 disabled:opacity-0"
          >
            Atras
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="bg-brand-accent text-white font-medium px-5 py-2 rounded-md hover:bg-brand-blue transition-colors"
            >
              Continuar
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="bg-brand-accent text-white font-medium px-5 py-2 rounded-md hover:bg-brand-blue transition-colors disabled:opacity-60"
            >
              {submitting ? 'Enviando...' : 'Confirmar y enviar'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-1.5">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}
