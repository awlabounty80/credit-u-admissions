import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, GraduationCap, CreditCard, ChevronRight, RefreshCw, Compass, FileSearch } from 'lucide-react';
import { RECOMMENDED_CARDS, CreditCard as CardType } from '../data/admissionsData';
import confetti from 'canvas-confetti';

export default function Results() {
    const navigate = useNavigate();
    const [submission, setSubmission] = useState<any>(null);
    const [accepted, setAccepted] = useState(() => {
        return localStorage.getItem('cu_admission_accepted') === 'true';
    });
    const [isOpening, setIsOpening] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('cu_current_submission');
        if (stored) {
            setSubmission(JSON.parse(stored));
        } else {
            // Re-route to apply if no current submission is found
            navigate('/apply');
        }
    }, [navigate]);

    const playSound = (frequency: number, duration: number) => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch(e) {}
    };

    const handleAccept = () => {
        if (isOpening) return;
        setIsOpening(true);
        
        playSound(880, 0.25);
        // Trigger confetti
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });

        setTimeout(() => {
            setAccepted(true);
            localStorage.setItem('cu_admission_accepted', 'true');
            
            // Tag the current submission as "Admission Accepted"
            const stored = localStorage.getItem('cu_current_submission');
            if (stored) {
                const parsed = JSON.parse(stored);
                parsed.statusTags = [...new Set([...parsed.statusTags, 'Admission Accepted'])];
                localStorage.setItem('cu_current_submission', JSON.stringify(parsed));
                
                const db = JSON.parse(localStorage.getItem('cu_funnel_standalone_db') || '[]');
                const updatedDb = db.map((sub: any) => sub.id === parsed.id ? parsed : sub);
                localStorage.setItem('cu_funnel_standalone_db', JSON.stringify(updatedDb));
            }
        }, 1500);
    };

    if (!submission) return null;

    const score = submission.score || 600;
    const dorm = submission.dorm || 'Homeownership Hall';
    const gpa = submission.gpa || '3.0';
    const recommendedCard = submission.recommendedCard || RECOMMENDED_CARDS[0] || {};
    const formData = submission.formData || { fullName: 'Student' };

    const cardBg = recommendedCard.imageBg || 'bg-gradient-to-br from-blue-900 to-indigo-950';
    const cardName = recommendedCard.name || 'Freshman Secured Card';
    const cardRange = recommendedCard.scoreRange || '580-669';
    const cardBenefits = recommendedCard.benefits || ['Build credit history', 'Low deposit'];

    const handleShare = () => {
        const text = `I just got accepted into Credit U™! 🎓 My calculated credit score is ${score} and my Financial GPA is ${gpa}. Check if you're accepted: ${window.location.origin}`;
        try {
            navigator.clipboard.writeText(text);
            setCopiedShare(true);
            setTimeout(() => setCopiedShare(false), 2000);
        } catch(e) {}
    };

    if (!accepted) {
        return (
            <div className="relative flex-1 flex flex-col items-center justify-center py-16 px-4 md:px-6">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                
                {/* Immersive Gold Envelope */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-[#002270] border border-yellow-400/40 rounded-3xl shadow-2xl p-8 text-center space-y-6 relative overflow-hidden z-10"
                >
                    {/* Golden envelope seal overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(253,181,21,0.08)_0%,transparent_70%)] pointer-events-none" />

                    {/* Outer Envelope Wrapper */}
                    <motion.div 
                        animate={isOpening ? { rotateX: -180, scale: 0.95 } : { rotateX: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="w-full aspect-[1.618/1] bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl shadow-inner relative flex items-center justify-center border border-yellow-300/30"
                        style={{ perspective: 1000 }}
                    >
                        {/* Letter Content sliding out when opening */}
                        <motion.div 
                            initial={{ y: 0, opacity: 0 }}
                            animate={isOpening ? { y: -60, opacity: 1, scale: 1.05 } : { y: 0, opacity: 0 }}
                            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                            className="absolute bg-white text-blue-950 p-5 rounded-xl shadow-2xl border border-yellow-400/30 text-left space-y-2 w-[85%] z-20"
                        >
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <span className="text-[8px] font-black uppercase tracking-wider text-yellow-600">Credit University AI</span>
                                <span className="text-xs">🎓</span>
                            </div>
                            <h4 className="text-sm font-black italic uppercase text-blue-900 leading-tight">OFFICIAL ACCEPTANCE</h4>
                            <p className="text-[10px] text-slate-600 font-light leading-relaxed">
                                Congratulations, **{formData?.fullName || "Student"}**! You are officially accepted into **Credit U™** for the Summer Semester. Report to Dorm Week.
                            </p>
                        </motion.div>

                        {/* Wax Seal Pin */}
                        <motion.div 
                            animate={isOpening ? { scale: 0, opacity: 0 } : { scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="absolute z-30 w-16 h-16 bg-[#002270] rounded-full border-4 border-yellow-400 flex items-center justify-center shadow-lg shadow-black/30 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                            onClick={handleAccept}
                        >
                            <span className="text-xl">🎓</span>
                        </motion.div>
                    </motion.div>

                    <div className="space-y-2 relative z-20">
                        <h3 className="text-2xl font-black italic uppercase text-white tracking-tight">You’ve Been Accepted!</h3>
                        <p className="text-xs text-blue-200 leading-relaxed max-w-sm mx-auto">
                            Your Credit U Admission package is ready. Accept your letter to unlock your Freshman status and calculate your Score.
                        </p>
                    </div>

                    <button 
                        onClick={handleAccept}
                        disabled={isOpening}
                        className="w-full py-4 rounded-xl font-black uppercase tracking-widest bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-xl shadow-yellow-950/20 text-xs transition-all relative z-20"
                    >
                        {isOpening ? "Opening Admission Kit..." : "ACCEPT ADMISSION"}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative flex-1 flex flex-col items-center justify-start py-12 px-4 md:px-6">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8 items-stretch relative z-10">
                
                {/* Left Side: Score & Core Metrics */}
                <div className="flex-1 bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-between text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="w-full">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">
                            Exam Evaluation Report ///
                        </span>
                        <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter mt-1 mb-6">
                            Your Evaluation Results
                        </h3>
                    </div>

                    {/* Circular Score Gauge */}
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
                                stroke={score >= 740 ? '#f59e0b' : score >= 670 ? '#10b981' : score >= 580 ? '#fb923c' : '#ef4444'} 
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - (score - 300) / 550) }}
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
                                {score}
                            </motion.span>
                            <span className="text-xs uppercase font-mono tracking-widest text-slate-300 font-bold mt-1">Calculated Score</span>
                            <span className={`text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider mt-2 border ${
                                score >= 740 ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 
                                score >= 670 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 
                                score >= 580 ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' : 
                                'bg-red-500/20 text-red-300 border-red-500/50'
                            }`}>
                                {score >= 740 ? 'Excellent' : score >= 670 ? 'Good' : score >= 580 ? 'Fair' : 'Poor'}
                            </span>
                        </div>
                    </div>

                    {/* GPA & Dorm Info */}
                    <div className="grid grid-cols-2 gap-4 w-full border-t border-white/10 pt-6 mt-4">
                        <div className="bg-black/20 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                            <Award className="w-5 h-5 text-yellow-400 mb-1" />
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Financial GPA</span>
                            <span className="text-2xl font-black italic text-white mt-1">{gpa}</span>
                        </div>
                        <div className="bg-black/20 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                            <GraduationCap className="w-5 h-5 text-yellow-400 mb-1" />
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Assigned Dorm</span>
                            <span className="text-sm font-black italic text-white uppercase mt-2 tracking-wide truncate w-full">{dorm}</span>
                        </div>
                    </div>
                    
                    {/* Campus Welcome Briefing Video */}
                    <div className="w-full bg-black/30 border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-3 mt-5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-yellow-300 mr-auto">Orientation Briefing Video</span>
                        <div className="w-full aspect-video rounded-xl overflow-hidden relative border border-white/10 bg-black">
                            <video 
                                src="/video-results.mp4" 
                                autoPlay 
                                loop 
                                controls
                                playsInline 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                </div>

                {/* Right Side: Card Recommendation & Next Actions */}
                <div className="flex-1 bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col justify-between">
                    
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">
                            Tailored Recommendation ///
                        </span>
                        <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter mt-1 mb-6">
                            Your Unlocked Card
                        </h3>
                        
                        {/* Digital Credit Card Mockup */}
                        <motion.div 
                            initial={{ rotateY: -180, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                            className={`w-full max-w-[360px] aspect-[1.586/1] mx-auto rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden mb-6 ${cardBg}`}
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15)_0%,transparent_100%)] pointer-events-none" />
                            
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">Credit University</span>
                                    <h4 className="text-sm font-black tracking-wider uppercase italic leading-none">{cardName}</h4>
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
                        <div className="space-y-4 mb-6">
                            <div>
                                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Target Score Tier</span>
                                <p className="text-xs text-yellow-300 font-bold">{cardRange}</p>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Core Benefits</span>
                                <ul className="list-disc pl-4 text-xs text-slate-200 space-y-1 mt-1 font-light">
                                    {cardBenefits.slice(0, 2).map((b: string, i: number) => (
                                        <li key={i}>{b}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Funnel Routing Triggers */}
                    <div className="border-t border-white/10 pt-6 mt-4 space-y-3">
                        <button 
                            type="button"
                            onClick={handleShare}
                            className="w-full py-3 bg-[#003DA5]/20 hover:bg-[#003DA5]/30 text-yellow-350 border border-yellow-400/20 font-black text-xs uppercase rounded-xl tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                        >
                            📢 {copiedShare ? "Acceptance Link Copied!" : "Share Acceptance & Results"}
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/spin" className="flex-1">
                                <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-md shadow-yellow-950/20 text-xs uppercase py-3.5 px-4 h-12">
                                    <Compass className="w-4 h-4" />
                                    Spin Reward Wheel
                                </button>
                            </Link>
                            <Link to="/transcript" className="flex-1">
                                <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all border-2 border-white/20 hover:bg-white/10 text-white text-xs uppercase py-3.5 px-4 h-12">
                                    <FileSearch className="w-4 h-4" />
                                    Transcript Audit
                                </button>
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => navigate('/free-assessment/start')}
                                className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all border border-white/10 hover:bg-white/5 text-white text-xs uppercase py-3.5 px-4 h-12"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Edit Exam Answers
                            </button>
                            <Link to="/join" className="flex-1">
                                <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:brightness-110 text-xs uppercase py-3.5 px-4 h-12 font-black tracking-wide">
                                    Enroll in Semester
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>

            </div>

            {/* Free Bonus Rewards Unlocked Section */}
            <div className="max-w-5xl w-full bg-black/30 border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 text-left mt-8 space-y-6 mx-auto">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">Bonus Materials Unlocked</span>
                    <h3 className="text-2xl font-black italic uppercase text-white tracking-tight mt-1">Your Free Enrollment Gift Package</h3>
                    <p className="text-xs text-blue-100 font-light leading-relaxed">
                        As an accepted applicant, you have unlocked free digital access to our premium student study materials. Claim them inside the student portal during Dorm Week.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Dictionary Bonus */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                        <img 
                            src="/financial-dictionary-cover.png" 
                            alt="Webster's Financial Dictionary" 
                            className="w-20 h-auto object-contain rounded-lg border border-yellow-400/20 shadow-md flex-shrink-0"
                        />
                        <div>
                            <span className="text-[8px] font-mono uppercase bg-yellow-400/10 text-yellow-350 px-2 py-0.5 rounded font-bold">Bonus Gift #1</span>
                            <h4 className="font-bold text-white text-sm mt-1.5 leading-tight uppercase">Webster’s Financial Dictionary</h4>
                            <p className="text-[10px] text-slate-350 font-light leading-relaxed mt-1">
                                Master the financial terminology needed to talk to credit bureaus and lenders on equal footing.
                            </p>
                        </div>
                    </div>

                    {/* Starter Guide Bonus */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                        <img 
                            src="/25-word-starter-guide.png" 
                            alt="25-Word Starter Guide" 
                            className="w-20 h-auto object-contain rounded-lg border border-white/10 shadow-md flex-shrink-0"
                        />
                        <div>
                            <span className="text-[8px] font-mono uppercase bg-yellow-400/10 text-yellow-350 px-2 py-0.5 rounded font-bold">Bonus Gift #2</span>
                            <h4 className="font-bold text-white text-sm mt-1.5 leading-tight uppercase">25-Word Starter Guide</h4>
                            <p className="text-[10px] text-slate-350 font-light leading-relaxed mt-1">
                                The exact 25-word template to initiate your factual disputes and trigger automated regulatory checks.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
