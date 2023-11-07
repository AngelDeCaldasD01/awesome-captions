import { BlobServiceClient } from '@azure/storage-blob';
import {
  AudioConfig,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';

export async function GET(req: any) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const filename = searchParams.get('filename');

  console.log(searchParams);
  // if (filename) transcribirArchivoDeBlobStorage(filename);

  return Response.json('ok');
}
