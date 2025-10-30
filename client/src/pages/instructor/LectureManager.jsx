import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { uploadToCloudinary } from '../../lib/upload';

export default function LectureManager() {
  const { id } = useParams();
  const [lectures, setLectures] = useState([]);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = () => api.get(`/lectures/${id}`).then((r) => setLectures(r.data.lectures));
  useEffect(() => { load(); }, [id]);

  const add = async () => {
    await api.post(`/lectures/${id}`, { title, videoUrl, order: 0 });
    setTitle(''); setVideoUrl('');
    load();
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, { folder: 'edunexus/lectures', resourceType: 'video' });
      setVideoUrl(url);
      alert('Uploaded');
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (lectureId) => {
    await api.delete(`/lectures/${lectureId}`);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Lectures</h1>

      <div className="card">
        <div className="card-body grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="label">Video</label>
            <input className="input mb-2" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
            <input type="file" accept="video/*" onChange={onFile} />
            {uploading && <div className="text-xs text-gray-500 mt-1">Uploading...</div>}
            {videoUrl && (
              <a className="btn-secondary mt-2 inline-block" href={videoUrl} target="_blank" rel="noreferrer">View Video</a>
            )}
          </div>
          <div className="sm:col-span-2">
            <button className="btn" onClick={add}>Add Lecture</button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {lectures.map((l) => (
          <div key={l._id} className="card">
            <div className="card-body flex items-center justify-between">
              <div>
                <div className="font-semibold">{l.title}</div>
                <a className="text-xs text-indigo-600 hover:underline" href={l.videoUrl} target="_blank" rel="noreferrer">View Video</a>
              </div>
              <button className="btn-secondary" onClick={() => remove(l._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


