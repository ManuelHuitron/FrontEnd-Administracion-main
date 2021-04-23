import { Taller } from '../../models/taller.model';

export interface CargarTaller {
    total: number;
    resultados: Taller[];
}

export interface BorrarTaller{
    uid: string;
}

export interface ActualizarTaller{
    uid: string;
}

export interface CargaTallerById{    
    uid: any;
    taller: Taller[];
}
