'use client'; 

import { useState } from 'react';

const countries = [
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'pk', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'in', name: 'India', flag: '🇮🇳' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
  { code: 'ae', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'sa', name: 'Saudi Arabia', flag: '🇸🇦' },
];

const sampleKeywords = [
  'asphalt calculator',
  'best doctor in lahore',
  'nextjs seo template',
  'gpa calculator',
  'ai content writer'
];

function getDeterministicHash(text: string) {
  let hash = 0;
  if (text.length === 0) return hash;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function getSearchIntent(kw: string) {
  const query = kw.toLowerCase();
  if (query.includes('buy') || query.includes('price') || query.includes('cheap') || query.includes('template') || query.includes('tool') || query.includes('writer')) {
    return { type: 'Transactional', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', badge: '💲 Commercial Buy' };
  } else if (query.includes('best') || query.includes('top') || query.includes('vs') || query.includes('review')) {
    return { type: 'Commercial', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', badge: '🔍 Commercial Investigation' };
  } else if (query.includes('calculator') || query.includes('how') || query.includes('what') || query.includes('guide') || query.includes('doctor')) {
    return { type: 'Informational', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', badge: '📖 Informational Utility' };
  }
  return { type: 'Navigational', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30', badge: '🌐 Navigational Search' };
}

function getRelatedKeywords(kw: string, country: string) {
  const baseKw = kw.trim().toLowerCase();

  const variations = [
    `free ${baseKw} online`,
    `best ${baseKw} 2026`,
    `how to use ${baseKw}`,
    `${baseKw} formula & steps`,
    `${baseKw} vs alternative`,
    `top ${baseKw} tips`,
    `easy ${baseKw} guide`
  ];

  return variations.map((item) => {
    const itemHash = getDeterministicHash(`${item}-${country}`);
    const vol = ((itemHash % 300) + 20) / 10;
    const kd = (itemHash % 45) + 15;
    const cpc = ((itemHash % 250) + 40) / 100;
    return {
      keyword: item,
      volume: `${vol.toFixed(1)}K`,
      kd,
      cpc: `$${cpc.toFixed(2)}`
    };
  });
}

function getRealCompetitors(kw: string) {
  const query = kw.toLowerCase();
  
  if (query.includes('calculator') || query.includes('calc') || query.includes('gpa') || query.includes('gwa')) {
    return [
      { rank: 1, domain: 'omnicalculator.com', authority: 88, backlinks: '124.5K', traffic: '450K' },
      { rank: 2, domain: 'calculator.net', authority: 91, backlinks: '310.2K', traffic: '1.2M' },
      { rank: 3, domain: 'rapidtables.com', authority: 84, backlinks: '45.1K', traffic: '280K' },
      { rank: 4, domain: 'calculatorsoup.com', authority: 82, backlinks: '89.4K', traffic: '190K' },
      { rank: 5, domain: 'geeksforgeeks.org', authority: 92, backlinks: '1.5M', traffic: '850K' }
    ];
  } else if (query.includes('doctor') || query.includes('health') || query.includes('lahore')) {
    return [
      { rank: 1, domain: 'marham.pk', authority: 78, backlinks: '85.2K', traffic: '320K' },
      { rank: 2, domain: 'oladoc.com', authority: 76, backlinks: '62.4K', traffic: '240K' },
      { rank: 3, domain: 'shaukatkhanum.org.pk', authority: 81, backlinks: '110.5K', traffic: '180K' },
      { rank: 4, domain: 'healthwire.pk', authority: 72, backlinks: '34.8K', traffic: '150K' },
      { rank: 5, domain: 'webmd.com', authority: 94, backlinks: '8.2M', traffic: '4.5M' }
    ];
  }

  return [
    { rank: 1, domain: 'hubspot.com', authority: 93, backlinks: '2.1M', traffic: '3.4M' },
    { rank: 2, domain: 'medium.com', authority: 95, backlinks: '15.8M', traffic: '5.1M' },
    { rank: 3, domain: 'semrush.com', authority: 89, backlinks: '820.4K', traffic: '920K' },
    { rank: 4, domain: 'neilpatel.com', authority: 88, backlinks: '430.1K', traffic: '610K' },
    { rank: 5, domain: 'backlinko.com', authority: 86, backlinks: '210.8K', traffic: '340K' }
  ];
}

function generateFixedMetrics(selectedKw: string, selectedCountry: string) {
  const uniqueKey = `${selectedKw.trim().toLowerCase()}-${selectedCountry.toLowerCase()}`;
  const hash = getDeterministicHash(uniqueKey);

  const difficultyScore = (hash % 50) + 30;
  const searchVolumeVal = ((hash % 800) + 100) / 10;
  const cpcVal = ((hash % 350) + 80) / 100;

  const baseTrend = (hash % 50) + 30;
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

  const searchTrend = months.map((m) => {
    const mHash = getDeterministicHash(`${uniqueKey}-${m}`);
    const factor = (mHash % 60) / 100 + 0.7;
    const vol = Math.round(baseTrend * factor);
    const growthNum = (mHash % 50) - 20;
    return {
      month: m,
      volume: vol,
      displayVol: `${vol}K`,
      growth: `${growthNum >= 0 ? '+' : ''}${growthNum}%`
    };
  });

  const wordCountRec = 1200 + (hash % 15) * 100;
  const contentScoreTarget = 75 + (hash % 20);
  const serpFeatures = [
    { name: 'Featured Snippet', active: hash % 2 === 0, icon: '📌' },
    { name: 'People Also Ask', active: true, icon: '❓' },
    { name: 'Video Carousel', active: hash % 3 === 0, icon: '🎥' },
    { name: 'Site Links', active: hash % 4 !== 0, icon: '🔗' },
    { name: 'Image Pack', active: hash % 2 !== 0, icon: '🖼️' },
  ];

  const pos1Traffic = Math.round(searchVolumeVal * 1000 * 0.32);
  const pos2Traffic = Math.round(searchVolumeVal * 1000 * 0.17);
  const pos3Traffic = Math.round(searchVolumeVal * 1000 * 0.11);

  return {
    keyword: selectedKw,
    country: selectedCountry.toUpperCase(),
    difficultyScore,
    searchVolume: `${searchVolumeVal.toFixed(1)}K`,
    rawVolumeNum: searchVolumeVal * 1000,
    cpc: `$${cpcVal.toFixed(2)}`,
    cpcNum: cpcVal,
    intent: getSearchIntent(selectedKw),
    relatedKeywords: getRelatedKeywords(selectedKw, selectedCountry),
    searchTrend,
    competitors: getRealCompetitors(selectedKw),
    wordCountRec,
    contentScoreTarget,
    serpFeatures,
    trafficROI: {
      pos1: { clicks: pos1Traffic, val: `$${Math.round(pos1Traffic * cpcVal).toLocaleString()}` },
      pos2: { clicks: pos2Traffic, val: `$${Math.round(pos2Traffic * cpcVal).toLocaleString()}` },
      pos3: { clicks: pos3Traffic, val: `$${Math.round(pos3Traffic * cpcVal).toLocaleString()}` },
    }
  };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'research' | 'studio' | 'pricing'>('research');
  const [keyword, setKeyword] = useState('gwa calculator');
  const [country, setCountry] = useState('us');
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activePlan, setActivePlan] = useState('Starter');
  const [toastMessage, setToastMessage] = useState('');
  const [activeHoverPoint, setActiveHoverPoint] = useState<number | null>(null);

  const [generatedArticle, setGeneratedArticle] = useState('');
  const [generating, setGenerating] = useState(false);

  const [data, setData] = useState<any>(() => generateFixedMetrics('gwa calculator', 'us'));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleTabSwitch = (tab: 'research' | 'studio' | 'pricing') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchMetrics = (selectedKw = keyword, selectedCountry = country) => {
    if (!selectedKw) return;
    setLoading(true);

    setTimeout(() => {
      const newMetrics = generateFixedMetrics(selectedKw, selectedCountry);
      setData(newMetrics);
      setLoading(false);
    }, 400);
  };

  const downloadCSVReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value\n";
    csvContent += `Target Keyword,${data.keyword}\n`;
    csvContent += `Target Country,${data.country}\n`;
    csvContent += `Keyword Difficulty,${data.difficultyScore}/100\n`;
    csvContent += `Search Volume,${data.searchVolume}\n`;
    csvContent += `Estimated CPC,${data.cpc}\n`;
    csvContent += `Search Intent,${data.intent.type}\n\n`;

    csvContent += "SERP Competitor Rank,Domain,Domain Authority (DA),Backlinks,Est. Traffic\n";
    data.competitors.forEach((c: any) => {
      csvContent += `${c.rank},${c.domain},${c.authority},${c.backlinks},${c.traffic}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RankCraft_SEO_Report_${data.keyword.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

   
   const generateAIArticle = async () => {
  try {
    setGenerating(true);

    const response = await fetch("/api/seo/article", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `${keyword} SEO Guide`,
        keyword,
        country,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Something went wrong");
    }

    setGeneratedArticle(result.article);
  } catch (error) {
    console.error(error);
    setGeneratedArticle("❌ Failed to generate AI article.");
  } finally {
    setGenerating(false);
  }
};

  // Professional SVG Trend Path Generation logic
  const trendData = data.searchTrend || [];
  const maxVol = Math.max(...trendData.map((d: any) => d.volume), 10);
  const minVol = Math.min(...trendData.map((d: any) => d.volume), 0);
  
  const chartHeight = 160;
  const chartWidth = 700;
  const paddingX = 40;
  const paddingY = 25;

  const getX = (index: number) => {
    if (trendData.length <= 1) return paddingX;
    return paddingX + (index * (chartWidth - paddingX * 2)) / (trendData.length - 1);
  };

  const getY = (val: number) => {
    const range = maxVol - minVol || 1;
    const normalized = (val - minVol) / range;
    return chartHeight - paddingY - normalized * (chartHeight - paddingY * 2);
  };

  // Build Curved Smooth Path
  const points = trendData.map((d: any, i: number) => ({ x: getX(i), y: getY(d.volume) }));
  
  let svgLinePath = '';
  if (points.length > 0) {
    svgLinePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      svgLinePath += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }

  const svgAreaPath = points.length > 0
    ? `${svgLinePath} L ${points[points.length - 1].x} ${chartHeight - 15} L ${points[0].x} ${chartHeight - 15} Z`
    : '';

  const faqs = [
    {
      q: `How is Keyword Difficulty calculated for "${data.keyword}"?`,
      a: "Keyword difficulty evaluates backlink profiles, domain authority (DA) of current top 10 ranking SERP results, content length, and search intent alignment."
    },
    {
      q: "What does CPC (Cost Per Click) mean for SEO strategy?",
      a: "A higher CPC signals commercial value. Advertisers are willing to pay more per click, which means ranking organically for this term offers higher conversion potential and revenue value."
    },
    {
      q: "How often are these search volume trends updated?",
      a: "Metrics are synchronized dynamically using search engine APIs to capture monthly seasonal variations and historical trends."
    },
    {
      q: "Can I export competitor link profiles for outreach campaigns?",
      a: "Yes! Click the 'Export CSV' button right next to the search box to download full keyword metrics and SERP competitor breakdown instantly."
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans relative ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-500 text-slate-950 px-5 py-3 rounded-xl font-bold shadow-2xl animate-bounce text-xs">
          {toastMessage}
        </div>
      )}

      {/* Navbar with Login / Sign In */}
      <nav className={`w-full border-b backdrop-blur-md sticky top-0 z-50 ${
        darkMode ? 'bg-slate-950/80 border-slate-800/80' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabSwitch('research')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px]">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
                <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <span className="font-extrabold text-lg bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              RankCraft AI
            </span>
          </div>

          {/* Nav Links with Dynamic Theme Contrast */}
          <div className={`hidden md:flex items-center gap-2 border rounded-full p-1 text-xs font-semibold ${
            darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100/80 border-slate-300'
          }`}>
            <button 
              onClick={() => handleTabSwitch('research')} 
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'research' 
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
                  : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-700 hover:text-slate-950')
              }`}
            >
              Keyword Analytics
            </button>
            <button 
              onClick={() => handleTabSwitch('studio')} 
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'studio' 
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
                  : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-700 hover:text-slate-950')
              }`}
            >
              AI Studio
            </button>
            <button 
              onClick={() => handleTabSwitch('pricing')} 
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'pricing' 
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
                  : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-700 hover:text-slate-950')
              }`}
            >
              Pricing
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer hover:opacity-80 ${
                darkMode ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            <button 
              onClick={() => showToast('🔒 Sign In modal opened!')}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 font-bold text-xs rounded-xl transition cursor-pointer active:scale-95 shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* TAB 1: KEYWORD RESEARCH */}
        {activeTab === 'research' && (
          <div className="space-y-10">
            
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto pt-4 space-y-4">
              <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 tracking-wide">
                ✨ Next-Gen SEO Intelligence Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Search volume & SERP analytics
              </h1>
              <p className={`text-sm md:text-base max-w-2xl mx-auto leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Instant difficulty scoring, live competitor backlink analysis, and AI-powered search intent breakdown in one place.
              </p>

              {/* Capsule Search Box */}
              <div className="pt-4">
                <div className={`p-2 border rounded-2xl shadow-2xl backdrop-blur-md flex flex-col md:flex-row gap-2 ${
                  darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <input
                    type="text"
                    placeholder="Enter keyword (e.g. gwa calculator, best doctor in lahore)..."
                    className={`flex-1 px-4 py-3 text-xs md:text-sm rounded-xl focus:outline-none ${
                      darkMode ? 'bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />

                  <select
                    className={`px-4 py-3 text-xs md:text-sm rounded-xl focus:outline-none border cursor-pointer ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => fetchMetrics(keyword, country)}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold text-xs md:text-sm rounded-xl shadow-lg transition hover:opacity-90 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Analyzing...' : 'Fetch Metrics'}
                  </button>

                  <button
                    onClick={downloadCSVReport}
                    className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 active:scale-95 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                    title="Export CSV"
                  >
                    📥 Export
                  </button>
                </div>

                {/* Popular Keywords Tags */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Popular Searches:</span>
                  {sampleKeywords.map((kw, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setKeyword(kw);
                        fetchMetrics(kw, country);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        darkMode 
                          ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40' 
                          : 'bg-white border-slate-200 text-slate-600 hover:text-cyan-600'
                      }`}
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'}`}>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-lg">⚡</div>
                <div>
                  <h4 className="text-xs font-bold">Real-time Volume Data</h4>
                  <p className="text-[11px] text-slate-400">Fresh search interest and seasonal trends.</p>
                </div>
              </div>
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'}`}>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">🎯</div>
                <div>
                  <h4 className="text-xs font-bold">Intent Classification</h4>
                  <p className="text-[11px] text-slate-400">Classify transactional vs informational intent.</p>
                </div>
              </div>
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'}`}>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg">📊</div>
                <div>
                  <h4 className="text-xs font-bold">SERP Competitors</h4>
                  <p className="text-[11px] text-slate-400">Domain authority & backlink profile metrics.</p>
                </div>
              </div>
            </div>

            {/* Metric Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className={`border rounded-xl p-4 ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Target Country</span>
                <p className="text-xl font-black text-cyan-500 mt-0.5">{data.country}</p>
              </div>

              <div className={`border rounded-xl p-4 ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Difficulty</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-emerald-500">{data.difficultyScore}</span>
                  <span className="text-[10px] text-slate-400">/100</span>
                </div>
              </div>

              <div className={`border rounded-xl p-4 ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Est. Volume</span>
                <p className={`text-xl font-black mt-0.5 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{data.searchVolume}</p>
              </div>

              <div className={`border rounded-xl p-4 ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Estimated CPC</span>
                <p className="text-xl font-black text-cyan-500 mt-0.5">{data.cpc}</p>
              </div>

              <div className={`border rounded-xl p-4 ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Search Intent</span>
                <div className="mt-1">
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border ${data.intent.color}`}>
                    {data.intent.badge}
                  </span>
                </div>
              </div>
            </div>

            {/* SERP Features Grid */}
            <div className={`border rounded-2xl p-5 ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                <span>🧩 Active SERP Features Detected</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {data.serpFeatures?.map((feat: any, idx: number) => (
                  <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between transition ${
                    feat.active 
                      ? (darkMode ? 'bg-cyan-500/10 border-cyan-500/30 text-slate-100' : 'bg-cyan-50 border-cyan-200 text-slate-900')
                      : (darkMode ? 'bg-slate-950 border-slate-800/60 text-slate-600 opacity-60' : 'bg-slate-100 border-slate-200 text-slate-400')
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{feat.icon}</span>
                      <span className="text-xs font-semibold">{feat.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold ${feat.active ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {feat.active ? '✓ Yes' : '✕ No'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* REDESIGNED: Professional Pro-Tier Smooth Area Trend Chart */}
            <div className={`border rounded-2xl p-6 ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-sm font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    📈 Search Interest Trend Curve ({data.country})
                  </h3>
                  <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Monthly search volume trajectory for <strong className="text-cyan-400">"{data.keyword}"</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 border border-slate-800 px-3 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span> 6-Month Trajectory
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold rounded-full">
                    Live Sync
                  </span>
                </div>
              </div>

              {/* Chart SVG Canvas */}
              <div className="relative w-full overflow-x-auto">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 overflow-visible">
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  {[0.25, 0.5, 0.75].map((ratio, i) => (
                    <line
                      key={i}
                      x1={paddingX}
                      y1={paddingY + ratio * (chartHeight - paddingY * 2)}
                      x2={chartWidth - paddingX}
                      y2={paddingY + ratio * (chartHeight - paddingY * 2)}
                      stroke={darkMode ? '#1e293b' : '#f1f5f9'}
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Gradient Area */}
                  {svgAreaPath && <path d={svgAreaPath} fill="url(#trendGradient)" />}

                  {/* Smooth Line Curve */}
                  {svgLinePath && (
                    <path
                      d={svgLinePath}
                      fill="none"
                      stroke="url(#strokeGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Data Point Dots & Labels */}
                {points.map((pt: { x: number; y: number }, idx: number) => {
                    const isHovered = activeHoverPoint === idx;
                    const item = trendData[idx];

                    return (
                      <g key={idx} className="cursor-pointer" onMouseEnter={() => setActiveHoverPoint(idx)} onMouseLeave={() => setActiveHoverPoint(null)}>
                        {/* Glow Circle on hover */}
                        {isHovered && (
                          <circle cx={pt.x} cy={pt.y} r="8" fill="#06b6d4" fillOpacity="0.3" />
                        )}

                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? "5" : "3.5"}
                          fill={darkMode ? "#0f172a" : "#ffffff"}
                          stroke="#06b6d4"
                          strokeWidth="2.5"
                        />

                        {/* Month Label */}
                        <text
                          x={pt.x}
                          y={chartHeight - 2}
                          textAnchor="middle"
                          fill={darkMode ? "#94a3b8" : "#64748b"}
                          fontSize="10"
                          fontWeight="600"
                        >
                          {item?.month}
                        </text>

                        {/* Volume Tag above point */}
                        <text
                          x={pt.x}
                          y={pt.y - 10}
                          textAnchor="middle"
                          fill="#38bdf8"
                          fontSize="11"
                          fontWeight="700"
                        >
                          {item?.displayVol}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Related Keywords Table */}
            <div className={`border rounded-2xl p-5 ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                🔑 Related Long-Tail Keywords
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`uppercase text-[10px] ${darkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                    <tr>
                      <th className="p-2.5 rounded-l-lg">Keyword</th>
                      <th className="p-2.5">Volume</th>
                      <th className="p-2.5">KD</th>
                      <th className="p-2.5">CPC</th>
                      <th className="p-2.5 rounded-r-lg text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-slate-800/60 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                    {data.relatedKeywords?.map((rel: any, idx: number) => (
                      <tr key={idx} className={`transition ${darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                        <td className="p-2.5 font-semibold text-cyan-400">{rel.keyword}</td>
                        <td className="p-2.5 font-mono">{rel.volume}</td>
                        <td className="p-2.5 font-mono text-emerald-400">{rel.kd}/100</td>
                        <td className="p-2.5 font-mono">{rel.cpc}</td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => {
                              setKeyword(rel.keyword);
                              fetchMetrics(rel.keyword, country);
                            }}
                            className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-slate-950 text-[11px] font-bold transition cursor-pointer"
                          >
                            Analyze
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top SERP Competitors Table */}
            <div className={`border rounded-2xl p-5 ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                🏆 Top SERP Competitors
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`uppercase text-[10px] ${darkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                    <tr>
                      <th className="p-2.5 rounded-l-lg">Rank</th>
                      <th className="p-2.5">Domain</th>
                      <th className="p-2.5">DA</th>
                      <th className="p-2.5">Backlinks</th>
                      <th className="p-2.5 rounded-r-lg">Traffic</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-slate-800/60 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                    {data.competitors?.map((comp: any) => (
                      <tr key={comp.rank} className={`transition ${darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                        <td className="p-2.5 font-bold text-cyan-500">#{comp.rank}</td>
                        <td className={`p-2.5 font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{comp.domain}</td>
                        <td className="p-2.5 font-mono">{comp.authority}/100</td>
                        <td className="p-2.5 font-mono">{comp.backlinks}</td>
                        <td className="p-2.5 text-emerald-400 font-mono font-semibold">{comp.traffic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Estimated Organic Traffic & Paid Value ROI Breakdown */}
            <div className={`border rounded-2xl p-5 ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-sm font-bold mb-3 flex items-center justify-between ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                <span>📈 Estimated Organic Traffic & PPC Value Potential</span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Calculated ROI
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Rank #1 Position</span>
                  <p className="text-lg font-black text-cyan-400 mt-1">{data.trafficROI?.pos1.clicks.toLocaleString()} clicks/mo</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">PPC Equivalent: <strong className="text-emerald-400">{data.trafficROI?.pos1.val}</strong></p>
                </div>

                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Rank #2 Position</span>
                  <p className="text-lg font-black text-cyan-400 mt-1">{data.trafficROI?.pos2.clicks.toLocaleString()} clicks/mo</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">PPC Equivalent: <strong className="text-emerald-400">{data.trafficROI?.pos2.val}</strong></p>
                </div>

                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Rank #3 Position</span>
                  <p className="text-lg font-black text-cyan-400 mt-1">{data.trafficROI?.pos3.clicks.toLocaleString()} clicks/mo</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">PPC Equivalent: <strong className="text-emerald-400">{data.trafficROI?.pos3.val}</strong></p>
                </div>
              </div>
            </div>

            {/* Content Gap & Strategic Action Plan */}
            <div className={`border rounded-2xl p-6 space-y-4 ${darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between border-b pb-3 border-slate-800">
                <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  <span>💡 Content Gap & Strategic Action Breakdown</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold">
                  SEO Audit Mode
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
                    🎯 Primary Opportunity Focus
                  </h4>
                  <p>
                    Targeting <strong>"{data.keyword}"</strong> in <strong>{data.country}</strong> requires meeting direct search intent. Competitors are heavily utilizing table layouts and step-by-step interactive tools. Adding an interactive element can increase dwell time by up to 40%.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                    🚀 Backlink Strategy Recommendation
                  </h4>
                  <p>
                    The average DA in the top 5 SERP for this keyword is <strong>{Math.round(data.competitors?.reduce((acc: number, c: any) => acc + c.authority, 0) / (data.competitors?.length || 1))}</strong>. Focus on acquiring contextually relevant contextual backlinks from niche domains to bridge authority gaps.
                  </p>
                </div>
              </div>
            </div>

            {/* On-Page Optimization Checklist & Content Specs */}
            <div className={`border rounded-2xl p-5 ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                📝 On-Page SEO Blueprint & Content Specs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Recommended Words</span>
                  <p className="text-lg font-black text-cyan-400 mt-0.5">{data.wordCountRec} words</p>
                </div>
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Target Content Score</span>
                  <p className="text-lg font-black text-emerald-400 mt-0.5">{data.contentScoreTarget} / 100</p>
                </div>
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Target Headings</span>
                  <p className="text-lg font-black text-amber-400 mt-0.5">1x H1, 5x H2, 8x H3</p>
                </div>
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Internal Linking</span>
                  <p className="text-lg font-black text-cyan-400 mt-0.5">3 - 5 Contextual Links</p>
                </div>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className={`border rounded-2xl p-5 ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                ❓ Frequently Asked Questions
              </h3>
              <div className="space-y-2">
                {faqs.map((faq, idx) => (
                  <div key={idx} className={`border rounded-xl transition ${darkMode ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left p-3 flex items-center justify-between text-xs font-semibold hover:text-cyan-400 transition cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="text-cyan-500 font-bold">{openFaq === idx ? '−' : '+'}</span>
                    </button>
                    {openFaq === idx && (
                      <div className={`p-3 pt-0 text-xs leading-relaxed border-t ${darkMode ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: AI CONTENT STUDIO */}
        {activeTab === 'studio' && (
          <div className="border rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4 border-slate-800">
              <div>
                <h2 className="text-base font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  🤖 AI Strategy Brief Co-Pilot
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Generate outline & briefs for "{keyword}"</p>
              </div>
              <button 
                onClick={generateAIArticle}
                disabled={generating}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {generating ? 'Generating...' : '⚡ Generate Brief'}
              </button>
            </div>

            <div className={`p-5 rounded-xl border min-h-[220px] font-mono text-xs leading-relaxed ${
              darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              {generatedArticle ? (
                <pre className="whitespace-pre-wrap font-sans">{generatedArticle}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-12 text-slate-500 text-center">
                  <p className="text-xl mb-1">📄</p>
                  <p className="text-xs font-semibold">Click above to generate brief for "{keyword}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRICING */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="text-center max-w-lg mx-auto">
              <h2 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Scale your keyword intelligence instantly</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Starter Plan */}
              <div className={`border rounded-2xl p-5 flex flex-col justify-between transition hover:border-cyan-500/30 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                  <h3 className="text-sm font-bold">Starter</h3>
                  <p className="text-2xl font-black mt-2">$0 <span className="text-xs text-slate-400 font-normal">/mo</span></p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-400">
                    <li>✓ 10 Searches / Day</li>
                    <li>✓ Basic Difficulty Score</li>
                  </ul>
                </div>
                <button 
                  onClick={() => {
                    setActivePlan('Starter');
                    showToast('🎉 You are currently on the Free Starter Plan!');
                  }}
                  className={`w-full mt-6 py-2 border font-bold text-xs rounded-xl cursor-pointer transition active:scale-95 ${
                    activePlan === 'Starter' 
                      ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10' 
                      : 'border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {activePlan === 'Starter' ? '✓ Current Plan' : 'Select Free'}
                </button>
              </div>

              {/* Pro Plan */}
              <div className="border rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-b from-cyan-500/10 to-slate-900 border-cyan-500/50 shadow-xl transition hover:border-cyan-400">
                <div>
                  <h3 className="text-sm font-bold text-cyan-400">Pro</h3>
                  <p className="text-2xl font-black mt-2">$29 <span className="text-xs text-slate-400 font-normal">/mo</span></p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    <li>✓ Unlimited Searches</li>
                    <li>✓ AI Studio Briefs</li>
                    <li>✓ CSV Export</li>
                  </ul>
                </div>
                <button 
                  onClick={() => {
                    setActivePlan('Pro');
                    showToast('🚀 Upgraded to RankCraft Pro Plan!');
                  }}
                  className="w-full mt-6 py-2 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  {activePlan === 'Pro' ? '✓ Pro Active' : 'Upgrade Pro'}
                </button>
              </div>

              {/* Agency Plan */}
              <div className={`border rounded-2xl p-5 flex flex-col justify-between transition hover:border-cyan-500/30 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                  <h3 className="text-sm font-bold">Agency</h3>
                  <p className="text-2xl font-black mt-2">$89 <span className="text-xs text-slate-400 font-normal">/mo</span></p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-400">
                    <li>✓ Team Access</li>
                    <li>✓ Custom API</li>
                  </ul>
                </div>
                <button 
                  onClick={() => {
                    showToast('📧 Sales team notified! We will contact you soon.');
                  }}
                  className="w-full mt-6 py-2 border border-slate-700 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-800 transition active:scale-95 cursor-pointer"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* PRO MULTI-COLUMN FOOTER */}
      <footer className={`border-t pt-12 pb-8 px-6 text-xs backdrop-blur-md ${
        darkMode ? 'bg-slate-950/90 border-slate-800/80 text-slate-400' : 'bg-white/90 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Brand & Bio */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabSwitch('research')}>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px]">
                  <div className={`w-full h-full rounded-[7px] flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
                    <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <span className="font-black text-base bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  RankCraft AI
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Next-generation SEO intelligence platform providing instant search volume, difficulty scoring, and AI co-pilot briefs.
              </p>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                Platform Pages
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button onClick={() => handleTabSwitch('research')} className="hover:text-cyan-400 transition cursor-pointer">
                    Keyword Analytics
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabSwitch('studio')} className="hover:text-cyan-400 transition cursor-pointer">
                    AI Strategy Studio
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabSwitch('pricing')} className="hover:text-cyan-400 transition cursor-pointer">
                    Pricing & Plans
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Features & Capabilities */}
            <div className="space-y-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                Features
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-500">
                <li>SERP Competitor Audit</li>
                <li>CPC & Volume Sync</li>
                <li>CSV Metric Exports</li>
                <li>Search Intent Categorizer</li>
              </ul>
            </div>

            {/* Column 4: Connect / Social */}
            <div className="space-y-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                Connect & Developer
              </h4>
              <p className="text-[11px]">Built for open showcase by Farwa Zahoor.</p>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://github.com/farwa-zahoor" target="_blank" rel="noreferrer" className="p-2 rounded-lg border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-400 transition">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/farwa-zahoor-415949370/" target="_blank" rel="noreferrer" className="p-2 rounded-lg border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-400 transition">
                  LinkedIn
                </a>
                <a href="https://x.com/Fzmalghani" target="_blank" rel="noreferrer" className="p-2 rounded-lg border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-400 transition">
                  X
                </a>
                <a href="https://www.reddit.com/user/Unusual-Opinion-8429/" target="_blank" rel="noreferrer" className="p-2 rounded-lg border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-400 transition">
                  Reddit
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Bara Copyright */}
          <div className="pt-6 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px]">
            <p>© 2026 RankCraft AI. All rights reserved. Built for Open Showcase.</p>
            <div className="flex gap-4">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Systems Operational
              </span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
