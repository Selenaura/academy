export default function OfflinePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0A0A0F',
      color: '#F0EDE4',
      fontFamily: 'Georgia, serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>☽</div>
      <h1 style={{ color: '#C9A84C', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        Sin conexión
      </h1>
      <p style={{ color: '#A8A4A0', maxWidth: '300px' }}>
        Parece que no tienes conexión a internet. Vuelve a intentarlo cuando estés conectada.
      </p>
    </div>
  );
}
