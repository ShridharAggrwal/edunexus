import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const load = () => api.get('/courses/all').then((r) => setCourses(r.data.courses));
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Instructor</h1>
        <Link to="/instructor/courses/new" className="btn">New Course</Link>
      </div>
      <div className="space-y-3">
        {courses.map((c) => (
          <div key={c._id} className="card">
            <div className="card-body flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-xs text-gray-500">{c.isPublished ? 'Published' : 'Draft'}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link className="btn-secondary" to={`/instructor/courses/${c._id}/edit`}>Edit</Link>
                <Link className="btn-secondary" to={`/instructor/courses/${c._id}/lectures`}>Lectures</Link>
                <Link className="btn-secondary" to={`/instructor/courses/${c._id}/assignments`}>Assignments</Link>
                <Link className="btn-secondary" to={`/instructor/courses/${c._id}/live`}>Live</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


