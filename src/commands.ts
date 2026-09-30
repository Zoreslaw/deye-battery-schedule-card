import { normalizeTime, numberValue } from './model';
import type { Field, HomeAssistant } from './types';
export const CONFIRMATION_TIMEOUT = 15000;
interface Command {
  field: Field;
  entity: string;
  target: string | number;
  timer?: ReturnType<typeof setTimeout>;
}

// Commands are scoped by program. Object identity protects against stale service callbacks.
export class Commands {
  readonly pending = new Map<number, Command>();
  readonly errors = new Map<number, string>();
  constructor(private readonly changed: () => void) {}
  send(row: number, field: Field, entity: string, target: string | number, hass: HomeAssistant): void {
    if (this.pending.has(row)) return;
    this.errors.delete(row);
    const command: Command = { field, entity, target };
    this.pending.set(row, command);
    command.timer = setTimeout(
      () => this.finish(row, command, 'Немає підтвердження. Спробуйте ще раз.'),
      CONFIRMATION_TIMEOUT,
    );
    this.changed();
    try {
      const promise = hass.callService(
        field === 'time' ? 'time' : 'number',
        'set_value',
        field === 'time' ? { entity_id: entity, time: String(target) } : { entity_id: entity, value: Number(target) },
      );
      void promise.catch(() => this.finish(row, command, 'Не вдалося зберегти. Спробуйте ще раз.'));
    } catch {
      this.finish(row, command, 'Не вдалося зберегти. Спробуйте ще раз.');
    }
  }
  reconcile(hass?: HomeAssistant): void {
    for (const [row, command] of this.pending) {
      const state = hass?.states[command.entity]?.state;
      const actual = command.field === 'time' ? normalizeTime(state) : numberValue(state);
      if (actual === undefined) this.finish(row, command, 'Немає зв’язку. Зміну не підтверджено.');
      else if (
        typeof actual === 'number' && typeof command.target === 'number'
          ? Math.abs(actual - command.target) < 1e-7
          : actual === command.target
      )
        this.finish(row, command);
    }
  }
  private finish(row: number, command: Command, error?: string): void {
    if (this.pending.get(row) !== command) return;
    clearTimeout(command.timer);
    this.pending.delete(row);
    if (error) this.errors.set(row, error);
    this.changed();
  }
  clear(): void {
    for (const command of this.pending.values()) clearTimeout(command.timer);
    this.pending.clear();
    this.errors.clear();
  }
}
