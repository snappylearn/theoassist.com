import { GoogleOAuthStatus } from '@/components/GoogleOAuthStatus'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'wouter'

export default function OAuthStatusPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Authentication Status
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Check and configure your Google OAuth authentication
          </p>
        </div>

        <GoogleOAuthStatus />
      </div>
    </div>
  )
}