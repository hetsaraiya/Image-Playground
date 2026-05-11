import { useRef, useCallback } from 'react';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useEditorStore } from '@/store/editorStore';
import { generateId } from '@/utils';
import { HIGHLIGHTER_OPACITY } from '@/constants';
import type { Annotation, FreehandAnnotation, ShapeAnnotation, TextAnnotation, Point } from '@/types';

export function useCanvasDrawing() {
  const store = useEditorStore();
  const drawingRef = useRef<Annotation | null>(null);
  const lastPosRef = useRef<Point | null>(null);

  const getStagePos = useCallback((e: KonvaEventObject<MouseEvent | TouchEvent>): Point => {
    const stage = e.target.getStage()!;
    const pos = stage.getPointerPosition()!;
    return {
      x: (pos.x - store.panOffset.x) / store.zoom,
      y: (pos.y - store.panOffset.y) / store.zoom,
    };
  }, [store.panOffset, store.zoom]);

  const startDrawing = useCallback((e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (store.tool === 'pan' || store.tool === 'select') return;
    if (e.target !== e.target.getStage() && store.tool !== 'eraser') {
      const isBackground = e.target.name() === 'background-image';
      if (!isBackground) return;
    }

    const pos = getStagePos(e);
    store.pushHistory();
    store.setIsDrawing(true);
    lastPosRef.current = pos;

    if (store.tool === 'pen' || store.tool === 'highlighter' || store.tool === 'eraser') {
      const annotation: FreehandAnnotation = {
        id: generateId(),
        tool: store.tool,
        color: store.tool === 'eraser' ? '#000000' : store.color,
        strokeWidth: store.tool === 'highlighter' ? store.strokeWidth * 3 : store.strokeWidth,
        opacity: store.tool === 'highlighter' ? HIGHLIGHTER_OPACITY : store.opacity,
        points: [pos.x, pos.y],
      };
      drawingRef.current = annotation;
      store.addAnnotation(annotation);
    } else if (store.tool === 'text') {
      const text = window.prompt('Enter annotation text:');
      if (!text) { store.setIsDrawing(false); return; }
      const annotation: TextAnnotation = {
        id: generateId(),
        tool: 'text',
        color: store.color,
        strokeWidth: store.strokeWidth,
        opacity: store.opacity,
        fontSize: store.fontSize,
        x: pos.x,
        y: pos.y,
        text,
      };
      store.addAnnotation(annotation);
      store.setIsDrawing(false);
    } else {
      const annotation: ShapeAnnotation = {
        id: generateId(),
        tool: store.tool as ShapeAnnotation['tool'],
        color: store.color,
        strokeWidth: store.strokeWidth,
        opacity: store.opacity,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
      };
      drawingRef.current = annotation;
      store.addAnnotation(annotation);
    }
  }, [store, getStagePos]);

  const continueDrawing = useCallback((e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!store.isDrawing || !drawingRef.current) return;
    const pos = getStagePos(e);

    const current = drawingRef.current;

    if (current.tool === 'pen' || current.tool === 'highlighter') {
      const updated = {
        ...current,
        points: [...(current as FreehandAnnotation).points, pos.x, pos.y],
      } as FreehandAnnotation;
      drawingRef.current = updated;
      store.updateAnnotation(current.id, { points: updated.points } as Partial<Annotation>);
    } else if (current.tool === 'eraser') {
      const updated = {
        ...current,
        points: [...(current as FreehandAnnotation).points, pos.x, pos.y],
      } as FreehandAnnotation;
      drawingRef.current = updated;
      store.updateAnnotation(current.id, { points: updated.points } as Partial<Annotation>);
    } else if (['rectangle', 'circle', 'line', 'arrow'].includes(current.tool)) {
      const shape = current as ShapeAnnotation;
      const updated: Partial<ShapeAnnotation> = {
        width: pos.x - shape.x,
        height: pos.y - shape.y,
      };
      drawingRef.current = { ...shape, ...updated };
      store.updateAnnotation(current.id, updated as Partial<Annotation>);
    }

    lastPosRef.current = pos;
  }, [store, getStagePos]);

  const stopDrawing = useCallback(() => {
    if (!store.isDrawing) return;
    store.setIsDrawing(false);
    drawingRef.current = null;
    lastPosRef.current = null;
  }, [store]);

  const handleStageRef = useCallback((stage: Konva.Stage | null) => {
    if (!stage) return;
  }, []);

  return { startDrawing, continueDrawing, stopDrawing, handleStageRef };
}
