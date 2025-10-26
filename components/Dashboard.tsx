import React from 'react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  // Simulated data for schedules and courses
  const simulatedSchedules = [
    { id: 1, name: 'Advanced React Course', lastUpdated: '2024-10-26', progress: '75%', nextTopic: 'Gemini API Integration' },
    { id: 2, name: 'Machine Learning Basics', lastUpdated: '2024-10-20', progress: '50%', nextTopic: 'Supervised Learning' },
    { id: 3, name: 'Full Stack Development', lastUpdated: '2024-10-15', progress: '90%', nextTopic: 'Deployment Best Practices' },
  ];

  const simulatedCourses = [
    { id: 101, title: 'Introduction to AI', progress: '80%', instructor: 'Dr. Emily Chen' },
    { id: 102, title: 'Data Structures in Python', progress: '65%', instructor: 'Prof. David Lee' },
    { id: 103, title: 'Web Development with React', progress: '95%', instructor: 'Ms. Sarah Kim' },
    { id: 104, title: 'Cloud Computing Fundamentals', progress: '40%', instructor: 'Mr. Alex Wong' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-800 rounded-xl shadow-xl border border-gray-700 animate-fade-in">
      <h2 className="text-4xl font-extrabold text-gray-100 mb-8 text-center">Your EduFlux Dashboard</h2>
      <p className="text-xl text-gray-300 mb-10 text-center">Manage your learning and productivity at a glance!</p>

      {/* Schedules Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold text-gray-100">Your Schedules</h3>
          <Link to="/scheduler" className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center transition-colors duration-200 transform hover:-translate-y-0.5">
            View All Schedules
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulatedSchedules.map((schedule, index) => (
            <div key={schedule.id} className={`bg-emerald-900 p-6 rounded-lg shadow-md border border-emerald-800 flex flex-col justify-between animate-fade-in-up delay-${index * 100}`}>
              <div>
                <h4 className="text-xl font-semibold text-emerald-200 mb-2">{schedule.name}</h4>
                <p className="text-gray-200 text-sm mb-1">Progress: <span className="font-medium text-emerald-300">{schedule.progress}</span></p>
                <p className="text-gray-200 text-sm mb-3">Next Topic: {schedule.nextTopic}</p>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
                <span>Last updated: {schedule.lastUpdated}</span>
                <Link to={`/scheduler?id=${schedule.id}`} className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200 transform hover:-translate-y-0.5">
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>
        {simulatedSchedules.length === 0 && (
          <p className="text-center text-gray-400 py-8">No schedules found. <Link to="/scheduler" className="text-emerald-400 hover:underline transition-colors duration-200">Create a new schedule</Link>.</p>
        )}
      </section>

      {/* Course Progress Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold text-gray-100">Your Course Progress</h3>
          <Link to="/course" className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center transition-colors duration-200 transform hover:-translate-y-0.5">
            View All Courses
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {simulatedCourses.map((course, index) => (
            <div key={course.id} className={`bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600 animate-fade-in-up delay-${index * 100 + 50}`}>
              <h4 className="text-xl font-semibold text-gray-100 mb-2">{course.title}</h4>
              <p className="text-gray-300 mb-1">Instructor: {course.instructor}</p>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: course.progress }}
                ></div>
              </div>
              <p className="text-sm text-gray-300 mt-2">Progress: {course.progress}</p>
            </div>
          ))}
        </div>
        {simulatedCourses.length === 0 && (
          <p className="text-center text-gray-400 py-8">No courses in progress. <Link to="/course" className="text-emerald-400 hover:underline transition-colors duration-200">Browse courses</Link>.</p>
        )}
      </section>
    </div>
  );
};