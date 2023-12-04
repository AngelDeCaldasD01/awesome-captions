import { formatTranscriptionItem } from '@/libs/TranscriptionHelpers';
import { Timestamp } from '@/models/Timestamp';
import {
  AudioConfig,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';

export async function POST(req: any) {
  try {
    const formData = await req.formData();

    const file = formData.get('resultTranscode');

    const dataFile = await file.arrayBuffer();
    const buffer = Buffer.from(dataFile);

    const speechConfig = SpeechConfig.fromSubscription(
      `${process.env.SPEECH_KEY}`,
      `${process.env.SPEECH_ZONE}`,
    );
    speechConfig.speechRecognitionLanguage = 'es-ES';

    const audioConfig = AudioConfig.fromWavFileInput(buffer);
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

    const fileRecognized = await new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync((result) => {
        if (result.reason === ResultReason.RecognizedSpeech) {
          const wordsWithTimestamps: Timestamp[] =
            formatTranscriptionItem(result);
          resolve(wordsWithTimestamps);
        } else {
          reject('The speech was not recognized');
        }
      });
    });
    return Response.json({ fileRecognized });
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.error();
  }
}
