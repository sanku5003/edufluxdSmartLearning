// components/QuizGenerator.tsx
import React, { useState, ChangeEvent } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';
import LoadingSpinner from './LoadingSpinner';

export const QuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [quizResult, setQuizResult] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topic || numQuestions <= 0) {
      setError('Please provide a valid topic and number of questions.');
      return;
    }

    setLoading(true);
    setError(null);
    setQuizResult(null);
    setCurrentAnswers({});
    setScore(null);
    setShowResults(false);

    try {
      const result = await generateQuiz(topic, numQuestions);
      setQuizResult(result);
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError(`Failed to generate quiz: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, selectedOption: string) => {
    setCurrentAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const calculateScore = () => {
    if (!quizResult) return;
    let correctCount = 0;
    quizResult.forEach((question, index) => {
      if (currentAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setTopic('');
    setNumQuestions(5);
    setQuizResult(null);
    setLoading(false);
    setError(null);
    setCurrentAnswers({});
    setScore(null);
    setShowResults(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-800 rounded-xl shadow-xl border border-gray-700 animate-fade-in">
      <h2 className="text-4xl font-extrabold text-gray-100 mb-6 text-center">AI Quiz Generator</h2>
      <p className="text-lg text-gray-300 mb-8 text-center">
        Generate custom quizzes on any topic with AI assistance!
      </p>

      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label htmlFor="topic" className="block text-lg font-medium text-gray-200 mb-2">
            Quiz Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., World History, JavaScript Fundamentals, Climate Change"
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
            required
          />
        </div>

        <div>
          <label htmlFor="num-questions" className="block text-lg font-medium text-gray-200 mb-2">
            Number of Questions
          </label>
          <input
            id="num-questions"
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Math.max(1, Math.min(10, Number(e.target.value))))} // Limit between 1 and 10
            min="1"
            max="10"
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
            required
          />
          <p className="mt-3 text-sm text-gray-400">
            For optimal results, please choose between 1 and 10 questions.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !topic || numQuestions <= 0}
        >
          {loading ? 'Generating Quiz...' : 'Generate Quiz'}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="mt-8 p-4 text-red-300 bg-red-900 border border-red-700 rounded-lg shadow-sm">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {quizResult && quizResult.length > 0 && (
        <div className="mt-10 pt-8 border-t-2 border-gray-700">
          <h3 className="text-3xl font-bold text-gray-100 mb-6 text-center">Your Quiz on {topic}</h3>
          <div className="space-y-8">
            {quizResult.map((q, qIndex) => (
              <div key={qIndex} className="bg-emerald-900 p-6 rounded-lg shadow-md border border-emerald-800 animate-fade-in-up">
                <p className="text-xl font-semibold text-emerald-200 mb-3">
                  {qIndex + 1}. {q.question}
                </p>
                <div className="space-y-3 ml-4">
                  {q.options.map((option, oIndex) => (
                    <label key={oIndex} className="flex items-center text-gray-100 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={option}
                        checked={currentAnswers[qIndex] === option}
                        onChange={() => handleAnswerChange(qIndex, option)}
                        className="form-radio h-4 w-4 text-emerald-600 focus:ring-emerald-500 transition-colors duration-200"
                        disabled={showResults}
                      />
                      <span className="ml-3 text-lg">{option}</span>
                      {showResults && option === q.correctAnswer && (
                        <span className="ml-3 text-green-400 font-semibold">(Correct)</span>
                      )}
                      {showResults && currentAnswers[qIndex] === option && option !== q.correctAnswer && (
                        <span className="ml-3 text-red-400 font-semibold">(Your Answer)</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            {!showResults ? (
              <button
                onClick={calculateScore}
                className="py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={Object.keys(currentAnswers).length !== quizResult.length}
              >
                Submit Quiz
              </button>
            ) : (
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-400 mb-4">
                  Your Score: {score}/{quizResult.length}
                </p>
                <button
                  onClick={resetQuiz}
                  className="py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Generate New Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};