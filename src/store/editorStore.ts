import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Annotation, ToolType, Point, HistoryEntry } from '@/types';
import {
  DEFAULT_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_FONT_SIZE,
  DEFAULT_OPACITY,
  MIN_ZOOM,
  MAX_ZOOM,
} from '@/constants';
import { copyAnnotations, clamp } from '@/utils';

const MAX_HISTORY = 50;

interface EditorState {
  // Canvas data
  annotations: Annotation[];
  backgroundImage: string | null;
  imageWidth: number;
  imageHeight: number;

  // Tool settings
  tool: ToolType;
  color: string;
  strokeWidth: number;
  opacity: number;
  fontSize: number;

  // Viewport
  zoom: number;
  panOffset: Point;

  // UI
  isDarkMode: boolean;
  isDrawing: boolean;
  activeAnnotationId: string | null;

  // History
  history: HistoryEntry[];
  historyIndex: number;

  // Actions
  setBackgroundImage: (src: string, width: number, height: number) => void;
  clearBackground: () => void;
  setTool: (tool: ToolType) => void;
  setColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setOpacity: (opacity: number) => void;
  setFontSize: (size: number) => void;
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: Point) => void;
  setIsDrawing: (drawing: boolean) => void;
  setActiveAnnotationId: (id: string | null) => void;
  toggleDarkMode: () => void;

  // Annotation operations
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, partial: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  clearAnnotations: () => void;

  // History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set, get) => ({
    annotations: [],
    backgroundImage: null,
    imageWidth: 0,
    imageHeight: 0,

    tool: 'pen',
    color: DEFAULT_COLOR,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    opacity: DEFAULT_OPACITY,
    fontSize: DEFAULT_FONT_SIZE,

    zoom: 1,
    panOffset: { x: 0, y: 0 },

    isDarkMode: true,
    isDrawing: false,
    activeAnnotationId: null,

    history: [{ annotations: [] }],
    historyIndex: 0,

    setBackgroundImage: (src, width, height) =>
      set({ backgroundImage: src, imageWidth: width, imageHeight: height }),

    clearBackground: () =>
      set({ backgroundImage: null, imageWidth: 0, imageHeight: 0, annotations: [], history: [{ annotations: [] }], historyIndex: 0 }),

    setTool: (tool) => set({ tool }),
    setColor: (color) => set({ color }),
    setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
    setOpacity: (opacity) => set({ opacity }),
    setFontSize: (fontSize) => set({ fontSize }),
    setZoom: (zoom) => set({ zoom: clamp(zoom, MIN_ZOOM, MAX_ZOOM) }),
    setPanOffset: (panOffset) => set({ panOffset }),
    setIsDrawing: (isDrawing) => set({ isDrawing }),
    setActiveAnnotationId: (activeAnnotationId) => set({ activeAnnotationId }),
    toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),

    addAnnotation: (annotation) => {
      set((s) => ({ annotations: [...s.annotations, annotation] }));
    },

    updateAnnotation: (id, partial) => {
      set((s) => ({
        annotations: s.annotations.map((a) =>
          a.id === id ? { ...a, ...partial } as Annotation : a
        ),
      }));
    },

    removeAnnotation: (id) => {
      set((s) => ({ annotations: s.annotations.filter((a) => a.id !== id) }));
    },

    clearAnnotations: () => {
      get().pushHistory();
      set({ annotations: [] });
    },

    pushHistory: () => {
      const { annotations, history, historyIndex } = get();
      const newEntry: HistoryEntry = { annotations: copyAnnotations(annotations) };
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newEntry);
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      set({ history: newHistory, historyIndex: newHistory.length - 1 });
    },

    undo: () => {
      const { historyIndex, history } = get();
      if (historyIndex <= 0) return;
      const newIndex = historyIndex - 1;
      set({
        historyIndex: newIndex,
        annotations: copyAnnotations(history[newIndex].annotations),
      });
    },

    redo: () => {
      const { historyIndex, history } = get();
      if (historyIndex >= history.length - 1) return;
      const newIndex = historyIndex + 1;
      set({
        historyIndex: newIndex,
        annotations: copyAnnotations(history[newIndex].annotations),
      });
    },

    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,
  }))
);
