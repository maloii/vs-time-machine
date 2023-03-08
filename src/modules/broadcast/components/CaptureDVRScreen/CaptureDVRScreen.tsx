import React, { FC, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { story } from '@/story/story';

import styles from './styles.module.scss';

export const CaptureDVRScreen: FC = observer(() => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        autorun(() => {
            if (story?.competition?.captureDeviceId) {
                // @ts-ignore
                window.navigator.getUserMedia(
                    {
                        video: {
                            width: 1280,
                            height: 720,
                            deviceId: story?.competition?.captureDeviceId
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
            }
        });
    }, []);

    return <video ref={videoRef} className={styles.video} autoPlay />;
});
