'use client';
import { useState } from 'react';
import UploadUpIcon from './icons/UploadUpIcon';
import axios from 'axios';
import { BlobServiceClient } from '@azure/storage-blob';
import { useRouter } from 'next/navigation';
import {
  AudioConfig,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import LoadingIcon from './icons/LoadingIcon';

interface UploadFormProps {
  ACCOUNT_STORAGE_NAME: string | undefined;
  SAS_TOKEN: string | undefined;
  CONTAINER_NAME: string | undefined;
}

export default function UploadForm({
  ACCOUNT_STORAGE_NAME,
  SAS_TOKEN,
  CONTAINER_NAME,
}: UploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // const randomUUID = crypto.randomUUID();

  const router = useRouter();

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    'BlobEndpoint=https://awesomecaptions.blob.core.windows.net/;QueueEndpoint=https://awesomecaptions.queue.core.windows.net/;FileEndpoint=https://awesomecaptions.file.core.windows.net/;TableEndpoint=https://awesomecaptions.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-11-03T19:42:07Z&st=2023-11-03T11:42:07Z&spr=https&sig=m0zN5qMXJGP5nxonTyap3X75KJe31sW%2Bp8Ukn5GBlTE%3D',
  );
  const containerClient = blobServiceClient.getContainerClient(
    'awesomecaptionscontainer',
  );

  const speechConfig = SpeechConfig.fromSubscription(
    '66b27f1e78324b7c88651d26e565dc55',
    'eastus',
  );
  speechConfig.speechRecognitionLanguage = 'es-ES';

  async function descargarArchivoDesdeBlobStorage(nombreArchivo: any) {
    const blobClient = containerClient.getBlobClient(nombreArchivo);

    const fileUrl = blobClient.url;
    const fileName = 'prueba.mp4';

    // Crear un elemento <a> para el enlace
    const link = document.createElement('a');
    link.href = fileUrl;
    link.style.display = 'none';
    link.download = fileName;

    // Agregar el elemento <a> al cuerpo del documento
    document.body.appendChild(link);

    // Simular un clic en el enlace para iniciar la descarga
    link.click();

    // Eliminar el elemento <a> después de la descarga
    document.body.removeChild(link);
  }

  async function transcribirAudio(audioData: any) {
    const audioConfig = AudioConfig.fromWavFileInput(audioData);
    console.log(audioConfig);
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
    speechConfig.speechRecognitionLanguage = '';
    console.log(recognizer);

    recognizer.recognizeOnceAsync((result) => {
      if (result.reason === ResultReason.RecognizedSpeech) {
        const resultText = result.text;

        // Dividir la transcripción en palabras por espacios
        const palabras = resultText.split(' ');

        // Calcular marcas de tiempo
        const duracionTotal = result.duration / 10000000; // Duración total en segundos

        const palabrasConMarcasDeTiempo = palabras.map((palabra, index) => {
          const inicio = (index / palabras.length) * duracionTotal;
          const fin = ((index + 1) / palabras.length) * duracionTotal;

          return {
            palabra,
            inicio,
            fin,
          };
        });

        // Mostrar las marcas de tiempo
        palabrasConMarcasDeTiempo.forEach((palabraConMarcaDeTiempo) => {
          console.log(
            `Palabra: ${palabraConMarcaDeTiempo.palabra}, Inicio: ${palabraConMarcaDeTiempo.inicio} segundos, Fin: ${palabraConMarcaDeTiempo.fin} segundos`,
          );
        });
      } else {
        console.error(`Error de transcripción: ${result.reason}`);
      }
    });
  }

  async function transcribirArchivoDeBlobStorage(filename: any) {
    const audioData = await descargarArchivoDesdeBlobStorage(filename);
    // console.log('---------------------');
    // console.log(audioData);
    // console.log('---------------------');

    await transcribirAudio(filename);
  }

  async function handleUpload(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (selectedFile) {
      setIsUploading(true);

      const result = await axios.postForm('/api/upload', { selectedFile });

      console.log(result);

      setIsUploading(false);

      // transcribirArchivoDeBlobStorage(selectedFile).then(() => {
      //   router.push(`/${selectedFile.name}`);
      // });
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // const typeSplit = e.target.files[0].name.split('.')[1];
      // const modifiedFile = new File(
      //   [e.target.files[0]],
      //   `${randomUUID}.${typeSplit}`,
      // );
      // setSelectedFile(modifiedFile);

      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <>
      {isUploading && (
        <div className='bg-black/70 text-white fixed inset-0 flex flex-col place-content-center place-items-center'>
          <LoadingIcon />
          <h2>Uploading</h2>
          <h3>Please wait...</h3>
        </div>
      )}
      <label className='bg-green-600 py-2 px-6 rounded-full inline-flex gap-2 border-2 border-purple-700/50 cursor-pointer'>
        <UploadUpIcon />
        <span>Choose file</span>
        <input onChange={handleFileChange} type='file' className='hidden' />
      </label>
      <button onClick={handleUpload}>Upload</button>
    </>
  );
}
