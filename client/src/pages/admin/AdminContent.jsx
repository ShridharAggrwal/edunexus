import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function AdminContent() {
  const [lectures, setLectures] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [messages, setMessages] = useState([]);

  const load = async () => {
    const [l, a, s, m] = await Promise.all([
      api.get('/admin/lectures'),
      api.get('/admin/assignments'),
      api.get('/admin/submissions'),
      api.get('/admin/messages'),
    ]);
    setLectures(l.data.lectures);
    setAssignments(a.data.assignments);
    setSubmissions(s.data.submissions);
    setMessages(m.data.messages);
  };
  useEffect(() => { load(); }, []);

  const del = async (type, id) => {
    const map = {
      lecture: () => api.delete(`/admin/lectures/${id}`),
      assignment: () => api.delete(`/admin/assignments/${id}`),
      submission: () => api.delete(`/admin/submissions/${id}`),
      message: () => api.delete(`/admin/messages/${id}`),
    };
    await map[type]();
    load();
  };

  return (
    <div className="space-y-8">
      <Section title="Lectures" items={lectures} render={(x) => (
        <>
          <div className="font-semibold">{x.title}</div>
          <div className="text-xs text-gray-500">{x.course?.title}</div>
        </>
      )} onDelete={(id) => del('lecture', id)} />

      <Section title="Assignments" items={assignments} render={(x) => (
        <>
          <div className="font-semibold">{x.title}</div>
          <div className="text-xs text-gray-500">{x.course?.title}</div>
        </>
      )} onDelete={(id) => del('assignment', id)} />

      <Section title="Submissions" items={submissions} render={(x) => (
        <>
          <div className="font-semibold">{x.student?.name}</div>
          <a className="text-xs text-indigo-600" href={x.fileUrl} target="_blank" rel="noreferrer">Open</a>
        </>
      )} onDelete={(id) => del('submission', id)} />

      <Section title="Messages" items={messages} render={(x) => (
        <>
          <div className="font-semibold">{x.sender?.name}</div>
          <div className="text-xs text-gray-500">{x.course?.title}</div>
          <div className="text-sm">{x.content}</div>
        </>
      )} onDelete={(id) => del('message', id)} />
    </div>
  );
}

function Section({ title, items, render, onDelete }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it._id} className="card">
            <div className="card-body flex items-center justify-between">
              <div className="space-y-1">
                {render(it)}
              </div>
              <button className="btn-secondary" onClick={() => onDelete(it._id)}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-gray-500">No items.</div>}
      </div>
    </div>
  );
}


