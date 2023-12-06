import { Timestamp } from '@/models/Timestamp';

export const formatTranscriptionItems = (items: any) => {
  const resultText = items.text;

  const words = resultText.split(' ');
  const totalLength = items.duration / 10000000;

  const wordsWithTimestamps: Timestamp[] = words.map(
    (content: string, index: number) => {
      const start = Number((index / words.length) * totalLength);
      const end = Number(((index + 1) / words.length) * totalLength);

      return {
        start,
        end,
        content,
      };
    },
  );

  return wordsWithTimestamps;
};

const secondsToHHMMSSMS = (timeString: string) => {
  const d = new Date(parseFloat(timeString) * 1000);
  return d.toISOString().slice(11, 23).replace('.', ',');
};

export const formatTranscriptionItemsToSrt = (items: Timestamp[]) => {
  let srt = '';
  let i = 1;
  items
    .filter((item) => !!item)
    .forEach((item) => {
      srt += i + '\n';

      const { start, end } = item;
      srt += secondsToHHMMSSMS(start) + ' --> ' + secondsToHHMMSSMS(end) + '\n';

      srt += item.content + '\n';
      srt += '\n';
      i++;
    });
  return srt;
};
