import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CreditCard, 
    GraduationCap, 
    BookOpen, 
    Award, 
    ChevronRight, 
    ChevronLeft, 
    Database, 
    UserCheck, 
    Search, 
    Trash2, 
    ArrowRight,
    Trophy,
    TrendingUp,
    FileText,
    Users,
    PieChart,
    ArrowLeft,
    Clock,
    Lock,
    Unlock
} from 'lucide-react';
import { RECOMMENDED_CARDS, MOCK_PROFILES, CreditCard as CardType, MockProfile } from '../data/funnelData';
import confetti from 'canvas-confetti';

// --- CUSTOM BUTTON COMPONENT ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'danger';
    className?: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
    const baseStyle = "inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95 text-sm py-3 px-6";
    
    let variantStyle = "bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-md shadow-yellow-950/20";
    if (variant === 'outline') {
        variantStyle = "border-2 border-white/20 hover:bg-white/10 text-white";
    } else if (variant === 'ghost') {
        variantStyle = "text-white hover:bg-white/10";
    } else if (variant === 'danger') {
        variantStyle = "bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-950/20";
    }
    
    return (
        <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
            {children}
        </button>
    );
};

// --- FUNNEL DATA STRUCTURE ---
interface FunnelData {
    fullName: string;
    email: string;
    phone: string;
    state: string;
    housingStatus: string;
    monthlyIncome: number;
    savingsBalance: number;
    estimatedScoreRange: string;
    totalDebt: number;
    hasCollections: string;
    hasLatePayments: string;
    financialIdentity: string;
    biggestObstacle: string;
    urgency: string;
    confidenceLevel: string;
    accountabilityPreference: string;
}

const INITIAL_DATA: FunnelData = {
    fullName: '',
    email: '',
    phone: '',
    state: '',
    housingStatus: 'Rent',
    monthlyIncome: 3000,
    savingsBalance: 1000,
    estimatedScoreRange: 'fair',
    totalDebt: 5000,
    hasCollections: 'no',
    hasLatePayments: 'no',
    financialIdentity: 'Builder',
    biggestObstacle: 'Late payments',
    urgency: 'medium',
    confidenceLevel: 'medium',
    accountabilityPreference: 'Weekly coaching'
};

export default function CreditFunnel() {
    // Views: 'welcome' | 'form' | 'results' | 'locker' | 'admin'
    const [view, setView] = useState<'welcome' | 'form' | 'results' | 'locker' | 'admin'>('welcome');
    const [formStep, setFormStep] = useState(1);
    const [formData, setFormData] = useState<FunnelData>(INITIAL_DATA);
    
    // Calculated State
    const [calculatedScore, setCalculatedScore] = useState(620);
    const [assignedDorm, setAssignedDorm] = useState('Freshman Hall');
    const [financialGPA, setFinancialGPA] = useState(2.5);
    const [recommendedCard, setRecommendedCard] = useState<CardType>(RECOMMENDED_CARDS[2]);
    
    // Database State
    const [pastSubmissions, setPastSubmissions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

    // Initialize mock database from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('cu_funnel_standalone_db');
        if (stored) {
            setPastSubmissions(JSON.parse(stored));
        } else {
            // Seed with mock profiles
            const seededSubmissions = MOCK_PROFILES.map(prof => {
                const results = calculateResultsForAnswers(prof.answers);
                return {
                    id: prof.id,
                    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
                    formData: {
                        fullName: prof.answers.step1.fullName,
                        email: prof.answers.step1.email,
                        phone: prof.answers.step1.phone,
                        state: prof.answers.step1.state,
                        housingStatus: prof.answers.step1.housingStatus,
                        monthlyIncome: prof.answers.step2.monthlyIncome,
                        savingsBalance: prof.answers.step2.savingsBalance,
                        estimatedScoreRange: prof.answers.step2.estimatedScoreRange,
                        totalDebt: prof.answers.step2.totalDebt,
                        hasCollections: prof.answers.step3.hasCollections,
                        hasLatePayments: prof.answers.step3.hasLatePayments,
                        financialIdentity: prof.answers.step3.financialIdentity,
                        biggestObstacle: prof.answers.step3.biggestObstacle,
                        urgency: prof.answers.step4.urgency,
                        confidenceLevel: prof.answers.step4.confidenceLevel,
                        accountabilityPreference: prof.answers.step4.accountabilityPreference
                    },
                    ...results
                };
            });
            localStorage.setItem('cu_funnel_standalone_db', JSON.stringify(seededSubmissions));
            setPastSubmissions(seededSubmissions);
        }
    }, []);

    // Form Navigation
    const nextStep = () => {
        if (formStep < 4) {
            setFormStep(formStep + 1);
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (formStep > 1) {
            setFormStep(formStep - 1);
        } else {
            setView('welcome');
        }
    };

    // Calculate score, GPA, dorm, and card recommendation
    const calculateResultsForAnswers = (answers: any) => {
        const step2 = answers.step2;
        const step3 = answers.step3;
        
        let score = 600; // Base score

        // 1. Estimated credit score range adjustment
        if (step2.estimatedScoreRange === 'excellent') score = 760;
        else if (step2.estimatedScoreRange === 'good') score = 690;
        else if (step2.estimatedScoreRange === 'fair') score = 600;
        else score = 480;

        // 2. DTI (Debt to Income) ratio adjustment
        const monthlyDebtPayment = step2.totalDebt * 0.05;
        const dti = step2.monthlyIncome > 0 ? (monthlyDebtPayment / step2.monthlyIncome) : 0;
        
        if (dti > 0.40) score -= 40;
        else if (dti < 0.20) score += 30;

        // 3. Collections & Late payments penalty
        if (step3.hasCollections === 'yes') score -= 70;
        if (step3.hasLatePayments === 'yes') score -= 40;

        // 4. Savings bonus
        if (step2.savingsBalance > 8000) score += 30;
        else if (step2.savingsBalance > 2000) score += 15;

        // Clip credit score between 300 and 850
        score = Math.max(300, Math.min(850, score));

        // Calculate GPA based on score
        let gpa = 1.0;
        if (score >= 740) gpa = 3.5 + ((score - 740) / 110) * 0.5; // 3.5 to 4.0
        else if (score >= 670) gpa = 3.0 + ((score - 670) / 70) * 0.49; // 3.0 to 3.49
        else if (score >= 580) gpa = 2.0 + ((score - 580) / 90) * 0.99; // 2.0 to 2.99
        else gpa = 0.5 + ((score - 300) / 280) * 1.49; // 0.5 to 1.99
        gpa = Math.round(gpa * 100) / 100;

        // Determine Dorm Hall
        let dorm = 'Recovery Hall';
        if (score >= 740) dorm = 'Wealth Hall';
        else if (score >= 670) dorm = 'Mission 800 Hall';
        else if (score >= 580) dorm = 'Homeownership Hall';

        // Select Card Recommendation
        let card = RECOMMENDED_CARDS[RECOMMENDED_CARDS.length - 1]; // Secured by default
        for (const c of RECOMMENDED_CARDS) {
            if (score >= c.minScore && score <= c.maxScore) {
                card = c;
                break;
            }
        }

        return { score, dorm, gpa, recommendedCard: card };
    };

    const handleLoadProfile = (prof: MockProfile) => {
        setFormData({
            fullName: prof.name,
            email: prof.email,
            phone: prof.answers.step1.phone,
            state: prof.answers.step1.state,
            housingStatus: prof.answers.step1.housingStatus,
            monthlyIncome: prof.answers.step2.monthlyIncome,
            savingsBalance: prof.answers.step2.savingsBalance,
            estimatedScoreRange: prof.answers.step2.estimatedScoreRange,
            totalDebt: prof.answers.step2.totalDebt,
            hasCollections: prof.answers.step3.hasCollections,
            hasLatePayments: prof.answers.step3.hasLatePayments,
            financialIdentity: prof.answers.step3.financialIdentity,
            biggestObstacle: prof.answers.step3.biggestObstacle,
            urgency: prof.answers.step4.urgency,
            confidenceLevel: prof.answers.step4.confidenceLevel,
            accountabilityPreference: prof.answers.step4.accountabilityPreference
        });
        setFormStep(1);
        setView('form');
    };

    const handleSubmit = () => {
        const answers = {
            step1: {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                state: formData.state,
                housingStatus: formData.housingStatus
            },
            step2: {
                monthlyIncome: Number(formData.monthlyIncome),
                savingsBalance: Number(formData.savingsBalance),
                estimatedScoreRange: formData.estimatedScoreRange,
                totalDebt: Number(formData.totalDebt)
            },
            step3: {
                hasCollections: formData.hasCollections,
                hasLatePayments: formData.hasLatePayments,
                financialIdentity: formData.financialIdentity,
                biggestObstacle: formData.biggestObstacle
            },
            step4: {
                urgency: formData.urgency,
                confidenceLevel: formData.confidenceLevel,
                accountabilityPreference: formData.accountabilityPreference
            }
        };

        const results = calculateResultsForAnswers(answers);
        
        setCalculatedScore(results.score);
        setAssignedDorm(results.dorm);
        setFinancialGPA(results.gpa);
        setRecommendedCard(results.recommendedCard);

        const newSubmission = {
            id: 'sub_' + Date.now(),
            timestamp: new Date().toISOString(),
            formData,
            ...results
        };

        const updatedDb = [newSubmission, ...pastSubmissions];
        localStorage.setItem('cu_funnel_standalone_db', JSON.stringify(updatedDb));
        setPastSubmissions(updatedDb);

        if (results.score >= 670) {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
            });
        }

        setView('results');
    };

    const handleSelectSubmission = (sub: any) => {
        setFormData(sub.formData);
        setCalculatedScore(sub.score);
        setAssignedDorm(sub.dorm);
        setFinancialGPA(sub.gpa);
        setRecommendedCard(sub.recommendedCard);
        setSelectedSubmissionId(sub.id);
        setView('results');
    };

    const handleDeleteSubmission = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedDb = pastSubmissions.filter(sub => sub.id !== id);
        localStorage.setItem('cu_funnel_standalone_db', JSON.stringify(updatedDb));
        setPastSubmissions(updatedDb);
        if (selectedSubmissionId === id) {
            setSelectedSubmissionId(null);
        }
    };

    const handleResetDb = () => {
        localStorage.removeItem('cu_funnel_standalone_db');
        setFormData(INITIAL_DATA);
        setView('welcome');
        setFormStep(1);
        
        const seededSubmissions = MOCK_PROFILES.map(prof => {
            const results = calculateResultsForAnswers(prof.answers);
            return {
                id: prof.id,
                timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
                formData: {
                    fullName: prof.name,
                    email: prof.email,
                    phone: prof.answers.step1.phone,
                    state: prof.answers.step1.state,
                    housingStatus: prof.answers.step1.housingStatus,
                    monthlyIncome: prof.answers.step2.monthlyIncome,
                    savingsBalance: prof.answers.step2.savingsBalance,
                    estimatedScoreRange: prof.answers.step2.estimatedScoreRange,
                    totalDebt: prof.answers.step2.totalDebt,
                    hasCollections: prof.answers.step3.hasCollections,
                    hasLatePayments: prof.answers.step3.hasLatePayments,
                    financialIdentity: prof.answers.step3.financialIdentity,
                    biggestObstacle: prof.answers.step3.biggestObstacle,
                    urgency: prof.answers.step4.urgency,
                    confidenceLevel: prof.answers.step4.confidenceLevel,
                    accountabilityPreference: prof.answers.step4.accountabilityPreference
                },
                ...results
            };
        });
        localStorage.setItem('cu_funnel_standalone_db', JSON.stringify(seededSubmissions));
        setPastSubmissions(seededSubmissions);
    };

    const filteredSubmissions = pastSubmissions.filter(sub => 
        sub.formData.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.formData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.dorm.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- MOCK DATABASE ANALYTICS ---
    const averageScore = pastSubmissions.length > 0 
        ? Math.round(pastSubmissions.reduce((acc, curr) => acc + curr.score, 0) / pastSubmissions.length) 
        : 620;

    const dormDistribution = pastSubmissions.reduce((acc: Record<string, number>, curr) => {
        acc[curr.dorm] = (acc[curr.dorm] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-[#002270] text-white flex flex-col font-sans selection:bg-yellow-400 selection:text-blue-900 pb-16">
            
            {/* Nav Header */}
            <header className="w-full bg-[#0033A0] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
                <div 
                    onClick={() => { setView('welcome'); setFormData(INITIAL_DATA); setFormStep(1); }}
                    className="flex items-center gap-3 cursor-pointer select-none"
                >
                    <span className="bg-yellow-400 text-blue-950 p-2 rounded-xl font-black text-lg shadow-md shadow-black/10">🎓</span>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-white uppercase italic leading-none">Credit U™</h1>
                        <p className="text-[9px] text-yellow-300 font-mono tracking-widest uppercase mt-1">Funnel & Onboarding OS</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        onClick={() => setView(view === 'admin' ? 'welcome' : 'admin')}
                        className="gap-2 border-white/20 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider h-10 py-0"
                    >
                        <Database className="w-4 h-4 text-yellow-400" />
                        Dean Admin Panel ({pastSubmissions.length})
                    </Button>
                    {view !== 'welcome' && (
                        <Button 
                            variant="ghost" 
                            onClick={() => { setView('welcome'); setFormData(INITIAL_DATA); setFormStep(1); }}
                            className="text-white/80 hover:bg-white/10 hover:text-white text-xs uppercase h-10 py-0"
                        >
                            Reset Home
                        </Button>
                    )}
                </div>
            </header>

            {/* Main Container */}
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 pt-10 flex justify-center items-start">
                
                <AnimatePresence mode="wait">
                    
                    {/* VIEW 1: WELCOME SCREEN */}
                    {view === 'welcome' && (
                        <motion.div
                            key="welcome-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-2xl bg-[#0033A0]/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl text-center flex flex-col items-center"
                        >
                            <div className="w-24 h-24 bg-yellow-400/10 border-2 border-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                                <GraduationCap className="w-12 h-12 text-yellow-400" />
                            </div>
                            
                            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-4 leading-tight">
                                The Credit U <span className="text-yellow-400">Acceptance Exam</span>
                            </h2>
                            
                            <p className="text-blue-100 text-lg mb-8 max-w-md font-light leading-relaxed">
                                Complete your 3-minute application. Discover your Financial GPA, get your Dorm Assignment, and claim your tailored credit card recommendation.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-10">
                                <Button 
                                    onClick={() => { setFormData(INITIAL_DATA); setFormStep(1); setView('form'); }}
                                    className="h-14 px-8 text-base bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black rounded-2xl shadow-xl shadow-yellow-950/20 gap-2 uppercase tracking-wide group flex-1 max-w-xs"
                                >
                                    Start Fresh Exam
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button 
                                    onClick={() => setView('admin')}
                                    className="h-14 px-8 text-base border-2 border-white/20 hover:bg-white/10 text-white font-bold rounded-2xl gap-2 uppercase tracking-wide flex-1 max-w-xs"
                                >
                                    Dean Admin Panel 🛡️
                                </Button>
                            </div>

                            {/* Mock Profiles Selector */}
                            <div className="w-full border-t border-white/10 pt-8 text-left">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-yellow-400/80 mb-4 flex items-center gap-2">
                                    <UserCheck className="w-4 h-4" />
                                    Or Select a Mock Profile to Preview:
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {MOCK_PROFILES.map((prof) => (
                                        <button
                                            key={prof.id}
                                            onClick={() => handleLoadProfile(prof)}
                                            className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between group transition-all"
                                        >
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-yellow-300 transition-colors">{prof.name}</h4>
                                                <p className="text-xs text-blue-200">{prof.description}</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-blue-900 text-white transition-colors">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* VIEW 2: MULTI-STEP QUESTIONNAIRE */}
                    {view === 'form' && (
                        <motion.div
                            key="form-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
                            className="w-full max-w-2xl bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col"
                        >
                            {/* Step Progress */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs uppercase font-mono tracking-widest text-yellow-300 font-bold">Step {formStep} of 4</span>
                                    <span className="text-xs text-blue-200 uppercase font-bold">
                                        {formStep === 1 && "Section A: Identity & Contact"}
                                        {formStep === 2 && "Section B: Financial Position"}
                                        {formStep === 3 && "Section C: Credit History"}
                                        {formStep === 4 && "Section D: Urgency & Accountability"}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300"
                                        style={{ width: `${(formStep / 4) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Form Steps */}
                            <div className="min-h-[300px] py-4 flex flex-col justify-start">
                                <AnimatePresence mode="wait">
                                    
                                    {/* STEP 1: IDENTITY */}
                                    {formStep === 1 && (
                                        <motion.div
                                            key="step-1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-5"
                                        >
                                            <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mb-6">Tell us about yourself</h3>
                                            
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.fullName}
                                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                    placeholder="John Doe" 
                                                    className="px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Email Address</label>
                                                    <input 
                                                        type="email" 
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        placeholder="john@example.com" 
                                                        className="px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Phone Number</label>
                                                    <input 
                                                        type="text" 
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        placeholder="(555) 012-3456" 
                                                        className="px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-blue-200">State of Residence</label>
                                                    <input 
                                                        type="text" 
                                                        value={formData.state}
                                                        onChange={e => setFormData({ ...formData, state: e.target.value.toUpperCase().slice(0, 2) })}
                                                        placeholder="GA" 
                                                        maxLength={2}
                                                        className="px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Housing Status</label>
                                                    <select 
                                                        value={formData.housingStatus}
                                                        onChange={e => setFormData({ ...formData, housingStatus: e.target.value })}
                                                        className="px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white focus:outline-none focus:border-yellow-400 transition-colors [&>option]:bg-blue-900"
                                                    >
                                                        <option value="Rent">Rent</option>
                                                        <option value="Own">Own Home</option>
                                                        <option value="Live With Family">Live With Family</option>
                                                        <option value="Temporary">Temporary Housing</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 2: FINANCIAL POSITION */}
                                    {formStep === 2 && (
                                        <motion.div
                                            key="step-2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-5"
                                        >
                                            <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mb-6">Financial Position</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Monthly Take-home Income ($)</label>
                                                    <input 
                                                        type="number" 
                                                        value={formData.monthlyIncome}
                                                        onChange={e => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                                                        className="px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Savings Balance ($)</label>
                                                    <input 
                                                        type="number" 
                                                        value={formData.savingsBalance}
                                                        onChange={e => setFormData({ ...formData, savingsBalance: Number(e.target.value) })}
                                                        className="px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Total Outstanding Debt ($)</label>
                                                <input 
                                                    type="number" 
                                                    value={formData.totalDebt}
                                                    onChange={e => setFormData({ ...formData, totalDebt: Number(e.target.value) })}
                                                    placeholder="Include credit cards, auto loans, collections, etc."
                                                    className="px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-blue-200 font-black">Estimated Credit Score Range</label>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    {[
                                                        { value: 'poor', label: '300 - 579 (Poor)' },
                                                        { value: 'fair', label: '580 - 669 (Fair)' },
                                                        { value: 'good', label: '670 - 739 (Good)' },
                                                        { value: 'excellent', label: '740 - 850 (Excellent)' }
                                                    ].map(opt => (
                                                        <button
                                                            key={opt.value}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, estimatedScoreRange: opt.value })}
                                                            className={`p-3 text-xs font-bold rounded-xl border transition-all ${formData.estimatedScoreRange === opt.value ? 'bg-yellow-400 border-yellow-500 text-blue-950 shadow-md shadow-yellow-950/20' : 'bg-black/30 border-white/10 text-white hover:bg-white/10'}`}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 3: CREDIT HISTORY & IDENTITY */}
                                    {formStep === 3 && (
                                        <motion.div
                                            key="step-3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mb-4">Credit History</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Do you have active collections?</label>
                                                    <div className="flex gap-3">
                                                        {['yes', 'no'].map(opt => (
                                                            <button
                                                                key={opt}
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, hasCollections: opt })}
                                                                className={`flex-1 p-3 text-xs font-black uppercase tracking-widest rounded-xl border transition-all ${formData.hasCollections === opt ? 'bg-yellow-400 border-yellow-500 text-blue-950' : 'bg-black/30 border-white/10 text-white hover:bg-white/10'}`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Have you had recent late payments?</label>
                                                    <div className="flex gap-3">
                                                        {['yes', 'no'].map(opt => (
                                                            <button
                                                                key={opt}
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, hasLatePayments: opt })}
                                                                className={`flex-1 p-3 text-xs font-black uppercase tracking-widest rounded-xl border transition-all ${formData.hasLatePayments === opt ? 'bg-yellow-400 border-yellow-500 text-blue-950' : 'bg-black/30 border-white/10 text-white hover:bg-white/10'}`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Which best describes your current financial identity?</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    {['Rebuilder', 'Builder', 'Survivor', 'Legacy Builder', 'Dreamer', 'Overwhelmed'].map(opt => (
                                                        <button
                                                            key={opt}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, financialIdentity: opt })}
                                                            className={`p-3 text-xs font-bold rounded-xl border transition-all ${formData.financialIdentity === opt ? 'bg-yellow-400 border-yellow-500 text-blue-950 shadow-md shadow-yellow-950/20' : 'bg-black/30 border-white/10 text-white hover:bg-white/10'}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-blue-200">What is your biggest credit obstacle?</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.biggestObstacle}
                                                    onChange={e => setFormData({ ...formData, biggestObstacle: e.target.value })}
                                                    placeholder="e.g. Late payments, high debt, or collections" 
                                                    className="px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors"
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 4: MOTIVATION & ACCOUNTABILITY */}
                                    {formStep === 4 && (
                                        <motion.div
                                            key="step-4"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-5"
                                        >
                                            <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mb-6">Motivation & Accountability</h3>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-blue-200">How urgent is resolving your credit situation?</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {['low', 'medium', 'high'].map(opt => (
                                                        <button
                                                            key={opt}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, urgency: opt })}
                                                            className={`p-3 text-xs font-black uppercase tracking-widest rounded-xl border transition-all ${formData.urgency === opt ? 'bg-yellow-400 border-yellow-500 text-blue-950' : 'bg-black/30 border-white/10 text-white hover:bg-white/10'}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-blue-200">What is your current financial confidence level?</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {['low', 'medium', 'high'].map(opt => (
                                                        <button
                                                            key={opt}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, confidenceLevel: opt })}
                                                            className={`p-3 text-xs font-black uppercase tracking-widest rounded-xl border transition-all ${formData.confidenceLevel === opt ? 'bg-yellow-400 border-yellow-500 text-blue-950' : 'bg-black/30 border-white/10 text-white hover:bg-white/10'}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-blue-200">What style of accountability works best for you?</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {['Daily check-ins', 'Weekly coaching', 'Intense accountability partner', 'Self-study'].map(opt => (
                                                        <button
                                                            key={opt}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, accountabilityPreference: opt })}
                                                            className={`p-3 text-xs font-bold rounded-xl border transition-all ${formData.accountabilityPreference === opt ? 'bg-yellow-400 border-yellow-500 text-blue-950 shadow-md shadow-yellow-950/20' : 'bg-black/30 border-white/10 text-white hover:bg-white/10'}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                </AnimatePresence>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center border-t border-white/10 pt-6 mt-6">
                                <Button 
                                    onClick={prevStep}
                                    variant="ghost"
                                    className="text-white hover:bg-white/10 gap-1 uppercase text-xs"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </Button>

                                <Button 
                                    onClick={nextStep}
                                    className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black rounded-xl px-8 gap-2 uppercase tracking-wide"
                                    disabled={formStep === 1 && (!formData.fullName || !formData.email)}
                                >
                                    {formStep === 4 ? "Submit Application" : "Next Step"}
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* VIEW 3: PERSONALIZED RESULTS VIEW */}
                    {view === 'results' && (
                        <motion.div
                            key="results-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full flex flex-col md:flex-row gap-8 items-stretch"
                        >
                            
                            {/* Left Side: Score & Core Metrics */}
                            <div className="flex-1 bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-between text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                
                                <div className="w-full">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">
                                        Exam Evaluation Report ///
                                    </span>
                                    <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter mt-1 mb-6">
                                        Your Acceptance Results
                                    </h3>
                                </div>

                                {/* Custom Score Arc Gauge */}
                                <div className="relative w-64 h-64 flex items-center justify-center mb-6">
                                    <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle 
                                            cx="50" cy="50" r="40" 
                                            fill="transparent" 
                                            stroke="rgba(255,255,255,0.05)" 
                                            strokeWidth="8"
                                        />
                                        <motion.circle 
                                            cx="50" cy="50" r="40" 
                                            fill="transparent" 
                                            stroke={calculatedScore >= 740 ? '#f59e0b' : calculatedScore >= 670 ? '#10b981' : calculatedScore >= 580 ? '#fb923c' : '#ef4444'} 
                                            strokeWidth="8"
                                            strokeDasharray={`${2 * Math.PI * 40}`}
                                            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                                            animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - (calculatedScore - 300) / 550) }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    
                                    <div className="z-10 text-center flex flex-col items-center">
                                        <motion.span 
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                            className="text-6xl font-black italic tracking-tighter text-white"
                                        >
                                            {calculatedScore}
                                        </motion.span>
                                        <span className="text-xs uppercase font-mono tracking-widest text-slate-300 font-bold mt-1">Calculated Score</span>
                                        <span className={`text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider mt-2 border ${
                                            calculatedScore >= 740 ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 
                                            calculatedScore >= 670 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 
                                            calculatedScore >= 580 ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' : 
                                            'bg-red-500/20 text-red-300 border-red-500/50'
                                        }`}>
                                            {calculatedScore >= 740 ? 'Excellent' : calculatedScore >= 670 ? 'Good' : calculatedScore >= 580 ? 'Fair' : 'Poor'}
                                        </span>
                                    </div>
                                </div>

                                {/* GPA & Dorm info */}
                                <div className="grid grid-cols-2 gap-4 w-full border-t border-white/10 pt-6 mt-4">
                                    <div className="bg-black/20 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                                        <Award className="w-5 h-5 text-yellow-400 mb-1" />
                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Financial GPA</span>
                                        <span className="text-2xl font-black italic text-white mt-1">{financialGPA}</span>
                                    </div>
                                    <div className="bg-black/20 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                                        <GraduationCap className="w-5 h-5 text-yellow-400 mb-1" />
                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Assigned Dorm</span>
                                        <span className="text-sm font-black italic text-white uppercase mt-2 tracking-wide truncate w-full">{assignedDorm}</span>
                                    </div>
                                </div>

                            </div>

                            {/* Right Side: Card Recommendation */}
                            <div className="flex-1 bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col justify-between">
                                
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">
                                        Tailored Recommendation ///
                                    </span>
                                    <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter mt-1 mb-6">
                                        Your Recommended Card
                                    </h3>
                                    
                                    {/* Digital Credit Card Mockup */}
                                    <motion.div 
                                        initial={{ rotateY: -180, opacity: 0 }}
                                        animate={{ rotateY: 0, opacity: 1 }}
                                        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                                        className={`w-full max-w-[360px] aspect-[1.586/1] mx-auto rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden mb-6 group ${recommendedCard.imageBg}`}
                                    >
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15)_0%,transparent_100%)] pointer-events-none" />
                                        
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">Credit University</span>
                                                <h4 className="text-sm font-black tracking-wider uppercase italic leading-none">{recommendedCard.name}</h4>
                                            </div>
                                            <span className="text-xl font-bold">🎓</span>
                                        </div>

                                        <div className="flex gap-3 items-center opacity-80">
                                            <div className="w-10 h-7 bg-amber-200/80 rounded-md border border-amber-600/30 flex items-center justify-center shadow-inner relative">
                                                <div className="absolute inset-x-2 inset-y-1 border border-amber-800/20" />
                                            </div>
                                            <span className="text-xs transform rotate-90 tracking-tighter text-white/60 font-mono">)))</span>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span className="block text-[8px] font-mono tracking-widest opacity-60">CARDHOLDER</span>
                                                <span className="text-xs font-bold tracking-wider font-mono uppercase">{formData.fullName || "CREDIT ARCHITECT"}</span>
                                            </div>
                                            <div>
                                                <span className="block text-[8px] font-mono tracking-widest opacity-60 text-right">EXPIRES</span>
                                                <span className="text-xs font-bold tracking-wider font-mono text-right">07/31</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Card Details */}
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-xs uppercase text-slate-400 font-bold tracking-widest">Target Score Tier</span>
                                            <p className="text-sm text-yellow-300 font-bold">{recommendedCard.scoreRange}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs uppercase text-slate-400 font-bold tracking-widest">Core Benefits</span>
                                            <ul className="list-disc pl-4 text-sm text-slate-200 space-y-1.5 mt-1 font-light">
                                                {recommendedCard.benefits.map((b, i) => (
                                                    <li key={i}>{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <div>
                                                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Variable APR</span>
                                                <p className="text-xs text-white">{recommendedCard.apr}</p>
                                            </div>
                                            <div>
                                                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Annual Fee</span>
                                                <p className="text-xs text-white">{recommendedCard.annualFee}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6 mt-8 flex flex-col sm:flex-row gap-3">
                                    <Button 
                                        onClick={() => { setView('form'); setFormStep(4); }}
                                        variant="outline"
                                        className="border-white/20 hover:bg-white/10 text-white font-bold flex-1 uppercase tracking-wider py-4 h-12"
                                    >
                                        Edit Answers
                                    </Button>
                                    <Button 
                                        onClick={() => { setView('welcome'); setFormData(INITIAL_DATA); setFormStep(1); }}
                                        variant="outline"
                                        className="border-white/20 hover:bg-white/10 text-white font-bold flex-1 uppercase tracking-wider py-4 h-12"
                                    >
                                        Start Fresh
                                    </Button>
                                </div>
                                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                                    <Button 
                                        onClick={() => setView('locker')}
                                        className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black flex-1 uppercase tracking-wider py-4 h-12 gap-2"
                                    >
                                        Go to Student Locker
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                    <Button 
                                        onClick={() => setView('admin')}
                                        variant="outline"
                                        className="border-white/20 hover:bg-white/10 text-white font-bold flex-1 uppercase tracking-wider py-4 h-12 gap-2"
                                    >
                                        Dean Admin Panel 🛡️
                                    </Button>
                                </div>

                            </div>

                        </motion.div>
                    )}

                    {/* VIEW 4: MOCK STUDENT LOCKER VIEW */}
                    {view === 'locker' && (
                        <motion.div
                            key="locker-view"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            className="w-full max-w-4xl bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 mb-8 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-yellow-400 text-blue-900 rounded-xl flex items-center justify-center font-black text-xl">🎒</div>
                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tight">Student Locker</h3>
                                        <p className="text-xs text-blue-200">Freshman Portal: <span className="text-white font-bold">{formData.fullName || "Freshman"}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" onClick={() => setView('results')} className="h-10 py-0 flex items-center gap-2 text-xs uppercase font-bold">
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Results
                                    </Button>
                                    <Button variant="outline" onClick={() => setView('admin')} className="h-10 py-0 flex items-center gap-2 text-xs uppercase font-bold">
                                        Dean Admin 🛡️
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left Locker Column: Academic Overview */}
                                <div className="md:col-span-1 space-y-6">
                                    <div className="bg-black/30 border border-white/10 rounded-2xl p-6 text-center flex flex-col items-center">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-yellow-400 mb-2">Evaluated Profile</span>
                                        <div className="w-20 h-20 bg-blue-900/60 rounded-full border border-yellow-400/40 flex items-center justify-center text-3xl font-black text-white italic mb-3">
                                            {calculatedScore}
                                        </div>
                                        <h4 className="font-bold text-white uppercase text-sm leading-tight">{formData.fullName || "Freshman Student"}</h4>
                                        <p className="text-xs text-blue-200 mt-1">{formData.email}</p>
                                        <div className="mt-4 w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 flex justify-between text-xs text-slate-300">
                                            <span>Financial GPA:</span>
                                            <span className="font-bold text-white">{financialGPA}</span>
                                        </div>
                                        <div className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 flex justify-between text-xs text-slate-300">
                                            <span>Assigned Dorm:</span>
                                            <span className="font-bold text-white uppercase text-[10px]">{assignedDorm}</span>
                                        </div>
                                    </div>

                                    {/* Unlocked Card Widget */}
                                    <div className="bg-gradient-to-br from-blue-950 to-slate-950 border border-white/10 rounded-2xl p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CreditCard className="w-5 h-5 text-yellow-400" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Unlocked Recommendation</span>
                                        </div>
                                        <h4 className="font-black text-sm text-white italic uppercase">{recommendedCard.name}</h4>
                                        <p className="text-[11px] text-blue-200 mt-2 leading-relaxed">{recommendedCard.benefits[0]}</p>
                                        <div className="mt-4 flex items-center justify-between text-xs border-t border-white/10 pt-3">
                                            <span className="text-yellow-400 font-bold uppercase tracking-widest text-[9px]">Apply Status:</span>
                                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 text-[9px] uppercase font-mono">Approved</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Locker Column: Lessons & Resource Vault */}
                                <div className="md:col-span-2 space-y-6">
                                    {/* Dorm Specific Lessons */}
                                    <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <BookOpen className="w-5 h-5 text-yellow-400" />
                                            <h4 className="text-sm font-black uppercase tracking-widest text-white">Your Unlocked Curriculum</h4>
                                        </div>
                                        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                                            As an resident of <strong className="text-white">{assignedDorm}</strong>, we have unlocked specific financial modules designed to target your obstacles:
                                        </p>
                                        
                                        <div className="space-y-3">
                                            {[
                                                { id: 1, title: 'Dismantling Collection Letters & Factual Disputes', time: '12 min', state: 'unlocked' },
                                                { id: 2, title: 'Optimizing Credit Card Balances & Utilization Spikes', time: '15 min', state: 'unlocked' },
                                                { id: 3, title: 'Building Primary Tradelines & Authorized User Secrets', time: '20 min', state: 'locked', req: '700+ Score' }
                                            ].map((lesson) => (
                                                <div 
                                                    key={lesson.id}
                                                    className={`p-4 border rounded-xl flex items-center justify-between transition-all ${
                                                        lesson.state === 'unlocked' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/50 border-white/5 opacity-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-slate-400 font-mono text-xs">0{lesson.id}</div>
                                                        <div>
                                                            <h5 className="font-bold text-xs text-white leading-none">{lesson.title}</h5>
                                                            <span className="text-[10px] text-slate-400 font-mono mt-1 block flex items-center gap-1">
                                                                <Clock className="w-3 h-3" /> {lesson.time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {lesson.state === 'unlocked' ? (
                                                            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                                                <Unlock className="w-3.5 h-3.5" /> Start
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                                                                <Lock className="w-3.5 h-3.5" /> {lesson.req}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Dispute Letter Generator */}
                                    <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <FileText className="w-5 h-5 text-yellow-400" />
                                            <h4 className="text-sm font-black uppercase tracking-widest text-white">Admissions Bureau Dispute Letter</h4>
                                        </div>
                                        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                                            Based on your obstacle (<strong className="text-yellow-400">{formData.biggestObstacle || "late payments"}</strong>), here is a custom factual dispute letter drafted by our AI engine:
                                        </p>
                                        <div className="w-full bg-black/60 border border-white/10 p-4 rounded-xl font-mono text-[10px] text-slate-300 leading-relaxed overflow-x-auto whitespace-pre h-36">
{`To Whom It May Concern,

I am writing to formally dispute the following inaccurate reporting in my credit profile.
Specifically, regarding the account listed with the major credit reporting agencies:

Admissions Profile: ${formData.fullName}
Estimated Obstacle: ${formData.biggestObstacle}
Residential State: ${formData.state}

Under the Fair Credit Reporting Act (FCRA), Section 611, I request immediate investigation 
and verification of this item. If verification cannot be furnished, please delete 
this item immediately from my consumer profile.

Sincerely,
${formData.fullName || "Student Client"}`}
                                        </div>
                                        <div className="mt-4 flex justify-end gap-3">
                                            <Button 
                                                onClick={() => {
                                                    alert("Factual dispute letter content copied to clipboard!");
                                                    navigator.clipboard.writeText(`Factual Dispute Letter for ${formData.fullName}`);
                                                }}
                                                className="py-2.5 px-5 text-xs font-bold uppercase h-10"
                                            >
                                                Copy Letter Text
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* VIEW 5: MOCK DEAN ADMIN DASHBOARD VIEW */}
                    {view === 'admin' && (
                        <motion.div
                            key="admin-view"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            className="w-full max-w-4xl bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl"
                        >
                            {/* Dashboard Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-6 mb-8 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-yellow-400 text-blue-900 rounded-xl flex items-center justify-center font-black text-xl">🛡️</div>
                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tight">Dean Admin Dashboard</h3>
                                        <p className="text-xs text-blue-200">Mock Database Management & User Lookup</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setView('welcome')} className="h-10 py-0 flex items-center gap-2 text-xs uppercase font-bold">
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Welcome
                                    </Button>
                                    <Button variant="outline" onClick={handleResetDb} className="h-10 py-0 text-xs uppercase font-bold border-red-500/30 hover:bg-red-500/10 text-red-400">
                                        Reset DB
                                    </Button>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                                    <Users className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Profiles</span>
                                    <span className="text-2xl font-black text-white mt-1 block">{pastSubmissions.length}</span>
                                </div>
                                <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                                    <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Average Score</span>
                                    <span className="text-2xl font-black text-white mt-1 block">{averageScore}</span>
                                </div>
                                <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                                    <TrendingUp className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Legacy Hall (740+)</span>
                                    <span className="text-2xl font-black text-white mt-1 block">{dormDistribution['Wealth Hall'] || 0}</span>
                                </div>
                                <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                                    <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Seeded Profiles</span>
                                    <span className="text-2xl font-black text-white mt-1 block">3</span>
                                </div>
                            </div>

                            {/* Distribution chart and User Table */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                {/* Left Side: Search & Table */}
                                <div className="md:col-span-2 space-y-4">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            placeholder="Search by name, email, or dorm..." 
                                            className="w-full px-4 py-3 pl-10 border border-white/20 rounded-xl bg-black/40 text-sm focus:outline-none focus:border-yellow-400"
                                        />
                                        <Search className="absolute left-3 top-3.5 w-4 h-4 text-white/40" />
                                    </div>

                                    <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/20">
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse text-left text-xs">
                                                <thead>
                                                    <tr className="bg-white/5 border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                                                        <th className="p-4">Name</th>
                                                        <th className="p-4">Score</th>
                                                        <th className="p-4">GPA</th>
                                                        <th className="p-4">Dorm</th>
                                                        <th className="p-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {filteredSubmissions.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={5} className="p-8 text-center text-slate-500 italic">No matching records found</td>
                                                        </tr>
                                                    ) : (
                                                        filteredSubmissions.map((sub) => (
                                                            <tr 
                                                                key={sub.id} 
                                                                onClick={() => handleSelectSubmission(sub)}
                                                                className="hover:bg-white/5 cursor-pointer transition-colors"
                                                            >
                                                                <td className="p-4 font-bold">
                                                                    <div>{sub.formData.fullName}</div>
                                                                    <div className="text-[10px] text-slate-400 font-light mt-0.5">{sub.formData.email}</div>
                                                                </td>
                                                                <td className="p-4">
                                                                    <span className={`px-2 py-0.5 rounded font-black ${
                                                                        sub.score >= 740 ? 'bg-amber-400/20 text-amber-300' : 
                                                                        sub.score >= 670 ? 'bg-emerald-400/20 text-emerald-300' : 
                                                                        sub.score >= 580 ? 'bg-orange-400/20 text-orange-300' : 
                                                                        'bg-red-400/20 text-red-300'
                                                                    }`}>
                                                                        {sub.score}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 font-mono font-bold text-white">{sub.gpa}</td>
                                                                <td className="p-4 text-slate-300 uppercase text-[9px] tracking-wider font-bold">{sub.dorm}</td>
                                                                <td className="p-4 text-right">
                                                                    <button
                                                                        onClick={(e) => handleDeleteSubmission(sub.id, e)}
                                                                        className="p-1.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all inline-block"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Visual Metrics / Insights */}
                                <div className="space-y-6">
                                    <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <PieChart className="w-5 h-5 text-yellow-400" />
                                            <h4 className="text-xs font-black uppercase tracking-widest text-white">Dorm Distributions</h4>
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                { name: 'Wealth Hall', color: 'bg-amber-500' },
                                                { name: 'Mission 800 Hall', color: 'bg-emerald-500' },
                                                { name: 'Homeownership Hall', color: 'bg-orange-500' },
                                                { name: 'Recovery Hall', color: 'bg-red-500' }
                                            ].map(d => {
                                                const count = dormDistribution[d.name] || 0;
                                                const percent = pastSubmissions.length > 0 
                                                    ? Math.round((count / pastSubmissions.length) * 100) 
                                                    : 0;
                                                
                                                return (
                                                    <div key={d.name} className="space-y-1">
                                                        <div className="flex justify-between text-xs text-slate-300">
                                                            <span className="font-medium">{d.name}</span>
                                                            <span className="font-mono font-bold text-white">{count} ({percent}%)</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <div className={`h-full ${d.color} transition-all duration-500`} style={{ width: `${percent}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="bg-black/30 border border-white/10 rounded-2xl p-6 text-xs text-slate-300 leading-relaxed space-y-2">
                                        <h5 className="font-bold text-white uppercase tracking-wider text-[10px] mb-1">Onboarding Analytics</h5>
                                        <p>
                                            * Base conversions are simulated based on inputs stored locally.
                                        </p>
                                        <p>
                                            * Mock profiles are seeded from the static configurations file.
                                        </p>
                                        <p>
                                            * You can select any user in the table to load their exact results in the funnel views.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>

            </main>

        </div>
    );
}
