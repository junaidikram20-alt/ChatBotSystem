'use client';

const colorMap = {
 bot1: 'bg-gradient-to-r from-bot1/10 to-bot1/5 border-l-4 border-bot1',
 bot2: 'bg-gradient-to-r from-bot2/10 to-bot2/5 border-l-4 border-bot2',
 bot3: 'bg-gradient-to-r from-bot3/10 to-bot3/5 border-l-4 border-bot3',
 bot4: 'bg-gradient-to-r from-bot4/10 to-bot4/5 border-l-4 border-bot4',
};

export default function MessageBubble({
 role,
 content,
 therapist,
 timestamp,
 isTyping = false,
}) {
 const isUser = role === 'user';

 return (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
   <div
    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
        ${
         isUser
          ? 'bg-gradient-to-r from-bot4/10 to-bot4/5 border-l-4 border-bot4'
          : colorMap[therapist?.color] || 'bg-gray-100 dark:bg-gray-700'
        }`}
   >
    {!isUser && (
     <div className="flex items-center gap-2 mb-2">
      <div className="font-semibold text-gray-900 dark:text-white text-sm">
       {therapist?.name}
      </div>
      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
      <div className="text-gray-500 dark:text-gray-400 text-xs">
       {therapist?.description}
      </div>
     </div>
    )}

    {isTyping ? (
     <div className="flex space-x-1 items-center">
      <div className="text-gray-500 dark:text-gray-400 text-sm">Thinking</div>
      <div className="flex space-x-1 ml-2">
       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
       <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{animationDelay: '0.1s'}}
       ></div>
       <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{animationDelay: '0.2s'}}
       ></div>
      </div>
     </div>
    ) : (
     <div className="text-gray-800 dark:text-gray-200">{content}</div>
    )}

    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
     {timestamp?.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
    </div>
   </div>
  </div>
 );
}
