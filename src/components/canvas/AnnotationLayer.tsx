import { useRef, useEffect } from 'react';
import { Layer, Line, Rect, Ellipse, Text, Arrow, Group, Transformer } from 'react-konva';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Annotation, FreehandAnnotation, ShapeAnnotation, TextAnnotation } from '@/types';

interface LayerProps {
  annotations: Annotation[];
  selectedId: string | null;
  isSelectTool: boolean;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, partial: Partial<Annotation>) => void;
}

// ─── Freehand (pen / highlighter) ───────────────────────────────────────────

function FreehandShape({
  annotation, isSelectTool, selected, onSelect, onUpdate,
}: {
  annotation: FreehandAnnotation;
  isSelectTool: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, partial: Partial<Annotation>) => void;
}) {
  if (annotation.points.length < 2) return null;

  const commonLine = {
    points: annotation.points,
    strokeWidth: annotation.strokeWidth,
    tension: 0.4,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const node = e.target as Konva.Group;
    const dx = node.x();
    const dy = node.y();
    if (dx === 0 && dy === 0) return;
    node.position({ x: 0, y: 0 });
    const newPoints = annotation.points.map((v, i) => (i % 2 === 0 ? v + dx : v + dy));
    onUpdate(annotation.id, { points: newPoints } as Partial<Annotation>);
  };

  return (
    <Group
      id={annotation.id}
      draggable={isSelectTool}
      listening={isSelectTool}
      onMouseDown={(e) => { if (isSelectTool) e.cancelBubble = true; }}
      onClick={(e) => { if (isSelectTool) { e.cancelBubble = true; onSelect(annotation.id); } }}
      onDragEnd={handleDragEnd}
    >
      <Line
        {...commonLine}
        stroke={annotation.color}
        opacity={annotation.opacity}
        globalCompositeOperation={annotation.tool === 'highlighter' ? 'multiply' : 'source-over'}
        hitStrokeWidth={Math.max(annotation.strokeWidth + 12, 20)}
      />
      {selected && isSelectTool && (
        /* Invisible wider hit-area outline for visual feedback */
        <Line
          {...commonLine}
          stroke="transparent"
          strokeWidth={0}
          hitStrokeWidth={0}
        />
      )}
    </Group>
  );
}

// ─── Eraser strokes ──────────────────────────────────────────────────────────

function EraserShape({ annotation }: { annotation: FreehandAnnotation }) {
  return (
    <Line
      id={annotation.id}
      points={annotation.points}
      stroke="rgba(0,0,0,1)"
      strokeWidth={annotation.strokeWidth}
      tension={0.4}
      lineCap="round"
      lineJoin="round"
      globalCompositeOperation="destination-out"
      listening={false}
    />
  );
}

// ─── Rectangle ──────────────────────────────────────────────────────────────

function RectShape({
  annotation, isSelectTool, onSelect, onUpdate,
}: {
  annotation: ShapeAnnotation;
  isSelectTool: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, partial: Partial<Annotation>) => void;
}) {
  const x = annotation.width < 0 ? annotation.x + annotation.width : annotation.x;
  const y = annotation.height < 0 ? annotation.y + annotation.height : annotation.y;
  const w = Math.abs(annotation.width);
  const h = Math.abs(annotation.height);

  return (
    <Rect
      id={annotation.id}
      x={x} y={y} width={w} height={h}
      stroke={annotation.color}
      strokeWidth={annotation.strokeWidth}
      fill="transparent"
      opacity={annotation.opacity}
      cornerRadius={2}
      draggable={isSelectTool}
      listening={isSelectTool}
      onMouseDown={(e) => { if (isSelectTool) e.cancelBubble = true; }}
      onClick={(e) => { if (isSelectTool) { e.cancelBubble = true; onSelect(annotation.id); } }}
      onDragEnd={(e) => {
        onUpdate(annotation.id, { x: e.target.x(), y: e.target.y() } as Partial<Annotation>);
      }}
      onTransformEnd={(e) => {
        const node = e.target as Konva.Rect;
        const newW = Math.max(5, node.width() * node.scaleX());
        const newH = Math.max(5, node.height() * node.scaleY());
        node.scaleX(1); node.scaleY(1);
        node.width(newW); node.height(newH);
        onUpdate(annotation.id, { x: node.x(), y: node.y(), width: newW, height: newH } as Partial<Annotation>);
      }}
    />
  );
}

// ─── Ellipse / Circle ───────────────────────────────────────────────────────

function EllipseShape({
  annotation, isSelectTool, onSelect, onUpdate,
}: {
  annotation: ShapeAnnotation;
  isSelectTool: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, partial: Partial<Annotation>) => void;
}) {
  const cx = annotation.x + annotation.width / 2;
  const cy = annotation.y + annotation.height / 2;
  const rx = Math.abs(annotation.width / 2);
  const ry = Math.abs(annotation.height / 2);

  return (
    <Ellipse
      id={annotation.id}
      x={cx} y={cy}
      radiusX={rx || 1} radiusY={ry || 1}
      stroke={annotation.color}
      strokeWidth={annotation.strokeWidth}
      fill="transparent"
      opacity={annotation.opacity}
      draggable={isSelectTool}
      listening={isSelectTool}
      onMouseDown={(e) => { if (isSelectTool) e.cancelBubble = true; }}
      onClick={(e) => { if (isSelectTool) { e.cancelBubble = true; onSelect(annotation.id); } }}
      onDragEnd={(e) => {
        const node = e.target as Konva.Ellipse;
        onUpdate(annotation.id, {
          x: node.x() - node.radiusX(),
          y: node.y() - node.radiusY(),
        } as Partial<Annotation>);
      }}
      onTransformEnd={(e) => {
        const node = e.target as Konva.Ellipse;
        const newRx = Math.max(3, Math.abs(node.radiusX() * node.scaleX()));
        const newRy = Math.max(3, Math.abs(node.radiusY() * node.scaleY()));
        node.scaleX(1); node.scaleY(1);
        onUpdate(annotation.id, {
          x: node.x() - newRx, y: node.y() - newRy,
          width: newRx * 2, height: newRy * 2,
        } as Partial<Annotation>);
      }}
    />
  );
}

// ─── Line ───────────────────────────────────────────────────────────────────

function LineShape({
  annotation, isSelectTool, onSelect, onUpdate,
}: {
  annotation: ShapeAnnotation;
  isSelectTool: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, partial: Partial<Annotation>) => void;
}) {
  return (
    <Line
      id={annotation.id}
      x={annotation.x} y={annotation.y}
      points={[0, 0, annotation.width, annotation.height]}
      stroke={annotation.color}
      strokeWidth={annotation.strokeWidth}
      fill="transparent"
      opacity={annotation.opacity}
      lineCap="round"
      hitStrokeWidth={Math.max(annotation.strokeWidth + 10, 16)}
      draggable={isSelectTool}
      listening={isSelectTool}
      onMouseDown={(e) => { if (isSelectTool) e.cancelBubble = true; }}
      onClick={(e) => { if (isSelectTool) { e.cancelBubble = true; onSelect(annotation.id); } }}
      onDragEnd={(e) => {
        onUpdate(annotation.id, { x: e.target.x(), y: e.target.y() } as Partial<Annotation>);
      }}
    />
  );
}

// ─── Arrow ──────────────────────────────────────────────────────────────────

function ArrowShape({
  annotation, isSelectTool, onSelect, onUpdate,
}: {
  annotation: ShapeAnnotation;
  isSelectTool: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, partial: Partial<Annotation>) => void;
}) {
  return (
    <Arrow
      id={annotation.id}
      x={annotation.x} y={annotation.y}
      points={[0, 0, annotation.width, annotation.height]}
      stroke={annotation.color}
      strokeWidth={annotation.strokeWidth}
      fill={annotation.color}
      opacity={annotation.opacity}
      pointerLength={12}
      pointerWidth={10}
      hitStrokeWidth={Math.max(annotation.strokeWidth + 10, 16)}
      draggable={isSelectTool}
      listening={isSelectTool}
      onMouseDown={(e) => { if (isSelectTool) e.cancelBubble = true; }}
      onClick={(e) => { if (isSelectTool) { e.cancelBubble = true; onSelect(annotation.id); } }}
      onDragEnd={(e) => {
        onUpdate(annotation.id, { x: e.target.x(), y: e.target.y() } as Partial<Annotation>);
      }}
    />
  );
}

// ─── Text ───────────────────────────────────────────────────────────────────

function TextShape({
  annotation, isSelectTool, onSelect, onUpdate,
}: {
  annotation: TextAnnotation;
  isSelectTool: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, partial: Partial<Annotation>) => void;
}) {
  return (
    <Text
      id={annotation.id}
      x={annotation.x} y={annotation.y}
      text={annotation.text}
      fontSize={annotation.fontSize}
      fill={annotation.color}
      opacity={annotation.opacity}
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      fontStyle="bold"
      draggable={isSelectTool}
      listening={isSelectTool}
      onMouseDown={(e) => { if (isSelectTool) e.cancelBubble = true; }}
      onClick={(e) => { if (isSelectTool) { e.cancelBubble = true; onSelect(annotation.id); } }}
      onDblClick={(e) => {
        if (!isSelectTool) return;
        e.cancelBubble = true;
        const newText = window.prompt('Edit text:', annotation.text);
        if (newText !== null && newText.trim()) {
          onUpdate(annotation.id, { text: newText } as Partial<Annotation>);
        }
      }}
      onDragEnd={(e) => {
        onUpdate(annotation.id, { x: e.target.x(), y: e.target.y() } as Partial<Annotation>);
      }}
      onTransformEnd={(e) => {
        const node = e.target as Konva.Text;
        const newFontSize = Math.max(8, Math.round(annotation.fontSize * node.scaleY()));
        node.scaleX(1); node.scaleY(1);
        onUpdate(annotation.id, {
          x: node.x(), y: node.y(), fontSize: newFontSize,
        } as Partial<Annotation>);
      }}
    />
  );
}

// ─── Main AnnotationLayer (IS a Konva Layer) ─────────────────────────────────

export function AnnotationLayer({ annotations, selectedId, isSelectTool, onSelect, onUpdate }: LayerProps) {
  const layerRef = useRef<Konva.Layer>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const selectedAnnotation = annotations.find((a) => a.id === selectedId);

  // Attach transformer to whichever node is selected
  useEffect(() => {
    const tr = trRef.current;
    const layer = layerRef.current;
    if (!tr || !layer) return;

    if (!selectedId) {
      tr.nodes([]);
      layer.batchDraw();
      return;
    }

    const node = layer.findOne('#' + selectedId);
    if (node) {
      tr.nodes([node]);
    } else {
      tr.nodes([]);
    }
    layer.batchDraw();
  }, [selectedId, annotations]);

  // Determine which transformer anchors to show based on selected shape type
  const noResize = (
    selectedAnnotation?.tool === 'pen' ||
    selectedAnnotation?.tool === 'highlighter' ||
    selectedAnnotation?.tool === 'line' ||
    selectedAnnotation?.tool === 'arrow'
  );
  const enabledAnchors = noResize
    ? []
    : selectedAnnotation?.tool === 'circle'
    ? ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    : undefined;

  const sharedProps = { isSelectTool, onSelect, onUpdate };

  return (
    <Layer ref={layerRef}>
      {annotations.map((a) => {
        const selected = a.id === selectedId;

        if (a.tool === 'eraser') {
          return <EraserShape key={a.id} annotation={a as FreehandAnnotation} />;
        }
        if (a.tool === 'pen' || a.tool === 'highlighter') {
          return (
            <FreehandShape
              key={a.id}
              annotation={a as FreehandAnnotation}
              selected={selected}
              {...sharedProps}
            />
          );
        }
        if (a.tool === 'rectangle') {
          return <RectShape key={a.id} annotation={a as ShapeAnnotation} {...sharedProps} />;
        }
        if (a.tool === 'circle') {
          return <EllipseShape key={a.id} annotation={a as ShapeAnnotation} {...sharedProps} />;
        }
        if (a.tool === 'line') {
          return <LineShape key={a.id} annotation={a as ShapeAnnotation} {...sharedProps} />;
        }
        if (a.tool === 'arrow') {
          return <ArrowShape key={a.id} annotation={a as ShapeAnnotation} {...sharedProps} />;
        }
        if (a.tool === 'text') {
          return <TextShape key={a.id} annotation={a as TextAnnotation} {...sharedProps} />;
        }
        return null;
      })}

      {isSelectTool && (
        <Transformer
          ref={trRef}
          enabledAnchors={enabledAnchors}
          rotateEnabled={false}
          keepRatio={selectedAnnotation?.tool === 'circle'}
          anchorSize={8}
          anchorCornerRadius={2}
          anchorStroke="#6366f1"
          anchorFill="#fff"
          borderStroke="#6366f1"
          borderDash={[4, 3]}
          borderStrokeWidth={1.5}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox;
            return newBox;
          }}
        />
      )}
    </Layer>
  );
}
