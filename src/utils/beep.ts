const blob = new Blob(
    [
        `
        class Processor extends AudioWorkletProcessor {
            constructor() {
                super();
            }
        
            process(inputs, outputs) {
                const input = inputs[0];
                const output = outputs[0];
        
                for (let channel = 0; channel < output.length; ++channel) {
                    if (output[channel] && input[channel]) {
                        output[channel].set(input[channel]);
                    }
                }
        
                return true;
            }
        }
        
        registerProcessor('my-audio-processor', Processor);
    `
    ],
    { type: 'application/javascript' }
);
const url = URL.createObjectURL(blob);

// @ts-ignore
const audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext)();

//All arguments are optional:

//duration of the tone in milliseconds. Default is 500
//frequency of the tone in hertz. default is 440
//volume of the tone. Default is 1, off is 0.
//type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
//callback to use on end of tone
export const beep = async (
    duration: number,
    frequency: number,
    volume: number,
    type: OscillatorType,
    callback?: () => {}
): Promise<void> => {
    await audioCtx.audioWorklet.addModule(url);
    const oscillator = new OscillatorNode(audioCtx);
    const gainNode = new AudioWorkletNode(audioCtx, 'my-audio-processor');

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (frequency) {
        oscillator.frequency.value = frequency;
    }
    if (type) {
        oscillator.type = type;
    }
    if (callback) {
        oscillator.onended = callback;
    }

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + (duration || 500) / 1000);
};
