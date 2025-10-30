import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [live, setLive] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => setCourse(res.data.course));
    api.get(`/lectures/${id}`).then((res) => setLectures(res.data.lectures));
    api.get(`/live/${id}`).then((res) => setLive(res.data.sessions));
    if (user?.role === 'student') {
      api.get('/enrollments/me').then((r) => {
        const enrolled = (r.data.enrollments || []).some((e) => e.course?._id === id || e.course === id);
        setIsEnrolled(enrolled);
      }).catch(() => setIsEnrolled(false));
    } else {
      setIsEnrolled(true); // instructors/admins can view
    }
  }, [id, user]);

  const enroll = async () => {
    await api.post(`/enrollments/${id}`);
    setIsEnrolled(true);
    alert('Enrolled');
  };

  return (
    <div className="space-y-6">
      {course && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-sm text-gray-600">By {course?.instructor?.name}</p>
            </div>
            {user?.role === 'student' && !isEnrolled && (
              <button className="btn" onClick={enroll}>Enroll</button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="card"><div className="card-body"><p className="text-gray-700">{course.description}</p></div></div>
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Upcoming Live Lectures</h3>
                  </div>
                  <ul className="space-y-2">
                    {live.map((s) => (
                      <li key={s._id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{s.title}</div>
                          <div className="text-xs text-gray-500">{new Date(s.startAt).toLocaleString()}</div>
                        </div>
                        {(isEnrolled || user?.role !== 'student') ? (
                          <a className="btn-secondary text-sm" href={s.meetUrl} target="_blank" rel="noreferrer">Join</a>
                        ) : (
                          <span className="text-xs text-gray-400">Enroll to join</span>
                        )}
                      </li>
                    ))}
                    {live.length === 0 && <li className="text-sm text-gray-500">No upcoming live lectures.</li>}
                  </ul>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Lectures</h3>
                  </div>
                  <ul className="space-y-2">
                    {lectures.map((l) => (
                      <li key={l._id} className="flex items-center justify-between">
                        <span>{l.title}</span>
                        {l.videoUrl && (
                          (isEnrolled || user?.role !== 'student') ? (
                            <a className="btn-secondary text-sm" href={l.videoUrl} target="_blank" rel="noreferrer">Watch</a>
                          ) : (
                            <span className="text-xs text-gray-400">Enroll to watch</span>
                          )
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {user?.role === 'student' ? (
                <>
                  {isEnrolled ? (
                    <Link className="btn w-full" to={`/assignments/${id}`}>View Assignments</Link>
                  ) : (
                    <button className="btn w-full" onClick={enroll}>Enroll to view assignments</button>
                  )}
                </>
              ) : (
                <>
                  <Link className="btn w-full" to={`/instructor/courses/${id}/assignments`}>Manage Assignments</Link>
                  <Link className="btn-secondary w-full inline-flex justify-center" to={`/instructor/courses/${id}/submissions`}>View Submissions</Link>
                </>
              )}
              <Link className="btn-secondary w-full inline-flex justify-center" to={`/chat/${id}`}>Open Chat</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


