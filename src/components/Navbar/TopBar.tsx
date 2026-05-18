import {
  Bell,
  ChevronDown,
  HelpCircle,
  Keyboard,
  LogOut,
  Menu,
  MessageSquareText,
  Moon,
  Search,
  Sparkles,
  Sun,
  User,
  UserPlus,
} from 'lucide-react'
import { VIEW_MODES } from '../../constants/authoring'
import { useAuthoringStore } from '../../store/useAuthoringStore'

export function TopBar() {
  const isDrawerOpen = useAuthoringStore((state) => state.isDrawerOpen)
  const toggleDrawer = useAuthoringStore((state) => state.toggleDrawer)
  const viewMode = useAuthoringStore((state) => state.viewMode)
  const setViewMode = useAuthoringStore((state) => state.setViewMode)
  const theme = useAuthoringStore((state) => state.theme)
  const toggleTheme = useAuthoringStore((state) => state.toggleTheme)
  const isDark = theme === 'dark'

  return (
    <header className="topbar">
      <div className="topbar-row">
        <button className="icon-button" type="button" onClick={toggleDrawer} aria-label="Open modules">
          <Menu size={20} />
        </button>

        <label className="search-field" aria-label="Search items">
          <Search size={18} />
          <input placeholder="Search content" />
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
            <div className="profile-card">
              <span className="profile-card-avatar">FL</span>
              <div>
                <strong>Fathima Lal</strong>
                <span>Course creator</span>
              </div>
            </div>
            <button
              className="popover-row theme-row"
              type="button"
              onClick={toggleTheme}
              aria-pressed={isDark}
            >
              <span>Dark mode</span>
              <span className={`toggle ${isDark ? 'on' : ''}`}>
                {isDark ? <Sun size={13} /> : <Moon size={13} />}
              </span>
            </button>
            <button type="button">
              <span className="popover-label">
                <User size={16} />
                Profile
              </span>
            </button>
            <button className="selected" type="button">
              <span className="popover-label">
                <Sparkles size={16} />
                What's new
              </span>
              <span className="new-pill">New</span>
            </button>
            <button type="button">
              <span className="popover-label">
                <HelpCircle size={16} />
                Help
              </span>
            </button>
            <button type="button">
              <span className="popover-label">
                <MessageSquareText size={16} />
                Send feedback
              </span>
            </button>
            <button type="button">
              <span className="popover-label">
                <Keyboard size={16} />
                Hints and shortcuts
              </span>
            </button>
            <button className="logout-row" type="button">
              <span className="popover-label">
                <LogOut size={16} />
                Log out
              </span>
            </button>
          </div>
        </div>
      </div>

      <nav className="view-tabs" aria-label="Item render options">
        {VIEW_MODES.map((mode) => {
          const Icon = mode.icon

          return (
            <button
              className={viewMode === mode.id ? 'active' : ''}
              key={mode.id}
              type="button"
              onClick={() => setViewMode(mode.id)}
            >
              <Icon size={15} />
              {mode.label}
            </button>
          )
        })}
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
