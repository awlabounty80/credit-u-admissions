import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ShieldCheck, HelpCircle } from 'lucide-react';
import { RECOMMENDED_CARDS, MOCK_PROFILES, MockProfile } from '../data/admissionsData';

interface ExamData {
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

const INITIAL_DATA: ExamData = {
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

export default function Apply() {
    const navigate = useNavigate();
    const [formStep, setFormStep] = useState(1);
    const [formData, setFormData] = useState<ExamData>(INITIAL_DATA);

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
            navigate('/');
        }
    };

    const calculateResults = (data: ExamData) => {
        let score = 600;

        // 1. Estimated credit score range adjustment
        if (data.estimatedScoreRange === 'excellent') score = 760;
        else if (data.estimatedScoreRange === 'good') score = 690;
        else if (data.estimatedScoreRange === 'fair') score = 600;
        else score = 480;

        // 2. DTI (Debt to Income) ratio adjustment
        const monthlyDebtPayment = data.totalDebt * 0.05;
        const dti = data.monthlyIncome > 0 ? (monthlyDebtPayment / data.monthlyIncome) : 0;
        
        if (dti > 0.40) score -= 40;
        else if (dti < 0.20) score += 30;

        // 3. Collections & Late payments penalty
        if (data.hasCollections === 'yes') score -= 70;
        if (data.hasLatePayments === 'yes') score -= 40;

        // 4. Savings bonus
        if (data.savingsBalance > 8000) score += 30;
        else if (data.savingsBalance > 2000) score += 15;

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

    const handleSubmit = () => {
        const results = calculateResults(formData);
        
        // Prepare submission object
        const submission = {
            id: 'sub_' + Date.now(),
            timestamp: new Date().toISOString(),
            formData,
            statusTags: ['Applicant'], // Tagged as applicant initially
            ...results
        };

        // Save current submission for Results view
        localStorage.setItem('cu_current_submission', JSON.stringify(submission));

        // Append to admissions database
        const db = JSON.parse(localStorage.getItem('cu_funnel_standalone_db') || '[]');
        localStorage.setItem('cu_funnel_standalone_db', JSON.stringify([submission, ...db]));

        // Redirect to results
        navigate('/results');
    };

    return (
        <div className="relative flex-1 flex items-center justify-center py-12 px-4 md:px-6">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="w-full max-w-2xl bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col relative z-10">
                {/* Step Progress */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs uppercase font-mono tracking-widest text-yellow-300 font-bold">Step {formStep} of 4</span>
                        <span className="text-xs text-blue-200 uppercase font-bold">
                            {formStep === 1 && "Identity & Contact"}
                            {formStep === 2 && "Financial Position"}
                            {formStep === 3 && "Credit Obstacles"}
                            {formStep === 4 && "Accountability Style"}
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
                                        <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Monthly Income ($)</label>
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

                        {/* STEP 3: CREDIT HISTORY */}
                        {formStep === 3 && (
                            <motion.div
                                key="step-3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mb-4">Credit Obstacles</h3>

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
                    <button 
                        onClick={prevStep}
                        className="inline-flex items-center justify-center gap-1 rounded-xl font-bold transition-all text-white hover:bg-white/10 text-xs uppercase py-2.5 px-4"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>

                    <button 
                        onClick={nextStep}
                        className="inline-flex items-center justify-center gap-1 rounded-xl font-bold transition-all bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-md shadow-yellow-950/20 text-xs uppercase py-2.5 px-6 disabled:opacity-50 disabled:pointer-events-none"
                        disabled={formStep === 1 && (!formData.fullName || !formData.email)}
                    >
                        {formStep === 4 ? "Apply to Credit U™" : "Next Step"}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
