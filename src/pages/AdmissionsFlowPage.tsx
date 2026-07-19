import React from 'react';
import { EliteAdmissionsHero } from '../components/admissions/EliteAdmissionsHero';
import { DeanAshleyWelcome } from '../components/admissions/DeanAshleyWelcome';
import { CreditCowGuide } from '../components/admissions/CreditCowGuide';
import { InteractiveUnlockPanel } from '../components/admissions/InteractiveUnlockPanel';
import { AdmissionsProgressPreview } from '../components/admissions/AdmissionsProgressPreview';
import { RewardShowcase } from '../components/admissions/RewardShowcase';
import { PerceivedValueStack } from '../components/admissions/PerceivedValueStack';
import { FinancialOath } from '../components/admissions/FinancialOath';
import { AdmissionsCeremony } from '../components/admissions/AdmissionsCeremony';
import { LivingCampusBuildings } from '../components/campus/LivingCampusBuildings';
import { CampusEffectsLayer } from '../components/effects/CampusEffectsLayer';

export default function AdmissionsFlowPage() {
  const startExistingAssessment = () => {
    window.location.href = '/free-assessment/start';
  };

  const scrollToPreview = () => {
    document.getElementById('what-you-receive')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="relative min-h-screen bg-blue-950 px-4 py-8 md:px-8 text-left">
      <CampusEffectsLayer />
      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <EliteAdmissionsHero onStart={startExistingAssessment} onPreview={scrollToPreview} />
        <DeanAshleyWelcome />
        <FinancialOath onAgree={startExistingAssessment} />
        <AdmissionsProgressPreview currentStepIndex={0} />
        <section id="what-you-receive"><InteractiveUnlockPanel /></section>
        <RewardShowcase />
        <PerceivedValueStack />
        <AdmissionsCeremony onComplete={startExistingAssessment} />
        <LivingCampusBuildings />
      </div>
      <CreditCowGuide />
    </main>
  );
}
