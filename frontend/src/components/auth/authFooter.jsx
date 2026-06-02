import React from 'react'
import { Link } from 'react-router-dom'

const AuthFooter = ({ showBack = true}) => {
  return (
    
       <footer className="border-t border-[#d3e4fe] bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>
            © 2026 Kaamsetu. Excellence in Craftsmanship.
          </p>

          <div className="flex gap-6">
            <Link to={"#"}>Privacy Policy</Link>
            <Link to={"#"}>Terms of Service</Link>
            <Link to={"#"}>Help Center</Link>
          </div>
        </div>
      </footer>
    
  )
}

export default AuthFooter
