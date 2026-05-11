import { Upload, Clipboard, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui';
import { useImageInput } from '@/hooks/useImageInput';
import { useRef } from 'react';

export function EmptyState() {
  const { handleFile } = useImageInput();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-center gap-6 text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
          <ImageIcon size={36} className="text-slate-500" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-200 mb-1">No image loaded</h2>
          <p className="text-sm text-slate-500">
            Paste, upload, or drag an image to start annotating
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={() => inputRef.current?.click()}
            className="w-full gap-2"
            size="lg"
          >
            <Upload size={16} />
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
                // fall back — user should use Ctrl+V
              }
            }}
          >
            <Clipboard size={16} />
            Paste from clipboard
          </Button>
        </div>

        <div className="flex items-center gap-3 text-slate-600 text-xs">
          <span className="kbd">Ctrl+V</span>
          <span>to paste</span>
          <span className="text-slate-700">·</span>
          <span>or drag & drop</span>
        </div>

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
