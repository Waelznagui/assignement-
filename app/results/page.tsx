'use client';
 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Question } from '@/lib/types';
 
interface QuizData {
  topic: string;
  questions: Question[];
}
 
interface ResultsState {
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: Array<{
    question: Question;
    userAnswer: string;
    isCorrect: boolean;
  }>;
}
 
export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<ResultsState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    // Load quiz data and answers from sessionStorage
    const quizDataStr = sessionStorage.getItem('quizData');
    const userAnswersStr = sessionStorage.getItem('quizAnswers');
 
    if (quizDataStr && userAnswersStr) {
      const quizData: QuizData = JSON.parse(quizDataStr);
      const userAnswers: { [key: number]: string } = JSON.parse(userAnswersStr);
 
      // Calculate results
      let score = 0;
      const answers = quizData.questions.map((question) => {
        const userAnswer = userAnswers[question.id] || '';
        const isCorrect = userAnswer === question.correctAnswer;
        if (isCorrect) score++;
 
        return {
          question,
          userAnswer,
          isCorrect,
        };
      });
 
      const totalQuestions = quizData.questions.length;
      const percentage = Math.round((score / totalQuestions) * 100);
 
      setResults({
        score,
        totalQuestions,
        percentage,
        answers,
      });
 
      setIsLoading(false);
    } else {
      // No data, redirect to home
      router.push('/');
    }
  }, [router]);
 
  if (isLoading || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading results...</p>
        </div>
      </div>
    );
  }
 
  const handleTryAgain = () => {
    sessionStorage.removeItem('quizData');
    sessionStorage.removeItem('quizAnswers');
    router.push('/');
  };
 
  // Determine score message and color
  const getScoreMessage = (percentage: number) => {
    if (percentage === 100) return { message: 'Perfect Score! 🎉', color: 'from-green-600 to-emerald-600' };
    if (percentage >= 80) return { message: 'Excellent Work! 🌟', color: 'from-blue-600 to-cyan-600' };
    if (percentage >= 60) return { message: 'Good Job! 👍', color: 'from-purple-600 to-pink-600' };
    if (percentage >= 40) return { message: 'Keep Practicing! 💪', color: 'from-orange-600 to-red-600' };
    return { message: 'Try Again! 🎯', color: 'from-red-600 to-orange-600' };
  };
 
  const scoreMessage = getScoreMessage(results.percentage);
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Score Card */}
        <Card className="backdrop-blur-xl bg-white/80 border-white/20 shadow-2xl mb-8 overflow-hidden">
          <div className={`bg-gradient-to-r ${scoreMessage.color} p-12 text-white text-center`}>
            <h1 className="text-5xl font-bold mb-4">{results.percentage}%</h1>
            <p className="text-2xl font-semibold mb-2">{scoreMessage.message}</p>
            <p className="text-lg opacity-90">
              You got {results.score} out of {results.totalQuestions} questions correct
            </p>
          </div>
 
          {/* Score Breakdown */}
          <div className="p-8">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-green-600">{results.score}</p>
                <p className="text-sm text-green-700 mt-1">Correct</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-3xl font-bold text-red-600">{results.totalQuestions - results.score}</p>
                <p className="text-sm text-red-700 mt-1">Incorrect</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-3xl font-bold text-blue-600">{results.totalQuestions}</p>
                <p className="text-sm text-blue-700 mt-1">Total</p>
              </div>
            </div>
          </div>
        </Card>
 
        {/* Answer Breakdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Answer Breakdown</h2>
 
          <div className="space-y-4">
            {results.answers.map((answer, index) => (
              <Card
                key={index}
                className={`backdrop-blur-xl border-2 shadow-lg animate-slide-up transition-all ${
                  answer.isCorrect
                    ? 'bg-green-50/80 border-green-200 hover:border-green-300'
                    : 'bg-red-50/80 border-red-200 hover:border-red-300'
                }`}
              >
                <div className="p-6">
                  {/* Question Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {answer.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-lg">
                        Question {index + 1}: {answer.question.question}
                      </p>
                    </div>
                  </div>
 
                  {/* Options Display */}
                  <div className="space-y-2 ml-10">
                    {answer.question.options.map((option, optionIndex) => {
                      const isUserAnswer = option === answer.userAnswer;
                      const isCorrectAnswer = option === answer.question.correctAnswer;
                      const isWrongAnswer = isUserAnswer && !isCorrectAnswer;
 
                      return (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border-2 text-sm ${
                            isCorrectAnswer
                              ? 'bg-green-100 border-green-400 text-green-900 font-semibold'
                              : isWrongAnswer
                              ? 'bg-red-100 border-red-400 text-red-900 font-semibold'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCorrectAnswer && <span className="text-lg">✓</span>}
                            {isWrongAnswer && <span className="text-lg">✗</span>}
                            <span>
                              {option}
                              {isCorrectAnswer && ' (Correct Answer)'}
                              {isWrongAnswer && ' (Your Answer)'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
 
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleTryAgain}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Try Another Quiz
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="px-8 py-6 text-lg"
          >
            Back to Home
          </Button>
        </div>
 
        {/* Footer Message */}
        <p className="text-center text-slate-600 text-sm mt-8 max-w-2xl mx-auto">
          {results.percentage === 100
            ? "Congratulations! You've mastered this topic. Try another one to expand your knowledge!"
            : results.percentage >= 80
            ? 'Great performance! Review the questions you missed to strengthen your understanding.'
            : 'Review the correct answers above and try again. Each attempt helps you learn better!'}
        </p>
      </div>
 
      {/* Animations */}
      <style jsx>{`
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
 
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
          animation-fill-mode: both;
        }
 
        @for $i from 0 to 20 {
          .animate-slide-up:nth-child(#{$i}) {
            animation-delay: #{$i * 0.1}s;
          }
        }
      `}</style>
    </div>
  );
}