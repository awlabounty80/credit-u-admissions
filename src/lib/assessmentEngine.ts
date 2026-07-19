import { assessmentQuestions } from "../data/assessmentQuestions";

export type AssessmentAnswers = Record<string, string | string[]>;

export type AssessmentResult = {
  totalScore: number;
  maxScore: number;
  readinessPercent: number;
  financialDNA: string;
  campusPlacement: string;
  major: string;
  gpa: Record<string, string>;
  stressIndex: string;
  degreePlan: string[];
  firstAssignment: string;
  nextStep: string;
  acceptanceMessage: string;
};

const grade = (percent: number) => {
  if (percent >= 90) return "A";
  if (percent >= 80) return "B";
  if (percent >= 70) return "C";
  if (percent >= 60) return "D";
  return "F";
};

const getSingleScore = (questionId: string, answer: string | string[] | undefined) => {
  const question = assessmentQuestions.find((q) => q.id === questionId);
  if (!question?.options || Array.isArray(answer)) return 0;
  return question.options.find((o) => o.value === answer)?.score ?? 0;
};

const getMultiScore = (questionId: string, answer: string | string[] | undefined) => {
  const question = assessmentQuestions.find((q) => q.id === questionId);
  if (!question?.options || !Array.isArray(answer)) return 0;
  return answer.reduce((sum, value) => sum + (question.options?.find((o) => o.value === value)?.score ?? 0), 0);
};

export function calculateAssessment(answers: AssessmentAnswers): AssessmentResult {
  const creditScore = getSingleScore("creditScoreRange", answers.creditScoreRange);
  const reportConfidence = getSingleScore("reportConfidence", answers.reportConfidence);
  const utilization = getSingleScore("utilizationKnowledge", answers.utilizationKnowledge);
  const budget = getSingleScore("budgetSystem", answers.budgetSystem);
  const savings = getSingleScore("savings", answers.savings);
  const stress = getSingleScore("moneyStress", answers.moneyStress);
  const business = getSingleScore("businessCredit", answers.businessCredit);
  const season = getSingleScore("financialSeason", answers.financialSeason);
  const goals = getMultiScore("goals", answers.goals);

  const totalScore = creditScore + reportConfidence + utilization + budget + savings + stress + business + season + Math.min(goals, 20);
  const maxScore = 60;
  const readinessPercent = Math.round((totalScore / maxScore) * 100);

  const selectedGoals = Array.isArray(answers.goals) ? answers.goals : [];

  let financialDNA = "The Rebuilder™";
  if (readinessPercent >= 85) financialDNA = "The Legacy Builder™";
  else if (readinessPercent >= 72) financialDNA = "The Wealth Builder™";
  else if (readinessPercent >= 60) financialDNA = "The Momentum Student™";
  else if (readinessPercent >= 45) financialDNA = "The Comeback Builder™";

  let campusPlacement = "Freshman Foundations™";
  if (readinessPercent >= 85) campusPlacement = "Honors Legacy Track™";
  else if (readinessPercent >= 72) campusPlacement = "Senior Strategy Track™";
  else if (readinessPercent >= 60) campusPlacement = "Junior Momentum Track™";
  else if (readinessPercent >= 45) campusPlacement = "Sophomore Rebuild Track™";

  let major = "Credit Foundations™";
  if (selectedGoals.includes("home")) major = "Homeownership Readiness™";
  if (selectedGoals.includes("business")) major = "Business Funding Prep™";
  if (selectedGoals.includes("legacy")) major = "Legacy Wealth Building™";
  if (selectedGoals.includes("repair")) major = "Credit Restoration™";

  const gpa = {
    "Credit Knowledge": grade(((creditScore + reportConfidence + utilization) / 15) * 100),
    "Money Management": grade(((budget + savings) / 10) * 100),
    "Mindset & Peace": grade((stress / 5) * 100),
    "Business Readiness": grade((business / 5) * 100),
    "Goal Clarity": grade((Math.min(goals, 20) / 20) * 100)
  };

  const stressIndex = stress <= 2 ? "High Pressure Season™" : stress <= 3 ? "Stabilizing Season™" : "Peace & Preparation Season™";

  const degreePlan = [
    "Dorm Week Rush™: learn the Credit U campus and complete your Student Profile.",
    "Credit Reality Check™: review reports, score factors, collections, utilization, and inquiries.",
    "Money System Lab™: create a budget, savings plan, and debt awareness map.",
    "Mission 800™ Roadmap: build your 30-day, 60-day, and 90-day action plan.",
    "Graduation Portfolio™: save your transcript, GPA, assignments, and next-step recommendations."
  ];

  const firstAssignment = "Download or pull your credit report, then complete your Credit Reality Check Sheet™.";
  const nextStep = readinessPercent < 60 ? "Start Dorm Week Rush™" : "Begin your personalized Credit U Degree Plan™";

  return {
    totalScore,
    maxScore,
    readinessPercent,
    financialDNA,
    campusPlacement,
    major,
    gpa,
    stressIndex,
    degreePlan,
    firstAssignment,
    nextStep,
    acceptanceMessage:
      "Congratulations Future Student. Based on your Free Credit U Assessment™, you have been accepted into Credit U. Your past may explain your starting point, but it does not define your graduation story."
  };
}
