import type { Bookmark } from '../types';

interface BookmarksScreenProps {
  bookmarks: Bookmark[];
  onRemove: (id: string) => void;
  onBack: () => void;
}

export function BookmarksScreen({ bookmarks, onRemove, onBack }: BookmarksScreenProps) {
  // Sort bookmarks by timestamp descending (newest first)
  const sortedBookmarks = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="glass-panel" style={{ width: '100%', textAlign: 'left' }}>
      <button className="back-button" onClick={onBack}>← Voltar</button>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Questões Marcadas para Revisão</h2>

      {sortedBookmarks.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          Você ainda não marcou nenhuma dúvida. Durante o quiz, clique em "🚩 Marcar Dúvida" nas questões que quiser revisar mais tarde!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {sortedBookmarks.map(b => (
            <div key={b.id} className="bookmark-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge">{b.themeName}</span>
                  <span className="badge secondary">{b.topic}</span>
                </div>
                <button className="delete-button" onClick={() => onRemove(b.id)} title="Remover da lista">
                  Remover
                </button>
              </div>
              
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', lineHeight: '1.4' }}>{b.questionText}</h3>
              
              <div className="correct-answer-box">
                <strong style={{ color: 'var(--success-color)' }}>Resposta Correta:</strong> {b.correctOptionText}
              </div>
              
              <div className="explanation-box" style={{ marginTop: '1rem', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem' }}>
                <strong style={{ color: 'var(--primary-color)' }}>Explicação:</strong> {b.explanation}
              </div>
              
              <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                Salva em: {new Date(b.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
