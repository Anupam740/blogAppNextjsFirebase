import Link from 'next/link'
import {auth} from '../Firebase'
export default function NavBar({user}) {
    
    return (
        <nav>
        <div className="nav-wrapper #fb8c00 orange darken-1">
          <Link href="/" className="brand-logo">webSkitters</Link>
          <ul id="nav-mobile" className="right">
            {user?
            <>
              <li><Link href="/createblog">Create Blog</Link></li>
              <li> <button  className="btn red" onClick={()=>auth.signOut()}>Logout</button></li>
            </>
            
            :
                <>
                <li><Link href="/signup">Signup</Link></li>
                <li><Link href="/login">Login</Link></li>
                </>
            }
            
          </ul>
        </div>
      </nav>
    )
}