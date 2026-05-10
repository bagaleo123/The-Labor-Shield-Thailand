import { useState } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import ContractScanner from './pages/ContractScanner';
import FightBack from './pages/FightBack';
import Documents from './pages/Documents';
import OTCalculator from './pages/OTCalculator';
import EvidenceLocker from './pages/EvidenceLocker';
import JusticeMap from './pages/JusticeMap';
import { LanguageProvider } from './lib/LanguageContext';

type Page = 'home' | 'calculator' | 'scanner' | 'guide' | 'documents' | 'ot' | 'evidence' | 'map';

export default function App() {
  const [page, setPage] = useState<Page>('home');

  function navigate(p: Page) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Inter, sans-serif', background: '#0a1628', color: '#f1f5f9' }}>
        <Navigation currentPage={page} onNavigate={navigate} />
        <main className="flex-1">
          {page === 'home' && <Home onNavigate={navigate} />}
          {page === 'calculator' && <Calculator />}
          {page === 'scanner' && <ContractScanner />}
          {page === 'guide' && <FightBack />}
          {page === 'documents' && <Documents />}
          {page === 'ot' && <OTCalculator />}
          {page === 'evidence' && <EvidenceLocker />}
          {page === 'map' && <JusticeMap />}
        </main>
        <Footer />
        <AIChatbot />
      </div>
    </LanguageProvider>
  );
}
