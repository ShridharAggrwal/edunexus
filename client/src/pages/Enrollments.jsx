import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    api.get('/enrollments/me').then((res) => setEnrollments(res.data.enrollments));
  }, []);

  const visible = enrollments.filter((e) => e.course);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Enrollments</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((e) => (
          <div key={e._id} className="card">
            <div className="card-body">
              <div className="font-semibold">{e.course?.title}</div>
              <div className="text-xs text-gray-500">Enrolled on {new Date(e.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
        {visible.length === 0 && <div className="text-sm text-gray-500">No enrollments to show.</div>}
      </div>
    </div>
  );
}


