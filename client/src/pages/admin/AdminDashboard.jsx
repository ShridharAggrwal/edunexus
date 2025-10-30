import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get('/admin/stats').then((res) => setData(res.data));
  }, []);

  if (!data) return null;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Users" value={data.users} />
        <StatCard label="Courses" value={data.courses} />
        <StatCard label="Assignments" value={data.assignments} />
        <StatCard label="Submissions" value={data.submissions} />
      </div>
      <div className="flex items-center gap-3">
        <Link to="/admin/users" className="btn">Manage Users</Link>
        <Link to="/admin/courses" className="btn-secondary">Manage Courses</Link>
        <Link to="/admin/content" className="btn-secondary">View Content</Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card"><div className="card-body"><div className="text-sm text-gray-500">{label}</div><div className="text-2xl font-semibold">{value}</div></div></div>
  );
}


