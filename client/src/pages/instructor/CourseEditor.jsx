import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';

export default function CourseEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    api.get(`/courses/${id}`).then((r) => {
      setTitle(r.data.course.title || '');
      setDescription(r.data.course.description || '');
      setTags((r.data.course.tags || []).join(','));
    });
  }, [id, isNew]);

  const save = async () => {
    setError('');
    try {
      if (isNew) {
        const r = await api.post('/courses', { title, description, tags: tags.split(',').map((t) => t.trim()).filter(Boolean) });
        navigate(`/instructor/courses/${r.data.course._id}/edit`);
      } else {
        await api.put(`/courses/${id}`, { title, description, tags: tags.split(',').map((t) => t.trim()).filter(Boolean) });
      }
      alert('Saved');
    } catch (e) {
      setError(e?.response?.data?.message || 'Save failed');
    }
  };

  const publish = async () => {
    await api.post(`/courses/${id}/publish`);
    alert('Published');
  };

  const del = async () => {
    if (!confirm('Delete this course?')) return;
    await api.delete(`/courses/${id}`);
    navigate('/instructor');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isNew ? 'New Course' : 'Edit Course'}</h1>
        {!isNew && (
          <div className="flex items-center gap-2">
            <button className="btn" onClick={publish}>Publish</button>
            <button className="btn-secondary" onClick={del}>Delete</button>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-body space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="label">Tags (comma separated)</label>
            <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button className="btn" onClick={save}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}


