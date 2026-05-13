import { useState, useMemo } from 'react'
import type { Member, Rank } from '../pages/Dashboard'

const RANK_LABELS: Record<Rank, string> = {
  white:  'White Belt',
  blue:   'Blue Belt',
  purple: 'Purple Belt',
  brown:  'Brown Belt',
  black:  'Black Belt',
}

const RANK_COLORS: Record<Rank, string> = {
  white:  '#d0d0d0',
  blue:   '#3b82f6',
  purple: '#7c3aed',
  brown:  '#92400e',
  black:  '#111111',
}

const RANK_ORDER: Record<Rank, number> = {
  white: 0, blue: 1, purple: 2, brown: 3, black: 4,
}

type SortKey = 'name' | 'rank' | 'hasPaid' | 'paidAt'
type SortDir = 'asc' | 'desc'

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface Props {
  members: Member[]
}

export default function MemberTable({ members }: Props) {
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [sortKey, setSortKey]   = useState<SortKey>('name')
  const [sortDir, setSortDir]   = useState<SortDir>('asc')

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = useMemo(() => {
    const mul = sortDir === 'asc' ? 1 : -1
    return [...members].sort((a, b) => {
      switch (sortKey) {
        case 'name':
          return mul * a.name.localeCompare(b.name)
        case 'rank':
          return mul * (RANK_ORDER[a.rank] - RANK_ORDER[b.rank])
        case 'hasPaid':
          return mul * (Number(b.hasPaid) - Number(a.hasPaid))
        case 'paidAt': {
          if (!a.paidAt && !b.paidAt) return 0
          if (!a.paidAt) return 1
          if (!b.paidAt) return -1
          return mul * (new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime())
        }
      }
    })
  }, [members, sortKey, sortDir])

  function handleRemindTelegram(member: Member) {
    // TODO: call Telegram reminder API
    console.log('Remind via Telegram:', member.name)
    setOpenMenu(null)
  }

  function SortIndicator({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="db-sort-icon db-sort-icon--idle">↕</span>
    return <span className="db-sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  if (members.length === 0) {
    return <div className="db-table-wrap db-empty">No members match your filters.</div>
  }

  return (
    <>
      {openMenu !== null && (
        <div className="db-menu-backdrop" onClick={() => setOpenMenu(null)} />
      )}
      <div className="db-table-wrap">
        <table className="db-table">
          <thead>
            <tr>
              <th className="db-th-sortable" onClick={() => handleSort('name')}>
                Student Name <SortIndicator col="name" />
              </th>
              <th className="db-th-sortable" onClick={() => handleSort('rank')}>
                Rank <SortIndicator col="rank" />
              </th>
              <th className="db-th-sortable" onClick={() => handleSort('hasPaid')}>
                Has Paid <SortIndicator col="hasPaid" />
              </th>
              <th className="db-th-sortable" onClick={() => handleSort('paidAt')}>
                Paid At <SortIndicator col="paidAt" />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(m => (
              <tr key={m.id}>
                <td>
                  <div className="db-member-cell">
                    <div className="db-avatar">{initials(m.name)}</div>
                    <span className="db-member-name">{m.name}</span>
                  </div>
                </td>
                <td>
                  <div className="db-rank-cell">
                    <span className="db-belt" style={{ background: RANK_COLORS[m.rank] }} />
                    <span>{RANK_LABELS[m.rank]}</span>
                  </div>
                </td>
                <td>
                  <span className={`db-badge ${m.hasPaid ? 'db-badge--paid' : 'db-badge--unpaid'}`}>
                    {m.hasPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td className="db-paid-at">
                  {m.paidAt ? formatDate(m.paidAt) : <span className="db-null">—</span>}
                </td>
                <td>
                  <div className="db-actions-wrap">
                    <button
                      className="db-actions-btn"
                      onClick={() => setOpenMenu(prev => prev === m.id ? null : m.id)}
                    >
                      Actions <span className="db-caret">▾</span>
                    </button>
                    {openMenu === m.id && (
                      <div className="db-actions-menu">
                        <button onClick={() => handleRemindTelegram(m)}>
                          Remind in Telegram
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
