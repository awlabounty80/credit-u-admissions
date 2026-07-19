"use client";

import { useEffect } from "react";
import { ArrowRight, BadgeCheck, Crown, GraduationCap, ShieldCheck, Sparkles, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { trackFunnelEvent } from "../lib/analytics";

type FunnelCardProps = {
  assessmentUrl?: string;
  variant?: "hero" | "compact";
  audienceLabel?: string;
};

const outcomes = [
  "Financial GPA™",
  "Credit Confidence Score™",
  "Financial DNA™ Profile",
  "Campus Placement™",
  "Personalized Degree Plan™",
  "Admissions Decision"
];

const trustSignals = [
  "No judgment",
  "5–10 minutes",
  "Personalized roadmap",
  "Built for your next money move"
];

export default function CreditUAssessmentFunnelCard({
  assessmentUrl = "/free-assessment/start",
  variant = "hero",
  audienceLabel = "Future Credit U Student"
}: FunnelCardProps) {
  useEffect(() => {
    trackFunnelEvent("funnel_card_view", { variant, audienceLabel });
  }, [variant, audienceLabel]);

  const handlePrimaryClick = () => {
    trackFunnelEvent("funnel_card_cta_click", { cta: "take_assessment", variant });
  };

  const handleSecondaryClick = () => {
    trackFunnelEvent("funnel_card_secondary_click", { cta: "preview_results", variant });
  };

  return (
    <section className="relative overflow-hidden rounded-luxury border border-white/20 bg-creditBlue p-1 shadow-luxury">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,216,77,.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(23,75,255,.38),transparent_38%)]" />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-creditGold/20 blur-3xl" />
      <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-royalBlue/30 blur-3xl" />

      <div className="relative rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-creditBlue via-campusBlue to-ink px-6 py-8 text-white md:px-10 md:py-12">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-creditGold/40 bg-creditGold/15 px-4 py-2 text-sm font-semibold text-creditGold">
            <Crown className="h-4 w-4" /> {audienceLabel}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85">
            <ShieldCheck className="h-4 w-4" /> Free Admissions Assessment
          </span>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[.22em] text-creditGold">
                <Sparkles className="h-4 w-4" /> It Starts With U
              </p>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.02] md:text-6xl">
                Discover Your Financial GPA Before Your Next Money Move.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82 md:text-xl">
                The Free Credit U Assessment™ is your personalized financial entrance exam. Learn where you stand, what is holding you back, and the exact Credit U path designed for your next level.
              </p>
            </motion.div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {trustSignals.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-creditGold" />
                  <span className="text-sm font-semibold text-white/90">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={assessmentUrl}
                onClick={handlePrimaryClick}
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-creditGold px-6 py-4 text-base font-black text-creditBlue shadow-glow transition hover:-translate-y-0.5 hover:bg-white"
              >
                Take the Free Assessment <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </a>
              <a
                href="#assessment-preview"
                onClick={handleSecondaryClick}
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-base font-bold text-white transition hover:bg-white/15"
              >
                Preview What You’ll Receive
              </a>
            </div>

            <p className="mt-4 text-sm text-white/60">
              Educational assessment only. Results are designed to guide learning and next steps, not guarantee credit outcomes.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-[2rem] border border-creditGold/30 bg-white p-5 text-ink shadow-glow">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-cream to-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[.18em] text-campusBlue">Credit U Admissions</p>
                    <h2 className="text-2xl font-black text-creditBlue">Assessment Unlocks</h2>
                  </div>
                  <div className="rounded-2xl bg-creditBlue p-3 text-creditGold">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                </div>

                <div className="space-y-3" id="assessment-preview">
                  {outcomes.map((item, index) => (
                    <div key={item} className="flex items-center justify-between rounded-2xl border border-creditBlue/10 bg-white px-4 py-3 shadow-sm">
                      <span className="flex items-center gap-3 font-bold text-creditBlue">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-creditGold/25 text-sm font-black text-creditBlue">{index + 1}</span>
                        {item}
                      </span>
                      <Star className="h-4 w-4 fill-honeyGold text-honeyGold" />
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-creditBlue p-5 text-white">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-creditGold" />
                    <div>
                      <p className="text-sm text-white/75">Your next step</p>
                      <p className="text-xl font-black">Receive Your Credit U Admissions Decision™</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
