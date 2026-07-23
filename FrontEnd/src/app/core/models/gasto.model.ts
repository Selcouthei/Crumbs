import { Participante } from './participante.model';

export type MetodoDivision = 'equitativo' | 'manual';

export interface Gasto {
  id: string;
  salida_id: string;
  nombre: string;
  descripcion: string;
  monto: number;
  fecha: Date;
  pagador_id: string;
  metodo_division: MetodoDivision;
  participantes: Participante[];
}
