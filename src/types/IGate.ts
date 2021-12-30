import { TypeGate } from '@/types/TypeGate';

export interface IGate {
    _id: string;
    type: TypeGate;
    number?: number;
    position: number;
    distance?: number;
    delay: number;
}
