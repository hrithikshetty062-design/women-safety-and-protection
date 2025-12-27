
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  MAPS = 'MAPS',
  VOICE_COMPANION = 'VOICE_COMPANION',
  SOS = 'SOS',
  EDUCATION = 'EDUCATION'
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export interface SafetyAlert {
  id: string;
  type: 'CRIME' | 'HAZARD' | 'NOTICE';
  title: string;
  description: string;
  timestamp: Date;
  location?: string;
}

export interface GroundingLink {
  uri: string;
  title: string;
}
