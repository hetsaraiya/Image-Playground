import { Line, Rect, Ellipse, Text, Arrow, Group } from 'react-konva';
import type { Annotation, FreehandAnnotation, ShapeAnnotation, TextAnnotation } from '@/types';

interface AnnotationLayerProps {
  annotations: Annotation[];
}

function FreehandShape({ annotation }: { annotation: FreehandAnnotation }) {
  if (annotation.points.length < 2) return null;

  if (annotation.tool === 'eraser') {
    return (
      <Line
        points={annotation.points}
        stroke="white"
        strokeWidth={annotation.strokeWidth}
        tension={0.4}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation="destination-out"
      />
    );
  }

  return (
    <Line
      points={annotation.points}
      stroke={annotation.color}
      strokeWidth={annotation.strokeWidth}
      tension={0.4}
      lineCap="round"
      lineJoin="round"
      opacity={annotation.opacity}
      globalCompositeOperation={annotation.tool === 'highlighter' ? 'multiply' : 'source-over'}
    />
  );
}

function ShapeShape({ annotation }: { annotation: ShapeAnnotation }) {
  const commonProps = {
    stroke: annotation.color,
    strokeWidth: annotation.strokeWidth,
    opacity: annotation.opacity,
    fill: 'transparent',
  };

  if (annotation.tool === 'rectangle') {
    const x = annotation.width < 0 ? annotation.x + annotation.width : annotation.x;
    const y = annotation.height < 0 ? annotation.y + annotation.height : annotation.y;
    return (
      <Rect
        x={x}
        y={y}
        width={Math.abs(annotation.width)}
        height={Math.abs(annotation.height)}
        {...commonProps}
        cornerRadius={2}
      />
    );
  }

  if (annotation.tool === 'circle') {
    return (
      <Ellipse
        x={annotation.x + annotation.width / 2}
        y={annotation.y + annotation.height / 2}
        radiusX={Math.abs(annotation.width / 2)}
        radiusY={Math.abs(annotation.height / 2)}
        {...commonProps}
      />
    );
  }

  if (annotation.tool === 'line') {
    return (
      <Line
        points={[annotation.x, annotation.y, annotation.x + annotation.width, annotation.y + annotation.height]}
        {...commonProps}
        lineCap="round"
      />
    );
  }

  if (annotation.tool === 'arrow') {
    return (
      <Arrow
        points={[annotation.x, annotation.y, annotation.x + annotation.width, annotation.y + annotation.height]}
        {...commonProps}
        fill={annotation.color}
        pointerLength={12}
        pointerWidth={10}
      />
    );
  }

  return null;
}

function TextShape({ annotation }: { annotation: TextAnnotation }) {
  return (
    <Text
      x={annotation.x}
      y={annotation.y}
      text={annotation.text}
      fontSize={annotation.fontSize}
      fill={annotation.color}
      opacity={annotation.opacity}
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      fontStyle="bold"
    />
  );
}

function AnnotationShape({ annotation }: { annotation: Annotation }) {
  if (annotation.tool === 'pen' || annotation.tool === 'highlighter' || annotation.tool === 'eraser') {
    return <FreehandShape annotation={annotation as FreehandAnnotation} />;
  }
  if (annotation.tool === 'rectangle' || annotation.tool === 'circle' || annotation.tool === 'line' || annotation.tool === 'arrow') {
    return <ShapeShape annotation={annotation as ShapeAnnotation} />;
  }
  if (annotation.tool === 'text') {
    return <TextShape annotation={annotation as TextAnnotation} />;
  }
  return null;
}

export function AnnotationLayer({ annotations }: AnnotationLayerProps) {
  return (
    <Group>
      {annotations.map((annotation) => (
        <AnnotationShape key={annotation.id} annotation={annotation} />
      ))}
    </Group>
  );
}
