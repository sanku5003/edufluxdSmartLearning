import React, { useState, ChangeEvent } from 'react';
import { generateScheduleFromDocument, generateScheduleByTopicAndDifficulty, fileToBase64 } from '../services/geminiService';
import { ScheduledEvent } from '../types';
import LoadingSpinner from './LoadingSpinner';

type PrimaryMode = 'ai' | 'manual';
type AIGenerationMode = 'document' | 'topic';

export const Scheduler: React.FC = () => {
  // Common states for AI generation
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string>(today);
  const [durationWeeks, setDurationWeeks] = useState<number>(4);

  // States for AI modes
  const [primaryMode, setPrimaryMode] = useState<PrimaryMode>('ai');
  const [aiGenerationMode, setAIGenerationMode] = useState<AIGenerationMode>('topic');

  // AI - Generate from Document states
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState<string>(''); // Simulated PDF content

  // AI - Generate by Topic states
  const [learningTopic, setLearningTopic] = useState<string>('');
  const [difficultyLevel, setDifficultyLevel] = useState<string>('Beginner');

  // Manual states
  const [manualEvents, setManualEvents] = useState<ScheduledEvent[]>([]);
  const [manualDate, setManualDate] = useState<string>(today);
  const [manualTopic, setManualTopic] = useState<string>('');
  const [manualActivity, setManualActivity] = useState<string>('');

  // Common result/loading/error states
  const [scheduleResult, setScheduleResult] = useState<ScheduledEvent[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
      // Simulate PDF content extraction for demo purposes
      setDocumentContent(`This is simulated content from ${file.name}. It discusses various topics like React, TypeScript, AI, machine learning, and natural language processing. Key concepts include components, hooks, state management, API integration, model training, data analysis, and ethical AI considerations. EduFlux aims to provide tools for learning and assessment in these areas. For example, a question could be about the purpose of React hooks, or the importance of ethical AI in model deployment. The document details a 4-week learning plan covering: Week 1: Introduction to AI, Week 2: Machine Learning Fundamentals, Week 3: Deep Learning Concepts, Week 4: Ethical AI and Project Work.`);
    } else {
      setPdfFile(null);
      setDocumentContent('');
    }
  };

  const handleAIGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setScheduleResult(null);

    try {
      let result: ScheduledEvent[];
      if (aiGenerationMode === 'document') {
        if (!pdfFile || !documentContent) {
          setError('Please upload a document for document-based generation.');
          setLoading(false);
          return;
        }
        result = await generateScheduleFromDocument(documentContent, startDate, durationWeeks);
      } else { // topic mode
        if (!learningTopic) {
          setError('Please provide a learning topic for topic-based generation.');
          setLoading(false);
          return;
        }
        result = await generateScheduleByTopicAndDifficulty(learningTopic, difficultyLevel, startDate, durationWeeks);
      }
      setScheduleResult(result);
    } catch (err) {
      console.error('Error generating schedule:', err);
      setError(`Failed to generate schedule: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!manualDate || !manualTopic || !manualActivity) {
      setError('Please fill in all fields for the manual event.');
      return;
    }
    const newEvent: ScheduledEvent = {
      date: manualDate,
      topic: manualTopic,
      activities: [manualActivity],
    };
    setManualEvents((prev) => [...prev, newEvent]);
    setManualDate(today); // Reset date to today for next entry
    setManualTopic('');
    setManualActivity('');
    setError(null);
  };

  const handleClearManualSchedule = () => {
    setManualEvents([]);
  };


  // Helper to format date for display
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-800 rounded-xl shadow-xl border border-gray-700 animate-fade-in">
      <h2 className="text-4xl font-extrabold text-gray-100 mb-6 text-center">Study Scheduler</h2>
      <p className="text-lg text-gray-300 mb-8 text-center">
        Choose your preferred method to create a study schedule.
      </p>

      {/* Primary Mode Selection */}
      <div className="flex justify-center mb-10 space-x-6">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-emerald-600 focus:ring-emerald-500"
            value="ai"
            checked={primaryMode === 'ai'}
            onChange={() => {setPrimaryMode('ai'); setError(null); setScheduleResult(null);}}
          />
          <span className="ml-2 text-xl text-gray-200 font-semibold">AI Schedule Generation</span>
        </label>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-emerald-600 focus:ring-emerald-500"
            value="manual"
            checked={primaryMode === 'manual'}
            onChange={() => {setPrimaryMode('manual'); setError(null); setManualEvents([]);}}
          />
          <span className="ml-2 text-xl text-gray-200 font-semibold">Manual Schedule Creation</span>
        </label>
      </div>

      {primaryMode === 'ai' && (
        <div className="border border-emerald-800 rounded-xl p-8 bg-emerald-900 shadow-md animate-fade-in-up">
          <h3 className="text-3xl font-bold text-emerald-200 mb-5 text-center">AI Schedule Generation</h3>
          <p className="text-gray-200 mb-8 text-center">Let EduFlux AI craft a tailored study plan for you!</p>

          {/* AI Generation Mode Selection */}
          <div className="flex justify-center mb-8 space-x-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-emerald-600 focus:ring-emerald-500"
                value="topic"
                checked={aiGenerationMode === 'topic'}
                onChange={() => {setAIGenerationMode('topic'); setError(null); setScheduleResult(null);}}
              />
              <span className="ml-2 text-lg text-gray-200 font-medium">Generate by Topic</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-emerald-600 focus:ring-emerald-500"
                value="document"
                checked={aiGenerationMode === 'document'}
                onChange={() => {setAIGenerationMode('document'); setError(null); setScheduleResult(null);}}
              />
              <span className="ml-2 text-lg text-gray-200 font-medium">Generate from Document</span>
            </label>
          </div>

          <form onSubmit={handleAIGenerate} className="space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="start-date" className="block text-lg font-medium text-gray-200 mb-2">
                  Start Date
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
                  required
                />
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
                  max="52"
                  className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
                  required
                />
              </div>
            </div>

            {aiGenerationMode === 'document' ? (
              <div className="space-y-7">
                <div>
                  <label htmlFor="pdf-upload" className="block text-lg font-medium text-gray-200 mb-2">
                    Upload Document (PDF, TXT, DOCX - simulated)
                  </label>
                  <input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf,.txt,.docx"
                    onChange={handleFileChange}
                    className="block w-full text-gray-100
                              file:mr-4 file:py-3 file:px-6
                              file:rounded-full file:border-0
                              file:text-md file:font-semibold
                              file:bg-emerald-900 file:text-emerald-200
                              hover:file:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
                  />
                  {pdfFile && <p className="mt-3 text-sm text-gray-400">Selected: {pdfFile.name}</p>}
                  {!pdfFile && <p className="mt-3 text-sm text-red-500">Please select a file.</p>}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !pdfFile || !documentContent}
                >
                  {loading ? 'Generating...' : 'Generate Schedule from Document'}
                </button>
              </div>
            ) : ( // aiGenerationMode === 'topic'
              <div className="space-y-7">
                <div>
                  <label htmlFor="learning-topic" className="block text-lg font-medium text-gray-200 mb-2">
                    Learning Topic
                  </label>
                  <input
                    id="learning-topic"
                    type="text"
                    value={learningTopic}
                    onChange={(e) => setLearningTopic(e.target.value)}
                    placeholder="e.g., Quantum Physics, Advanced Algorithms"
                    className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="difficulty-level" className="block text-lg font-medium text-gray-200 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty-level"
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !learningTopic}
                >
                  {loading ? 'Generating...' : 'Generate Schedule by Topic'}
                </button>
              </div>
            )}
          </form>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="mt-8 p-4 text-red-300 bg-red-900 border border-red-700 rounded-lg shadow-sm">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {scheduleResult && scheduleResult.length > 0 && (
            <div className="mt-10 pt-8 border-t-2 border-gray-700">
              <h3 className="text-3xl font-bold text-gray-100 mb-6 text-center">Generated Study Schedule</h3>
              <div className="space-y-7">
                {scheduleResult.map((event, index) => (
                  <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600 animate-fade-in-up">
                    <p className="text-xl font-semibold text-gray-100 mb-2">
                      <span className="text-emerald-300 mr-2">Date:</span> {formatDate(event.date)}
                    </p>
                    <p className="text-lg text-gray-100 mb-3">
                      <span className="font-medium text-emerald-300">Topic:</span> {event.topic}
                    </p>
                    <p className="font-medium text-emerald-300 mb-2">Activities:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-100 ml-4">
                      {event.activities.map((activity, i) => (
                        <li key={i} className="py-1">{activity}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {primaryMode === 'manual' && (
        <div className="border border-orange-700 rounded-xl p-8 bg-orange-900 shadow-md animate-fade-in-up">
          <h3 className="text-3xl font-bold text-orange-200 mb-5 text-center">Manual Schedule Creation</h3>
          <p className="text-gray-200 mb-8 text-center">Add individual study events to build your custom schedule.</p>

          <form onSubmit={handleAddManualEvent} className="space-y-7 mb-8">
            <div>
              <label htmlFor="manual-date" className="block text-lg font-medium text-gray-200 mb-2">
                Date
              </label>
              <input
                id="manual-date"
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-lg transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="manual-topic" className="block text-lg font-medium text-gray-200 mb-2">
                Topic
              </label>
              <input
                id="manual-topic"
                type="text"
                value={manualTopic}
                onChange={(e) => setManualTopic(e.target.value)}
                placeholder="e.g., React Hooks"
                className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-lg transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="manual-activity" className="block text-lg font-medium text-gray-200 mb-2">
                Activity
              </label>
              <input
                id="manual-activity"
                type="text"
                value={manualActivity}
                onChange={(e) => setManualActivity(e.target.value)}
                placeholder="e.g., Read documentation, Complete coding challenge"
                className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-lg transition-colors duration-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:-translate-y-1"
            >
              Add Event
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 text-red-300 bg-red-900 border border-red-700 rounded-lg shadow-sm">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {manualEvents.length > 0 && (
            <div className="mt-10 pt-8 border-t-2 border-gray-700">
              <h3 className="text-3xl font-bold text-gray-100 mb-6 text-center">Your Manual Schedule</h3>
              <div className="space-y-7">
                {manualEvents
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((event, index) => (
                    <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600 animate-fade-in-up">
                      <p className="text-xl font-semibold text-gray-100 mb-2">
                        <span className="text-orange-300 mr-2">Date:</span> {formatDate(event.date)}
                      </p>
                      <p className="text-lg text-gray-100 mb-3">
                        <span className="font-medium text-orange-300">Topic:</span> {event.topic}
                      </p>
                      <p className="font-medium text-orange-300 mb-2">Activities:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-100 ml-4">
                        {event.activities.map((activity, i) => (
                          <li key={i} className="py-1">{activity}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleClearManualSchedule}
                  className="py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Clear Manual Schedule
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};