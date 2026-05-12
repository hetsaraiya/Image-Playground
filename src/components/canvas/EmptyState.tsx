import { Upload, Clipboard, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui';
import { useImageInput } from '@/hooks/useImageInput';
import { useRef } from 'react';

export function EmptyState() {
  const { handleFile } = useImageInput();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-center gap-6 text-center max-w-xs px-4">
        <div className="w-16 h-16 rounded-2xl bg-[#0d0d0d] border border-[#222] flex items-center justify-center">
          <ImageIcon size={28} className="text-[#444]" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#ccc] mb-1">No image loaded</h2>
          <p className="text-sm text-[#555]">Paste, upload, or drag an image to annotate</p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Button onClick={() => inputRef.current?.click()} className="w-full gap-2" size="lg">
            <Upload size={14} />
            Upload image
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2"
            onClick={async () => {
              try {
                const items = await navigator.clipboard.read();
                for (const item of items) {
                  const imageType = item.types.find((t) => t.startsWith('image/'));
                  if (imageType) {
                    const blob = await item.getType(imageType);
                    const file = new File([blob], 'paste.png', { type: imageType });
                    await handleFile(file);
                    break;
                  }
                }
              } catch {
                // user can use Ctrl+V
              }
            }}
          >
            <Clipboard size={14} />
            Paste from clipboard
          </Button>
        </div>

        <p className="text-[11px] text-[#444]">
          <kbd className="font-mono bg-[#111] border border-[#2a2a2a] px-1.5 py-0.5 rounded text-[#666]">Ctrl+V</kbd>
          {' '}to paste · or drag & drop anywhere
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    </div>
  );
}
