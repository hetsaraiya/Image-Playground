import type { ToolType } from '@/types';
export { AI_MODELS, POST_TTS_MODEL, getAiModel } from '@/config/aiModels';
export type { AiModel, AiModelKey } from '@/config/aiModels';

export const TOOL_LABELS: Record<ToolType, string> = {
  select: 'Select',
  pen: 'Pen',
  highlighter: 'Highlighter',
  eraser: 'Eraser',
  text: 'Text',
  arrow: 'Arrow',
  rectangle: 'Rectangle',
  circle: 'Circle',
  line: 'Line',
  pan: 'Pan',
};

export const TOOL_SHORTCUTS: Record<string, ToolType> = {
  v: 'select',
  p: 'pen',
  h: 'highlighter',
  e: 'eraser',
  t: 'text',
  a: 'arrow',
  r: 'rectangle',
  c: 'circle',
  l: 'line',
  ' ': 'pan',
};

export const PALETTE_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#ffffff', // white
  '#94a3b8', // slate
  '#475569', // dark slate
  '#0f172a', // near black
];

export const DEFAULT_COLOR = '#ef4444';
export const DEFAULT_STROKE_WIDTH = 3;
export const DEFAULT_FONT_SIZE = 18;
export const DEFAULT_OPACITY = 1;
export const HIGHLIGHTER_OPACITY = 0.4;

export const STROKE_WIDTHS = [1, 2, 3, 5, 8, 12, 20];

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 8;
export const ZOOM_STEP = 0.1;
export const ZOOM_FACTOR = 1.1;

export const CANVAS_PADDING = 48;
