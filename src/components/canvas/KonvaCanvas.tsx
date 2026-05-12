import { useRef, useEffect, useCallback, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useEditorStore } from '@/store/editorStore';
import { useCanvasDrawing } from '@/hooks/useCanvasDrawing';
import { AnnotationLayer } from './AnnotationLayer';
import { InlineTextEditor } from './InlineTextEditor';
import { cn, generateId } from '@/utils';
import { ZOOM_FACTOR, MIN_ZOOM, MAX_ZOOM } from '@/constants';
import { clamp } from '@/utils';
import type { TextAnnotation } from '@/types';

interface KonvaCanvasProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

function useImage(src: string | null) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) { setImage(null); return; }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.src = src;
  }, [src]);
  return image;
}

export function KonvaCanvas({ stageRef }: KonvaCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const isPanningRef = useRef(false);
  const lastPanPosRef = useRef({ x: 0, y: 0 });

  const {
    backgroundImage, imageWidth, imageHeight,
    annotations, tool,
    zoom, setZoom, panOffset, setPanOffset,
    activeAnnotationId, setActiveAnnotationId,
    updateAnnotation,
    color, fontSize, opacity, strokeWidth,
    pendingTextPos, setPendingTextPos,
    editingAnnotationId, setEditingAnnotationId,
    addAnnotation, pushHistory,
  } = useEditorStore();

  const { startDrawing, continueDrawing, stopDrawing } = useCanvasDrawing();
  const image = useImage(backgroundImage);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldZoom = zoom;
    const pointer = stage.getPointerPosition()!;
    const factor = e.evt.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
    const newZoom = clamp(oldZoom * factor, MIN_ZOOM, MAX_ZOOM);
    const mousePointTo = {
      x: (pointer.x - panOffset.x) / oldZoom,
      y: (pointer.y - panOffset.y) / oldZoom,
    };
    setZoom(newZoom);
    setPanOffset({ x: pointer.x - mousePointTo.x * newZoom, y: pointer.y - mousePointTo.y * newZoom });
  }, [zoom, panOffset, setZoom, setPanOffset, stageRef]);

  const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (tool === 'pan' || e.evt.button === 1 || (e.evt.button === 0 && e.evt.altKey)) {
      isPanningRef.current = true;
      lastPanPosRef.current = { x: e.evt.clientX, y: e.evt.clientY };
      return;
    }
    if (tool === 'select') {
      const isStage = e.target === e.target.getStage();
      const isBackground = e.target.name() === 'background-image';
      if (isStage || isBackground) setActiveAnnotationId(null);
      return;
    }
    if (tool === 'text') return; // handled by native onClick on container
    startDrawing(e);
  }, [tool, startDrawing, setActiveAnnotationId]);

  // Native DOM click for text tool — bypasses Konva's event system entirely
  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (tool !== 'text') return;
    if (pendingTextPos || editingAnnotationId) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    setPendingTextPos({
      x: (screenX - panOffset.x) / zoom,
      y: (screenY - panOffset.y) / zoom,
    });
  }, [tool, pendingTextPos, editingAnnotationId, panOffset, zoom, setPendingTextPos]);

  const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (isPanningRef.current) {
      const dx = e.evt.clientX - lastPanPosRef.current.x;
      const dy = e.evt.clientY - lastPanPosRef.current.y;
      lastPanPosRef.current = { x: e.evt.clientX, y: e.evt.clientY };
      setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy });
      return;
    }
    continueDrawing(e);
  }, [continueDrawing, panOffset, setPanOffset]);

  const handleMouseUp = useCallback((_e: KonvaEventObject<MouseEvent>) => {
    if (isPanningRef.current) { isPanningRef.current = false; return; }
    stopDrawing();
  }, [stopDrawing]);

  // Commit a new text annotation from the inline editor
  const handleTextCommit = useCallback((text: string) => {
    if (!pendingTextPos) return;
    const annotation: TextAnnotation = {
      id: generateId(),
      tool: 'text',
      color,
      strokeWidth,
      opacity,
      fontSize,
      x: pendingTextPos.x,
      y: pendingTextPos.y,
      text,
    };
    addAnnotation(annotation);
    pushHistory();
    setPendingTextPos(null);
  }, [pendingTextPos, color, strokeWidth, opacity, fontSize, addAnnotation, pushHistory, setPendingTextPos]);

  const handleTextCancel = useCallback(() => {
    setPendingTextPos(null);
  }, [setPendingTextPos]);

  // Commit an edit to an existing text annotation
  const editingAnnotation = annotations.find((a) => a.id === editingAnnotationId) as TextAnnotation | undefined;

  const handleEditCommit = useCallback((text: string) => {
    if (!editingAnnotationId) return;
    updateAnnotation(editingAnnotationId, { text });
    setEditingAnnotationId(null);
  }, [editingAnnotationId, updateAnnotation, setEditingAnnotationId]);

  const handleEditCancel = useCallback(() => {
    setEditingAnnotationId(null);
  }, [setEditingAnnotationId]);

  const cursorClass = {
    select: 'canvas-cursor-select',
    pen: 'canvas-cursor-pen',
    highlighter: 'canvas-cursor-pen',
    eraser: 'canvas-cursor-eraser',
    text: 'canvas-cursor-text',
    arrow: 'canvas-cursor-arrow',
    rectangle: 'canvas-cursor-pen',
    circle: 'canvas-cursor-pen',
    line: 'canvas-cursor-pen',
    pan: 'canvas-cursor-pan',
  }[tool];

  return (
    <div ref={containerRef} className={cn('flex-1 w-full h-full overflow-hidden relative', cursorClass)} onClick={handleContainerClick}>
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        scaleX={zoom}
        scaleY={zoom}
        x={panOffset.x}
        y={panOffset.y}
      >
        <Layer listening={false}>
          {image && (
            <KonvaImage
              image={image}
              x={0} y={0}
              width={imageWidth}
              height={imageHeight}
              name="background-image"
              listening={false}
            />
          )}
        </Layer>

        <AnnotationLayer
          annotations={annotations}
          selectedId={activeAnnotationId}
          editingId={editingAnnotationId}
          isSelectTool={tool === 'select'}
          onSelect={setActiveAnnotationId}
          onUpdate={updateAnnotation}
          onStartEdit={setEditingAnnotationId}
        />
      </Stage>

      {/* Inline text editor for new text annotations */}
      {pendingTextPos && (
        <InlineTextEditor
          worldPos={pendingTextPos}
          zoom={zoom}
          panOffset={panOffset}
          color={color}
          fontSize={fontSize}
          opacity={opacity}
          onCommit={handleTextCommit}
          onCancel={handleTextCancel}
        />
      )}

      {/* Inline text editor for editing existing annotations */}
      {editingAnnotationId && editingAnnotation && (
        <InlineTextEditor
          worldPos={{ x: editingAnnotation.x, y: editingAnnotation.y }}
          zoom={zoom}
          panOffset={panOffset}
          color={editingAnnotation.color}
          fontSize={editingAnnotation.fontSize}
          opacity={editingAnnotation.opacity}
          defaultText={editingAnnotation.text}
          onCommit={handleEditCommit}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
}
