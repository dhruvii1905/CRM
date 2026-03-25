import { useEffect, useState } from 'react';
import api from '../api/axios';

const empty = { name: '', type: 'Other', status: 'pending', expiryDate: '', fileUrl: '', notes: '' };

const statusStyle = {
  pending: 'bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-300',
  submitted: 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black',
  approved: 'bg-black text-white dark:bg-white dark:text-black',
  rejected: 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400',
};

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { api.get('/documents').then(r => setDocs(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) { await api.put(`/documents/${editing}`, form); setEditing(null); }
    else await api.post('/documents', form);
    api.get('/documents').then(r => setDocs(r.data));
    setForm(empty); setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Documents</h1>
          <p className="text-sm text-gray-400 mt-1 font-light">{docs.length} total documents</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setForm(empty); setEditing(null); }}
          className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-semibold hover:opacity-80 transition text-sm">
          + Add Document
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6 mb-6 grid grid-cols-2 gap-4 shadow-sm">
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition col-span-2"
            placeholder="Document Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black transition"
            value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            {['ISO', 'MSME', 'GeM', 'Startup', 'Tender Doc', 'Legal', 'Other'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black transition"
            value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {['pending', 'submitted', 'approved', 'rejected'].map(s => <option key={s}>{s}</option>)}
          </select>
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            type="date" placeholder="Expiry Date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            placeholder="File URL (optional)" value={form.fileUrl} onChange={e => setForm({ ...form, fileUrl: e.target.value })} />
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition col-span-2"
            placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-gray-200 dark:border-zinc-600 text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition">Cancel</button>
            <button className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-80 transition">
              {editing ? 'Update' : 'Save'} Document
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-left">
            <tr>{['Name', 'Type', 'Status', 'Expiry', 'File', 'Actions'].map(h => (
              <th key={h} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {docs.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No documents yet.</td></tr>
            ) : docs.map(d => (
              <tr key={d._id} className="border-t border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                <td className="px-5 py-4 font-medium">{d.name}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{d.type}</td>
                <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[d.status]}`}>{d.status}</span></td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : '—'}</td>
                <td className="px-5 py-4">{d.fileUrl ? <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline">View</a> : '—'}</td>
                <td className="px-5 py-4 flex gap-3">
                  <button onClick={() => { setForm({ ...d, expiryDate: d.expiryDate?.slice(0, 10) || '' }); setEditing(d._id); setShowForm(true); }} className="text-sm font-medium hover:underline">Edit</button>
                  <button onClick={() => api.delete(`/documents/${d._id}`).then(() => setDocs(p => p.filter(x => x._id !== d._id)))} className="text-sm font-medium text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
