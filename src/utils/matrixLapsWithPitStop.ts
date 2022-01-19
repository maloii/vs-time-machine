import { ILap } from '@/types/ILap';
import { TypeLap } from '@/types/TypeLap';

export const matrixLapsWithPitStop = (lapsByGroup: Record<string, ILap[]>): Record<string, (undefined | ILap)[]> => {
    const matrix: Record<string, (undefined | ILap)[]> = {};
    const cursor: Record<string, number> = Object.keys(lapsByGroup).reduce((res, item) => ({ ...res, [item]: 0 }), {});
    let loop = true;
    while (loop) {
        const isLap = Object.keys(lapsByGroup).reduce(
            (res, item) =>
                res && (!lapsByGroup[item]?.[cursor[item]] || lapsByGroup[item]?.[cursor[item]].typeLap === TypeLap.OK),
            true
        );

        Object.keys(lapsByGroup).forEach((id) => {
            const rows = matrix[id] || [];
            const lap = lapsByGroup[id]?.[cursor[id]];
            if (lap && ((isLap && lap.typeLap === TypeLap.OK) || (!isLap && lap.typeLap !== TypeLap.OK))) {
                rows.push(lap);
                cursor[id] = cursor[id] + 1;
            } else {
                rows.push(undefined);
            }
            matrix[id] = rows;
        });
        loop = !Object.keys(lapsByGroup).reduce((res, item) => res && !lapsByGroup[item]?.[cursor[item]], true);
    }

    return matrix;
};
