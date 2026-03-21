import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setActiveView } from '../../store/slices/uiSlice'

type View = 'schedule' | 'standings' | 'bracket'

const TABS: { id: View; label: string }[] = [
  { id: 'schedule', label: 'Schedule' },
  { id: 'standings', label: 'Standings' },
  { id: 'bracket', label: 'Bracket' },
]

export default function NavBar() {
  const dispatch = useAppDispatch()
  const activeView = useAppSelector(s => s.ui.activeView)

  return (
    <nav className="hidden md:flex border-b border-gray-200 dark:border-gray-700/50 shrink-0">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => dispatch(setActiveView(tab.id))}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeView === tab.id || (activeView === 'gameDetail' && tab.id === 'schedule')
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
