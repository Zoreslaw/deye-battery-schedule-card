import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Commands } from './commands';
import { displayTime, normalizeTime, numberValue, programViews, stepSoc, validSoc, validateConfig } from './model';
import type { Field, HomeAssistant, ScheduleConfig } from './types';
import './editor';

interface Draft {
  row: number;
  field: Field;
  value: string;
  original: string | number;
  error: string;
}

@customElement('deye-battery-schedule-card')
export class DeyeBatteryScheduleCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: ScheduleConfig;
  @state() private draft?: Draft;
  private returnFocus?: HTMLElement;
  private readonly commands = new Commands(() => this.requestUpdate());

  public setConfig(config: ScheduleConfig): void {
    const validated = validateConfig(config);
    this.commands.clear();
    this.closeEditor(false);
    this.config = validated;
  }
  public static getConfigElement(): HTMLElement {
    return document.createElement('deye-battery-schedule-card-editor');
  }
  public static getStubConfig(): ScheduleConfig {
    // Pairing entities by name could silently target the wrong inverter.
    return {
      type: 'custom:deye-battery-schedule-card',
      programs: Array.from({ length: 6 }, () => ({ time: '', soc: '' })),
    };
  }
  public getCardSize(): number {
    return 7;
  }
  public getGridOptions() {
    return { columns: 'full' as const, rows: 'auto' as const, min_columns: 6 };
  }
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.commands.clear();
    this.closeEditor(false);
  }
  public connectedCallback(): void {
    super.connectedCallback();
    this.requestUpdate();
  }
  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('hass')) this.commands.reconcile(this.hass);
  }
  private get views() {
    return programViews(this.config?.programs ?? [], this.hass);
  }
  private async openEditor(row: number, field: Field, event: Event): Promise<void> {
    const view = this.views[row];
    if (!view || view.issue || this.commands.pending.has(row) || !this.isConnected) return;
    const original = field === 'time' ? view.start : view.soc;
    if (original === undefined) return;
    this.returnFocus = event.currentTarget as HTMLElement;
    this.draft = { row, field, original, value: String(original), error: '' };
    await this.updateComplete;
    const dialog = this.renderRoot?.querySelector('dialog');
    if (!this.draft || !this.isConnected || !dialog) return;
    if (!dialog.open) dialog.showModal();
    this.renderRoot.querySelector<HTMLInputElement>('#value')?.focus();
  }
  private closeEditor(restore = true): void {
    this.draft = undefined;
    const dialog = this.renderRoot?.querySelector('dialog');
    if (dialog?.open) dialog.close();
    if (restore && this.isConnected) this.returnFocus?.focus({ preventScroll: true });
    this.returnFocus = undefined;
  }
  private changeDraft(event: Event): void {
    if (this.draft) this.draft = { ...this.draft, value: (event.target as HTMLInputElement).value, error: '' };
  }
  private step(direction: number): void {
    if (!this.draft) return;
    const limits = this.views[this.draft.row]?.limits;
    const current = numberValue(this.draft.value);
    if (limits && current !== undefined)
      this.draft = { ...this.draft, value: String(stepSoc(current, direction, limits)), error: '' };
  }
  private save(event: Event): void {
    event.preventDefault();
    const draft = this.draft;
    if (!draft || !this.config || !this.hass || !this.isConnected || this.commands.pending.has(draft.row)) return;
    const view = this.views[draft.row];
    const error = (message: string) => {
      this.draft = { ...draft, error: message };
    };
    if (view.issue) {
      error(view.issue);
      return;
    }
    const actual = draft.field === 'time' ? view.start : view.soc;
    if (actual !== draft.original) {
      error('Значення вже змінилося. Закрийте й відкрийте редактор знову.');
      return;
    }
    const target = draft.field === 'time' ? normalizeTime(draft.value) : numberValue(draft.value);
    if (target === undefined || (typeof target === 'number' && (!view.limits || !validSoc(target, view.limits)))) {
      error(draft.field === 'time' ? 'Вкажіть коректний час.' : 'Вкажіть заряд у межах і з кроком цієї сутності.');
      return;
    }
    this.closeEditor();
    if (target === actual) return;
    this.commands.send(draft.row, draft.field, this.config.programs[draft.row][draft.field], target, this.hass);
  }
  private dialogClick(event: MouseEvent): void {
    if (event.target !== event.currentTarget) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      this.closeEditor();
  }
  private dialogKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const dialog = event.currentTarget as HTMLDialogElement;
    const controls = [...dialog.querySelectorAll<HTMLInputElement | HTMLButtonElement>('button, input')].filter(
      (control) => !control.disabled && control.tabIndex >= 0,
    );
    const first = controls[0];
    const last = controls.at(-1);
    const active = this.shadowRoot?.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first?.focus();
    }
  }
  private renderEditor() {
    const draft = this.draft;
    const limits = draft ? this.views[draft.row]?.limits : undefined;
    const soc = draft?.field === 'soc';
    return html`<dialog
      aria-labelledby="dialog-title"
      @cancel=${(event: Event) => {
        event.preventDefault();
        this.closeEditor();
      }}
      @close=${() => this.closeEditor()}
      @click=${this.dialogClick}
      @keydown=${this.dialogKeyDown}
    >
      ${
        draft
          ? html`<form novalidate @submit=${this.save}>
              <div class="dialog-heading">
                <h3 id="dialog-title">${soc ? 'Рівень заряду' : 'Початок програми'}</h3>
                <button type="button" class="close" aria-label="Закрити" @click=${() => this.closeEditor()}>×</button>
              </div>
              <p class="dialog-subtitle">Програма ${draft.row + 1}</p>
              <label class="sr-only" for="value">${soc ? 'Заряд, %' : 'Час початку'}</label>
              ${
                soc
                  ? html`<div class="stepper">
                        <button
                          type="button"
                          aria-label="Зменшити заряд"
                          ?disabled=${!!limits && stepSoc(Number(draft.value), -1, limits) === Number(draft.value)}
                          @click=${() => this.step(-1)}
                        >
                          −
                        </button>
                        <div class="number-wrap">
                          <input
                            id="value"
                            type="number"
                            inputmode="decimal"
                            required
                            .value=${draft.value}
                            min=${limits?.min ?? 0}
                            max=${limits?.max ?? 100}
                            step=${limits?.step ?? 1}
                            @input=${this.changeDraft}
                          /><span aria-hidden="true">%</span>
                        </div>
                        <button
                          type="button"
                          aria-label="Збільшити заряд"
                          ?disabled=${!!limits && stepSoc(Number(draft.value), 1, limits) === Number(draft.value)}
                          @click=${() => this.step(1)}
                        >
                          +
                        </button>
                      </div>
                      <p class="limits">${limits?.min}–${limits?.max}% · крок ${limits?.step}%</p>`
                  : html`<input
                        id="value"
                        class="time-input"
                        type="time"
                        required
                        step=${draft.original.toString().endsWith(':00') ? '60' : '1'}
                        .value=${draft.value}
                        @input=${this.changeDraft}
                      />
                      <p class="limits">Змінює також кінець попереднього інтервалу.</p>`
              }
              <p class="dialog-error" role="alert">${draft.error}</p>
              <div class="actions">
                <button type="button" @click=${() => this.closeEditor()}>Скасувати</button
                ><button class="save" type="submit">Зберегти</button>
              </div>
            </form>`
          : ''
      }
    </dialog>`;
  }
  protected render() {
    if (!this.config) return html``;
    const views = this.views;
    const errorEntry = [...this.commands.errors.entries()].at(-1);
    const pendingRow = this.commands.pending.keys().next().value as number | undefined;
    const unavailableRow = views.findIndex((view) => !!view.issue);
    const footer = errorEntry
      ? `Програма ${errorEntry[0] + 1}: ${errorEntry[1]}`
      : pendingRow !== undefined
        ? `Програма ${pendingRow + 1}: очікуємо підтвердження…`
        : unavailableRow >= 0
          ? `Програма ${unavailableRow + 1}: ${views[unavailableRow].issue}`
          : 'Натисніть на час або заряд';
    return html`<ha-card
        ><div class="content">
          <header>
            <ha-icon icon="mdi:battery-clock" aria-hidden="true"></ha-icon>
            <h2>${this.config.title || 'Розклад батареї'}</h2>
          </header>
          <ol aria-label="Програми батареї">
            ${views.map((view, row) => {
              const pending = this.commands.pending.has(row);
              const error = this.commands.errors.get(row);
              return html`<li class=${view.issue ? 'unavailable' : ''} aria-busy=${String(pending)}>
                <span class="row-icon" aria-hidden="true"
                  >${pending ? html`<span class="spinner"></span>` : html`<ha-icon icon=${error ? 'mdi:alert-circle-outline' : 'mdi:clock-outline'}></ha-icon>`}</span
                >
                <button
                  class="interval"
                  aria-label=${`Програма ${row + 1}: ${displayTime(view.start)} — ${displayTime(view.end)}${view.nextDay ? ', наступного дня' : ''}. Змінити час початку.`}
                  aria-describedby=${`row-info-${row}`}
                  aria-disabled=${String(pending || !!view.issue)}
                  ?disabled=${!!view.issue}
                  @click=${(event: Event) => this.openEditor(row, 'time', event)}
                >
                  <span>${displayTime(view.start)}</span><span class="dash">—</span
                  ><span class="end">${displayTime(view.end)}</span>
                </button>
                <button
                  class="soc"
                  aria-label=${`Програма ${row + 1}: заряд ${view.soc ?? 'невідомий'}%. Змінити заряд.`}
                  aria-describedby=${`row-info-${row}`}
                  aria-disabled=${String(pending || !!view.issue)}
                  ?disabled=${!!view.issue}
                  @click=${(event: Event) => this.openEditor(row, 'soc', event)}
                >
                  ${view.issue ? html`<span class="unavailable-label">Недоступно</span>` : html`${view.soc}<span class="unit">%</span>`}
                </button>
                <span id=${`row-info-${row}`} class="sr-only"
                  >${view.issue || error || (pending ? 'Очікуємо підтвердження' : view.endMissing ? 'Час наступної програми недоступний' : `Програма ${row + 1}`)}</span
                >
              </li>`;
            })}
          </ol>
          <p class="feedback ${errorEntry ? 'error' : ''}" role=${errorEntry ? 'alert' : 'status'} aria-live="polite">
            ${footer}
          </p>
        </div></ha-card
      >${this.renderEditor()}`;
  }
  static styles = css`
    :host {
      display: block;
      min-width: 0;
      height: 100%;
      /* Hide browsing carets outside editable controls. */
      caret-color: transparent;
    }
    * {
      box-sizing: border-box;
    }
    ha-card {
      display: block;
      height: 100%;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color, #273536);
      border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #dde5e3));
      border-radius: var(--ha-card-border-radius, 16px);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .content {
      max-width: 460px;
      margin: 0 auto;
      padding: 18px 16px 10px;
      font-family: var(--ha-font-family, system-ui, sans-serif);
    }
    header {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 32px;
      margin: 0 4px 10px;
    }
    header ha-icon {
      color: var(--primary-color, #467c70);
      --mdc-icon-size: 22px;
      flex-shrink: 0;
    }
    h2 {
      margin: 0;
      font-size: 17px;
      line-height: 24px;
      font-weight: 500;
      overflow-wrap: anywhere;
    }
    ol {
      padding: 0;
      margin: 0;
      list-style: none;
    }
    li {
      display: grid;
      grid-template-columns: 20px minmax(0, 1fr) auto;
      align-items: center;
      gap: 4px;
      min-height: 44px;
      border-bottom: 1px solid var(--divider-color, #e5ebe9);
    }
    li:last-child {
      border-bottom: 0;
    }
    .row-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color, #7a8b88);
    }
    .row-icon ha-icon {
      --mdc-icon-size: 16px;
    }
    button,
    input {
      font: inherit;
      color: inherit;
    }
    button {
      cursor: pointer;
      border: 0;
      border-radius: 8px;
      background: transparent;
      min-height: 44px;
      padding: 8px;
      touch-action: manipulation;
      transition: background 0.12s;
    }
    button:hover {
      background: var(--secondary-background-color, #f1f5f3);
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--primary-color, #467c70);
      outline-offset: 2px;
    }
    button:disabled {
      cursor: default;
    }
    button[aria-disabled='true'] {
      cursor: default;
    }
    .interval {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      white-space: nowrap;
      font-size: 14px;
      font-variant-numeric: tabular-nums;
      padding-inline: 6px;
    }
    .dash,
    .end {
      color: var(--secondary-text-color, #667b76);
    }
    .soc {
      min-width: 66px;
      text-align: right;
      font-size: 16px;
      font-weight: 550;
      font-variant-numeric: tabular-nums;
    }
    .unit {
      margin-left: 4px;
      font-size: 12px;
      font-weight: 400;
      color: var(--secondary-text-color, #667b76);
    }
    .unavailable .interval,
    .unavailable .row-icon {
      opacity: 0.5;
    }
    .unavailable-label {
      font-size: 11px;
      font-weight: 400;
      color: var(--secondary-text-color, #667b76);
    }
    .feedback {
      height: 34px;
      overflow: auto;
      margin: 8px 4px 0;
      font-size: 11px;
      line-height: 16px;
      color: var(--secondary-text-color, #667b76);
    }
    .error,
    .dialog-error {
      color: var(--error-color, #ba4444);
    }
    .spinner {
      width: 13px;
      height: 13px;
      border: 1.5px solid var(--divider-color, #d7e3df);
      border-top-color: var(--primary-color, #467c70);
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    dialog {
      width: 320px;
      max-width: calc(100vw - 32px);
      max-height: calc(100dvh - 32px);
      overflow: auto;
      border: 1px solid var(--divider-color, #dde5e3);
      border-radius: 18px;
      padding: 20px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #273536);
      font-family: var(--ha-font-family, system-ui, sans-serif);
      box-shadow: 0 12px 40px #0002;
    }
    dialog::backdrop {
      background: #0006;
    }
    .dialog-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    h3 {
      font-size: 17px;
      font-weight: 500;
      margin: 0;
    }
    .close {
      font-size: 24px;
      width: 44px;
      margin: -10px -10px -10px 0;
    }
    .dialog-subtitle,
    .limits {
      font-size: 12px;
      line-height: 18px;
      color: var(--secondary-text-color, #667b76);
    }
    .dialog-subtitle {
      margin: 6px 0 20px;
    }
    input {
      min-width: 0;
      caret-color: auto;
      border: 1px solid var(--divider-color, #d9e3df);
      background: var(--secondary-background-color, #f3f6f5);
      border-radius: 8px;
      padding: 10px;
      min-height: 44px;
    }
    .time-input {
      width: 100%;
      caret-color: transparent;
      font-size: 22px;
      text-align: center;
      color-scheme: var(--deye-color-scheme, normal);
    }
    .time-input::-webkit-datetime-edit {
      caret-color: transparent;
    }
    .time-input::-webkit-datetime-edit-hour-field,
    .time-input::-webkit-datetime-edit-minute-field,
    .time-input::-webkit-datetime-edit-second-field,
    .time-input::-webkit-datetime-edit-ampm-field {
      caret-color: auto;
    }
    .time-input::-webkit-calendar-picker-indicator {
      caret-color: transparent;
      cursor: pointer;
      user-select: none;
    }
    .stepper {
      display: grid;
      grid-template-columns: 44px minmax(0, 1fr) 44px;
      gap: 12px;
      align-items: center;
    }
    .stepper > button {
      font-size: 26px;
      background: var(--secondary-background-color, #f3f6f5);
    }
    .stepper > button:disabled {
      opacity: 0.35;
    }
    .number-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 22px;
    }
    .number-wrap input {
      width: 100%;
      text-align: center;
      padding: 8px 2px;
      appearance: textfield;
      -moz-appearance: textfield;
    }
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      caret-color: transparent;
    }
    .limits {
      margin: 10px 0 0;
    }
    .dialog-error {
      min-height: 36px;
      font-size: 12px;
      line-height: 18px;
      margin: 10px 0;
    }
    .actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    .save {
      background: var(--primary-color, #467c70);
      color: var(--text-primary-color, #fff);
      padding-inline: 16px;
    }
    .save:hover {
      filter: brightness(0.94);
      background: var(--primary-color, #467c70);
    }
    @media (max-width: 360px) {
      .content {
        padding-inline: 10px;
      }
      .interval {
        gap: 4px;
        font-size: 13px;
      }
      .soc {
        min-width: 55px;
        padding-inline: 5px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
      }
    }
  `;
}
window.customCards ??= [];
window.customCards.push({
  type: 'deye-battery-schedule-card',
  name: 'Розклад батареї Deye',
  description: 'Шість програм: час і рівень заряду батареї',
  preview: true,
  documentationURL: 'https://github.com/Zoreslaw/deye-battery-schedule-card',
});
