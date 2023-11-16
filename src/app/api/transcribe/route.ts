import {
  AudioConfig,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';

export async function GET(req: any) {
  // const url = new URL(req.url);
  // const searchParams = new URLSearchParams(url.searchParams);
  // const filename = searchParams.get('filename');

  const formData = await req.formData();
  const file = formData.get('selectedFile');
  const { name, type } = file;
  const data = await file.arrayBuffer();

  const speechConfig = SpeechConfig.fromSubscription(
    '66b27f1e78324b7c88651d26e565dc55',
    'eastus',
  );
  speechConfig.speechRecognitionLanguage = 'es-ES';

  const audioConfig = AudioConfig.fromWavFileInput(data);
  const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
  console.log(recognizer);

  recognizer.recognizeOnceAsync((result) => {
    if (result.reason === ResultReason.RecognizedSpeech) {
      const resultText = result.text;

      // Dividir la transcripción en palabras por espacios
      const palabras = resultText.split(' ');

      // Calcular marcas de tiempo
      const duracionTotal = result.duration / 10000000; // Duración total en segundos

      const palabrasConMarcasDeTiempo = palabras.map((palabra, index) => {
        const inicio = (index / palabras.length) * duracionTotal;
        const fin = ((index + 1) / palabras.length) * duracionTotal;

        return {
          palabra,
          inicio,
          fin,
        };
      });

      // Mostrar las marcas de tiempo
      palabrasConMarcasDeTiempo.forEach((palabraConMarcaDeTiempo) => {
        console.log(
          `Palabra: ${palabraConMarcaDeTiempo.palabra}, Inicio: ${palabraConMarcaDeTiempo.inicio} segundos, Fin: ${palabraConMarcaDeTiempo.fin} segundos`,
        );
      });
    } else {
      console.error(`Error de transcripción: ${result.reason}`);
    }
  });

  return Response.json('ok');
}
