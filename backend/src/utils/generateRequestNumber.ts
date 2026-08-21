// Genera un numero de solicitud legible, ej: SOL-20260820-4F3A9C
export function generateRequestNumber(): string {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `SOL-${datePart}-${randomPart}`;
}
