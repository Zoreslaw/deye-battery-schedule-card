export interface ProgramConfig {
  time: string;
  soc: string;
}
export interface ScheduleConfig {
  type: string;
  title?: string;
  programs: ProgramConfig[];
}
export interface HassEntity {
  state: string;
  attributes: { friendly_name?: string; min?: number; max?: number; step?: number; unit_of_measurement?: string };
}
export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  callService(
    domain: string,
    service: string,
    data: { entity_id: string; time?: string; value?: number },
  ): Promise<unknown>;
}
export type Field = 'time' | 'soc';
export interface SocLimits {
  min: number;
  max: number;
  step: number;
  anchor: number;
}
export interface ProgramView {
  start?: string;
  end?: string;
  soc?: number;
  limits?: SocLimits;
  issue: string;
  endMissing: boolean;
  nextDay: boolean;
}
declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}
