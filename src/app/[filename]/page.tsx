'use client';
import ResultVideo from '@/components/ResultVideo';
import TranscriptionEditor from '@/components/TranscriptionEditor';
import { transcode } from '@/libs/TranscodeHelpers';
import { Timestamp } from '@/models/Timestamp';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export default function FilePage({ params }: any) {
  const filename: string = params.filename;
  const [transcriptionData, setTranscriptionData] = useState<Timestamp[]>([]);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(true);
  const ffmpegRef = useRef(new FFmpeg());

  useEffect(() => {
    if (filename) call();
  }, []);

  const call = async () => {
    // Download file (mp4)
    const resultDownload = await axios.get(
      `/api/download?filename=${filename}`,
    );

    // Convert Blob to File (mp4)
    const blob = new Blob([resultDownload.data.file.data]);
    const file = new File([blob], filename);

    // Transcode file (mp4 to wav)
    const resultTranscode = await transcode(
      file,
      ffmpegRef,
      resultDownload.data.url,
    );

    // Transcribe file (wav)
    const result = await axios.postForm('/api/transcribe', { resultTranscode });

    setTranscriptionData(result.data.fileRecognized as Timestamp[]);
    setIsTranscribing(false);
  };

  return (
    <div>
      <div className='grid grid-cols-2 gap-16'>
        <div className=''>
          <h2 className='text-2xl mb-4 text-white/60'>Transcription</h2>
          <TranscriptionEditor
            transcriptionData={transcriptionData}
            setTranscriptionData={setTranscriptionData}
          />
        </div>
        <div>
          <h2 className='text-2xl mb-4 text-white/60'>Result</h2>
          <ResultVideo
            filename={filename}
            transcriptionData={transcriptionData}
          />
        </div>
      </div>
    </div>
  );
}
