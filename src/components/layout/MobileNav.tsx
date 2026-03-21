import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setActiveView } from '../../store/slices/uiSlice'


export default function MobileNav() {
  const dispatch = useAppDispatch()
  const activeView = useAppSelector(s => s.ui.activeView)

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700/50 flex z-40 safe-area-pb">
      <NavItem
        icon="📅"
        label="Schedule"
        active={activeView === 'schedule' || activeView === 'gameDetail'}
        onClick={() => {
          dispatch(setActiveView('schedule'))
        }}
      />
      <NavItem
        icon="📊"
        label="Standings"
        active={activeView === 'standings'}
        onClick={() => dispatch(setActiveView('standings'))}
      />
      <NavItem
        icon="🏆"
        label="Bracket"
        active={activeView === 'bracket'}
        onClick={() => dispatch(setActiveView('bracket'))}
      />
    </nav>
  )
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
        active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
      }`}
    >
      <span className="text-xl leading-none">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
