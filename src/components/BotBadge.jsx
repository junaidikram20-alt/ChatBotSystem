'use client';
import {Brain, Heart, Search, User} from 'lucide-react';

const iconMap = {
 brain: Brain,
 heart: Heart,
 search: Search,
 user: User,
};

const colorMap = {
 bot1: 'from-bot1 to-bot1/80',
 bot2: 'from-bot2 to-bot2/80',
 bot3: 'from-bot3 to-bot3/80',
 bot4: 'from-bot4 to-bot4/80',
};

export default function BotBadge({
 id,
 name,
 description,
 specialty,
 color,
 icon,
}) {
 const Icon = iconMap[icon] || Brain;
 const gradientClass = colorMap[color] || 'from-gray-500 to-gray-400';

 return (
  <div className="w-full rounded-xl p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
   <div className="flex items-center gap-3">
    <div
     className={`inline-flex items-center justify-center rounded-xl h-12 w-12 bg-gradient-to-br ${gradientClass} text-white shadow-sm`}
    >
     <Icon className="h-6 w-6" aria-hidden="true" />
    </div>
    <div className="flex-1 min-w-0">
     <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">
      {name}
     </div>
     <div className="text-gray-600 dark:text-gray-400 text-xs">
      {description}
     </div>
     {specialty && (
      <div className="text-gray-500 dark:text-gray-500 text-xs mt-1 truncate">
       {specialty}
      </div>
     )}
    </div>
   </div>
  </div>
 );
}
