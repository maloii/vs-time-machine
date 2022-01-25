const getTotalLapsTime = (round, group, laps, withoutCountLaps = false) => {
    const availableTypes = round.typeStartRace === 'START_AFTER_FIRST_GATE' ? ['OK', 'START'] : ['OK'];
    const lapsOk = (laps || []).filter((lap) => lap?.typeLap && availableTypes.includes(lap?.typeLap));
    const lastLap = lapsOk?.[lapsOk.length - 1];
    const firstLap = lapsOk?.[0];
    if (
        round.typeStartRace === 'START_AFTER_SIGNAL' &&
        round.typeRace === 'FIXED_COUNT_LAPS' &&
        group.timeStart &&
        lastLap?.timeLap &&
        (withoutCountLaps ? true : lapsOk.length === Number(round.countLap))
    ) {
        return lastLap.millisecond - group.timeStart;
    } else if (
        round.typeStartRace === 'START_AFTER_FIRST_GATE' &&
        round.typeRace === 'FIXED_COUNT_LAPS' &&
        firstLap?.millisecond &&
        lastLap?.millisecond &&
        (withoutCountLaps ? true : lapsOk.length === Number(round.countLap) + 1)
    ) {
        return lastLap.millisecond - firstLap.millisecond;
    }
};

module.exports = { getTotalLapsTime };
