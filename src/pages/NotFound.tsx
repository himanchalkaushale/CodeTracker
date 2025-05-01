import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiHome } from 'react-icons/fi'

export default function NotFound() {
  const navigate = useNavigate()
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6">Page Not Found</h2>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-md text-center mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline flex items-center"
        >
          <FiArrowLeft className="mr-2" />
          <span>Go Back</span>
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary flex items-center"
        >
          <FiHome className="mr-2" />
          <span>Go Home</span>
        </button>
      </div>
    </div>
  )
}