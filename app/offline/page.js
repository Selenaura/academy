export default function OfflinePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0C0E1A',
      color: '#F0EDE4',
      fontFamily: 'Georgia, serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>☽</div>
      <h1 style={{ color: '#D4A843', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        Sin conexión
      </h1>
      <p style={{ color: '#A8A4A0', maxWidth: '300px' }}>
        Parece que no tienes conexión a internet. Vuelve a intentarlo cuando estés conectada.
      </p>
    </div>
  );
}
