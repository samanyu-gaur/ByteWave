import { Link } from 'react-router-dom'
import { PositionTimeGraph, FormulaBadge } from '../components/PhysicsGraphic'
import { PHYSICS_TOPICS, PHET_PHYSICS_URL } from '../physicsTopics'
import ScrollReveal from '../components/ScrollReveal'
import DraggableTiles from '../components/DraggableTiles'

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--primary-bg)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 32px',
    maxWidth: 1200,
    margin: '0 auto',
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '2px solid var(--graph-axis-thick)',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--primary-text)',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    gap: 28,
    alignItems: 'center',
  },
  navLink: {
    color: 'var(--primary-text-muted)',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderBottom: '2px solid transparent',
    paddingBottom: 4,
  },
  ctaHeader: {
    padding: '12px 24px',
    borderRadius: 8,
    background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.35) 0%, rgba(99, 102, 241, 0.15) 100%)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    border: '2px solid var(--accent-main)',
    boxShadow: '0 2px 0 rgba(99, 102, 241, 0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  hero: {
    padding: '100px 24px 120px',
    maxWidth: 800,
    margin: '0 auto',
    textAlign: 'center',
    background: 'var(--gradient-hero)',
  },
  heroTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(36px, 6vw, 52px)',
    fontWeight: 700,
    lineHeight: 1.15,
    color: 'var(--primary-text)',
    margin: '0 0 20px',
    letterSpacing: '-0.02em',
  },
  heroSub: {
    fontSize: 18,
    lineHeight: 1.6,
    color: 'var(--primary-text-muted)',
    margin: '0 0 24px',
    maxWidth: 560,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  physicsPills: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
  },
  pill: {
    padding: '8px 16px',
    borderRadius: 20,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    color: 'var(--primary-text-muted)',
    fontSize: 13,
    fontWeight: 600,
  },
  heroGraph: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  heroFormulas: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
  },
  heroCta: {
    display: 'inline-block',
    padding: '18px 36px',
    borderRadius: 14,
    background: 'var(--gradient-accent)',
    color: '#fff',
    fontSize: 17,
    fontWeight: 600,
    textDecoration: 'none',
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.35)',
  },
  section: {
    padding: '72px 24px',
    maxWidth: 1100,
    margin: '0 auto',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 32,
    fontWeight: 700,
    textAlign: 'center',
    margin: '0 0 12px',
    color: 'var(--primary-text)',
  },
  sectionTitleSub: {
    textAlign: 'center',
    margin: '0 0 48px',
    fontSize: 14,
    fontFamily: 'var(--font-formula)',
    fontStyle: 'italic',
    color: 'var(--primary-text-muted)',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 24,
  },
  featureCard: {
    padding: 28,
    background: 'var(--bg-card)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: 20,
    border: '1px solid var(--border-light)',
    borderLeft: '3px solid var(--accent-main)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
  },
  featureTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 18,
    fontWeight: 600,
    margin: '0 0 10px',
    color: 'var(--primary-text)',
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 1.55,
    color: 'var(--primary-text-muted)',
    margin: 0,
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    maxWidth: 520,
    margin: '0 auto',
  },
  step: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
    padding: 20,
    background: 'var(--bg-card)',
    borderRadius: 16,
    border: '1px solid var(--border-light)',
    borderLeft: '3px solid var(--accent-main)',
  },
  stepNum: {
    width: 40,
    height: 40,
    borderRadius: 4,
    background: 'var(--bg-card)',
    border: '2px solid var(--graph-axis-thick)',
    color: 'var(--primary-text)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-readout)',
    fontSize: 16,
    fontWeight: 700,
    flexShrink: 0,
  },
  stepText: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.5,
    color: 'var(--primary-text)',
  },
  topicsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 14,
    maxWidth: 900,
    margin: '0 auto 32px',
  },
  topicChip: {
    padding: '14px 18px',
    borderRadius: 14,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    color: 'var(--primary-text)',
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center',
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease',
  },
  topicChipDesc: {
    display: 'block',
    marginTop: 4,
    fontSize: 11,
    fontWeight: 400,
    color: 'var(--primary-text-muted)',
  },
  phetLink: {
    display: 'inline-block',
    marginTop: 16,
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--rec-high)',
    textDecoration: 'none',
  },
  footer: {
    padding: '40px 24px',
    borderTop: '1px solid var(--border-light)',
    textAlign: 'center',
    color: 'var(--primary-text-muted)',
    fontSize: 14,
  },
}

export default function Landing() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>Byte Wave</Link>
        <nav style={styles.nav}>
          <a href="#how-it-works" style={styles.navLink}>How it works</a>
          <Link to="/chat" style={styles.navLink}>Chat</Link>
          <Link to="/learn" style={styles.ctaHeader}>Get started</Link>
        </nav>
      </header>

      <section style={styles.hero}>
        <div style={styles.physicsPills}>
          {['Motion', 'Forces', 'Energy', 'Waves', 'Electricity', 'Light'].map((p, i) => (
            <span key={p} style={styles.pill} className={`phet-slide-up phet-delay-${i + 1}`}>{p}</span>
          ))}
        </div>
        <h1 style={styles.heroTitle} className="phet-slide-up phet-delay-2">
          Learn physics by doing
        </h1>
        <p style={styles.heroSub} className="phet-slide-up phet-delay-3">
          Pick cases like slope on a graph, answer questions, and get AI-powered feedback—with a clear skill map and recommendations so you always know what to learn next.
        </p>
        <div style={styles.heroGraph} className="phet-float">
          <PositionTimeGraph width={140} height={72} />
          <FormulaBadge formula="v = Δx∕Δt" />
        </div>
        <div style={styles.heroFormulas} className="phet-slide-up phet-delay-3">
          <FormulaBadge formula="F = ma" />
          <FormulaBadge formula="E = mc²" />
          <FormulaBadge formula="W = Fd" />
          <FormulaBadge formula="v = fλ" />
        </div>
        <Link to="/learn" style={styles.heroCta} className="phet-hover-lift phet-slide-up phet-delay-4">Start learning →</Link>
      </section>

      <ScrollReveal>
        <section style={styles.section} id="how-it-works">
          <h2 style={styles.sectionTitle}>How it works</h2>
          <p style={styles.sectionTitleSub}>x(t), F = ma, E = ∫ F · dx</p>
        <div style={styles.features}>
          {[
            { title: '12 physics topics', desc: 'Motion, forces, energy, waves, sound, light, electricity, magnetism, heat, gravity, kinematics, and quantum. Each topic has its own icon and practice cases.' },
            { title: 'Dashboard that knows what\'s next', desc: '"Next for you" shows top matches, "Review" keeps skills sharp, and "Ready to master" highlights what you\'re close to finishing—like a personalized feed.' },
            { title: 'Full skill map', desc: 'All 12 topics as nodes with progress: not started, in progress, or mastered. Tap any topic to pick a case and practice.' },
            { title: 'Case-based practice + AI feedback', desc: 'Pick a scenario, answer questions, and get targeted feedback plus suggested next steps. Mastery % and match scores track your progress.' },
          ].map((f, i) => (
            <div key={f.title} style={styles.featureCard} className={`phet-hover-lift phet-slide-up phet-delay-${i + 1}`}>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Your learning flow</h2>
          <p style={styles.sectionTitleSub}>Δx → practice → feedback → mastery</p>
          <div style={styles.steps}>
            {[
              'From the dashboard, use "Next for you", "Review", or "Ready to master" to jump into the right topic—or open the full skill map.',
              'The skill map shows all 12 physics topics with their icons and progress. Tap a topic to choose a practice case.',
              'Pick a case (e.g. ramp and block, position–time graph), answer the questions, and submit.',
              'Get AI feedback and a suggested next step. Your mastery % and match scores update so you always know what to do next.',
            ].map((text, i) => (
              <div key={i} style={styles.step}>
                <span style={styles.stepNum}>{i + 1}</span>
                <p style={styles.stepText}>{text}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <DraggableTiles
          items={PHYSICS_TOPICS}
          title="Physics topics"
          subtitle="Drag the tiles to rearrange. Each topic has cases and practice waiting for you."
        />
        <div style={{ textAlign: 'center', marginTop: -8 }}>
          <a href={PHET_PHYSICS_URL} target="_blank" rel="noopener noreferrer" style={styles.phetLink}>
            Explore PhET physics simulations →
          </a>
        </div>
      </ScrollReveal>


      <ScrollReveal>
        <section style={{ ...styles.section, paddingBottom: 80 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 28px', fontSize: 18, color: 'var(--primary-text-muted)' }}>
              Built for high school physics. 12 topics, topic-based icons, and a dashboard that tells you exactly what to practice next.
            </p>
            <Link to="/learn" style={styles.heroCta} className="phet-hover-lift">Go to learning app →</Link>
          </div>
        </section>
      </ScrollReveal>

      <footer style={styles.footer}>
        Byte Wave — 12 physics topics, Next for you / Review / Ready to master, skill map, cases, and AI feedback for students.
      </footer>
    </div>
  )
}
