import { Mic, Layers, Bookmark, RefreshCw, Brain, Database } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Radar</h1>
      <p className="text-gray-500 text-sm mb-10">Your personal research dashboard for podcast content</p>

      {/* What it is */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">What it is</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Content Hub aggregates news and articles from 13 sources across Culture, Business, Finance, and Startups —
          the four areas you care about for your podcast. Instead of checking multiple sites every day, everything
          surfaces here ranked by what you actually engage with.
        </p>
      </section>

      {/* Pages */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Pages</h2>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
              <Mic size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Feed</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your main view. Articles from all sources, sorted by relevance and recency. Use the category
                buttons to filter. Hit <span className="inline-flex items-center gap-1 font-medium text-gray-700"><RefreshCw size={11} /> Refresh</span> to
                pull the latest articles on demand.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
              <Layers size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Pipeline</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                A Kanban board that tracks your episode ideas through 6 stages: <span className="font-medium text-gray-700">Idea → Research → Script → Recording → Editing → Published</span>.
                Click any card to open a detail panel where you can edit notes and source links.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
              <Bookmark size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Saved</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                A list of all your captured episodes, with status and timestamps. Every article you mark as an
                episode idea also appears here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to use it */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">How to use it daily</h2>
        <ol className="space-y-3">
          {[
            { n: '1', text: 'Open Feed and scroll through today\'s articles.' },
            { n: '2', text: 'Click an article title to read it in a new tab.' },
            { n: '3', text: 'Hit "Episode idea" on anything that sparks an idea — it goes straight to your Pipeline.' },
            { n: '4', text: 'Hit "Save" on articles you want to reference later without making a full episode.' },
            { n: '5', text: 'Dismiss anything irrelevant — it trains the recommender to show you less of that.' },
            { n: '6', text: 'Open Pipeline to move episodes forward as you work on them.' },
          ].map(({ n, text }) => (
            <li key={n} className="flex gap-3 text-sm text-gray-600">
              <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">{n}</span>
              {text}
            </li>
          ))}
        </ol>
      </section>

      {/* Recommender */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">How the recommender works</h2>
        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 mb-4">
          <Brain size={18} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-500 leading-relaxed">
            Every action you take updates a weight for that article's category. The bar chart on the Feed page
            shows the current weights live. Over time, the feed shifts toward what you actually engage with.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { action: 'Mark as episode idea', delta: '+4.0', color: 'text-purple-600 bg-purple-50' },
            { action: 'Save', delta: '+2.0', color: 'text-blue-600 bg-blue-50' },
            { action: 'Click to read', delta: '+0.3', color: 'text-gray-600 bg-gray-100' },
            { action: 'Dismiss', delta: '−1.5', color: 'text-red-500 bg-red-50' },
          ].map(({ action, delta, color }) => (
            <div key={action} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-gray-600">{action}</span>
              <span className={`font-semibold px-2 py-0.5 rounded-full ${color}`}>{delta}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Sources</h2>
        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 mb-4">
          <Database size={18} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-500 leading-relaxed">
            13 RSS feeds refresh every 15 minutes automatically. All content belongs to its respective publisher —
            click any source to visit their site.
          </p>
        </div>
        <div className="space-y-3">
          {([
            { cat: 'Culture', color: 'bg-pink-100 text-pink-700', sources: [
              { name: 'The Verge', url: 'https://www.theverge.com' },
              { name: 'Mashable', url: 'https://mashable.com' },
              { name: 'Reddit r/OutOfTheLoop', url: 'https://www.reddit.com/r/OutOfTheLoop/' },
            ]},
            { cat: 'Business', color: 'bg-blue-100 text-blue-700', sources: [
              { name: 'Fortune', url: 'https://fortune.com' },
              { name: 'Fast Company', url: 'https://www.fastcompany.com' },
              { name: 'Inc.', url: 'https://www.inc.com' },
            ]},
            { cat: 'Finance', color: 'bg-green-100 text-green-700', sources: [
              { name: 'CNBC', url: 'https://www.cnbc.com' },
              { name: 'WSJ Markets', url: 'https://www.wsj.com/news/markets' },
              { name: 'Investing.com', url: 'https://www.investing.com' },
            ]},
            { cat: 'Startups', color: 'bg-orange-100 text-orange-700', sources: [
              { name: 'TechCrunch', url: 'https://techcrunch.com' },
              { name: 'Hacker News', url: 'https://news.ycombinator.com' },
              { name: 'Product Hunt', url: 'https://www.producthunt.com' },
              { name: 'MIT Tech Review', url: 'https://www.technologyreview.com' },
            ]},
          ] as { cat: string; color: string; sources: { name: string; url: string }[] }[]).map(({ cat, color, sources }) => (
            <div key={cat} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color} mb-3 inline-block`}>{cat}</span>
              <div className="flex flex-wrap gap-2">
                {sources.map(({ name, url }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-600 transition-colors"
                  >
                    {name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
