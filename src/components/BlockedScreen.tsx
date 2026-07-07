import type { BlockedQuestion } from '../types';

interface BlockedScreenProps {
  blockedQuestions: BlockedQuestion[];
  onRemove: (id: string) => void;
  onBack: () => void;
}

export function BlockedScreen({ blockedQuestions, onRemove, onBack }: BlockedScreenProps) {
  const sortedBlocked = [...blockedQuestions].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="glass-panel" style={{ width: '100%', textAlign: 'left' }}>
      <button className="back-button" onClick={onBack}>← Voltar</button>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Questões Bloqueadas</h2>

      {sortedBlocked.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          Você não possui nenhuma questão bloqueada. Ao bloquear uma questão, ela não aparecerá mais nos quizzes.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {sortedBlocked.map(b => (
            <div key={b.id} className="bookmark-card" style={{ borderColor: '#64748b', opacity: 0.9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge" style={{ background: '#64748b' }}>{b.themeName}</span>
                  <span className="badge secondary">{b.topic}</span>
                </div>
                <button className="delete-button" onClick={() => onRemove(b.id)} title="Desbloquear">
                  Desbloquear
                </button>
              </div>
              
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{b.questionText}</h3>
              
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                Bloqueada em: {new Date(b.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
