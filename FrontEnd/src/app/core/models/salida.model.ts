import { Miembro } from './miembro.model';

export interface Salida {
  id: string;
  titulo: string;
  codigo: string;
  fecha_creacion: Date;
  miembros: Miembro[];
}
