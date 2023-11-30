import {
  AudioConfig,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import { BlobServiceClient } from '@azure/storage-blob';

// const blobServiceClient = new BlobServiceClient(
//   `https://${process.env.ACCOUNT_STORAGE_NAME}.blob.core.windows.net?${process.env.SAS_TOKEN}`,
// );
// const containerClient = blobServiceClient.getContainerClient(
//   'awesomecaptionscontainer',
// );

const speechConfig = SpeechConfig.fromSubscription(
  'ae9c47559da84efaa85869e8b0d8a68e',
  'eastus',
);
speechConfig.speechRecognitionLanguage = 'es-ES';

async function descargarArchivoDesdeBlobStorage(nombreArchivo: any) {
  const blobServiceClient = new BlobServiceClient(
    `BlobEndpoint=https://awesomecaptions.blob.core.windows.net/;QueueEndpoint=https://awesomecaptions.queue.core.windows.net/;FileEndpoint=https://awesomecaptions.file.core.windows.net/;TableEndpoint=https://awesomecaptions.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-11-09T01:59:00Z&st=2023-11-08T17:59:00Z&spr=https&sig=qivAHrWZgA%2BZtcaou0OIbEsHaYENka%2FMLDcPygFv62g%3D`,
  );

  const containerClient =
    blobServiceClient.getContainerClient('awesomecaptions');
  const blobClient = containerClient.getBlobClient(nombreArchivo);

  return blobClient;
}
async function transcribeAudio(file: any) {
  console.log(speechConfig);
  console.log(file);
  const audioConfig = AudioConfig.fromWavFileInput(file);
  const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
  speechConfig.speechRecognitionLanguage = 'es-ES';

  recognizer.recognizeOnceAsync((result) => {
    if (result.reason === ResultReason.RecognizedSpeech) {
      const resultText = result.text;

      const palabras = resultText.split(' ');

      const duracionTotal = result.duration / 10000000;

      const palabrasConMarcasDeTiempo = palabras.map((palabra, index) => {
        const inicio = (index / palabras.length) * duracionTotal;
        const fin = ((index + 1) / palabras.length) * duracionTotal;

        return {
          palabra,
          inicio,
          fin,
        };
      });

      console.log(palabrasConMarcasDeTiempo);
    } else {
      console.error(`Error de transcripción: ${result.reason}`);
    }
  });
}

export async function transcribeFileFromBlobStorage(file: any) {
  // const fileBuffer = await descargarArchivoDesdeBlobStorage(file);

  await transcribeAudio(file);
}
