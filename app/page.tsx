'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
export default function Home() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate input
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    if (numberOfQuestions < 1 || numberOfQuestions > 10) {
      setError('Number of questions must be between 1 and 10');
      return;
    }

    setIsLoading(true);

    try {
      // Call the API
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          numberOfQuestions,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to generate quiz');
        setIsLoading(false);
        return;
      }

      // Store quiz data in session storage
      sessionStorage.setItem('quizData', JSON.stringify(data));

      // Navigate to quiz page
      router.push('/quiz');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen..."
    >
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Quiz<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Master</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
            Generate AI-powered quizzes on any topic you want to master. Learn smarter, not harder.
          </p>
        </div>

        {/* Main Card */}
        <Card className="backdrop-blur-xl bg-white/80 border-white/20 shadow-2xl animate-slide-up">
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Topic Input */}
              <div className="space-y-3">
                <label htmlFor="topic" className="block text-sm font-semibold text-slate-900">
                  What topic do you want to learn about?
                </label>
                <Input
                  id="topic"
                  type="text"
                  placeholder="e.g., Python Basics, French Revolution, Quantum Physics"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isLoading}
                  className="px-4 py-3 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
                />
                <p className="text-xs text-slate-500">
                  Be specific or general – our AI adapts to any topic
                </p>
              </div>

              {/* Number of Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="questions" className="text-sm font-semibold text-slate-900">
                    Number of questions
                  </label>
                  <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                    {numberOfQuestions}
                  </span>
                </div>
                <input
                  id="questions"
                  type="range"
                  min="1"
                  max="10"
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                  disabled={isLoading}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>1 question</span>
                  <span>10 questions</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="w-full py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating your quiz...</span>
                  </div>
                ) : (
                  <span>Generate Quiz</span>
                )}
              </Button>
            </form>

            {/* Info Footer */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="font-semibold text-slate-900">⚡ Fast</p>
                  <p className="text-slate-500 text-xs mt-1">Generate instantly</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">🎯 Accurate</p>
                  <p className="text-slate-500 text-xs mt-1">AI-powered content</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">📚 Learn</p>
                  <p className="text-slate-500 text-xs mt-1">Any topic</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          No sign-up required • Completely free • Powered by AI
        </p>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
    </motion.div>
  );
}