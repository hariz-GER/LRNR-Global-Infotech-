import {
  Bell,
  ChevronDown,
  Grid2X2,
  ListTree,
  Menu,
  Moon,
  Search,
  UserPlus,
} from 'lucide-react'
import { useAuthoringStore } from '../../store/useAuthoringStore'

const modes = [
  { id: 'all', label: 'All' },
  { id: 'board', label: 'Board' },
  { id: 'graph', label: 'Graph' },
  { id: 'recent', label: 'Recent' },
] as const

export function TopBar() {
  const isDrawerOpen = useAuthoringStore((state) => state.isDrawerOpen)
  const toggleDrawer = useAuthoringStore((state) => state.toggleDrawer)
  const viewMode = useAuthoringStore((state) => state.viewMode)
  const setViewMode = useAuthoringStore((state) => state.setViewMode)

  return (
    <header className="topbar">
      <div className="topbar-row">
        <button className="icon-button" type="button" onClick={toggleDrawer} aria-label="Open modules">
          <Menu size={20} />
        </button>

        <label className="search-field" aria-label="Search items">
          <Search size={18} />
          <input placeholder="dfin" />
        </label>

        <div className="topbar-spacer" />

        <button className="invite-button" type="button">
          <UserPlus size={16} />
          Invite team member
        </button>
        <button className="icon-button" type="button" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <div className="profile-menu">
          <button className="avatar-button" type="button" aria-label="User options">
            <span>FL</span>
            <ChevronDown size={14} />
          </button>
          <div className="profile-popover">
            <label className="popover-row">
              <span>Dark mode</span>
              <span className="toggle">
                <Moon size={13} />
              </span>
            </label>
            <button type="button">Profile</button>
            <button className="selected" type="button">
              What's new
            </button>
            <button type="button">Help</button>
            <button type="button">Send feedback</button>
            <button type="button">Hints and shortcuts</button>
            <button type="button">Log out</button>
          </div>
        </div>
      </div>

      <nav className="view-tabs" aria-label="Item render options">
        {modes.map((mode) => (
          <button
            className={viewMode === mode.id ? 'active' : ''}
            key={mode.id}
            type="button"
            onClick={() => setViewMode(mode.id)}
          >
            {mode.id === 'graph' ? <Grid2X2 size={15} /> : <ListTree size={15} />}
            {mode.label}
          </button>
        ))}
      </nav>

      {isDrawerOpen ? (
        <aside className="module-drawer">
          <button type="button">Authoring workspace</button>
          <button type="button">Review queue</button>
          <button type="button">Published courses</button>
          <button type="button">Asset library</button>
        </aside>
      ) : null}
    </header>
  )
}
