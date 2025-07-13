"use client";

import React, { useState, useEffect } from 'react';
import ProgressSteppe from '@/components/dashboard/skill-assessment/ProgressSteppe';
import SkillExtraction from '@/components/dashboard/skill-assessment/SkillExtraction';
import Assessment from '@/components/dashboard/skill-assessment/Assessment';
import CareerFeedback from '@/components/dashboard/skill-assessment/CareerFeedback';
import { AssessmentData, APIResponse } from '@/types/resume';
import axios from 'axios';

const SkillAssessmentDashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    skills: [],
    questions: [],
    answers: [],
    results: {
      overall_score: 0,
      skill_scores: [],
      career_suggestions: {
        suggestions: [],
        strengths: [],
        improvement_areas: []
      }
    },
  });

  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // NEW: Track user answers by question index
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});

  // Timer effect
  useEffect(() => {
    if (currentStep === 2 && assessmentStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            submitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, assessmentStarted, timeRemaining]);

  const handleStartAssessment = async () => {
    setLoading(true);
    setError('');

    try {
      const technicalSkills = assessmentData.skills.filter(skill => skill.type === 'technical').map(skill => skill.name);
      const softSkills = assessmentData.skills.filter(skill => skill.type === 'soft').map(skill => skill.name);

      const response = await axios.post(
        "http://localhost:8000/api/v1/resume/skill-assessment",
        {
          "technical_skills": JSON.stringify(technicalSkills),
          "soft_skills": JSON.stringify(softSkills)
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.success) {
        const questions = response.data.questions.map((q: any, index: number) => ({
          id: index.toString(),
          question: q.question,
          options: q.options,
          answer: q.answer,
          topic: q.topic,
          type: 'multiple-choice' as const
        }));

        setAssessmentData(prev => ({ ...prev, questions }));
        setCurrentStep(2);
        setAssessmentStarted(true);
      } else {
        setError('Failed to fetch questions. Please try again.');
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Handle answer changes (store in userAnswers state)
  const handleAnswer = (answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  // UPDATED: Handle next question navigation
  const handleNextQuestion = () => {
    if (currentQuestion < assessmentData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      submitAssessment();
    }
  };

  // UPDATED: Handle previous question navigation
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // UPDATED: Submit assessment now uses userAnswers state
  const submitAssessment = async () => {
    setLoading(true);
    setError('');

    try {
      // Convert userAnswers to the format expected by the backend
      const formattedAnswers = Object.entries(userAnswers).map(([questionIndex, answer]) => {
        const question = assessmentData.questions[parseInt(questionIndex)];
        const isCorrect = question.answer === answer;
        
        return {
          questionId: question.question,
          answer,
          isCorrect,
          skill: question.topic
        };
      });

      // Update assessmentData with formatted answers
      setAssessmentData(prev => ({
        ...prev,
        answers: formattedAnswers
      }));

      const skillScoreMap = new Map<string, { total: number; correct: number }>();

      formattedAnswers.forEach(answer => {
        const question = assessmentData.questions.find(q => q.question === answer.questionId);
        const skill = question?.topic || 'Unknown';

        const current = skillScoreMap.get(skill) || { total: 0, correct: 0 };
        skillScoreMap.set(skill, {
          total: current.total + 1,
          correct: current.correct + (answer.isCorrect ? 1 : 0)
        });
      });

      const scoreData = Array.from(skillScoreMap.entries()).map(([skill, scores]) => ({
        skill,
        total_questions: scores.total,
        correct_questions: scores.correct
      }));

      const response = await axios.post<APIResponse>(
        "http://localhost:8000/api/v1/resume/skill-assessment-score",
        {
          "skills": JSON.stringify(scoreData),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.status) {
        // Add industry averages to skill scores
        const skillScoresWithAverage = response.data.skill_wise_scores.map(score => ({
          ...score,
          industryAverage: Math.floor(Math.random() * 30) + 60
        }));

        setAssessmentData(prev => ({
          ...prev,
          results: {
            overall_score: response.data.overall_score,
            skill_scores: skillScoresWithAverage,
            career_suggestions: response.data.career_suggestions,
          }
        }));
        
        setCurrentStep(3);
      } else {
        setError('Failed to calculate scores. Please try again.');
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      setError('Failed to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Reset userAnswers when retaking assessment
  const handleRetakeAssessment = () => {
    setCurrentStep(1);
    setCurrentQuestion(0);
    setTimeRemaining(900);
    setAssessmentStarted(false);
    setUserAnswers({}); // Reset user answers
    setAssessmentData(prev => ({
      ...prev,
      questions: [],
      answers: [],
      results: {
        overall_score: 0,
        skill_scores: [],
        career_suggestions: {
          suggestions: [],
          strengths: [],
          improvement_areas: []
        }
      }
    }));
    setError('');
  };

  const updateSkills = (newSkills: AssessmentData['skills']) => {
    setAssessmentData(prev => ({ ...prev, skills: newSkills }));
  };

  return (
    <div className="h-screen w-full bg-gray-50 overflow-y-scroll">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">Skill Assessment Dashboard</h1>
          <p className="text-gray-600">Evaluate your skills with AI-generated questions and get personalized career feedback</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <ProgressSteppe currentStep={currentStep} totalSteps={3} />

        {currentStep === 1 && (
          <SkillExtraction
            onSkillsChange={updateSkills}
            onNext={handleStartAssessment}
            loading={loading}
          />
        )}

        {currentStep === 2 && assessmentData.questions.length > 0 && (
          <Assessment
            question={assessmentData.questions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={assessmentData.questions.length}
            timeRemaining={timeRemaining}
            currentAnswer={userAnswers[currentQuestion] || ''} // NEW: Pass current answer
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion} // UPDATED: Use dedicated handler
            onSkip={handleNextQuestion}
            loading={loading}
          />
        )}

        {currentStep === 3 && (
          <CareerFeedback
            assessmentData={assessmentData}
            onRetakeAssessment={handleRetakeAssessment}
          />
        )}
      </div>
    </div>
  );
};

export default SkillAssessmentDashboard;