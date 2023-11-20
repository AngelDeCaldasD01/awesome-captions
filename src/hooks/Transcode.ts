import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { useRef } from 'react';

// probar de ejecutar esto en servidor
const ffmpegRef = useRef(new FFmpeg());

export const transcode = async (file: any) => {
  const ffmpeg = ffmpegRef.current;
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';

  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm',
      ),
    });
  }

  await ffmpeg.writeFile(file.name, await fetchFile(file.url));

  await ffmpeg.exec([
    '-i',
    file.name,
    '-ac',
    '1',
    '-ar',
    '16000',
    'output.wav',
  ]);
  const data = await ffmpeg.readFile('output.wav');

  return data;
};
