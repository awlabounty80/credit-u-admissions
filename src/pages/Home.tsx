import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import CreditUAssessmentFunnelCard from '../components/CreditUAssessmentFunnelCard';
import { CampusEnhancementWrapper } from '../components/CampusEnhancementWrapper';

export default function Home() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [timeLeft, setTimeLeft] = useState({ days: 18, hours: 14, minutes: 45, seconds: 20 });
    const [waitlistForm, setWaitlistForm] = useState({
        firstName: '',
        email: '',
        phone: '',
        creditGoal: '',
        creditChallenge: '',
        interestType: 'Waitlist Only'
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [hasTakenExam, setHasTakenExam] = useState(false);

    useEffect(() => {
        const submission = localStorage.getItem('cu_current_submission');
        if (submission) {
            setHasTakenExam(true);
        }
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

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

    const STRIPE_LINKS: Record<string, string> = {
        'Single Transcript Review':       'https://buy.stripe.com/8x27sL4olaGI2Fm2Mf7EQ01',
        'Double Transcript Review':       'https://buy.stripe.com/aFa28r9IF7uw7ZGbiL7EQ02',
        'Single Dorm Room Tuition':       'https://buy.stripe.com/5kQfZhdYVg123Jq1Ib7EQ03',
        'Double Dorm Room Tuition':       'https://buy.stripe.com/4gMaEX6wt9CEdk0dqT7EQ04',
        'AI Campus Access':               'https://buy.stripe.com/14A5kDdYV4ik0xe5Yr7EQ00',
        'DIY Transcript Workbook':        'https://buy.stripe.com/8x214n4ol3eg7ZG0E77EQ05',
    };

    const handleStripeCheckout = (offerName: string, _price?: string) => {
        playSound(1046.50, 0.15);
        const link = STRIPE_LINKS[offerName];
        if (link) {
            setTimeout(() => window.open(link, '_blank'), 300);
        } else {
            setTimeout(() => alert(`Stripe link coming soon for: ${offerName}`), 300);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const leads = JSON.parse(localStorage.getItem('cu_funnel_waitlist_leads') || '[]');
        const newLead = {
            id: 'lead_' + Date.now(),
            first_name: waitlistForm.firstName,
            email: waitlistForm.email,
            phone: waitlistForm.phone,
            main_credit_goal: waitlistForm.creditGoal,
            biggest_credit_challenge: waitlistForm.creditChallenge,
            interest_type: waitlistForm.interestType,
            source: 'Founding Waitlist Form',
            created_at: new Date().toISOString()
        };
        localStorage.setItem('cu_funnel_waitlist_leads', JSON.stringify([newLead, ...leads]));
        playSound(987.77, 0.4);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.8 } });
        setFormSubmitted(true);
    };

    useEffect(() => {
        const colors = ['#0033A0', '#FDB515', '#FFD54A', '#FFFFFF'];
        confetti({ particleCount: 160, spread: 100, origin: { y: 0.55 }, colors });
        setTimeout(() => confetti({ particleCount: 110, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors }), 300);
        setTimeout(() => confetti({ particleCount: 110, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors }), 500);
        setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.4 }, colors }), 800);
    }, []);

    useEffect(() => {
        const targetDate = new Date('2026-07-28T00:00:00').getTime();

        const timer = setInterval(() => {
            const current = Date.now();
            const diff = targetDate - current;
            if (diff <= 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000)
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            // Autoplay muted to bypass browser blocks
            video.muted = true;
            video.play().catch(() => {});

            const autoUnmute = () => {
                if (video) {
                    video.muted = false;
                    video.play().catch(() => {});
                }
                cleanup();
            };

            const cleanup = () => {
                window.removeEventListener('mousemove', autoUnmute);
                window.removeEventListener('scroll', autoUnmute);
                window.removeEventListener('click', autoUnmute);
                window.removeEventListener('keydown', autoUnmute);
                window.removeEventListener('touchstart', autoUnmute);
            };

            window.addEventListener('mousemove', autoUnmute);
            window.addEventListener('scroll', autoUnmute);
            window.addEventListener('click', autoUnmute);
            window.addEventListener('keydown', autoUnmute);
            window.addEventListener('touchstart', autoUnmute);

            return cleanup;
        }
    }, []);

    return (
        <div className="relative min-h-[90vh] flex flex-col items-center justify-start py-12 overflow-x-hidden pb-24">

            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full relative z-10 border-b-4 border-[#001b57] group">
                <video 
                    ref={videoRef}
                    src="/cu-landing-vd.mp4" 
                    autoPlay 
                    controls
                    muted
                    playsInline 
                    className="w-full aspect-video object-cover" 
                />
                
                <button
                    onClick={() => {
                        if (videoRef.current) {
                            videoRef.current.pause();
                        }
                    }}
                    className="absolute bottom-16 right-4 z-20 px-3 py-1.5 bg-red-600/80 hover:bg-red-700 text-white font-mono font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-lg border border-red-500 transition-all flex items-center gap-1.5"
                >
                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                    Stop Playing
                </button>
            </div>

            <div
                className="w-full py-4 shadow-xl z-10 relative mb-12"
                style={{
                    background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)',
                    backgroundSize: '200% 100%',
                    animation: 'bannerPulse 2.5s ease-in-out infinite, bannerGlow 2.5s ease-in-out infinite',
                    boxShadow: '0 0 30px 8px rgba(251,191,36,0.55), 0 0 60px 16px rgba(251,191,36,0.25)',
                }}
            >
                <style>{`
                    @keyframes bannerPulse {
                        0%, 100% { opacity: 1; box-shadow: 0 0 30px 8px rgba(251,191,36,0.55), 0 0 60px 16px rgba(251,191,36,0.25); }
                        50% { opacity: 0.88; box-shadow: 0 0 55px 18px rgba(251,191,36,0.85), 0 0 100px 32px rgba(251,191,36,0.45); }
                    }
                    @keyframes bannerGlow {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                `}</style>
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <span className="text-blue-900 text-[10px] font-black uppercase tracking-[0.4em] block mb-1">Official University Opening · July 21st 2026</span>
                        <h3 className="text-xl md:text-3xl font-black uppercase text-blue-950 tracking-tight whitespace-nowrap drop-shadow-sm">
                            Credit U&#xAE; Dorm Week Rush&#x2122;
                        </h3>
                    </div>
                    <div className="flex gap-3 md:gap-5">
                        <div className="flex flex-col items-center bg-[#001b57] border-2 border-[#0033A0] rounded-xl px-4 py-2 min-w-[60px] shadow-[inset_0_0_10px_rgba(0,0,0,0.4)]"><span className="text-3xl md:text-4xl font-black text-white leading-none">{timeLeft.days}</span><span className="text-[9px] tracking-widest font-bold mt-1 text-yellow-400 uppercase">Days</span></div>
                        <div className="flex flex-col items-center bg-[#001b57] border-2 border-[#0033A0] rounded-xl px-4 py-2 min-w-[60px] shadow-[inset_0_0_10px_rgba(0,0,0,0.4)]"><span className="text-3xl md:text-4xl font-black text-white leading-none">{timeLeft.hours}</span><span className="text-[9px] tracking-widest font-bold mt-1 text-yellow-400 uppercase">Hours</span></div>
                        <div className="flex flex-col items-center bg-[#001b57] border-2 border-[#0033A0] rounded-xl px-4 py-2 min-w-[60px] shadow-[inset_0_0_10px_rgba(0,0,0,0.4)]"><span className="text-3xl md:text-4xl font-black text-white leading-none">{timeLeft.minutes}</span><span className="text-[9px] tracking-widest font-bold mt-1 text-yellow-400 uppercase">Mins</span></div>
                        <div className="flex flex-col items-center bg-[#001b57] border-2 border-[#0033A0] rounded-xl px-4 py-2 min-w-[60px] shadow-[inset_0_0_10px_rgba(0,0,0,0.4)]"><span className="text-3xl md:text-4xl font-black text-white leading-none">{timeLeft.seconds}</span><span className="text-[9px] tracking-widest font-bold mt-1 text-yellow-400 uppercase">Secs</span></div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl w-full space-y-16 relative z-10 mx-auto px-4 md:px-6">



                {/* HERO SECTION */}
                <div id="hero" className="flex flex-col items-center text-center space-y-8">
                    <div className="max-w-4xl space-y-6 flex flex-col items-center">
                        <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-tight">
                            The Financial University<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500">You've Been Waiting For Is</span><br />
                            Almost Here
                        </h2>

                        <p className="text-sm md:text-base text-blue-100 font-light leading-relaxed max-w-2xl">
                            Dorm Week Rush&#x2122; begins soon.<br />
                            Join the waitlist. Get your Credit U Transcript reviewed.<br />
                            Reserve your summer coaching experience with Credit U Dean Ashley.
                        </p>
                    </div>

                    {/* VSL Video - full width */}
                    <div className="w-full pt-4">
                        <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-3xl p-0.5 shadow-2xl">
                            <div className="bg-[#002270] rounded-[22px] overflow-hidden aspect-video relative border border-yellow-300/20 shadow-inner">
                                <video src="/credit-u-opening.mp4" autoPlay loop muted controls playsInline className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* Hero Buttons - moved under video */}
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <button
                            onClick={() => scrollToSection('waitlist')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl font-black transition-all bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-md shadow-yellow-950/20 text-xs uppercase py-3.5 px-6 h-12 tracking-wider"
                        >
                            Join Waitlist
                        </button>
                        <button
                            onClick={() => scrollToSection('transcript')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all border-2 border-white/20 hover:bg-white/10 text-white text-xs uppercase py-3.5 px-6 h-12 tracking-wide"
                        >
                            Get Transcript Review
                        </button>
                        <button
                            onClick={() => scrollToSection('summer-session')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all border-2 border-yellow-400/30 hover:border-yellow-400 text-yellow-300 text-xs uppercase py-3.5 px-6 h-12 tracking-wide"
                        >
                            Reserve Dorm
                        </button>
                    </div>

                    {/* ===== PREMIUM ASSESSMENT FUNNEL CARD ===== */}
                    <div className="pt-4 w-full">
                        <CreditUAssessmentFunnelCard />
                    </div>
                </div>

            </div>

            {/* WHAT IS CREDIT U */}
            <div id="about" className="w-full relative z-10 my-16 bg-[#001b57] border-y-2 border-yellow-400/20 shadow-2xl">
                <div className="max-w-5xl mx-auto px-4 md:px-6 py-16 flex flex-col items-center text-center space-y-6">
                    <img src="/creditu-logo.jpg" alt="Credit University AI" className="h-32 md:h-40 object-contain rounded-2xl shadow-[0_0_40px_rgba(250,204,21,0.2)] border border-yellow-400/30 mb-2" />
                    
                    <h2 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white uppercase leading-none drop-shadow-xl">
                        CREDIT U
                    </h2>
                    
                    <span className="text-lg md:text-xl font-black uppercase tracking-[0.4em] text-yellow-400 drop-shadow-md">
                        THE CREDIT UNIVERSITY AI
                    </span>
                    
                    <h3 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tight max-w-4xl mt-6">
                        More Than Credit Repair. This Is Credit Education Reimagined.
                    </h3>
                    
                    <button
                        onClick={() => scrollToSection('waitlist')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl font-black transition-all bg-yellow-400 hover:bg-yellow-300 text-blue-900 text-sm uppercase py-4 px-10 mt-8 shadow-[0_0_30px_rgba(250,204,21,0.3)] tracking-wider"
                    >
                        Join the First Class
                    </button>
                </div>

                <div className="w-full relative px-4 md:px-6 pb-12">
                    <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-3xl p-0.5 shadow-2xl">
                        <div className="bg-[#002270] rounded-[22px] overflow-hidden aspect-video relative border border-yellow-300/20 shadow-inner">
                            <video src="/cu-me-vd.mp4" autoPlay loop muted controls playsInline className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl w-full space-y-16 relative z-10 mx-auto px-4 md:px-6 pb-0">
                {/* ===== CREDIT U™ TRANSCRIPT REQUIREMENT SECTION ===== */}
                <div id="credit-u-transcript-requirement" className="w-full space-y-10 pt-4">

                    {/* Section Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 bg-yellow-400/15 border border-yellow-400/40 px-5 py-2 rounded-full">
                            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">🎓 Credit U™ Transcript</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black italic uppercase text-white tracking-tighter leading-none">
                            Credit U™ <span className="text-yellow-400">Transcript</span>
                        </h2>
                        <p className="text-lg text-blue-100 font-light max-w-2xl mx-auto">Every Credit U Student Must Start With Their Transcript™</p>
                    </div>

                    {/* Transcript Video */}
                    <div className="w-full flex justify-center">
                        <div className="w-full max-w-4xl">
                            <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-3xl p-0.5 shadow-2xl">
                                <div className="bg-[#002270] rounded-[22px] overflow-hidden relative border border-yellow-300/20 shadow-inner">
                                    <video src="/credit-u-opening-vid.mp4" autoPlay loop muted controls playsInline className="w-full h-auto block" />
                                    <div className="absolute top-4 left-4">
                                        <span className="text-[9px] font-black tracking-wider uppercase font-mono bg-yellow-400 text-blue-950 px-3 py-1 rounded shadow">Credit U™ Transcript Guide</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Intro Explanation */}
                    <div className="bg-[#0033A0]/30 border border-yellow-400/20 rounded-3xl p-6 md:p-8 space-y-4 text-left">
                        <p className="text-white text-sm md:text-base font-light leading-relaxed">
                            At <strong className="text-yellow-400">Credit University AI™ (Credit U™)</strong>, your <strong className="text-yellow-400">Credit U Transcript™</strong> serves as your academic record for your financial life. Before Dean Ashley J. can properly evaluate your profile, create a strategy, or assign your <strong className="text-yellow-400">Mission 800™</strong> placement, students are required to obtain their Credit U Transcript™.
                        </p>
                        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl px-5 py-3 inline-block">
                            <p className="text-yellow-300 font-black text-sm uppercase tracking-wide">This is a pre-requisite for enrollment success.</p>
                        </div>
                    </div>

                    {/* STEP 1 — Pull Transcript */}
                    <div className="bg-gradient-to-br from-[#001b57] to-[#0033A0] border-2 border-yellow-400/60 rounded-3xl p-6 md:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(253,181,21,0.07)_0%,_transparent_70%)]" />
                        <div className="relative z-10 space-y-4">
                            <div className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-blue-950 font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
                                STEP 1
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black italic uppercase text-white tracking-tighter">Order Your Credit U Transcript™</h3>
                            <p className="text-blue-200 text-sm font-light max-w-xl mx-auto">Before your review, pull your official Credit U Transcript™ through our recommended partner portal.</p>
                            <a
                                href="https://app.myfreescorenow.com/enroll/B04B3904"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full max-w-md py-5 px-6 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-950 font-black text-base md:text-lg uppercase rounded-2xl tracking-wider transition-all duration-300 shadow-lg shadow-yellow-900/30 hover:scale-105 active:scale-95"
                            >
                                🎓 PULL MY CREDIT U TRANSCRIPT™
                            </a>
                            <div className="space-y-1 text-xs text-blue-200 font-light">
                                <p>✅ Required for Dean Ashley J. Transcript Reviews</p>
                                <p>✅ Required for active Credit U coaching students</p>
                                <p>✅ Recommended for monthly progress monitoring</p>
                            </div>
                        </div>
                    </div>

                    {/* Two-col: What Is It + Why Required */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        {/* What Is A Credit U Transcript */}
                        <div className="bg-[#0033A0]/25 border border-white/10 rounded-2xl p-6 space-y-4">
                            <h4 className="text-lg font-black text-white uppercase italic">📋 What Is A Credit U Transcript™?</h4>
                            <p className="text-xs text-blue-200 font-light leading-relaxed">Your personal financial report card. It provides insight into:</p>
                            <div className="grid grid-cols-2 gap-1 text-[11px] text-blue-100 font-light">
                                {['Credit Scores','Payment History','Utilization','Collections','Public Records','Accounts Opened','Age of Credit','Inquiries','Positive Accounts','Negative Accounts','Approval Readiness','Mission 800™ Placement'].map(item => (
                                    <div key={item} className="flex gap-1.5 items-start"><span className="text-yellow-400 mt-0.5">✅</span><span>{item}</span></div>
                                ))}
                            </div>
                            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3 mt-2">
                                <p className="text-yellow-300 font-black text-xs italic text-center">"Your GPA for your financial future."</p>
                            </div>
                        </div>

                        {/* Why Required */}
                        <div className="bg-[#0033A0]/25 border border-white/10 rounded-2xl p-6 space-y-4">
                            <h4 className="text-lg font-black text-white uppercase italic">🏆 Why Is It Required?</h4>
                            <p className="text-xs text-blue-200 font-light leading-relaxed">Students who track their progress consistently make better financial decisions. Credit U encourages students to monitor their transcript monthly.</p>
                            <p className="text-xs text-blue-200 font-light">Monitoring helps identify:</p>
                            <div className="space-y-1 text-[11px] text-blue-100 font-light">
                                {['Score increases','New accounts','Utilization changes','Inaccurate information','Collection activity','Progress toward Mission 800™'].map(item => (
                                    <div key={item} className="flex gap-1.5"><span className="text-yellow-400">✔</span><span>{item}</span></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Dean Ashley J. Transcript Review */}
                    <div className="bg-gradient-to-br from-[#001b57]/80 to-[#002270]/80 border border-yellow-400/30 rounded-3xl p-6 md:p-8 space-y-6 text-left">
                        <div className="text-center space-y-2">
                            <span className="text-yellow-400 font-black text-xs uppercase tracking-widest">Dean Ashley J. Transcript Review™</span>
                            <h4 className="text-2xl md:text-3xl font-black italic uppercase text-white">After Obtaining Your Transcript, Submit For A Personalized Review.</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <p className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-2">Dean Ashley J. Evaluates:</p>
                                {['Credit U GPA™','Score Readiness','Approval Readiness','Credit Strengths','Areas Needing Improvement','Risk Factors','Personalized Action Steps','Mission 800™ Placement','Growth Strategy','Accountability Recommendations'].map(item => (
                                    <div key={item} className="flex gap-2 text-xs text-blue-100 font-light"><span className="text-yellow-400">→</span><span>{item}</span></div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-2">Students Receive:</p>
                                {['Dean Notes™','Credit U GPA™','Transcript Commentary','Next Step Blueprint™','Strategic Recommendations','Progress Guidance'].map(item => (
                                    <div key={item} className="flex gap-2 text-xs text-blue-100 font-light"><span>🎓</span><span>{item}</span></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* $49 / $69 Cards */}
                    <div id="transcript" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-[#0033A0]/30 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl">
                            <div className="relative w-full">
                                <img src="/single-transcript-review.jpg" alt="Single Transcript Review" className="w-full h-auto object-contain" />
                                <span className="absolute top-2.5 right-2.5 p-1.5 bg-yellow-400 text-blue-950 font-black uppercase text-[8px] rounded shadow z-10">Single</span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <h4 className="font-bold text-xs text-white uppercase">Single Transcript Review™</h4>
                                    <ul className="text-[9px] text-slate-400 font-light space-y-1 mt-2">
                                        <li>One Credit U Transcript™</li>
                                        <li>One Dean Ashley J. Review™</li>
                                        <li>One Credit U GPA™</li>
                                        <li>One Personalized Strategy</li>
                                        <li>Mission 800™ Placement</li>
                                    </ul>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                    <span className="text-lg font-black text-white font-mono">$49</span>
                                    <button onClick={() => handleStripeCheckout('Single Transcript Review')} className="h-8 px-3 uppercase text-[9px] bg-yellow-400 text-blue-950 font-black rounded-lg transition-transform active:scale-95">Get Single Review</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0033A0]/20 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl">
                            <div className="relative w-full">
                                <img src="/double-transcript-review.jpg" alt="Double Transcript Review" className="w-full h-auto object-contain" />
                                <span className="absolute top-2.5 right-2.5 p-1.5 bg-yellow-400 text-blue-950 font-black uppercase text-[8px] rounded shadow z-10">Double</span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <h4 className="font-bold text-xs text-white uppercase">Double Transcript Review™</h4>
                                    <ul className="text-[9px] text-slate-400 font-light space-y-1 mt-2">
                                        <li>Two Credit U Transcripts™</li>
                                        <li>Two Dean Reviews™</li>
                                        <li>Two Credit U GPA™ Ratings</li>
                                        <li>Compare Profiles — Couples, Families, Partners</li>
                                        <li>Shared Strategy + Mission 800™ Placement</li>
                                    </ul>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                    <span className="text-lg font-black text-white font-mono">$69</span>
                                    <button onClick={() => handleStripeCheckout('Double Transcript Review')} className="h-8 px-3 uppercase text-[9px] bg-yellow-400 text-blue-950 font-black rounded-lg transition-transform active:scale-95">Get Double Review</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* $26 DIY Transcript Workbook */}
                    <div className="bg-gradient-to-br from-[#001b57] to-[#0033A0] border border-yellow-400/30 rounded-3xl overflow-hidden shadow-2xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            <div className="md:col-span-5 flex justify-center">
                                <img 
                                    src="/transcript-workbook-26.jpg" 
                                    alt="Credit U™ Transcript Workbook $26" 
                                    className="max-h-64 object-contain rounded-2xl border border-white/10 shadow-lg" 
                                />
                            </div>
                            <div className="md:col-span-7 space-y-4 text-left">
                                <div>
                                    <span className="bg-yellow-400/20 text-yellow-300 text-[10px] font-black uppercase px-2.5 py-1 rounded font-mono">DIY Option</span>
                                    <h4 className="text-2xl font-black text-white uppercase italic mt-2">Credit U Transcript™ Workbook</h4>
                                    <p className="text-xs text-blue-200 font-light mt-1">Complete it independently — Fillable PDF, GPA Worksheet, Mission 800™ Tracker & more.</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                                    <div className="text-left">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-light">One-time download</span>
                                        <p className="text-3xl font-black text-white font-mono">$26</p>
                                    </div>
                                    <button onClick={() => handleStripeCheckout('DIY Transcript Workbook')} className="flex-1 py-4 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-transform active:scale-95 whitespace-nowrap shadow-md">
                                        DOWNLOAD MY CREDIT U TRANSCRIPT™
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Credit U Policy Box */}
                    <div className="bg-yellow-400/10 border-l-4 border-yellow-400 rounded-2xl p-6 space-y-2 text-left">
                        <p className="text-yellow-400 font-black text-xs uppercase tracking-widest">📋 Credit U Policy™</p>
                        <p className="text-sm text-blue-100 font-light leading-relaxed">Every active coaching student working with Dean Ashley J. is strongly encouraged to maintain a current Credit U Transcript™ for ongoing progress tracking and accountability. Students may update their transcript <strong className="text-white">monthly</strong> to measure growth, monitor results, and stay aligned with their Mission 800™ journey.</p>
                    </div>

                    {/* CTA Start Here */}
                    <div className="bg-gradient-to-br from-[#0033A0] to-[#001b57] border border-yellow-400/30 rounded-3xl p-8 text-center space-y-4">
                        <p className="text-yellow-400 font-black text-xs uppercase tracking-widest">START HERE</p>
                        <div className="space-y-2 text-sm text-white font-light">
                            <p>🎓 Pull Your Credit U Transcript™</p>
                            <p>📊 Understand Your Financial GPA™</p>
                            <p>👩🏽‍🏫 Submit For Dean Ashley J. Review™</p>
                            <p>🏆 Build Your Mission 800™ Roadmap</p>
                        </div>
                    </div>
                    {/* FAQ Accordion */}
                    <div className="space-y-3 text-left">
                        <h4 className="text-xl font-black text-white uppercase italic text-center">Frequently Asked Questions</h4>
                        {[
                            { q: 'How often should I pull my transcript?', a: 'Monthly. Regular monitoring helps you track score increases, new accounts, utilization changes, and progress toward Mission 800™.' },
                            { q: 'Is the transcript required?', a: 'Yes, for students seeking Dean Ashley J. reviews and active coaching. It is the foundation of your Credit U journey.' },
                            { q: 'Can I review it myself?', a: 'Yes. Purchase the $26 Credit U Transcript™ Workbook — a fillable DIY guide with GPA worksheet, Mission 800™ tracker, and action steps.' },
                            { q: 'Do I need to stay enrolled in monitoring?', a: 'Monitoring is highly recommended to track your progress and maintain accountability on your Mission 800™ journey.' },
                            { q: 'Can couples submit together?', a: 'Yes. The Double Transcript Review™ ($69) is designed specifically for two people growing together — couples, siblings, business partners, or friends.' },
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-[#0033A0]/25 border border-white/10 rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex justify-between items-center p-4 text-left text-white font-bold text-sm hover:bg-white/5 transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <span className={`text-yellow-400 text-xl font-black transition-transform duration-300 ${openFaq === idx ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                {openFaq === idx && (
                                    <div className="px-4 pb-4 text-xs text-blue-200 font-light leading-relaxed border-t border-white/5 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>




                {/* SUMMER SESSION */}
                <div id="summer-session" className="max-w-4xl mx-auto space-y-8 pt-4 text-center">
                    <div>
                        <h3 className="text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter">Summer Session Enrollment Is Open.</h3>
                    </div>

                    {/* Enrollment Video */}
                    <div className="w-full">
                        <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-3xl p-0.5 shadow-2xl">
                            <div className="bg-[#002270] rounded-[22px] overflow-hidden aspect-video relative border border-yellow-300/20 shadow-inner">
                                <video src="/dorm-week-vd.mp4" autoPlay loop muted controls playsInline className="w-full h-full object-cover" />
                                <div className="absolute top-4 left-4">
                                    <span className="text-[9px] font-black tracking-wider uppercase font-mono bg-yellow-400 text-blue-950 px-3 py-1 rounded shadow">Dean Ashley Welcome Video</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="bg-[#0033A0]/30 border border-yellow-400/30 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl">
                            <img src="/single-dorm-149.jpg" alt="Single Dorm Room $149" className="w-full h-auto object-contain" />
                            <div className="p-6 space-y-4">
                                <span className="bg-yellow-400/20 text-yellow-300 text-[8px] font-black uppercase px-2 py-0.5 rounded font-mono">Single Dorm Room&#x2122;</span>
                                <h4 className="text-xl font-black text-white uppercase italic">Freshman Coaching Track</h4>
                                <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                                    <div>
                                        <span className="text-2xl font-black text-white font-mono">$149</span>
                                        <span className="text-[8px] text-slate-400 uppercase tracking-wider block">signup + $99/mo tuition</span>
                                    </div>
                                    <button onClick={() => handleStripeCheckout('Single Dorm Room Tuition')} className="py-3 px-5 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-transform active:scale-95 shadow-md shadow-yellow-950/20">Reserve Single Dorm</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0033A0]/20 border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl">
                            <img src="/double-dorm-249.jpg" alt="Double Dorm Room $249" className="w-full h-auto object-contain" />
                            <div className="p-6 space-y-4">
                                <span className="bg-white/10 text-slate-300 text-[8px] font-black uppercase px-2 py-0.5 rounded font-mono">Double Dorm Room&#x2122;</span>
                                <h4 className="text-xl font-black text-white uppercase italic">Accountability Duo Track</h4>
                                <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                                    <div>
                                        <span className="text-2xl font-black text-white font-mono">$249</span>
                                        <span className="text-[8px] text-slate-400 uppercase tracking-wider block">signup + $149/mo tuition</span>
                                    </div>
                                    <button onClick={() => handleStripeCheckout('Double Dorm Room Tuition')} className="py-3 px-5 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-transform active:scale-95 shadow-md shadow-yellow-950/20">Reserve Double Dorm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DORM WEEK RUSH */}
                <div id="dorm-week" className="w-full space-y-8 pt-4 text-center">
                    <div>
                        <h3 className="text-4xl md:text-6xl font-black italic uppercase text-white tracking-tighter mt-1">
                            Welcome To <span className="text-yellow-400">Dorm Week Rush&#x2122;</span>
                        </h3>
                        <p className="text-sm md:text-base text-blue-100 font-light mt-3 max-w-2xl mx-auto">Credit U&#x2122; is coming, and you just unlocked your first step inside the financial university.</p>
                    </div>

                    {/* Dorm Week Welcome Video */}
                    <div className="w-full">
                        <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-3xl p-0.5 shadow-2xl">
                            <div className="bg-[#002270] rounded-[22px] overflow-hidden aspect-video relative border border-yellow-300/20 shadow-inner">
                                <video src="/enrollment-vd.mp4" autoPlay loop muted controls playsInline className="w-full h-full object-cover" />
                                <div className="absolute top-4 left-4">
                                    <span className="text-[9px] font-black tracking-wider uppercase font-mono bg-yellow-400 text-blue-950 px-3 py-1 rounded shadow">Enrollment Overview</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 text-left">
                        <span className="text-[8px] font-mono uppercase bg-yellow-400/25 text-yellow-300 px-2 py-0.5 rounded font-bold">Orientation Roadmap</span>
                        <h4 className="font-bold text-sm text-white uppercase">Your 7-Day Experience Preview:</h4>
                        <div className="space-y-2">
                            {[
                                { day: 1, name: 'Move-In Pass', desc: 'Secure your initial dashboard credentials.' },
                                { day: 2, name: 'Credit Reality Check Sheet', desc: 'Map out your FICO score variables.' },
                                { day: 3, name: 'Score DNA Snapshot', desc: 'Audit violations and negative details.' },
                                { day: 4, name: 'Utilization Game Day Tracker', desc: 'Plan balance limits and payment patterns.' },
                                { day: 5, name: 'Denied Files Decoder', desc: 'Identify incorrect letters and codes.' },
                                { day: 6, name: '30-Day Credit U Reset Plan', desc: 'Generate your factual audit envelopes.' },
                                { day: 7, name: 'Dorm Week Acceptance Letter', desc: 'Unlock your graduating student profile.' }
                            ].map((item) => (
                                <div key={item.day} className="flex gap-3 text-xs bg-black/20 p-2.5 rounded-xl border border-white/5">
                                    <span className="text-yellow-400 font-black font-mono">D{item.day}</span>
                                    <div>
                                        <h5 className="font-bold text-white uppercase text-[10px] leading-tight">{item.name}</h5>
                                        <p className="text-[9px] text-slate-400 font-light leading-relaxed mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 text-center">
                            <button onClick={() => scrollToSection('waitlist')} className="w-full max-w-sm py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-all duration-300 shadow-md shadow-yellow-950/20">Reserve My Dorm Room</button>
                        </div>
                    </div>
                </div>

                {/* WAITLIST FORM */}
                <div id="waitlist" className="max-w-xl mx-auto text-center space-y-8 pt-4">
                    <div>
                        <h3 className="text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter">Join The Credit U&#x2122; Waitlist.</h3>
                    </div>
                    <div className="bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl text-left">
                        {formSubmitted ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl border border-emerald-500/30">&#x2714;</div>
                                <h4 className="text-lg font-black uppercase text-white italic">Waitlist Registered!</h4>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">Thank you! Your Founding Student placeholder has been registered. Stand by for Dorm Week updates.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-blue-200">First Name</label>
                                        <input type="text" required value={waitlistForm.firstName} onChange={e => setWaitlistForm({ ...waitlistForm, firstName: e.target.value })} placeholder="Enter first name" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/80 transition-colors" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Phone Number</label>
                                        <input type="tel" required value={waitlistForm.phone} onChange={e => setWaitlistForm({ ...waitlistForm, phone: e.target.value })} placeholder="(555) 555-5555" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/80 transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Email Address</label>
                                    <input type="email" required value={waitlistForm.email} onChange={e => setWaitlistForm({ ...waitlistForm, email: e.target.value })} placeholder="you@example.com" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/80 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Main Credit Goal</label>
                                    <input type="text" required value={waitlistForm.creditGoal} onChange={e => setWaitlistForm({ ...waitlistForm, creditGoal: e.target.value })} placeholder="e.g. Buying a home, getting a business line" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/80 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Biggest Credit Challenge</label>
                                    <select value={waitlistForm.creditChallenge} onChange={e => setWaitlistForm({ ...waitlistForm, creditChallenge: e.target.value })} className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-yellow-400/80 transition-colors">
                                        <option value="" disabled>Select your primary challenge</option>
                                        <option value="Late Payments">Late Payments / Charge-offs</option>
                                        <option value="Collection Accounts">Collection Accounts</option>
                                        <option value="Inquiries">Too many inquiries</option>
                                        <option value="Thin File">No credit history (Thin File)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Interested In</label>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {['Waitlist Only', 'Transcript Review', 'Work With Credit U Dean', 'Dorm Week Rush'].map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setWaitlistForm({ ...waitlistForm, interestType: opt })}
                                                className={`p-2.5 text-[9px] font-bold rounded-xl border transition-all text-center leading-tight uppercase ${waitlistForm.interestType === opt ? 'bg-yellow-400 border-yellow-500 text-blue-950 shadow-md shadow-yellow-950/20' : 'bg-black/20 border-white/5 text-white hover:bg-white/10'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-4 mt-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-widest transition-transform active:scale-95 shadow-lg shadow-yellow-950/20">Join Waitlist</button>
                            </form>
                        )}
                    </div>
                </div>

                {/* PRICING BOARD */}
                <div className="max-w-4xl mx-auto space-y-8 pt-4 text-center">
                    <div>
                        <h3 className="text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter">Founding Student Pricing Board</h3>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-left max-w-2xl mx-auto">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="flex justify-between items-center border-b border-white/15 pb-4 mb-4 font-mono text-[9px] text-slate-400 uppercase tracking-widest font-black">
                            <span>Program Type</span>
                            <span className="text-yellow-400">Summer Tuition Rate</span>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Waitlist Membership', price: 'FREE', type: 'Launch Alert Only' },
                                { name: 'Single Transcript Review', price: '$49', type: 'Single payment' },
                                { name: 'Double Transcript Review', price: '$69', type: 'Single payment' },
                                { name: 'Single Dorm Room Program', price: '$149 signup + $99/mo', type: 'Personal Coaching' },
                                { name: 'Double Dorm Room Program', price: '$249 signup + $149/mo', type: 'Duo Coaching' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded-xl transition-colors">
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.name}</h4>
                                        <span className="text-[8px] text-slate-400 uppercase tracking-widest font-light font-mono mt-0.5 block">{item.type}</span>
                                    </div>
                                    <span className="text-sm font-black font-mono text-yellow-400">{item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6 text-center">
                            <button onClick={() => scrollToSection('waitlist')} className="py-3.5 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-all duration-300 shadow-md shadow-yellow-950/20">Choose My Starting Point</button>
                        </div>
                    </div>
                </div>

                {/* ABOUT DEAN ASHLEY */}
                <div id="about-dean" className="bg-[#0033A0]/20 border border-white/10 p-8 rounded-3xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
                    <div className="md:col-span-5 order-2 md:order-1 flex flex-col items-center space-y-4 w-full">
                        <img src="/spend-dat-different.png" alt="Dean Ashley Coach" className="w-full h-auto object-contain rounded-2xl border border-yellow-400/20 shadow-md" />
                        
                        {/* FALL SEMESTER 2026 SCHEDULE */}
                        <div className="w-full bg-[#001b57] border border-yellow-400/30 rounded-2xl p-5 space-y-4 font-sans text-xs">
                            <div className="border-b border-yellow-400/20 pb-2">
                                <h4 className="font-black italic uppercase text-yellow-400 text-sm tracking-tight">🍂 FALL SEMESTER 2026</h4>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">FALL 2026 FRESHMAN CLASS</p>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-300">Early Acceptance Period</span>
                                    <span className="font-bold text-white">September 1–10</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-300">Priority Enrollment</span>
                                    <span className="font-bold text-white">September 11–20</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-300">Fall Rush Week™</span>
                                    <span className="font-bold text-yellow-300">September 21–27</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-300">Classes Begin</span>
                                    <span className="font-bold text-emerald-400">October 1</span>
                                </div>
                                <div className="flex justify-between text-red-400">
                                    <span>Enrollment Closes</span>
                                    <span className="font-black">October 10</span>
                                </div>
                                <p className="text-[9px] text-red-400 font-mono text-center pt-0.5 font-bold uppercase tracking-wider">
                                    Doors close. No exceptions. Waitlist opens.
                                </p>
                            </div>

                            <div className="bg-[#002270] rounded-xl p-3 border border-white/5 space-y-1.5">
                                <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest font-mono">Activities</span>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {['Move In Day', 'Student ID Reveal', 'Financial Aid Week', 'Credit Report Lab', 'Budget Bootcamp', 'Dorm Challenges', 'Live Q&A', 'Moo Points™'].map((act) => (
                                        <span key={act} className="text-[8px] font-bold bg-white/5 text-slate-300 px-2 py-0.5 rounded uppercase font-mono">
                                            {act}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* DORM WEEK RUSH INFO */}
                            <div className="bg-yellow-400/10 border-l-2 border-yellow-400 rounded-xl p-3 space-y-1">
                                <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest block font-mono">Dorm Week Rush™</span>
                                <p className="text-[9px] text-white font-bold">July 14, 2026 – July 20, 2026</p>
                                <p className="text-[9px] text-blue-200 font-light leading-relaxed">
                                    Receive 7 Exclusive Private Onboarding Days before Credit U officially opens.
                                </p>
                                <p className="text-[9px] text-yellow-300 font-bold leading-normal pt-1.5 uppercase tracking-wide">
                                    ⚠ Note: Must complete any form and receive information to activate the Spin Wheel.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-7 order-1 md:order-2 space-y-4">
                        <h3 className="text-3xl md:text-5xl font-black italic uppercase text-white tracking-tight">Meet Credit U Dean Ashley.</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[10px] text-slate-300 font-light">
                            <div className="flex gap-2"><span className="text-yellow-400">&#x2714;</span><span>12+ years financial guidance</span></div>
                            <div className="flex gap-2"><span className="text-yellow-400">&#x2714;</span><span>487+ families supported</span></div>
                            <div className="flex gap-2"><span className="text-yellow-400">&#x2714;</span><span>Mission 800&#x2122; FICO target</span></div>
                            <div className="flex gap-2"><span className="text-yellow-400">&#x2714;</span><span>Faith &amp; structure execution</span></div>
                        </div>
                        <button onClick={() => scrollToSection('summer-session')} className="py-3 px-5 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-all duration-300">Work With Credit U Dean</button>
                    </div>
                </div>

                {/* FINAL CTA */}
                <div className="relative rounded-3xl overflow-hidden max-w-4xl mx-auto h-64 border border-yellow-400/30 shadow-2xl flex flex-col justify-center items-center text-center p-8">
                    <img src="/dormweek-campus.png" alt="Dorm Week Rush Campus" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-blue-950/85 mix-blend-multiply" />
                    <div className="relative z-10 space-y-4">
                        <h3 className="text-3xl md:text-4xl font-black italic uppercase text-white">It Starts With U&#x2122;.</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            <button onClick={() => scrollToSection('waitlist')} className="inline-flex items-center justify-center gap-2 rounded-xl font-black transition-all bg-yellow-400 hover:bg-yellow-300 text-blue-900 text-xs uppercase py-3 px-5">Join Waitlist</button>
                            <button onClick={() => scrollToSection('transcript')} className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all border border-white/20 hover:bg-white/10 text-white text-xs uppercase py-3 px-5">Get Transcript Review</button>
                            <button onClick={() => scrollToSection('summer-session')} className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all border border-yellow-400/30 hover:border-yellow-400 text-yellow-300 text-xs uppercase py-3 px-5">Reserve My Dorm</button>
                        </div>
                    </div>
                </div>

                {/* CAMPUS ENHANCEMENTS */}
                <CampusEnhancementWrapper />

            </div>

            {/* STICKY MOBILE CTA BAR */}
            <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-[#001b57]/95 backdrop-blur-md border-t border-yellow-500/20 py-3 px-4 flex justify-between gap-2.5 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
                <button onClick={() => scrollToSection('waitlist')} className="flex-1 py-3 bg-yellow-400 text-blue-950 font-black text-[9px] uppercase tracking-wider rounded-xl transition-all text-center leading-none">Join Waitlist</button>
                <button onClick={() => scrollToSection('transcript')} className="flex-1 py-3 bg-white/10 text-white border border-white/15 font-bold text-[9px] uppercase tracking-wider rounded-xl transition-all text-center leading-none">Transcript Review</button>
                <button onClick={() => scrollToSection('summer-session')} className="flex-1 py-3 bg-blue-900 text-yellow-300 border border-yellow-400/20 font-bold text-[9px] uppercase tracking-wider rounded-xl transition-all text-center leading-none">Reserve Dorm</button>
            </div>
        </div>
    );
}
