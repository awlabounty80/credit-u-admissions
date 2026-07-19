import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, GraduationCap, ArrowRight, Award, Trophy, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- CUSTOM BUTTON COMPONENT ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    className?: string;
    children: React.ReactNode;
}

const CustomButton: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
    const baseStyle = "inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95 text-sm py-3.5 px-6";
    
    let variantStyle = "bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-md shadow-yellow-950/20";
    if (variant === 'outline') {
        variantStyle = "border-2 border-white/20 hover:bg-white/10 text-white";
    }
    
    return (
        <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default function ThankYou() {
    const navigate = useNavigate();
    const [submission, setSubmission] = useState<any>(null);

    useEffect(() => {
        // Fire confetti on successful load
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });

        const stored = localStorage.getItem('cu_current_submission');
        if (stored) {
            setSubmission(JSON.parse(stored));
        } else {
            navigate('/');
        }
    }, [navigate]);

    if (!submission) return null;

    const { score, dorm, gpa, formData, statusTags, selectedTier, wonPrize } = submission;

    return (
        <div className="relative flex-1 flex flex-col items-center justify-start py-12 px-4 md:px-6">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-2xl w-full bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 text-center space-y-6">
                
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <Check className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">
                        Registration Completed ///
                    </span>
                    <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter mt-1">
                        Welcome to Credit U!
                    </h3>
                    <p className="text-xs text-blue-200 max-w-md mx-auto leading-relaxed">
                        Your student record has been generated and pushed to our central database. You are ready to log in to the stable Student Portal.
                    </p>
                </div>

                {/* Digital Student ID Card */}
                <motion.div 
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                    className="w-full max-w-[360px] aspect-[1.586/1] mx-auto bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-yellow-400/20 text-left"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05)_0%,transparent_100%)] pointer-events-none" />
                    
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[8px] font-mono tracking-widest uppercase opacity-70">CREDIT UNIVERSITY</span>
                            <h4 className="text-sm font-black tracking-wider uppercase italic leading-none text-yellow-400">OFFICIAL STUDENT ID</h4>
                        </div>
                        <span className="text-xl">🎓</span>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-xl font-bold uppercase italic text-yellow-300">
                            {formData.fullName ? formData.fullName.slice(0, 2) : "ST"}
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-black uppercase text-white tracking-wide">{formData.fullName}</div>
                            <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">Dorm: {dorm}</div>
                            <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">GPA: {gpa} | Score: {score}</div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-white/5 pt-3">
                        <div>
                            <span className="block text-[6px] font-mono tracking-widest opacity-60">MEMBERSHIP TIER</span>
                            <span className="text-[9px] font-bold tracking-wider font-mono uppercase text-white">{selectedTier || "Freshman Tier"}</span>
                        </div>
                        <div>
                            <span className="block text-[6px] font-mono tracking-widest opacity-60 text-right">STUDENT ID</span>
                            <span className="text-[9px] font-bold tracking-wider font-mono text-right text-white">#CU-2026-{score}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Logged tags list */}
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5 text-left space-y-3">
                    <h5 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Log Status Tags Gained:</h5>
                    <div className="flex flex-wrap gap-2">
                        {statusTags.map((tag: string, idx: number) => (
                            <span 
                                key={idx}
                                className="px-2 py-1 bg-yellow-400/10 text-yellow-300 border border-yellow-400/20 rounded font-mono text-[9px] uppercase font-bold"
                            >
                                {tag}
                            </span>
                        ))}
                        {wonPrize && (
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded font-mono text-[9px] uppercase font-bold">
                                Prize: {wonPrize}
                            </span>
                        )}
                    </div>
                </div>

                {/* Redirect / Next steps */}
                <div className="w-full max-w-sm mx-auto space-y-4 pt-4">
                    <CustomButton 
                        onClick={() => {
                            alert("Transferring to Credit U student portal at portal.creditu.com...");
                            // In production, this would link to the stable portal domain
                        }}
                        className="w-full py-4 text-base font-black uppercase tracking-widest gap-2 bg-yellow-400 text-blue-900 shadow-xl shadow-yellow-950/20"
                    >
                        Access Student Portal
                        <ArrowRight className="w-5 h-5" />
                    </CustomButton>
                    <div className="text-xs text-slate-400">
                        Or view submissions in the <span onClick={() => navigate('/admin')} className="text-yellow-400 font-bold cursor-pointer hover:underline">Dean Admissions Panel</span>.
                    </div>
                </div>

            </div>
        </div>
    );
}
