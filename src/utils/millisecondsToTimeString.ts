export const millisecondsToTimeString = (duration: number, showMilliseconds: boolean = true): string => {
    const milliseconds = (duration || 0) % 1000;
    const seconds = Math.floor(((duration || 0) / 1000) % 60);
    const minutes = Math.floor(((duration || 0) / (1000 * 60)) % 60);
    const hours = Math.floor(((duration || 0) / (1000 * 60 * 60)) % 24);

    const hoursStr = hours < 10 ? '0' + hours : hours;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const secondsStr = seconds < 10 ? '0' + seconds : seconds;
    let millisecondsStr = milliseconds + '';
    if (milliseconds < 10) millisecondsStr = '00' + milliseconds;
    if (milliseconds < 100 && milliseconds >= 10) millisecondsStr = '0' + milliseconds;

    return (
        (hours > 0 ? hoursStr + ':' : '') +
        minutesStr +
        ':' +
        secondsStr +
        (showMilliseconds ? ':' + millisecondsStr : '')
    );
};
