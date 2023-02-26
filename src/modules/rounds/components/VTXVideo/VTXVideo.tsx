import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { Button, MenuItem, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { story } from '@/story/story';

import { showFileInFolderAction } from '@/actions/actionCaptureRequest';
import { lapInsertAction } from '@/actions/actionLapRequest';

import { IGroup } from '@/types/IGroup';
import { IRound } from '@/types/IRound';
import { TypeLap } from '@/types/TypeLap';

import { sportsmanName } from '@/utils/sportsmanName';

import styles from './styles.module.scss';

interface IProps {
    round: IRound;
    group: IGroup;
    currentTime?: number;
}

export const VtxVideo: FC<IProps> = ({ round, group, currentTime }: IProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [memberGroupId, setMemberGroupId] = useState<string>();

    const handleToStart = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = ((group?.timeStart || 0) - (group?.timeReady || 0)) / 1000;
        }
    }, [group?.timeReady, group?.timeStart]);

    const handleToStop = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = ((group?.timeStop || 0) - (group?.timeReady || 0)) / 1000;
        }
    }, [group?.timeReady, group?.timeStop]);

    const handleChangeMembersGroup = useCallback((event) => {
        setMemberGroupId(event.target.value);
    }, []);

    const handleAddLap = useCallback(() => {
        if (videoRef.current && memberGroupId && window.confirm('Are you sure you want to add a lap?')) {
            const sportsman = _.find(group.sportsmen, ['_id', memberGroupId]);
            const team = _.find(group.teams, ['_id', memberGroupId]);

            const sportsmanId = (sportsman ? sportsman?.sportsman?._id : team?.team?.sportsmenIds?.[0]) || '';
            const millisecond =
                (group?.timeStart || 0) +
                (Math.ceil(videoRef.current.currentTime * 1000) - ((group?.timeStart || 0) - (group?.timeReady || 0)));
            const newLap = {
                typeLap: TypeLap.OK,
                timeLap: 0,
                gateId: 'video',
                millisecond,
                competitionId: story?.competition?._id!,
                roundId: round._id,
                groupId: group._id,
                memberGroupId,
                sportsmanId,
                transponder: 'missing'
            };
            lapInsertAction(newLap);
        }
    }, [group._id, group.sportsmen, group.teams, group?.timeReady, group?.timeStart, memberGroupId, round._id]);

    const handleShowFileInFolder = useCallback(() => {
        showFileInFolderAction(group.videoSrc!);
    }, [group.videoSrc]);

    useEffect(() => {
        if (videoRef.current && currentTime !== undefined) {
            videoRef.current.currentTime = currentTime;
        }
    }, [currentTime]);

    if (!group.videoSrc) {
        return null;
    }

    return (
        <div className={styles.root}>
            <div className={styles.actions}>
                <Button color="primary" onClick={handleToStart}>
                    TO START
                </Button>
                <Button color="primary" onClick={handleToStop}>
                    TO FINISH
                </Button>
                <Button color="primary" onClick={handleShowFileInFolder}>
                    OPEN FILE
                </Button>
                <div style={{ flex: 1 }} />
                <TextField
                    select
                    className={styles.selectMembersGroup}
                    value={memberGroupId}
                    onChange={handleChangeMembersGroup}
                    label="Member group"
                    size="small"
                >
                    {[...group.sportsmen, ...group.teams].map((member) => (
                        <MenuItem key={member._id} value={member._id}>
                            {member.sportsman ? sportsmanName(member.sportsman) : member.team?.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleAddLap} disabled={!memberGroupId}>
                    ADD LAP
                </Button>
            </div>
            <video ref={videoRef} id="player" controls style={{ height: '100%', width: '100%' }}>
                <source src={`file://${group.videoSrc}`} type="video/webm" />
            </video>
        </div>
    );
};
