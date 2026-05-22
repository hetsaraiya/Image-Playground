export const AI_MODELS = {
  textToSpeech: 'gpt-4o-mini-tts',
  postTtsTranscription: 'gpt-4o-mini-transcribe',
} as const;

export type AiModelKey = keyof typeof AI_MODELS;
export type AiModel = (typeof AI_MODELS)[AiModelKey];

export const POST_TTS_MODEL = AI_MODELS.postTtsTranscription;

export function getAiModel(modelKey: AiModelKey): AiModel {
  return AI_MODELS[modelKey];
}
