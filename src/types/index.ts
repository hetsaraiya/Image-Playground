export type ToolType =
  | 'select'
  | 'pen'
  | 'highlighter'
  | 'eraser'
  | 'text'
  | 'arrow'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'pan';

export interface Point {
  x: number;
  y: number;
}

export interface BaseAnnotation {
  id: string;
  tool: ToolType;
  color: string;
  strokeWidth: number;
  opacity: number;
}

export interface FreehandAnnotation extends BaseAnnotation {
  tool: 'pen' | 'highlighter' | 'eraser';
  points: number[];
}

export interface ShapeAnnotation extends BaseAnnotation {
  tool: 'rectangle' | 'circle' | 'line' | 'arrow';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextAnnotation extends BaseAnnotation {
  tool: 'text';
  x: number;
  y: number;
  text: string;
  fontSize: number;
}

export type Annotation = FreehandAnnotation | ShapeAnnotation | TextAnnotation;

export interface CanvasState {
  annotations: Annotation[];
  backgroundImage: string | null;
  imageWidth: number;
  imageHeight: number;
}

export interface HistoryEntry {
  annotations: Annotation[];
}

export interface EditorSettings {
  tool: ToolType;
  color: string;
  strokeWidth: number;
  opacity: number;
  fontSize: number;
  zoom: number;
  panOffset: Point;
  isDarkMode: boolean;
}

export interface ExportOptions {
  format: 'png' | 'jpeg';
  quality?: number;
  includeBackground?: boolean;
}
