export const formatTranscriptionItem = (items: any) => {
  const resultText = items.text;

  const words = resultText.split(' ');
  const totalLength = items.duration / 10000000;

  const wordsWithTimestamps = words.map((content: string, index: number) => {
    const start = (index / words.length) * totalLength;
    const end = ((index + 1) / words.length) * totalLength;

    return {
      start,
      end,
      content,
    };
  });

  return wordsWithTimestamps;
};
