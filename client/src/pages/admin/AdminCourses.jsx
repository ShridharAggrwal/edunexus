import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const load = () => api.get('/admin/courses').then((r) => setCourses(r.data.courses));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this course?')) return;
    await api.delete(`/courses/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Courses</h1>
      </div>
      <div className="space-y-3">
        {courses.map((c) => (
          <div key={c._id} className="card">
            <div className="card-body flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-xs text-gray-500">{c.isPublished ? 'Published' : 'Draft'} • {c.instructor?.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link className="btn-secondary" to={`/instructor/courses/${c._id}/edit`}>Edit</Link>
                <button className="btn-secondary" onClick={() => remove(c._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && <div className="text-sm text-gray-500">No courses.</div>}
      </div>
    </div>
  );
}


