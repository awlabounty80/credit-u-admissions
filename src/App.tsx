// @ts-ignore
import confetti from 'canvas-confetti';
import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdmissionsLayout from './components/AdmissionsLayout';
import Home from './pages/Home';
import Apply from './pages/Apply';
import Results from './pages/Results';
import Spin from './pages/Spin';
import Transcript from './pages/Transcript';
import DormWeek from './pages/DormWeek';
import Join from './pages/Join';
import ThankYou from './pages/ThankYou';
import Admin from './pages/Admin';
import DormWeekRush from './pages/DormWeekRush';
import FreeAssessmentPage from './pages/FreeAssessmentPage';
import FreeAssessmentLandingPage from './pages/FreeAssessmentLandingPage';
import AdmissionsFlowPage from './pages/AdmissionsFlowPage';
import CampusBuildingPage from './pages/CampusBuildingPage';

export default function App() {
    const [isRinging, setIsRinging] = useState(false);
    const ringTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const playLoudSchoolBell = () => {
            try {
                const audio = new Audio('/school-bell.mp4');
                audio.volume = 0.85;
                audio.play().catch((err) => console.warn('Audio playback failed:', err));
            } catch (err) {
                console.warn('AudioContext school bell failed:', err);
            }
        };

        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable = target.closest('button') || target.closest('a') || target.closest('[role="button"]');
            if (isClickable) {
                // Do not ring bell or trigger confetti on assessment/application paths
                const path = window.location.pathname;
                if (path.includes('/free-assessment') || path.includes('/apply')) {
                    return;
                }

                // Clear any existing timeout
                if (ringTimeoutRef.current) {
                    window.clearTimeout(ringTimeoutRef.current);
                }

                playLoudSchoolBell();
                setIsRinging(true);

                // Fire massive confetti bursts
                try {
                    // Left Cannon
                    confetti({
                        particleCount: 50,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0, y: 0.8 },
                        colors: ['#0033A0', '#FDB515', '#ffffff', '#001A50']
                    });
                    // Right Cannon
                    confetti({
                        particleCount: 50,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1, y: 0.8 },
                        colors: ['#0033A0', '#FDB515', '#ffffff', '#001A50']
                    });
                    // Central Burst
                    confetti({
                        particleCount: 60,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#0033A0', '#FDB515', '#ffffff', '#001A50']
                    });
                } catch (confettiErr) {
                    console.warn('Confetti burst failed:', confettiErr);
                }

                // Hide bell after 1.6 seconds
                ringTimeoutRef.current = window.setTimeout(() => {
                    setIsRinging(false);
                }, 1600);
            }
        };

        window.addEventListener('click', handleGlobalClick);
        return () => {
            window.removeEventListener('click', handleGlobalClick);
            if (ringTimeoutRef.current) {
                window.clearTimeout(ringTimeoutRef.current);
            }
        };
    }, []);

    return (
        <Router>
            <AdmissionsLayout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/apply" element={<Apply />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/spin" element={<Spin />} />
                    <Route path="/transcript" element={<Transcript />} />
                    <Route path="/dormweek" element={<DormWeek />} />
                    <Route path="/join" element={<Join />} />
                    <Route path="/thankyou" element={<ThankYou />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/dorm-week-rush" element={<DormWeekRush />} />
                    <Route path="/free-assessment" element={<FreeAssessmentLandingPage />} />
                    <Route path="/free-assessment/start" element={<FreeAssessmentPage />} />
                    <Route path="/admissions-flow" element={<AdmissionsFlowPage />} />
                    <Route path="/admissions" element={<AdmissionsFlowPage />} />
                    <Route path="/campus" element={<CampusBuildingPage />} />
                    <Route path="/registrar" element={<CampusBuildingPage />} />
                    <Route path="/financial-lab" element={<CampusBuildingPage />} />
                    <Route path="/library" element={<CampusBuildingPage />} />
                    <Route path="/student-union" element={<CampusBuildingPage />} />
                    <Route path="/mission-800" element={<CampusBuildingPage />} />
                    <Route path="/graduation-hall" element={<CampusBuildingPage />} />
                    <Route path="/business-school" element={<CampusBuildingPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {/* Glowing, Shaking, Pulsing Golden Bell Overlay */}
                {isRinging && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex flex-col items-center select-none">
                        <div 
                            className="bg-[#002270]/90 backdrop-blur-md border-4 border-yellow-400 p-6 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(253,181,21,0.6)]"
                            style={{
                                animation: 'bell-shake 0.12s infinite, bell-glow 0.3s infinite alternate'
                            }}
                        >
                            <span className="text-5xl">🔔</span>
                        </div>
                        <span className="text-[10px] font-black tracking-[0.2.em] text-yellow-400 bg-blue-950/80 border border-yellow-400/20 px-3 py-1 rounded-full mt-3 uppercase font-mono shadow-lg animate-pulse">
                            RUSHING DORM WEEK...
                        </span>
                    </div>
                )}

                {/* Bell Shake and Glow CSS Styles */}
                <style>{`
                    @keyframes bell-shake {
                        0%, 100% { transform: rotate(0) scale(1.1); }
                        25% { transform: rotate(15deg) scale(1.1); }
                        75% { transform: rotate(-15deg) scale(1.1); }
                    }
                    @keyframes bell-glow {
                        0% { box-shadow: 0 0 15px rgba(253,181,21,0.3); }
                        100% { box-shadow: 0 0 45px rgba(253,181,21,0.95); }
                    }
                `}</style>
            </AdmissionsLayout>
        </Router>
    );
}
