import {
  Bell,
  ChevronDown,
  CheckCircle2,
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
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { VIEW_MODES } from '../../constants/authoring'
import { useAuthoringStore } from '../../store/useAuthoringStore'
import type { TreeNode } from '../../types/node'

type ActionPanel =
  | 'invite'
  | 'notifications'
  | 'profile'
  | 'whats-new'
  | 'help'
  | 'feedback'
  | 'shortcuts'
  | 'logout'
  | null

const flattenTree = (nodes: TreeNode[]): TreeNode[] =>
  nodes.flatMap((node) => [node, ...flattenTree(node.children ?? [])])

export function TopBar() {
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<ActionPanel>(null)
  const [toast, setToast] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [feedback, setFeedback] = useState('')
  const isDrawerOpen = useAuthoringStore((state) => state.isDrawerOpen)
  const toggleDrawer = useAuthoringStore((state) => state.toggleDrawer)
  const tree = useAuthoringStore((state) => state.tree)
  const setActiveNode = useAuthoringStore((state) => state.setActiveNode)
  const viewMode = useAuthoringStore((state) => state.viewMode)
  const setViewMode = useAuthoringStore((state) => state.setViewMode)
  const theme = useAuthoringStore((state) => state.theme)
  const toggleTheme = useAuthoringStore((state) => state.toggleTheme)
  const isDark = theme === 'dark'
  const searchableNodes = useMemo(() => flattenTree(tree), [tree])

  const showToast = (message: string) => {
    setToast(message)
  }

  const openPanel = (panel: Exclude<ActionPanel, null>) => {
    setActivePanel(panel)
    setIsProfileMenuOpen(false)
  }

  const closePanel = () => {
    setActivePanel(null)
  }

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return undefined
    }

    const closeProfileMenuOnOutsideClick = (event: PointerEvent) => {
      const target = event.target

      if (target instanceof Node && !profileMenuRef.current?.contains(target)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeProfileMenuOnOutsideClick)

    return () => {
      document.removeEventListener('pointerdown', closeProfileMenuOnOutsideClick)
    }
  }, [isProfileMenuOpen])

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timeout = window.setTimeout(() => setToast(''), 2400)

    return () => window.clearTimeout(timeout)
  }, [toast])

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      showToast('Type a title or collection name to search.')
      return
    }

    const match = searchableNodes.find(
      (node) =>
        node.label.toLowerCase().includes(query) ||
        node.content.title.toLowerCase().includes(query),
    )

    if (!match) {
      showToast('No matching content found.')
      return
    }

    setActiveNode(match.id)
    showToast(`Opened ${match.label}`)
  }

  const submitInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!inviteEmail.trim()) {
      showToast('Enter an email address first.')
      return
    }

    showToast(`Invitation prepared for ${inviteEmail.trim()}`)
    setInviteEmail('')
    closePanel()
  }

  const submitFeedback = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!feedback.trim()) {
      showToast('Write a short note before sending feedback.')
      return
    }

    showToast('Feedback saved for review.')
    setFeedback('')
    closePanel()
  }

  return (
    <header className="topbar">
      <div className="topbar-row">
        <button className="icon-button" type="button" onClick={toggleDrawer} aria-label="Open modules">
          <Menu size={20} />
        </button>

        <form className="search-field" aria-label="Search items" onSubmit={submitSearch}>
          <Search size={18} />
          <input
            placeholder="Search content"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </form>

        <div className="topbar-spacer" />

        <button className="invite-button" type="button" onClick={() => openPanel('invite')}>
          <UserPlus size={16} />
          Invite team member
        </button>
        <button
          className="icon-button notification-button"
          type="button"
          aria-label="Notifications"
          onClick={() => openPanel('notifications')}
        >
          <Bell size={18} />
          <span aria-hidden="true" />
        </button>

        <div className="profile-menu" ref={profileMenuRef}>
          <button
            className="avatar-button"
            type="button"
            aria-label="User options"
            aria-expanded={isProfileMenuOpen}
            onClick={() => setIsProfileMenuOpen((value) => !value)}
          >
            <span>FL</span>
            <ChevronDown size={14} />
          </button>
          <div className={`profile-popover ${isProfileMenuOpen ? 'open' : ''}`}>
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
            <button type="button" onClick={() => openPanel('profile')}>
              <span className="popover-label">
                <User size={16} />
                Profile
              </span>
            </button>
            <button className="selected" type="button" onClick={() => openPanel('whats-new')}>
              <span className="popover-label">
                <Sparkles size={16} />
                What's new
              </span>
              <span className="new-pill">New</span>
            </button>
            <button type="button" onClick={() => openPanel('help')}>
              <span className="popover-label">
                <HelpCircle size={16} />
                Help
              </span>
            </button>
            <button type="button" onClick={() => openPanel('feedback')}>
              <span className="popover-label">
                <MessageSquareText size={16} />
                Send feedback
              </span>
            </button>
            <button type="button" onClick={() => openPanel('shortcuts')}>
              <span className="popover-label">
                <Keyboard size={16} />
                Hints and shortcuts
              </span>
            </button>
            <button className="logout-row" type="button" onClick={() => openPanel('logout')}>
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
              onClick={() => {
                setViewMode(mode.id)
                showToast(`${mode.label} view selected`)
              }}
            >
              <Icon size={15} />
              {mode.label}
            </button>
          )
        })}
      </nav>

      {isDrawerOpen ? (
        <aside className="module-drawer">
          <button type="button" onClick={() => showToast('Authoring workspace is already open.')}>
            Authoring workspace
          </button>
          <button type="button" onClick={() => showToast('Review queue has 3 items pending.')}>
            Review queue
          </button>
          <button type="button" onClick={() => showToast('Published courses view is ready.')}>
            Published courses
          </button>
          <button type="button" onClick={() => showToast('Asset library opened.')}>
            Asset library
          </button>
        </aside>
      ) : null}

      {activePanel ? (
        <div className="utility-panel-backdrop" role="presentation" onMouseDown={closePanel}>
          <section
            className="utility-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Account action"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="utility-panel-close" type="button" onClick={closePanel}>
              Close
            </button>
            {activePanel === 'invite' ? (
              <>
                <h2>Invite team member</h2>
                <p>Add a reviewer or co-author to this course workspace.</p>
                <form className="panel-form" onSubmit={submitInvite}>
                  <label>
                    Email address
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={inviteEmail}
                      onChange={(event) => setInviteEmail(event.target.value)}
                    />
                  </label>
                  <button type="submit">Send invite</button>
                </form>
              </>
            ) : null}
            {activePanel === 'notifications' ? (
              <>
                <h2>Notifications</h2>
                <ul className="panel-list">
                  <li>
                    <CheckCircle2 size={17} />
                    WYSIWYG Editor was autosaved.
                  </li>
                  <li>
                    <CheckCircle2 size={17} />
                    Quiz is waiting for reviewer assignment.
                  </li>
                  <li>
                    <CheckCircle2 size={17} />
                    Asset upload tools are available from the editor.
                  </li>
                </ul>
              </>
            ) : null}
            {activePanel === 'profile' ? (
              <>
                <h2>Profile</h2>
                <dl className="profile-details">
                  <div>
                    <dt>Name</dt>
                    <dd>Fathima Lal</dd>
                  </div>
                  <div>
                    <dt>Role</dt>
                    <dd>Course creator</dd>
                  </div>
                  <div>
                    <dt>Workspace</dt>
                    <dd>DFIN Authoring</dd>
                  </div>
                </dl>
              </>
            ) : null}
            {activePanel === 'whats-new' ? (
              <>
                <h2>What's new</h2>
                <ul className="panel-list">
                  <li>Cleaner course outline navigation.</li>
                  <li>Reviewer assignment action added to the editor header.</li>
                  <li>Dark mode is saved on this device.</li>
                </ul>
              </>
            ) : null}
            {activePanel === 'help' ? (
              <>
                <h2>Help</h2>
                <p>Select a course item from the outline, edit the title and body, then add media or assessment blocks from the plus button.</p>
              </>
            ) : null}
            {activePanel === 'feedback' ? (
              <>
                <h2>Send feedback</h2>
                <form className="panel-form" onSubmit={submitFeedback}>
                  <label>
                    Feedback
                    <textarea
                      rows={4}
                      placeholder="Describe what needs attention"
                      value={feedback}
                      onChange={(event) => setFeedback(event.target.value)}
                    />
                  </label>
                  <button type="submit">Submit feedback</button>
                </form>
              </>
            ) : null}
            {activePanel === 'shortcuts' ? (
              <>
                <h2>Hints and shortcuts</h2>
                <ul className="shortcut-list">
                  <li>
                    <kbd>Enter</kbd>
                    Search and open the first matching item.
                  </li>
                  <li>
                    <kbd>Ctrl</kbd> <kbd>B</kbd>
                    Apply bold text in the editor.
                  </li>
                  <li>
                    <kbd>Ctrl</kbd> <kbd>K</kbd>
                    Add a link to selected text.
                  </li>
                </ul>
              </>
            ) : null}
            {activePanel === 'logout' ? (
              <>
                <h2>Log out</h2>
                <p>This demo keeps your course edits in local storage. Logging out will only close this menu.</p>
                <div className="panel-actions">
                  <button type="button" onClick={closePanel}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closePanel()
                      showToast('Logged out from this demo session.')
                    }}
                  >
                    Log out
                  </button>
                </div>
              </>
            ) : null}
          </section>
        </div>
      ) : null}

      {toast ? <div className="toast-message">{toast}</div> : null}
    </header>
  )
}
