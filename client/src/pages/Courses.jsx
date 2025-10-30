import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    api.get('/courses').then((res) => setCourses(res.data.courses));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-sm text-gray-500">Browse all published courses</p>
        </div>
        <div className="text-sm text-gray-600">Hi, {user?.name} ({user?.role})</div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <div key={c._id} className="card">
            <div className="card-body">
              <h3 className="font-semibold text-lg mb-1">{c.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{c.description}</p>
              <div className="mt-3">
                <Link to={`/courses/${c._id}`} className="btn">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


