const FINANCE_IMAGES: { file: string; keywords: string[] }[] = [
  { file: 'fin1.jpg',  keywords: ['stock', 'stocks', 'earnings', 'profit', 'growth', 'rise', 'gain', 'rally', 'bull', 'returns', 'surge', 'soar', 'climb'] },
  { file: 'fin2.jpg',  keywords: ['analysis', 'report', 'quarter', 'results', 'audit', 'review', 'coins', 'quarterly'] },
  { file: 'fin3.jpg',  keywords: ['real estate', 'property', 'housing', 'mortgage', 'rent', 'home', 'currency', 'forex', 'exchange rate', 'hryvnia'] },
  { file: 'fin4.jpg',  keywords: ['wall street journal', 'wsj', 'newspaper', 'media', 'financial news'] },
  { file: 'fin5.jpg',  keywords: ['trading', 'trader', 'floor', 'nyse', 'nasdaq', 'volatile', 'volatility', 'sell-off', 'chaos', 'panic'] },
  { file: 'fin6.jpg',  keywords: ['investment', 'invest', 'portfolio', 'fund', 'cash flow', 'money', 'dollar'] },
  { file: 'fin7.jpg',  keywords: ['bonds', 'etf', 'mutual fund', 'asset allocation', 'diversif', 'where to invest', 'gold', 'forex'] },
  { file: 'fin8.jpg',  keywords: ['dollar', 's&p', 'dow jones', 'index', 'indices', 'benchmark', 'wall street', 'market index'] },
  { file: 'fin9.jpg',  keywords: ['global', 'international', 'europe', 'asia', 'world market', 'financial times', 'foreign', 'trade war', 'tariff'] },
  { file: 'fin10.jpg', keywords: ['loss', 'losing', 'fall', 'drop', 'recession', 'crisis', 'bankruptcy', 'debt', 'deficit', 'collapse'] },
  { file: 'fin11.jpg', keywords: ['tax', 'taxes', 'payment', 'bill', 'personal finance', 'budget', 'salary', 'income', 'wage', 'pay', 'irs'] },
  { file: 'fin12.jpg', keywords: ['wall street', 'nyse', 'new york', 'us market', 'american market', 'stock exchange'] },
  { file: 'fin13.jpg', keywords: ['strategy', 'planning', 'plan', 'blueprint', 'outlook', 'forecast'] },
  { file: 'fin14.jpg', keywords: ['corporate', 'business', 'meeting', 'company', 'ceo', 'management', 'business growth', 'executives'] },
  { file: 'fin15.jpg', keywords: ['boardroom', 'board', 'executive', 'corporate meeting', 'shareholder', 'leadership'] },
  { file: 'fin16.jpg', keywords: ['debt', 'bankrupt', 'crisis', 'recession', 'decline', 'financial crisis', 'default', 'downturn', 'depression'] },
  { file: 'fin17.jpg', keywords: ['candlestick', 'chart', 'technical analysis', 'stock chart', 'trading signal', 'market trend'] },
  { file: 'fin18.jpg', keywords: ['inflation', 'interest rate', 'rate hike', 'fed', 'federal reserve', 'central bank', 'pressure', 'bubble', 'crash', 'oil'] },
  { file: 'fin19.jpg', keywords: ['emerging market', 'developing', 'poverty', 'inequality', 'brazil', 'latin america', 'currency crisis', 'economic', 'global south'] },
  { file: 'fin20.jpg', keywords: ['trader', 'broker', 'trading desk', 'market maker', 'vintage', 'wall street', 'pit'] },
]

export function getFinanceFallback(title: string, used: Set<string>): string | null {
  const lower = title.toLowerCase()

  const scored = FINANCE_IMAGES.map((img) => ({
    path: `/images/finance/${img.file}`,
    score: img.keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0),
  })).sort((a, b) => b.score - a.score)

  for (const img of scored) {
    if (!used.has(img.path)) {
      used.add(img.path)
      return img.path
    }
  }

  return null
}
