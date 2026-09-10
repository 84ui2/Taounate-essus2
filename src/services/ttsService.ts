export interface TTSServiceResponse {
  audioBase64: string;
  mimeType: string;
  voice: string;
}

class TTSService {
  private cache: Map<string, string> = new Map();
  private audio: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;

  async requestTTS(text: string, voice: string = 'Kore', promptPrefix?: string): Promise<string> {
    const cacheKey = `${voice}_${text.trim()}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice,
        promptPrefix,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `فشل طلب الصوت (${response.status})`);
    }

    const data: TTSServiceResponse = await response.json();
    const dataUrl = `data:${data.mimeType};base64,${data.audioBase64}`;
    this.cache.set(cacheKey, dataUrl);
    return dataUrl;
  }

  getAudioElement(): HTMLAudioElement {
    if (!this.audio) {
      this.audio = new Audio();
    }
    return this.audio;
  }

  stopCurrentAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  cleanup() {
    this.stopCurrentAudio();
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  }
}

export const ttsService = new TTSService();
