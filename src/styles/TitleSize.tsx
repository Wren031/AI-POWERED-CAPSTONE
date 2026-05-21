export default function TitleSize({ title = "Title", subtitle = "Subtitle"}) {
  return (
    <div>
      <h1 style={styles.title}>
        {title}
      </h1>
      <p style={styles.subtitle}>
        {subtitle}
      </p>
    </div>
  );
}

const styles = {
    title: {
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 1,
    letterSpacing: -0.2,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10,
  },
}