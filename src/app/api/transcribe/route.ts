import {
  AudioConfig,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import { NextResponse } from 'next/server';

export async function POST(req: any) {
  try {
    const formData = await req.formData();

    const file = formData.get('resultTranscode');

    const dataFile = await file.arrayBuffer();
    const buffer = Buffer.from(dataFile);

    const speechConfig = SpeechConfig.fromSubscription(
      'ae9c47559da84efaa85869e8b0d8a68e',
      'eastus',
    );
    speechConfig.speechRecognitionLanguage = 'es-ES';

    const audioConfig = AudioConfig.fromWavFileInput(buffer);
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

    const c = await new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync((result) => {
        let palabrasConMarcasDeTiempo;
        if (result.reason === ResultReason.RecognizedSpeech) {
          const resultText = result.text;
          // Dividir la transcripción en palabras por espacios
          const palabras = resultText.split(' ');

          // Calcular marcas de tiempo
          const duracionTotal = result.duration / 10000000; // Duración total en segundos

          palabrasConMarcasDeTiempo = palabras.map((palabra, index) => {
            const inicio = (index / palabras.length) * duracionTotal;
            const fin = ((index + 1) / palabras.length) * duracionTotal;

            return {
              palabra,
              inicio,
              fin,
            };
          });

          resolve(palabrasConMarcasDeTiempo);
        } else {
          reject('No se reconoció el discurso');
        }
      });
    });
    return Response.json({ c });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return Response.error();
  }
}
