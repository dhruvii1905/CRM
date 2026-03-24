import { useEffect, useState } from 'react';
import api from '../api/axios';
import socket from '../api/socket';

const empty = { title: '', description: '', dueDate: '', status: 'pending', priority: 'medium' };

const priorityStyle = {
  low: 'bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400',
  medium: 'bg-gray-800 text-white dark:bg-gray-200 dark:text-black',
  high: 'bg-black text-white dark:bg-white dark:text-black',
};

const statusStyle = {
  pending: 'bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400',
  'in-progress': 'bg-gray-800 text-white dark:bg-gray-200 dark:text-black',
  done: 'bg-black text-white dark:bg-white dark:text-black',
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('/tasks').then(r => setTasks(r.data));
    socket.connect();
    socket.on('task:new', t => setTasks(p => [t, ...p]));
    socket.on('task:updated', t => setTasks(p => p.map(x => x._id === t._id ? t : x)));
    socket.on('task:deleted', id => setTasks(p => p.filter(x => x._id !== id)));
    return () => socket.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) { await api.put(`/tasks/${editing}`, form); setEditing(null); }
    else await api.post('/tasks', form);
    setForm(empty); setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Tasks</h1>
          <p className="text-sm text-gray-400 mt-1 font-light">{tasks.length} total tasks</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setForm(empty); setEditing(null); }}
          className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-semibold hover:opacity-80 transition text-sm">
          + Add Task
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6 mb-6 grid grid-cols-2 gap-4 shadow-sm">
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition col-span-2"
            placeholder="Task title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition col-span-2"
            placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black dark:focus:border-white transition"
            value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            {['low', 'medium', 'high'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black dark:focus:border-white transition"
            value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {['pending', 'in-progress', 'done'].map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-gray-200 dark:border-zinc-600 text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition">Cancel</button>
            <button className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-80 transition">
              {editing ? 'Update' : 'Save'} Task
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-left">
            <tr>{['Title', 'Description', 'Due Date', 'Priority', 'Status', 'Actions'].map(h => (
              <th key={h} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No tasks yet. Add your first one!</td></tr>
            ) : tasks.map(t => (
              <tr key={t._id} className="border-t border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                <td className="px-5 py-4 font-medium">{t.title}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{t.description || '—'}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
                <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityStyle[t.priority]}`}>{t.priority}</span></td>
                <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[t.status]}`}>{t.status}</span></td>
                <td className="px-5 py-4 flex gap-3">
                  <button onClick={() => { setForm({ ...t, dueDate: t.dueDate?.slice(0, 10) || '' }); setEditing(t._id); setShowForm(true); }} className="text-sm font-medium hover:underline">Edit</button>
                  <button onClick={() => api.delete(`/tasks/${t._id}`)} className="text-sm font-medium text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
