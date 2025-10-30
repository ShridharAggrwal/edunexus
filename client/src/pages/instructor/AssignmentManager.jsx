import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { uploadToCloudinary } from '../../lib/upload';

export default function AssignmentManager() {
  const { id } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = () => api.get(`/assignments/${id}`).then((r) => setAssignments(r.data.assignments));
  useEffect(() => { load(); }, [id]);

  const add = async () => {
    await api.post(`/assignments/${id}`, { title, description, dueAt: dueAt ? new Date(dueAt) : undefined, attachmentUrl });
    setTitle(''); setDescription(''); setDueAt(''); setAttachmentUrl('');
    load();
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, { folder: 'edunexus/assignments', resourceType: 'auto' });
      setAttachmentUrl(url);
      alert('Uploaded');
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assignments</h1>

      <div className="card">
        <div className="card-body grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="label">Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea className="input" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="label">Due At</label>
            <input className="input" type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
          </div>
          <div>
            <label className="label">Attachment</label>
            <input className="input mb-2" value={attachmentUrl} onChange={(e) => setAttachmentUrl(e.target.value)} placeholder="https://..." />
            <input type="file" onChange={onFile} />
            {uploading && <div className="text-xs text-gray-500 mt-1">Uploading...</div>}
            {attachmentUrl && (
              <a className="btn-secondary mt-2 inline-block" href={attachmentUrl} target="_blank" rel="noreferrer">View Attachment</a>
            )}
          </div>
          <div className="sm:col-span-2">
            <button className="btn" onClick={add}>Add Assignment</button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {assignments.map((a) => (
          <div key={a._id} className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-xs text-gray-500">{a.dueAt ? `Due ${new Date(a.dueAt).toLocaleString()}` : 'No due date'}</div>
                  {a.attachmentUrl && (
                    <a className="text-xs text-indigo-600 hover:underline" href={a.attachmentUrl} target="_blank" rel="noreferrer">View Attachment</a>
                  )}
                </div>
                <a className="btn-secondary" href={`/instructor/assignments/${a._id}/submissions`}>View Submissions</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


