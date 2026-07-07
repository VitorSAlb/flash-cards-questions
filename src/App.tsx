import { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import type { ThemeData, Question, Bookmark, BlockedQuestion } from './types';
import { Home } from './components/Home';
import { ConfigScreen } from './components/ConfigScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { ManageThemesScreen } from './components/ManageThemesScreen';
import { BookmarksScreen } from './components/BookmarksScreen';
import { BlockedScreen } from './components/BlockedScreen';
import { CustomRandomScreen } from './components/CustomRandomScreen';

const jsonModules = import.meta.glob('./data/*.json', { eager: true });

function AppContent() {
  const navigate = useNavigate();
  
  const themes = useMemo(() => {
    const loadedThemes: ThemeData[] = [];
    for (const path in jsonModules) {
      const module = jsonModules[path] as any;
      const data = module && module.default ? module.default : module;
      const filename = path.replace('./data/', '');
      loadedThemes.push({ ...data, filename } as ThemeData);
    }
    return loadedThemes;
  }, [jsonModules]);

  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [finalScore, setFinalScore] = useState(0);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('qf_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('qf_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleToggleBookmark = (q: Question) => {
    setBookmarks(prev => {
      if (prev.some(b => b.id === q.id)) {
        return prev.filter(b => b.id !== q.id);
      } else {
        const correctOpt = q.options.find(o => o.isCorrect);
        const newBookmark: Bookmark = {
          id: q.id,
          questionText: q.text,
          themeName: q.themeName || 'Desconhecido',
          topic: q.topic,
          correctOptionText: correctOpt?.text || '',
          explanation: correctOpt?.explanation || '',
          timestamp: Date.now()
        };
        return [...prev, newBookmark];
      }
    });
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const [blockedQuestions, setBlockedQuestions] = useState<BlockedQuestion[]>(() => {
    const saved = localStorage.getItem('qf_blocked');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('qf_blocked', JSON.stringify(blockedQuestions));
  }, [blockedQuestions]);

  const handleToggleBlock = (q: Question) => {
    setBlockedQuestions(prev => {
      if (prev.some(b => b.id === q.id)) {
        return prev.filter(b => b.id !== q.id);
      } else {
        const newBlocked: BlockedQuestion = {
          id: q.id,
          questionText: q.text,
          themeName: q.themeName || 'Desconhecido',
          topic: q.topic,
          timestamp: Date.now()
        };
        return [...prev, newBlocked];
      }
    });
  };

  const handleRemoveBlock = (id: string) => {
    setBlockedQuestions(prev => prev.filter(b => b.id !== id));
  };

  const handleSelectTheme = (theme: string) => {
    setSelectedTheme(theme);
    navigate('/config');
  };

  const handleStartCustomRandom = (selectedThemes: string[], maxQuestions: number) => {
    const allQuestions = themes
      .filter(t => selectedThemes.includes(t.theme))
      .flatMap(t => t.questions.map(q => ({ ...q, themeName: t.theme })))
      .filter(q => !blockedQuestions.some(b => b.id === q.id));
    
    if (allQuestions.length === 0) {
      alert('Nenhuma questão disponível (ou todas estão bloqueadas) para os temas selecionados!');
      return;
    }
    
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const sliced = shuffled.slice(0, maxQuestions);
    
    setQuizQuestions(sliced);
    navigate('/quiz');
  };

  const handleStartQuiz = (order: 'sequential' | 'random') => {
    const themeData = themes.find(t => t.theme === selectedTheme);
    if (!themeData) return;

    let questions = [...themeData.questions]
      .map(q => ({ ...q, themeName: themeData.theme }))
      .filter(q => !blockedQuestions.some(b => b.id === q.id));
    
    if (questions.length === 0) {
      alert('Todas as questões deste tema estão bloqueadas!');
      navigate('/');
      return;
    }

    if (order === 'random') {
      questions = questions.sort(() => Math.random() - 0.5);
    }
    setQuizQuestions(questions);
    navigate('/quiz');
  };

  const handleFinishQuiz = (score: number) => {
    setFinalScore(score);
    navigate('/result');
  };

  const handleRetry = () => {
    const questions = [...quizQuestions].sort(() => Math.random() - 0.5);
    setQuizQuestions(questions);
    navigate('/quiz');
  };

  return (
    <div className="app-container">
      <header>
        <h1 className="title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Question Factory</h1>
        <p className="subtitle">Desafie seus conhecimentos com Flashcards interativos</p>
      </header>

      <main style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Routes>
          <Route path="/" element={
            <Home 
              themes={themes} 
              onSelectTheme={handleSelectTheme} 
              onCustomRandom={() => navigate('/mix')}
              onManageThemes={() => navigate('/manage')}
              onViewBookmarks={() => navigate('/bookmarks')}
              onViewBlocked={() => navigate('/blocked')}
              bookmarksCount={bookmarks.length}
              blockedCount={blockedQuestions.length}
            />
          } />
          
          <Route path="/config" element={
            selectedTheme ? (
              <ConfigScreen 
                themeName={selectedTheme} 
                onStart={handleStartQuiz}
                onBack={() => navigate('/')}
              />
            ) : <Navigate to="/" />
          } />

          <Route path="/mix" element={
            <CustomRandomScreen
              themes={themes}
              onStart={handleStartCustomRandom}
              onBack={() => navigate('/')}
            />
          } />

          <Route path="/quiz" element={
            quizQuestions.length > 0 ? (
              <QuizScreen
                questions={quizQuestions}
                bookmarks={bookmarks}
                blockedQuestions={blockedQuestions}
                onToggleBookmark={handleToggleBookmark}
                onToggleBlock={handleToggleBlock}
                onFinish={handleFinishQuiz}
                onQuit={() => navigate('/')}
              />
            ) : <Navigate to="/" />
          } />

          <Route path="/result" element={
            <ResultScreen
              score={finalScore}
              total={quizQuestions.length}
              onRetry={handleRetry}
              onHome={() => navigate('/')}
            />
          } />

          <Route path="/manage" element={
            <ManageThemesScreen
              themes={themes}
              onBack={() => navigate('/')}
            />
          } />

          <Route path="/bookmarks" element={
            <BookmarksScreen
              bookmarks={bookmarks}
              onRemove={handleRemoveBookmark}
              onBack={() => navigate('/')}
            />
          } />

          <Route path="/blocked" element={
            <BlockedScreen
              blockedQuestions={blockedQuestions}
              onRemove={handleRemoveBlock}
              onBack={() => navigate('/')}
            />
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
