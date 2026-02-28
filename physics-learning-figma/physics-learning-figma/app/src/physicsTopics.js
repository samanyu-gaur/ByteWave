/**
 * Physics topics aligned with PhET-style categories.
 * - icon: used in learn (dashboard, skill map, cards)
 * - landingIcon: used on home/landing "Physics topics" tiles only
 * @see https://phet.colorado.edu/en/simulations/filter?subjects=physics&type=html
 */
export const PHYSICS_TOPICS = [
  { id: 'motion', name: 'Motion', description: 'Position, velocity, acceleration', icon: '↗️', landingIcon: '→' },
  { id: 'forces', name: 'Forces & Newton\'s Laws', description: 'Forces and motion basics', icon: '⚖️', landingIcon: '⇄' },
  { id: 'energy', name: 'Work, Energy & Power', description: 'Energy forms and conservation', icon: '⚡', landingIcon: '⚡' },
  { id: 'waves', name: 'Waves', description: 'Wave motion and properties', icon: '〰️', landingIcon: '∿' },
  { id: 'sound', name: 'Sound', description: 'Sound waves and frequency', icon: '🔊', landingIcon: '〰' },
  { id: 'light', name: 'Light & Radiation', description: 'Optics and electromagnetic waves', icon: '💡', landingIcon: '✦' },
  { id: 'electricity', name: 'Electricity & Circuits', description: 'Charges, fields, circuits', icon: '🔌', landingIcon: '⊙' },
  { id: 'magnetism', name: 'Magnetism', description: 'Magnets and electromagnetic induction', icon: '🧲', landingIcon: '⟷' },
  { id: 'heat', name: 'Heat & Thermodynamics', description: 'Temperature and heat transfer', icon: '🌡️', landingIcon: '◐' },
  { id: 'gravity', name: 'Gravity & Orbits', description: 'Gravitational force and orbits', icon: '🌍', landingIcon: '⊕' },
  { id: 'kinematics', name: 'Kinematics', description: 'Slope, graphs, 1D and 2D motion', icon: '📐', landingIcon: '▱' },
  { id: 'quantum', name: 'Quantum Phenomena', description: 'Quantum mechanics basics', icon: '⚛️', landingIcon: '⊗' },
]

export function getTopicById(id) {
  return PHYSICS_TOPICS.find((t) => t.id === id) || null
}

/** PhET physics simulations page (HTML5 filter) */
export const PHET_PHYSICS_URL = 'https://phet.colorado.edu/en/simulations/filter?subjects=physics&type=html'
