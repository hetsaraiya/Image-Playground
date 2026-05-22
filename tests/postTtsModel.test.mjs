import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

const configSource = await readFile(new URL('../src/config/aiModels.ts', import.meta.url), 'utf8');

test('post-TTS processing uses the selected transcription model', () => {
  assert.match(configSource, /postTtsTranscription:\s*'gpt-4o-mini-transcribe'/);
  assert.match(configSource, /POST_TTS_MODEL\s*=\s*AI_MODELS\.postTtsTranscription/);
});
