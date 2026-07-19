import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

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

export default function Join() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // States
    const [tier, setTier] = useState<'freshman' | 'legacy' | 'founders'>('freshman');
    const [billingName, setBillingName] = useState('');
    const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
    const [cardExpiry, setCardExpiry] = useState('12/28');
    const [cardCvc, setCardCvc] = useState('123');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Read selected tier from URL query parameters
    useEffect(() => {
        const queryTier = searchParams.get('tier');
        if (queryTier === 'legacy') {
            setTier('legacy');
        } else if (queryTier === 'founders') {
            setTier('founders');
        }

        const stored = localStorage.getItem('cu_current_submission');
        if (stored) {
            const parsed = JSON.parse(stored);
            setBillingName(parsed.formData?.fullName || '');
        }
    }, [searchParams]);

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);

            // Update local current submission to "Converted" and add tags
            const currentSub = JSON.parse(localStorage.getItem('cu_current_submission') || '{}');
            if (currentSub.id) {
                currentSub.statusTags = [...new Set([...currentSub.statusTags, 'Converted', 'Member', tier === 'legacy' ? 'Legacy' : 'Freshman'])];
                currentSub.selectedTier = tier === 'legacy' ? 'Legacy VIP' : 'Freshman';
                localStorage.setItem('cu_current_submission', JSON.stringify(currentSub));
                
                // Update database
                const db = JSON.parse(localStorage.getItem('cu_funnel_standalone_db') || '[]');
                const updatedDb = db.map((sub: any) => sub.id === currentSub.id ? currentSub : sub);
                localStorage.setItem('cu_funnel_standalone_db', JSON.stringify(updatedDb));
            }

            // Redirect to thank you confirmation
            navigate('/thankyou');
        }, 1500);
    };

    return (
        <div className="relative flex-1 flex flex-col items-center justify-start py-12 px-4 md:px-6">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8 items-stretch relative z-10">
                
                {/* Left Side: Offer Toggles & Summary */}
                <div className="flex-1 bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col justify-between">
                    <div className="space-y-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">
                                Checkout Portal ///
                            </span>
                            <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter mt-1">
                                Choose Enrollment
                            </h3>
                        </div>

                        {/* Visual Preview Banner */}
                        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                            <img 
                                src="/welcome-dormweek-rush.png" 
                                alt="Credit U Program Enrollment Preview" 
                                className="w-full h-auto object-contain transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-955/80 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-3 left-4">
                                <span className="text-[8px] font-black tracking-wider uppercase font-mono bg-yellow-400 text-blue-955 px-2 py-0.5 rounded shadow">
                                    Active Program
                                </span>
                                <h4 className="font-black text-sm text-white uppercase italic mt-1 leading-none">
                                    {tier === 'founders' ? "The Founders Key — Lifetime Access" : tier === 'freshman' ? "Summer Semester Freshman" : "Elite Executive Legacy"}
                                </h4>
                            </div>
                        </div>

                        {/* Tier selectors */}
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setTier('freshman')}
                                className={`p-3 border text-left rounded-xl transition-all flex flex-col justify-between ${tier === 'freshman' ? 'bg-yellow-400/10 border-yellow-500 shadow-md shadow-yellow-950/20' : 'bg-black/20 border-white/10 hover:bg-white/5'}`}
                            >
                                <div>
                                    <span className={`text-[7px] font-black uppercase tracking-wider block ${tier === 'freshman' ? 'text-yellow-400' : 'text-slate-400'}`}>Semester</span>
                                    <span className="font-black italic text-xs text-white uppercase mt-0.5 block leading-none">Freshman</span>
                                </div>
                                <span className="text-[9px] text-blue-200 mt-3 font-bold block">$39 + $39/mo</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setTier('legacy')}
                                className={`p-3 border text-left rounded-xl transition-all flex flex-col justify-between ${tier === 'legacy' ? 'bg-yellow-400/10 border-yellow-500 shadow-md shadow-yellow-950/20' : 'bg-black/20 border-white/10 hover:bg-white/5'}`}
                            >
                                <div>
                                    <span className={`text-[7px] font-black uppercase tracking-wider block ${tier === 'legacy' ? 'text-yellow-400' : 'text-slate-400'}`}>Executive</span>
                                    <span className="font-black italic text-xs text-white uppercase mt-0.5 block leading-none">Legacy VIP</span>
                                </div>
                                <span className="text-[9px] text-blue-200 mt-3 font-bold block">$149 + $149/mo</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setTier('founders')}
                                className={`p-3 border text-left rounded-xl transition-all flex flex-col justify-between ${tier === 'founders' ? 'bg-yellow-400/10 border-yellow-500 shadow-md shadow-yellow-950/20' : 'bg-black/20 border-white/10 hover:bg-white/5'}`}
                            >
                                <div>
                                    <span className={`text-[7px] font-black uppercase tracking-wider block ${tier === 'founders' ? 'text-yellow-400' : 'text-slate-400'}`}>Lifetime 🔑</span>
                                    <span className="font-black italic text-xs text-white uppercase mt-0.5 block leading-none">Founders Key</span>
                                </div>
                                <span className="text-[9px] text-yellow-400 mt-3 font-bold block">$497 (One-time)</span>
                            </button>
                        </div>

                        {/* Included Checklist */}
                        <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-3">
                            <h5 className="font-bold text-xs uppercase text-white tracking-wider">
                                {tier === 'founders' ? "Founders Key Privileges:" : "Summer Enrollment Bundle:"}
                            </h5>
                            <div className="space-y-2 text-xs text-slate-300 font-light">
                                {tier === 'founders' ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                                            <span>🔑 Lifetime Access to all current & future courses</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                                            <span>🧠 AI Smart Credit Analyzer & Simulator Vault</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                                            <span>🏛 Seat on Credit U Advisory Committee</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                                            <span>💼 Wealth Builders Circle Enterprise Hub</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-yellow-400 animate-pulse" />
                                            <span className="text-yellow-300 font-bold">🕊 I HAVE F.E.A.R.™ Faith Track</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                                            <span>5-Day Dorm Week Financial Onboarding</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                                            <span>Full Library Dispute Letter Templates</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                                            <span>Live Bi-Weekly Webinars with Dean Ashley</span>
                                        </div>
                                        {tier === 'legacy' && (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-yellow-400 animate-pulse" />
                                                <span className="text-yellow-300 font-bold">1-on-1 private audit sessions</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 mt-6 flex items-center justify-between text-xs text-slate-400">
                        <span>Admissions:</span>
                        <span className="font-mono text-yellow-300 font-bold uppercase">Summer Semester 2026</span>
                    </div>
                </div>

                {/* Right Side: Billing Form / Stripe Checkout */}
                <div className="flex-1 bg-[#0033A0]/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col justify-between">
                    {tier === 'founders' ? (
                        <div className="space-y-6 flex flex-col justify-between h-full">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                                    <h4 className="font-bold text-sm text-white uppercase tracking-wider">The Founders Key 🔑</h4>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed font-light">
                                    Become a founding member of the First 100 with lifetime access to all Credit U programs, the AI Tool Vault, and Founders Council privileges.
                                </p>

                                <div className="border-t border-white/10 pt-4 space-y-2">
                                    <span className="text-[10px] text-slate-400 uppercase font-black block">What's Included:</span>
                                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 font-light">
                                        <li>Smart Credit Analyzer & Debt Simulator AI</li>
                                        <li>Digital Engraving on Credit U Founders Wall</li>
                                        <li>Black Enterprise Hub Access ("Wealth Builders Circle")</li>
                                        <li>Guided affirmation journal & Faith-based Track</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                                    <span className="text-slate-400">One-Time Investment:</span>
                                    <span className="text-xl font-black text-yellow-400 font-mono">
                                        $497.00
                                    </span>
                                </div>

                                <button 
                                    type="button"
                                    onClick={() => window.open('https://buy.stripe.com/00wfZh3khcOQcfW86z7EQ06', '_blank')}
                                    className="w-full py-4 text-base font-black uppercase tracking-widest gap-2 bg-yellow-400 hover:bg-yellow-350 text-blue-900 shadow-xl shadow-yellow-950/20 rounded-xl transition-transform hover:scale-[1.02] flex items-center justify-center animate-pulse"
                                >
                                    🔑 Claim Founders Key
                                </button>
                                
                                <div className="flex justify-center items-center gap-1.5 text-[10px] text-slate-400">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <span>Direct, secure Stripe checkout</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleCheckout} className="space-y-5">
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="w-5 h-5 text-yellow-400" />
                                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Billing details</h4>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Name on Card</label>
                                <input 
                                    type="text" 
                                    required
                                    value={billingName}
                                    onChange={e => setBillingName(e.target.value)}
                                    placeholder="John Doe" 
                                    className="px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Card Number</label>
                                <input 
                                    type="text" 
                                    required
                                    value={cardNumber}
                                    onChange={e => setCardNumber(e.target.value)}
                                    className="px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white focus:outline-none focus:border-yellow-400 transition-colors text-sm font-mono"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Expiration</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={cardExpiry}
                                        onChange={e => setCardExpiry(e.target.value)}
                                        placeholder="MM/YY" 
                                        className="px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors text-sm font-mono"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-blue-200">CVC Code</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={cardCvc}
                                        onChange={e => setCardCvc(e.target.value)}
                                        placeholder="123" 
                                        maxLength={3}
                                        className="px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors text-sm font-mono"
                                    />
                                </div>
                            </div>

                            {/* Cost Display */}
                            <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                                <span className="text-slate-400">Total Due Today:</span>
                                <span className="text-xl font-black text-white font-mono">
                                    {tier === 'freshman' ? "$39.00" : "$149.00"}
                                </span>
                            </div>

                            <CustomButton 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-4 text-base font-black uppercase tracking-widest gap-2 bg-yellow-400 text-blue-900 shadow-xl shadow-yellow-950/20"
                            >
                                {isSubmitting ? "Processing..." : `Pay & Join Summer Semester`}
                            </CustomButton>

                            <div className="flex justify-center items-center gap-1.5 text-[10px] text-slate-400">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span>Secured 256-bit SSL encrypted connection</span>
                            </div>
                        </form>
                    )}

                    <div className="flex justify-start items-center border-t border-white/10 pt-4 mt-6">
                        <button 
                            onClick={() => navigate('/dormweek')}
                            className="inline-flex items-center justify-center gap-1 rounded-xl font-bold transition-all text-white hover:bg-white/10 text-xs uppercase py-2.5"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dorm Week
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
