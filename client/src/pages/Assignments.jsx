import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { uploadToCloudinary } from '../lib/upload';

function isPastDue(dueAt) {
  if (!dueAt) return false;
  return new Date() > new Date(dueAt);
}

export default function Assignments() {
  const { courseId } = useParams();
  const [items, setItems] = useState([]);
  const { user } = useAuth();
  // Track form input per assignment
  const [submissionState, setSubmissionState] = useState({}); // { [assignmentId]: fileUrl }
  const [uploading, setUploading] = useState({}); // { [assignmentId]: boolean }
  const [mySubmissions, setMySubmissions] = useState({}); // { [assignmentId]: data }
  const [loadingSubs, setLoadingSubs] = useState(false);

  useEffect(() => {
    api.get(`/assignments/${courseId}`).then((res) => setItems(res.data.assignments));
  }, [courseId]);

  useEffect(() => {
    if (user?.role !== 'student' || items.length === 0) return;
    setLoadingSubs(true);
    Promise.all(
      items.map(a =>
        api.get(`/assignments/${a._id}`).then(() =>
          api.get(`/assignments/submit/${a._id}`)
            .then(r => [a._id, r.data.submission])
            .catch(() => [a._id, null])
        )
      )
    ).then(results => {
      const map = {};
      for (const [aId, sub] of results) map[aId] = sub;
      setMySubmissions(map);
      setLoadingSubs(false);
    });
  }, [items, user]);

  const submit = async (assignmentId) => {
    const fileUrl = submissionState[assignmentId];
    if (!fileUrl || !fileUrl.trim()) {
      alert('Please provide a file or public URL before submitting.');
      return;
    }
    await api.post(`/assignments/submit/${assignmentId}`, { fileUrl });
    alert('Submitted');
    setSubmissionState((old) => ({ ...old, [assignmentId]: '' }));
    api.get(`/assignments/submit/${assignmentId}`)
      .then(r => setMySubmissions((old) => ({ ...old, [assignmentId]: r.data.submission })))
      .catch(() => {});
  };

  const onFile = async (assignmentId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading((old) => ({ ...old, [assignmentId]: true }));
    try {
      const url = await uploadToCloudinary(file, { folder: 'edunexus/submissions', resourceType: 'auto' });
      setSubmissionState((old) => ({ ...old, [assignmentId]: url }));
      alert('Uploaded');
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading((old) => ({ ...old, [assignmentId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-sm text-gray-500">Submit your work for this course</p>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((a) => {
          const hasDue = !!a.dueAt;
          const duePassed = isPastDue(a.dueAt);
          const mySub = mySubmissions[a._id];
          const isChecked = mySub && mySub.grade !== undefined && mySub.feedback !== undefined;
          const isGraded = mySub && mySub.grade !== undefined;
          const hasFeedback = mySub && mySub.feedback !== undefined;

          let studentBlock = null;

          if (user?.role === 'student') {
            if (!mySub && duePassed) {
              // Never submitted, missed due date
              studentBlock = <div className="text-xs text-red-700 mt-1">Failed to submit. Submissions are closed.</div>;
            } else if (mySub && isChecked) {
              // Submitted, checked (graded/feedback): show only details
              studentBlock = (
                <div className="mt-2 text-xs text-green-700">
                  Already submitted: <a className="text-xs text-indigo-600" href={mySub.fileUrl} target="_blank" rel="noreferrer">View File</a>
                  {isGraded && <><span className="ml-1">|</span> Grade: <span className="font-semibold">{mySub.grade}</span></>}
                  {hasFeedback && <><span className="ml-1">|</span> Feedback: <span>{mySub.feedback}</span></>}
                </div>
              );
            } else if (mySub && !isChecked) {
              // Submitted, not checked yet
              studentBlock = (
                <>
                  <div className="mt-2 text-xs text-green-700">
                    Already submitted: <a className="text-xs text-indigo-600" href={mySub.fileUrl} target="_blank" rel="noreferrer">View File</a>
                  </div>
                  {!duePassed && (
                    <div className="my-2">
                      <input
                        className="input my-2"
                        value={submissionState[a._id] || ''}
                        onChange={e => setSubmissionState((old) => ({ ...old, [a._id]: e.target.value }))}
                        placeholder="Paste a public URL or upload a file"
                        disabled={duePassed}
                      />
                      <input
                        type="file"
                        onChange={e => onFile(a._id, e)}
                        className="mb-2"
                        disabled={duePassed}
                      />
                      {uploading[a._id] && <div className="text-xs text-gray-500 mt-1">Uploading...</div>}
                      {submissionState[a._id] && (
                        <a className="btn-secondary mt-2 inline-block" href={submissionState[a._id]} target="_blank" rel="noreferrer">View Selected File</a>
                      )}
                      <button
                        className="btn ml-2"
                        onClick={() => submit(a._id)}
                        disabled={duePassed}
                      >Update Submission</button>
                    </div>
                  )}
                </>
              );
            } else if (!mySub && !duePassed) {
              // Not submitted, due active: allow submit
              studentBlock = (
                <div className="my-2">
                  <input
                    className="input my-2"
                    value={submissionState[a._id] || ''}
                    onChange={e => setSubmissionState((old) => ({ ...old, [a._id]: e.target.value }))}
                    placeholder="Paste a public URL or upload a file"
                    disabled={duePassed}
                  />
                  <input
                    type="file"
                    onChange={e => onFile(a._id, e)}
                    className="mb-2"
                    disabled={duePassed}
                  />
                  {uploading[a._id] && <div className="text-xs text-gray-500 mt-1">Uploading...</div>}
                  {submissionState[a._id] && (
                    <a className="btn-secondary mt-2 inline-block" href={submissionState[a._id]} target="_blank" rel="noreferrer">View Selected File</a>
                  )}
                  <button
                    className="btn ml-2"
                    onClick={() => submit(a._id)}
                    disabled={duePassed}
                  >Submit</button>
                </div>
              );
            }
          }

          return (
            <div key={a._id} className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-xs text-gray-500">{a.dueAt ? `Due ${new Date(a.dueAt).toLocaleString()}` : 'No due date'}</div>
                    {a.attachmentUrl && (
                      <a className="text-xs text-indigo-600 hover:underline" href={a.attachmentUrl} target="_blank" rel="noreferrer">View Assignment Attachment</a>
                    )}
                    {user?.role === 'student' && (
                      <>
                        {studentBlock}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <div className="text-sm text-gray-500">No assignments for this course.</div>}
      </div>
    </div>
  );
}
