// Mock data used when the backend API is unavailable (no server running)
// 6 cases per topic × 10 topics = 60 total cases

export const MOCK_PROGRESS = [
  { skill_id: 'motion',      skill_name: 'Motion & Kinematics',    status: 'In progress', mastery_score: 65 },
  { skill_id: 'forces',      skill_name: 'Forces & Newton\'s Laws', status: 'Not started', mastery_score: 0  },
  { skill_id: 'energy',      skill_name: 'Work, Energy & Power',   status: 'Mastered',    mastery_score: 92 },
  { skill_id: 'waves',       skill_name: 'Waves & Sound',          status: 'Not started', mastery_score: 0  },
  { skill_id: 'light',       skill_name: 'Light & Radiation',      status: 'In progress', mastery_score: 45 },
  { skill_id: 'electricity', skill_name: 'Electricity & Circuits', status: 'Not started', mastery_score: 0  },
  { skill_id: 'magnetism',   skill_name: 'Magnetism',              status: 'Mastered',    mastery_score: 88 },
  { skill_id: 'heat',        skill_name: 'Heat & Thermodynamics',  status: 'Not started', mastery_score: 0  },
  { skill_id: 'gravity',     skill_name: 'Gravity & Orbits',       status: 'In progress', mastery_score: 55 },
  { skill_id: 'quantum',     skill_name: 'Atoms & Nuclei',         status: 'Not started', mastery_score: 0  },
]

export const MOCK_RECOMMENDATIONS = [
  { item_id: 'motion',      item_name: 'Motion & Kinematics',    recommendation_type: 'Next for you',    match_score: 92, reason: "You're 65% through — keep going" },
  { item_id: 'light',       item_name: 'Light & Radiation',      recommendation_type: 'Next for you',    match_score: 85, reason: 'Good momentum here' },
  { item_id: 'gravity',     item_name: 'Gravity & Orbits',       recommendation_type: 'Next for you',    match_score: 78, reason: 'New topic — good time to start' },
  { item_id: 'forces',      item_name: 'Forces & Newton\'s Laws', recommendation_type: 'Review',         match_score: 70, reason: "Haven't practiced this recently" },
  { item_id: 'waves',       item_name: 'Waves & Sound',          recommendation_type: 'Review',          match_score: 62, reason: 'Refresh your wave knowledge' },
  { item_id: 'energy',      item_name: 'Work, Energy & Power',   recommendation_type: 'Ready to master', match_score: 55, reason: 'Score is 92 — one more case to seal it' },
  { item_id: 'magnetism',   item_name: 'Magnetism',              recommendation_type: 'Ready to master', match_score: 50, reason: 'Strong score — finish it off' },
]

export const MOCK_CASES_BY_SKILL = {
  motion: [
    {
      id: 'motion-1',
      title: 'Ball on a slope',
      description: 'Calculate acceleration down an inclined plane using v = u + at',
      question: 'A ball starts from rest and rolls down a slope, reaching the bottom in 2 s with a final speed of 8 m/s. (a) Calculate the acceleration. (b) How long is the slope?',
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
    },
    {
      id: 'motion-4',
      title: 'Relative velocity — trains',
      description: 'Calculate relative speed between two moving objects',
      question: 'Train A moves east at 60 m/s and Train B moves west at 40 m/s on parallel tracks. (a) What is Train B\'s velocity relative to Train A? (b) If they start 500 m apart (nose to nose), how long before they pass each other?',
    },
    {
      id: 'motion-5',
      title: 'Velocity–time graph analysis',
      description: 'Interpret a v–t graph to find displacement and acceleration',
      question: 'A v–t graph shows: 0 to 4 s velocity rises uniformly from 0 to 12 m/s; 4 to 10 s velocity stays constant; 10 to 14 s velocity drops to 0. (a) Calculate the acceleration in each phase. (b) Find the total displacement. (c) Sketch the corresponding displacement–time graph.',
    },
    {
      id: 'motion-6',
      title: 'Angled projectile',
      description: 'Find time of flight, max height, and range for a launched projectile',
      question: 'A ball is launched at 25 m/s at 37° above horizontal from ground level. (sin 37° = 0.6, cos 37° = 0.8, g = 10 m/s²). (a) Find the initial horizontal and vertical components. (b) Calculate the time of flight. (c) Find the horizontal range and the maximum height reached.',
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
    },
    {
      id: 'forces-3',
      title: 'Elevator ride',
      description: 'Calculate normal force during acceleration in a lift',
      question: 'A 60 kg person stands in a lift accelerating upward at 2 m/s². (a) Draw a free-body diagram. (b) Calculate the normal force from the floor. (g = 10 m/s²)',
    },
    {
      id: 'forces-4',
      title: 'Inclined plane with friction',
      description: 'Resolve forces on a slope and check if the block slides',
      question: 'A 5 kg block sits on a 30° slope. The coefficient of static friction is 0.4. (a) Calculate the component of weight along the slope. (b) Calculate the maximum static friction force. (c) Will the block slide? Show your reasoning. (g = 10 m/s²)',
    },
    {
      id: 'forces-5',
      title: 'Atwood machine',
      description: 'Apply Newton\'s 2nd law to a pulley system',
      question: 'Two masses m₁ = 4 kg and m₂ = 2 kg are connected by a light string over a frictionless pulley. (a) Draw free-body diagrams for both masses. (b) Write the equations of motion for each. (c) Solve for the acceleration and the tension in the string. (g = 10 m/s²)',
    },
    {
      id: 'forces-6',
      title: 'Static equilibrium — sign',
      description: 'Resolve forces for an object in equilibrium',
      question: 'A 12 kg shop sign is hung from a horizontal rod using two cables. One cable is vertical; the other makes 40° with the horizontal. (a) Resolve forces to find the tension in each cable. (b) What is the compression force in the rod? (g = 10 m/s²)',
    },
  ],
  energy: [
    {
      id: 'energy-1',
      title: 'Rollercoaster drop',
      description: 'Convert gravitational PE to KE and find speed at the bottom',
      question: 'A 500 kg rollercoaster car starts from rest at the top of a 40 m drop. Assuming no friction, calculate its speed at the bottom using conservation of energy. (g = 10 m/s²)',
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
    {
      id: 'energy-4',
      title: 'Braking car — work–energy theorem',
      description: 'Apply the work–energy theorem to find braking distance',
      question: 'A 1200 kg car travelling at 30 m/s brakes to a halt. The friction force is 9000 N. (a) Calculate the car\'s initial kinetic energy. (b) Use the work–energy theorem (W = ΔKE) to find the braking distance. (c) If the speed were doubled, what would happen to the stopping distance?',
    },
    {
      id: 'energy-5',
      title: 'Efficiency of a motor',
      description: 'Calculate useful output power and efficiency',
      question: 'An electric motor draws 2400 W of electrical power and lifts a 150 kg load at 1.2 m/s against gravity. (a) Calculate the useful power output. (b) Find the efficiency of the motor. (c) Where does the wasted energy go? (g = 10 m/s²)',
    },
    {
      id: 'energy-6',
      title: 'Gravitational PE and orbital altitude',
      description: 'Calculate gravitational PE change as altitude increases',
      question: 'A 500 kg satellite is launched from Earth\'s surface (r = 6400 km) to a circular orbit 400 km above the surface. (a) Calculate the gain in gravitational PE. (b) Why does the satellite also need kinetic energy? (g at surface = 9.8 m/s², assume g approximately constant for this altitude)',
    },
  ],
  waves: [
    {
      id: 'waves-1',
      title: 'Ripple tank',
      description: 'Measure wavelength and frequency to find wave speed',
      question: 'Water waves in a ripple tank have a frequency of 4 Hz and a wavelength of 3 cm. (a) Calculate the wave speed. (b) If the frequency doubles, what happens to the speed and wavelength?',
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
    {
      id: 'waves-4',
      title: 'Doppler effect — ambulance',
      description: 'Apply the Doppler formula to find observed frequency',
      question: 'An ambulance siren emits sound at 800 Hz. The ambulance moves toward a stationary observer at 30 m/s. The speed of sound is 340 m/s. (a) Calculate the frequency the observer hears as the ambulance approaches. (b) What frequency do they hear as it moves away?',
    },
    {
      id: 'waves-5',
      title: 'Interference — double slit',
      description: 'Calculate fringe spacing in a double-slit experiment',
      question: 'In a double-slit experiment, monochromatic light (λ = 600 nm) passes through slits 0.5 mm apart and forms fringes on a screen 2.0 m away. (a) Calculate the fringe spacing. (b) What would happen to the fringe spacing if the slit separation were doubled? (c) Would dark fringes appear for destructive or constructive interference?',
    },
    {
      id: 'waves-6',
      title: 'Resonance in a closed pipe',
      description: 'Find resonant frequencies of a closed-end air column',
      question: 'A closed organ pipe is 0.68 m long. The speed of sound in air is 340 m/s. (a) Sketch the standing wave pattern for the fundamental mode. (b) Calculate the fundamental frequency. (c) What is the frequency of the second harmonic (first overtone)?',
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
    {
      id: 'light-4',
      title: 'Converging lens — image position',
      description: 'Use the thin lens equation to locate an image',
      question: 'An object is placed 30 cm in front of a converging lens with focal length 10 cm. (a) Use 1/v − 1/u = 1/f to find the image distance. (b) Calculate the magnification. (c) Is the image real or virtual? Upright or inverted?',
    },
    {
      id: 'light-5',
      title: 'Photoelectric effect',
      description: 'Apply Einstein\'s photoelectric equation to find kinetic energy',
      question: 'Ultraviolet light of frequency 1.5 × 10¹⁵ Hz shines on a metal with work function 3.0 eV. (h = 6.63 × 10⁻³⁴ J·s, 1 eV = 1.6 × 10⁻¹⁹ J). (a) Calculate the photon energy in eV. (b) Find the maximum kinetic energy of emitted electrons. (c) What is the threshold frequency for this metal?',
    },
    {
      id: 'light-6',
      title: 'Diffraction grating',
      description: 'Find wavelength from grating equation d sinθ = nλ',
      question: 'A diffraction grating has 400 lines per mm. Monochromatic light produces a first-order maximum at 15.0°. (a) Calculate the grating spacing d in metres. (b) Use d sinθ = nλ to find the wavelength. (c) At what angle would the second-order maximum appear?',
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
    },
    {
      id: 'elec-4',
      title: 'Internal resistance',
      description: 'Apply EMF and internal resistance to a real battery circuit',
      question: 'A battery has EMF 9 V and internal resistance 1 Ω, connected to an external resistor of 8 Ω. (a) Calculate the current in the circuit. (b) Find the terminal voltage. (c) Calculate the power dissipated in the internal resistance and in the external resistor.',
    },
    {
      id: 'elec-5',
      title: 'Potential divider',
      description: 'Calculate output voltage from a potential divider circuit',
      question: 'Two resistors R₁ = 4 kΩ and R₂ = 6 kΩ form a potential divider connected to a 15 V supply. (a) Calculate the voltage across R₂. (b) A voltmeter with resistance 6 kΩ is connected across R₂. What does the voltmeter actually read? (c) Explain why the voltmeter reading differs from the unloaded voltage.',
    },
    {
      id: 'elec-6',
      title: 'Capacitor charge and discharge',
      description: 'Analyse charge stored and energy in a capacitor',
      question: 'A 100 μF capacitor is charged to 20 V. (a) Calculate the charge stored on the capacitor. (b) Calculate the energy stored. (c) The capacitor discharges through a 500 Ω resistor. What is the initial discharge current? (d) Sketch the voltage vs time curve during discharge.',
    },
  ],
  magnetism: [
    {
      id: 'mag-1',
      title: 'Bar magnet field',
      description: 'Describe magnetic field lines around a bar magnet',
      question: 'Sketch and describe the magnetic field pattern around a bar magnet. (a) In which direction do field lines run outside the magnet? (b) Where is the field strongest, and how can you tell from a field line diagram? (c) What happens when two north poles face each other?',
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
    {
      id: 'mag-4',
      title: 'Electromagnetic induction — moving rod',
      description: 'Calculate induced EMF using Faraday\'s law',
      question: 'A conducting rod 0.5 m long moves at 4 m/s perpendicular to a 0.3 T magnetic field. (a) Calculate the induced EMF. (b) If the rod forms part of a circuit with resistance 2 Ω, find the induced current. (c) Which law tells you the direction of the induced current?',
    },
    {
      id: 'mag-5',
      title: 'Transformer',
      description: 'Apply the transformer equation to find output voltage and current',
      question: 'A transformer has a primary coil of 2000 turns and a secondary coil of 500 turns. The primary is connected to a 240 V AC supply. (a) Calculate the secondary (output) voltage. (b) If the secondary current is 10 A, find the primary current (assume 100% efficiency). (c) Why can\'t transformers work with DC?',
    },
    {
      id: 'mag-6',
      title: 'Charged particle in a magnetic field',
      description: 'Find the radius of circular motion of a charged particle',
      question: 'A proton (mass = 1.67 × 10⁻²⁷ kg, charge = 1.6 × 10⁻¹⁹ C) moves at 3 × 10⁶ m/s perpendicular to a 0.2 T magnetic field. (a) Calculate the magnetic force on the proton. (b) Show that the proton moves in a circle. (c) Find the radius of its circular path.',
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
    {
      id: 'heat-4',
      title: 'Gas law — Boyle\'s Law',
      description: 'Apply Boyle\'s Law to find pressure or volume at constant temperature',
      question: 'A trapped gas has volume 0.5 m³ at pressure 1.2 × 10⁵ Pa. The gas is compressed at constant temperature to volume 0.2 m³. (a) Use Boyle\'s Law (p₁V₁ = p₂V₂) to find the new pressure. (b) Explain the molecular model for why pressure increases. (c) At what volume would the pressure reach 6 × 10⁵ Pa?',
    },
    {
      id: 'heat-5',
      title: 'Ideal gas — Charles\'s Law',
      description: 'Apply Charles\'s Law at constant pressure',
      question: 'A balloon contains 0.004 m³ of air at 27°C. It is heated to 127°C at constant pressure. (a) Convert both temperatures to Kelvin. (b) Use V₁/T₁ = V₂/T₂ to find the new volume. (c) By what percentage did the volume increase?',
    },
    {
      id: 'heat-6',
      title: 'Kinetic theory — pressure and speed',
      description: 'Relate mean-square speed of gas molecules to temperature',
      question: 'The root mean square (rms) speed of nitrogen molecules at 300 K is 517 m/s. (a) Show using kinetic theory that KE ∝ T. (b) What would be the rms speed at 1200 K? (c) If nitrogen molecules are replaced with lighter helium atoms (molar mass 4 vs 28 g/mol), what is the rms speed of helium at 300 K?',
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
    {
      id: 'grav-4',
      title: 'Newton\'s law of gravitation',
      description: 'Use F = Gm₁m₂/r² to calculate gravitational force',
      question: 'Two asteroids, mass 5 × 10¹⁰ kg and 3 × 10¹⁰ kg, are 2000 m apart. (G = 6.67 × 10⁻¹¹ N m²/kg²). (a) Calculate the gravitational force between them. (b) If the distance doubles, what happens to the force? (c) Why is this force negligible compared to nearby planetary gravity?',
    },
    {
      id: 'grav-5',
      title: 'Circular orbits — geostationary',
      description: 'Calculate the orbital radius for a geostationary satellite',
      question: 'A geostationary satellite has a period of 24 hours. (a) What does "geostationary" mean? (b) Using GMm/r² = mv²/r and v = 2πr/T, derive an expression for r. (c) Calculate the orbital radius. (G = 6.67 × 10⁻¹¹, M_Earth = 6 × 10²⁴ kg)',
    },
    {
      id: 'grav-6',
      title: 'Projectile vs satellite',
      description: 'Understand why a satellite is just a fast enough projectile',
      question: 'Near Earth\'s surface, g = 9.8 m/s². Earth\'s radius is 6400 km. (a) Show that Earth\'s surface curves 5 m for every 8 km horizontally. (b) What horizontal speed allows a projectile to follow the Earth\'s curve (orbital speed)? (c) Explain in your own words why a satellite does not "fall to Earth" even though gravity acts on it.',
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
    {
      id: 'atom-4',
      title: 'Nuclear binding energy',
      description: 'Calculate mass defect and binding energy per nucleon',
      question: 'A helium-4 nucleus (²⁴He) has a measured mass of 4.0015 u. (proton mass = 1.00728 u, neutron mass = 1.00866 u, 1 u = 931.5 MeV/c²). (a) Calculate the mass defect of the nucleus. (b) Find the total binding energy in MeV. (c) Calculate the binding energy per nucleon and comment on helium\'s stability.',
    },
    {
      id: 'atom-5',
      title: 'Fission chain reaction',
      description: 'Describe the conditions for a self-sustaining fission reaction',
      question: 'Uranium-235 undergoes neutron-induced fission: ²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n. (a) Verify that mass number and atomic number are conserved. (b) Explain what a chain reaction is and why the neutron multiplier matters. (c) Define critical mass and explain why a very small piece of U-235 doesn\'t sustain a chain reaction.',
    },
    {
      id: 'atom-6',
      title: 'de Broglie wavelength',
      description: 'Calculate the quantum wavelength of a moving particle',
      question: 'An electron (mass = 9.11 × 10⁻³¹ kg) is accelerated through 100 V. (h = 6.63 × 10⁻³⁴ J·s, e = 1.6 × 10⁻¹⁹ C). (a) Calculate the kinetic energy gained. (b) Find the electron\'s speed. (c) Calculate its de Broglie wavelength using λ = h/mv. (d) Why does this wavelength make electrons useful for crystal diffraction?',
    },
  ],
}
