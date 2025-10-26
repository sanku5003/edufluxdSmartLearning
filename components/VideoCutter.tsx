import React, { useState, ChangeEvent } from 'react';
import { extractVideoTimestamps } from '../services/geminiService';
import { VideoSegment } from '../types';
import LoadingSpinner from './LoadingSpinner';

export const VideoCutter: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [desiredSegments, setDesiredSegments] = useState<number>(3);
  const [specificTopic, setSpecificTopic] = useState<string>(''); // New state for specific topic
  const [segmentsResult, setSegmentsResult] = useState<VideoSegment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoTranscription, setVideoTranscription] = useState<string>(''); // Simulated video transcription

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      // Simulate transcription extraction for demo purposes
      setVideoTranscription(`
        [00:00:00] Hello everyone and welcome to our deep dive into the future of AI.
        [00:00:05] Today we're going to explore the latest advancements in large language models.
        [00:00:12] Specifically, we'll talk about the ethical implications and responsible AI development.
        [00:00:20] This is a crucial topic as AI becomes more integrated into our daily lives.
        [00:00:28] We'll also touch upon some practical applications, like automated content creation.
        [00:00:35] And how AI is revolutionizing data analysis across various industries.
        [00:00:42] Consider the impact on personalized education systems and individual learning paths.
        [00:00:50] The power of AI to transform complex datasets into actionable insights is immense.
        [00:00:58] Finally, we'll discuss the challenges of ensuring fairness and transparency in AI algorithms.
        [00:01:05] Thank you for joining us. Don't forget to like and subscribe!
      `);
    } else {
      setVideoFile(null);
      setVideoTranscription('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!videoFile) {
      setError('Please upload a video file.');
      return;
    }

    setLoading(true);
    setError(null);
    setSegmentsResult(null);

    try {
      // In a real application, the video would be sent to a backend for transcription.
      // For this frontend-only example, we're using simulated transcription.
      const result = await extractVideoTimestamps(videoTranscription, desiredSegments, specificTopic || undefined);
      setSegmentsResult(result);
    } catch (err) {
      console.error('Error extracting video timestamps:', err);
      setError(`Failed to extract timestamps: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format seconds into MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-800 rounded-xl shadow-xl border border-gray-700 animate-fade-in">
      <h2 className="text-4xl font-extrabold text-gray-100 mb-6 text-center">AI Video Cutter</h2>
      <p className="text-lg text-gray-300 mb-8 text-center">Upload a video and let AI intelligently suggest key segments for reels!</p>

      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label htmlFor="video-upload" className="block text-lg font-medium text-gray-200 mb-2">
            Upload Video File
          </label>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="block w-full text-gray-100
                       file:mr-4 file:py-3 file:px-6
                       file:rounded-full file:border-0
                       file:text-md file:font-semibold
                       file:bg-emerald-900 file:text-emerald-200
                       hover:file:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
          />
          {videoFile && <p className="mt-3 text-sm text-gray-400">Selected: {videoFile.name}</p>}
          {!videoFile && <p className="mt-3 text-sm text-red-500">Please select a file.</p>}
        </div>

        <div>
          <label htmlFor="desired-segments" className="block text-lg font-medium text-gray-200 mb-2">
            Number of Segments to Identify
          </label>
          <input
            id="desired-segments"
            type="number"
            value={desiredSegments}
            onChange={(e) => setDesiredSegments(Number(e.target.value))}
            min="1"
            max="10"
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
            required
          />
        </div>

        <div>
          <label htmlFor="specific-topic" className="block text-lg font-medium text-gray-200 mb-2">
            Specific Topic (Optional)
          </label>
          <input
            id="specific-topic"
            type="text"
            value={specificTopic}
            onChange={(e) => setSpecificTopic(e.target.value)}
            placeholder="e.g., AI ethics, data analysis"
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
          />
          <p className="mt-3 text-sm text-gray-400">
            If provided, AI will prioritize finding segments related to this topic.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !videoFile}
        >
          {loading ? 'Analyzing Video...' : 'Analyze Video & Get Segments'}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="mt-8 p-4 text-red-300 bg-red-900 border border-red-700 rounded-lg shadow-sm">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {segmentsResult && segmentsResult.length > 0 && (
        <div className="mt-10 pt-8 border-t-2 border-gray-700">
          <h3 className="text-3xl font-bold text-gray-100 mb-6 text-center">Suggested Video Segments</h3>
          <div className="space-y-7">
            {segmentsResult.map((segment, index) => (
              <div key={index} className="bg-emerald-900 p-6 rounded-lg shadow-md border border-emerald-800 animate-fade-in-up">
                <p className="text-xl font-semibold text-emerald-200 mb-2">
                  {index + 1}. {segment.segmentName}
                </p>
                <p className="text-gray-100 mb-2">
                  <span className="font-medium text-emerald-300">Time:</span> {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                </p>
                <p className="text-gray-100 mb-4">
                  <span className="font-medium text-emerald-300">Description:</span> {segment.description}
                </p>
                {segment.mockDownloadUrl && (
                  <a
                    href={segment.mockDownloadUrl}
                    download={`${segment.segmentName.replace(/\s/g, '_')}_segment.txt`}
                    className="inline-block bg-emerald-600 text-white text-md font-medium px-5 py-2.5 rounded-full hover:bg-emerald-500 transition-colors duration-200 transform hover:-translate-y-0.5 shadow-md"
                  >
                    Download Segment {index + 1} (Simulated)
                  </a>
                )}
              </div>
            ))}
            <div className="mt-8 p-4 text-md text-orange-300 bg-orange-900 rounded-lg border border-orange-700 shadow-sm animate-fade-in-up">
              <p className="font-semibold text-orange-200 mb-2">Important Note:</p>
              <p>
                In a full implementation, these "Download Segment" links would trigger a backend process
                (e.g., using FFmpeg as described in the workflow) to physically cut and provide the actual video files.
                Here, the download is simulated and will provide a text file with segment details.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};