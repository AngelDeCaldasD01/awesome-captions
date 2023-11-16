'use client';
import { transcribirArchivoDeBlobStorage } from '@/hooks/SpeechRecognizerService';
import axios from 'axios';
import { useEffect } from 'react';

export default function FilePage({ params }: any) {
  const filename = params.filename;

  // useEffect(() => {
  //   axios.get(`/api/transcribe?filename=${filename}`);
  //   transcribirArchivoDeBlobStorage(filename);
  // }, [filename]);

  return (
    <div>
      <span>Esta es la pagina del nombre del archivo</span>
      <span>{params.filename.toString()}</span>
    </div>
  );
}
