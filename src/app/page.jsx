'use client';
import { useState, useRef, useEffect } from 'react';
import BotBadge from '@/components/BotBadge';
import MessageBubble from '@/components/MessageBubble';
import Composer from '@/components/Composer';
import TopicSelector from '@/components/TopicSelector';
import DebateControls from '@/components/DebateControls';

const THERAPISTS = {
  chen: {
    name: 'Dr. Sarah Chen',
    description: 'Evidence-Based Practitioner',
    color: 'bot1',
    specialty: 'Cognitive Behavioral Therapy',
    icon: 'brain',
    prompt: "You are Dr. Sarah Chen, an evidence-based therapist who believes in structured, research-backed methods. You often cite studies and statistics, advocate for Cognitive Behavioral Therapy, and are pragmatic and solution-focused. Use clinical terminology and reference specific research when possible."
  },
  williams: {
    name: 'Dr. James Williams', 
    description: 'Holistic Healer',
    color: 'bot2',
    specialty: 'Mindfulness & Meditation',
    icon: 'heart',
    prompt: "You are Dr. James Williams, a holistic healer who emphasizes mind-body-spirit connection. You incorporate meditation and mindfulness, reference Eastern philosophy, and communicate in a calm, reflective style. Focus on holistic wellbeing and spiritual balance."
  },
  rodriguez: {
    name: 'Dr. Maria Rodriguez',
    description: 'Analytical Psychologist',
    color: 'bot3',
    specialty: 'Psychoanalytic Approach',
    icon: 'search',
    prompt: "You are Dr. Maria Rodriguez, an analytical psychologist who focuses on understanding root causes. You explore childhood and past experiences, advocate for long-term therapeutic relationships, and use empathetic but probing questioning. Dive deep into psychological analysis."
  },
  user: {
    name: 'You',
    description: 'Participant',
    color: 'bot4',
    specialty: 'Your Perspective',
    icon: 'user'
  }
};


const DEBATE_TOPICS = {
  anxiety: {
    title: 'Best Approaches for Treating Anxiety',
    description: 'Comparing different therapeutic interventions',
    prompt: "Discuss the most effective approaches for treating anxiety disorders. Compare CBT, mindfulness, psychoanalytic approaches, and medication. Consider short-term vs long-term effectiveness, side effects, and patient suitability."
  },
  digital: {
    title: 'Digital Therapy vs Traditional Sessions', 
    description: 'The role of technology in mental health',
    prompt: "Debate the merits of digital therapy platforms versus traditional in-person sessions. Consider accessibility, effectiveness, therapeutic alliance, privacy concerns, and the future of mental health care."
  },
  worklife: {
    title: 'Work-Life Balance in Modern Times',
    description: 'Strategies for preventing burnout',
    prompt: "Discuss work-life balance challenges in today's fast-paced world. Explore strategies for preventing burnout, setting boundaries, mindfulness practices, and organizational approaches to employee mental health."
  }
};

export default function TherapistDebate() {
  const [activeTopic, setActiveTopic] = useState('anxiety');
  const [messages, setMessages] = useState([]);
  const [isDebateActive, setIsDebateActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typingTherapist, setTypingTherapist] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 👈 NEW: mobile sidebar toggle state
  const messagesEndRef = useRef(null);

  // Close sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
  
    useEffect(() => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
      const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = stored || (prefersDark ? 'dark' : 'light');
      setTheme(initialTheme);
    }, []);
  
    useEffect(() => {
      const root = typeof document !== 'undefined' ? document.documentElement : null;
      if (!root) return;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    }, [theme]);
  
    const toggleTheme = () => {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };
  
    const callOpenAI = async (prompt, therapist) => {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `${therapist.prompt} Current debate topic: ${DEBATE_TOPICS[activeTopic].title}. ${DEBATE_TOPICS[activeTopic].prompt} Keep responses under 150 words and maintain your therapeutic approach.`
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 200,
            temperature: 0.8
          })
        });
  
        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
  
        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error('Error calling OpenAI:', error);
        // Fallback responses if API fails
        const fallbacks = {
          chen: "Based on current research in cognitive behavioral therapy, the evidence suggests...",
          williams: "From a holistic perspective, we must consider the interconnectedness of mind, body and spirit...",
          rodriguez: "Analyzing this from a psychodynamic viewpoint, we should explore the underlying unconscious processes..."
        };
        return fallbacks[therapist] || "I believe this approach has significant merit and warrants further discussion.";
      }
    };
  
    const simulateDebate = async () => {
      setIsDebateActive(true);
      setIsLoading(true);
      setMessages([]);
      
      try {
        // Start with Dr. Chen
        setTypingTherapist('chen');
        const chenResponse = await callOpenAI(
          "Start the debate by introducing your perspective on this topic. Be concise and professional.",
          THERAPISTS.chen
        );
        
        setMessages(prev => [...prev, {
          role: 'chen',
          content: chenResponse,
          timestamp: new Date()
        }]);
  
        // Dr. Williams responds
        setTypingTherapist('williams');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const williamsResponse = await callOpenAI(
          `Respond to Dr. Chen's perspective: "${chenResponse}". Offer your holistic viewpoint.`,
          THERAPISTS.williams
        );
  
        setMessages(prev => [...prev, {
          role: 'williams',
          content: williamsResponse,
          timestamp: new Date()
        }]);
  
        // Dr. Rodriguez joins
        setTypingTherapist('rodriguez');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const rodriguezResponse = await callOpenAI(
          `Respond to both previous speakers. Dr. Chen said: "${chenResponse}" and Dr. Williams said: "${williamsResponse}". Provide your analytical perspective.`,
          THERAPISTS.rodriguez
        );
  
        setMessages(prev => [...prev, {
          role: 'rodriguez',
          content: rodriguezResponse,
          timestamp: new Date()
        }]);
  
      } catch (error) {
        console.error('Debate simulation error:', error);
      } finally {
        setTypingTherapist(null);
        setIsLoading(false);
      }
    };
  
    const handleSend = async (text) => {
      if (!text.trim()) return;
  
      const userMessage = {
        role: 'user',
        content: text,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
  
      try {
        // Random therapist responds to user
        const therapists = ['chen', 'williams', 'rodriguez'];
        const randomTherapist = therapists[Math.floor(Math.random() * therapists.length)];
        const therapist = THERAPISTS[randomTherapist];
        
        setTypingTherapist(randomTherapist);
        
        const aiResponse = await callOpenAI(
          `A participant in our debate just said: "${text}". Please respond to their point while maintaining your therapeutic approach and continuing the discussion about ${DEBATE_TOPICS[activeTopic].title}.`,
          therapist
        );
  
        setMessages(prev => [...prev, {
          role: randomTherapist,
          content: aiResponse,
          timestamp: new Date()
        }]);
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setTypingTherapist(null);
        setIsLoading(false);
      }
    };
  
    const exportTranscript = () => {
      const transcript = {
        topic: DEBATE_TOPICS[activeTopic].title,
        description: DEBATE_TOPICS[activeTopic].description,
        timestamp: new Date().toISOString(),
        messages: messages.map(msg => ({
          speaker: THERAPISTS[msg.role].name,
          role: msg.role,
          message: msg.content,
          timestamp: msg.timestamp.toISOString()
        }))
      };
  
      // Export as JSON
      const blob = new Blob([JSON.stringify(transcript, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `therapy-debate-${activeTopic}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };
  
    const resetDebate = () => {
      setMessages([]);
      setIsDebateActive(false);
      setTypingTherapist(null);
    };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Toggle Button (visible only on mobile) */}
      
      <button
        className={`${isSidebarOpen ? "hidden" : 'block'} md:hidden fixed top-4 right-4 z-20 rounded-md shadow-md text-gray-900 dark:text-white `}
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`absolute md:relative z-10 w-full md:w-[400px] h-full max-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-12 md:pt-6"> {/* Add top padding on mobile to avoid overlap with toggle */}
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Therapy Debate
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Three AI therapists discuss mental health topics. Join as the fourth participant.
            </p>
          </div>

          {/* Therapist Panel */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Therapist Panel
            </h2>
            <div className="space-y-3">
              {Object.entries(THERAPISTS).map(([id, meta]) => (
                <BotBadge
                  key={id}
                  id={id}
                  name={meta.name}
                  description={meta.description}
                  specialty={meta.specialty}
                  color={meta.color}
                  icon={meta.icon}
                />
              ))}
            </div>
          </div>

          {/* Topic Selector */}
          <TopicSelector
            topics={DEBATE_TOPICS}
            activeTopic={activeTopic}
            onTopicChange={setActiveTopic}
            disabled={isDebateActive || messages.length > 0}
            hasMessages={messages.length > 0}
          />
          {/* Debate Controls */}
          <DebateControls
            isDebateActive={isDebateActive}
            isLoading={isLoading}
            hasMessages={messages.length > 0}
            onStartDebate={simulateDebate}
            onExport={exportTranscript}
            onReset={resetDebate}
          />
        </div>

        {/* Close button on mobile */}
        <button
          className="md:hidden absolute top-4 right-4 p-2 text-gray-500 dark:text-gray-400"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      {/* Backdrop for mobile (closes sidebar when clicked) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-0 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full max-h-screen h-screen md:h-auto overflow-hidden">
        {/* Chat Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {DEBATE_TOPICS[activeTopic].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {DEBATE_TOPICS[activeTopic].description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 transition hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="text-lg">{theme === 'dark' ? '🌙' : '☀️'}</span>
                <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
              {isDebateActive && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live Debate
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-bot1 to-bot2 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Ready to Start the Debate
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Choose a topic and click "Start Debate" to begin the conversation between our AI therapists.
                </p>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              role={message.role}
              content={message.content}
              therapist={THERAPISTS[message.role]}
              timestamp={message.timestamp}
            />
          ))}

          {typingTherapist && (
            <MessageBubble
              role={typingTherapist}
              content={null}
              therapist={THERAPISTS[typingTherapist]}
              isTyping={true}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <Composer
            onSend={handleSend}
            disabled={isLoading || (!isDebateActive && messages.length === 0)}
            placeholder={
              !isDebateActive && messages.length === 0
                ? 'Start the debate to join the conversation...'
                : 'Type your question or comment...'
            }
          />
        </div>
      </div>
    </div>
  );
}