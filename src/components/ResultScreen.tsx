interface ResultScreenProps {
  score: number;
  total: number;
  onHome: () => void;
  onRetry: () => void;
}

export function ResultScreen({ score, total, onHome, onRetry }: ResultScreenProps) {
  const percentage = Math.round((score / total) * 100);
  let message = '';
  
  if (percentage >= 80) message = 'Excelente! Você domina esse assunto!';
  else if (percentage >= 50) message = 'Mandou bem, mas tem espaço para melhorar!';
  else message = 'Parece que você precisa revisar mais esse assunto. Não desista!';

  return (
    <div className="glass-panel result-panel" style={{ textAlign: 'center', width: '100%', animation: 'fadeIn 0.5s ease-out' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Fim do Quiz!
      </h2>
      
      <div className="score-circle">
        <div>
          <span style={{ fontSize: '3.5rem', fontWeight: 'bold' }}>{score}</span>
          <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}> / {total}</span>
        </div>
      </div>
      
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
        {message}
      </h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Taxa de acerto: {percentage}% das questões.
      </p>
      
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="secondary-button" onClick={onRetry}>
          Tentar Novamente
        </button>
        <button className="primary-button" onClick={onHome}>
          Voltar ao Início
        </button>
      </div>
    </div>
  );
}
