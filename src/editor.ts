import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, ScheduleConfig, Field } from './types';

@customElement('deye-battery-schedule-card-editor')
export class DeyeBatteryScheduleCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: ScheduleConfig;
  public setConfig(config: ScheduleConfig): void {
    this.config = {
      ...config,
      programs: Array.from({ length: 6 }, (_, index) => ({
        time: config.programs?.[index]?.time ?? '',
        soc: config.programs?.[index]?.soc ?? '',
      })),
    };
  }
  private changed(): void {
    this.dispatchEvent(
      new CustomEvent('config-changed', { detail: { config: this.config }, bubbles: true, composed: true }),
    );
  }
  private titleChanged(event: Event): void {
    if (!this.config) return;
    const title = (event.target as HTMLInputElement).value;
    this.config = { ...this.config, title };
    if (!title) delete this.config.title;
    this.changed();
  }
  private entityChanged(row: number, field: Field, event: Event): void {
    if (!this.config) return;
    const value = (event.target as HTMLSelectElement).value;
    this.config = {
      ...this.config,
      programs: this.config.programs.map((program, index) =>
        index === row ? { ...program, [field]: value } : program,
      ),
    };
    this.changed();
  }
  private select(row: number, field: Field) {
    const value = this.config?.programs[row][field] ?? '';
    const domain = field === 'time' ? 'time' : 'number';
    const ids = Object.keys(this.hass?.states ?? {})
      .filter((id) => id.startsWith(`${domain}.`))
      .sort();
    return html`<label
      >${field === 'time' ? 'Час початку' : 'Рівень заряду (SOC)'}<select
        data-row=${row}
        data-field=${field}
        .value=${value}
        @change=${(event: Event) => this.entityChanged(row, field, event)}
      >
        <option value="">Виберіть сутність</option>
        ${value && !ids.includes(value) ? html`<option value=${value} selected>${value} — недоступна</option>` : ''}
        ${ids.map((id) => html`<option value=${id} ?selected=${id === value}>${this.hass?.states[id]?.attributes.friendly_name || id} (${id})</option>`)}
      </select></label
    >`;
  }
  protected render() {
    if (!this.config) return html``;
    return html`<label
        >Назва (необов’язково)<input
          placeholder="Розклад батареї"
          .value=${this.config.title ?? ''}
          @input=${this.titleChanged}
      /></label>
      <p>Виберіть час і заряд для кожної програми в порядку інвертора.</p>
      ${this.config.programs.map(
        (_, row) =>
          html`<fieldset>
            <legend>Програма ${row + 1}</legend>
            ${this.select(row, 'time')}${this.select(row, 'soc')}
          </fieldset>`,
      )}`;
  }
  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color, #273536);
      font-family: var(--ha-font-family, system-ui, sans-serif);
    }
    label {
      display: block;
      font-size: 13px;
      min-width: 0;
    }
    p {
      color: var(--secondary-text-color, #667b76);
      font-size: 13px;
      line-height: 1.5;
    }
    input,
    select {
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      display: block;
      margin-top: 6px;
      padding: 10px;
      border: 1px solid var(--divider-color, #d7e3df);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      color: inherit;
      font: inherit;
      min-height: 44px;
    }
    input:focus-visible,
    select:focus-visible {
      outline: 2px solid var(--primary-color, #467c70);
      outline-offset: 2px;
    }
    fieldset {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 12px;
      margin: 16px 0;
      padding: 12px;
      border: 1px solid var(--divider-color, #d7e3df);
      border-radius: 10px;
      min-width: 0;
    }
    legend {
      padding: 0 6px;
      font-size: 13px;
    }
    @media (max-width: 500px) {
      fieldset {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `;
}
