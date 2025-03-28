export interface Service {
  id: string;
  name: string;
  url: string;
  status: 'UP' | 'DOWN';
  history: UptimeRecord[];
}

export interface UptimeRecord {
  timestamp: Date;
  status: 'UP' | 'DOWN';
} 