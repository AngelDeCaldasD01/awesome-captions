/** @type {import('next').NextConfig} */
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

// Establece la ruta del binario de FFmpeg
ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path);

const nextConfig = {
  webpack(config) {
    config.resolve.alias['@fonts'] = path.join(__dirname, 'fonts');
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      type: 'asset/resource',
    });
    return config;
  },
};

module.exports = nextConfig;
