import { useEffect } from 'react';
import { EditorPage } from '@/pages/EditorPage';
import { useEditorStore } from '@/store/editorStore';

export default function App() {
  const { isDarkMode } = useEditorStore();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="h-full w-full bg-white dark:bg-black text-slate-900 dark:text-[#ededed]">
      <EditorPage />
    </div>
  );
}
