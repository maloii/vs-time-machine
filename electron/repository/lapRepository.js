const { db } = require('./repository');
const _ = require('lodash');

const lapsFindByGroupId = (groupId) => {
    return db.lap.find({ groupId });
};

const lapsFindByRoundId = (roundId) => {
    return db.lap.find({ roundId });
};

const lapsFindByRoundIds = (roundIds) => {
    return db.lap.find({ roundId: { $in: roundIds } });
};

const lapsFindByMemberGroupId = (memberGroupId, groupId) => {
    return db.lap.find({ memberGroupId, groupId });
};

const lapInsert = (lap) => {
    return db.lap.insert(lap);
};

const lapUpdate = async (_id, lap) => {
    let count = await db.lap.update(
        { _id },
        {
            $set: {
                ...lap
            }
        }
    );
    count += reCalculateLapsForMember(_id);
    return count;
};

const reCalculateLapsForMember = async (_id) => {
    let count = 0;
    const repLap = await db.lap.findOne({ _id });
    const round = await db.round.findOne({ _id: repLap?.roundId });
    const group = await db.group.findOne({ _id: repLap?.groupId });
    const laps = _.sortBy(await db.lap.find({ groupId: repLap?.groupId, memberGroupId: repLap?.memberGroupId }), [
        'millisecond'
    ]);
    if (round && group && laps.length > 0) {
        let beforeTime;
        if (round.typeStartRace === 'START_AFTER_SIGNAL') {
            beforeTime = group.timeStart;
        } else {
            beforeTime = _.find(laps, ['typeLap', 'START'])?.millisecond;
        }
        if (beforeTime) {
            for (const lap of laps.filter((lap) => lap.typeLap === 'OK')) {
                lap.timeLap = lap.millisecond - beforeTime;
                beforeTime = lap.millisecond;
                count += await db.lap.update({ _id: lap._id }, { $set: { timeLap: lap.timeLap } });
            }
            let beforeTimePitBegin = undefined;
            for (const lap of laps.filter((lap) => ['PIT_STOP_BEGIN', 'PIT_STOP_END', 'OK'].includes(lap.typeLap))) {
                if (lap.typeLap === 'PIT_STOP_END' && beforeTimePitBegin) {
                    lap.timeLap = lap.millisecond - beforeTimePitBegin;
                    count += await db.lap.update({ _id: lap._id }, { $set: { timeLap: lap.timeLap } });
                }
                if (lap.typeLap === 'PIT_STOP_BEGIN') {
                    beforeTimePitBegin = lap.millisecond;
                } else {
                    beforeTimePitBegin = undefined;
                }
            }
        }
    }
    return count;
};

const lapDelete = (_id) => {
    return db.lap.remove({ _id }, {});
};

const lapDeleteByGroupId = (groupId) => {
    return db.lap.remove({ groupId }, { multi: true });
};

module.exports = {
    lapsFindByGroupId,
    lapsFindByRoundId,
    lapsFindByRoundIds,
    lapsFindByMemberGroupId,
    lapInsert,
    lapUpdate,
    lapDelete,
    lapDeleteByGroupId,
    reCalculateLapsForMember
};
