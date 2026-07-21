import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Play, Volume2, VolumeX, CheckCircle, Calendar, ArrowRight, 
    Clock, Award, ShieldCheck, FileText, Sparkles, ChevronDown, 
    ChevronUp, Users, BookOpen, Compass, Trophy, Flag, Star 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import FloatingMotes from '../components/FloatingMotes';

interface DayItem {
    day: number;
    title: string;
    subtitle: string;
    focus: string;
    unlocks: string[];
}

export default function DormWeekRush() {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);

    // Audio & Video state
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showScript, setShowScript] = useState(false);

    // Accordion Timeline State
    const [activeDay, setActiveDay] = useState<number>(1);
    const [completedDays, setCompletedDays] = useState<number[]>([1]);

    // Payment Simulator State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState({ name: '', price: '' });
    const [isEnrolled, setIsEnrolled] = useState(false);

    // Countdown Timer (target: July 21, 2026)
    const [timeLeft, setTimeLeft] = useState({ days: 19, hours: 12, minutes: 30, seconds: 0 });

    useEffect(() => {
        // Trigger congratulations confetti on load
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.3 }
        });

        // Initialize target countdown
        const targetDate = new Date('2026-07-28T00:00:00');
        const updateTimer = () => {
            const current = Date.now();
            const diff = targetDate.getTime() - current;
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play().then(() => setIsPlaying(true));
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleMuteToggle = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const triggerCheckout = (packageName: string, price: string) => {
        setSelectedPackage({ name: packageName, price });
        setShowPaymentModal(true);
    };

    const confirmPayment = () => {
        setShowPaymentModal(false);
        setIsEnrolled(true);
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.4 },
            colors: ['#0033A0', '#FDB515', '#ffffff']
        });
    };

    const toggleDayComplete = (day: number) => {
        setCompletedDays(prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
        confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#FDB515', '#ffffff']
        });
    };

    const daysData: DayItem[] = [
        {
            day: 1,
            title: "MOVE-IN DAY™",
            subtitle: "Welcome To Credit U™",
            focus: "Understanding your current financial position. Learning where you stand today. Building your student profile.",
            unlocks: [
                "Official Acceptance Letter™",
                "Student ID™",
                "Founding Student Badge™",
                "Credit U Passport™",
                "Access To Mission 800™",
                "Dean Ashley Welcome Video™",
                "Student Portal Access™"
            ]
        },
        {
            day: 2,
            title: "MONEY MINDSET DAY™",
            subtitle: "Meet Your Financial Personality™",
            focus: "Your relationship with money affects every financial decision you make.",
            unlocks: [
                "Spending Habits Audit",
                "Money Triggers Map",
                "Financial Confidence Assessment",
                "Money Behaviors Chart",
                "Financial Identity Profile™",
                "Strengths & Weaknesses Tracker"
            ]
        },
        {
            day: 3,
            title: "CREDIT U TRANSCRIPT DAY™",
            subtitle: "Learn What Your Credit Story Is Saying",
            focus: "Before you build credit, you must understand credit.",
            unlocks: [
                "Approval Readiness Scan™",
                "Credit GPA Calculation™",
                "Risk Factors Review™",
                "Utilization Estimator™",
                "Collections Analysis™",
                "Payment History Log™",
                "Account Mix Analyzer™",
                "Mission 800 Score Roadmap™"
            ]
        },
        {
            day: 4,
            title: "MISSION 800™ DAY",
            subtitle: "Create Your Financial Destination",
            focus: "A person without a destination never knows if they are making progress.",
            unlocks: [
                "Homeownership Target Planning",
                "Better Credit Blueprinting",
                "Wealth Building Checkpoints",
                "Investing Readiness Milestones",
                "Business Funding Roadmaps",
                "Vehicle Approvals Checklists",
                "Family Legacy Setup Guide"
            ]
        },
        {
            day: 5,
            title: "BLUEPRINT DAY™",
            subtitle: "Design Your Financial Dorm Room™",
            focus: "Success isn't random. It's designed.",
            unlocks: [
                "Spending Plan Template™",
                "Savings System Setup™",
                "Debt Strategy Calculation™",
                "Approval Plan Timelines™",
                "Monthly Goals Ledger™",
                "Financial Calendar Integration™"
            ]
        },
        {
            day: 6,
            title: "GAME DAY™",
            subtitle: "Credit U Challenge Day™",
            focus: "Execution creates results. Knowledge without action changes nothing.",
            unlocks: [
                "Credit Monitoring Checklist",
                "Budget Review Exercises",
                "Savings Assignment Task",
                "Financial Homework Checkpoint",
                "Goal Tracking Log",
                "Accountability Drills"
            ]
        },
        {
            day: 7,
            title: "FOUNDING STUDENT CEREMONY™",
            subtitle: "Celebrate Your Beginning",
            focus: "You're no longer waiting. You're officially becoming part of Credit U.",
            unlocks: [
                "Founding Student Certificate™",
                "Completion Badge Unlock™",
                "Dorm Week Graduation Diploma™",
                "Mission 800 Activation Badge™",
                "Student Recognition Roll™",
                "Exclusive Founder Bonuses™"
            ]
        }
    ];

    const hbcuFeatures = [
        "HBCU Band Energy", "Confetti Celebrations", "Achievement Unlocks", 
        "Student Progress Tracking", "Acceptance Moments", "Badge Unlocks", 
        "Welcome Announcements", "Mission 800 Tracking", "Credit Cow Experiences", 
        "Stadium Lighting", "Credit U Anthem"
    ];

    const onboardingProgress = Math.round((completedDays.length / 7) * 100);

    return (
        <div className="relative flex-1 bg-[#001A4D] text-white min-h-screen py-12 overflow-hidden">
            {/* Background Motes particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <FloatingMotes />
            </div>

            {/* Stadium Lights / Glowing Radials */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
                
                {/* 1. HERO HEADER */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/35 px-4 py-1.5 rounded-full shadow-lg">
                        <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-yellow-300 font-mono">
                            Founding Student Private Onboarding
                        </span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-7xl font-black italic tracking-tighter uppercase text-white leading-none">
                        Dorm Week <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">Rush™</span>
                    </h1>
                    
                    <p className="text-sm sm:text-lg text-yellow-300 font-bold uppercase tracking-wider font-mono">
                        July 14, 2026 – July 20, 2026
                    </p>

                    <div className="w-full max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent my-2" />

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto font-light">
                        Official Credit U™ Dorm Week Opens <strong className="text-white">July 28, 2026</strong>. Step inside the campus orientation and secure your early founding student privileges today.
                    </p>
                </div>

                {/* 2. DYNAMIC COUNTDOWN TIMER */}
                <div className="max-w-xl mx-auto bg-gradient-to-b from-[#0033A0]/35 to-black/40 border border-yellow-400/30 p-6 rounded-3xl shadow-[0_0_40px_rgba(253,181,21,0.15)] text-center space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400 font-mono">
                        Countdown to Official Opening Day (July 28, 2026)
                    </h4>
                    
                    <div className="grid grid-cols-4 gap-3 max-w-xs sm:max-w-sm mx-auto">
                        {[
                            { value: timeLeft.days, label: 'Days' },
                            { value: timeLeft.hours, label: 'Hours' },
                            { value: timeLeft.minutes, label: 'Minutes' },
                            { value: timeLeft.seconds, label: 'Seconds' }
                        ].map((time, idx) => (
                            <div key={idx} className="bg-black/60 border border-white/5 rounded-xl p-3 flex flex-col items-center shadow-lg">
                                <span className="text-xl sm:text-2xl font-black text-yellow-400 font-mono leading-none">
                                    {time.value.toString().padStart(2, '0')}
                                </span>
                                <span className="text-[7px] text-slate-400 uppercase tracking-widest mt-1.5 font-bold">
                                    {time.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. LANDSCAPE MOUNTED VIDEO PLAYER */}
                <div className="w-full max-w-4xl mx-auto space-y-4">
                    <div className="relative rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-[0_0_60px_rgba(253,181,21,0.3)] bg-black/60 group">
                        {/* Video Element */}
                        <video
                            ref={videoRef}
                            src="/dorm-week-vd.mp4"
                            className="w-full aspect-video object-cover"
                            loop
                            muted={isMuted}
                            playsInline
                            autoPlay
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />

                        {/* Interactive overlay controls */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-between p-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex justify-between items-start">
                                <span className="text-[9px] font-black tracking-widest bg-yellow-400 text-blue-950 px-2 py-0.5 rounded uppercase font-mono">
                                    Dean Ashley Onboarding Welcome
                                </span>
                                
                                <button
                                    onClick={handleMuteToggle}
                                    className="p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-white transition-colors"
                                    title={isMuted ? "Unmute Audio" : "Mute Audio"}
                                >
                                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                                </button>
                            </div>

                            {/* Center Play Button Overlay (when paused) */}
                            {!isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <button 
                                        onClick={handlePlayPause}
                                        className="w-16 h-16 bg-yellow-400 hover:bg-yellow-300 text-blue-950 rounded-full flex items-center justify-center shadow-2xl pointer-events-auto transform active:scale-95 transition-transform"
                                    >
                                        <Play className="w-8 h-8 fill-current ml-1" />
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-between items-center w-full">
                                <button
                                    onClick={handlePlayPause}
                                    className="text-[10px] font-black uppercase tracking-wider text-yellow-400 hover:text-white"
                                >
                                    {isPlaying ? "⏸ PAUSE VIDEO" : "▶ PLAY VIDEO"}
                                </button>
                                <span className="text-[10px] text-slate-400 font-mono">
                                    Dean Ashley Orientation
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Video transcript toggler */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowScript(!showScript)}
                            className="text-xs font-bold text-yellow-300 hover:text-yellow-200 border border-yellow-400/20 bg-yellow-400/5 px-4 py-2 rounded-xl transition-all"
                        >
                            {showScript ? "[- CLOSE DEAN MESSAGE]" : "[+ VIEW DEAN ASHLEY MESSAGE]"}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showScript && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-[#002270]/30 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-2xl mx-auto text-left text-xs leading-relaxed text-slate-350 font-mono space-y-4"
                            >
                                <span className="font-bold text-white uppercase block tracking-wider text-[10px]">🎙 Dean Ashley Message:</span>
                                <div className="space-y-2 border-l-2 border-yellow-400 pl-4 italic">
                                    <p>"Credit U officially opens on July 21, 2026."</p>
                                    <p>"But our Founding Students don't wait until opening day."</p>
                                    <p>"They arrive early. They prepare early. They build early. They learn early."</p>
                                    <p>"Because when the doors officially open, they're already ahead."</p>
                                    <p>"Join Dorm Week Rush™ today for only $39 and receive seven private onboarding days before Credit U opens to the public."</p>
                                    <p>"Welcome to Credit U."</p>
                                </div>
                                <span className="block font-black text-yellow-400 text-[10px] tracking-wide text-right">It Starts With U™</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 3.5 MARKETING SYLLABUS SHEET */}
                <div className="w-full max-w-2xl mx-auto space-y-4 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400 font-mono block">
                        Credit U Syllabus & Pricing Guide ///
                    </span>
                    <div className="relative rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-[0_0_50px_rgba(253,181,21,0.35)] bg-slate-950">
                        <img 
                            src="/credit-u-marketing.jpg" 
                            alt="Credit U Academic Syllabus" 
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>

                {/* 4. JOIN NOW AND REASONS BANNER */}
                <div className="bg-gradient-to-r from-blue-900/35 to-black/35 border border-yellow-400/30 rounded-3xl p-8 max-w-4xl mx-auto space-y-6 text-center shadow-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 font-mono block">Exciting Founder Offer ///</span>
                    <h2 className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase text-white">
                        🌟 Join Now For Only $39
                    </h2>
                    
                    <p className="text-sm text-yellow-300 font-bold uppercase tracking-wider font-mono">
                        Receive 7 Exclusive Private Onboarding Days Before Credit U Officially Opens
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4 text-xs font-bold text-slate-300">
                        <div className="bg-black/20 border border-white/5 p-3 rounded-xl">This isn't just a waitlist.</div>
                        <div className="bg-black/20 border border-white/5 p-3 rounded-xl">This isn't another online course.</div>
                        <div className="bg-black/20 border border-white/5 p-3 rounded-xl">This isn't another credit program.</div>
                        <div className="bg-black/20 border border-white/5 p-3 rounded-xl text-yellow-400">This is your official acceptance.</div>
                    </div>

                    <div className="pt-6">
                        {isEnrolled ? (
                            <div className="bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 px-6 py-4 rounded-2xl max-w-md mx-auto font-black uppercase text-sm tracking-wide shadow-lg">
                                🎉 You are officially enrolled in Dorm Week Rush!
                            </div>
                        ) : (
                            <button
                                onClick={() => triggerCheckout('Dorm Week Rush™ Early Access', '$39')}
                                className="py-4 px-10 bg-gradient-to-r from-yellow-400 to-amber-300 text-blue-950 font-black text-sm uppercase rounded-2xl tracking-widest shadow-xl hover:scale-105 transition-transform animate-pulse"
                            >
                                Secure Your Access for $39
                            </button>
                        )}
                    </div>
                </div>

                {/* 5. INTERACTIVE 7-DAY TIMELINE */}
                <div className="w-full max-w-4xl mx-auto space-y-8 bg-black/20 border border-white/5 p-6 sm:p-8 rounded-3xl">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
                            🎓 7 Private Onboarding Days
                        </h2>
                        <p className="text-xs text-slate-400">
                            Click a Day to preview lessons, focus checkpoints, and unlocked founding items.
                        </p>
                    </div>

                    {/* Progress tracker */}
                    <div className="space-y-2 max-w-md mx-auto">
                        <div className="flex justify-between text-[10px] uppercase font-black text-slate-400 tracking-wider font-mono">
                            <span>Orientation Progress:</span>
                            <span className="text-yellow-300">{onboardingProgress}% Done</span>
                        </div>
                        <div className="w-full h-2 bg-black/50 border border-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-500"
                                style={{ width: `${onboardingProgress}%` }}
                            />
                        </div>
                    </div>

                    {/* Timeline Accordions */}
                    <div className="space-y-4">
                        {daysData.map((item) => {
                            const isOpen = activeDay === item.day;
                            const isDone = completedDays.includes(item.day);
                            return (
                                <div 
                                    key={item.day}
                                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                                        isOpen ? 'bg-[#002270]/40 border-yellow-400/40 shadow-lg' : 'bg-black/20 border-white/5 hover:border-white/15'
                                    }`}
                                >
                                    {/* Header Row */}
                                    <div 
                                        onClick={() => setActiveDay(isOpen ? 0 : item.day)}
                                        className="p-5 flex items-center justify-between cursor-pointer select-none"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs ${
                                                isDone 
                                                    ? 'bg-yellow-400 text-blue-950 shadow-md shadow-yellow-950/20' 
                                                    : 'bg-black/40 border border-white/15 text-slate-350'
                                            }`}>
                                                D{item.day}
                                            </span>
                                            <div className="text-left">
                                                <h4 className="text-xs font-black uppercase text-yellow-400 font-mono tracking-wider">
                                                    {item.title}
                                                </h4>
                                                <p className="text-sm font-black text-white italic tracking-tight uppercase">
                                                    {item.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleDayComplete(item.day);
                                                }}
                                                className={`text-[9px] font-black uppercase px-2.5 py-1 rounded transition-colors ${
                                                    isDone 
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30' 
                                                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                                                }`}
                                            >
                                                {isDone ? '✔ COMPLETE' : 'MARK READ'}
                                            </button>
                                            {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                        </div>
                                    </div>

                                    {/* Expanded Body */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/5 bg-black/20"
                                            >
                                                <div className="p-5 space-y-4 text-left">
                                                    {/* Lesson Focus */}
                                                    <div className="space-y-1">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-mono">
                                                            Lesson Focus:
                                                        </span>
                                                        <p className="text-xs text-white leading-relaxed font-light">
                                                            {item.focus}
                                                        </p>
                                                    </div>

                                                    {/* Unlocks / Access */}
                                                    <div className="space-y-2">
                                                        <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest block font-mono">
                                                            Founding Unlocks & Access:
                                                        </span>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {item.unlocks.map((unlock, uIdx) => (
                                                                <div key={uIdx} className="flex items-center gap-2 text-xs text-slate-300 font-bold bg-black/20 p-2 rounded-lg border border-white/5">
                                                                    <CheckCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                                                                    <span>{unlock}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 6. INCLUDED WITH CHECKS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
                    {/* INCLUDED PACKAGES LIST */}
                    <div className="bg-[#002270]/25 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl space-y-4 text-left">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-yellow-400" />
                            <h3 className="text-lg font-black uppercase italic text-white tracking-wide">
                                Onboarding Access Is Included With:
                            </h3>
                        </div>
                        <p className="text-xs text-slate-350 font-light leading-relaxed">
                            You automatically get complete 7-day orientation access when you purchase any of the following credit packages:
                        </p>
                        
                        <div className="space-y-2.5 pt-2">
                            {[
                                "Dorm Week Rush™ ($39 early access)",
                                "Single Transcript Review™ ($49)",
                                "Double Transcript Review™ ($69)",
                                "Single Dorm™ Coaching Enrollment",
                                "Double Dorm™ Coaching Enrollment"
                            ].map((pkg, idx) => (
                                <div key={idx} className="flex items-center gap-2.5 text-xs text-white font-bold bg-black/20 p-2.5 rounded-xl border border-white/5">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>{pkg}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* HBCU EXPERIENCE METRICS */}
                    <div className="bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl space-y-4 text-left">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            <h3 className="text-lg font-black uppercase italic text-white tracking-wide">
                                🎺 The HBCU Experience
                            </h3>
                        </div>
                        <p className="text-xs text-slate-350 font-light leading-relaxed">
                            Throughout your onboarding orientation, experience high-spirited visual celebrations and trackers:
                        </p>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                            {hbcuFeatures.map((feat, idx) => (
                                <span 
                                    key={idx} 
                                    className="text-[9px] font-black uppercase font-mono bg-yellow-400/10 text-yellow-300 border border-yellow-400/25 px-2.5 py-1 rounded-full"
                                >
                                    {feat}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 7. FINAL CALL TO ACTION */}
                <div className="max-w-3xl mx-auto bg-gradient-to-b from-[#0033A0]/20 to-black/60 border border-yellow-400/35 p-8 sm:p-12 rounded-3xl shadow-2xl text-center space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
                            Join Dorm Week Rush™ Today
                        </h2>
                        <p className="text-sm text-yellow-300 font-bold uppercase tracking-wider font-mono">
                            $39 Founding Student Access
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left max-w-2xl mx-auto pt-2 text-[10px] text-slate-300 font-bold">
                        <li>✔ Acceptance Letter™</li>
                        <li>✔ Student ID™</li>
                        <li>✔ 7 Onboarding Days™</li>
                        <li>✔ Mission 800™ access</li>
                        <li>✔ Student Rewards™</li>
                        <li>✔ Credit U Wheel™</li>
                        <li>✔ Founding Status™</li>
                        <li className="text-yellow-400">✔ VIP Early entry</li>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            type="button"
                            onClick={() => triggerCheckout('Dorm Week Rush™ Early Access', '$39')}
                            className="py-4 px-8 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-all active:scale-95 shadow-md shadow-yellow-950/20"
                        >
                            JOIN DORM WEEK RUSH™ ($39) ⚡
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/transcript')}
                            className="py-4 px-8 bg-[#003DA5]/20 hover:bg-[#003DA5]/30 text-yellow-300 border border-yellow-400/20 font-black text-xs uppercase rounded-xl tracking-wider transition-all active:scale-95 shadow-md"
                        >
                            GET TRANSCRIPT REVIEW ($49)
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dormweek')}
                            className="py-4 px-8 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase rounded-xl tracking-wider transition-all active:scale-95 shadow-md border border-white/10"
                        >
                            RESERVE DORM ROOM
                        </button>
                    </div>

                    <div className="pt-4 space-y-1">
                        <h4 className="text-base font-black text-white font-mono tracking-widest uppercase">
                            Credit U™
                        </h4>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                            The Financial University™
                        </p>
                        <p className="text-[9px] text-yellow-400 font-bold uppercase tracking-wider">
                            Build Credit • Build Wealth • Build Legacy 💙💛🎓
                        </p>
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
                                <p className="text-xs text-slate-400">Complete your founding student registration</p>
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

                            {/* Card Details form placeholder */}
                            <div className="space-y-3 text-left">
                                <label className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Simulated Card Details</label>
                                <div className="bg-black/40 border border-white/10 p-3 rounded-lg text-xs font-mono text-slate-350">
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
