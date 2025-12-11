function Error({ statusCode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#FEFCF8',
      color: '#2D3A3A'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          {statusCode || 'Error'}
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          {statusCode === 404 
            ? 'Page not found'
            : 'An error occurred'}
        </p>
        <a 
          href="/"
          style={{
            backgroundColor: '#B8954C',
            color: '#2D3A3A',
            padding: '1rem 2rem',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          Return Home
        </a>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error

