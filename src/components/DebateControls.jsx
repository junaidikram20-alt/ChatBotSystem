'use client';
import {Play, Square, Download, RotateCcw} from 'lucide-react';

export default function DebateControls({
 isDebateActive,
 isLoading,
 hasMessages,
 onStartDebate,
 onExport,
 onReset,
}) {
 return (
  <div className="space-y-4 pt-4">
   {/* Start/Stop Debate */}
   <div className="space-y-2">
    <button
     onClick={onStartDebate}
     disabled={isDebateActive || isLoading}
     className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-bot1 to-bot2 text-white py-3 px-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
     {isLoading ? (
      <>
       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
       Starting Debate...
      </>
     ) : isDebateActive ? (
      <>
       <Square className="w-4 h-4" />
       Stop Debate
      </>
     ) : (
      <>
       <Play className="w-4 h-4" />
       Start Debate
      </>
     )}
    </button>

    {(hasMessages || isDebateActive) && (
     <button
      onClick={onReset}
      className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
     >
      <RotateCcw className="w-4 h-4" />
      Reset Conversation
     </button>
    )}
   </div>

   {/* Export Button */}
   {hasMessages && (
    <button
     onClick={onExport}
     className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition"
    >
     <Download className="w-4 h-4" />
     Export Transcript
    </button>
   )}

   {/* Status Indicator */}
   <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
    {isDebateActive ? (
     <div className="flex items-center justify-center gap-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      Debate in progress...
     </div>
    ) : hasMessages ? (
     'Ready for discussion'
    ) : (
     'Select a topic to begin'
    )}
   </div>
  </div>
 );
}
