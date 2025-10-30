import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api';

export default function InstructorCourseSubmissions() {
  const { id } = useParams(); // course id
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const aRes = await api.get(`/assignments/${id}`);
      const assignments = aRes.data.assignments || [];
      const all = [];
      for (const a of assignments) {
        const sRes = await api.get(`/assignments/submissions/${a._id}`);
        const subs = sRes.data.submissions || [];
        for (const s of subs) {
          all.push({
            assignmentId: a._id,
            assignmentTitle: a.title,
            submissionId: s._id,
            studentName: s.student?.name,
            studentEmail: s.student?.email,
            fileUrl: s.fileUrl,
            grade: s.grade,
            feedback: s.feedback,
            submittedAt: s.createdAt,
          });
        }
      }
      setRows(all);
      setLoading(false);
    }
    load();
  }, [id]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Course Submissions</h1>
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <div className="card">
          <div className="card-body overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">Assignment</th>
                  <th className="py-2">Student</th>
                  <th className="py-2">File</th>
                  <th className="py-2">Grade</th>
                  <th className="py-2">Feedback</th>
                  <th className="py-2">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.submissionId} className="border-t border-gray-100">
                    <td className="py-2">{r.assignmentTitle}</td>
                    <td className="py-2">{r.studentName}<div className="text-xs text-gray-500">{r.studentEmail}</div></td>
                    <td className="py-2">
                      <a className="text-indigo-600" href={r.fileUrl} target="_blank" rel="noreferrer">Open</a>
                    </td>
                    <td className="py-2">{r.grade ?? '-'}</td>
                    <td className="py-2">{r.feedback ?? '-'}</td>
                    <td className="py-2">{new Date(r.submittedAt).toLocaleString()}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td className="py-4 text-gray-500" colSpan={6}>No submissions for this course.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


