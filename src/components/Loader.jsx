const Loader = ({ size = 100, text = "Loading..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      height: '100%',
      width: '100%',
      minHeight: '200px'
    }}>
      <img 
        src="/WearSuggestLogo.svg" 
        alt="Loading" 
        className="logo-loader"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          marginBottom: '1rem' 
        }} 
      />
      {text && <p style={{ color: 'var(--color-text-secondary)' }}>{text}</p>}
    </div>
  );
};

export default Loader;
