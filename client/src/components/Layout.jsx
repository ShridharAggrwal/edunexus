import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div>
      <header className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur">
        <nav className="nav">
          <Link to="/" className="brand">Edunexus</Link>
          <div className="flex-1" />
          {user ? (
            <div className="flex items-center gap-4 text-sm">
              <Link className="linklike" to="/">Courses</Link>
              {user.role === 'student' && (
                <Link className="linklike" to="/me/enrollments">Enrollments</Link>
              )}
              {user.role === 'instructor' || user.role === 'admin' ? (
                <Link className="linklike" to="/instructor">Instructor</Link>
              ) : null}
              {user.role === 'admin' && <Link className="linklike" to="/admin">Admin</Link>}
              <span className="text-gray-400">|</span>
              <button className="linklike" onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm">
              <Link className="linklike" to="/login">Login</Link>
              <Link className="linklike" to="/register">Register</Link>
            </div>
          )}
        </nav>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
}


