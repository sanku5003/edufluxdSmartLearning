import React, { useState, ChangeEvent } from 'react';
import { analyzeResume, fileToBase64 } from '../services/geminiService';
import { ResumeAnalysis } from '../types';
import LoadingSpinner from './LoadingSpinner';

export const ResumeAnalyzer: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [focusRole, setFocusRole] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeContent, setResumeContent] = useState<string>(''); // Simulated resume content

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      // Simulate resume content extraction for demo purposes
      setResumeContent(`John Doe
Email: john.doe@example.com | Phone: 555-123-4567 | LinkedIn: linkedin.com/in/johndoe

Summary: Highly motivated software engineer with 5 years of experience in full-stack development using React, Node.js, and PostgreSQL. Proven ability to deliver high-quality code and contribute to scalable web applications. Seeking to leverage expertise in a challenging role.

Experience:
Senior Software Engineer | Tech Solutions Inc. | 2021 - Present
- Developed and maintained critical features for a large-scale e-commerce platform using React, Redux, and Node.js.
- Implemented RESTful APIs and integrated with third-party services.
- Led a team of 3 junior developers, providing mentorship and code reviews.
- Optimized database queries for PostgreSQL, reducing response times by 20%.

Software Engineer | InnovateWeb Co. | 2018 - 2021
- Designed and built responsive user interfaces with React and styled-components.
- Collaborated with product managers and designers to define and implement new features.
- Participated in agile development cycles, including daily stand-ups and sprint reviews.

Education:
B.S. in Computer Science | University of Example | 2014 - 2018

Skills:
Languages: JavaScript, TypeScript, Python, HTML, CSS
Frameworks/Libraries: React, Node.js, Express, Redux, Tailwind CSS
Databases: PostgreSQL, MongoDB
Tools: Git, Docker, AWS (EC2, S3)
`);
    } else {
      setResumeFile(null);
      setResumeContent('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription || !focusRole) {
      setError('Please upload a resume, provide a job description, and specify a focus role.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // In a real application, resumeFile would be sent to a backend for text extraction.
      // const base64Resume = await fileToBase64(resumeFile); // If sending raw file
      
      // Simulate backend processing and call Gemini directly with extracted text
      const result = await analyzeResume(resumeContent, jobDescription, focusRole);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError(`Failed to analyze resume: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-800 rounded-xl shadow-xl border border-gray-700 animate-fade-in">
      <h2 className="text-4xl font-extrabold text-gray-100 mb-6 text-center">Resume Analyzer</h2>
      <p className="text-lg text-gray-300 mb-8 text-center">Get AI-powered insights on how your resume aligns with job descriptions.</p>

      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label htmlFor="resume-upload" className="block text-lg font-medium text-gray-200 mb-2">
            Upload Resume (PDF, DOCX - simulated)
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="block w-full text-gray-100
                       file:mr-4 file:py-3 file:px-6
                       file:rounded-full file:border-0
                       file:text-md file:font-semibold
                       file:bg-emerald-900 file:text-emerald-200
                       hover:file:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
          />
          {resumeFile && <p className="mt-3 text-sm text-gray-400">Selected: {resumeFile.name}</p>}
          {!resumeFile && <p className="mt-3 text-sm text-red-500">Please select a file.</p>}
        </div>

        <div>
          <label htmlFor="job-description" className="block text-lg font-medium text-gray-200 mb-2">
            Job Description
          </label>
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            placeholder="Paste the job description here..."
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="focus-role" className="block text-lg font-medium text-gray-200 mb-2">
            Focus Role (e.g., Senior Software Engineer)
          </label>
          <input
            id="focus-role"
            type="text"
            value={focusRole}
            onChange={(e) => setFocusRole(e.target.value)}
            placeholder="e.g., Frontend Developer, Data Scientist"
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !resumeFile || !jobDescription || !focusRole}
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="mt-8 p-4 text-red-300 bg-red-900 border border-red-700 rounded-lg shadow-sm">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {analysisResult && (
        <div className="mt-10 pt-8 border-t-2 border-gray-700 space-y-7">
          <h3 className="text-3xl font-bold text-gray-100 mb-4 text-center">Analysis Result</h3>

          <div className="bg-emerald-900 p-6 rounded-lg shadow-md border border-emerald-800 animate-fade-in-up">
            <h4 className="text-xl font-semibold text-emerald-200 mb-3">Overall Analysis</h4>
            <p className="text-gray-100 leading-relaxed">{analysisResult.analysis}</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600 animate-fade-in-up delay-100">
            <h4 className="text-xl font-semibold text-gray-100 mb-3">Suggestions for Improvement</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-100 ml-4">
              {analysisResult.suggestions.map((suggestion, index) => (
                <li key={index} className="py-1">{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-900 p-6 rounded-lg shadow-md border border-emerald-800 animate-fade-in-up delay-200">
            <h4 className="text-xl font-semibold text-emerald-200 mb-3">Matched Skills</h4>
            <ul className="flex flex-wrap gap-3 mt-2">
              {analysisResult.matchedSkills.map((skill, index) => (
                <li key={index} className="bg-green-800 text-green-200 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600 animate-fade-in-up delay-300">
            <h4 className="text-xl font-semibold text-gray-100 mb-3">Missing Skills</h4>
            <ul className="flex flex-wrap gap-3 mt-2">
              {analysisResult.missingSkills.map((skill, index) => (
                <li key={index} className="bg-orange-800 text-orange-200 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};