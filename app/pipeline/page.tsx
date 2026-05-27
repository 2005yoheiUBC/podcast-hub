'use client'
import { useEffect, useState } from 'react'
import { Trash2, Plus, ChevronRight } from 'lucide-react'

interface Episode {
  id: string
  title: string
  category: string
  status: string
  notes: string
  source_url: string
  created_at: number
  updated_at: number
}

const STATUSES = [
  { key: 'idea', label: '💡 Idea' },
  { key: 'research', label: '🔍 Research' },
  { key: 'script', label: '✍️ Script' },
  { key: 'recording', label: '🎤 Recording' },
  { key: 'editing', label: '✂️ Editing' },
  { key: 'published', label: '✅ Published' },
]

const NEXT_STATUS: Record<string, string> = {
  idea: 'research', research: 'script', script: 'recording',
  recording: 'editing', editing: 'published',
}

const CATEGORY_COLORS: Record<string, string> = {
  Culture: 'bg-pink-100 text-pink-700',
  Business: 'bg-blue-100 text-blue-700',
  Finance: 'bg-green-100 text-green-700',
  Startups: 'bg-orange-100 text-orange-700',
  Other: 'bg-gray-100 text-gray-600',
}

export default function PipelinePage() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [selected, setSelected] = useState<Episode | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)

  const load = async () => {
    const r = await fetch('/api/episodes')
    setEpisodes(await r.json())
  }

  useEffect(() => { load() }, [])

  const advance = async (ep: Episode) => {
    const next = NEXT_STATUS[ep.status]
    if (!next) return
    await fetch(`/api/episodes/${ep.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    load()
    if (selected?.id === ep.id) setSelected({ ...ep, status: next })
  }

  const del = async (id: string) => {
    await fetch(`/api/episodes/${id}`, { method: 'DELETE' })
    if (selected?.id === id) setSelected(null)
    load()
  }

  const saveNotes = async (ep: Episode, notes: string) => {
    await fetch(`/api/episodes/${ep.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    })
    load()
  }

  const addEpisode = async () => {
    if (!newTitle.trim()) return
    await fetch('/api/episodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim() }),
    })
    setNewTitle('')
    setAdding(false)
    load()
  }

  const byStatus = (status: string) => episodes.filter((e) => e.status === status)

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Episode Pipeline</h1>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Plus size={14} /> New episode
        </button>
      </div>

      {adding && (
        <div className="mb-6 flex gap-2">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEpisode()}
            placeholder="Episode title…"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button onClick={addEpisode} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg">Add</button>
          <button onClick={() => setAdding(false)} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
        </div>
      )}

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {STATUSES.map(({ key, label }) => (
          <div key={key} className="min-w-0">
            <div className="text-xs font-semibold text-gray-500 mb-2 truncate">{label}</div>
            <div className="space-y-2">
              {byStatus(key).map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => setSelected(ep)}
                  className={`bg-white border rounded-xl p-3 cursor-pointer hover:shadow-sm transition-all text-xs ${
                    selected?.id === ep.id ? 'border-gray-900 shadow-sm' : 'border-gray-100'
                  }`}
                >
                  <div className={`inline-block px-1.5 py-0.5 rounded-full text-xs mb-1.5 ${CATEGORY_COLORS[ep.category] || CATEGORY_COLORS.Other}`}>
                    {ep.category}
                  </div>
                  <p className="font-medium text-gray-800 leading-snug line-clamp-2">{ep.title}</p>
                  {NEXT_STATUS[ep.status] && (
                    <button
                      onClick={(e) => { e.stopPropagation(); advance(ep) }}
                      className="mt-2 flex items-center gap-0.5 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <ChevronRight size={11} />
                      <span>{STATUSES.find(s => s.key === NEXT_STATUS[ep.status])?.label.split(' ')[1]}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-100 shadow-xl z-40 flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">
                {STATUSES.find(s => s.key === selected.status)?.label}
              </p>
              <h2 className="font-semibold text-gray-900 text-sm leading-snug">{selected.title}</h2>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 ml-2 mt-0.5 text-lg leading-none">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {selected.source_url && (
              <a href={selected.source_url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline break-all">
                {selected.source_url}
              </a>
            )}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Notes</label>
              <textarea
                defaultValue={selected.notes || ''}
                onBlur={(e) => saveNotes(selected, e.target.value)}
                placeholder="Research notes, talking points, ideas…"
                rows={10}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              />
            </div>
            {NEXT_STATUS[selected.status] && (
              <button
                onClick={() => advance(selected)}
                className="w-full py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                Move to {STATUSES.find(s => s.key === NEXT_STATUS[selected.status])?.label}
              </button>
            )}
          </div>
          <div className="p-5 border-t border-gray-100">
            <button
              onClick={() => del(selected.id)}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={13} /> Delete episode
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
