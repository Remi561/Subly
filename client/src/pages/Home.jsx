
import { Link } from 'react-router'

const Home = () => {
  return (
      <div>
          <p>welcome to subly</p>
          <Link to={'/auth/login'}>Login</Link>
          <Link to={'/auth/register'}>Register</Link>

          
    </div>
  )
}

export default Home