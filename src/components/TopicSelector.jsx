'use client';
import {Check} from 'lucide-react';

export default function TopicSelector({
 topics,
 activeTopic,
 onTopicChange,
 disabled,
 hasMessages,
}) {
 return (
  <div>
   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Debate Topics
   </h3>
   <div className="space-y-3">
    {Object.entries(topics).map(([id, topic]) => (
     <button
      key={id}
      onClick={() => !disabled && onTopicChange(id)}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200
              ${
               activeTopic === id
                ? 'border-bot1 bg-bot1 bg-opacity-5 shadow-sm'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              }
              ${
               disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:shadow-md'
              }
            `}
     >
      <div className="flex items-start justify-between">
       <div className="flex-1">
        <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
         {topic.title}
        </div>
        <div className="text-gray-600 dark:text-gray-400 text-xs">
         {topic.description}
        </div>
       </div>
       {activeTopic === id && (
        <Check className="w-4 h-4 text-bot1 flex-shrink-0 mt-1" />
       )}
      </div>
     </button>
    ))}
   </div>
   {disabled && hasMessages && (
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
     Reset conversation to change topics
    </p>
   )}
  </div>
 );
}
