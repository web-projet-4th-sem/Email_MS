import { useState, useEffect } from 'react';
import { User, Users, Calendar, FileText, X } from 'lucide-react';
import axios from 'axios';

export default function EditProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState({
    ...project,
    supervisor: project.supervisor._id,
    students: project.students.map(s => s._id),
  });
  const [lecturers, setLecturers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const [lecturersRes, studentsRes] = await Promise.all([
        axios.get('/users/by-role/lecturer'),
        axios.get('/users/by-role/student')
      ]);
      setLecturers(lecturersRes.data);
      setStudents(studentsRes.data);
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStudentSelection = (studentId) => {
    setForm((prev) => ({
      ...prev,
      students: prev.students.includes(studentId)
        ? prev.students.filter(id => id !== studentId)
        : [...prev.students, studentId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button type="button" onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold mb-4">Edit Project</h2>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            <FileText className="w-4 h-4 inline mr-2" />
            Project Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            <Calendar className="w-4 h-4 inline mr-2" />
            Deadline
          </label>
          <input
            name="deadline"
            type="date"
            value={form.deadline.slice(0, 10)}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            <User className="w-4 h-4 inline mr-2" />
            Supervisor
          </label>
          <select
            name="supervisor"
            value={form.supervisor}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select supervisor</option>
            {lecturers.map((lect) => (
              <option key={lect._id} value={lect._id}>
                {lect.name} ({lect.email})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            <Users className="w-4 h-4 inline mr-2" />
            Assign Students
          </label>
          <div className="border rounded p-2 max-h-32 overflow-y-auto">
            {students.map((stu) => (
              <label key={stu._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.students.includes(stu._id)}
                  onChange={() => handleStudentSelection(stu._id)}
                />
                <span>{stu.name} ({stu.email})</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 