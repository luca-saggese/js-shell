// Creates a mono-channeled PCM stream from the microphone and streams it to a
// socket.io server
// The stream is playable via: play -r 16000 -b 16 -e signed-integer *.raw

const { MicrophoneProcess, ClientAudioWorkerProcess, ClientGUIProcess, Component, components } = this;
const { IFrame, Window } = components;

const audioWorker = new ClientAudioWorkerProcess(process, (audioWorker) => {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js');

  const sttSocket = io(self.location.origin, {
    path: '/stt-socket'
  });

  /**
   * Takes float32Array buffer, converts it to S16 and emits it over STT
   * socket. 
   */
  const sttSend = (i16Array) => {
    // const audioBlob = audioWorker.float32ToPCM16AudioBlob(float32Array);
    const audioBlob =  new Blob([i16Array], {
      type: 'audio/pcm'
    });

    sttSocket.emit('audioBlob', audioBlob);
  };

  // Handle the received transcription
  sttSocket.on('transcription', (transcription) => {
    // console.debug('transcription data', transcription);

    const {message} = transcription;

    if (message) {
      const {result} = message;
      
      if (result) {
        const {hypotheses} = result;

        if (hypotheses) {
          const totalHypotheses = hypotheses.length;

          // console.debug('hypotheses', hypotheses);
          hypotheses.forEach((singleHypotheses, idx) => {
            console.debug(`hypotheses ${idx + 1} of ${totalHypotheses}`, singleHypotheses);
          });
        }
      }
    }
  });

  audioWorker.stdin.on('data', (float32Array) => {
    const f32Downsampled = audioWorker.downsampleL16(float32Array);
    const i16Array = audioWorker.float32ToInt16(f32Downsampled);
    const rms = audioWorker.getRMS(i16Array);
    const db = audioWorker.getDB(rms);

    sttSend(i16Array);
    // console.debug(i16);

    /*
    console.debug({
      db,
      rms
    });
    */

    audioWorker.stdctrl.write({
      ctrlName: 'vuLevel',
      ctrlData: db
    });
  });
}, {
  // inputSampleRate: 48000 // Should be overridden by passed options
});

const mic = new MicrophoneProcess(process,
  async (mic) => {
    try {
      await audioWorker.onceReady();

      const micOutputAudioFormat = await mic.fetchOutputAudioFormat();
      console.debug('mic output audio format', micOutputAudioFormat);

      const { sampleRate: micOutputSampleRate } = micOutputAudioFormat;

      // Set options in audio worker
      audioWorker.setOptions({
        inputSampleRate: micOutputSampleRate
      });

      mic.stdout.on('data', (float32Array) => {
        // Pass the buffer as a transfer object
        audioWorker.stdin.write(float32Array, [float32Array.buffer]);
      });

    } catch (exc) {
      throw exc;
    }
  },
  {
    outputAudioBufferSize: 256 * 4 * 8,
    outputDataType: 'Float32Array'
  }
);

const vuMeter = new ClientGUIProcess(process, (guiProcess) => {
  guiProcess.setContent(
    // TODO: Create AnalogVUMeterComponent in components directory, and use here
    // Dynamically set props for the VULevel, and internally send the postMessage
    // via the component
    class VUMeter extends Component {
      constructor(...args) {
        super(...args);

        this.setIFrame = this.setIFrame.bind(this);

        this._iFrame = null;
      }

      componentDidMount() {
        console.debug('IFRAME', this._iFrame);

        // TODO: Debug why this is not working inside of arrow functions in Babel
        const vuMeter = this;

        // TODO: Unbind on exit
        audioWorker.stdctrl.on('data', (data) => {
          const { ctrlName } = data;

          if (ctrlName === 'vuLevel') {
            const { ctrlData: vuLevel } = data;

            vuMeter._iFrame.postMessage({
              vuLevel
            });
          }
        });
      }

      setIFrame(iFrame) {
        this._iFrame = iFrame;
      }

      render() {
        return (
          <Window>
            <IFrame ref={this.setIFrame} src="/components/analog-vu-meter" />
          </Window>
        )
      }
    }
  );
});