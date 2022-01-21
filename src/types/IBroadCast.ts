import { TypeChromaKey } from '@/types/TypeChromaKey';

export interface IBroadCast {
    _id: string;
    name: string;
    top: string;
    left: string;
    center: string;
    right: string;
    bottom: string;
    chromaKey: TypeChromaKey;
}
