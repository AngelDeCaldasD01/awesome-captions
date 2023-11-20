'use client';

import { connectionBlobFromFilename } from '@/hooks/ConnectionBlobFromFilename';
import { BlobServiceClient } from '@azure/storage-blob';
import axios from 'axios';
import { useEffect } from 'react';

export default function FilePage({ params }: any) {
  const filename = params.filename;
  console.log(filename);
  useEffect(() => {
    if (!filename) return;
    // connectionBlobFromFilename(filename);
    console.log(filename);
    call();
    // axios.get(`/api/transcribe?filename=${filename}`);
    // transcribirArchivoDeBlobStorage(filename);
  }, [filename]);

  const call = async () => {
    // Download file
    const file = await axios.get(`/api/download?filename=${filename}`);
    // Transcode file

    // Transcribe file

    console.log(file);
  };

  return (
    <div>
      <span>Esta es la pagina del nombre del archivo</span>
      <span>{params.filename.toString()}</span>
    </div>
  );
}
