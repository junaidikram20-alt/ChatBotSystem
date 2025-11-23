'use client';
import {Send, Mic} from 'lucide-react';
import {useState} from 'react';

export default function Composer({
 onSend,
 disabled,
 placeholder = 'Type your message...',
}) {
 const [text, setText] = useState('');

 const handleSubmit = (e) => {
  e.preventDefault();
  const t = text.trim();
  if (!t || disabled) return;
  onSend?.(t);
  setText('');
 };

 return (
  <form onSubmit={handleSubmit} className="relative">
   <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-bot1 focus-within:border-transparent transition">
    <button
     type="button"
     className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
     aria-label="Voice input"
    >
     <Mic className="h-4 w-4" />
    </button>

    <input
     className="flex-1 px-2 py-2 outline-none bg-transparent text-gray-900 dark:text-gray-500 placeholder-gray-500 dark:placeholder-gray-400"
     placeholder={placeholder}
     value={text}
     onChange={(e) => setText(e.target.value)}
     disabled={disabled}
    />

    <button
     type="submit"
     disabled={!text.trim() || disabled}
     className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gradient-to-r from-bot1 to-bot2 text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
     aria-label="Send message"
    >
     <Send className="h-4 w-4" />
    </button>
   </div>
  </form>
 );
}
