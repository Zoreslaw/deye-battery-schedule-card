import type { HassEntity, HomeAssistant, ProgramConfig, ProgramView, ScheduleConfig, SocLimits } from './types';

export const PROGRAM_COUNT = 6;
export function normalizeTime(value: unknown): string | undefined {
  if (typeof value !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(value)) return undefined;
  return value.length === 5 ? `${value}:00` : value;
}
export function displayTime(value?: string): string {
  return value ? (value.endsWith(':00') ? value.slice(0, 5) : value) : '—';
}
export function numberValue(value: unknown): number | undefined {
  if (typeof value !== 'string' || value.trim() === '') return undefined;
  const result = Number(value);
  return Number.isFinite(result) ? result : undefined;
}
export function socLimits(entity?: HassEntity): SocLimits | undefined {
  if (!entity) return undefined;
  const { min = 0, max = 100, step = 1, unit_of_measurement: unit } = entity.attributes;
  if (![min, max, step].every(Number.isFinite) || step <= 0 || min > max || (unit && unit !== '%')) return undefined;
  // Keep native input constraints aligned with the entity's step anchor.
  const low = Number((min + Math.ceil((Math.max(0, min) - min) / step - 1e-8) * step).toFixed(8)),
    high = Number((min + Math.floor((Math.min(100, max) - min) / step + 1e-8) * step).toFixed(8));
  if (low > high) return undefined;
  return { min: low, max: high, step, anchor: min };
}
export function validSoc(value: number, limits: SocLimits): boolean {
  const steps = (value - limits.anchor) / limits.step;
  return (
    Number.isFinite(value) && value >= limits.min && value <= limits.max && Math.abs(steps - Math.round(steps)) < 1e-6
  );
}
export function stepSoc(value: number, direction: number, limits: SocLimits): number {
  const steps = (value - limits.anchor) / limits.step;
  const next = direction > 0 ? Math.floor(steps + 1e-6) + 1 : Math.ceil(steps - 1e-6) - 1;
  const target = Number((limits.anchor + next * limits.step).toFixed(8));
  return target >= limits.min && target <= limits.max ? target : value;
}
export function validateConfig(config: ScheduleConfig): ScheduleConfig {
  if (!config || !Array.isArray(config.programs) || config.programs.length !== PROGRAM_COUNT)
    throw new Error('Потрібно налаштувати рівно 6 програм.');
  if (config.title !== undefined && typeof config.title !== 'string') throw new Error('Назва має бути рядком.');
  const ids = new Set<string>();
  for (const program of config.programs) {
    if (!program || typeof program.time !== 'string' || typeof program.soc !== 'string')
      throw new Error('Кожна програма потребує полів time і soc.');
    for (const id of [program.time, program.soc]) {
      if (id && ids.has(id)) throw new Error('Сутності програм не повинні повторюватися.');
      if (id) ids.add(id);
    }
  }
  return { ...config, programs: config.programs.map((program) => ({ ...program })) };
}
function entityIssue(hass: HomeAssistant | undefined, id: string, domain: string): string {
  if (!id) return 'Виберіть сутність';
  if (!new RegExp(`^${domain}\\.[a-z0-9_]+$`).test(id)) return 'Неправильний тип сутності';
  if (!hass) return 'Очікування Home Assistant';
  const entity = hass.states[id];
  if (!entity) return 'Сутність не знайдено';
  if (entity.state === 'unavailable' || entity.state === 'unknown') return 'Немає зв’язку';
  return '';
}
export function programViews(programs: ProgramConfig[], hass?: HomeAssistant): ProgramView[] {
  return programs.map((program, index) => {
    const start = normalizeTime(hass?.states[program.time]?.state);
    const next = programs[(index + 1) % programs.length];
    const end = /^time\./.test(next.time) ? normalizeTime(hass?.states[next.time]?.state) : undefined;
    const soc = numberValue(hass?.states[program.soc]?.state);
    const limits = socLimits(hass?.states[program.soc]);
    const issue =
      entityIssue(hass, program.time, 'time') ||
      entityIssue(hass, program.soc, 'number') ||
      (!start
        ? 'Некоректний час'
        : soc === undefined || soc < 0 || soc > 100 || !limits
          ? 'Некоректний рівень заряду'
          : '');
    return {
      start,
      end,
      soc,
      limits,
      issue,
      endMissing: !end,
      nextDay: index === programs.length - 1 || !!(start && end && end < start),
    };
  });
}
