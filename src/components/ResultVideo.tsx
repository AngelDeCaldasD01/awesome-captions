import { useEffect, useRef, useState } from 'react';
import SparklesIcon from '@/components/icons/SparklesIcon';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Timestamp } from '@/models/Timestamp';
import { formatTranscriptionItemsToSrt } from '@/libs/TranscriptionHelpers';
import { RobotoBold, RobotoRegular } from '@/fonts/FontImports';
import { toFFmpegColor } from '@/libs/FFmpegHelpers';
import Selector from './selector/Selector';
import languages from './languages.json';
interface ResultVideoProps {
  filename: string;
  transcriptionData: Timestamp[];
  videoUrl: string;
}

export default function ResultVideo({ filename, transcriptionData, videoUrl }: ResultVideoProps) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const ffmpegRef = useRef<FFmpeg>(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [primaryColour, setPrimaryColour] = useState<string>('#FFFFFF');
  const [outlineColour, setOutlineColour] = useState<string>('#000000');

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';
    const ffmpeg = ffmpegRef.current;

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    await ffmpeg.writeFile('/tmp/roboto.ttf', await fetchFile(RobotoRegular));
    await ffmpeg.writeFile('/tmp/roboto-bold.ttf', await fetchFile(RobotoBold));

    setLoaded(true);
  };

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;
    const srtTranscription = formatTranscriptionItemsToSrt(transcriptionData);

    await ffmpeg.writeFile(filename, await fetchFile(videoUrl));
    await ffmpeg.writeFile('subs.srt', srtTranscription);

    if (videoRef.current) videoRef.current.src = videoUrl;
    await new Promise((resolve) => {
      if (videoRef.current) videoRef.current.onloadedmetadata = resolve;
    });

    const duration = videoRef?.current?.duration;
    ffmpeg.on('log', ({ message }) => {
      const regexResult = /time=([0-9:.]+)/.exec(message);
      if (regexResult && regexResult?.[1] && duration) {
        const howMuchIsDone = regexResult?.[1];
        const [hours, minutes, seconds] = howMuchIsDone.split(':').map(parseFloat);
        const doneTotalSeconds = hours * 3600 + minutes * 60 + seconds;
        const videoProgress = doneTotalSeconds / duration;
        setProgress(videoProgress);
      }
    });

    await ffmpeg.exec([
      '-i',
      filename,
      '-preset',
      'ultrafast',
      //   '-to',
      //   '00:00:05',
      '-vf',
      `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto,FontSize=30,MarginV=100,PrimaryColour=${toFFmpegColor(
        primaryColour,
      )},OutlineColour=${toFFmpegColor(outlineColour)}'`,
      'output.mp4',
    ]);
    const data = await ffmpeg.readFile('output.mp4');
    if (videoRef.current) videoRef.current.src = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));
  };

  return (
    <div>
      <div className='mb-4'>
        <button onClick={transcode} className='bg-green-600 py-2 px-6 rounded-full inline-flex gap-2 border-2 border-purple-700/50 cursor-pointer'>
          <SparklesIcon />
          <span>Apply captions</span>
        </button>
      </div>
      <fieldset>
        <label>Primary colour</label>
        <input className='h-42px w-65px' type='color' value={primaryColour} onChange={(e) => setPrimaryColour(e.target.value)} />
        <br />
        <label>Outline colour</label>
        <input className='h-42px w-65px' type='color' value={outlineColour} onChange={(e) => setOutlineColour(e.target.value)} />
        <br />
        <label>Language video</label>
        <Selector name='language' options={languages} />
      </fieldset>
      <div className='rounded-xl overflow-hidden'>
        <video className='w-full' ref={videoRef} controls data-video={0} />
        {progress !== 100 && (
          <div style={{ position: 'relative', height: '4px', width: '100%', backgroundColor: '#000' }}>
            <div
              style={{
                position: 'absolute',
                height: '100%',
                width: `${progress * 100}%`,
                backgroundColor: 'rgba(0, 255, 0, 0.6)',
                transition: 'width 0.5s ease-in-out',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
