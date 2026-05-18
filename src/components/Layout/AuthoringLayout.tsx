import { useEffect, useRef, useState, type FormEvent } from 'react'
import { LockKeyhole, PanelLeftOpen } from 'lucide-react'
import { RichTextEditor } from '../Editor/RichTextEditor'
import { TopBar } from '../Navbar/TopBar'
import { TreePanel } from '../Tree/TreePanel'
import { useAuthoringStore } from '../../store/useAuthoringStore'

export function AuthoringLayout() {
  const theme = useAuthoringStore((state) => state.theme)
  const isAuthenticated = useAuthoringStore((state) => state.isAuthenticated)
  const [isTreePanelOpen, setIsTreePanelOpen] = useState(true)
  const treePanelRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isTreePanelOpen) {
      return undefined
    }

    const closeTreePanelOnOutsideClick = (event: PointerEvent) => {
      if (!window.matchMedia('(max-width: 900px)').matches) {
        return
      }

      const target = event.target

      if (target instanceof Node && !treePanelRef.current?.contains(target)) {
        setIsTreePanelOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeTreePanelOnOutsideClick)

    return () => {
      document.removeEventListener('pointerdown', closeTreePanelOnOutsideClick)
    }
  }, [isTreePanelOpen])

  return (
    <div className="app-shell" data-theme={theme}>
      {isAuthenticated ? (
        <>
          <TopBar />
          <div className={`workspace ${isTreePanelOpen ? '' : 'tree-panel-closed'}`}>
            <TreePanel
              ref={treePanelRef}
              isOpen={isTreePanelOpen}
              onClose={() => setIsTreePanelOpen(false)}
            />
            {!isTreePanelOpen ? (
              <button
                className="tree-panel-open-button"
                type="button"
                onClick={() => setIsTreePanelOpen(true)}
                aria-label="Open tree panel"
                title="Open tree panel"
              >
                <PanelLeftOpen size={18} />
              </button>
            ) : null}
            <RichTextEditor />
          </div>
        </>
      ) : (
        <LoginScreen />
      )}
    </div>
  )
}

function LoginScreen() {
  const login = useAuthoringStore((state) => state.login)
  const [email, setEmail] = useState('fathima.lal@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!login(email, password)) {
      setError('Enter both email and password to continue.')
      return
    }

    setError('')
  }

  return (
    <main className="login-screen">
      <form className="login-card" onSubmit={submitLogin}>
        <span className="login-icon">
          <LockKeyhole size={22} />
          <span aria-hidden="true" />
        </span>
        <div>
          <span className="login-eyebrow">DFIN authoring</span>
          <h1>Sign in to continue</h1>
          <p>Use your workspace account to edit course content and review assignments.</p>
        </div>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="login-error">{error}</p> : null}
        <button type="submit">Log in</button>
      </form>
    </main>
  )
}
