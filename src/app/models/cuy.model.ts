export interface Cuy {
  id?: string;
  numeroIdentificacion: string;
  nombre?: string;
  raza: RazaCuy;
  sexo: SexoCuy;
  fechaNacimiento: Date;
  peso: number;
  color: string;
  galpon: string;
  padre?: string; // ID del padre
  madre?: string; // ID de la madre
  origen: OrigenCuy;
  estadoSalud: EstadoSalud;
  observaciones?: string;
  fechaRegistro: Date;
  genealogia?: {
    generacion: number;
    pureza: number; // Porcentaje de pureza de la raza
  };
  produccion?: {
    camadas?: number;
    ultimaCamada?: Date;
    cantidadCrias?: number;
  };
  activo: boolean;
}

export enum RazaCuy {
  PERU = 'Perú',
  ANDINA = 'Andina',
  INTI = 'Inti',
  CRIOLLA = 'Criolla',
  MEJORADA = 'Mejorada'
}

export enum SexoCuy {
  MACHO = 'Macho',
  HEMBRA = 'Hembra'
}

export enum OrigenCuy {
  NACIMIENTO_PROPIO = 'Nacimiento Propio',
  ADQUISICION = 'Adquisición',
  DONACION = 'Donación',
  INTERCAMBIO = 'Intercambio'
}

export enum EstadoSalud {
  EXCELENTE = 'Excelente',
  BUENO = 'Bueno',
  REGULAR = 'Regular',
  ENFERMO = 'Enfermo',
  EN_TRATAMIENTO = 'En Tratamiento'
}

export interface Galpon {
  id?: string;
  nombre: string;
  capacidad: number;
  ubicacion: string;
  tipo: TipoGalpon;
  descripcion?: string;
  fechaCreacion: Date;
  activo: boolean;
}

export enum TipoGalpon {
  REPRODUCTORES = 'Reproductores',
  RECRIA = 'Recría',
  ENGORDE = 'Engorde',
  CUARENTENA = 'Cuarentena',
  MIXTO = 'Mixto'
}

export interface Usuario {
  uid: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: RolUsuario;
  fechaCreacion: Date;
  activo: boolean;
}

export enum RolUsuario {
  ADMIN = 'admin',
  TECNICO = 'tecnico',
  VISITANTE = 'visitante'
}

export interface Comentario {
  id?: string;
  texto: string;
  autorEmail: string;
  autorNombre: string;
  fecha: Date;
  activo: boolean;
  moderado?: boolean;
}

export interface ConfiguracionSistema {
  id?: string;
  permitirComentarios: boolean;
  moderarComentarios: boolean;
  fechaActualizacion: Date;
}
