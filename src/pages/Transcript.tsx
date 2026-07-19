import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, Upload, AlertCircle, FileSearch, ArrowRight, ArrowLeft, 
    CheckCircle, ShieldAlert, Award, BookOpen, Star, Sparkles, DollarSign 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import FloatingMotes from '../components/FloatingMotes';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'danger';
    className?: string;
    children: React.ReactNode;
}

const CustomButton: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
    const baseStyle = "inline-flex items-center justify-center rounded-xl font-black transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95 text-xs uppercase tracking-wider py-3 px-6";
    
    let variantStyle = "bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-md shadow-yellow-950/20";
    if (variant === 'outline') {
        variantStyle = "border-2 border-white/20 hover:bg-white/10 text-white";
    } else if (variant === 'ghost') {
        variantStyle = "text-white hover:bg-white/10";
    }
    
    return (
        <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default function Transcript() {
    const navigate = useNavigate();
    
    // Scan States
    const [fileUploaded, setFileUploaded] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanStatusText, setScanStatusText] = useState('Ready for audit');
    const [auditComplete, setAuditComplete] = useState(false);
    const [fileName, setFileName] = useState('');

    // Payment Simulator State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState({ name: '', price: '' });
    const [isEnrolled, setIsEnrolled] = useState(false);

    const startScan = (file: string) => {
        setFileName(file);
        setFileUploaded(true);
        setIsScanning(true);
        setScanProgress(0);

        const statusUpdates = [
            { limit: 20, text: 'Opening file stream...' },
            { limit: 45, text: 'Scanning credit report sections...' },
            { limit: 70, text: 'Extracting dispute indicators...' },
            { limit: 90, text: 'Identifying factual violation markers...' },
            { limit: 100, text: 'Compiling audit report summary...' }
        ];

        const interval = setInterval(() => {
            setScanProgress(prev => {
                const next = prev + 5;
                
                const match = statusUpdates.find(u => next <= u.limit);
                if (match) {
                    setScanStatusText(match.text);
                }

                if (next >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    setAuditComplete(true);
                    
                    // Tag the current submission as "Transcript Uploaded"
                    const currentSub = JSON.parse(localStorage.getItem('cu_current_submission') || '{}');
                    if (currentSub.id) {
                        currentSub.statusTags = [...new Set([...currentSub.statusTags, 'Transcript Uploaded'])];
                        localStorage.setItem('cu_current_submission', JSON.stringify(currentSub));
                        
                        // Update database
                        const db = JSON.parse(localStorage.getItem('cu_funnel_standalone_db') || '[]');
                        const updatedDb = db.map((sub: any) => sub.id === currentSub.id ? currentSub : sub);
                        localStorage.setItem('cu_funnel_standalone_db', JSON.stringify(updatedDb));
                    }
                }
                return next;
            });
        }, 120);
    };

    const triggerCheckout = (packageName: string, price: string) => {
        setSelectedPackage({ name: packageName, price });
        setShowPaymentModal(true);
    };

    const confirmPayment = () => {
        setShowPaymentModal(false);
        setIsEnrolled(true);
        
        // Tag current submission as "Review Purchased"
        const currentSub = JSON.parse(localStorage.getItem('cu_current_submission') || '{}');
        if (currentSub.id) {
            currentSub.statusTags = [...new Set([...currentSub.statusTags, 'Transcript Purchased', selectedPackage.name])];
            localStorage.setItem('cu_current_submission', JSON.stringify(currentSub));
            
            // Update database
            const db = JSON.parse(localStorage.getItem('cu_funnel_standalone_db') || '[]');
            const updatedDb = db.map((sub: any) => sub.id === currentSub.id ? currentSub : sub);
            localStorage.setItem('cu_funnel_standalone_db', JSON.stringify(updatedDb));
        }

        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.4 },
            colors: ['#0033A0', '#FDB515', '#ffffff']
        });

        // Navigate to next step: Dorm Week orientation
        navigate('/dormweek');
    };

    const deansOfficeItems = [
        "Payment History", "Utilization Analysis", "Account Structure", 
        "Collection Review", "Inquiry Review", "Approval Readiness™", 
        "Financial Strength Indicators", "Mission 800™ Alignment", 
        "Credit U GPA™", "Personalized Recommendations", "Strategic Next Steps"
    ];

    const gpaDeliverables = [
        "Credit U Transcript™", "Credit U GPA™", "Mission 800™ Score™", 
        "Approval Readiness Rating™", "Personalized Action Plan™", 
        "Dean Recommendations™", "Financial Growth Opportunities™"
    ];

    const extensiveReviewItems = [
        "Extended Credit Analysis", "Mission 800™ Evaluation", "Personalized Dean Recommendations", 
        "Financial Strategy Review", "Next Step Roadmap™", "Approval Readiness Assessment™", 
        "Credit U GPA™", "Official Dean Review", "Credit U Dean Approval Stamp™"
    ];

    return (
        <div className="relative flex-1 bg-[#001A4D] text-white min-h-screen py-12 overflow-hidden">
            {/* Background Motes particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <FloatingMotes />
            </div>

            {/* Stadium Lights / Glowing Radials */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

            <style>{`
                @keyframes pulse-glow {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 10px rgba(250, 204, 21, 0.4);
                    }
                    50% {
                        transform: scale(1.03);
                        box-shadow: 0 0 25px rgba(250, 204, 21, 0.85);
                    }
                }
                .glow-pulse-btn {
                    animation: pulse-glow 2s infinite ease-in-out;
                }
            `}</style>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
                
                {/* 1. HERO HEADER */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/35 px-4 py-1.5 rounded-full shadow-lg">
                        <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-yellow-300 font-mono">
                            Pre-Registration Period Open
                        </span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase text-white leading-none">
                        🎓 Credit U <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">Transcript™</span>
                    </h1>
                    
                    <p className="text-sm sm:text-lg text-yellow-300 font-bold uppercase tracking-wider font-mono">
                        Pull Your Credit U Transcript™ Before Classes Begin
                    </p>

                    <div className="w-full max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent my-2" />

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto font-light">
                        Before Credit U officially opens, students have the opportunity to request their Credit U Transcript™ during the Dorm Week Rush™ pre-registration experience. Think of it as your <strong className="text-white">financial report card before classes begin.</strong>
                    </p>
                </div>

                {/* 2. UPLOAD & SCAN AUDIT BOX */}
                <div className="max-w-2xl w-full mx-auto bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl text-center">
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-yellow-400 block font-mono">
                            Transcript Submission Portal ///
                        </span>
                        <p className="text-[11px] text-blue-200 mt-1 mb-4 max-w-md mx-auto leading-relaxed">
                            Drag and drop your credit report (PDF or Image) to run our simulated AI audit scan. We will analyze late payments, collections, and credit limits.
                        </p>
                        <div className="mb-6">
                            <a 
                                href="https://app.myfreescorenow.com/enroll/B02B3904" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-350 text-blue-955 font-black text-xs uppercase rounded-full tracking-wider shadow-2xl transition-all glow-pulse-btn"
                            >
                                📥 Pull Credit Report First (MyFreeScoreNow)
                            </a>
                        </div>
                    </div>

                    {/* Upload Section / Progress */}
                    {!fileUploaded && (
                        <div 
                            onClick={() => startScan('credit_report_july2026.pdf')}
                            className="border-2 border-dashed border-white/20 hover:border-yellow-400/50 bg-black/20 p-10 rounded-2xl cursor-pointer transition-colors group flex flex-col items-center select-none"
                        >
                            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                <Upload className="w-6 h-6 text-blue-300" />
                            </div>
                            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-2">Click or Drag File to Upload</h4>
                            <p className="text-[9px] text-slate-400 font-mono">Supports PDF, PNG, JPG (Max 10MB)</p>
                        </div>
                    )}

                    {isScanning && (
                        <div className="bg-black/20 p-8 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-xs font-mono">
                                <span className="text-yellow-300 font-bold uppercase">{scanStatusText}</span>
                                <span>{scanProgress}%</span>
                            </div>
                            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-150"
                                    style={{ width: `${scanProgress}%` }}
                                />
                            </div>
                            <p className="text-[9px] text-slate-400 animate-pulse italic">Scanning documents... Please do not close this window.</p>
                        </div>
                    )}

                    {auditComplete && (
                        <div className="space-y-6">
                            {/* Audit findings box */}
                            <div className="bg-black/40 border border-yellow-400/30 p-6 rounded-2xl text-left space-y-4 shadow-inner">
                                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                    <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400">File Analyzed:</span>
                                    <span className="text-xs font-bold text-white font-mono">{fileName}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <span className="text-xl font-black text-red-400">8</span>
                                        <span className="text-[8px] uppercase font-bold text-slate-400 block mt-1">Violations</span>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <span className="text-xl font-black text-orange-400">3</span>
                                        <span className="text-[8px] uppercase font-bold text-slate-400 block mt-1">Collections</span>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <span className="text-xl font-black text-emerald-400">2</span>
                                        <span className="text-[8px] uppercase font-bold text-slate-400 block mt-1">Inquiries</span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-350 font-light leading-relaxed">
                                    <AlertCircle className="w-4 h-4 text-yellow-400 inline mr-1" />
                                    <strong>Factual Violations Flagged</strong>: The credit report contains inaccuracies inside your payment history and collection records. You qualify for an accelerated factual dispute package below.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. TRANSCRIPT DETAILS & PROCESS (DEAN'S OFFICE) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* DEAN'S OFFICE COLUMN */}
                    <div className="bg-[#002270]/25 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl space-y-5 text-left">
                        <div className="flex items-center gap-2.5">
                            <BookOpen className="w-5 h-5 text-yellow-400" />
                            <h3 className="text-lg font-black uppercase italic text-white tracking-wide">
                                📚 Credit U Dean's Office™
                            </h3>
                        </div>
                        <p className="text-xs text-slate-350 font-light leading-relaxed">
                            Once submitted, your transcript enters the Credit U Dean's Office™ where our team evaluates:
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                            {deansOfficeItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-bold bg-black/20 p-2.5 rounded-xl border border-white/5">
                                    <CheckCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CREDIT U GPA™ DELIVERABLES */}
                    <div className="bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl space-y-5 text-left">
                        <div className="flex items-center gap-2.5">
                            <Award className="w-5 h-5 text-yellow-400" />
                            <h3 className="text-lg font-black uppercase italic text-white tracking-wide">
                                🏆 Credit U GPA™ Rating
                            </h3>
                        </div>
                        <p className="text-xs text-slate-350 font-light leading-relaxed">
                            Your Credit U GPA™ reflects your current financial standing. Requests unlock:
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                            {gpaDeliverables.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-bold bg-black/20 p-2.5 rounded-xl border border-white/5">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. EXTENSIVE REVIEW WITH DEAN ASHLEY */}
                <div className="bg-gradient-to-r from-blue-900/30 to-black/40 border border-yellow-400/30 rounded-3xl p-8 max-w-4xl mx-auto space-y-5 text-left shadow-xl">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-xl font-black uppercase italic text-white tracking-wide">
                            👩🏽🏫 Dean Ashley J. Extensive Transcript Review™
                        </h3>
                    </div>
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                        For students seeking a more comprehensive review experience, submit a request for an official Credit U Dean Ashley J. Extensive Transcript Review™. Includes:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-[10px] text-slate-300 font-bold">
                        {extensiveReviewItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-black/25 p-2 rounded-lg border border-white/5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. PRICING OPTIONS (SINGLE & DOUBLE) */}
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="text-center space-y-1">
                        <h3 className="text-2xl font-black uppercase italic text-white tracking-wide">
                            💙 Credit U Transcript Options
                        </h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                            Pre-registration packages for single students or partners
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
                        {/* Single Review Card */}
                        <div className="bg-[#0033A0]/30 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl">
                            <div className="relative w-full">
                                <img 
                                    src="/single-transcript-review.jpg" 
                                    alt="Single Review" 
                                    className="w-full h-auto object-contain"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-[#0033A0]/10 to-transparent pointer-events-none" />
                                <span className="absolute top-2.5 right-2.5 p-1.5 bg-yellow-400 text-blue-950 font-black uppercase text-[8px] rounded shadow z-10">
                                    Single
                                </span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <h4 className="font-bold text-xs text-white uppercase">Single Transcript Review™</h4>
                                    <ul className="text-[9px] text-slate-355 font-light space-y-1 mt-2">
                                        <li>• One student, one credit report</li>
                                        <li>• FICO Score overview & audit</li>
                                        <li>• Credit U GPA™ calculation</li>
                                        <li>• Personalized Review notes</li>
                                        <li>• Dean Assessment™ documentation</li>
                                    </ul>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                    <span className="text-xl font-black text-white font-mono">$49</span>
                                    <CustomButton 
                                        onClick={() => triggerCheckout('Single Transcript Review™', '$49')}
                                        className="h-8 py-0 px-3 uppercase text-[9px]"
                                    >
                                        Buy Review
                                    </CustomButton>
                                </div>
                            </div>
                        </div>

                        {/* Double Review Card */}
                        <div className="bg-[#0033A0]/20 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl">
                            <div className="relative w-full">
                                <img 
                                    src="/double-transcript-review.jpg" 
                                    alt="Double Review" 
                                    className="w-full h-auto object-contain"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-indigo-950/10 to-transparent pointer-events-none" />
                                <span className="absolute top-2.5 right-2.5 p-1.5 bg-yellow-400 text-blue-950 font-black uppercase text-[8px] rounded shadow z-10">
                                    Double
                                </span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <h4 className="font-bold text-xs text-white uppercase">Double Transcript Review™</h4>
                                    <ul className="text-[9px] text-slate-355 font-light space-y-1 mt-2">
                                        <li>• Two students (couples, friends, partners)</li>
                                        <li>• Two credit report audits</li>
                                        <li>• Two Credit U GPAs™ calculated</li>
                                        <li>• Shared Financial Planning™ session</li>
                                        <li>• Double Dean Assessments™</li>
                                    </ul>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                    <span className="text-xl font-black text-white font-mono">$69</span>
                                    <CustomButton 
                                        onClick={() => triggerCheckout('Double Transcript Review™', '$69')}
                                        className="h-8 py-0 px-3 uppercase text-[9px]"
                                    >
                                        Buy Double
                                    </CustomButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. CALLOUT BOX SECTION */}
                <div className="max-w-2xl mx-auto bg-gradient-to-b from-[#0033A0]/30 to-black/60 border-2 border-yellow-400 p-8 rounded-3xl shadow-2xl text-center space-y-6">
                    <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-400 font-mono block animate-pulse">
                            Academic Callout Box ///
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase text-white leading-none">
                            Pull Your Credit U Transcript™ Today
                        </h2>
                        <p className="text-xs text-slate-300 leading-relaxed font-light max-w-md mx-auto">
                            During our exclusive pre-registration period, students can request their Credit U Transcript™ before Credit U officially opens. Your transcript is reviewed by the Credit U Dean's Office™ and provides insight into your current financial standing, strengths, opportunities, and your Credit U GPA™.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto font-mono">
                        <div className="bg-black/40 border border-white/10 p-3 rounded-xl">
                            <span className="text-[10px] text-slate-400 uppercase font-black block">Single Review™</span>
                            <span className="text-xl font-black text-yellow-400">$49</span>
                        </div>
                        <div className="bg-black/40 border border-white/10 p-3 rounded-xl">
                            <span className="text-[10px] text-slate-400 uppercase font-black block">Double Review™</span>
                            <span className="text-xl font-black text-yellow-400">$69</span>
                        </div>
                    </div>

                    {/* Interactive Callout Action Buttons */}
                    <div className="flex justify-center max-w-sm mx-auto pt-2">
                        <button
                            type="button"
                            onClick={() => window.open('https://app.myfreescorenow.com/enroll/B02B3904', '_blank')}
                            className="w-full py-4 px-6 bg-yellow-400 hover:bg-yellow-350 text-blue-955 font-black text-xs uppercase rounded-full tracking-wider shadow-2xl transition-all glow-pulse-btn"
                        >
                            📊 Request My Transcript™
                        </button>
                    </div>
                </div>

                {/* Footer nav options & Slogan */}
                <div className="space-y-6 pt-6 border-t border-white/10">
                    <div className="text-center space-y-1.5">
                        <h4 className="text-base font-black text-white font-mono tracking-widest uppercase">
                            Credit U™
                        </h4>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest">
                            The Financial University™
                        </p>
                        <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider italic">
                            "Know Your Credit. Know Your Position. Know Your Next Move."
                        </p>
                        <p className="text-[9px] text-blue-300 font-bold uppercase tracking-wider font-mono">
                            It Starts With U™ 💙💛🎓
                        </p>
                    </div>

                    <div className="flex justify-between items-center max-w-2xl mx-auto">
                        <button 
                            onClick={() => navigate('/results')}
                            className="inline-flex items-center justify-center gap-1 rounded-xl font-bold transition-all text-white hover:bg-white/10 text-xs uppercase py-2.5 px-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Results
                        </button>

                        <button 
                            onClick={() => navigate('/dormweek')}
                            className="inline-flex items-center justify-center gap-1 rounded-xl font-bold transition-all text-yellow-400 hover:text-yellow-300 text-xs uppercase py-2.5 px-4"
                        >
                            Skip to Dorm Week
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>

            {/* STRIPE SIMULATOR PAYMENT CHECKOUT MODAL */}
            <AnimatePresence>
                {showPaymentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Overlay Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        
                        {/* Modal Body */}
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#001D4A] border-4 border-yellow-400 p-8 rounded-3xl max-w-md w-full relative z-10 text-center space-y-6 shadow-2xl"
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest text-yellow-400 font-mono block">Stripe Payment Simulator ///</span>
                            
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black uppercase italic text-white">Credit U™ Checkout</h3>
                                <p className="text-xs text-slate-400">Complete your transcript review registration</p>
                            </div>

                            <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-left space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Selected Option:</span>
                                    <span className="font-bold text-white uppercase">{selectedPackage.name}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Total Price:</span>
                                    <span className="font-bold text-yellow-400 font-mono">{selectedPackage.price}</span>
                                </div>
                            </div>

                            <div className="bg-yellow-400/10 border border-yellow-400/30 p-3.5 rounded-xl text-left space-y-1.5">
                                <span className="text-[9px] font-black uppercase text-yellow-300 block">Credit Report Required:</span>
                                <p className="text-[10px] text-slate-300 leading-relaxed font-light">
                                    Before we begin your transcript audit, you are required to pull your credit report using the official enrollment link below:
                                </p>
                                <a 
                                    href="https://app.myfreescorenow.com/enroll/B02B3904" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-yellow-400 hover:underline block"
                                >
                                    📥 Click here to pull your report first
                                </a>
                            </div>

                            <div className="space-y-3 text-left">
                                <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Simulated Card Details</label>
                                <div className="bg-black/40 border border-white/10 p-3 rounded-lg text-xs font-mono text-slate-355">
                                    💳 4242 •••• •••• 4242 (Simulator Card)
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={confirmPayment}
                                    className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-all"
                                >
                                    PAY {selectedPackage.price} NOW
                                </button>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase rounded-xl border border-white/10"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
