import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './screens/Landing'
import LearnLayout from './components/LearnLayout'
import Home from './screens/Home'
import SkillMap from './screens/SkillMap'
import ChooseCase from './screens/ChooseCase'
import Assess from './screens/Assess'
import Feedback from './screens/Feedback'
import Chat from './screens/Chat'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/learn" element={<LearnLayout />}>
        <Route index element={<Home />} />
        <Route path="skill-map" element={<SkillMap />} />
        <Route path="choose-case" element={<ChooseCase />} />
        <Route path="assess/:caseId" element={<Assess />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
