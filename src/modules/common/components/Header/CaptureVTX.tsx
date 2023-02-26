import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { IconButton, MenuItem, TextField } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import { story } from '@/story/story';

import styles from './styles.module.scss';

export const CaptureVtx: FC = observer(() => {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>();
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleChangeVtxDevice = useCallback(
        async (event) => {
            if (event.target.value) {
                const device = devices?.find((item) => item.deviceId === event.target.value);
                story?.setVtxDevice(device);

                // @ts-ignore
                window.navigator.getUserMedia(
                    {
                        video: {
                            width: 1280,
                            height: 720,
                            deviceId: device!.deviceId
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
            } else {
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
                if (window.mediaStream) {
                    window.mediaStream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                }
                story?.setVtxDevice(undefined);
                window.mediaStream = undefined;
            }
        },
        [devices]
    );
    const handleUpdateDevices = useCallback(() => {
        navigator.mediaDevices.enumerateDevices().then((items) => {
            setDevices(items.filter((item) => item.kind === 'videoinput'));
        });
    }, []);

    useEffect(() => {
        handleUpdateDevices();
    }, [handleUpdateDevices]);

    return (
        <div className={styles.captureVtx}>
            <TextField
                className={styles.selectDevices}
                select
                fullWidth
                value={story?.vtxDevice?.deviceId}
                onChange={handleChangeVtxDevice}
                label="Device video"
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
            {Boolean(story.vtxDevice) && (
                <div className={styles.containerVideoPlayer}>
                    <video controls ref={videoRef} className={styles.videoPlayer} autoPlay />
                </div>
            )}
        </div>
    );
});
