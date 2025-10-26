import React, { useState } from 'react';
import { generateCourseOutline } from '../services/geminiService';
import { CourseOutline } from '../types';
import LoadingSpinner from './LoadingSpinner';

export const CourseGenerator: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [learningOutcomes, setLearningOutcomes] = useState<string>('');
  const [durationWeeks, setDurationWeeks] = useState<number>(4);
  const [courseOutline, setCourseOutline] = useState<CourseOutline | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subject || !learningOutcomes) {
      setError('Please provide a subject and desired learning outcomes.');
      return;
    }

    setLoading(true);
    setError(null);
    setCourseOutline(null);

    try {
      const result = await generateCourseOutline(subject, learningOutcomes, durationWeeks);
      setCourseOutline(result);
    } catch (err) {
      console.error('Error generating course outline:', err);
      setError(`Failed to generate course outline: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-800 rounded-xl shadow-xl border border-gray-700 animate-fade-in">
      <h2 className="text-4xl font-extrabold text-gray-100 mb-6 text-center">AI Course Generator</h2>
      <p className="text-lg text-gray-300 mb-8 text-center">
        Define your subject and learning goals, and let AI build a structured course outline for you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label htmlFor="subject" className="block text-lg font-medium text-gray-200 mb-2">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Quantum Computing, Advanced React Patterns"
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
            required
          />
        </div>

        <div>
          <label htmlFor="learning-outcomes" className="block text-lg font-medium text-gray-200 mb-2">
            Desired Learning Outcomes
          </label>
          <textarea
            id="learning-outcomes"
            value={learningOutcomes}
            onChange={(e) => setLearningOutcomes(e.target.value)}
            rows={6}
            placeholder="e.g., Understand the principles of quantum entanglement, develop custom React hooks, deploy serverless applications..."
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="duration-weeks" className="block text-lg font-medium text-gray-200 mb-2">
            Duration (Weeks)
          </label>
          <input
            id="duration-weeks"
            type="number"
            value={durationWeeks}
            onChange={(e) => setDurationWeeks(Number(e.target.value))}
            min="1"
            max="24"
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !subject || !learningOutcomes}
        >
          {loading ? 'Generating...' : 'Generate Course Outline'}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="mt-8 p-4 text-red-300 bg-red-900 border border-red-700 rounded-lg shadow-sm">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {courseOutline && courseOutline.length > 0 && (
        <div className="mt-10 pt-8 border-t-2 border-gray-700">
          <h3 className="text-3xl font-bold text-gray-100 mb-6 text-center">Generated Course Outline</h3>
          <div className="space-y-8">
            {courseOutline.map((module, moduleIndex) => (
              <div key={moduleIndex} className="bg-emerald-900 p-6 rounded-lg shadow-md border border-emerald-800 animate-fade-in-up">
                <h4 className="text-xl font-extrabold text-emerald-200 mb-3">
                  Module {moduleIndex + 1}: {module.title}
                </h4>
                <p className="text-gray-200 mb-4 leading-relaxed">{module.description}</p>

                <div className="space-y-5 ml-4">
                  {module.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-600">
                      <p className="text-lg font-semibold text-gray-100 mb-2">
                        {topicIndex + 1}. {topic.title}
                      </p>
                      {topic.objectives && topic.objectives.length > 0 && (
                        <div>
                          <p className="font-medium text-emerald-300 mb-1">Learning Objectives:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-200 ml-4">
                            {topic.objectives.map((objective, objIndex) => (
                              <li key={objIndex} className="py-1">{objective.objective}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};