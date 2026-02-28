import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/ThemeContext'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import LearnLayout from './components/LearnLayout'
import PhysicsLoader from './components/PhysicsLoader'

// Code-split every screen — only the current route's chunk is loaded
const Landing = lazy(() => import('./screens/Landing'))
const Auth = lazy(() => import('./screens/Auth'))
const Home = lazy(() => import('./screens/Home'))
const SkillMap = lazy(() => import('./screens/SkillMap'))
const ChooseCase = lazy(() => import('./screens/ChooseCase'))
const Assess = lazy(() => import('./screens/Assess'))
const Feedback = lazy(() => import('./screens/Feedback'))
const Chat = lazy(() => import('./screens/Chat'))
const AnimationChat = lazy(() => import('./screens/AnimationChat'))
const Forum = lazy(() => import('./screens/Forum'))
const ForumPost = lazy(() => import('./screens/ForumPost'))
const NotFound = lazy(() => import('./screens/NotFound'))

function PageFallback() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--primary-bg)', gap: 0,
    }}>
      {/* ByteWave wordmark */}
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700,
        color: 'var(--primary-text)', letterSpacing: '-0.03em',
        marginBottom: 4, opacity: 0.5,
      }}>Byte Wave</div>
      <PhysicsLoader label="Loading…" />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth />} />

            {/* Protected Routes (now open for preview) */}
            <Route path="/chat" element={<Chat />} />
            <Route path="/animate" element={<AnimationChat />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:postId" element={<ForumPost />} />
            <Route path="/learn" element={<LearnLayout />}>
              <Route index element={<Home />} />
              <Route path="skill-map" element={<SkillMap />} />
              <Route path="choose-case" element={<ChooseCase />} />
              <Route path="assess/:caseId" element={<Assess />} />
              <Route path="feedback" element={<Feedback />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </AuthProvider>
  )
}
