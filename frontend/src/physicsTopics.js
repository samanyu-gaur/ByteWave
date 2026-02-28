export const PHYSICS_TOPICS = [
  { id: 'motion',      name: 'Motion & Kinematics',    description: 'Position, velocity, acceleration, graphs and 2D motion', icon: '↗️', landingIcon: '→' },
  { id: 'forces',      name: 'Forces & Newton\'s Laws', description: 'Forces and motion basics',                                icon: '⚖️', landingIcon: '⇄' },
  { id: 'energy',      name: 'Work, Energy & Power',   description: 'Energy forms and conservation',                           icon: '⚡', landingIcon: '◎' },
  { id: 'waves',       name: 'Waves & Sound',          description: 'Transverse waves, longitudinal waves, frequency and sound', icon: '〰️', landingIcon: '∿' },
  { id: 'light',       name: 'Light & Radiation',      description: 'Optics and electromagnetic waves',                        icon: '💡', landingIcon: '✦' },
  { id: 'electricity', name: 'Electricity & Circuits', description: 'Charges, fields, circuits',                               icon: '🔌', landingIcon: '⊙' },
  { id: 'magnetism',   name: 'Magnetism',              description: 'Magnets and electromagnetic induction',                   icon: '🧲', landingIcon: '⟷' },
  { id: 'heat',        name: 'Heat & Thermodynamics',  description: 'Temperature and heat transfer',                           icon: '🌡️', landingIcon: '◐' },
  { id: 'gravity',     name: 'Gravity & Orbits',       description: 'Gravitational force and orbits',                          icon: '🌍', landingIcon: '⊕' },
  { id: 'quantum',     name: 'Atoms & Nuclei',         description: 'Atomic structure, nuclear decay and energy levels',       icon: '⚛️', landingIcon: '⊗' },
]

export function getTopicById(id) {
  return PHYSICS_TOPICS.find((t) => t.id === id) || null
}
