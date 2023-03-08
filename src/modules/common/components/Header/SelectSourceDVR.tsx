import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import uniqid from 'uniqid';
import { IconButton, MenuItem, TextField } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import { competitionUpdateAction } from '@/actions/actionCompetitionRequest';

import { story } from '@/story/story';

import styles from './styles.module.scss';

export const SelectSourceDVR: FC = observer(() => {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>();
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleStreamVideo = useCallback((deviceId: string) => {
        // @ts-ignore
        window.navigator.getUserMedia(
            {
                video: {
                    width: 1280,
                    height: 720,
                    deviceId: deviceId
                },
                audio: false
            },
            (localMediaStream: MediaStream) => {
                window.mediaStream = localMediaStream;
                if (videoRef.current) {
                    videoRef.current.srcObject = window.mediaStream;
                }
            },
            (error: any) => console.log(error)
        );
    }, []);

    const handleChangeDvrDevice = useCallback(
        async (event) => {
            if (!story?.competition) return;
            if (event.target.value) {
                const device = devices?.find((item) => item.deviceId === event.target.value);
                competitionUpdateAction(story?.competition?._id, { captureDeviceId: device!.deviceId });
                handleStreamVideo(device!.deviceId);
            } else {
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
                if (window.mediaStream) {
                    window.mediaStream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                }
                competitionUpdateAction(story.competition._id, { captureDeviceId: undefined });
                window.mediaStream = undefined;
            }
        },
        [devices, handleStreamVideo]
    );

    const handleUpdateDevices = useCallback(() => {
        navigator.mediaDevices.enumerateDevices().then((items) => {
            setDevices(items.filter((item) => item.kind === 'videoinput'));
        });
    }, []);

    useEffect(() => {
        handleUpdateDevices();
    }, [handleUpdateDevices]);

    useEffect(() => {
        autorun(() => {
            if (story?.competition?.captureDeviceId) {
                handleStreamVideo(story.competition.captureDeviceId);
            }
        });
    }, [handleStreamVideo]);

    return (
        <div className={styles.captureDvr}>
            <TextField
                className={styles.selectDevices}
                key={uniqid()}
                select
                fullWidth
                value={story?.competition?.captureDeviceId}
                onChange={handleChangeDvrDevice}
                label="Select source DVR"
                size="small"
                disabled={!devices?.length}
            >
                <MenuItem value={undefined}>Disable</MenuItem>
                {(devices || []).map((device) => (
                    <MenuItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                    </MenuItem>
                ))}
            </TextField>
            <IconButton onClick={handleUpdateDevices}>
                <RefreshIcon sx={{ fontSize: 16 }} />
            </IconButton>
            {Boolean(story?.competition?.captureDeviceId) && (
                <div className={styles.containerVideoPlayer}>
                    <video controls ref={videoRef} className={styles.videoPlayer} autoPlay />
                </div>
            )}
        </div>
    );
});
