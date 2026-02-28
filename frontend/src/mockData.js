// Mock data used when the backend API is unavailable (no server running)

export const MOCK_PROGRESS = [
  { skill_id: 'motion', skill_name: 'Motion & Kinematics', status: 'In progress', mastery_score: 65 },
  { skill_id: 'forces', skill_name: 'Forces & Newton\'s Laws', status: 'Not started', mastery_score: 0 },
  { skill_id: 'energy', skill_name: 'Work, Energy & Power', status: 'Mastered', mastery_score: 92 },
  { skill_id: 'waves', skill_name: 'Waves & Sound', status: 'Not started', mastery_score: 0 },
  { skill_id: 'light', skill_name: 'Light & Radiation', status: 'In progress', mastery_score: 45 },
  { skill_id: 'electricity', skill_name: 'Electricity & Circuits', status: 'Not started', mastery_score: 0 },
  { skill_id: 'magnetism', skill_name: 'Magnetism', status: 'Mastered', mastery_score: 88 },
  { skill_id: 'heat', skill_name: 'Heat & Thermodynamics', status: 'Not started', mastery_score: 0 },
  { skill_id: 'gravity', skill_name: 'Gravity & Orbits', status: 'In progress', mastery_score: 55 },
  { skill_id: 'quantum', skill_name: 'Atoms & Nuclei', status: 'Not started', mastery_score: 0 },
]

export const MOCK_RECOMMENDATIONS = [
  { item_id: 'motion', item_name: 'Motion & Kinematics', recommendation_type: 'Next for you', match_score: 92, reason: "You're 65% through — keep going" },
  { item_id: 'light', item_name: 'Light & Radiation', recommendation_type: 'Next for you', match_score: 85, reason: 'Good momentum here' },
  { item_id: 'gravity', item_name: 'Gravity & Orbits', recommendation_type: 'Next for you', match_score: 78, reason: 'New topic — good time to start' },
  { item_id: 'forces', item_name: 'Forces & Newton\'s Laws', recommendation_type: 'Review', match_score: 70, reason: "Haven't practiced this recently" },
  { item_id: 'waves', item_name: 'Waves & Sound', recommendation_type: 'Review', match_score: 62, reason: 'Refresh your wave knowledge' },
  { item_id: 'energy', item_name: 'Work, Energy & Power', recommendation_type: 'Ready to master', match_score: 55, reason: 'Score is 92 — one more case to seal it' },
  { item_id: 'magnetism', item_name: 'Magnetism', recommendation_type: 'Ready to master', match_score: 50, reason: 'Strong score — finish it off' },
]

export const MOCK_CASES_BY_SKILL = {
  motion: [
    {
      id: 'motion-1',
      title: 'Ball on a slope',
      description: 'Calculate acceleration down an inclined plane using v = u + at',
      question: 'A ball starts from rest and rolls down a slope, reaching the bottom in 2 s with a final speed of 8 m/s. (a) Calculate the acceleration. (b) How long is the slope?',
      animationUrl: '/manim_videos/main/480p15/InclineFallingBall.mp4'
    },
    {
      id: 'motion-2',
      title: 'Car braking distance',
      description: 'Use kinematics equations to find stopping distance from speed and deceleration',
      question: 'A car travelling at 20 m/s applies its brakes and decelerates uniformly at 4 m/s². How far does the car travel before coming to rest? Use v² = u² + 2as.',
    },
    {
      id: 'motion-3',
      title: 'Projectile launch',
      description: 'Resolve initial velocity into horizontal and vertical components',
      question: 'A ball is kicked horizontally at 15 m/s from the top of a 20 m cliff. (a) How long does it take to land? (b) How far from the base of the cliff does it land? (g = 10 m/s²)',
      animationUrl: '/manim_videos/kinematics/1080p60/ProjectileMotion.mp4'
    },
  ],
  forces: [
    {
      id: 'forces-1',
      title: 'Tug of war',
      description: 'Find resultant force and predict acceleration',
      question: 'Two teams pull a rope. Team A pulls with 600 N to the right, Team B with 450 N to the left. The rope has mass 5 kg. (a) Find the resultant force. (b) Calculate the rope\'s acceleration.',
    },
    {
      id: 'forces-2',
      title: 'Box on a rough surface',
      description: "Apply Newton's second law accounting for friction",
      question: 'A 10 kg box is pushed with 80 N. The friction force is 30 N. (a) Find the net force. (b) Calculate the acceleration. (c) How fast is it moving after 4 s from rest?',
      animationUrl: '/manim_videos/trolley/1080p60/PulleySystem.mp4'
    },
    {
      id: 'forces-3',
      title: 'Elevator ride',
      description: 'Calculate normal force during acceleration in a lift',
      question: 'A 60 kg person stands in a lift accelerating upward at 2 m/s². (a) Draw a free-body diagram. (b) Calculate the normal force from the floor. (g = 10 m/s²)',
    },
  ],
  energy: [
    {
      id: 'energy-1',
      title: 'Rollercoaster drop',
      description: 'Convert gravitational PE to KE and find speed at the bottom',
      question: 'A 500 kg rollercoaster car starts from rest at the top of a 40 m drop. Assuming no friction, calculate its speed at the bottom using conservation of energy. (g = 10 m/s²)',
      animationUrl: '/manim_videos/energy/1080p60/EnergyPendulum.mp4'
    },
    {
      id: 'energy-2',
      title: 'Pushing a crate',
      description: 'Calculate work done and power output when moving a load',
      question: 'A worker pushes a 200 kg crate 15 m along a flat floor using a horizontal force of 400 N in 20 s. (a) Calculate the work done. (b) Calculate the power output.',
    },
    {
      id: 'energy-3',
      title: 'Spring launcher',
      description: 'Use elastic PE stored in a spring to find projectile speed',
      question: 'A spring with spring constant k = 500 N/m is compressed 0.1 m and launches a 0.05 kg ball. Assuming all the spring\'s elastic PE converts to kinetic energy, find the ball\'s launch speed.',
    },
  ],
  waves: [
    {
      id: 'waves-1',
      title: 'Ripple tank',
      description: 'Measure wavelength and frequency to find wave speed',
      question: 'Water waves in a ripple tank have a frequency of 4 Hz and a wavelength of 3 cm. (a) Calculate the wave speed. (b) If the frequency doubles, what happens to the speed and wavelength?',
      animationUrl: '/manim_videos/wavesound/1080p60/WaveSound.mp4'
    },
    {
      id: 'waves-2',
      title: 'Echo sounder',
      description: 'Use time delay of reflected sound to calculate distance',
      question: 'A ship\'s sonar emits a sound pulse and detects the echo from the seabed 0.6 s later. The speed of sound in water is 1500 m/s. Calculate the depth of the ocean below the ship.',
    },
    {
      id: 'waves-3',
      title: 'Guitar string harmonics',
      description: 'Identify fundamental frequency and harmonics on a standing wave',
      question: 'A guitar string vibrates with a fundamental frequency of 220 Hz. (a) What is the frequency of the second harmonic? (b) If the string length is 65 cm, calculate the wave speed on the string.',
    },
  ],
  light: [
    {
      id: 'light-1',
      title: 'Glass prism refraction',
      description: "Apply Snell's law at an air-glass boundary",
      question: 'A ray of light hits a glass surface at an angle of incidence of 40°. The refractive index of glass is 1.5. (a) Apply Snell\'s law to find the angle of refraction. (b) Does the ray bend towards or away from the normal?',
    },
    {
      id: 'light-2',
      title: 'Mirror reflection',
      description: 'Use law of reflection to locate image in a plane mirror',
      question: 'A student stands 2 m in front of a plane mirror. (a) Where does the image appear? (b) What are the properties of the image (real/virtual, upright/inverted, magnification)? (c) The student walks 0.5 m closer — how far is the image from the student now?',
    },
    {
      id: 'light-3',
      title: 'Fibre optic cable',
      description: 'Calculate critical angle for total internal reflection',
      question: 'A glass fibre has a refractive index of 1.6. (a) Calculate the critical angle for total internal reflection at the glass-air boundary. (b) Explain why TIR is essential for fibre optic communication.',
    },
  ],
  electricity: [
    {
      id: 'elec-1',
      title: 'Simple circuit',
      description: "Calculate current and resistance using Ohm's law V = IR",
      question: 'A 12 V battery is connected to a resistor. The current in the circuit is 0.5 A. (a) Calculate the resistance. (b) How much charge flows through the circuit in 2 minutes? (c) Calculate the power dissipated.',
    },
    {
      id: 'elec-2',
      title: 'Series resistors',
      description: 'Find total resistance and voltage drops across series components',
      question: 'Three resistors of 10 Ω, 20 Ω, and 30 Ω are connected in series to a 12 V supply. (a) Calculate the total resistance. (b) Find the current in the circuit. (c) What is the voltage drop across the 20 Ω resistor?',
    },
    {
      id: 'elec-3',
      title: 'Parallel circuit',
      description: 'Calculate branch currents and total resistance in parallel',
      question: 'A 6 Ω and a 12 Ω resistor are connected in parallel across a 12 V supply. (a) Calculate the current through each resistor. (b) Find the total current from the supply. (c) What is the combined resistance?',
      animationUrl: '/manim_videos/sericircuit/1080p60/CircuitComparison.mp4'
    },
  ],
  magnetism: [
    {
      id: 'mag-1',
      title: 'Bar magnet field',
      description: 'Describe magnetic field lines around a bar magnet',
      question: 'Sketch and describe the magnetic field pattern around a bar magnet. (a) In which direction do field lines run outside the magnet? (b) Where is the field strongest, and how can you tell from a field line diagram? (c) What happens when two north poles face each other?',
      animationUrl: '/manim_videos/magnetism/1080p60/BarMagnetField.mp4'
    },
    {
      id: 'mag-2',
      title: 'Solenoid',
      description: 'Determine the magnetic field inside a current-carrying solenoid',
      question: 'A solenoid has 500 turns, is 0.25 m long, and carries a current of 2 A. (a) Use the formula B = μ₀nI to calculate the magnetic field inside (μ₀ = 4π × 10⁻⁷ T·m/A). (b) How would the field change if the current doubled?',
    },
    {
      id: 'mag-3',
      title: 'Motor effect',
      description: "Use Fleming's left-hand rule to find force on a current in a field",
      question: 'A wire carrying a 3 A current sits in a 0.05 T magnetic field at 90° to the wire. The wire has a length of 0.2 m inside the field. (a) Calculate the force on the wire. (b) Using Fleming\'s left-hand rule, determine the direction of the force if the current flows east and the field points upward.',
    },
  ],
  heat: [
    {
      id: 'heat-1',
      title: 'Heating water',
      description: 'Use Q = mcΔT to calculate energy needed to raise water temperature',
      question: 'How much energy is needed to heat 2 kg of water from 20°C to 100°C? The specific heat capacity of water is 4200 J/(kg·°C). Show your working clearly using Q = mcΔT.',
    },
    {
      id: 'heat-2',
      title: 'Melting ice',
      description: 'Apply specific latent heat to find energy for a change of state',
      question: '500 g of ice at 0°C is melted and then heated to 60°C. The specific latent heat of fusion of ice is 334,000 J/kg and the specific heat capacity of water is 4200 J/(kg·°C). Calculate the total energy required.',
    },
    {
      id: 'heat-3',
      title: 'Insulation test',
      description: 'Compare heat loss through different materials',
      question: 'A student tests three cups of hot water — one uninsulated, one wrapped in wool, one in foam. Each starts at 80°C. After 10 minutes: uninsulated is at 50°C, wool is 60°C, foam is 65°C. (a) Which is the best insulator? (b) Calculate the rate of temperature change (°C/min) for the uninsulated cup. (c) Explain at a particle level why foam slows heat transfer.',
    },
  ],
  gravity: [
    {
      id: 'grav-1',
      title: 'Falling object',
      description: 'Use g = 9.8 m/s² to calculate speed and distance for free fall',
      question: 'A stone is dropped from rest off a 80 m cliff. (a) How long does it take to reach the ground? (b) What is its speed just before it hits the ground? Use g = 10 m/s² and ignore air resistance.',
    },
    {
      id: 'grav-2',
      title: 'Satellite orbit',
      description: 'Apply gravitational force to find orbital speed and period',
      question: 'A satellite orbits Earth at a height of 400 km above the surface. The radius of Earth is 6.4 × 10⁶ m and g at that height ≈ 8.7 m/s². (a) Calculate the orbital speed needed to maintain this circular orbit. (b) Estimate the orbital period.',
    },
    {
      id: 'grav-3',
      title: 'Weight on other planets',
      description: 'Calculate gravitational field strength and compare weight',
      question: 'On Mars, the gravitational field strength is 3.7 N/kg. An astronaut has a mass of 75 kg. (a) What is her weight on Mars? (b) What is her weight on Earth (g = 9.8 N/kg)? (c) Does her mass change between Earth and Mars? Explain.',
    },
  ],
  quantum: [
    {
      id: 'atom-1',
      title: 'Rutherford scattering',
      description: 'Interpret the gold foil experiment to describe nuclear structure',
      question: 'In Rutherford\'s gold foil experiment, most alpha particles passed straight through, but a few were deflected at large angles. (a) What did the undeflected particles tell us about the atom? (b) What did the large-angle deflections reveal? (c) How does this disprove the "plum pudding" model?',
    },
    {
      id: 'atom-2',
      title: 'Alpha decay',
      description: 'Write and balance a nuclear decay equation',
      question: 'Uranium-238 (²³⁸₉₂U) undergoes alpha decay. (a) Write a balanced nuclear equation for this decay, identifying the daughter nucleus. (b) What are the properties of an alpha particle? (c) Why does the nucleus become more stable after emitting an alpha particle?',
    },
    {
      id: 'atom-3',
      title: 'Half-life calculation',
      description: 'Use the half-life formula to find remaining activity',
      question: 'A radioactive sample has a half-life of 6 hours and an initial activity of 3200 Bq. (a) Calculate the activity after 24 hours. (b) How long would it take for the activity to fall below 100 Bq? (c) What does "half-life" mean in terms of the number of undecayed atoms?',
    },
  ],
}
