'use client';
import {Download} from 'lucide-react';

export default function ExportButton({onExport}) {
 return (
  <button
   onClick={onExport}
   className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
  >
   <Download className="h-4 w-4" />
   Export Transcript
  </button>
 );
}
