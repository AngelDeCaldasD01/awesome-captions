export const toFFmpegColor = (rgb: string) => {
  const bgr = rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3);
  return '&H' + bgr + '&';
};
