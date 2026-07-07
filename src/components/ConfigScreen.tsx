interface ConfigScreenProps {
  themeName: string;
  onStart: (order: 'sequential' | 'random') => void;
  onBack: () => void;
}

export function ConfigScreen({ themeName, onStart, onBack }: ConfigScreenProps) {
  return (
    <div className="glass-panel" style={{ textAlign: 'center', width: '100%' }}>
      <button className="back-button" onClick={onBack}>← Voltar</button>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Configurar: {themeName}</h2>
      <p style={{ margin: '1rem 0 3rem 0', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
        Como você deseja responder as perguntas deste tema?
      </p>

      <div className="config-options" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="secondary-button" onClick={() => onStart('sequential')}>
          Ordem Sequencial
        </button>
        <button className="primary-button" onClick={() => onStart('random')}>
          Ordem Aleatória
        </button>
      </div>
    </div>
  );
}
