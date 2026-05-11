import { useRef, useEffect, useCallback, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useEditorStore } from '@/store/editorStore';
import { useCanvasDrawing } from '@/hooks/useCanvasDrawing';
import { AnnotationLayer } from './AnnotationLayer';
import { cn } from '@/utils';
import { ZOOM_FACTOR, MIN_ZOOM, MAX_ZOOM } from '@/constants';
import { clamp } from '@/utils';

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
  } = useEditorStore();

  const { startDrawing, continueDrawing, stopDrawing } = useCanvasDrawing();
  const image = useImage(backgroundImage);

  // Resize observer
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

  // Wheel zoom (anchor to cursor)
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
    // Middle-click or alt+drag → pan
    if (tool === 'pan' || e.evt.button === 1 || (e.evt.button === 0 && e.evt.altKey)) {
      isPanningRef.current = true;
      lastPanPosRef.current = { x: e.evt.clientX, y: e.evt.clientY };
      return;
    }
    // Select tool: click on empty canvas → deselect
    if (tool === 'select') {
      const isStage = e.target === e.target.getStage();
      const isBackground = e.target.name() === 'background-image';
      if (isStage || isBackground) setActiveAnnotationId(null);
      return;
    }
    startDrawing(e);
  }, [tool, startDrawing, setActiveAnnotationId]);

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
    <div ref={containerRef} className={cn('flex-1 w-full h-full overflow-hidden', cursorClass)}>
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
        {/* Image layer - static, rarely redraws */}
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

        {/* Annotation layer - interactive, contains Transformer */}
        <AnnotationLayer
          annotations={annotations}
          selectedId={activeAnnotationId}
          isSelectTool={tool === 'select'}
          onSelect={setActiveAnnotationId}
          onUpdate={updateAnnotation}
        />
      </Stage>
    </div>
  );
}
