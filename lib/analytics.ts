type AnalyticsEvent =
  | { name: 'skill_created'; data: { skillId: string; level: number } }
  | { name: 'skill_updated'; data: { skillId: string } }
  | { name: 'milestone_created'; data: { milestoneId: string; status: string } }
  | { name: 'asset_added'; data: { assetId: string; value: number } }
  | { name: 'talent_added'; data: { talentId: string } }
  | { name: 'strength_added'; data: { strengthId: string } }
  | { name: 'weakness_added'; data: { weaknessId: string } }
  | { name: 'initial_setup_completed'; data: { userId: string } }

type AnalyticsDestination = {
  log: (event: AnalyticsEvent) => Promise<void> | void
}

const destinations: AnalyticsDestination[] = []

export function registerAnalyticsDestination(destination: AnalyticsDestination) {
  destinations.push(destination)
}

export async function trackEvent(event: AnalyticsEvent) {
  for (const destination of destinations) {
    try {
      await destination.log(event)
    } catch (error) {
      console.warn('[analytics] Failed to send event', event.name, error)
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    console.info('[analytics]', event.name, event.data)
  }
}


