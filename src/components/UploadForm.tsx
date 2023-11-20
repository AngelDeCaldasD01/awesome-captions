'use client';
import { useRef, useState } from 'react';
import UploadUpIcon from './icons/UploadUpIcon';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoadingIcon from './icons/LoadingIcon';
import { transcribeFileFromBlobStorage } from '@/hooks/SpeechRecognizerService';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { transcode } from '@/hooks/Transcode';

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const randomUUID = crypto.randomUUID();
  const router = useRouter();

  // // probar de ejecutar esto en servidor
  // const ffmpegRef = useRef(new FFmpeg());

  // const transcode = async (url: string) => {
  //   if (!selectedFile) {
  //     alert('Selecciona un archivo MP4 primero.');
  //     return;
  //   }

  //   const ffmpeg = ffmpegRef.current;
  //   const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';

  //   if (!ffmpeg.loaded) {
  //     await ffmpeg.load({
  //       coreURL: await toBlobURL(
  //         `${baseURL}/ffmpeg-core.js`,
  //         'text/javascript',
  //       ),
  //       wasmURL: await toBlobURL(
  //         `${baseURL}/ffmpeg-core.wasm`,
  //         'application/wasm',
  //       ),
  //     });
  //   }

  //   await ffmpeg.writeFile(selectedFile.name, await fetchFile(url));

  //   await ffmpeg.exec([
  //     '-i',
  //     selectedFile.name,
  //     '-ac',
  //     '1',
  //     '-ar',
  //     '16000',
  //     'output.wav',
  //   ]);
  //   const data = await ffmpeg.readFile('output.wav');

  //   return data;
  // };
  async function handleUpload(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (selectedFile) {
      setIsUploading(true);

      const result = await axios.postForm('/api/upload', { selectedFile });

      setIsUploading(false);

      // router.push(`/${selectedFile.name}`);

      // await axios
      //   .postForm(`/api/transcribe?filename=${selectedFile.name}`, {
      //     selectedFile,
      //   })
      //   .then(() => {
      //     router.push(`/${selectedFile.name}`);
      //   });
      // transcribeFileFromBlobStorage(result2).then(() => {
      router.push(`/${selectedFile.name}`);
      // });
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const typeSplit = e.target.files[0].name.split('.')[1];
      const modifiedFile = new File(
        [e.target.files[0]],
        `${randomUUID}.${typeSplit}`,
      );
      if (typeSplit !== 'mp4') return alert('Selecciona un archivo mp4 válido');
      setSelectedFile(modifiedFile);
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
