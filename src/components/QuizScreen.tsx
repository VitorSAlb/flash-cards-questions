import { useState, useMemo } from 'react';
import type { Question, Bookmark, BlockedQuestion } from '../types';

interface QuizScreenProps {
  questions: Question[];
  bookmarks: Bookmark[];
  blockedQuestions: BlockedQuestion[];
  onToggleBookmark: (q: Question) => void;
  onToggleBlock: (q: Question) => void;
  onFinish: (score: number, total: number) => void;
  onQuit: () => void;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function QuizScreen({ questions, bookmarks, blockedQuestions, onToggleBookmark, onToggleBlock, onFinish, onQuit }: QuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isBookmarked = currentQuestion ? bookmarks.some(b => b.id === currentQuestion.id) : false;
  const isBlocked = currentQuestion ? blockedQuestions.some(b => b.id === currentQuestion.id) : false;

  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return shuffle(currentQuestion.options);
  }, [currentQuestion]);

  if (!currentQuestion) return null;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOptionIndex(index);
  };

  const handleConfirm = () => {
    if (selectedOptionIndex === null) return;
    
    setIsAnswered(true);
    if (shuffledOptions[selectedOptionIndex].isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
    } else {
      onFinish(score + (shuffledOptions[selectedOptionIndex!].isCorrect ? 1 : 0), questions.length);
    }
  };

  const difficultyColors = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444'
  };

  return (
    <div className="glass-panel quiz-panel" style={{ width: '100%' }}>
      <div className="quiz-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button className="back-button" onClick={onQuit}>Sair do Quiz</button>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="question-header" style={{ marginBottom: '1.5rem' }}>
        <span 
          style={{ 
            background: difficultyColors[currentQuestion.difficulty], 
            padding: '0.4rem 0.8rem', 
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            color: '#fff',
            textTransform: 'uppercase'
          }}
        >
          {currentQuestion.difficulty}
        </span>
        <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>
          Tópico: {currentQuestion.topic}
        </span>
      </div>

      <h2 style={{ fontSize: '1.6rem', marginBottom: '2.5rem', lineHeight: '1.4' }}>
        {currentQuestion.text}
      </h2>

      <div className="options-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {shuffledOptions.map((opt, index) => {
          let optionClass = 'option-btn';
          if (selectedOptionIndex === index) optionClass += ' selected';
          
          if (isAnswered) {
            if (opt.isCorrect) optionClass += ' correct';
            else if (selectedOptionIndex === index) optionClass += ' wrong';
            else optionClass += ' disabled';
          }

          return (
            <button 
              key={index} 
              className={optionClass}
              onClick={() => handleSelectOption(index)}
              disabled={isAnswered}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
            onClick={() => onToggleBookmark(currentQuestion)}
          >
            {isBookmarked ? '🚩 Dúvida Salva' : '🚩 Marcar Dúvida'}
          </button>

          <button 
            className={`bookmark-btn block-btn ${isBlocked ? 'active' : ''}`}
            onClick={() => onToggleBlock(currentQuestion)}
          >
            {isBlocked ? '🚫 Bloqueada' : '🚫 Bloquear'}
          </button>
        </div>
      )}

      {isAnswered && (
        <div className="explanation-box" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', borderLeft: '4px solid var(--primary-color)' }}>
          <h3 style={{ marginBottom: '0.5rem', color: shuffledOptions[selectedOptionIndex!].isCorrect ? 'var(--success-color)' : 'var(--error-color)' }}>
            {shuffledOptions[selectedOptionIndex!].isCorrect ? '✨ Correto!' : '❌ Incorreto!'}
          </h3>
          <p style={{ lineHeight: '1.5' }}>{shuffledOptions[selectedOptionIndex!].explanation}</p>
        </div>
      )}

      <div style={{ marginTop: '2.5rem', textAlign: 'right' }}>
        {!isAnswered ? (
          <button 
            className="primary-button" 
            disabled={selectedOptionIndex === null}
            onClick={handleConfirm}
            style={{ opacity: selectedOptionIndex === null ? 0.5 : 1 }}
          >
            Confirmar Resposta
          </button>
        ) : (
          <button className="primary-button" onClick={handleNext}>
            {currentIndex + 1 < questions.length ? 'Próxima Pergunta →' : 'Ver Resultado'}
          </button>
        )}
      </div>
    </div>
  );
}
