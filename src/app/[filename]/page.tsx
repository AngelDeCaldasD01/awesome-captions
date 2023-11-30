'use client';
import { transcribeFileFromBlobStorage } from '@/hooks/SpeechRecognizerService';
import { transcode } from '@/hooks/Transcode';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export default function FilePage({ params }: any) {
  const filename = params.filename;
  const ffmpegRef = useRef(new FFmpeg());

  const [mp4, setMp4] = useState();

  useEffect(() => {
    if (filename) call();
  }, [filename]);

  const call = async () => {
    // Download file
    const resultDownload = await axios.get(
      `/api/download?filename=${filename}`,
    );
    console.log(resultDownload);

    // Convert Blob to File
    const blob = new Blob([resultDownload.data.file.data]);
    const file = new File([blob], filename);

    // Transcode file
    const resultTranscode = await transcode(
      file,
      ffmpegRef,
      resultDownload.data.url,
    );

    // const resultTranscodeBlob = new Blob([resultTranscode], {
    //   type: 'audio/wav',
    // });
    // const resultTranscodeFile = new File([resultTranscodeBlob], 'output.wav', {
    //   type: 'audio/wav',
    // });

    // Crea un objeto File a partir del Blob
    // const fileConverted = new File([blob], 'fichero.mp4');
    // Transcribe file
    // console.log(resultTranscodeFile);
    const result = await axios.postForm('/api/transcribe', { resultTranscode });
    console.log(result);
    // transcribeFileFromBlobStorage(resultTranscode);
    // console.log(resultTranscode);
    // setMp4(resultTranscode)
  };

  return (
    <div>
      <span>Esta es la pagina del nombre del archivo</span>
      <span>{params.filename.toString()}</span>
    </div>
  );
}
