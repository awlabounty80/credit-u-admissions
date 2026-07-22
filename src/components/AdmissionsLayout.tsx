import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, GraduationCap, ArrowRight, Download, X, Share, Menu } from 'lucide-react';
import FloatingMotes from './FloatingMotes';

interface LayoutProps {
    children: React.ReactNode;
}

export default function AdmissionsLayout({ children }: LayoutProps) {
    const location = useLocation();
    const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'disclosures' | null>(null);
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [showIOSGuide, setShowIOSGuide] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowIOSGuide(true);
            return;
        }
        if (!installPrompt) {
            alert('To install the app, tap your browser menu and select "Install App" or "Add to Home Screen".');
            return;
        }
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            setInstallPrompt(null);
        }
    };

    // Check active page to display/hide headers or highlight links
    const isHome = location.pathname === '/';
    const isApply = location.pathname === '/apply';
    const isResults = location.pathname === '/results';
    const isSpin = location.pathname === '/spin';
    const isTranscript = location.pathname === '/transcript';
    const isDormWeek = location.pathname === '/dormweek';
    const isJoin = location.pathname === '/join';
    const isAdmin = location.pathname === '/admin';

    return (
        <div className="min-h-screen bg-[#002270] text-white flex flex-col font-sans selection:bg-yellow-400 selection:text-blue-900 relative overflow-hidden">
            {/* Global background floating currency motes */}
            <FloatingMotes />
            {/* Sticky Announcement Bar */}
            <div className="w-full bg-[#001b57] border-b border-yellow-500/20 py-2.5 px-4 text-center z-50 sticky top-0 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-wider text-yellow-350">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse flex-shrink-0" />
                    <span>Before Credit U Dorms open July 28th — Join now for only $39 + $39 tuition fee.</span>
                </div>
            </div>

            {/* Header Navbar */}
            <header className="w-full bg-[#0033A0] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-[38px] z-40 shadow-md">
                <Link to="/" className="flex items-center gap-3 select-none">
                    <span className="bg-yellow-400 text-blue-950 p-2 rounded-xl font-black text-lg shadow-md shadow-black/10">🎓</span>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-white uppercase italic leading-none">Credit U Admissions™</h1>
                        <p className="text-[8px] text-yellow-300 font-mono tracking-widest uppercase mt-1">Enrollment Engine OS</p>
                    </div>
                </Link>

                <nav className="hidden xl:flex items-center gap-5 text-[10px] font-black uppercase tracking-wider text-slate-300">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <Link to="/free-assessment" className="text-yellow-400 hover:text-yellow-300 transition-colors">Free Assessment™</Link>
                    <a href="#transcript" onClick={(e) => { if (isHome) { e.preventDefault(); document.getElementById('transcript')?.scrollIntoView({ behavior: 'smooth' }); } }} className="hover:text-white transition-colors">Transcript Review</a>
                    <a href="#summer-session" onClick={(e) => { if (isHome) { e.preventDefault(); document.getElementById('summer-session')?.scrollIntoView({ behavior: 'smooth' }); } }} className="hover:text-white transition-colors">Summer Session</a>
                    <a href="#dorm-week" onClick={(e) => { if (isHome) { e.preventDefault(); document.getElementById('dorm-week')?.scrollIntoView({ behavior: 'smooth' }); } }} className="hover:text-white transition-colors">Dorm Week Rush</a>
                    <a href="#waitlist" onClick={(e) => { if (isHome) { e.preventDefault(); document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }); } }} className="hover:text-white transition-colors">Waitlist</a>
                    <a href="#about-dean" onClick={(e) => { if (isHome) { e.preventDefault(); document.getElementById('about-dean')?.scrollIntoView({ behavior: 'smooth' }); } }} className="hover:text-white transition-colors">About Dean Ashley</a>
                </nav>

                <div className="flex items-center gap-3">
                    {!isStandalone && (
                        <button 
                            type="button"
                            onClick={handleInstallClick}
                            className="inline-flex items-center justify-center gap-1 rounded-xl font-bold transition-all bg-[#001b57] hover:bg-[#001b57]/80 text-yellow-400 border border-yellow-400/20 shadow-md text-xs uppercase py-2.5 px-4 h-9"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Download App</span>
                            <span className="sm:hidden">App</span>
                        </button>
                    )}
                    {!isApply && !isResults && !isAdmin && (
                        <Link to="/apply">
                            <button className="inline-flex items-center justify-center gap-1 rounded-xl font-bold transition-all bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-md shadow-yellow-950/20 text-xs uppercase py-2.5 px-4 h-9">
                                Apply
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </Link>
                    )}
                    <button 
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="xl:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all focus:outline-none"
                        aria-label="Toggle Mobile Menu"
                    >
                        {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="xl:hidden fixed inset-0 z-30 bg-blue-950/95 backdrop-blur-md pt-[98px] flex flex-col p-6 animate-fadeIn">
                    <nav className="flex flex-col gap-6 text-xs font-black uppercase tracking-wider text-slate-300 mt-8">
                        <Link 
                            to="/" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="hover:text-white transition-colors py-2 border-b border-white/5"
                        >
                            Home
                        </Link>
                        <Link 
                            to="/free-assessment" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors py-2 border-b border-yellow-400/10"
                        >
                            Free Assessment™
                        </Link>
                        <a 
                            href="#transcript" 
                            onClick={(e) => { 
                                setIsMobileMenuOpen(false);
                                if (isHome) { 
                                    e.preventDefault(); 
                                    document.getElementById('transcript')?.scrollIntoView({ behavior: 'smooth' }); 
                                } 
                            }} 
                            className="hover:text-white transition-colors py-2 border-b border-white/5"
                        >
                            Transcript Review
                        </a>
                        <a 
                            href="#summer-session" 
                            onClick={(e) => { 
                                setIsMobileMenuOpen(false);
                                if (isHome) { 
                                    e.preventDefault(); 
                                    document.getElementById('summer-session')?.scrollIntoView({ behavior: 'smooth' }); 
                                } 
                            }} 
                            className="hover:text-white transition-colors py-2 border-b border-white/5"
                        >
                            Summer Session
                        </a>
                        <a 
                            href="#dorm-week" 
                            onClick={(e) => { 
                                setIsMobileMenuOpen(false);
                                if (isHome) { 
                                    e.preventDefault(); 
                                    document.getElementById('dorm-week')?.scrollIntoView({ behavior: 'smooth' }); 
                                } 
                            }} 
                            className="hover:text-white transition-colors py-2 border-b border-white/5"
                        >
                            Dorm Week Rush
                        </a>
                        <a 
                            href="#waitlist" 
                            onClick={(e) => { 
                                setIsMobileMenuOpen(false);
                                if (isHome) { 
                                    e.preventDefault(); 
                                    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }); 
                                } 
                            }} 
                            className="hover:text-white transition-colors py-2 border-b border-white/5"
                        >
                            Waitlist
                        </a>
                        <a 
                            href="#about-dean" 
                            onClick={(e) => { 
                                setIsMobileMenuOpen(false);
                                if (isHome) { 
                                    e.preventDefault(); 
                                    document.getElementById('about-dean')?.scrollIntoView({ behavior: 'smooth' }); 
                                } 
                            }} 
                            className="hover:text-white transition-colors py-2 border-b border-white/5"
                        >
                            About Dean Ashley
                        </a>
                    </nav>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
                {children}
            </main>

            {/* Global Footer */}
            <footer className="w-full bg-[#001b57] border-t border-white/5 py-8 text-center text-xs text-slate-400 space-y-2 mt-auto">
                <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300">
                        Summer Semester Registration Active — Classes Close July 31
                    </span>
                </div>
                <p className="font-light">
                    © 2026 Credit U Admissions. All rights reserved. This is a standalone enrollment campaign portal.
                </p>
                <div className="flex justify-center gap-4 text-[10px] font-semibold text-slate-500 uppercase mt-2">
                    <button onClick={() => setActiveModal('privacy')} className="hover:underline focus:outline-none uppercase">Privacy Policy</button>
                    <span>•</span>
                    <button onClick={() => setActiveModal('terms')} className="hover:underline focus:outline-none uppercase">Terms of Service</button>
                    <span>•</span>
                    <button onClick={() => setActiveModal('disclosures')} className="hover:underline focus:outline-none uppercase">Admissions Disclosures</button>
                    <span>•</span>
                    <Link to="/admin" className="hover:underline uppercase text-slate-500 font-semibold text-[10px]">Dean Dashboard</Link>
                </div>
            </footer>

            {/* Modal Dialog for Policies */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/85 backdrop-blur-sm">
                    <div className="bg-[#002270] border border-yellow-400/35 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] flex flex-col justify-between shadow-2xl relative text-left">
                        
                        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                            <h3 className="text-xl md:text-2xl font-black italic uppercase text-white tracking-tight">
                                {activeModal === 'privacy' && 'Privacy Policy'}
                                {activeModal === 'terms' && 'Terms of Service'}
                                {activeModal === 'disclosures' && 'Admissions Disclosures'}
                            </h3>
                            <button 
                                onClick={() => setActiveModal(null)}
                                className="text-slate-400 hover:text-white font-bold text-xl px-2 py-1 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs text-blue-100 font-light leading-relaxed max-h-[50vh] scrollbar-thin scrollbar-thumb-yellow-400/20">
                            {activeModal === 'privacy' && (
                                <>
                                    <p className="font-bold text-yellow-400">Last Updated: July 2026</p>
                                    <h4 className="font-bold text-white uppercase mt-4">1. Information Collection</h4>
                                    <p>Credit U™ collects student-provided data such as names, emails, phone numbers, state of residence, and self-reported financial indicators (estimated credit ranges, income levels, and credit obstacles) during waitlist enrollment and admissions evaluations.</p>
                                    <h4 className="font-bold text-white uppercase mt-4">2. Use of Information</h4>
                                    <p>We use this information exclusively to process your admissions assessment, determine housing assignments inside our virtual dorms, deliver won study templates, and send cohort notifications.</p>
                                    <h4 className="font-bold text-white uppercase mt-4">3. Data Security & Storage</h4>
                                    <p>Your assessment answers are saved locally in your browser's local storage for custom dashboard rendering. Any information sent to Credit U™ is transmitted using industry-standard SSL encryption. We do not sell, lease, or distribute student records to third-party advertisers or credit bureaus.</p>
                                    <h4 className="font-bold text-white uppercase mt-4">4. Payment Processing</h4>
                                    <p>All tuition fees and digital workbook purchases are securely routed through Stripe. Credit U™ does not store or see credit card credentials.</p>
                                </>
                            )}

                            {activeModal === 'terms' && (
                                <>
                                    <p className="font-bold text-yellow-400">Last Updated: July 2026</p>
                                    <h4 className="font-bold text-white uppercase mt-4">1. Nature of Services</h4>
                                    <p>Credit University AI™ (Credit U™) provides financial literacy coaching, group review modules, and structured study templates. All courses, worksheets, and resources are designed for educational purposes only.</p>
                                    <h4 className="font-bold text-white uppercase mt-4">2. Admissions Disclaimers</h4>
                                    <p>Credit U™ is not a credit repair organization. We do not represent you in front of credit bureaus, request deletion of accurate historical items, or guarantee specific credit score outcomes. Your score improvement depends on your individual effort, budget accountability, and following the curriculum.</p>
                                    <h4 className="font-bold text-white uppercase mt-4">3. Tuition & Refund Policy</h4>
                                    <p>Single Transcript reviews, Double reviews, and Workbook purchases are instant digital downloads and are non-refundable. Dorm tuition subscription payments are charged monthly and can be cancelled at any time inside the student portal.</p>
                                    <h4 className="font-bold text-white uppercase mt-4">4. Acceptable Use</h4>
                                    <p>Students agree to provide honest information on their admissions forms and to use custom checklists solely for personal development.</p>
                                </>
                            )}

                            {activeModal === 'disclosures' && (
                                <>
                                    <p className="font-bold text-yellow-400">Official Credit U™ Admissions Disclosures</p>
                                    <h4 className="font-bold text-white uppercase mt-4">1. Not a Credit Bureau or Repair Firm</h4>
                                    <p>Credit University AI™ does not repair credit, dispute items on your behalf, or charge fees to clean credit reports. We are an educational academy that teaches students how to self-manage credit and dispute records independently.</p>
                                    <h4 className="font-bold text-white uppercase mt-4">2. GPA & Score Simulations</h4>
                                    <p>All credit score estimations, grading brackets, and Financial GPA™ metrics shown on our results screens are educational simulations based on user input. They do not constitute official credit bureau pulls or soft inquiries.</p>
                                    <h4 className="font-bold text-white uppercase mt-4">3. Mission 800™ Framework</h4>
                                    <p>Mission 800™ is our academy target framework designed to teach students best practices in utilization tracking, account structuring, and inquiry management. It is not a financial guarantee of score performance.</p>
                                </>
                            )}
                        </div>

                        <div className="pt-6 border-t border-white/10 mt-4 flex justify-end">
                            <button 
                                onClick={() => setActiveModal(null)}
                                className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black text-xs uppercase rounded-xl transition-all shadow-md"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* iOS PWA Installation Guide Modal */}
            {showIOSGuide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                    <div className="bg-[#001a4d] border-4 border-yellow-400 rounded-3xl p-6 max-w-sm w-full space-y-6 text-center shadow-2xl relative">
                        <button
                            type="button"
                            onClick={() => setShowIOSGuide(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="space-y-2">
                            <span className="text-3xl">📲</span>
                            <h3 className="text-lg font-black uppercase text-white font-mono">Install Credit U App</h3>
                            <p className="text-[11px] text-slate-400">Add the Admissions Portal directly to your iPhone home screen for instant access.</p>
                        </div>

                        <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 text-left text-xs space-y-4 font-mono">
                            <div className="flex items-start gap-3">
                                <span className="bg-yellow-400 text-blue-950 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                                <p className="text-slate-300">Tap the <span className="inline-flex items-center text-yellow-350"><Share className="w-3.5 h-3.5 mx-1 inline" /> Share button</span> at the bottom of Safari.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-yellow-400 text-blue-950 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                                <p className="text-slate-300">Scroll down the menu list and tap <span className="text-yellow-350">"Add to Home Screen"</span>.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-yellow-400 text-blue-950 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                                <p className="text-slate-300">Tap <span className="text-yellow-350">"Add"</span> in the top-right corner to complete installation.</p>
                            </div>
                        </div>

                        <button 
                            type="button"
                            onClick={() => setShowIOSGuide(false)}
                            className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-all shadow-md"
                        >
                            Got It 👍
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
