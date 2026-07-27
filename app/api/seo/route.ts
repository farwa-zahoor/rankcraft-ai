// app/api/seo/route.ts

import { NextResponse } from 'next/server';

// 1. Unique "Hash" generate karne ka function based on text
// Yeh humesha same text par same number return karega.
const getDeterministicHash = (text: string) => {
  let hash = 0;
  if (text.length === 0) return hash;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash); // Positive number
};

export async function POST(req: Request) {
  try {
    const { keyword, country = 'us' } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    // 2. Deterministic Hash generate karein based on Keyword + Country combination
    const uniqueInput = `${keyword.trim().toLowerCase()}-${country.toLowerCase()}`;
    const hash = getDeterministicHash(uniqueInput);

    // --- Deterministic Metrics Generation (DETERMINISTIC! No more random) ---

    // Difficulty Score: Hash ko range mein map karein (e.g., 20 to 80)
    // Hash ko 61 se divide karke remainder (0-60) nikala aur usmein 20 add kiya.
    // Jab tak Hash same hai, yeh output bilkul same rahega.
    const difficultyScore = (hash % 61) + 20; // Range: 20-80

    // Search Volume: Hash use karke volumetric number banayein (e.g., 10K to 150K)
    const baseVol = (hash % 141) + 10; // Remainder: 0-140, then +10 -> 10-150
    const searchVolume = `${baseVol.toFixed(1)}K`;

    // CPC: Hash use karke dollar amount banayein (e.g., $0.50 to $4.50)
    const baseCpc = (hash % 401) / 100 + 0.50; // Remainder: 0-400, /100 -> 0.00-4.00, +0.50 -> 0.50-4.50
    const cpc = `$${baseCpc.toFixed(2)}`;

    // 6-Month Search Trend: Pehle Deterministic base volume calculate karein
    const baseTrendVol = (hash % 61) + 20; // 20-80

    // Har month ke liye deterministic values generate karein based on baseTrendVol
    // Month name bhi deterministic input ka hissa hai unique factors lagane ke liye.
    const generateMonthVol = (base: number, monthFact: string) => {
      // Month name or base combined factor
      const monthHash = getDeterministicHash(`${uniqueInput}-${monthFact}`);
      // Volatility range of +/- 30% of base volume
      const volatilityFactor = (monthHash % 61) / 100 + 0.7; // 0.7 to 1.3 factor
      const monthVol = Math.round(base * volatilityFactor);
      return `${Math.max(5, monthVol)}K`; // Minimum 5K
    };

    const searchTrend = [
      { month: 'Oct', volume: generateMonthVol(baseTrendVol, 'Oct') },
      { month: 'Nov', volume: generateMonthVol(baseTrendVol, 'Nov') },
      { month: 'Dec', volume: generateMonthVol(baseTrendVol, 'Dec') },
      { month: 'Jan', volume: generateMonthVol(baseTrendVol, 'Jan') },
      { month: 'Feb', volume: generateMonthVol(baseTrendVol, 'Feb') },
      { month: 'Mar', volume: generateMonthVol(baseTrendVol, 'Mar') }
    ];

    return NextResponse.json({
      keyword: keyword.trim(),
      country: country.toUpperCase(),
      // SEO Score is inverse of Difficulty (100 - Difficulty)
      score: 100 - difficultyScore,
      difficultyScore,
      searchVolume,
      cpc,
      searchTrend
    });

  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server Error' }, { status: 500 });
  }
}