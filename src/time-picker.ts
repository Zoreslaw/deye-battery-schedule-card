import flatpickr from 'flatpickr';
import { css } from 'lit';
import type { Instance } from 'flatpickr/dist/types/instance';

export function createTimePicker(
  input: HTMLInputElement,
  container: HTMLElement,
  value: string,
  onValue: (value: string) => void,
): Instance {
  const picker = flatpickr(input, {
    enableTime: true,
    noCalendar: true,
    time_24hr: true,
    enableSeconds: !value.endsWith(':00'),
    dateFormat: 'H:i:S',
    defaultDate: value,
    minuteIncrement: 1,
    inline: true,
    disableMobile: true,
    clickOpens: false,
    appendTo: container,
    onValueUpdate: (_dates, text) => onValue(text),
  });
  // Flatpickr supplies the time arithmetic; expose its controls as native buttons.
  const fields = [picker.hourElement, picker.minuteElement, picker.secondElement];
  const labels = ['Години', 'Хвилини', 'Секунди'];
  fields.forEach((field, index) => {
    if (!field) return;
    field.tabIndex = 0;
    field.setAttribute('aria-label', labels[index]);
    field.setAttribute('inputmode', 'numeric');
    const wrapper = field.parentElement!;
    const label = document.createElement('span');
    label.className = 'time-part-label';
    label.textContent = labels[index];
    // Flatpickr locates the input through wrapper.firstChild.
    wrapper.append(label);
    for (const [className, text, action] of [
      ['arrowUp', '+', 'Збільшити'],
      ['arrowDown', '−', 'Зменшити'],
    ]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = className;
      button.textContent = text;
      button.setAttribute('aria-label', `${action}: ${labels[index].toLowerCase()}`);
      wrapper.querySelector(`.${className}`)?.replaceWith(button);
    }
  });
  return picker;
}

export const timePickerStyles = css`
  .flatpickr-calendar {
    width: 100%;
    caret-color: transparent;
  }
  .flatpickr-time {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .numInputWrapper {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    flex: 1;
    min-width: 0;
    gap: 4px;
  }
  .time-part-label {
    grid-row: 1;
    text-align: center;
    font-size: 12px;
    color: var(--secondary-text-color, #667b76);
  }
  .numInputWrapper input {
    grid-row: 3;
    width: 100%;
    text-align: center;
    font-size: 24px;
    font-variant-numeric: tabular-nums;
    appearance: textfield;
  }
  .numInputWrapper .arrowUp {
    grid-row: 2;
  }
  .numInputWrapper .arrowDown {
    grid-row: 4;
  }
  .numInputWrapper button {
    background: var(--secondary-background-color, #f3f6f5);
    font-size: 22px;
    user-select: none;
  }
  .flatpickr-time-separator {
    font-size: 24px;
    margin-top: 20px;
    user-select: none;
  }
`;
