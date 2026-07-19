"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Crown, GraduationCap, Sparkles } from "lucide-react";
import { assessmentQuestions } from "../data/assessmentQuestions";
import { AssessmentAnswers, calculateAssessment } from "../lib/assessmentEngine";
import { RECOMMENDED_CARDS } from "../data/admissionsData";

export default function FreeAssessment() {
  const [questions] = useState(() => {
    const stored = localStorage.getItem('cu_custom_assessment_questions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(q => ({
            id: q.id,
            title: q.label || q.title,
            subtitle: q.subtitle || '',
            required: q.required !== false,
            type: q.type === 'select' ? 'single' : q.type === 'multi' ? 'multi' : 'single',
            options: q.options || []
          }));
        }
      } catch (e) {}
    }
    return assessmentQuestions;
  });

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const current = questions[step];
  const progress = Math.round(((step + 1) / questions.length) * 100);
  const result = useMemo(() => calculateAssessment(answers), [answers]);

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function toggleMulti(id: string, value: string) {
    setAnswers((prev) => {
      const existing = Array.isArray(prev[id]) ? (prev[id] as string[]) : [];
      return {
        ...prev,
        [id]: existing.includes(value) ? existing.filter((x) => x !== value) : [...existing, value]
      };
    });
  }

  async function finish() {
    setSaving(true);
    try {
      await fetch("/api/free-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, result, source: "Free Credit U Assessment Enhancement" })
      });
    } catch {
      // Local completion still works if API/Supabase is not configured.
    } finally {
      // Save name for Dorm Week
      const nameVal = answers.fullName || answers.name || 'Honored Student';
      localStorage.setItem('cu_funnel_current_student', nameVal);
      
      const readiness = result.readinessPercent || 70;
      const calculatedScore = Math.round(300 + (readiness / 100) * 550);
      
      let dormVal = 'Recovery Hall';
      if (calculatedScore >= 740) dormVal = 'Wealth Hall';
      else if (calculatedScore >= 670) dormVal = 'Mission 800 Hall';
      else if (calculatedScore >= 580) dormVal = 'Homeownership Hall';

      const recommendedCardVal = RECOMMENDED_CARDS.find((c: any) => calculatedScore >= c.minScore && calculatedScore <= c.maxScore) || RECOMMENDED_CARDS[RECOMMENDED_CARDS.length - 1];
      const gpaValue = Math.round((1.0 + (readiness / 100) * 3.0) * 100) / 100;

      // Save full submission for results and spin pages
      const submissionObj = {
        id: 'sub_' + Date.now(),
        timestamp: new Date().toISOString(),
        formData: {
          fullName: nameVal,
          email: answers.email || '',
          phone: answers.phone || '',
          creditScoreRange: answers.currentScore || '580-669',
          creditGoal: answers.targetGoal || 'FIX',
          creditChallenge: answers.biggestBarrier || 'Collection Accounts',
          interestType: 'Waitlist Only'
        },
        score: calculatedScore,
        dorm: dormVal,
        gpa: gpaValue,
        recommendedCard: recommendedCardVal,
        statusTags: ['Pre-Registered', dormVal],
        results: result
      };
      localStorage.setItem('cu_current_submission', JSON.stringify(submissionObj));

      setSaving(false);
      setSubmitted(true);
    }
  }

  const canContinue = !current?.required || Boolean(answers[current.id]) && (!Array.isArray(answers[current.id]) || (answers[current.id] as string[]).length > 0);

  if (submitted) {
    return <AssessmentResults answers={answers} result={result} />;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0057FF_0%,#061A40_38%,#020817_100%)] text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-creditGold text-creditNavy shadow-gold">
              <Crown className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-creditGold">Credit U Admissions</p>
              <h1 className="text-2xl font-black">Free Credit U Assessment™</h1>
            </div>
          </div>
          <div className="hidden rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 md:block">
            Entrance Exam Enhancement • Do Not Replace Existing Exam
          </div>
        </div>

        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-creditGold/50 bg-creditGold/10 px-4 py-2 text-creditGold">
              <Sparkles className="h-4 w-4" />
              Welcome Future Student
            </div>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">
              Discover where you are. See your path forward.
            </h2>
            <p className="max-w-xl text-lg text-white/80">
              This assessment enhances the Credit U Entrance Exam by turning it into a full admissions experience: Financial DNA™, GPA, campus placement, degree plan, and acceptance letter.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "No shame",
                "Personalized path",
                "Mission 800™ ready"
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center font-bold backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-campus backdrop-blur-xl md:p-8">
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-sm text-white/70">
                <span>Admissions Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-creditGold transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="mb-6 rounded-3xl bg-white p-6 text-creditNavy">
              <p className="mb-2 text-sm font-black uppercase tracking-[0.25em] text-creditRoyal">Question {step + 1}</p>
              <h3 className="text-2xl font-black">{current.title}</h3>
              {current.subtitle && <p className="mt-2 text-sm text-slate-600">{current.subtitle}</p>}

              <div className="mt-6 space-y-3">
                {(current.type === "text" || current.type === "email" || current.type === "phone") && (
                  <input
                    className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-lg outline-none ring-creditRoyal focus:ring-4"
                    type={current.type === "email" ? "email" : current.type === "phone" ? "tel" : "text"}
                    value={(answers[current.id] as string) ?? ""}
                    onChange={(e) => setAnswer(current.id, e.target.value)}
                    placeholder="Type your answer..."
                  />
                )}

                {current.type === "single" && current.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswer(current.id, option.value)}
                    className={`w-full rounded-2xl border p-4 text-left font-bold transition ${answers[current.id] === option.value ? "border-creditRoyal bg-creditRoyal text-white" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}
                  >
                    {option.label}
                  </button>
                ))}

                {current.type === "multi" && current.options?.map((option) => {
                  const selected = Array.isArray(answers[current.id]) && (answers[current.id] as string[]).includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => toggleMulti(current.id, option.value)}
                      className={`w-full rounded-2xl border p-4 text-left font-bold transition ${selected ? "border-creditRoyal bg-creditRoyal text-white" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="rounded-full border border-white/20 px-5 py-3 font-bold text-white/80 disabled:opacity-30"
                disabled={step === 0}
              >
                Back
              </button>
              {step < questions.length - 1 ? (
                <button
                  disabled={!canContinue}
                  onClick={() => setStep((s) => s + 1)}
                  className="inline-flex items-center gap-2 rounded-full bg-creditGold px-6 py-3 font-black text-creditNavy disabled:opacity-40"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  disabled={!canContinue || saving}
                  onClick={finish}
                  className="inline-flex items-center gap-2 rounded-full bg-creditGold px-6 py-3 font-black text-creditNavy disabled:opacity-40"
                >
                  {saving ? "Preparing Results..." : "Receive My Results"} <BadgeCheck className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function AssessmentResults({ answers, result }: { answers: AssessmentAnswers; result: ReturnType<typeof calculateAssessment> }) {
  function downloadRealityCheckSheet() {
    const docHeader = `%PDF-1.4\n%âãÏÓ\n`;
    let pdf = docHeader;
    let objCount = 0;
    const offsets: number[] = [];

    function addObj(content: string) {
      offsets.push(pdf.length);
      objCount++;
      pdf += `${objCount} 0 obj\n${content}\nendobj\n`;
      return objCount;
    }

    addObj(`<< /Type /Pages /Kids [ 5 0 R ] /Count 1 >>`); // 1
    addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`); // 2
    addObj(`<< /Type /Catalog /Pages 1 0 R >>`); // 3

    const fullName = (answers.fullName as string || "Future Student");
    const firstName = fullName.split(" ")[0];
    const placement = result.campusPlacement;
    const dna = result.financialDNA;
    const major = result.major;
    const dateStr = new Date().toLocaleDateString();
    const year = new Date().getFullYear();

    const escapePDF = (str: string) => (str || '').replace(/[()]/g, (m) => '\\' + m);

    let contentStream = '';
    // 1. Royal Blue Header Block: X=40, Y=700, W=515, H=52
    contentStream += 'q 0.00 0.20 0.63 rg 40 700 515 52 re f Q\n';
    // 2. Gold Accent Line underneath: X=40, Y=696, W=515, H=4
    contentStream += 'q 0.99 0.71 0.08 rg 40 696 515 4 re f Q\n';
    // 3. Double-border gold shield badge at top right: X=500, Y=705, W=32, H=40
    contentStream += 'q 0.99 0.71 0.08 rg 500 705 32 40 re f Q\n';

    contentStream += 'BT\n';
    contentStream += `/F1 16 Tf 1 1 1 rg 1 0 0 1 55 730 Tm (CREDIT U - REGISTRAR'S OFFICE) Tj\n`;
    contentStream += `/F2 10 Tf 0.99 0.71 0.08 rg 1 0 0 1 55 712 Tm (DORM WEEK RUSH - OFFICIAL STUDENT ASSIGNMENT) Tj\n`;
    
    // Title
    contentStream += `/F1 20 Tf 0.00 0.20 0.63 rg 1 0 0 1 40 660 Tm (Credit Reality Check Sheet) Tj\n`;
    contentStream += 'ET\n';

    // 4. Student Profile Card: X=40, Y=500, W=515, H=140
    contentStream += 'q 0.95 0.97 0.99 rg 40 500 515 140 re f Q\n';
    contentStream += 'q 0.99 0.71 0.08 rg 40 500 5 140 re f Q\n'; // Gold left border

    contentStream += 'BT\n';
    contentStream += `/F1 11 Tf 0.00 0.20 0.63 rg 1 0 0 1 60 610 Tm (STUDENT PROFILE DETAILS) Tj\n`;
    contentStream += `/F1 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 60 585 Tm (Student Name:) Tj\n`;
    contentStream += `/F2 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 145 585 Tm (${escapePDF(fullName)}) Tj\n`;
    contentStream += `/F1 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 60 560 Tm (Placement:) Tj\n`;
    contentStream += `/F2 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 145 560 Tm (${escapePDF(placement)}) Tj\n`;
    contentStream += `/F1 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 60 535 Tm (Financial DNA:) Tj\n`;
    contentStream += `/F2 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 145 535 Tm (${escapePDF(dna)}) Tj\n`;

    contentStream += `/F1 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 320 585 Tm (Recommended Major:) Tj\n`;
    contentStream += `/F2 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 435 585 Tm (${escapePDF(major)}) Tj\n`;
    contentStream += `/F1 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 320 560 Tm (Admissions Class:) Tj\n`;
    contentStream += `/F2 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 435 560 Tm (Founding Student) Tj\n`;
    contentStream += `/F1 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 320 535 Tm (Assessment Status:) Tj\n`;
    contentStream += `/F2 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 435 535 Tm (Completed) Tj\n`;
    contentStream += `/F2 9 Tf 0.5 0.5 0.5 rg 1 0 0 1 60 512 Tm (Generated: ${escapePDF(dateStr)} | Target: Mission 800) Tj\n`;
    contentStream += 'ET\n';

    // 5. Assignment Purpose
    contentStream += 'BT\n';
    contentStream += `/F2 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 470 Tm (This worksheet helps students identify what is currently impacting their credit profile so Credit U) Tj\n`;
    contentStream += `/F2 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 455 Tm (can guide their next financial move with clarity, strategy, and confidence.) Tj\n`;

    // 6. Checklist Section
    contentStream += `/F1 12 Tf 0.00 0.20 0.63 rg 1 0 0 1 40 425 Tm (I. REQUIRED AUDIT CHECKLIST) Tj\n`;
    contentStream += 'ET\n';
    contentStream += 'q 0.8 0.8 0.8 RG 0.5 w 40 415 m 555 415 l S Q\n';

    contentStream += 'BT\n';
    contentStream += `/F2 10.5 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 395 Tm ([  ]  Pull your credit reports from all three credit bureaus.) Tj\n`;
    contentStream += `/F2 10.5 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 375 Tm ([  ]  Review inquiries made in the last 12 months and flag unverified ones.) Tj\n`;
    contentStream += `/F2 10.5 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 355 Tm ([  ]  Calculate utilization by comparing total balances to total limits.) Tj\n`;
    contentStream += `/F2 10.5 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 335 Tm ([  ]  Identify negative accounts, late payments, collections, or charge-offs.) Tj\n`;
    contentStream += `/F2 10.5 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 315 Tm ([  ]  Set your target FICO score goals and write concerns below.) Tj\n`;
    contentStream += `/F2 10.5 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 295 Tm ([  ]  Save your findings inside the Credit U student portal.) Tj\n`;

    // 7. Reflection Section
    contentStream += `/F1 12 Tf 0.00 0.20 0.63 rg 1 0 0 1 40 265 Tm (II. STUDENT REFLECTION & ACTIONS) Tj\n`;
    contentStream += 'ET\n';
    contentStream += 'q 0.8 0.8 0.8 RG 0.5 w 40 255 m 555 255 l S Q\n';

    contentStream += 'BT\n';
    contentStream += `/F1 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 238 Tm (My Top 3 Credit Concerns:) Tj\n`;
    contentStream += `/F2 10 Tf 0.4 0.4 0.4 rg 1 0 0 1 40 220 Tm (1. _______________________________________________________________________________) Tj\n`;
    contentStream += `/F2 10 Tf 0.4 0.4 0.4 rg 1 0 0 1 40 200 Tm (2. _______________________________________________________________________________) Tj\n`;
    contentStream += `/F2 10 Tf 0.4 0.4 0.4 rg 1 0 0 1 40 180 Tm (3. _______________________________________________________________________________) Tj\n`;

    contentStream += `/F1 10 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 152 Tm (My Next Money Move:) Tj\n`;
    contentStream += `/F2 10 Tf 0.4 0.4 0.4 rg 1 0 0 1 40 135 Tm (__________________________________________________________________________________) Tj\n`;

    // 8. Signature Section
    contentStream += `/F2 9.5 Tf 0.15 0.15 0.15 rg 1 0 0 1 40 90 Tm (Student Signature: _______________________) Tj\n`;
    contentStream += `/F2 9.5 Tf 0.15 0.15 0.15 rg 1 0 0 1 310 90 Tm (Dean Ashley J. Signature: __________________) Tj\n`;
    contentStream += 'ET\n';

    // Gold Wax Seal at Bottom Right
    contentStream += 'q 0.99 0.71 0.08 rg 505 75 35 35 re f Q\n';

    // 9. Footer
    contentStream += 'q 0.8 0.8 0.8 RG 0.5 w 40 60 m 555 60 l S Q\n';
    contentStream += 'BT\n';
    contentStream += `/F2 7 Tf 0.4 0.4 0.4 rg 1 0 0 1 40 46 Tm (Educational use only. Credit U provides financial education and planning tools. Credit U does not guarantee credit score) Tj\n`;
    contentStream += `/F2 7 Tf 0.4 0.4 0.4 rg 1 0 0 1 40 36 Tm (increases, approvals, funding, or credit outcomes. Results depend on student action, reports, and individual financial profile.) Tj\n`;
    contentStream += 'ET\n';

    const streamLength = contentStream.length;
    addObj(`<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream`); // 4
    
    // Page catalog pointing to fonts (F1=obj 2, F2=obj 6)
    addObj(`<< /Type /Page /Parent 1 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 2 0 R /F2 6 0 R >> >> >>`); // 5

    // Add font Helvetica (regular)
    addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`); // 6

    const startXref = pdf.length;
    pdf += `xref\n0 ${objCount + 1}\n0000000000 65535 f\n`;
    for (let i = 0; i < objCount; i++) {
      const offsetStr = String(offsets[i]).padStart(10, '0');
      pdf += `${offsetStr} 00000 n\n`;
    }
    pdf += `trailer\n<< /Size ${objCount + 1} /Root 3 0 R >>\nstartxref\n${startXref}\n%%EOF`;

    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeFirstName = firstName.replace(/[^a-zA-Z0-9]/g, '');
    link.download = `CreditU_CreditRealityCheckSheet_${safeFirstName}_${year}.pdf`;
    link.click();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[2rem] border border-creditGold/30 bg-gradient-to-br from-creditBlue to-creditNavy p-8 shadow-campus">
          <div className="mb-5 flex items-center gap-3 text-creditGold">
            <GraduationCap className="h-8 w-8" />
            <p className="font-black uppercase tracking-[0.35em]">Official Admissions Result</p>
          </div>
          <h1 className="text-4xl font-black md:text-6xl">Congratulations, {(answers.fullName as string) || "Future Student"}.</h1>
          <p className="mt-4 max-w-3xl text-xl text-white/85">{result.acceptanceMessage}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <ResultCard label="Readiness" value={`${result.readinessPercent}%`} />
          <ResultCard label="Financial DNA™" value={result.financialDNA} />
          <ResultCard label="Campus Placement™" value={result.campusPlacement} />
          <ResultCard label="Recommended Major" value={result.major} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-6 text-creditNavy">
            <h2 className="mb-4 text-2xl font-black">Growth Potential Assessment™ GPA</h2>
            <div className="space-y-3">
              {Object.entries(result.gpa).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between rounded-2xl bg-slate-100 p-4">
                  <span className="font-bold">{key}</span>
                  <span className="rounded-full bg-creditGold px-4 py-1 font-black">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 text-creditNavy">
            <h2 className="mb-4 text-2xl font-black">Personalized Degree Plan™</h2>
            <ol className="space-y-3">
              {result.degreePlan.map((item, index) => (
                <li key={item} className="rounded-2xl bg-slate-100 p-4 font-semibold">
                  <span className="mr-2 font-black text-creditRoyal">{index + 1}.</span>{item}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur text-left">
          <h2 className="text-3xl font-black text-creditGold">Your First Assignment</h2>
          <p className="mt-3 text-lg text-white/85 leading-relaxed">{result.firstAssignment}</p>
          <div className="mt-5 flex flex-wrap gap-4">
            <button
              onClick={downloadRealityCheckSheet}
              className="py-4 px-6 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-450 text-blue-950 font-black text-xs uppercase rounded-xl tracking-wider shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              📥 DOWNLOAD CREDIT REALITY CHECK SHEET™
            </button>
          </div>
          <div className="mt-6 rounded-2xl bg-creditBlue/60 border border-white/15 p-5 font-bold text-white">
            <span className="text-creditGold">Next Step Action Plan:</span> {result.nextStep}
          </div>
        </div>

        {/* FORMS & NEXT STEPS DASHBOARD */}
        <div className="mt-6 rounded-[2rem] border border-yellow-400/20 bg-[#001b57] p-8 shadow-2xl text-left">
          <h2 className="text-3xl font-black text-yellow-300">Forms & Next Steps Dashboard</h2>
          <p className="mt-2 text-sm text-slate-300">Complete all remaining forms to finalize your enrollment and activate your student status.</p>
          
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">FORM D1</span>
                <h3 className="text-xl font-bold text-white mt-2">Free Credit U Assessment™</h3>
                <p className="text-xs text-slate-400 mt-1">Official entrance evaluation, financial DNA profile, and campus placement.</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400">✓ COMPLETED</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">FORM D2</span>
                <h3 className="text-xl font-bold text-white mt-2">Transcript Requirement</h3>
                <p className="text-xs text-slate-400 mt-1">Submit your credit history report for a detailed curriculum analysis.</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-black text-yellow-300">⚡ PENDING ACTION</span>
                <Link to="/transcript" className="py-2 px-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-xs uppercase rounded-xl tracking-wide transition-all">
                  START FORM
                </Link>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">FORM D3</span>
                <h3 className="text-xl font-bold text-white mt-2">Admissions Prize Wheel™</h3>
                <p className="text-xs text-slate-400 mt-1">Spin the interactive wheel to unlock accepted student roadmaps and tuition credits.</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-black text-yellow-300">⚡ PENDING ACTION</span>
                <Link to="/spin" className="py-2 px-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-xs uppercase rounded-xl tracking-wide transition-all">
                  SPIN WHEEL
                </Link>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">FORM D4</span>
                <h3 className="text-xl font-bold text-white mt-2">Dorm Week Onboarding</h3>
                <p className="text-xs text-slate-400 mt-1">Reserve your campus dorm room and claim your 7 private onboarding days.</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-black text-yellow-300">⚡ PENDING ACTION</span>
                <Link to="/dorm-week-rush" className="py-2 px-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-xs uppercase rounded-xl tracking-wide transition-all">
                  CLAIM DORM
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
      <p className="text-sm uppercase tracking-[0.25em] text-creditGold">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
