'use client';
 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Question } from '@/lib/types';
 
interface QuizData {
  topic: string;
  questions: Question[];
}
 
export default function QuizPage() {
  const router = useRouter();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
 
  // Load quiz data from sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem('quizData');
    if (data) {
      const parsed = JSON.parse(data);
      setQuizData(parsed);
      setIsLoading(false);
    } else {
      // No quiz data, redirect to home
      router.push('/');
    }
  }, [router]);
 
  if (isLoading || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading quiz...</p>
        </div>
      </div>
    );
  }
 
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;
  const selectedAnswer = userAnswers[currentQuestion.id];
 
  const handleAnswerSelect = (answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: answer,
    });
  };
 
  const handleNext = () => {
    if (isLastQuestion) {
      // All questions answered, go to results
      sessionStorage.setItem(
        'quizAnswers',
        JSON.stringify(userAnswers)
      );
      router.push('/results');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
 
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {quizData.topic}
              </h1>
              <p className="text-slate-600 mt-1">
                Question {currentQuestionIndex + 1} of {quizData.questions.length}
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-slate-500 hover:text-slate-700 transition"
              title="Exit quiz"
            >
              ✕
            </button>
          </div>
 
          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />
        </div>
 
        {/* Question Card */}
        <Card className="backdrop-blur-xl bg-white/80 border-white/20 shadow-2xl mb-8 animate-slide-up">
          <div className="p-8">
            {/* Question */}
            <div className="mb-8">
              <p className="text-lg md:text-xl font-semibold text-slate-900 leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>
 
            {/* Options */}
            <RadioGroup value={selectedAnswer || ''} onValueChange={handleAnswerSelect}>
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                    <div 
                        key={index} 
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                        selectedAnswer === option 
                            ? 'border-blue-500 bg-blue-50 scale-102 shadow-md shadow-blue-200' 
                            : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 hover:scale-101'
                        }`}
                    >
                        <RadioGroupItem
                        value={option}
                        id={`option-${index}`}
                        className="cursor-pointer"
                        />
                        <label
                        htmlFor={`option-${index}`}
                        className={`flex-1 cursor-pointer font-medium transition-all duration-200 ${
                            selectedAnswer === option
                            ? 'text-blue-900'
                            : 'text-slate-700 group-hover:text-slate-900'
                        }`}
                        >
                        {option}
                        </label>
                    </div>
                    ))}
                </div>
            </RadioGroup>
          </div>
        </Card>
 
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
 
          <div className="text-sm text-slate-600 font-medium">
            {currentQuestionIndex + 1} / {quizData.questions.length}
          </div>
 
          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastQuestion ? 'Finish' : 'Next'}
            {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
 
        {/* Helper Text */}
        {!selectedAnswer && (
          <p className="text-center text-sm text-slate-500 mt-6">
            ← Select an answer to continue →
          </p>
        )}
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
        }
      `}</style>
    </div>
  );
}