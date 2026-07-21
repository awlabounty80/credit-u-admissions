import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Award, ShieldAlert, ArrowRight, Zap, Sparkles, Volume2, VolumeX, CheckCircle, 
    FileText, Download, User, Calendar, Trophy, GraduationCap, Flame, Star, 
    Play, Pause, Compass, CompassIcon, AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import FloatingMotes from '../components/FloatingMotes';

export default function DormWeek() {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);

    // Audio & Video states
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [announcerIndex, setAnnouncerIndex] = useState(0);
    const [showProfileModal, setShowProfileModal] = useState(false);

    // Local Storage / Funnel State
    let studentName = 'Honored Student';
    const rawStudent = localStorage.getItem('cu_funnel_current_student');
    if (rawStudent) {
        try {
            if (rawStudent.trim().startsWith('{')) {
                const parsed = JSON.parse(rawStudent);
                if (parsed.firstName && parsed.lastName) {
                    studentName = `${parsed.firstName} ${parsed.lastName}`;
                } else if (parsed.fullName) {
                    studentName = parsed.fullName;
                } else if (parsed.firstName) {
                    studentName = parsed.firstName;
                } else {
                    studentName = 'Honored Student';
                }
            } else {
                studentName = rawStudent;
            }
        } catch (e) {
            studentName = rawStudent;
        }
    } else {
        const stored = localStorage.getItem('cu_current_submission');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.formData && parsed.formData.fullName) {
                    studentName = parsed.formData.fullName;
                }
            } catch (e) {}
        }
    }
    const wonPrizeNum = Number(localStorage.getItem('cu_funnel_wheel_prize')) || 4;
    const wonPrizeLabel = localStorage.getItem('cu_funnel_wheel_prize_label') || 'Credit Strategy Planner (Form #4)';

    // Checklist interactive states
    const [checklist, setChecklist] = useState({
        joinedWaitlist: true,
        completedExam: true,
        spunWheel: true,
        claimedReward: true,
        watchWelcome: false,
        getReview: false,
        reserveDorm: false,
        completeDormWeek: false,
        activateMission800: false
    });

    const calculateTimeLeft = () => {
        const targetDate = new Date('2026-07-28T00:00:00').getTime();
        const diff = targetDate - Date.now();
        if (diff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    // Announcer Quotes
    const announcerLines = [
        "Ladies and gentlemen...",
        "Future homeowners...",
        "Future entrepreneurs...",
        "Future legacy builders...",
        "Welcome to Credit University AI.",
        "Welcome to Credit U."
    ];

    useEffect(() => {
        // Trigger congratulations confetti on load
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.25 }
        });

        // Rotate announcer lines automatically
        const announcerInterval = setInterval(() => {
            setAnnouncerIndex(prev => (prev + 1) % announcerLines.length);
        }, 3200);

        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => {
            clearInterval(announcerInterval);
            clearInterval(interval);
        };
    }, []);

    // Web Audio Synthesizer for HBCU band orientation experience
    const playHBCUSound = (type: 'cheer' | 'bell' | 'drum' | 'whistle' | 'success') => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const now = ctx.currentTime;
            
            if (type === 'bell') {
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(880, now);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(883, now);
                
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
                
                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(ctx.destination);
                
                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 1.2);
                osc2.stop(now + 1.2);
            } else if (type === 'whistle') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(950, now);
                osc.frequency.linearRampToValueAtTime(1020, now + 0.1);
                osc.frequency.linearRampToValueAtTime(950, now + 0.25);
                
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(now);
                osc.stop(now + 0.35);
            } else if (type === 'drum') {
                // Snare Drum simulation
                const bufferSize = ctx.sampleRate * 0.35;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                
                const noise = ctx.createBufferSource();
                noise.buffer = buffer;
                
                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(1000, now);
                filter.Q.setValueAtTime(3, now);
                
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.22, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                
                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                
                noise.start(now);
                noise.stop(now + 0.35);
            } else if (type === 'success') {
                const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
                notes.forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.1);
                    gain.gain.setValueAtTime(0.15, now + idx * 0.1);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.5);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + idx * 0.1);
                    osc.stop(now + idx * 0.1 + 0.5);
                });
            } else {
                // Stadium crowd cheer approximation
                const bufferSize = ctx.sampleRate * 1.2;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = ctx.createBufferSource();
                noise.buffer = buffer;
                
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(350, now);
                filter.frequency.exponentialRampToValueAtTime(750, now + 0.25);
                filter.frequency.exponentialRampToValueAtTime(320, now + 1.0);
                
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.linearRampToValueAtTime(0.22, now + 0.15);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
                
                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                
                noise.start(now);
                noise.stop(now + 1.2);
            }
        } catch (e) {
            console.error('AudioContext blocked:', e);
        }
    };

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play().then(() => {
                    setIsPlaying(true);
                    setChecklist(prev => ({ ...prev, watchWelcome: true }));
                    playHBCUSound('whistle');
                });
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

    // --- PDF builders for Section 3 Acceptance letter and Student ID ---
    const generateAcceptanceLetterPDF = () => {
        playHBCUSound('success');
        const lines = [
            '%PDF-1.4',
            '1 0 obj',
            '<< /Type /Catalog /Pages 2 0 R >>',
            'endobj',
            '2 0 obj',
            '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            'endobj',
            '3 0 obj',
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
            'endobj',
            '4 0 obj',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
            'endobj',
            '5 0 obj',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
            'endobj',
            '6 0 obj'
        ];

        let contentStream = '';
        contentStream += 'q 0.00 0.20 0.63 rg 20 750 555 60 re f Q\n'; 
        contentStream += 'q 0.99 0.71 0.08 RG 3 w 15 15 565 812 re S Q\n'; 
        
        contentStream += 'BT\n';
        contentStream += '/F1 22 Tf 1 1 1 rg 1 0 0 1 40 775 Tm (CREDIT UNIVERSITY AI) Tj\n';
        contentStream += '/F2 10 Tf 0.99 0.71 0.08 rg 1 0 0 1 40 758 Tm (OFFICIAL LETTER OF ADMISSION) Tj\n';
        contentStream += '/F1 16 Tf 0.07 0.1 0.22 rg 1 0 0 1 40 700 Tm (Dear ' + studentName.toUpperCase() + ',) Tj\n';
        contentStream += '/F2 11 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 670 Tm (CONGRATULATIONS! It is our distinct honor to welcome you to the founding class of Credit U.) Tj\n';
        contentStream += '/F2 11 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 650 Tm (You have successfully passed the Entrance Exam and verified your student credentials.) Tj\n';
        contentStream += '/F2 11 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 630 Tm (Your admission unlocks priority access to our Mission 800 blueprint protocols.) Tj\n';
        
        contentStream += '/F1 12 Tf 0.00 0.20 0.63 rg 1 0 0 1 40 580 Tm (YOUR INITIATION CREDENTIALS:) Tj\n';
        contentStream += '/F2 11 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 560 Tm (- Student Name: ' + studentName + ') Tj\n';
        contentStream += '/F2 11 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 540 Tm (- Admissions Tier: Founding Student Class) Tj\n';
        contentStream += '/F2 11 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 520 Tm (- Orientation Target: July 21, 2026) Tj\n';
        contentStream += '/F2 11 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 500 Tm (- Allocated Rewards: ' + wonPrizeLabel + ') Tj\n';
        
        contentStream += '/F2 11 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 450 Tm (We challenge you to step into the Mission 800 mindset starting today. Your future self is waiting.) Tj\n';
        contentStream += '/F1 11 Tf 0.07 0.1 0.22 rg 1 0 0 1 40 380 Tm (DEAN ASHLEY) Tj\n';
        contentStream += '/F2 10 Tf 0.5 0.5 0.5 rg 1 0 0 1 40 365 Tm (Dean, Credit University AI) Tj\n';
        contentStream += 'ET\n';

        const streamLength = contentStream.length;
        lines.push('<< /Length ' + streamLength + ' >>');
        lines.push('stream');
        lines.push(contentStream);
        lines.push('endstream');
        lines.push('endobj');
        lines.push('xref');
        lines.push('0 7');
        lines.push('0000000000 65535 f ');
        lines.push('0000000010 00000 n ');
        lines.push('0000000060 00000 n ');
        lines.push('0000000119 00000 n ');
        lines.push('0000000244 00000 n ');
        lines.push('0000000325 00000 n ');
        lines.push('0000000406 00000 n ');
        lines.push('trailer');
        lines.push('<< /Size 7 /Root 1 0 R >>');
        lines.push('startxref');
        lines.push('560');
        lines.push('%%EOF');

        const blob = new Blob([lines.join('\n')], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CreditU_Acceptance_Letter_${studentName.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const generateStudentIDPDF = () => {
        playHBCUSound('success');
        const lines = [
            '%PDF-1.4',
            '1 0 obj',
            '<< /Type /Catalog /Pages 2 0 R >>',
            'endobj',
            '2 0 obj',
            '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            'endobj',
            '3 0 obj',
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 450 300] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
            'endobj',
            '4 0 obj',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
            'endobj',
            '5 0 obj',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
            'endobj',
            '6 0 obj'
        ];

        let contentStream = '';
        contentStream += 'q 0.00 0.20 0.63 rg 10 10 430 280 re f Q\n'; 
        contentStream += 'q 0.99 0.71 0.08 RG 4 w 8 8 434 284 re S Q\n'; 
        contentStream += 'q 0.99 0.71 0.08 rg 20 230 410 40 re f Q\n';
        
        contentStream += 'BT\n';
        contentStream += '/F1 16 Tf 1 1 1 rg 1 0 0 1 30 242 Tm (CREDIT U - STUDENT ID CARD) Tj\n';
        contentStream += '/F2 11 Tf 0.99 0.71 0.08 rg 1 0 0 1 30 180 Tm (NAME: ' + studentName.toUpperCase() + ') Tj\n';
        contentStream += '/F2 10 Tf 1 1 1 rg 1 0 0 1 30 155 Tm (ROLE: FOUNDING STUDENT CLASS) Tj\n';
        contentStream += '/F2 10 Tf 1 1 1 rg 1 0 0 1 30 135 Tm (STATUS: VERIFIED & ADMITTED) Tj\n';
        contentStream += '/F2 10 Tf 1 1 1 rg 1 0 0 1 30 115 Tm (REGISTRATION ID: CU-' + Math.floor(Math.random() * 90000 + 10000) + ') Tj\n';
        contentStream += '/F1 12 Tf 0.99 0.71 0.08 rg 1 0 0 1 30 60 Tm (MISSION 800 - THE FINANCIAL UNIVERSITY) Tj\n';
        contentStream += 'ET\n';

        const streamLength = contentStream.length;
        lines.push('<< /Length ' + streamLength + ' >>');
        lines.push('stream');
        lines.push(contentStream);
        lines.push('endstream');
        lines.push('endobj');
        lines.push('xref');
        lines.push('0 7');
        lines.push('0000000000 65535 f ');
        lines.push('0000000010 00000 n ');
        lines.push('0000000060 00000 n ');
        lines.push('0000000119 00000 n ');
        lines.push('0000000244 00000 n ');
        lines.push('0000000325 00000 n ');
        lines.push('0000000406 00000 n ');
        lines.push('trailer');
        lines.push('<< /Size 7 /Root 1 0 R >>');
        lines.push('startxref');
        lines.push('560');
        lines.push('%%EOF');

        const blob = new Blob([lines.join('\n')], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CreditU_StudentID_${studentName.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Form PDF Generator
    const downloadWonFormPDF = () => {
        playHBCUSound('success');
        let formTitle = '';
        let formSubtitle = '';
        let formSections: string[] = [];

        if (wonPrizeNum === 2) {
            formTitle = 'Credit Reality Check';
            formSubtitle = 'Form 2 - Assessing Your Credit Reality';
            formSections = [
                '1. Current Credit Score Assessment: Detail score ranges and their meanings.',
                '2. Credit Goals Checklist: Set target scores for car, home, or funding.',
                '3. Financial Habits Review: Identify positive vs. negative habits.',
                '4. Personal Debt Analysis: Outline outstanding cards and balances.',
                '5. Action Items: 3 steps to take this week to begin repairs.'
            ];
        } else if (wonPrizeNum === 3) {
            formTitle = 'Mission 800 Blueprint';
            formSubtitle = 'Form 3 - The Path to an 800 Credit Score';
            formSections = [
                '1. Milestones: Reaching 600, 700, and finally 800.',
                '2. Monthly Target Goals: Credit utilization limits & payments.',
                '3. Approval Targets: Perfecting debt-to-income and account mix.',
                '4. Accountability Tracker: Setting weekly checklist protocols.'
            ];
        } else if (wonPrizeNum === 5) {
            formTitle = 'Financial Reset Workbook';
            formSubtitle = 'Form 5 - Rebuilding Your Savings Foundations';
            formSections = [
                '1. Income Ledger: Active, passive, and side hustle streams.',
                '2. Expenses Breakdown: Fixed obligations vs. discretionary spend.',
                '3. Zero-Based Budget Plan: Directing every dollar to a purpose.',
                '4. Savings Blueprint: Setting emergency and long-term saving buffers.',
                '5. Emergency Fund Strategy: Reaching the critical $1,000 baseline.'
            ];
        } else {
            // Default to Form #4
            formTitle = 'Credit Strategy Planner';
            formSubtitle = 'Form 4 - Strategic Credit Planning';
            formSections = [
                '1. Negative Account Audits: Late payments, collections, charge-offs.',
                '2. Utilization Mastery: Step-by-step card paydown simulator.',
                '3. Card Options: Identifying standard vs. secured cards.',
                '4. Loan Analysis: Credit builder loans and auto financing options.',
                '5. Tactical Daily Tasks: Daily habits of high-credit individuals.'
            ];
        }

        const lines = [
            '%PDF-1.4',
            '1 0 obj',
            '<< /Type /Catalog /Pages 2 0 R >>',
            'endobj',
            '2 0 obj',
            '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            'endobj',
            '3 0 obj',
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
            'endobj',
            '4 0 obj',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
            'endobj',
            '5 0 obj',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
            'endobj',
            '6 0 obj'
        ];

        let contentStream = '';
        contentStream += 'q 0.00 0.20 0.63 rg 20 750 555 60 re f Q\n'; 
        contentStream += 'q 0.99 0.71 0.08 RG 3 w 15 15 565 812 re S Q\n'; 
        contentStream += 'q 0.99 0.71 0.08 rg 20 745 555 5 re f Q\n'; 
 
        contentStream += 'BT\n';
        contentStream += '/F1 20 Tf 1 1 1 rg 1 0 0 1 40 780 Tm (CREDIT U - THE FINANCIAL UNIVERSITY) Tj\n';
        contentStream += '/F2 12 Tf 0.99 0.71 0.08 rg 1 0 0 1 40 760 Tm (FOUNDING STUDENT EXCLUSIVE RESOURCE) Tj\n';
        contentStream += '/F1 18 Tf 0.00 0.13 0.38 rg 1 0 0 1 40 710 Tm (' + formTitle.toUpperCase() + ') Tj\n';
        contentStream += '/F2 10 Tf 0.5 0.5 0.5 rg 1 0 0 1 40 692 Tm (' + formSubtitle + ') Tj\n';
        contentStream += '/F1 10 Tf 0.07 0.1 0.22 rg 1 0 0 1 40 660 Tm (STUDENT: ' + studentName.toUpperCase() + ') Tj\n';
        contentStream += '/F2 10 Tf 0.07 0.1 0.22 rg 1 0 0 1 40 645 Tm (DATE ADMITTED: ' + new Date().toLocaleDateString() + ') Tj\n';
        contentStream += '/F2 10 Tf 0.07 0.1 0.22 rg 1 0 0 1 40 630 Tm (STATUS: ENROLLED FOUNDING STUDENT) Tj\n';
        contentStream += 'ET\n';
        contentStream += 'q 0.8 0.8 0.8 RG 1 w 40 610 m 555 610 l S Q\n';
        contentStream += 'BT\n';
        contentStream += '/F1 12 Tf 0.07 0.1 0.22 rg 1 0 0 1 40 580 Tm (PROGRAM SYLLABUS & ACTIONS:) Tj\n';
        
        let currentYOffset = 550;
        formSections.forEach((section) => {
            contentStream += '/F2 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 ' + currentYOffset + ' Tm (' + section + ') Tj\n';
            currentYOffset -= 25;
        });
 
        contentStream += '/F1 10 Tf 0.00 0.20 0.63 rg 1 0 0 1 40 100 Tm (CREDIT U - THE FINANCIAL UNIVERSITY) Tj\n';
        contentStream += '/F2 8 Tf 0.5 0.5 0.5 rg 1 0 0 1 40 85 Tm (Copyright 2026. All Rights Reserved. Dorm Week Official Document.) Tj\n';
        contentStream += 'ET\n';

        const streamLength = contentStream.length;
        lines.push('<< /Length ' + streamLength + ' >>');
        lines.push('stream');
        lines.push(contentStream);
        lines.push('endstream');
        lines.push('endobj');
        lines.push('xref');
        lines.push('0 7');
        lines.push('0000000000 65535 f ');
        lines.push('0000000010 00000 n ');
        lines.push('0000000060 00000 n ');
        lines.push('0000000119 00000 n ');
        lines.push('0000000244 00000 n ');
        lines.push('0000000325 00000 n ');
        lines.push('0000000406 00000 n ');
        lines.push('trailer');
        lines.push('<< /Size 7 /Root 1 0 R >>');
        lines.push('startxref');
        lines.push('560');
        lines.push('%%EOF');

        const blob = new Blob([lines.join('\n')], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CreditU_Form_${wonPrizeNum}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="relative flex-1 bg-[#001030] text-white min-h-screen py-16 overflow-hidden select-none">
            {/* Background Motes particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <FloatingMotes />
            </div>

            {/* Stadium Lights / Spotlight Radials */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-1/4 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[110px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-20">

                {/* ================= SECTION 1: WELCOME TO CREDIT U ================= */}
                <div className="text-center space-y-6 max-w-3xl mx-auto relative pt-8">
                    {/* Floating confetti-styled background circles */}
                    <div className="absolute -top-10 left-10 w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping pointer-events-none" />
                    <div className="absolute top-20 right-12 w-3 h-3 rounded-full bg-blue-400 animate-pulse pointer-events-none" />
                    
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400 bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/25 inline-block">
                        🎓 Orientation Protocol Active ///
                    </span>

                    <h1 className="text-4xl sm:text-7xl font-black italic tracking-tighter uppercase text-white leading-none">
                        WELCOME TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">DORM WEEK RUSH™</span>
                    </h1>
                    
                    <p className="text-sm sm:text-base text-blue-200/80 max-w-xl mx-auto font-light">
                        Your financial journey officially begins today.
                    </p>

                    {/* HBCU Announcer Box */}
                    <div className="bg-[#002270]/40 backdrop-blur-xl border border-yellow-400/20 p-6 rounded-3xl max-w-xl mx-auto mt-8 relative shadow-[0_0_30px_rgba(253,181,21,0.08)]">
                        <div className="absolute -top-3 left-6 bg-yellow-400 text-blue-950 font-mono text-[9px] font-black px-2 py-0.5 rounded uppercase">
                            📢 Stadium Announcer
                        </div>
                        
                        <div className="h-16 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.p 
                                    key={announcerIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-sm sm:text-base font-bold text-slate-200 italic font-mono"
                                >
                                    "{announcerLines[announcerIndex]}"
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>


                {/* ================= SECTION 2: DEAN ASHLEY WELCOME VIDEO ================= */}
                <div className="w-full max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
                            Welcome Student. You've Been Accepted.
                        </h2>
                        <p className="text-xs text-slate-400">
                            Watch Dean Ashley's welcome message to activate your student credentials.
                        </p>
                    </div>

                    <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-[0_0_50px_rgba(253,181,21,0.25)] bg-black/60 group">
                        {/* Video Element */}
                        <video
                            ref={videoRef}
                            src="/dorm-week-vd.mp4"
                            className="w-full aspect-[16/9] object-cover"
                            loop
                            muted={isMuted}
                            playsInline
                            autoPlay
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />

                        {/* Custom video overlay controls */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-between p-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            
                            <div className="flex justify-between items-start">
                                <span className="text-[9px] font-black tracking-widest bg-yellow-400 text-blue-950 px-2 py-0.5 rounded uppercase font-mono">
                                    Dean Ashley Orientation Video
                                </span>
                                
                                <button
                                    onClick={handleMuteToggle}
                                    className="p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-white transition-colors"
                                >
                                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                                </button>
                            </div>

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
                                    Credit U Orientation
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Video topics overview */}
                    <div className="bg-[#002270]/20 border border-white/10 p-6 rounded-2xl max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        {[
                            { title: 'What is Credit U', desc: 'Financial University AI' },
                            { title: 'Dorm Week Rush', desc: 'Early Access Orientation' },
                            { title: 'Mission 800™', desc: 'Credit Mastery Blueprint' },
                            { title: 'Transcript Review', desc: 'Personal Score Audit' }
                        ].map((topic, idx) => (
                            <div key={idx} className="space-y-1">
                                <h4 className="text-xs font-bold text-yellow-300 uppercase font-mono">{topic.title}</h4>
                                <p className="text-[10px] text-slate-400 font-light">{topic.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>


                {/* ================= SECTION 3: YOUR ACCEPTANCE PACKAGE ================= */}
                <div className="w-full max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
                            Your Acceptance Package™
                        </h2>
                        <p className="text-xs text-slate-400">
                            Claim your official admission items and digital credentials.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { name: 'Acceptance Letter™', icon: GraduationCap, color: 'text-yellow-400' },
                            { name: 'Student ID™', icon: User, color: 'text-blue-400' },
                            { name: 'Founding Student Badge™', icon: Trophy, color: 'text-amber-400' },
                            { name: 'Dorm Week Passport™', icon: FileText, color: 'text-emerald-400' },
                            { name: 'Mission 800 Access™', icon: Flame, color: 'text-red-400' },
                            { name: 'Welcome Ceremony™', icon: Star, color: 'text-pink-400' },
                            { name: 'Moo Points™', icon: Award, color: 'text-indigo-400' }
                        ].map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="bg-black/30 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 hover:border-yellow-400/30 transition-colors">
                                    <Icon className={`w-8 h-8 ${item.color}`} />
                                    <span className="text-[11px] font-bold text-slate-200">{item.name}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={generateAcceptanceLetterPDF}
                            className="py-3 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-all flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" /> Download Acceptance Letter
                        </button>
                        <button
                            onClick={generateStudentIDPDF}
                            className="py-3 px-6 bg-[#003DA5]/20 hover:bg-[#003DA5]/30 text-yellow-300 border border-yellow-400/20 font-black text-xs uppercase rounded-xl tracking-wider transition-all flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" /> Download Student ID
                        </button>
                        <button
                            onClick={() => {
                                playHBCUSound('success');
                                setShowProfileModal(true);
                            }}
                            className="py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase rounded-xl tracking-wider transition-all border border-white/10 flex items-center justify-center gap-2"
                        >
                            <User className="w-4 h-4" /> View Student Profile
                        </button>
                    </div>
                </div>


                {/* ================= SECTION 4: DORM WEEK ROADMAP ================= */}
                <div className="w-full max-w-4xl mx-auto space-y-8 bg-black/25 border border-white/5 p-8 rounded-3xl">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
                            Dorm Week Roadmap™
                        </h2>
                        <p className="text-xs text-slate-400">
                            7 days of intensive financial preparation to unlock the Credit U experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 relative">
                        {/* Timeline timeline connector line */}
                        <div className="hidden sm:block absolute top-6 left-0 right-0 h-0.5 bg-yellow-400/20 z-0" />
                        
                        {[
                            { day: 1, title: 'Move-In Pass™', desc: 'Secure student profile.' },
                            { day: 2, title: 'Money Personality™', desc: 'Learn financial habits.' },
                            { day: 3, title: 'Credit U Transcript™', desc: 'Understand your position.' },
                            { day: 4, title: 'Mission 800™', desc: 'Set financial destination.' },
                            { day: 5, title: 'Blueprint Day™', desc: 'Build your action plan.' },
                            { day: 6, title: 'Game Day™', desc: 'Complete challenges.' },
                            { day: 7, title: 'Founding Student Ceremony™', desc: 'Celebrate your beginning.' }
                        ].map((step, idx) => (
                            <div key={idx} className="bg-black/40 border border-white/5 p-4 rounded-xl relative z-10 text-center flex flex-col items-center space-y-2">
                                <span className="w-6 h-6 rounded-full bg-yellow-400 text-blue-950 font-mono text-[10px] font-black flex items-center justify-center shadow-lg">
                                    D{step.day}
                                </span>
                                <h4 className="text-[11px] font-black text-white uppercase">{step.title}</h4>
                                <p className="text-[9px] text-slate-400 leading-tight">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center pt-4">
                        <button
                            onClick={() => {
                                playHBCUSound('drum');
                                setChecklist(prev => ({ ...prev, completeDormWeek: true }));
                                confetti({ particleCount: 50, spread: 60 });
                            }}
                            className="py-4 px-8 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-widest transition-all active:scale-95 shadow-md shadow-yellow-950/20"
                        >
                            START DORM WEEK 🏈
                        </button>
                    </div>
                </div>


                {/* ================= SECTION 5: YOUR WHEEL REWARD ================= */}
                <div className="w-full max-w-lg mx-auto bg-gradient-to-b from-[#0033A0]/30 to-black/40 border border-yellow-400/20 p-8 rounded-3xl text-center space-y-6 shadow-xl relative">
                    <div className="absolute top-3 right-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full font-mono">
                        Claimed
                    </div>

                    <div className="space-y-1.5">
                        <h4 className="text-xs font-mono font-black text-yellow-400 uppercase tracking-wider">Congratulations Student</h4>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">You Won: {wonPrizeLabel}</h3>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={downloadWonFormPDF}
                            className="py-3 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-all"
                        >
                            Download PDF Form #{wonPrizeNum}
                        </button>
                    </div>

                    {/* Progress Bar (14%) */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono font-black text-slate-400 uppercase">
                            <span>Dorm Week Progress</span>
                            <span className="text-yellow-400">14% Complete</span>
                        </div>
                        <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                            <div className="bg-yellow-400 h-full w-[14%] rounded-full shadow-[0_0_10px_rgba(253,181,21,0.5)]" />
                        </div>
                    </div>
                </div>


                {/* ================= SECTION 6: FOUNDING STUDENT STATUS ================= */}
                <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-gradient-to-r from-[#002270]/40 to-black/30 border border-white/10 p-8 rounded-3xl">
                    <div className="space-y-3 md:col-span-2 text-left">
                        <span className="text-[9px] font-black tracking-widest bg-yellow-400 text-blue-950 px-2 py-0.5 rounded uppercase font-mono">
                            FOUNDING STUDENT™
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
                            You're Part Of The First Class
                        </h3>
                        <p className="text-xs text-slate-350 leading-relaxed font-light">
                            As a founding member, you are positioned inside the exclusive orientation cohort.
                        </p>
                        
                        {/* Benefits Grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 text-[11px] text-slate-200 font-bold">
                            {['Priority Access', 'Special Pricing', 'Early Updates', 'Private Announcements', 'Exclusive Resources', 'Dorm Week Bonuses', 'Mission 800™ Access', 'Community Forums'].map((benefit, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <span className="text-yellow-400 font-mono">⚡</span> {benefit}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-6 border-l md:border-l border-white/10 space-y-4">
                        <Award className="w-16 h-16 text-yellow-400 animate-pulse" />
                        <span className="text-[10px] font-mono font-black text-center text-slate-400 uppercase tracking-widest leading-tight">
                            CLASS OF 2026<br/>ORIENTATION BADGE
                        </span>
                    </div>
                </div>


                {/* ================= SECTION 7: TRANSCRIPT CENTER ================= */}
                <div className="w-full max-w-4xl mx-auto space-y-8 bg-black/20 border border-white/5 p-8 rounded-3xl">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
                            Transcript Center™
                        </h2>
                        <p className="text-xs text-slate-400">
                            Know where you stand before classes begin. Get your audit review today.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {/* Single Review Card */}
                        <div className="bg-[#002270]/20 border border-white/10 p-6 rounded-2xl space-y-4 text-center">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Single Transcript™</h4>
                            <span className="text-3xl font-black text-yellow-400 font-mono">$49</span>
                            <p className="text-[11px] text-slate-400">Complete credit analysis, mission score card, and guidance.</p>
                        </div>
                        {/* Double Review Card */}
                        <div className="bg-[#002270]/30 border border-yellow-400/30 p-6 rounded-2xl space-y-4 text-center relative">
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-blue-950 font-mono text-[8px] font-black px-2 py-0.5 rounded uppercase">
                                Best Value
                            </span>
                            <h4 className="text-xs font-black uppercase tracking-wider text-white">Double Transcript™</h4>
                            <span className="text-3xl font-black text-yellow-400 font-mono">$69</span>
                            <p className="text-[11px] text-slate-400">Full audit review for dual spouses or secondary lines.</p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => {
                                playHBCUSound('whistle');
                                setChecklist(prev => ({ ...prev, getReview: true }));
                                navigate('/transcript');
                            }}
                            className="py-3.5 px-8 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-all"
                        >
                            Get Transcript Review ⚡
                        </button>
                    </div>
                </div>


                {/* ================= SECTION 8: SUMMER SESSION ================= */}
                <div className="w-full max-w-4xl mx-auto space-y-8 bg-black/35 border border-white/5 p-8 rounded-3xl">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
                            Summer Session™
                        </h2>
                        <p className="text-xs text-slate-400">
                            Work personally with Credit U Dean Ashley this summer.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {/* Single Dorm */}
                        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl space-y-4 text-center">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Single Dorm™</h4>
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-yellow-400 font-mono">$149</span>
                                    <span className="text-sm text-red-400 line-through font-mono font-bold">$249</span>
                                    <span className="text-xs text-slate-400">signup</span>
                                </div>
                                <span className="text-sm font-black text-slate-300 font-mono">$99/month</span>
                            </div>
                            <p className="text-[11px] text-slate-400">Includes monthly review, support channels, strategy logs, coaching, and accountability.</p>
                            <button
                                onClick={() => {
                                    playHBCUSound('success');
                                    setChecklist(prev => ({ ...prev, reserveDorm: true }));
                                    navigate('/join');
                                }}
                                className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-[10px] uppercase rounded-lg tracking-wider"
                            >
                                Reserve Single Dorm
                            </button>
                        </div>
                        {/* Double Dorm */}
                        <div className="bg-black/60 border border-yellow-400/20 p-6 rounded-2xl space-y-4 text-center">
                            <h4 className="text-xs font-black uppercase tracking-wider text-white">Double Dorm™</h4>
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-yellow-400 font-mono">$249</span>
                                    <span className="text-sm text-red-400 line-through font-mono font-bold">$349</span>
                                    <span className="text-xs text-slate-400">signup</span>
                                </div>
                                <span className="text-sm font-black text-slate-300 font-mono">$149/month</span>
                            </div>
                            <p className="text-[11px] text-slate-400">Perfect for partners. Dual monthly review, shared coaches, and direct strategy review logs.</p>
                            <button
                                onClick={() => {
                                    playHBCUSound('success');
                                    setChecklist(prev => ({ ...prev, reserveDorm: true }));
                                    navigate('/join');
                                }}
                                className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-[10px] uppercase rounded-lg tracking-wider"
                            >
                                Reserve Double Dorm
                            </button>
                        </div>
                    </div>
                </div>


                {/* ================= SECTION 9: COUNTDOWN ================= */}
                <div className="max-w-2xl mx-auto bg-gradient-to-b from-[#0033A0]/20 to-black/40 border border-yellow-400/20 p-8 rounded-3xl shadow-lg text-center space-y-6">
                    <h4 className="text-base sm:text-lg font-black uppercase italic text-white tracking-wider">
                        DORM WEEK RUSH™ BEGINS IN
                    </h4>
                    
                    <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
                        {[
                            { value: timeLeft.days, label: 'Days' },
                            { value: timeLeft.hours, label: 'Hours' },
                            { value: timeLeft.minutes, label: 'Min' },
                            { value: timeLeft.seconds, label: 'Sec' }
                        ].map((time, idx) => (
                            <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center">
                                <span className="text-2xl font-black text-yellow-400 font-mono leading-none">
                                    {time.value.toString().padStart(2, '0')}
                                </span>
                                <span className="text-[8px] text-slate-400 uppercase tracking-widest mt-1.5 font-bold">
                                    {time.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            playHBCUSound('success');
                            confetti({ particleCount: 40 });
                        }}
                        className="py-3 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-all"
                    >
                        SAVE MY SEAT 🎒
                    </button>
                </div>


                {/* ================= SECTION 10: MISSION 800 Scoreboard ================= */}
                <div className="w-full max-w-xl mx-auto bg-black border-4 border-[#0033A0] p-6 rounded-3xl shadow-2xl relative">
                    {/* Retro ESPN scoreboard LEDs */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-3 bg-red-600/20 rounded-full blur-[4px] pointer-events-none" />
                    
                    <div className="flex justify-between items-center border-b border-[#0033A0]/30 pb-4 mb-4">
                        <span className="text-[10px] font-mono font-black text-red-500 tracking-widest uppercase">
                            🔴 ESPN MISSION 800 STATUS
                        </span>
                        <span className="text-[10px] font-mono font-black text-yellow-400 uppercase">
                            PERIOD 1
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 font-mono">
                        {[
                            { label: 'Current Status', value: 'ACCEPTED', color: 'text-emerald-400' },
                            { label: 'Move-In', value: 'COMPLETE', color: 'text-yellow-400' },
                            { label: 'Entrance Exam', value: 'COMPLETE', color: 'text-yellow-400' },
                            { label: 'Wheel Spin', value: 'COMPLETE', color: 'text-yellow-400' },
                            { label: 'Dorm Week', value: 'PENDING', color: 'text-red-500 animate-pulse' },
                            { label: 'Transcript Review', value: 'OPTIONAL', color: 'text-slate-400' },
                            { label: 'Summer Session', value: 'AVAILABLE', color: 'text-yellow-400' }
                        ].map((scoreboard, idx) => (
                            <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-white/5 flex flex-col text-left">
                                <span className="text-[8px] text-slate-500 uppercase tracking-widest">{scoreboard.label}</span>
                                <span className={`text-xs font-black tracking-wider mt-1 ${scoreboard.color}`}>
                                    {scoreboard.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>


                {/* ================= SECTION 11: CREDIT COW ================= */}
                <div className="max-w-xl mx-auto bg-gradient-to-r from-yellow-400/10 to-[#002270]/30 border border-yellow-400/20 p-6 rounded-3xl flex items-center gap-4 text-left shadow-lg">
                    <span className="text-4xl">🐄</span>
                    <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase text-yellow-400 font-mono">Credit Cow™ Message:</h4>
                        <p className="text-xs text-slate-200 font-bold leading-relaxed">
                            "Student... You've already made it further than most people ever do. Now let's build something special."
                        </p>
                    </div>
                </div>


                {/* ================= SECTION 12: NEXT STEPS CHECKLIST ================= */}
                <div className="w-full max-w-xl mx-auto bg-[#002270]/25 border border-white/10 p-8 rounded-3xl shadow-lg space-y-6 text-left">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-lg font-black uppercase italic text-white tracking-wide">
                            Next Steps™
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {[
                            { key: 'joinedWaitlist', text: 'Joined Waitlist', required: true },
                            { key: 'completedExam', text: 'Completed Exam', required: true },
                            { key: 'spunWheel', text: 'Spun Wheel', required: true },
                            { key: 'claimedReward', text: 'Claimed Reward', required: true },
                            { key: 'watchWelcome', text: 'Watch Dean Ashley Welcome', required: false },
                            { key: 'getReview', text: 'Get Transcript Review', required: false },
                            { key: 'reserveDorm', text: 'Reserve Dorm', required: false },
                            { key: 'completeDormWeek', text: 'Complete Dorm Week', required: false },
                            { key: 'activateMission800', text: 'Activate Mission 800™', required: false }
                        ].map((item, idx) => {
                            const isChecked = (checklist as any)[item.key];
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        if (!item.required) {
                                            playHBCUSound('bell');
                                            setChecklist(prev => {
                                                const updated = { ...prev, [item.key]: !(prev as any)[item.key] };
                                                
                                                // Trigger final activation reward sounds if all clicked
                                                if (Object.values(updated).filter(Boolean).length === 9) {
                                                    playHBCUSound('success');
                                                    confetti({ particleCount: 60 });
                                                }
                                                return updated;
                                            });
                                        }
                                    }}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all ${
                                        isChecked 
                                            ? 'bg-yellow-400/10 border-yellow-400/40 text-yellow-300' 
                                            : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/10'
                                    }`}
                                >
                                    <span className="font-bold">{item.text}</span>
                                    <span className="font-mono text-[10px]">
                                        {isChecked ? '✅ COMPLETE' : '⬜ PENDING'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>


                {/* ================= SECTION 13: FINAL CTA ================= */}
                <div className="max-w-xl mx-auto text-center space-y-6 pt-4">
                    <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
                            Your Future Self Is Waiting.
                        </h3>
                        <p className="text-xs text-slate-400">
                            Now take the next step before Dorm Week begins.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            type="button"
                            onClick={() => {
                                playHBCUSound('whistle');
                                navigate('/transcript');
                            }}
                            className="py-3.5 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider transition-all shadow-md shadow-yellow-950/20"
                        >
                            Get Transcript Review ⚡
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                playHBCUSound('success');
                                navigate('/join');
                            }}
                            className="py-3.5 px-6 bg-[#003DA5]/20 hover:bg-[#003DA5]/30 text-yellow-300 border border-yellow-400/20 font-black text-xs uppercase rounded-xl tracking-wider transition-all shadow-md"
                        >
                            Reserve Dorm 🎓
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                playHBCUSound('drum');
                                setChecklist(prev => ({ ...prev, completeDormWeek: true }));
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            className="py-3.5 px-6 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase rounded-xl tracking-wider transition-all border border-white/10"
                        >
                            Continue Dorm Week
                        </button>
                    </div>
                </div>

            </div>

            {/* Profile Credentials Overlay Modal */}
            <AnimatePresence>
                {showProfileModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#001A4D] border-4 border-yellow-400 rounded-3xl p-8 max-w-sm w-full space-y-6 text-center shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-mono font-bold"
                            >
                                [X CLOSE]
                            </button>
                            
                            <div className="space-y-1">
                                <Award className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
                                <h3 className="text-lg font-black uppercase text-white font-mono">Student Profile</h3>
                                <p className="text-[10px] text-slate-400">CREDIT U ORIENTATION ID CARD</p>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 text-left font-mono space-y-3">
                                <div>
                                    <span className="text-[9px] text-slate-500 block">STUDENT NAME:</span>
                                    <span className="text-xs font-bold text-white">{studentName}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] text-slate-500 block">ADMISSIONS CLASS:</span>
                                    <span className="text-xs font-bold text-yellow-400">FOUNDING STUDENT</span>
                                </div>
                                <div>
                                    <span className="text-[9px] text-slate-500 block">UNLOCKED REWARD:</span>
                                    <span className="text-xs font-bold text-emerald-400">{wonPrizeLabel}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] text-slate-500 block">STATUS:</span>
                                    <span className="text-xs font-bold text-blue-400">ENROLLED & ACTIVE</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
