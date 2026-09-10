import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to convert raw PCM into a standard WAV format (44-byte RIFF header)
function wrapPcmInWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitDepth = 16): Buffer {
  if (pcmBuffer.length >= 12 && pcmBuffer.toString('utf8', 0, 4) === 'RIFF') {
    return pcmBuffer;
  }

  const byteRate = (sampleRate * numChannels * bitDepth) / 8;
  const blockAlign = (numChannels * bitDepth) / 8;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // AudioFormat: PCM = 1
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([header, pcmBuffer]);
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Text-to-Speech API using gemini-3.1-flash-tts-preview
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore', promptPrefix } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'النص المطلوب تحويله إلى صوت غير متوفر' });
      return;
    }

    const ai = getGeminiClient();

    // Available prebuilt voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const allowedVoices = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];
    const selectedVoice = allowedVoices.includes(voice) ? voice : 'Kore';

    // Construct prompt for expressive Arabic speech
    const cleanText = text.trim();
    const prompt = promptPrefix 
      ? `${promptPrefix}: ${cleanText}`
      : `اقرأ النص التالي باللغة العربية الفصحى بنبرة إخبارية وإنسانية رصينة ومؤثرة:\n${cleanText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    const base64Audio = inlineData?.data;

    if (!base64Audio) {
      throw new Error('لم يتم استرجاع أي بيانات صوتية من نموذج القراءة الصوتية');
    }

    const rawBuffer = Buffer.from(base64Audio, 'base64');
    const wavBuffer = wrapPcmInWav(rawBuffer, 24000, 1, 16);
    const wavBase64 = wavBuffer.toString('base64');

    res.json({
      success: true,
      audioBase64: wavBase64,
      mimeType: 'audio/wav',
      voice: selectedVoice,
      textLength: cleanText.length,
    });
  } catch (error: any) {
    console.error('Error generating TTS:', error);
    res.status(500).json({
      error: error?.message || 'حدث خطأ أثناء تحويل النص إلى صوت',
    });
  }
});

// Civic letter / appeal generator using gemini-3.8-flash
app.post('/api/generate-appeal', async (req, res) => {
  try {
    const { douarName, commune, primaryDemand, citizenName } = req.body;
    const ai = getGeminiClient();

    const prompt = `أنت محرر ومستشار مجتمعي متخصص في التنمية القروية والترافع المدني في المغرب.
المطلوب صياغة ملتمس أو رسالة ترافعية رسمية ومحترمة وموجهة إلى السلطات الإقليمية والمحلية بإقليم تاونات (السيد عامل إقليم تاونات، رئيس المجلس الإقليمي، ورئيس الجماعة الترابية المعنية).

البيانات:
- اسم الدوار: ${douarName || 'أحد دواوير إقليم تاونات'}
- الجماعة: ${commune || 'إقليم تاونات'}
- المطلب ذو الأولوية: ${primaryDemand || 'تعبيد الطريق القروي وفك العزلة وتوفير الماء الصالح للشرب'}
- باسم: ${citizenName || 'ساكنة الدوار وممثلي المجتمع المدني'}

صغ الرسالة بأسلوب مغربي إداري رفيع، قانوني وترافعي مؤثر، يرتكز على الحق الدستوري في التنمية والعيش الكريم والماء، مع بنود واضحة ومقترحات عملية. اذكر أهمية التدخل الميداني العاجل لإنقاذ التلاميذ والمرضى وتأمين شريان الحياة.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      appealText: response.text,
    });
  } catch (error: any) {
    console.error('Error generating appeal:', error);
    res.status(500).json({
      error: error?.message || 'حدث خطأ أثناء صياغة المذكرة الترافعية',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
