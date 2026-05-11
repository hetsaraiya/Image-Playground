import { useState, useRef } from 'react';
import {
  Download, Copy, Trash2, RotateCcw, RotateCw,
  Sun, Moon, ZoomIn, ZoomOut, Maximize2, Upload, ImagePlus
} from 'lucide-react';
import type Konva from 'konva';
import { Button, Tooltip, Divider } from '@/components/ui';
import { useEditorStore } from '@/store/editorStore';
import { useExport } from '@/hooks/useExport';
import { useImageInput } from '@/hooks/useImageInput';
import { formatZoom } from '@/utils';
import { ZOOM_FACTOR, MIN_ZOOM, MAX_ZOOM } from '@/constants';
import { clamp } from '@/utils';

interface HeaderProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

export function Header({ stageRef }: HeaderProps) {
  const {
    undo, redo, canUndo, canRedo,
    clearAnnotations,
    zoom, setZoom, setPanOffset,
    toggleDarkMode, isDarkMode,
    backgroundImage,
  } = useEditorStore();

  const { exportAsPNG, copyToClipboard } = useExport(stageRef);
  const { handleFile } = useImageInput();
  const uploadRef = useRef<HTMLInputElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard();
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  };

  const zoomIn = () => setZoom(clamp(zoom * ZOOM_FACTOR, MIN_ZOOM, MAX_ZOOM));
  const zoomOut = () => setZoom(clamp(zoom / ZOOM_FACTOR, MIN_ZOOM, MAX_ZOOM));
  const resetView = () => { setZoom(1); setPanOffset({ x: 0, y: 0 }); };

  return (
    <header className="flex items-center justify-between px-4 h-11 border-b border-[#1a1a1a] bg-black flex-shrink-0 z-10">
      {/* Brand */}
      <div className="flex items-center gap-2 min-w-[150px]">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <ImagePlus size={12} className="text-white" />
        </div>
        <span className="font-semibold text-sm text-[#ededed] tracking-tight">Image Playground</span>
      </div>

      {/* Center */}
      <div className="flex items-center gap-0.5">
        <Tooltip content="Undo" shortcut="⌘Z" side="bottom">
          <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo()}>
            <RotateCcw size={14} />
          </Button>
        </Tooltip>
        <Tooltip content="Redo" shortcut="⌘⇧Z" side="bottom">
          <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo()}>
            <RotateCw size={14} />
          </Button>
        </Tooltip>

        <Divider orientation="vertical" className="h-4 mx-1.5" />

        <Tooltip content="Zoom out" side="bottom">
          <Button variant="ghost" size="icon" onClick={zoomOut}>
            <ZoomOut size={14} />
          </Button>
        </Tooltip>
        <button
          onClick={resetView}
          className="text-xs font-mono text-[#666] hover:text-[#ededed] transition-colors w-11 text-center tabular-nums"
        >
          {formatZoom(zoom)}
        </button>
        <Tooltip content="Zoom in" side="bottom">
          <Button variant="ghost" size="icon" onClick={zoomIn}>
            <ZoomIn size={14} />
          </Button>
        </Tooltip>
        <Tooltip content="Fit to screen" shortcut="0" side="bottom">
          <Button variant="ghost" size="icon" onClick={resetView}>
            <Maximize2 size={14} />
          </Button>
        </Tooltip>
      </div>

      {/* Right */}
      <div className="flex items-center gap-0.5 min-w-[150px] justify-end">
        <Tooltip content="Load image" side="bottom">
          <Button variant="ghost" size="icon" onClick={() => uploadRef.current?.click()}>
            <Upload size={14} />
          </Button>
        </Tooltip>

        <Divider orientation="vertical" className="h-4 mx-1" />

        <Tooltip content="Clear annotations" shortcut="⌘⌫" side="bottom">
          <Button variant="ghost" size="icon" onClick={clearAnnotations} disabled={!backgroundImage}>
            <Trash2 size={14} />
          </Button>
        </Tooltip>

        <Tooltip content={copySuccess ? 'Copied!' : 'Copy to clipboard'} side="bottom">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            disabled={!backgroundImage}
            className={copySuccess ? 'text-green-400!' : ''}
          >
            <Copy size={14} />
          </Button>
        </Tooltip>

        <Tooltip content="Export PNG" side="bottom">
          <Button variant="default" size="sm" onClick={exportAsPNG} disabled={!backgroundImage} className="gap-1.5 ml-1">
            <Download size={12} />
            Export
          </Button>
        </Tooltip>

        <Divider orientation="vertical" className="h-4 mx-1.5" />

        <Tooltip content={isDarkMode ? 'Light mode' : 'Dark mode'} side="bottom">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          </Button>
        </Tooltip>
      </div>

      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) { handleFile(file); e.target.value = ''; }
        }}
      />
    </header>
  );
}
