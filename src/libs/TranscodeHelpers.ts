import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { MutableRefObject } from 'react';

export const transcode = async (file: any, ffmpegRef: MutableRefObject<FFmpeg>, url: string) => {
  const ffmpeg = ffmpegRef.current;
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';

  if (!ffmpeg.loaded) {
    ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  }

  await ffmpeg.writeFile(file.name, await fetchFile(url));

  await ffmpeg.exec(['-i', file.name, '-ac', '1', '-ar', '16000', 'output.wav']);
  const data = await ffmpeg.readFile('output.wav');

  const blob = new Blob([data], { type: 'audio/wav' });

  const wavFile = new File([blob], 'output.wav', { type: 'audio/wav' });

  return wavFile;
};
