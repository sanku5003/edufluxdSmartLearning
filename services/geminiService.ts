// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, ResumeAnalysis, ScheduledEvent, VideoSegment, CourseOutline, CourseModule, CourseTopic, CourseObjective } from '../types';

// Always use `const ai = new GoogleGenAI({apiKey: process.env.API_KEY});`
const getGenAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Utility function to convert a File object to a Base64 encoded string.
 * This is primarily for demonstrating file handling in the browser,
 * though actual content extraction for models might happen on a backend.
 * @param file The File object to convert.
 * @returns A Promise that resolves with the Base64 encoded string, including the data URL prefix.
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Generates quiz questions based on a given topic and number of questions.
 * Uses `gemini-2.5-flash` for basic text tasks and `responseSchema` for structured output.
 */
export async function generateQuiz(topic: string, numQuestions: number): Promise<QuizQuestion[]> {
  const ai = getGenAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Basic Text Tasks
      contents: `Generate ${numQuestions} multiple-choice quiz questions about "${topic}". For each question, provide the question text, exactly 4 options, and the single correct answer.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: 'The quiz question.' },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'An array of exactly 4 possible answer options.',
              },
              correctAnswer: { type: Type.STRING, description: 'The correct answer, must be one of the options.' },
            },
            required: ['question', 'options', 'correctAnswer'],
            propertyOrdering: ['question', 'options', 'correctAnswer'],
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    const quiz: QuizQuestion[] = JSON.parse(jsonStr);
    return quiz;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error(`Failed to generate quiz: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Analyzes a resume against a job description and focus role.
 * Uses `gemini-2.5-pro` for complex text tasks and `responseSchema` for structured output.
 */
export async function analyzeResume(
  resumeContent: string,
  jobDescription: string,
  focusRole: string,
): Promise<ResumeAnalysis> {
  const ai = getGenAI();
  try {
    const prompt = `Analyze the following resume for a "${focusRole}" role based on the provided job description.
    
    Resume:
    ${resumeContent}
    
    Job Description:
    ${jobDescription}
    
    Provide an overall analysis, specific suggestions for improvement, a list of skills matched, and a list of skills missing from the resume based on the job description.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro", // Complex Text Tasks
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING, description: 'Overall analysis of the resume against the job description.' },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific suggestions for improving the resume.',
            },
            matchedSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Skills from the resume that match the job description.',
            },
            missingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key skills from the job description missing from the resume.',
            },
          },
          required: ['analysis', 'suggestions', 'matchedSkills', 'missingSkills'],
          propertyOrdering: ['analysis', 'suggestions', 'matchedSkills', 'missingSkills'],
        },
      },
    });

    const jsonStr = response.text.trim();
    const analysis: ResumeAnalysis = JSON.parse(jsonStr);
    return analysis;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generates a study schedule based on a document's content.
 * Uses `gemini-2.5-pro` for complex text tasks and `responseSchema` for structured output.
 */
export async function generateScheduleFromDocument(
  documentContent: string,
  startDate: string,
  durationWeeks: number,
): Promise<ScheduledEvent[]> {
  const ai = getGenAI();
  try {
    const prompt = `Based on the following document content, generate a detailed ${durationWeeks}-week study schedule starting from ${startDate}.
    For each day, provide a topic and specific activities. Focus on key concepts and learning objectives from the document.
    
    Document Content:
    ${documentContent}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro", // Complex Text Tasks
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING, description: 'The date of the scheduled event in YYYY-MM-DD format.' },
              topic: { type: Type.STRING, description: 'The main topic for the day.' },
              activities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'A list of specific learning activities for the day.',
              },
            },
            required: ['date', 'topic', 'activities'],
            propertyOrdering: ['date', 'topic', 'activities'],
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    const schedule: ScheduledEvent[] = JSON.parse(jsonStr);
    return schedule;
  } catch (error) {
    console.error("Error generating schedule from document:", error);
    throw new Error(`Failed to generate schedule from document: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generates a study schedule based on a specific topic and difficulty level.
 * Uses `gemini-2.5-pro` for complex text tasks and `responseSchema` for structured output.
 */
export async function generateScheduleByTopicAndDifficulty(
  learningTopic: string,
  difficultyLevel: string,
  startDate: string,
  durationWeeks: number,
): Promise<ScheduledEvent[]> {
  const ai = getGenAI();
  try {
    const prompt = `Generate a detailed ${durationWeeks}-week study schedule for a ${difficultyLevel} level learner on the topic of "${learningTopic}".
    The schedule should start from ${startDate} and include a topic and specific activities for each day.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro", // Complex Text Tasks
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING, description: 'The date of the scheduled event in YYYY-MM-DD format.' },
              topic: { type: Type.STRING, description: 'The main topic for the day.' },
              activities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'A list of specific learning activities for the day.',
              },
            },
            required: ['date', 'topic', 'activities'],
            propertyOrdering: ['date', 'topic', 'activities'],
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    const schedule: ScheduledEvent[] = JSON.parse(jsonStr);
    return schedule;
  } catch (error) {
    console.error("Error generating schedule by topic and difficulty:", error);
    throw new Error(`Failed to generate schedule by topic and difficulty: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extracts key timestamps and descriptions from a video transcription.
 * Uses `gemini-2.5-pro` for complex text tasks and `responseSchema` for structured output.
 */
export async function extractVideoTimestamps(
  videoTranscription: string,
  numSegments: number,
  specificTopic?: string,
): Promise<VideoSegment[]> {
  const ai = getGenAI();
  try {
    let prompt = `Analyze the following video transcription and identify ${numSegments} key segments.
    For each segment, provide a descriptive name, its start time (in seconds), end time (in seconds), and a brief description of its content.
    The transcription includes timestamps in [HH:MM:SS] format. Calculate start and end times in seconds based on these.
    
    Video Transcription:
    ${videoTranscription}
    `;

    if (specificTopic) {
      prompt += `\nPrioritize segments related to the topic: "${specificTopic}".`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro", // Complex Text Tasks
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              segmentName: { type: Type.STRING, description: 'A descriptive name for the video segment.' },
              startTime: { type: Type.NUMBER, description: 'The start time of the segment in seconds.' },
              endTime: { type: Type.NUMBER, description: 'The end time of the segment in seconds.' },
              description: { type: Type.STRING, description: 'A brief summary of the segment content.' },
            },
            required: ['segmentName', 'startTime', 'endTime', 'description'],
            propertyOrdering: ['segmentName', 'startTime', 'endTime', 'description'],
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    const segments: VideoSegment[] = JSON.parse(jsonStr);

    // Add mock download URL for demonstration
    return segments.map(segment => ({
      ...segment,
      mockDownloadUrl: `data:text/plain;base64,${btoa(
        `Segment Name: ${segment.segmentName}\nStart Time: ${segment.startTime}s\nEnd Time: ${segment.endTime}s\nDescription: ${segment.description}`
      )}`,
    }));
  } catch (error) {
    console.error("Error extracting video timestamps:", error);
    throw new Error(`Failed to extract video timestamps: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generates a structured course outline based on a subject, learning outcomes, and duration.
 * Uses `gemini-2.5-pro` for complex text tasks and `responseSchema` for structured output.
 */
export async function generateCourseOutline(
  subject: string,
  learningOutcomes: string,
  durationWeeks: number,
): Promise<CourseOutline> {
  const ai = getGenAI();
  try {
    const prompt = `Generate a detailed course outline for a ${durationWeeks}-week course on "${subject}".
    The course should aim to achieve the following learning outcomes: ${learningOutcomes}.
    Organize the outline into modules, with each module having a title, a description, and a list of topics.
    Each topic should have a title and a list of specific learning objectives.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro", // Complex Text Tasks
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'The title of the course module.' },
              description: { type: Type.STRING, description: 'A brief description of the module content.' },
              topics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: 'The title of the topic within the module.' },
                    objectives: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          objective: { type: Type.STRING, description: 'A specific learning objective for the topic.' },
                        },
                        required: ['objective'],
                        propertyOrdering: ['objective'],
                      },
                      description: 'A list of learning objectives for the topic.',
                    },
                  },
                  required: ['title', 'objectives'],
                  propertyOrdering: ['title', 'objectives'],
                },
                description: 'A list of topics covered in the module.',
              },
            },
            required: ['title', 'description', 'topics'],
            propertyOrdering: ['title', 'description', 'topics'],
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    const courseOutline: CourseOutline = JSON.parse(jsonStr);
    return courseOutline;
  } catch (error) {
    console.error("Error generating course outline:", error);
    throw new Error(`Failed to generate course outline: ${error instanceof Error ? error.message : String(error)}`);
  }
}
