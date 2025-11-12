import React from 'react'
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Ga terug naar de vorige pagina
    };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/raivis-razgals-ostLWBW4hsw-unsplash.jpg')" }}
    >
        <div className="bg-white bg-opacity-70 p-8 rounded shadow-lg w-full max-w-md">
            <h1>404 - Page not found</h1>
            <p>The page that you want to visit does not exist.</p>
           <button
              type="button"
              className="text-sm text-blue-500 hover:text-blue-700"
              onClick={handleGoBack} // Call handleGoBack on click
            >
              Go back to previous page
            </button>
        </div>
    </div>
  )
}

export default NotFound