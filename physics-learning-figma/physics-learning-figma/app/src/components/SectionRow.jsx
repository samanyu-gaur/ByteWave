const styles = {
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  titleWrap: {
    borderBottom: '1px solid var(--graph-axis)',
    paddingBottom: 6,
    marginBottom: 2,
  },
  title: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--primary-text)' },
  subtitle: {
    margin: '4px 0 0',
    fontSize: 12,
    fontFamily: 'var(--font-formula)',
    fontStyle: 'italic',
    color: 'var(--primary-text-muted)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 18,
  },
}

export default function SectionRow({ title, formulaSubtitle, children }) {
  return (
    <section style={styles.section}>
      <div style={styles.titleWrap}>
        <h2 style={styles.title}>{title}</h2>
        {formulaSubtitle && <p style={styles.subtitle}>{formulaSubtitle}</p>}
      </div>
      <div style={styles.grid}>{children}</div>
    </section>
  )
}
