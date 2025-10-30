import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => api.get('/admin/users').then((res) => setUsers(res.data.users)).finally(() => setLoading(false));
  useEffect(() => { refresh(); }, []);

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      alert('Role updated');
      refresh();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update role');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      alert('User deleted');
      refresh();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Users</h2>
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t border-gray-100 text-sm">
                      <td className="py-2">{u.name}</td>
                      <td className="py-2">{u.email}</td>
                      <td className="py-2 capitalize">{u.role}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <select className="input" value={u.role} onChange={(e) => changeRole(u._id, e.target.value)}>
                            <option value="student">student</option>
                            <option value="instructor">instructor</option>
                            <option value="admin">admin</option>
                          </select>
                          <button className="btn-secondary" onClick={() => remove(u._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


