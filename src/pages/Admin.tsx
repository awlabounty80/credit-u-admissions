import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, 
    Trophy, 
    TrendingUp, 
    Clock, 
    Search, 
    Trash2, 
    PlusCircle,
    Sliders,
    Award,
    BarChart3,
    Mail,
    ChevronRight,
    Play,
    Send,
    Eye
} from 'lucide-react';
import { MOCK_PROFILES, RECOMMENDED_CARDS } from '../data/admissionsData';
import { assessmentQuestions } from '../data/assessmentQuestions';

// --- CUSTOM BUTTON COMPONENT ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'danger';
    className?: string;
    children: React.ReactNode;
}

const CustomButton: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
    const baseStyle = "inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95 text-xs py-2.5 px-4 h-9";
    
    let variantStyle = "bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-md shadow-yellow-950/20";
    if (variant === 'outline') {
        variantStyle = "border-2 border-white/20 hover:bg-white/10 text-white";
    } else if (variant === 'danger') {
        variantStyle = "bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-950/20";
    }
    
    return (
        <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default function Admin() {
    const navigate = useNavigate();
    
    // Auth States
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState(false);

    // Stateful Tab: 'leads' | 'funnels' | 'emails' | 'assessment'
    const [activeTab, setActiveTab] = useState<'leads' | 'funnels' | 'emails' | 'assessment'>('leads');
    const [leadsSubTab, setLeadsSubTab] = useState<'admissions' | 'waitlist' | 'wheel-audits'>('admissions');
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [waitlistLeads, setWaitlistLeads] = useState<any[]>([]);
    const [studentExams, setStudentExams] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Email Campaign State
    const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

    // Assessment Builder States
    const [questions, setQuestions] = useState<any[]>([]);
    const [newQuestionId, setNewQuestionId] = useState('');
    const [newQuestionLabel, setNewQuestionLabel] = useState('');
    const [newQuestionType, setNewQuestionType] = useState<'select' | 'multi'>('select');
    const [newQuestionRequired, setNewQuestionRequired] = useState(true);
    const [newQuestionOptions, setNewQuestionOptions] = useState<any[]>([]);

    // Check auth on mount
    useEffect(() => {
        const isAuth = sessionStorage.getItem('cu_admin_authenticated') === 'true';
        if (isAuth) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === 'DeanAshley800') {
            setIsAuthenticated(true);
            setAuthError(false);
            sessionStorage.setItem('cu_admin_authenticated', 'true');
        } else {
            setAuthError(true);
        }
    };

    const handleDeleteQuestion = (id: string) => {
        const updated = questions.filter(q => q.id !== id);
        setQuestions(updated);
        localStorage.setItem('cu_custom_assessment_questions', JSON.stringify(updated));
    };

    const handleResetQuestions = () => {
        localStorage.removeItem('cu_custom_assessment_questions');
        setQuestions(assessmentQuestions);
    };

    const handleAddOption = () => {
        setNewQuestionOptions([...newQuestionOptions, { label: '', value: '', readinessPoints: 0 }]);
    };

    const handleRemoveOption = (index: number) => {
        setNewQuestionOptions(newQuestionOptions.filter((_, idx) => idx !== index));
    };

    const handleUpdateOption = (index: number, field: string, value: any) => {
        const updated = [...newQuestionOptions];
        updated[index] = { ...updated[index], [field]: value };
        setNewQuestionOptions(updated);
    };

    const handleSaveQuestion = () => {
        if (!newQuestionId.trim() || !newQuestionLabel.trim()) {
            alert('Please fill out the Question ID and Question Label.');
            return;
        }
        const newQ = {
            id: newQuestionId.trim(),
            label: newQuestionLabel.trim(),
            type: newQuestionType === 'select' ? 'single' : 'multi',
            required: newQuestionRequired,
            options: newQuestionOptions.filter(opt => opt.label.trim())
        };
        const updated = [...questions, newQ];
        setQuestions(updated);
        localStorage.setItem('cu_custom_assessment_questions', JSON.stringify(updated));
        
        // Reset form
        setNewQuestionId('');
        setNewQuestionLabel('');
        setNewQuestionType('select');
        setNewQuestionRequired(true);
        setNewQuestionOptions([]);
        alert('Question saved successfully! It is now active in the Free Assessment.');
    };

    // Load Admissions DB
    const loadDb = () => {
        const stored = localStorage.getItem('cu_funnel_standalone_db');
        if (stored) {
            setSubmissions(JSON.parse(stored));
        } else {
            seedDefaultMockProfiles();
        }

        // Load waitlist leads
        const storedWaitlist = localStorage.getItem('cu_funnel_waitlist_leads');
        if (storedWaitlist) {
            setWaitlistLeads(JSON.parse(storedWaitlist));
        }

        // Load custom assessment questions
        const storedQuestions = localStorage.getItem('cu_custom_assessment_questions');
        if (storedQuestions) {
            try {
                setQuestions(JSON.parse(storedQuestions));
            } catch (e) {
                setQuestions(assessmentQuestions);
            }
        } else {
            setQuestions(assessmentQuestions);
        }

        // Load student exams for Wheel Intelligence Audits
        const storedExams = localStorage.getItem('cu_student_exams');
        if (storedExams) {
            setStudentExams(JSON.parse(storedExams));
        } else {
            const defaultExams = [
                {
                    id: 'exam_mock_1',
                    student_id: 'ashley.webster@gmail.com',
                    responses: {
                        0: 'Struggling',
                        1: 'Never',
                        3: '$0',
                        7: 'Yes, multiple',
                        8: 'None'
                    },
                    score_profile: {
                        relationship: 'Struggling',
                        recent_review: 'Never',
                        savings: '$0',
                        collections: 'Yes, multiple',
                        understanding: 'None'
                    },
                    recommended_form: 'D6',
                    wheel_spun: true,
                    reward_claimed: true,
                    reward_downloaded: true,
                    reward_timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
                },
                {
                    id: 'exam_mock_2',
                    student_id: 'jordan.smith@yahoo.com',
                    responses: {
                        0: 'Improving',
                        1: 'Last 30 days',
                        3: '$1,000+',
                        7: 'No collections',
                        8: 'Average'
                    },
                    score_profile: {
                        relationship: 'Improving',
                        recent_review: 'Last 30 days',
                        savings: '$1,000+',
                        collections: 'No collections',
                        understanding: 'Average'
                    },
                    recommended_form: 'D3',
                    wheel_spun: true,
                    reward_claimed: true,
                    reward_downloaded: false,
                    reward_timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
                }
            ];
            localStorage.setItem('cu_student_exams', JSON.stringify(defaultExams));
            setStudentExams(defaultExams);
        }
    };

    useEffect(() => {
        loadDb();
    }, []);

    const seedDefaultMockProfiles = () => {
        const seeded = MOCK_PROFILES.map((prof, idx) => {
            let score = 620;
            let dorm = 'Homeownership Hall';
            let gpa = 2.4;
            
            if (prof.id === 'mock-1') {
                score = 600;
                dorm = 'Homeownership Hall';
                gpa = 2.2;
            } else if (prof.id === 'mock-2') {
                score = 780;
                dorm = 'Wealth Hall';
                gpa = 3.8;
            } else {
                score = 480;
                dorm = 'Recovery Hall';
                gpa = 1.3;
            }

            const card = RECOMMENDED_CARDS.find(c => score >= c.minScore && score <= c.maxScore) || RECOMMENDED_CARDS[3];

            return {
                id: prof.id,
                timestamp: new Date(Date.now() - 3600000 * 24 * (idx + 1)).toISOString(),
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
                score,
                dorm,
                gpa,
                recommendedCard: card,
                statusTags: idx === 1 ? ['Applicant', 'Prize Won', 'Transcript Purchased', 'Converted', 'Member', 'Legacy'] : ['Applicant'],
                selectedTier: idx === 1 ? 'Legacy VIP' : undefined,
                wonPrize: idx === 1 ? 'Mission 800 Roadmap' : undefined
            };
        });

        localStorage.setItem('cu_funnel_standalone_db', JSON.stringify(seeded));
        setSubmissions(seeded);
    };

    const handleLoadSubmission = (sub: any) => {
        localStorage.setItem('cu_current_submission', JSON.stringify(sub));
        navigate('/results');
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = submissions.filter(s => s.id !== id);
        localStorage.setItem('cu_funnel_standalone_db', JSON.stringify(updated));
        setSubmissions(updated);
    };

    const handleAddTestUser = () => {
        const randId = 'sub_rand_' + Date.now();
        const testUser = {
            id: randId,
            timestamp: new Date().toISOString(),
            formData: {
                fullName: 'Test Candidate ' + Math.floor(Math.random() * 100),
                email: 'candidate.' + Math.floor(Math.random() * 100) + '@school.edu',
                phone: '555-0100',
                state: 'FL',
                housingStatus: 'Rent',
                monthlyIncome: 3500,
                savingsBalance: 4000,
                estimatedScoreRange: 'good',
                totalDebt: 3000,
                hasCollections: 'no',
                hasLatePayments: 'no',
                financialIdentity: 'Builder',
                biggestObstacle: 'Student loans',
                urgency: 'high',
                confidenceLevel: 'medium',
                accountabilityPreference: 'Weekly coaching'
            },
            score: 710,
            dorm: 'Mission 800 Hall',
            gpa: 3.28,
            recommendedCard: RECOMMENDED_CARDS[1],
            statusTags: ['Applicant', 'Converted', 'Member', 'Freshman'],
            selectedTier: 'Freshman'
        };

        const updated = [testUser, ...submissions];
        localStorage.setItem('cu_funnel_standalone_db', JSON.stringify(updated));
        setSubmissions(updated);
    };

    const handleResetDb = () => {
        if (window.confirm("Are you sure you want to reset the admissions database and re-seed the mock records?")) {
            seedDefaultMockProfiles();
        }
    };

    const filtered = submissions.filter(s => 
        s.formData.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.formData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.dorm.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Metrics calculations
    const totalApplicants = submissions.length;
    const averageScore = totalApplicants > 0
        ? Math.round(submissions.reduce((acc, curr) => acc + curr.score, 0) / totalApplicants)
        : 0;
    
    const convertedCount = submissions.filter(s => s.statusTags.includes('Converted')).length;
    const conversionRate = totalApplicants > 0 ? Math.round((convertedCount / totalApplicants) * 100) : 0;

    const dormDistribution = submissions.reduce((acc: Record<string, number>, curr) => {
        acc[curr.dorm] = (acc[curr.dorm] || 0) + 1;
        return acc;
    }, {});

    // Visual funnel dropoffs metrics
    const funnelStages = [
        { name: '1. Landing Page Visits', count: 1850, percentage: 100, color: 'bg-indigo-600' },
        { name: '2. Exam Initiated', count: 1140, percentage: 61, color: 'bg-blue-600' },
        { name: '3. Exam Completed', count: totalApplicants * 15 + 30, percentage: 38, color: 'bg-cyan-600' },
        { name: '4. Reward Wheel Spun', count: totalApplicants * 12 + 10, percentage: 29, color: 'bg-teal-600' },
        { name: '5. Transcript Audit Ordered', count: totalApplicants * 8, percentage: 18, color: 'bg-amber-600' },
        { name: '6. Dorm Week Joined', count: totalApplicants * 5, percentage: 11, color: 'bg-orange-600' },
        { name: '7. Converted Members', count: convertedCount, percentage: conversionRate, color: 'bg-emerald-600' }
    ];

    // UTM Traffic Source Data
    const utmTraffic = [
        { channel: 'Facebook Ads Retargeting', visits: 410, leads: 82, sales: 18, conv: '22.0%' },
        { channel: 'Google Search Ads', visits: 540, leads: 64, sales: 9, conv: '14.1%' },
        { channel: 'TikTok Organic Video', visits: 680, leads: 95, sales: 11, conv: '11.6%' },
        { channel: 'YouTube Financial Influencers', visits: 180, leads: 38, sales: 12, conv: '31.6%' },
        { channel: 'Referral/Word-of-mouth', visits: 40, leads: 18, sales: 15, conv: '83.3%' }
    ];

    // Email campaigns configurations
    const emailCampaigns = [
        {
            id: 'freshman-drip',
            name: 'Freshman Welcome Drip',
            trigger: 'Applicant Tag',
            steps: 5,
            delivered: totalApplicants,
            openRate: '68%',
            ctr: '24%',
            emails: [
                { step: 1, subject: 'Your Acceptance Results are Locked In! 🎓', delay: 'Instant', body: 'Welcome to Credit U! Your acceptance exam results have been calculated. You have been assigned to your dorm hall. Log in to claim your credentials...' },
                { step: 2, subject: 'Dean Ashley: The Credit Matrix is Real 👁️', delay: '1 day', body: 'FICO was designed to keep you in debt. In this private lecture training, I break down the consumer laws the credit bureaus do not want you to audit...' },
                { step: 3, subject: 'Check your transcript audit results...', delay: '2 days', body: 'Our audit scans identified factual errors in your report. Make sure to download the custom bureau factual dispute template to delete collections...' }
            ]
        },
        {
            id: 'transcript-drip',
            name: 'Audit Review Conversion Sequence',
            trigger: 'Transcript Uploaded Tag',
            steps: 3,
            delivered: submissions.filter(s => s.statusTags.includes('Transcript Uploaded')).length,
            openRate: '74%',
            ctr: '38%',
            emails: [
                { step: 1, subject: 'Factual Errors flagged in your profile ⚠️', delay: 'Instant', body: 'Our simulated scanner flagged violations. Order your custom dispute letter package to initiate audit investigations with bureaus...' },
                { step: 2, subject: 'Your draft letter is expiring...', delay: '1 day', body: 'Your factual dispute document expires soon. Do not let collectors report false balances. Secure your $39 expert review today...' }
            ]
        },
        {
            id: 'dorm-week-urgency',
            name: 'Dorm Week Initiation Sequences',
            trigger: 'Transcript Purchased Tag',
            steps: 4,
            delivered: submissions.filter(s => s.statusTags.includes('Transcript Purchased')).length,
            openRate: '81%',
            ctr: '44%',
            emails: [
                { step: 1, subject: 'Dorm Week begins now! Claim your 250 Moo Points 🐮', delay: 'Instant', body: 'Your onboarding reset schedule is live. Log in to access your modules. You have been awarded 250 Moo points for today\'s task...' },
                { step: 2, subject: 'Mandatory Room Checklist inside...', delay: '1 day', body: 'Day 2 workbook is ready. Erase collections and build primary tradelines. Do not miss tonight\'s cohort live stream with Dean Ashley...' }
            ]
        }
    ];

    const currentCampaign = emailCampaigns.find(c => c.id === selectedCampaign);

    if (!isAuthenticated) {
        return (
            <div className="relative flex-1 flex items-center justify-center py-20 px-4 md:px-6 min-h-[90vh]">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-md h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="max-w-md w-full bg-[#0033A0]/30 backdrop-blur-xl border border-yellow-400/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center relative z-10 text-center space-y-6">
                    <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/30 text-yellow-350 rounded-full flex items-center justify-center shadow-inner">
                        <Users className="w-8 h-8" />
                    </div>
                    
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400 font-mono">
                            Credit U™ Admissions Portal ///
                        </span>
                        <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter mt-1">
                            Dean Dashboard
                        </h3>
                        <p className="text-xs text-blue-200 mt-2 leading-relaxed">
                            Restricted Area. Please enter the Dean Access Code to view applicant logs, waitlists, and email campaigns.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="w-full space-y-4">
                        <div className="flex flex-col gap-2 text-left">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Dean Access Code</label>
                            <input 
                                type="password" 
                                value={passwordInput}
                                onChange={e => {
                                    setPasswordInput(e.target.value);
                                    setAuthError(false);
                                }}
                                placeholder="••••••••••••" 
                                className="w-full px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white placeholder-white/25 focus:outline-none focus:border-yellow-400 transition-colors text-center text-sm font-mono tracking-widest"
                            />
                            {authError && (
                                <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-1 text-center">
                                    ❌ Invalid Dean Access Code. Access Denied.
                                </p>
                            )}
                        </div>
                        <button 
                            type="submit" 
                            className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black text-xs uppercase rounded-xl tracking-widest shadow-md shadow-yellow-950/20 transition-transform active:scale-95"
                        >
                            VERIFY ACCESS CODE
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex-1 flex flex-col items-center justify-start py-8 px-4 md:px-6">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-5xl w-full bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative z-10 space-y-6">
                
                {/* Header controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-6 gap-4">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">
                            Admissions Command Center ///
                        </span>
                        <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter mt-1">
                            Dean Dashboard
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <CustomButton variant="outline" onClick={handleAddTestUser} className="gap-1.5 flex-1 sm:flex-none">
                            <PlusCircle className="w-4 h-4 text-yellow-400" />
                            Add Test Lead
                        </CustomButton>
                        <CustomButton variant="outline" onClick={handleResetDb} className="gap-1.5 flex-1 sm:flex-none text-red-400 border-red-500/20 hover:bg-red-500/10">
                            Reset Mock DB
                        </CustomButton>
                    </div>
                </div>

                {/* Sub Tab Navigation */}
                <div className="flex border-b border-white/10 gap-6 text-xs uppercase tracking-wider font-bold">
                    <button 
                        onClick={() => setActiveTab('leads')}
                        className={`pb-3 transition-colors ${activeTab === 'leads' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        Leads CRM ({totalApplicants})
                    </button>
                    <button 
                        onClick={() => setActiveTab('funnels')}
                        className={`pb-3 transition-colors ${activeTab === 'funnels' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        <BarChart3 className="w-3.5 h-3.5 inline mr-1" />
                        Conversion Funnels & Traffic
                    </button>
                    <button 
                        onClick={() => setActiveTab('emails')}
                        className={`pb-3 transition-colors ${activeTab === 'emails' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Mail className="w-3.5 h-3.5 inline mr-1" />
                        Email Campaigns
                    </button>
                    <button 
                        onClick={() => setActiveTab('assessment')}
                        className={`pb-3 transition-colors ${activeTab === 'assessment' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Sliders className="w-3.5 h-3.5 inline mr-1" />
                        Assessment Builder™
                    </button>
                </div>

                {/* TAB 1: LEADS CRM */}
                {activeTab === 'leads' && (
                    <div className="space-y-6">
                        {/* Sub-selector for Leads Type */}
                        <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5 w-fit gap-2 select-none">
                            <button
                                type="button"
                                onClick={() => setLeadsSubTab('admissions')}
                                className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all ${leadsSubTab === 'admissions' ? 'bg-yellow-400 text-blue-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                Admissions Applications ({submissions.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setLeadsSubTab('waitlist')}
                                className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all ${leadsSubTab === 'waitlist' ? 'bg-yellow-400 text-blue-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                Waitlist Exam Leads ({waitlistLeads.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setLeadsSubTab('wheel-audits')}
                                className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all ${leadsSubTab === 'wheel-audits' ? 'bg-yellow-400 text-blue-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                Intelligent Wheel Audits ({studentExams.length})
                            </button>
                        </div>

                        {leadsSubTab === 'admissions' && (
                            <>
                                {/* Metrics Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-black/30 border border-white/10 p-4 rounded-2xl text-center">
                                        <Users className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Total Leads</span>
                                        <span className="text-2xl font-black text-white mt-1 block font-mono">{totalApplicants}</span>
                                    </div>
                                    <div className="bg-black/30 border border-white/10 p-4 rounded-2xl text-center">
                                        <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Avg FICO Score</span>
                                        <span className="text-2xl font-black text-white mt-1 block font-mono">{averageScore}</span>
                                    </div>
                                    <div className="bg-black/30 border border-white/10 p-4 rounded-2xl text-center">
                                        <TrendingUp className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Conversion Rate</span>
                                        <span className="text-2xl font-black text-white mt-1 block font-mono">{conversionRate}%</span>
                                    </div>
                                    <div className="bg-black/30 border border-white/10 p-4 rounded-2xl text-center">
                                        <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Cohort Opening</span>
                                        <span className="text-sm font-black text-yellow-300 mt-2.5 block uppercase tracking-wide">July 21</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                    {/* CRM List */}
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
                                                        <tr className="bg-white/5 border-b border-white/10 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                                                            <th className="p-4">Applicant</th>
                                                            <th className="p-4">Calculated</th>
                                                            <th className="p-4">Status Tagging</th>
                                                            <th className="p-4 text-right">Review / Clear</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5">
                                                        {filtered.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={4} className="p-8 text-center text-slate-500 italic">No matching applicant profiles found</td>
                                                            </tr>
                                                        ) : (
                                                            filtered.map((sub) => (
                                                                <tr 
                                                                    key={sub.id} 
                                                                    onClick={() => handleLoadSubmission(sub)}
                                                                    className="hover:bg-white/5 cursor-pointer transition-colors"
                                                                >
                                                                    <td className="p-4 font-bold">
                                                                        <div className="text-white text-xs">{sub.formData.fullName}</div>
                                                                        <div className="text-[10px] text-slate-400 font-light mt-0.5">{sub.formData.email}</div>
                                                                    </td>
                                                                    <td className="p-4 font-mono">
                                                                        <div className="flex flex-col">
                                                                            <span className="text-white font-bold">{sub.score} FICO</span>
                                                                            <span className="text-[9px] text-slate-400 uppercase mt-0.5">{sub.dorm.split(' ')[0]} Hall</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4">
                                                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                                            {sub.statusTags.map((tag: string, idx: number) => (
                                                                                <span 
                                                                                    key={idx}
                                                                                    className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                                                                                        tag === 'Converted' || tag === 'Member' ? 'bg-emerald-500/20 text-emerald-300' :
                                                                                        tag === 'Transcript Purchased' || tag === 'Dorm Week' ? 'bg-amber-500/20 text-amber-300' :
                                                                                        'bg-white/10 text-slate-300'
                                                                                    }`}
                                                                                >
                                                                                    {tag}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 text-right">
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); handleLoadSubmission(sub); }}
                                                                                className="p-2 rounded bg-yellow-400/10 text-yellow-300 border border-yellow-400/20 hover:bg-yellow-400 hover:text-blue-950 transition-all"
                                                                                title="Review Profile Results"
                                                                            >
                                                                                <Sliders className="w-3.5 h-3.5" />
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => handleDelete(sub.id, e)}
                                                                                className="p-2 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                                                                title="Delete Lead"
                                                                            >
                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Dorm Distribution */}
                                    <div className="space-y-6">
                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Award className="w-5 h-5 text-yellow-400" />
                                                <h4 className="text-xs font-black uppercase tracking-widest text-white font-black">Dorm Assignments</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { name: 'Wealth Hall', color: 'bg-amber-500' },
                                                    { name: 'Mission 800 Hall', color: 'bg-emerald-500' },
                                                    { name: 'Homeownership Hall', color: 'bg-orange-500' },
                                                    { name: 'Recovery Hall', color: 'bg-red-500' }
                                                ].map(d => {
                                                    const count = dormDistribution[d.name] || 0;
                                                    const percent = totalApplicants > 0 
                                                        ? Math.round((count / totalApplicants) * 100) 
                                                        : 0;
                                                    return (
                                                        <div key={d.name} className="space-y-1">
                                                            <div className="flex justify-between text-[10px] font-bold">
                                                                <span className="text-slate-300">{d.name}</span>
                                                                <span className="text-white font-mono">{count} ({percent}%)</span>
                                                            </div>
                                                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                                <div className={`h-full ${d.color}`} style={{ width: `${percent}%` }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {leadsSubTab === 'waitlist' && (
                            <>
                                {/* Waitlist Funnel Leads Metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-black/30 border border-white/10 p-4 rounded-2xl text-center">
                                        <Users className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Waitlist Joined</span>
                                        <span className="text-2xl font-black text-white mt-1 block font-mono">{waitlistLeads.length}</span>
                                    </div>
                                    <div className="bg-black/30 border border-white/10 p-4 rounded-2xl text-center">
                                        <Award className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Exams Completed</span>
                                        <span className="text-2xl font-black text-white mt-1 block font-mono">
                                            {waitlistLeads.filter(l => l.exam_completed).length}
                                        </span>
                                    </div>
                                    <div className="bg-black/30 border border-white/10 p-4 rounded-2xl text-center">
                                        <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Most Common Reward</span>
                                        <span className="text-[11px] font-black text-yellow-300 mt-2 block uppercase truncate px-1">
                                            {(() => {
                                                const rewards = waitlistLeads.filter(l => l.reward).map(l => l.reward);
                                                if (rewards.length === 0) return 'None';
                                                const counts = rewards.reduce((acc: Record<string, number>, curr) => {
                                                    acc[curr] = (acc[curr] || 0) + 1;
                                                    return acc;
                                                }, {});
                                                return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
                                            })()}
                                        </span>
                                    </div>
                                    <div className="bg-black/30 border border-white/10 p-4 rounded-2xl text-center">
                                        <TrendingUp className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Wheel Spin Rate</span>
                                        <span className="text-2xl font-black text-white mt-1 block font-mono">
                                            {waitlistLeads.length > 0 
                                                ? Math.round((waitlistLeads.filter(l => l.wheel_spun).length / waitlistLeads.length) * 100)
                                                : 0}%
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                    {/* Waitlist CRM List */}
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                placeholder="Search waitlist leads..." 
                                                className="w-full px-4 py-3 pl-10 border border-white/20 rounded-xl bg-black/40 text-sm focus:outline-none focus:border-yellow-400"
                                            />
                                            <Search className="absolute left-3 top-3.5 w-4 h-4 text-white/40" />
                                        </div>

                                        <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/20">
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse text-left text-xs">
                                                    <thead>
                                                        <tr className="bg-white/5 border-b border-white/10 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                                                            <th className="p-4">Student</th>
                                                            <th className="p-4">Credit Info</th>
                                                            <th className="p-4">Prize Reward</th>
                                                            <th className="p-4 text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5">
                                                        {(() => {
                                                            const filteredWaitlist = waitlistLeads.filter(l => 
                                                                (l.name && l.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                                                l.email.toLowerCase().includes(searchTerm.toLowerCase())
                                                            );
                                                            
                                                            if (filteredWaitlist.length === 0) {
                                                                return (
                                                                    <tr>
                                                                        <td colSpan={4} className="p-8 text-center text-slate-500 italic">No waitlist candidate logs found</td>
                                                                    </tr>
                                                                );
                                                            }

                                                            return filteredWaitlist.map((lead) => (
                                                                <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                                                                    <td className="p-4 font-bold">
                                                                        <div className="text-white text-xs">{lead.name}</div>
                                                                        <div className="text-[10px] text-slate-400 font-light mt-0.5">{lead.email}</div>
                                                                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">{lead.phone}</div>
                                                                    </td>
                                                                    <td className="p-4">
                                                                        <div className="text-white font-bold">{lead.score_range} FICO</div>
                                                                        <div className="text-[9px] text-slate-300 font-light mt-0.5 truncate max-w-[150px]">{lead.goal}</div>
                                                                    </td>
                                                                    <td className="p-4 font-bold">
                                                                        {lead.reward ? (
                                                                            <span className="px-2 py-0.5 rounded text-[8px] bg-yellow-400/20 text-yellow-300 font-mono uppercase">
                                                                                {lead.reward}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-slate-500 italic text-[10px]">No Spin Yet</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="p-4 text-right">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                const updated = waitlistLeads.filter(l => l.id !== lead.id);
                                                                                localStorage.setItem('cu_funnel_waitlist_leads', JSON.stringify(updated));
                                                                                setWaitlistLeads(updated);
                                                                            }}
                                                                            className="p-2 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                                                            title="Delete Waitlist Lead"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ));
                                                        })()}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Waitlist Interest Distributions */}
                                    <div className="space-y-6">
                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Award className="w-5 h-5 text-yellow-400" />
                                                <h4 className="text-xs font-black uppercase tracking-widest text-white font-black">Financial Challenges</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {(() => {
                                                    const challengeCounts = waitlistLeads.reduce((acc: Record<string, number>, curr) => {
                                                        acc[curr.challenge] = (acc[curr.challenge] || 0) + 1;
                                                        return acc;
                                                    }, {});
                                                    
                                                    const list = ['Late Payments', 'Collection Accounts', 'Inquiries', 'Thin File', 'High Utilization', 'Budgeting'];
                                                    return list.map(ch => {
                                                        const count = challengeCounts[ch] || 0;
                                                        const percent = waitlistLeads.length > 0 
                                                            ? Math.round((count / waitlistLeads.length) * 100) 
                                                            : 0;
                                                        return (
                                                            <div key={ch} className="space-y-1">
                                                                <div className="flex justify-between text-[10px] font-bold">
                                                                    <span className="text-slate-350">{ch}</span>
                                                                    <span className="text-white font-mono">{count} ({percent}%)</span>
                                                                </div>
                                                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-yellow-400" style={{ width: `${percent}%` }} />
                                                                </div>
                                                            </div>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {leadsSubTab === 'wheel-audits' && (
                            <div className="space-y-6">
                                {/* Metrics Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-black/30 border border-white/10 p-4 rounded-2xl text-center">
                                        <Users className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Audits Tracked</span>
                                        <span className="text-2xl font-black text-white mt-1 block font-mono">{studentExams.length}</span>
                                    </div>
                                    <div className="bg-black/30 border border-white/10 p-4 rounded-2xl text-center">
                                        <Award className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Spins Completed</span>
                                        <span className="text-2xl font-black text-white mt-1 block font-mono">
                                            {studentExams.filter(e => e.wheel_spun).length}
                                        </span>
                                    </div>
                                    <div className="bg-black/30 border border-white/10 p-4 rounded-2xl text-center">
                                        <TrendingUp className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Downloads Rate</span>
                                        <span className="text-2xl font-black text-white mt-1 block font-mono">
                                            {studentExams.length > 0 
                                                ? Math.round((studentExams.filter(e => e.reward_downloaded).length / studentExams.length) * 100)
                                                : 0}%
                                        </span>
                                    </div>
                                    <div className="bg-black/30 border border-white/10 p-4 rounded-2xl text-center">
                                        <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Top Recommended</span>
                                        <span className="text-xs font-black text-yellow-300 mt-2.5 block uppercase tracking-wide">
                                            {(() => {
                                                const forms = studentExams.map(e => e.recommended_form);
                                                if (forms.length === 0) return 'None';
                                                const counts = forms.reduce((acc: Record<string, number>, curr) => {
                                                    acc[curr] = (acc[curr] || 0) + 1;
                                                    return acc;
                                                }, {});
                                                return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
                                            })()}
                                        </span>
                                    </div>
                                </div>

                                <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/20">
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-left text-xs">
                                            <thead>
                                                <tr className="bg-white/5 border-b border-white/10 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                                                    <th className="p-4">Student ID / Name</th>
                                                    <th className="p-4">Intelligence Audit</th>
                                                    <th className="p-4">Deliverables & Claim</th>
                                                    <th className="p-4">Category & Mission 800</th>
                                                    <th className="p-4 text-right">Clear Audit</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 font-mono">
                                                {studentExams.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="p-8 text-center text-slate-500 italic font-sans">No intelligent wheel audit logs recorded yet</td>
                                                    </tr>
                                                ) : (
                                                    studentExams.map((exam) => {
                                                        // Categories
                                                        let cat = "Awareness Start / Reality Check";
                                                        if (exam.recommended_form === 'D6') cat = "Needs Rebuild / Starting Over";
                                                        else if (exam.recommended_form === 'D5') cat = "Denied Files / Collections Audit";
                                                        else if (exam.recommended_form === 'D4') cat = "High Utilization / Balance Control";
                                                        else if (exam.recommended_form === 'D3') cat = "Mission 800 Candidate / Score DNA";

                                                        // Mission 800 Status
                                                        const isEligible = exam.recommended_form === 'D3' || exam.recommended_form === 'D6';

                                                        // Reward Name
                                                        let rewardDelivered = "Credit Reality Check Sheet™";
                                                        if (exam.recommended_form === 'D3') rewardDelivered = "Score DNA Snapshot™";
                                                        else if (exam.recommended_form === 'D4') rewardDelivered = "Utilization Game Day Tracker™";
                                                        else if (exam.recommended_form === 'D5') rewardDelivered = "Denied Files Decoder™";
                                                        else if (exam.recommended_form === 'D6') rewardDelivered = "30-Day Credit U Reset Plan™";

                                                        return (
                                                            <tr key={exam.id} className="hover:bg-white/5 transition-colors font-sans">
                                                                <td className="p-4 font-bold">
                                                                    <div className="text-white text-xs">{exam.student_id}</div>
                                                                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">ID: {exam.id}</div>
                                                                </td>
                                                                <td className="p-4 text-[10px]">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-yellow-400 font-bold font-mono">Form {exam.recommended_form}</span>
                                                                        <span className="text-white font-light text-[9px] truncate max-w-[150px]">{rewardDelivered}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-[10px] space-y-1">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[9px] text-slate-400">Claimed:</span>
                                                                        <span className={`px-1 rounded text-[8px] font-bold ${exam.reward_claimed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                                                                            {exam.reward_claimed ? 'YES' : 'PENDING'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[9px] text-slate-400">Downloaded:</span>
                                                                        <span className={`px-1 rounded text-[8px] font-bold ${exam.reward_downloaded ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                                                                            {exam.reward_downloaded ? 'YES' : 'PENDING'}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-[10px] space-y-1">
                                                                    <div className="text-slate-300 font-bold">{cat}</div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[9px] text-slate-400">Mission 800:</span>
                                                                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${isEligible ? 'bg-emerald-500/25 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                                                                            {isEligible ? 'ELIGIBLE' : 'INACTIVE'}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-right">
                                                                    <button
                                                                        onClick={() => {
                                                                            const updated = studentExams.filter(e => e.id !== exam.id);
                                                                            localStorage.setItem('cu_student_exams', JSON.stringify(updated));
                                                                            setStudentExams(updated);
                                                                        }}
                                                                        className="p-2 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                                                        title="Delete Audit Log"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Lead Verification Instructions Box */}
                        <div className="bg-black/30 border border-white/10 rounded-2xl p-5 text-xs text-slate-400 leading-relaxed">
                            <span className="font-bold text-white uppercase tracking-wider text-[10px] block mb-1">Lead Verification Instructions</span>
                            To test different score categories:
                            <ul className="list-disc pl-4 space-y-1.5 mt-2 font-light">
                                <li>Click a lead's row inside the lookup table.</li>
                                <li>The engine will hot-load their answers into the active session.</li>
                                <li>It will open their evaluation report (`/results`), showcasing their circular score gauge, card recommendation, and dispute templates.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* TAB 2: CONVERSION FUNNELS & TRAFFIC */}
                {activeTab === 'funnels' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Visual Funnel */}
                        <div className="md:col-span-2 bg-black/20 border border-white/10 p-6 rounded-2xl space-y-6">
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-wider text-white">Enrollment Funnel Dropoff</h4>
                                <p className="text-xs text-slate-400 mt-1 font-light">Simulated applicant dropoffs from landing visits to final conversions.</p>
                            </div>

                            <div className="space-y-4">
                                {funnelStages.map((stage, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-300 font-mono">
                                            <span className="font-medium">{stage.name}</span>
                                            <span className="font-bold text-white">{stage.count} ({stage.percentage}%)</span>
                                        </div>
                                        <div className="w-full h-4 bg-white/5 rounded overflow-hidden">
                                            <div 
                                                className={`h-full ${stage.color} transition-all duration-700`}
                                                style={{ width: `${stage.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* UTM Traffic Source Table */}
                        <div className="bg-black/20 border border-white/10 p-6 rounded-2xl space-y-4">
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-wider text-white">Ad & UTM Traffic</h4>
                                <p className="text-xs text-slate-400 mt-1 font-light">Lead conversion tracking based on marketing channels.</p>
                            </div>

                            <div className="space-y-4">
                                {utmTraffic.map((traffic, idx) => (
                                    <div key={idx} className="border-b border-white/5 pb-3 last:border-b-0">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[11px] font-bold text-white leading-tight">{traffic.channel}</span>
                                            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-black">{traffic.conv} Conv</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                                            <span>Visits: {traffic.visits}</span>
                                            <span>Leads: {traffic.leads}</span>
                                            <span>Conversions: {traffic.sales}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: EMAIL CAMPAIGNS & SEQUENCE PREVIEWER */}
                {activeTab === 'emails' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-left">
                        {/* List of Email sequences */}
                        <div className="md:col-span-1 bg-black/20 border border-white/10 p-6 rounded-2xl space-y-4">
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-wider text-white">Drip Email Sequences</h4>
                                <p className="text-xs text-slate-400 mt-1 font-light">Automated triggers based on admissions stages.</p>
                            </div>

                            <div className="space-y-3">
                                {emailCampaigns.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedCampaign(c.id)}
                                        className={`w-full text-left p-4 border rounded-xl transition-all flex flex-col justify-between group ${selectedCampaign === c.id ? 'bg-yellow-400/10 border-yellow-500' : 'bg-black/30 border-white/5 hover:bg-white/5'}`}
                                    >
                                        <div className="flex justify-between items-start w-full">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-yellow-300 font-mono">Trigger: {c.trigger}</span>
                                            <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">{c.steps} Emails</span>
                                        </div>
                                        <h5 className="font-bold text-white text-xs mt-2 group-hover:text-yellow-400 transition-colors leading-tight uppercase italic">{c.name}</h5>
                                        
                                        <div className="grid grid-cols-3 gap-2 w-full mt-4 text-[9px] text-slate-400 font-mono border-t border-white/5 pt-2">
                                            <div>
                                                <span className="block opacity-60">SENT</span>
                                                <span className="font-bold text-white">{c.delivered}</span>
                                            </div>
                                            <div>
                                                <span className="block opacity-60">OPEN RATE</span>
                                                <span className="font-bold text-white">{c.openRate}</span>
                                            </div>
                                            <div>
                                                <span className="block opacity-60">CTR</span>
                                                <span className="font-bold text-white">{c.ctr}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Email Campaign template preview drawer */}
                        <div className="md:col-span-2 bg-black/20 border border-white/10 p-6 rounded-2xl min-h-[400px]">
                            {currentCampaign ? (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400 font-mono">Sequence Previewer</span>
                                            <h4 className="font-black italic uppercase text-white text-lg mt-0.5">{currentCampaign.name}</h4>
                                        </div>
                                        <button 
                                            onClick={() => alert(`Test emails triggered for sequence: ${currentCampaign.name}!`)}
                                            className="inline-flex items-center gap-1 bg-yellow-400 hover:bg-yellow-350 text-blue-900 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            Trigger Test
                                        </button>
                                    </div>

                                    {/* List of emails */}
                                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                                        {currentCampaign.emails.map((email, idx) => (
                                            <div key={idx} className="bg-black/40 border border-white/10 p-5 rounded-xl space-y-3 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2 bg-white/5 font-mono text-[8px] text-slate-400 rounded-bl">
                                                    Delay: {email.delay}
                                                </div>
                                                <div>
                                                    <span className="text-[9px] font-bold text-yellow-400 font-mono uppercase">Email #{email.step}</span>
                                                    <h5 className="font-bold text-white text-xs mt-1">Subject: {email.subject}</h5>
                                                </div>
                                                <div className="w-full bg-black/60 p-3 rounded-lg border border-white/5 font-mono text-[10px] text-slate-300 leading-relaxed">
                                                    {email.body}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[350px] flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                                    <Eye className="w-12 h-12 text-white/10 animate-bounce" />
                                    <h4 className="font-bold text-sm uppercase text-white">Select a Sequence</h4>
                                    <p className="text-xs max-w-xs font-light leading-relaxed">
                                        Click on any of the active drip sequences on the left to preview their automated email templates.
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                )}

                {/* TAB 4: ASSESSMENT BUILDER */}
                {activeTab === 'assessment' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left">
                        {/* List of Questions */}
                        <div className="lg:col-span-1 bg-black/20 border border-white/10 p-6 rounded-2xl space-y-4">
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-wider text-white">Current Exam Questions</h4>
                                <p className="text-xs text-slate-400 mt-1 font-light">Questions currently active in the Free Credit U Assessment™.</p>
                            </div>

                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                                {questions.map((q: any, idx: number) => (
                                    <div key={q.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <span className="text-[9px] font-bold text-yellow-400 font-mono">Q{idx + 1} ({q.id})</span>
                                            <h5 className="text-xs font-bold text-white mt-1 leading-relaxed">{q.label || q.title}</h5>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono">{q.type} • {q.required ? 'Required' : 'Optional'}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteQuestion(q.id)}
                                            className="text-red-400 hover:text-red-300 p-1 transition-colors self-start"
                                            title="Delete Question"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleResetQuestions}
                                className="w-full py-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-300 font-bold text-xs uppercase rounded-xl transition-all"
                            >
                                Reset to Defaults
                            </button>
                        </div>

                        {/* Add New Question Form */}
                        <div className="lg:col-span-2 bg-black/20 border border-white/10 p-6 rounded-2xl space-y-6">
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-wider text-white font-mono">Add New Question to Assessment</h4>
                                <p className="text-xs text-slate-400 mt-1 font-light">Custom questions will immediately load inside the applicant's Free Assessment screen.</p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Question ID (Unique key)</label>
                                    <input 
                                        type="text" 
                                        value={newQuestionId}
                                        onChange={e => setNewQuestionId(e.target.value.replace(/\s+/g, ''))}
                                        placeholder="e.g. monthlyRent" 
                                        className="w-full px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white placeholder-white/25 focus:outline-none focus:border-yellow-400 text-xs font-mono"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Question Type</label>
                                    <select
                                        value={newQuestionType}
                                        onChange={e => setNewQuestionType(e.target.value as 'select' | 'multi')}
                                        className="w-full px-4 py-3 border border-white/20 rounded-xl bg-[#001740] text-white focus:outline-none focus:border-yellow-400 text-xs font-bold"
                                    >
                                        <option value="select">Single Choice (Select)</option>
                                        <option value="multi">Multiple Choice (Checkboxes)</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Question Label (The text students see)</label>
                                    <input 
                                        type="text" 
                                        value={newQuestionLabel}
                                        onChange={e => setNewQuestionLabel(e.target.value)}
                                        placeholder="e.g. What is your current monthly rent payment?" 
                                        className="w-full px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white placeholder-white/25 focus:outline-none focus:border-yellow-400 text-xs"
                                    />
                                </div>

                                <div className="md:col-span-2 flex items-center gap-2 py-1">
                                    <input
                                        type="checkbox"
                                        id="required-q"
                                        checked={newQuestionRequired}
                                        onChange={e => setNewQuestionRequired(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/25 bg-black/40 text-yellow-400 focus:ring-yellow-400"
                                    />
                                    <label htmlFor="required-q" className="text-[10px] font-bold uppercase tracking-wider text-blue-200 select-none cursor-pointer">
                                        Require students to answer this question
                                    </label>
                                </div>
                            </div>

                            {/* Question Options */}
                            <div className="space-y-4 border-t border-white/10 pt-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">Question Options</label>
                                    <button 
                                        onClick={handleAddOption}
                                        className="text-xs font-black text-yellow-400 hover:underline uppercase"
                                    >
                                        + Add Option
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {newQuestionOptions.map((opt, optIdx) => (
                                        <div key={optIdx} className="grid gap-2 grid-cols-[1.5fr_1.5fr_1fr_40px] items-center">
                                            <input 
                                                type="text" 
                                                value={opt.label}
                                                onChange={e => handleUpdateOption(optIdx, 'label', e.target.value)}
                                                placeholder="Option Label (e.g. Under $1,000)" 
                                                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-black/40 text-white text-xs"
                                            />
                                            <input 
                                                type="text" 
                                                value={opt.value}
                                                onChange={e => handleUpdateOption(optIdx, 'value', e.target.value)}
                                                placeholder="Option Value (e.g. low)" 
                                                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-black/40 text-white text-xs font-mono"
                                            />
                                            <input 
                                                type="number" 
                                                value={opt.readinessPoints || ''}
                                                onChange={e => handleUpdateOption(optIdx, 'readinessPoints', Number(e.target.value))}
                                                placeholder="GPA weight" 
                                                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-black/40 text-white text-xs text-center font-mono"
                                            />
                                            <button 
                                                onClick={() => handleRemoveOption(optIdx)}
                                                className="text-red-400 hover:text-red-300 p-2 text-center"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 mx-auto" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={handleSaveQuestion}
                                className="w-full py-4 bg-yellow-400 hover:bg-yellow-350 text-blue-900 font-black text-xs uppercase rounded-xl tracking-widest shadow-lg transition-transform active:scale-95"
                            >
                                Save Question & Continue Building Assessment
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
