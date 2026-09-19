export interface WizardSeedEntry {
  name: string
  role: string
  pct: number
}

export const WIZARD_SEEDS: Record<string, { title: string; entries: WizardSeedEntry[] }> = {
  'solo-ep': {
    title: 'Solo artist EP',
    entries: [
      { name: 'Artist', role: 'Artist', pct: 90 },
      { name: 'Producer', role: 'Producer', pct: 5 },
      { name: 'Sparkz treasury', role: 'Other', pct: 5 },
    ],
  },
  'collab-single': {
    title: 'Collab single',
    entries: [
      { name: 'Artist A', role: 'Artist', pct: 47 },
      { name: 'Artist B', role: 'Featured Artist', pct: 47 },
      { name: 'Sparkz treasury', role: 'Other', pct: 6 },
    ],
  },
  'band-album': {
    title: 'Band album',
    entries: [
      { name: 'Member 1', role: 'Artist', pct: 18 },
      { name: 'Member 2', role: 'Artist', pct: 18 },
      { name: 'Member 3', role: 'Artist', pct: 18 },
      { name: 'Member 4', role: 'Artist', pct: 18 },
      { name: 'Member 5', role: 'Artist', pct: 18 },
      { name: 'Sparkz treasury', role: 'Other', pct: 10 },
    ],
  },
  'group-crowdfund': {
    title: 'Group crowdfund',
    entries: [
      { name: 'Top backers pool', role: 'Other', pct: 50 },
      { name: 'Community treasury', role: 'Other', pct: 30 },
      { name: 'Organizer', role: 'Manager', pct: 15 },
      { name: 'Sparkz treasury', role: 'Other', pct: 5 },
    ],
  },
  'tour-event': {
    title: 'Tour / event',
    entries: [
      { name: 'Headliner A', role: 'Artist', pct: 35 },
      { name: 'Headliner B', role: 'Featured Artist', pct: 35 },
      { name: 'Venue', role: 'Other', pct: 20 },
      { name: 'Booking org', role: 'Manager', pct: 10 },
    ],
  },
  'podcast-collab': {
    title: 'Podcast collab',
    entries: [
      { name: 'Host', role: 'Artist', pct: 70 },
      { name: 'Episode guest', role: 'Featured Artist', pct: 20 },
      { name: 'Editor', role: 'Mixer', pct: 5 },
      { name: 'Sparkz treasury', role: 'Other', pct: 5 },
    ],
  },
  'fan-backed': {
    title: 'Fan-backed project',
    entries: [
      { name: 'Artist', role: 'Artist', pct: 70 },
      { name: 'Fan backer pool', role: 'Other', pct: 20 },
      { name: 'Sparkz treasury', role: 'Other', pct: 10 },
    ],
  },
  'tokenless-patronage': {
    title: 'Tokenless patronage',
    entries: [
      { name: 'Creator', role: 'Artist', pct: 97 },
      { name: 'Community pool', role: 'Other', pct: 1 },
      { name: 'Sparkz treasury', role: 'Other', pct: 2 },
    ],
  },
  'zao-backed': {
    title: 'ZAO-backed launch',
    entries: [
      { name: 'Creator', role: 'Artist', pct: 88 },
      { name: 'ZAO locked stake', role: 'Other', pct: 5 },
      { name: 'Community treasury', role: 'Other', pct: 4 },
      { name: 'Sparkz compute', role: 'Other', pct: 3 },
    ],
  },
}
