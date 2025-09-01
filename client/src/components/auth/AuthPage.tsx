import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignUpForm } from './SignUpForm'
// import snappyLearnLogo from '@assets/snappylearn-logo-transparent.png'

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4">
            <img src="/snappylearn-transparent-logo.png" alt="TheoAssist" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TheoAssist</h1>
          <p className="text-gray-600 mt-2">
            Your daily companion for spiritual growth
          </p>
        </div>

        {isSignUp ? (
          <SignUpForm onToggleMode={() => setIsSignUp(false)} />
        ) : (
          <LoginForm onToggleMode={() => setIsSignUp(true)} />
        )}
      </div>
    </div>
  )
}