import { useState, useMemo } from 'react'
import MemberTable from '../components/MemberTable'
import { KickIcon } from '../components/icons/KickIcon'
import './Dashboard.css'

export type Rank = 'white' | 'blue' | 'purple' | 'brown' | 'black'

export interface Member {
  id: number
  name: string
  rank: Rank
  hasPaid: boolean
  paidAt: string | null
}

const MOCK_MEMBERS: Member[] = [
  { id: 1,  name: 'Marcus Sterling', rank: 'black',  hasPaid: true,  paidAt: '2025-05-01' },
  { id: 2,  name: 'Elena Rodriguez', rank: 'purple', hasPaid: true,  paidAt: '2025-04-28' },
  { id: 3,  name: 'Julian Kang',     rank: 'brown',  hasPaid: false, paidAt: null         },
  { id: 4,  name: 'Sarah Ahmed',     rank: 'blue',   hasPaid: true,  paidAt: '2025-05-10' },
  { id: 5,  name: 'Thomas Chen',     rank: 'white',  hasPaid: true,  paidAt: '2025-03-15' },
  { id: 6,  name: 'Alex Kim',        rank: 'blue',   hasPaid: false, paidAt: null         },
  { id: 7,  name: 'Maria Santos',    rank: 'purple', hasPaid: true,  paidAt: '2025-04-02' },
  { id: 8,  name: 'David Park',      rank: 'white',  hasPaid: false, paidAt: null         },
]

interface Props {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch]           = useState('')
  const [rankFilter, setRankFilter]   = useState<Rank | ''>('')
  const [paidFilter, setPaidFilter]   = useState<'paid' | 'unpaid' | ''>('')

  const filtered = useMemo(() =>
    MOCK_MEMBERS.filter(m => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false
      if (rankFilter && m.rank !== rankFilter) return false
      if (paidFilter === 'paid'   && !m.hasPaid) return false
      if (paidFilter === 'unpaid' &&  m.hasPaid) return false
      return true
    }),
    [search, rankFilter, paidFilter]
  )

  const hasFilters = search !== '' || rankFilter !== '' || paidFilter !== ''

  return (
    <div className="db-layout">
      {sidebarOpen && (
        <div className="db-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`db-sidebar${sidebarOpen ? ' db-sidebar--open' : ''}`}>
        <div className="db-brand">
          <KickIcon />
          <div className="db-brand-text">
            <div className="db-brand-name">Kult</div>
            <div className="db-brand-sub">Jiu-Jitsu</div>
          </div>
        </div>

        <nav className="db-nav">
          <a className="db-nav-item db-nav-item--active" href="#">Students</a>
          <a className="db-nav-item" href="#">Classes</a>
          <a className="db-nav-item" href="#">Billing</a>
        </nav>

        <div className="db-sidebar-footer">
          <button className="db-logout-btn" onClick={onLogout}>Log Out</button>
        </div>
      </aside>

      <main className="db-main">
        <div className="db-mobile-bar">
          <button className="db-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
          <div className="db-mobile-brand">
            <KickIcon />
            <span className="db-brand-name">Kult</span>
          </div>
        </div>

        <div className="db-content">
          <h1 className="db-title">Student Directory</h1>
          <p className="db-subtitle">Manage and track membership status for your academy members.</p>

          <div className="db-filter-panel">
            <div className="db-filter-search-wrap">
              <svg className="db-filter-icon" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                className="db-filter-search"
                placeholder="Search by name"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select
              className="db-select"
              value={rankFilter}
              onChange={e => setRankFilter(e.target.value as Rank | '')}
            >
              <option value="">All Ranks</option>
              <option value="white">White Belt</option>
              <option value="blue">Blue Belt</option>
              <option value="purple">Purple Belt</option>
              <option value="brown">Brown Belt</option>
              <option value="black">Black Belt</option>
            </select>

            <select
              className="db-select"
              value={paidFilter}
              onChange={e => setPaidFilter(e.target.value as 'paid' | 'unpaid' | '')}
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>

            {hasFilters && (
              <button
                className="db-clear-btn"
                onClick={() => { setSearch(''); setRankFilter(''); setPaidFilter('') }}
              >
                Clear Filters
              </button>
            )}
          </div>

          <MemberTable members={filtered} />
        </div>
      </main>
    </div>
  )
}
