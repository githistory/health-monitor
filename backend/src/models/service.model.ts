export interface Service {
  id: string;
  name: string;
  url: string;
  status: 'UP' | 'DOWN';
}

export class CreateServiceDto {
  name: string;
  url: string;
} 