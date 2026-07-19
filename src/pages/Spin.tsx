import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, ArrowLeft, Download, GraduationCap, FileSearch, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import FloatingMotes from '../components/FloatingMotes';

// --- CUSTOM BUTTON COMPONENT ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    className?: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
    const baseStyle = "inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95 text-sm py-3.5 px-6";
    
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

// 12 segments alternating forms D2-D6
const WHEEL_SEGMENTS = [
    { label: 'REALITY CHECK D2', formNum: 2 },
    { label: 'SCORE DNA D3', formNum: 3 },
    { label: 'GAME TRACKER D4', formNum: 4 },
    { label: 'DENIED DECODER D5', formNum: 5 },
    { label: 'RESET PLAN D6', formNum: 6 },
    { label: 'REALITY CHECK D2', formNum: 2 },
    { label: 'SCORE DNA D3', formNum: 3 },
    { label: 'GAME TRACKER D4', formNum: 4 },
    { label: 'DENIED DECODER D5', formNum: 5 },
    { label: 'RESET PLAN D6', formNum: 6 },
    { label: 'REALITY CHECK D2', formNum: 2 },
    { label: 'SCORE DNA D3', formNum: 3 }
];

const WHEEL_PRIZES: { [key: number]: any } = {
    2: { name: 'Credit Reality Check Sheet™', code: 'D2', pages: '4–5 Pages', desc: 'Assess your current financial position and understand where you really stand today.' },
    3: { name: 'Score DNA Snapshot™', code: 'D3', pages: '5–6 Pages', desc: 'Understand exactly what factors are affecting your score and the story behind it.' },
    4: { name: 'Utilization Game Day Tracker™', code: 'D4', pages: '5–6 Pages', desc: 'Track your statement dates, card balances, and ideal payment limits on a scoreboard.' },
    5: { name: 'Denied Files Decoder™', code: 'D5', pages: '6–7 Pages', desc: 'Decode denial codes, identify common application mistakes, and turn no into next.' },
    6: { name: '30-Day Credit U Reset Plan™', code: 'D6', pages: '8–10 Pages', desc: 'A step-by-step weekly checklist roadmap to guide your first 30 days of rebuilding.' }
};

// SVG arc helpers
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", x, y,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
    ].join(" ");
};

export default function Spin() {
    const navigate = useNavigate();
    
    // States
    const [isSpinning, setIsSpinning] = useState(false);
    const [hasSpun, setHasSpun] = useState(false);
    const [wonPrize, setWonPrize] = useState<any>(null);
    const [studentName, setStudentName] = useState('Founding Student');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentScore, setStudentScore] = useState(600);
    const [studentGpa, setStudentGpa] = useState(2.8);
    const [rotation, setRotation] = useState(0);
    const [downloaded, setDownloaded] = useState(false);
    const [isLocked, setIsLocked] = useState(true);
    const [referred, setReferred] = useState(false);
    const [copiedReferral, setCopiedReferral] = useState(false);

    // Read student data from localStorage on load
    useEffect(() => {
        const stored = localStorage.getItem('cu_current_submission');
        if (stored) {
            setIsLocked(false);
            try {
                const parsed = JSON.parse(stored);
                if (parsed.formData) {
                    setStudentName(parsed.formData.fullName || 'Founding Student');
                    setStudentEmail(parsed.formData.email || '');
                }
                if (parsed.score) setStudentScore(parsed.score);
                if (parsed.gpa) setStudentGpa(parsed.gpa);
            } catch (e) {}
        } else {
            setIsLocked(true);
        }

        const wheelSpun = localStorage.getItem('cu_wheel_spun') === 'true';
        const hasReferred = localStorage.getItem('cu_wheel_referred') === 'true';
        if (wheelSpun) {
            setHasSpun(true);
            const savedPrize = localStorage.getItem('cu_wheel_won_prize');
            if (savedPrize) {
                try {
                    setWonPrize(JSON.parse(savedPrize));
                } catch (e) {}
            }
        }
        if (hasReferred) {
            setReferred(true);
        }
    }, []);

    // Sound player
    const playSound = (frequency: number, duration: number) => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, ctx.currentTime);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch(e) {}
    };

    // Intelligence engine: map answers to recommended form D2-D6
    const getRecommendedForm = () => {
        const stored = localStorage.getItem('cu_current_submission');
        if (!stored) return 6; // default D6
        try {
            const parsed = JSON.parse(stored);
            if (!parsed.formData) return 6;
            
            const obstacle = parsed.formData.biggestObstacle || '';
            const scoreRange = parsed.formData.estimatedScoreRange || '';

            if (obstacle.toLowerCase().includes('utilization') || obstacle.toLowerCase().includes('balance')) {
                return 4; // D4
            }
            if (obstacle.toLowerCase().includes('late') || obstacle.toLowerCase().includes('payment')) {
                return 3; // D3
            }
            if (obstacle.toLowerCase().includes('collection') || obstacle.toLowerCase().includes('charge')) {
                return 5; // D5
            }
            if (scoreRange === 'excellent' || scoreRange === 'good') {
                return 6; // D6
            }
            return 2; // D2
        } catch (e) {
            return 6;
        }
    };

    const spinWheel = () => {
        if (isSpinning || hasSpun) return;

        setIsSpinning(true);
        
        // Use intelligence engine to fetch recommended form
        const formNum = getRecommendedForm();
        
        // Find matching slice indexes for this form
        const matchingIndexes = WHEEL_SEGMENTS.map((s, idx) => s.formNum === formNum ? idx : -1).filter(idx => idx !== -1);
        // Randomly select one segment from matches
        const targetIdx = matchingIndexes[Math.floor(Math.random() * matchingIndexes.length)];
        
        // Math to land targetIdx exactly under 12 o'clock pointer (rotated clockwise)
        const sliceAngles = 360 / 12;
        const sliceOffset = 360 - (targetIdx * sliceAngles + 15); // pointer is center of wedge
        const totalSpins = 360 * 6; // 6 spins
        const finalRotation = totalSpins + sliceOffset;

        setRotation(finalRotation);

        // Tick sound simulation
        let ticks = 0;
        const maxTicks = 20;
        const tickInterval = setInterval(() => {
            ticks++;
            playSound(400 + ticks * 20, 0.05);
            if (ticks >= maxTicks) clearInterval(tickInterval);
        }, 180);

        setTimeout(() => {
            clearInterval(tickInterval);
            setIsSpinning(false);
            setHasSpun(true);
            
            const prize = WHEEL_PRIZES[formNum];
            setWonPrize(prize);

            localStorage.setItem('cu_wheel_spun', 'true');
            localStorage.setItem('cu_wheel_won_prize', JSON.stringify(prize));

            playSound(880, 0.4);
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#0033A0', '#FDB515', '#ffffff']
            });
        }, 4000);
    };

    const handleReferral = () => {
        const refLink = `${window.location.origin}/apply?ref=student`;
        const text = `Join me at Credit U™! 🎓 Get your free Admissions Reality Check sheet and start Dorm Week: ${refLink}`;
        try {
            navigator.clipboard.writeText(text);
            setCopiedReferral(true);
            
            localStorage.setItem('cu_wheel_referred', 'true');
            playSound(880, 0.25);
            confetti({
                particleCount: 60,
                spread: 45,
                origin: { y: 0.6 },
                colors: ['#10b981', '#ffffff']
            });
            setTimeout(() => {
                setReferred(true);
                setCopiedReferral(false);
            }, 1500);
        } catch(e) {}
    };

    const handleDownloadD6 = () => {
        playSound(1046.50, 0.15);
        const { blob, fileName } = generateCreditUPDF(studentName, new Date().toLocaleDateString(), 6);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const escapePDFString = (str: string) => {
        return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    };

    const getPageDetails = (formNum: number, pageIdx: number) => {
        if (formNum === 2) {
            const pages = [
                [
                    'Form D2: CREDIT REALITY CHECK SHEET™',
                    'Chapter 1 Focus: "Know Where You Really Stand"',
                    'Your credit profile starts with an honest evaluation of where you are today.',
                    '- Checklist Item 1: Review your current estimated credit score (target: 600+).',
                    '- Checklist Item 2: Log your total monthly income vs. fixed expenses.',
                    '- Checklist Item 3: Mark any collections, late payments, or charge-offs.',
                    'Action: Print page 2 to calculate your budget limits.'
                ],
                [
                    'Chapter 2 Focus: "Emergency Savings & Cash Cushion"',
                    'A credit repair plan fails without a cash buffer to prevent new debt.',
                    '- Goal: Establish a $1,000 baseline emergency buffer.',
                    '- Step 1: Track all variable expenses for the next 7 days.',
                    '- Step 2: Separate your savings account from your main spending account.',
                    '- Step 3: Put all credit card spending on hold during this audit.',
                    'Action: Move $50 to your emergency savings account today.'
                ],
                [
                    'Chapter 3 Focus: "Debt-to-Income (DTI) Assessment"',
                    'Bureaus look closely at your capacity to borrow and repay debt.',
                    '- Total Monthly Debt Payments / Gross Monthly Income = DTI Ratio.',
                    '- Excellent: DTI under 20% | Danger Zone: DTI above 40%.',
                    '- To improve: Pay down credit card balances (revolving debt) first.',
                    '- To improve: Increase monthly income via side ventures.',
                    'Action: List your 3 highest debt balances and their minimum payments.'
                ],
                [
                    'Chapter 4 Focus: "Your Custom Reality Roadmap"',
                    'Use the findings from the last 3 days to direct your reset.',
                    '- Priority 1: Clear any past due balances to bring accounts current.',
                    '- Priority 2: Set up automatic minimum payments for all open cards.',
                    '- Priority 3: Pull your official Credit U Transcript reviewed by the Dean.',
                    '- Priority 4: Enroll in summer cohort sessions.',
                    'Congratulations! You have completed the D2 Reality Check.'
                ]
            ];
            return pages[pageIdx] || pages[0];
        } else if (formNum === 3) {
            const pages = [
                [
                    'Form D3: SCORE DNA SNAPSHOT™',
                    'Chapter 1 Focus: "The Code of Credit Scores"',
                    'Your score is compiled from five core components of your profile.',
                    '- Payment History: 35% of total score (your reliability).',
                    '- Amounts Owed (Utilization): 30% of total score (your capacity).',
                    '- Length of Credit History: 15% of total score (your experience).',
                    '- New Credit (Inquiries): 10% of total score (your urgency).',
                    '- Credit Mix: 10% of total score (your diversity).'
                ],
                [
                    'Chapter 2 Focus: "Payment History Deep Dive"',
                    'Even a single late payment can drop your score by 100 points.',
                    '- Audit: Check if you have any 30, 60, or 90+ day late records.',
                    '- Repair: Draft goodwill letters for accidental late payments.',
                    '- Protection: Enable Auto-Pay for all minimum due amounts.',
                    '- Strategy: Contact creditors immediately if a payment is missed.',
                    'Action: Set calendars reminders for all card payment dates.'
                ],
                [
                    'Chapter 3 Focus: "Revolving Utilization Audit"',
                    'Revolving balances are the fastest way to manipulate your score.',
                    '- Golden Rule: Keep individual and total card utilization under 10%.',
                    '- Danger: High balances indicate short-term cash flow strain.',
                    '- Trick: Pay card balances 3 days before the statement date.',
                    '- Goal: Ask for credit limit increases without hard pulls.',
                    'Action: List your current credit cards and statement dates.'
                ],
                [
                    'Chapter 4 Focus: "Age of Credit & Portfolio Mix"',
                    'Experience matters to lenders. Keep old accounts open.',
                    '- Age: Do not close your oldest credit cards, even if unused.',
                    '- Mix: A healthy blend includes revolving cards & installment loans.',
                    '- Tip: Use a small recurring subscription on old cards to keep active.',
                    '- Goal: Avoid closing student loans or auto loans unless necessary.',
                    'Action: Identify your oldest credit card account.'
                ],
                [
                    'Chapter 5 Focus: "Collections & Inquiries Cleanup"',
                    'Negative items and inquiries represent profile damage.',
                    '- Collections: Identify medical vs. consumer collection accounts.',
                    '- Disputing: Verify that all collectors own the legal right to collect.',
                    '- Inquiries: Keep hard inquiries below 2 per 6-month period.',
                    '- Inquiries: Dispute unauthorized inquiries linked to credit denials.',
                    'Action: Draft a debt verification request for collection items.'
                ],
                [
                    'Chapter 6 Focus: "Your DNA Action Plan"',
                    'Rebuilding your score requires structured, daily steps.',
                    '- Step 1: Secure a copy of your full Credit U Transcript.',
                    '- Step 2: Pay down all revolving balances to 6% utilization.',
                    '- Step 3: Dispute inaccurate collections using the Dean templates.',
                    '- Step 4: Schedule your 1-on-1 counselor reviews.',
                    'Congratulations! Form D3 is complete.'
                ]
            ];
            return pages[pageIdx] || pages[0];
        } else if (formNum === 4) {
            const pages = [
                [
                    'Form D4: UTILIZATION GAME DAY TRACKER™',
                    'Chapter 1 Focus: "The Power of statement dates"',
                    'Your utilization is reported on statement dates, not payment dates.',
                    '- Statement Date: The day the bill is created and reported to bureaus.',
                    '- Payment Due Date: The day you must pay to avoid late fees.',
                    '- Strategy: Pay your card balances down BEFORE the statement date.',
                    'Action: Find the statement end dates on your last 3 statements.'
                ],
                [
                    'Chapter 2 Focus: "Revolving Balance Limits"',
                    'Keep your credit utilization in the optimized zone.',
                    '- Maximum Target: Under 10% (Ideally 1%-6% reported).',
                    '- Danger Zone: Over 30% utilization (triggers score drops).',
                    '- High Alert: Over 50% utilization (indicates borrowing distress).',
                    '- Penalty: Over 90% utilization (severely affects approval rate).',
                    'Action: Calculate the 6% limit for your highest-limit card.'
                ],
                [
                    'Chapter 3 Focus: "The Statement Scoreboard Template"',
                    'Use this template to track statement dates and limits:',
                    'Card Name | Credit Limit | 6% Target Balance | Statement Date',
                    '- Card A: $________ | $_______ | $__________ | ___________',
                    '- Card B: $________ | $_______ | $__________ | ___________',
                    '- Card C: $________ | $_______ | $__________ | ___________',
                    'Action: Fill in your actual card balances and statement dates.'
                ],
                [
                    'Chapter 4 Focus: "Rebuilding card limits"',
                    'Increasing your total credit limit decreases your overall utilization.',
                    '- Strategy 1: Request credit limit increases every 180 days.',
                    '- Strategy 2: Open a new secure card if your total limit is under $1,000.',
                    '- Strategy 3: Add an authorized user with a high-limit, low-balance history.',
                    '- Warning: Never charge new purchases on an authorized user card.',
                    'Action: Call one card issuer to ask for a soft-pull credit limit increase.'
                ],
                [
                    'Chapter 5 Focus: "Your Optimization Schedule"',
                    'Your 5-day optimization checklist for credit utilization:',
                    '- Day 1: Log all open card balances and total credit capacity.',
                    '- Day 2: Align payments to statement dates (not due dates).',
                    '- Day 3: Request soft-pull limit increases on active accounts.',
                    '- Day 4: Secure any security deposit cards to build capacity.',
                    'Congratulations! Form D4 is complete.'
                ]
            ];
            return pages[pageIdx] || pages[0];
        } else if (formNum === 5) {
            const pages = [
                [
                    'Form D5: DENIED FILES DECODER™',
                    'Chapter 1 Focus: "Decoding Denial Reasons"',
                    'Lenders are legally required to send an Adverse Action notice.',
                    '- Check: Find the exact reasons cited (e.g. DTI, late payments).',
                    '- Check: Identify which credit bureau provided the profile data.',
                    '- Strategy: Use this feedback as a roadmap to fix your profile.',
                    'Action: Locate your last credit denial letter.'
                ],
                [
                    'Chapter 2 Focus: "The Hard Inquiry Check"',
                    'Too many hard inquiries signal credit desperation to lenders.',
                    '- Rule: Keep hard inquiries below 3 per credit bureau.',
                    '- Action: Pull your credit report to count inquiries from last 12 months.',
                    '- Strategy: Dispute inquiries that did not result in opened accounts.',
                    '- Strategy: Always use pre-approval forms (soft pull) when shopping.',
                    'Action: List all inquiries made in the last 6 months.'
                ],
                [
                    'Chapter 3 Focus: "Debt-to-Income Calculations"',
                    'High DTI is the primary reason for loan and mortgage denials.',
                    '- Calculation: Monthly recurring obligations / Gross monthly income.',
                    '- Threshold: Keep DTI under 36% for prime loan approvals.',
                    '- Solution: Pay off small balances to eliminate monthly payments.',
                    '- Solution: Refinance higher interest auto or student loans.',
                    'Action: List all credit cards with balances under $300.'
                ],
                [
                    'Chapter 4 Focus: "Challenging Late Payments"',
                    'Late payments on credit reports block prime credit approvals.',
                    '- Method 1: Goodwill Letter (explain accidental delay).',
                    '- Method 2: Disputing discrepancies in payment reporting records.',
                    '- Protection: Set alerts for 5 days before payment is due.',
                    '- Action: Bring all past-due accounts current immediately.',
                    'Action: Draft a Goodwill request for a single late payment.'
                ],
                [
                    'Chapter 5 Focus: "Verifying Collection Accounts"',
                    'Collections represent unpaid charge-offs sold to third parties.',
                    '- Law: Debt collectors must verify the accuracy of the debt.',
                    '- Action: Request full validation within 30 days of initial notice.',
                    '- Strategy: Check if the collector has a valid license in your state.',
                    '- Strategy: Pay collections only under a written pay-for-delete agreement.',
                    'Action: Draft a debt verification template letter.'
                ],
                [
                    'Chapter 6 Focus: "The Reapplication Timetable"',
                    'Do not reapply immediately after receiving a denial letter.',
                    '- Wait 30 days: If denial was due to utilization (easy to fix).',
                    '- Wait 90 days: If denial was due to inquiries or late payments.',
                    '- Wait 180 days: If denial was due to DTI or bankruptcy records.',
                    '- Always: Correct the primary denial reasons before reapplying.',
                    'Action: Calendar your next safe credit application date.'
                ],
                [
                    'Chapter 7 Focus: "Your Decoder Action Checklist"',
                    'Your checklist to turn credit denials into prime approvals:',
                    '- Step 1: Bring all past due balances to $0 balance.',
                    '- Step 2: Dispute unauthorized hard inquiries.',
                    '- Step 3: Request goodwill deletion for single late payments.',
                    '- Step 4: Secure your Credit U Transcript review.',
                    'Congratulations! Form D5 is complete.'
                ]
            ];
            return pages[pageIdx] || pages[0];
        } else {
            const pages = [
                [
                    'Form D6: 30-DAY CREDIT U RESET PLAN™',
                    'Day 1-3 Focus: "Emergency Savings & Baseline Score"',
                    'Welcome to your first week of the Credit U Reset Plan.',
                    '- Day 1: Log into your credit monitoring portal and note score baseline.',
                    '- Day 2: Set up a dedicated savings account for your emergency fund.',
                    '- Day 3: Automate a $25 weekly transfer to your new savings account.',
                    'Action: Save your first $25 baseline buffer today.'
                ],
                [
                    'Day 4-7 Focus: "Dispute Audit & Record Review"',
                    'Preparing your profile records for correction and validation.',
                    '- Day 4: Review credit reports for typos in spelling or address.',
                    '- Day 5: Identify collections or charge-offs older than 7 years.',
                    '- Day 6: Check for matching balances between collectors and lenders.',
                    '- Day 7: List all accounts showing incorrect payment histories.',
                    'Action: Note down 3 discrepancies in your credit file.'
                ],
                [
                    'Day 8-10 Focus: "Primary Tradelines Selection"',
                    'Adding positive history is as important as deleting bad history.',
                    '- Day 8: Audit your current active credit cards (need 3 minimum).',
                    '- Day 9: Select a secure credit building card if credit mix is thin.',
                    '- Day 10: Complete enrollment setup for rent and utility reporting.',
                    'Action: Select one credit builder card to add to your profile.'
                ],
                [
                    'Day 11-13 Focus: "Budgeting & Payment Auto-Setup"',
                    'Structuring your accounts to prevent any future late reports.',
                    '- Day 11: Set credit card minimum payments to automatic transfer.',
                    '- Day 12: Set payment dates to align with your monthly paydays.',
                    '- Day 13: Establish a weekly calendar alert to audit card balances.',
                    'Action: Enable Auto-Pay for all credit card minimum payments.'
                ],
                [
                    'Day 14-17 Focus: "Bureau Letters Dispatch"',
                    'Sending formal dispute requests to credit bureaus.',
                    '- Day 14: Draft address correction requests for old residences.',
                    '- Day 15: Draft validation letters for unverified collection items.',
                    '- Day 16: Mail letters via Certified Mail to TransUnion and Equifax.',
                    '- Day 17: Mail letters to Experian. Save tracking codes.',
                    'Action: Print and sign your credit dispute letters.'
                ],
                [
                    'Day 18-20 Focus: "Revolving Debt Snowball"',
                    'Accelerating your score increases by paying down revolving card debt.',
                    '- Day 18: List all open cards from smallest balance to largest.',
                    '- Day 19: Allocate excess funds to pay off the smallest balance.',
                    '- Day 20: Repeat for the next smallest balance. Keep accounts open.',
                    'Action: Pay off your smallest credit card balance.'
                ],
                [
                    'Day 21-23 Focus: "Utilization Statement Audit"',
                    'Ensuring your card balances report low utilization to bureaus.',
                    '- Day 21: Check your credit card statement closing dates.',
                    '- Day 22: Pay card balance to 6% utilization 3 days before statement date.',
                    '- Day 23: Keep card utilization under 10% until the next statement.',
                    'Action: Verify statement closing dates for all cards.'
                ],
                [
                    'Day 24-27 Focus: "Inquiry Cleanup Request"',
                    'Removing excessive hard inquiries from your credit file.',
                    '- Day 24: Identify inquiries not matching open accounts.',
                    '- Day 25: Call bureaus directly to dispute incorrect inquiries.',
                    '- Day 26: Draft inquiry dispute letters for Experian.',
                    '- Day 27: Mail inquiry dispute letters to Experian and TransUnion.',
                    'Action: List inquiries older than 6 months for removal.'
                ],
                [
                    'Day 28-30 Focus: "Final Portal Check & GPA Review"',
                    'Wrapping up your 30-day reset and preparing for graduation.',
                    '- Day 28: Pull your updated credit report to review score changes.',
                    '- Day 29: Recalculate your Financial GPA™ based on new metrics.',
                    '- Day 30: Submit your updated scores to Dean Ashley J. for review.',
                    'Action: Log your score change inside the student database.'
                ],
                [
                    'Graduation Focus: "Mission 800™ Placement"',
                    'Graduating to the next level of your Credit U journey.',
                    '- Goal: Maintain your optimized credit habits monthly.',
                    '- Step 1: Attend weekly cohort live reviews with Dean Ashley.',
                    '- Step 2: Access your advanced student ID badge.',
                    '- Step 3: Continue building savings toward mortgage and business goals.',
                    'Congratulations! You have completed the 30-Day Credit U Reset.'
                ]
            ];
            return pages[pageIdx] || pages[0];
        }
    };

    // --- PURE JAVASCRIPT MULTI-PAGE PDF BUILDER ---
    const generateCreditUPDF = (studentName: string, dateStr: string, formNum: number) => {
        let formTitle = '';
        let formSubtitle = '';
        let pageCount = 1;
        let fileName = '';

        if (formNum === 2) {
            formTitle = 'Credit Reality Check Sheet™';
            formSubtitle = 'D2 - Assessing Your Credit Reality';
            pageCount = 4;
            fileName = 'CreditU_D2_Reality_Check.pdf';
        } else if (formNum === 3) {
            formTitle = 'Score DNA Snapshot™';
            formSubtitle = 'D3 - Understand The Story Behind Your Score';
            pageCount = 6;
            fileName = 'CreditU_D3_Score_DNA.pdf';
        } else if (formNum === 4) {
            formTitle = 'Utilization Game Day Tracker™';
            formSubtitle = 'D4 - Learn The Credit Game';
            pageCount = 5;
            fileName = 'CreditU_D4_Utilization_Tracker.pdf';
        } else if (formNum === 5) {
            formTitle = 'Denied Files Decoder™';
            formSubtitle = 'D5 - Turn No Into Next';
            pageCount = 7;
            fileName = 'CreditU_D5_Denied_Files_Decoder.pdf';
        } else {
            formTitle = '30-Day Credit U Reset Plan™';
            formSubtitle = 'D6 - Your First 30 Days At Credit U';
            pageCount = 10;
            fileName = 'CreditU_D6_30_Day_Reset.pdf';
        }

        const pageIds: number[] = [];
        for (let i = 0; i < pageCount; i++) {
            pageIds.push(3 + 2 * i);
        }

        const fontBoldId = 3 + 2 * pageCount;
        const fontRegId = 4 + 2 * pageCount;

        const lines: string[] = [
            '%PDF-1.4',
            '1 0 obj',
            `<< /Type /Catalog /Pages 2 0 R >>`,
            'endobj',
            '2 0 obj',
            `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageCount} >>`,
            'endobj'
        ];

        for (let i = 0; i < pageCount; i++) {
            const pageId = 3 + 2 * i;
            const contentId = 4 + 2 * i;

            // Page Object
            lines.push(`${pageId} 0 obj`);
            lines.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontBoldId} 0 R /F2 ${fontRegId} 0 R >> >> /Contents ${contentId} 0 R >>`);
            lines.push('endobj');

            // Content Stream
            let stream = '';
            stream += 'q 0.00 0.20 0.63 rg 20 750 555 60 re f Q\n'; 
            stream += 'q 0.99 0.71 0.08 RG 3 w 15 15 565 812 re S Q\n'; 
            stream += 'q 0.99 0.71 0.08 rg 20 745 555 5 re f Q\n'; 

            stream += 'BT\n';
            stream += `1 0 0 1 40 782 Tm /F1 16 Tf 1 1 1 rg (CREDIT U - THE FINANCIAL UNIVERSITY) Tj\n`;
            stream += `1 0 0 1 40 762 Tm /F2 10 Tf 0.99 0.71 0.08 rg (FOUNDING STUDENT EXCLUSIVE RESOURCE) Tj\n`;
            stream += `1 0 0 1 40 710 Tm /F1 14 Tf 0.00 0.13 0.38 rg (${escapePDFString(formTitle).toUpperCase()}) Tj\n`;
            stream += `1 0 0 1 40 695 Tm /F2 9 Tf 0.5 0.5 0.5 rg (${escapePDFString(formSubtitle)} - Page ${i + 1} of ${pageCount}) Tj\n`;
            stream += `1 0 0 1 40 665 Tm /F1 9 Tf 0.07 0.1 0.22 rg (STUDENT: ${escapePDFString(studentName).toUpperCase()}) Tj\n`;
            stream += `1 0 0 1 40 650 Tm /F2 9 Tf 0.07 0.1 0.22 rg (DATE AWARDED: ${escapePDFString(dateStr)}) Tj\n`;
            stream += `1 0 0 1 40 635 Tm /F2 9 Tf 0.07 0.1 0.22 rg (STATUS: FOUNDING MEMBER / MISSION 800) Tj\n`;
            stream += 'ET\n';

            stream += 'q 0.8 0.8 0.8 RG 1 w 40 615 m 555 615 l S Q\n';

            stream += 'BT\n';
            stream += `1 0 0 1 40 585 Tm /F1 11 Tf 0.00 0.13 0.38 rg (SECTION CONTENT / STUDY GUIDE:) Tj\n`;
            
            const pageDetails = getPageDetails(formNum, i);

            let y = 550;
            pageDetails.forEach((line) => {
                stream += `1 0 0 1 40 ${y} Tm /F2 10 Tf 0.15 0.15 0.15 rg (${escapePDFString(line)}) Tj\n`;
                y -= 30;
            });

            stream += `1 0 0 1 40 100 Tm /F1 10 Tf 0.00 0.20 0.63 rg (CREDIT U - Adaptive Learning Engine) Tj\n`;
            stream += `1 0 0 1 40 85 Tm /F2 8 Tf 0.5 0.5 0.5 rg (It Starts With U. Copyright 2026. All Rights Reserved.) Tj\n`;
            stream += 'ET\n';

            lines.push(`${contentId} 0 obj`);
            lines.push(`<< /Length ${stream.length} >>`);
            lines.push('stream');
            lines.push(stream);
            lines.push('endstream');
            lines.push('endobj');
        }

        lines.push(`${fontBoldId} 0 obj`);
        lines.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
        lines.push('endobj');
        
        lines.push(`${fontRegId} 0 obj`);
        lines.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
        lines.push('endobj');

        lines.push('trailer');
        lines.push(`<< /Size ${fontRegId + 1} /Root 1 0 R >>`);
        lines.push('startxref');
        lines.push('200');
        lines.push('%%EOF');

        const pdfString = lines.join('\n');
        const buf = new Uint8Array(pdfString.length);
        for (let i = 0; i < pdfString.length; i++) {
            buf[i] = pdfString.charCodeAt(i);
        }
        return { blob: new Blob([buf], { type: 'application/pdf' }), fileName };
    };

    const handleDownload = () => {
        if (!wonPrize) return;
        playSound(1046.50, 0.15);
        
        // Generate PDF content using browser builder
        const { blob, fileName } = generateCreditUPDF(studentName, new Date().toLocaleDateString(), wonPrize.formNum);
        
        // Trigger download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setDownloaded(true);

        // Success Confetti
        confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#0033A0', '#FDB515']
        });

        // 1. Update current submission locally
        const currentSub = JSON.parse(localStorage.getItem('cu_current_submission') || '{}');
        if (currentSub.id) {
            currentSub.reward_downloaded = true;
            currentSub.assigned_form = wonPrize.formNum;
            currentSub.statusTags = [...new Set([...(currentSub.statusTags || []), 'Prize Won', `Prize: Form ${wonPrize.formNum}`, 'Reward Downloaded'])];
            localStorage.setItem('cu_current_submission', JSON.stringify(currentSub));

            const db = JSON.parse(localStorage.getItem('cu_funnel_standalone_db') || '[]');
            const updatedDb = db.map((sub: any) => sub.id === currentSub.id ? currentSub : sub);
            localStorage.setItem('cu_funnel_standalone_db', JSON.stringify(updatedDb));
        }

        // 2. Add or update record inside student_exams database
        const studentExams = JSON.parse(localStorage.getItem('cu_student_exams') || '[]');
        const targetEmail = studentEmail || 'student@credit.u';
        const existingIdx = studentExams.findIndex((e: any) => e.student_id === targetEmail);

        const record = {
            student_id: targetEmail,
            student_name: studentName,
            assigned_form: wonPrize.formNum,
            score: studentScore,
            interest_gpa: studentGpa,
            reward_downloaded: true,
            timestamp: new Date().toISOString()
        };

        if (existingIdx >= 0) {
            studentExams[existingIdx] = { ...studentExams[existingIdx], ...record };
        } else {
            studentExams.unshift(record);
        }
        localStorage.setItem('cu_student_exams', JSON.stringify(studentExams));
    };

    if (isLocked) {
        return (
            <div className="relative flex-1 flex flex-col items-center justify-center py-20 px-4 md:px-6 min-h-[90vh]">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <FloatingMotes />
                </div>
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-md w-full bg-[#0033A0]/30 backdrop-blur-xl border border-yellow-400/25 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center space-y-6 relative z-10">
                    <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/30 text-yellow-350 rounded-full flex items-center justify-center shadow-inner">
                        <Trophy className="w-8 h-8 opacity-40" />
                    </div>

                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400 font-mono">
                            Admissions Prize Wheel ///
                        </span>
                        <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter mt-1">
                            🎡 Wheel is Locked
                        </h3>
                        <p className="text-xs text-blue-200 mt-2 leading-relaxed">
                            To ensure enrollment fairness, Dean Ashley J. requires all applicants to complete their **Credit U™ Entrance Exam** prior to spinning the admissions prize wheel.
                        </p>
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-[10px] text-slate-400 leading-relaxed font-mono w-full">
                        Status: UNVERIFIED STUDENT PROFILE
                    </div>

                    <button 
                        onClick={() => navigate('/apply')}
                        className="w-full py-4 text-xs font-black uppercase tracking-widest bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-xl shadow-yellow-950/20 rounded-xl transition-transform active:scale-95"
                    >
                        Start Entrance Exam Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex-1 flex flex-col items-center justify-start py-12 px-4 md:px-6 min-h-[90vh]">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <FloatingMotes />
            </div>

            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-2xl w-full text-center space-y-8 relative z-10 flex flex-col items-center">
                
                <AnimatePresence mode="wait">
                    {!hasSpun ? (
                        // --- SPIN WHEEL VIEW ---
                        <motion.div 
                            key="spinner"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center space-y-8 w-full"
                        >
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400 font-mono">
                                    Admissions Prize Wheel ///
                                </span>
                                <h3 className="text-3xl sm:text-4xl font-black italic uppercase text-white tracking-tighter mt-1">
                                    Spin to Claim Your Reward
                                </h3>
                                <p className="text-xs sm:text-sm text-blue-200 mt-2 max-w-md mx-auto font-light">
                                    Congratulations, {studentName}! Unlock exclusive workbook templates, reality checks, or credit roadmarks before classes begin.
                                </p>
                            </div>

                            {/* Spinner Wheel Visual */}
                            <div className="relative w-80 h-80 flex items-center justify-center select-none mt-4">
                                
                                {/* Shadow Backplate */}
                                <div className="absolute inset-4 rounded-full bg-black/45 blur-lg pointer-events-none" />

                                {/* Spinning Wheel Image */}
                                <img 
                                    src="/credit-u-wheel.png" 
                                    alt="Credit U Wheel" 
                                    className="w-[290px] h-[290px] object-contain rounded-full relative z-10"
                                    style={{ 
                                        transform: `rotate(${rotation}deg)`,
                                        transition: isSpinning ? 'transform 4.0s cubic-bezier(0.1, 0.8, 0.2, 1)' : 'transform 0s ease'
                                    }}
                                />

                                {/* Pointer Indicator (fixed at top overlapping the wheel) */}
                                <div className="absolute top-0 z-20 -translate-y-1.5 flex flex-col items-center pointer-events-none">
                                    <div className="w-5 h-7 bg-red-600 border-2 border-white rounded-b-full shadow-md" />
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="w-full max-w-xs space-y-4">
                                <Button 
                                    onClick={spinWheel} 
                                    disabled={isSpinning}
                                    className="w-full py-4 text-base font-black uppercase tracking-widest gap-2 bg-yellow-400 text-blue-900 shadow-xl shadow-yellow-950/20"
                                >
                                    {isSpinning ? "Spinning..." : "Spin The Wheel"}
                                </Button>
                                
                                <div className="flex justify-between w-full text-xs font-bold uppercase tracking-wider text-slate-400">
                                    <button onClick={() => navigate('/results')} className="hover:text-white flex items-center gap-1">
                                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Results
                                    </button>
                                    <button onClick={() => navigate('/transcript')} className="hover:text-white flex items-center gap-1">
                                        Transcript Audit <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        // --- CONGRATULATIONS / DOWNLOAD VIEW ---
                        <motion.div 
                            key="congrats"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-xl bg-gradient-to-b from-[#0033A0]/45 to-slate-950 border border-yellow-400/30 p-8 rounded-[40px] shadow-2xl space-y-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />
                            
                            <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/30 text-yellow-350 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <Trophy className="w-8 h-8" />
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400 block animate-pulse font-mono">
                                    YOU WON THE
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black italic uppercase text-white tracking-tighter leading-tight">
                                    {wonPrize?.name}
                                </h3>
                                <p className="text-xs text-blue-200 leading-relaxed max-w-md mx-auto font-light">
                                    {wonPrize?.desc}
                                </p>
                            </div>

                            {/* Syllabus Details Metadata Badge */}
                            <div className="bg-black/40 border border-white/5 p-5 rounded-2xl text-left space-y-2 max-w-md mx-auto font-sans">
                                <div className="flex justify-between border-b border-white/5 pb-2 text-[10px] font-mono text-slate-400 uppercase font-black">
                                    <span>Resource Type</span>
                                    <span className="text-yellow-400">{wonPrize?.code} exclusive</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2 text-[10px] font-mono text-slate-400 uppercase font-black">
                                    <span>Target length</span>
                                    <span className="text-white">{wonPrize?.pages}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase font-black">
                                    <span>Awarded Student</span>
                                    <span className="text-yellow-400 font-bold">{studentName}</span>
                                </div>
                            </div>

                            {/* The 3 Action Buttons Stack */}
                            <div className="flex flex-col gap-3 max-w-md mx-auto pt-4">
                                <button
                                    onClick={handleDownload}
                                    className={`w-full py-4 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center gap-2 ${
                                        downloaded 
                                        ? 'bg-emerald-500 text-white border border-emerald-400/30 animate-pulse' 
                                        : 'bg-yellow-400 hover:bg-yellow-300 text-blue-955 shadow-yellow-950/20'
                                    }`}
                                >
                                    {downloaded ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            DOCUMENT DOWNLOADED SUCCESSFULLY
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            📥 DOWNLOAD FORM
                                        </>
                                    )}
                                </button>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        onClick={() => navigate('/dorm-week-rush')}
                                        className="py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-950 font-black text-[10px] uppercase rounded-xl tracking-wider transition-all active:scale-95 shadow-md shadow-yellow-950/20"
                                    >
                                        🎓 GO TO DORM WEEK™
                                    </button>
                                    <button
                                        onClick={() => navigate('/transcript')}
                                        className="py-4 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase rounded-xl tracking-wider border border-white/10 transition-all active:scale-95 shadow-md"
                                    >
                                        📊 GET MY TRANSCRIPT REVIEW™
                                    </button>
                                </div>
                            </div>

                            {/* Referral Unlock Panel */}
                            <div className="border-t border-white/10 pt-6 mt-4">
                                {!referred ? (
                                    <div className="bg-black/35 border border-yellow-400/20 p-5 rounded-2xl text-center space-y-4 shadow-xl">
                                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-yellow-400 font-mono animate-pulse block">
                                            Referral Program ///
                                        </span>
                                        <h4 className="text-sm font-black uppercase italic text-white leading-none">
                                            Unlock a 2nd Free Credit U Prize! 🎁
                                        </h4>
                                        <p className="text-[10px] text-slate-350 leading-relaxed font-light">
                                            Refer a friend to Credit U. Once you copy the referral link, you'll immediately unlock the **30-Day Credit U Reset Plan™ (Form D6)**!
                                        </p>
                                        <button 
                                            onClick={handleReferral}
                                            className="w-full py-3 bg-yellow-400 hover:bg-yellow-350 text-blue-955 font-black text-[10px] uppercase rounded-xl tracking-wider transition-all shadow-md active:scale-95"
                                        >
                                            {copiedReferral ? "🔗 Referral Link Copied!" : "🔗 Refer a Friend to Unlock"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl text-center space-y-4 shadow-xl">
                                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400 font-mono block">
                                            Referral Bonus Unlocked
                                        </span>
                                        <h4 className="text-sm font-black uppercase italic text-white leading-none">
                                            30-Day Credit U Reset Plan™ (Form D6)
                                        </h4>
                                        <p className="text-[10px] text-slate-350 leading-relaxed font-light">
                                            Thank you for sharing! As a founding student, you have unlocked access to Form D6.
                                        </p>
                                        <button 
                                            onClick={handleDownloadD6}
                                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-450 text-white font-black text-[10px] uppercase rounded-xl tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <Download className="w-4 h-4" /> Download Bonus Form D6
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
