export type AssessmentOption = {
  label: string;
  value: string;
  score: number;
};

export type AssessmentQuestion = {
  id: string;
  category: "profile" | "credit" | "money" | "goals" | "mindset" | "business";
  title: string;
  subtitle?: string;
  type: "single" | "multi" | "text" | "email" | "phone";
  required?: boolean;
  options?: AssessmentOption[];
};

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "fullName",
    category: "profile",
    title: "Future Student, what name should appear on your Credit U admissions profile?",
    type: "text",
    required: true
  },
  {
    id: "email",
    category: "profile",
    title: "Where should we send your admissions results?",
    type: "email",
    required: true
  },
  {
    id: "phone",
    category: "profile",
    title: "Phone number for student updates",
    subtitle: "Optional, but powerful for reminders and next-step support.",
    type: "phone"
  },
  {
    id: "financialSeason",
    category: "profile",
    title: "Which financial season best describes you right now?",
    type: "single",
    required: true,
    options: [
      { label: "I am rebuilding after a hard season", value: "rebuilding", score: 2 },
      { label: "I am starting from scratch", value: "starter", score: 3 },
      { label: "I have momentum but need structure", value: "momentum", score: 4 },
      { label: "I am preparing for home, business, or major funding", value: "prep", score: 4 },
      { label: "I want wealth, legacy, and financial leadership", value: "legacy", score: 5 }
    ]
  },
  {
    id: "creditScoreRange",
    category: "credit",
    title: "What is your current credit score range?",
    subtitle: "No shame. This is placement, not judgment.",
    type: "single",
    required: true,
    options: [
      { label: "I do not know", value: "unknown", score: 1 },
      { label: "Below 500", value: "below500", score: 1 },
      { label: "500–579", value: "500_579", score: 2 },
      { label: "580–669", value: "580_669", score: 3 },
      { label: "670–739", value: "670_739", score: 4 },
      { label: "740+", value: "740_plus", score: 5 }
    ]
  },
  {
    id: "reportConfidence",
    category: "credit",
    title: "How confident are you reading your credit report?",
    type: "single",
    required: true,
    options: [
      { label: "I avoid looking at it", value: "avoid", score: 1 },
      { label: "I look but do not fully understand it", value: "confused", score: 2 },
      { label: "I understand some parts", value: "some", score: 3 },
      { label: "I can identify problems", value: "identify", score: 4 },
      { label: "I can explain my report clearly", value: "clear", score: 5 }
    ]
  },
  {
    id: "utilizationKnowledge",
    category: "credit",
    title: "Do you understand credit utilization and how it impacts your score?",
    type: "single",
    required: true,
    options: [
      { label: "Not yet", value: "no", score: 1 },
      { label: "A little", value: "little", score: 2 },
      { label: "Somewhat", value: "somewhat", score: 3 },
      { label: "Yes", value: "yes", score: 4 },
      { label: "Yes, and I manage it monthly", value: "manage", score: 5 }
    ]
  },
  {
    id: "budgetSystem",
    category: "money",
    title: "Do you currently use a written or digital budget system?",
    type: "single",
    required: true,
    options: [
      { label: "No system right now", value: "none", score: 1 },
      { label: "I track mentally", value: "mental", score: 2 },
      { label: "I use notes or spreadsheets sometimes", value: "sometimes", score: 3 },
      { label: "I budget monthly", value: "monthly", score: 4 },
      { label: "I have a strong household money system", value: "strong", score: 5 }
    ]
  },
  {
    id: "savings",
    category: "money",
    title: "How prepared are you for a $500 emergency?",
    type: "single",
    required: true,
    options: [
      { label: "Not prepared", value: "not", score: 1 },
      { label: "I would need help or credit", value: "help", score: 2 },
      { label: "I could cover part of it", value: "partial", score: 3 },
      { label: "I could cover it", value: "cover", score: 4 },
      { label: "I have an emergency fund", value: "fund", score: 5 }
    ]
  },
  {
    id: "moneyStress",
    category: "mindset",
    title: "How often does money stress affect your peace?",
    type: "single",
    required: true,
    options: [
      { label: "Daily", value: "daily", score: 1 },
      { label: "Often", value: "often", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 3 },
      { label: "Rarely", value: "rarely", score: 4 },
      { label: "I feel peaceful and prepared", value: "peaceful", score: 5 }
    ]
  },
  {
    id: "goals",
    category: "goals",
    title: "What are you preparing for?",
    subtitle: "Choose every goal that matters to you.",
    type: "multi",
    required: true,
    options: [
      { label: "Buy a home", value: "home", score: 5 },
      { label: "Buy a car", value: "car", score: 4 },
      { label: "Start or grow a business", value: "business", score: 5 },
      { label: "Repair credit", value: "repair", score: 4 },
      { label: "Pay down debt", value: "debt", score: 4 },
      { label: "Build savings", value: "savings", score: 4 },
      { label: "Invest and build wealth", value: "invest", score: 5 },
      { label: "Create generational wealth", value: "legacy", score: 5 }
    ]
  },
  {
    id: "businessCredit",
    category: "business",
    title: "Do you understand business credit and funding readiness?",
    type: "single",
    required: true,
    options: [
      { label: "Not yet", value: "not", score: 1 },
      { label: "I have heard of it", value: "heard", score: 2 },
      { label: "I understand the basics", value: "basic", score: 3 },
      { label: "I have started building", value: "started", score: 4 },
      { label: "I am ready to optimize", value: "optimize", score: 5 }
    ]
  }
];
