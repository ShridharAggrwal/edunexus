import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function CourseChat() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const load = () => api.get(`/chat/${courseId}`).then((r) => setMessages(r.data.messages));
  useEffect(() => { load(); }, [courseId]);

  const send = async () => {
    if (!input.trim()) return;
    await api.post(`/chat/${courseId}`, { content: input.trim() });
    setInput('');
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Course Chat</h1>
      <div className="card">
        <div className="card-body space-y-3 max-h-[60vh] overflow-auto">
          {messages.map((m) => (
            <div key={m._id} className="flex items-start gap-2">
              <div className="rounded-full bg-indigo-100 text-indigo-700 w-8 h-8 flex items-center justify-center text-xs font-semibold">
                {m.sender?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold">
                  {m.sender?.name} <span className="text-gray-400 font-normal">({m.sender?.role})</span>
                </div>
                <div className="text-sm">{m.content}</div>
                <div className="text-[10px] text-gray-400">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
          {messages.length === 0 && <div className="text-sm text-gray-500">No messages yet.</div>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input className="input flex-1" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
        <button className="btn" onClick={send}>Send</button>
      </div>
    </div>
  );
}


