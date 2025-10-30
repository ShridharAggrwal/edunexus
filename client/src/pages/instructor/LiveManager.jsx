import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api';

function LiveManager() {
  const { id } = useParams();
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState('');
  const [startAt, setStartAt] = useState('');

  const load = () => api.get(`/live/${id}`).then((r) => setSessions(r.data.sessions));
  useEffect(() => { load(); }, [id]);

  const schedule = async () => {
    if (!title || !startAt) { alert('Fill all fields'); return; }
    const res = await api.post(`/live/${id}`, { title, startAt: new Date(startAt) });
    setTitle(''); setStartAt('');
    load();
    alert(`Scheduled. Link: ${res.data.session.meetUrl}`);
  };

  const cancel = async (sessionId) => {
    await api.delete(`/live/${sessionId}`);
    load();
    alert('Cancelled');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Live Sessions</h1>
      <div className="card">
        <div className="card-body grid sm:grid-cols-3 gap-3">
          <div>
            <label className="label">Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="label">Start At</label>
            <input className="input" type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
          </div>
          
          <div className="sm:col-span-3">
            <button className="btn" onClick={schedule}>Schedule</button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sessions.map((s) => (
          <div key={s._id} className="card">
            <div className="card-body flex items-center justify-between">
              <div>
                <div className="font-semibold">{s.title}</div>
                <div className="text-xs text-gray-500">{new Date(s.startAt).toLocaleString()}</div>
                <a className="text-xs text-indigo-600" href={s.meetUrl} target="_blank" rel="noreferrer">Open Link</a>
              </div>
              <button className="btn-secondary" onClick={() => cancel(s._id)}>Cancel</button>
            </div>
          </div>
        ))}
        {sessions.length === 0 && <div className="text-sm text-gray-500">No scheduled sessions.</div>}
      </div>
    </div>
  );
}

export default LiveManager;


