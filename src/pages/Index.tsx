import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Wrench } from "lucide-react"
import { getDashboardPath } from "@/routes/utils"

export default function Index() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [showDevMode, setShowDevMode] = useState(false)

  // For development: Press D five times to show the dev mode button
  const [keyPresses, setKeyPresses] = useState(0)
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'd') {
        setKeyPresses(prev => {
          const newCount = prev + 1
          if (newCount >= 5) {
            setShowDevMode(true)
            return 0
          }
          return newCount
        })
      } else {
        setKeyPresses(0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // This component is just a router that will redirect to the appropriate dashboard
  // The auth screens are handled by the RootClientWrapper component
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role using the utility function
      const dashboardPath = getDashboardPath(user.role)
      navigate(dashboardPath, { replace: true })
    }
    // If not authenticated, the RootClientWrapper will show the auth screens
  }, [isAuthenticated, user, navigate])

  // Show a dev mode button if triggered
  if (showDevMode) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Link to="/dev-login">
          <Button variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Dev Mode
          </Button>
        </Link>
      </div>
    )
  }

  // Return null as this component doesn't render anything directly
  return null
}
