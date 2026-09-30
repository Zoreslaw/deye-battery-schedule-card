# Project instructions

- This is the standalone deye-battery-schedule-card project.
- Use strict TypeScript, Lit, Rollup and Home Assistant theme variables.
- Default UI and editor text must be Ukrainian; documentation and comments must be English.
- Configure exactly six programs, each with a time.* and number.* entity. Never guess device IDs.
- Render one compact ha-card. Edit drafts in an accessible dialog; confirmed values come only from hass.states.
- Use time.set_value and number.set_value. Block duplicate commands per program and bound confirmation waits.
- Keep unavailable programs isolated; preserve configured order and derive each end from the next start.
- Support Sections, keyboard, touch, reduced motion and narrow screens without layout jumps.
- Keep logic separate from presentation. No direct inverter APIs or backend.
- Run npm install, npm run build, npm test and npm run test:browser for relevant changes.
