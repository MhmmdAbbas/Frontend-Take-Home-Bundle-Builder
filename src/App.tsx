import { BundleProvider } from './context/BundleContext'
import { Home } from './pages/Home'

export default function App() {
  return (
    <BundleProvider>
      <Home />
    </BundleProvider>
  )
}
