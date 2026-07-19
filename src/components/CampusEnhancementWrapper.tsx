import { creditUFeatureFlags } from '../lib/featureFlags';
import { LivingCampusHeroOverlay } from './LivingCampusHeroOverlay';
import { DeanAshleyWelcome } from './DeanAshleyWelcome';
import { WhatYouReceivePreview } from './WhatYouReceivePreview';
import { CampusBuildingGrid } from './CampusBuildingGrid';
import { CampusTraditions } from './CampusTraditions';
import { CreditCowCampusGuide } from './CreditCowCampusGuide';

export function CampusEnhancementWrapper() {
  return (
    <>
      {creditUFeatureFlags.livingCampusOverlay && <LivingCampusHeroOverlay />}
      {creditUFeatureFlags.deanAshleyWelcome && <DeanAshleyWelcome />}
      {creditUFeatureFlags.whatYouReceivePreview && <WhatYouReceivePreview />}
      {creditUFeatureFlags.campusBuildingGrid && <CampusBuildingGrid />}
      {creditUFeatureFlags.campusTraditions && <CampusTraditions />}
      {creditUFeatureFlags.creditCowGuide && <CreditCowCampusGuide />}
    </>
  );
}
