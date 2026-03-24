import { useEffect, useState } from 'react';
import api from '../api/axios';
import socket from '../api/socket';

const empty = { name: '', email: '', phone: '', source: 'other', status: 'new', notes: '' };

const statusStyle = {
  new: 'bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-300',
  contacted: 'bg-black text-white dark:bg-white dark:text-black',
  qualified: 'bg-gray-800 text-white dark:bg-gray-200 dark:text-black',
  lost: 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400',
};

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('/leads').then(r => setLeads(r.data));
    socket.connect();
    socket.on('lead:new', l => setLeads(p => [l, ...p]));
    socket.on('lead:updated', l => setLeads(p => p.map(x => x._id === l._id ? l : x)));
    socket.on('lead:deleted', id => setLeads(p => p.filter(x => x._id !== id)));
    return () => socket.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) { await api.put(`/leads/${editing}`, form); setEditing(null); }
    else await api.post('/leads', form);
    setForm(empty); setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Leads</h1>
          <p className="text-sm text-gray-400 mt-1 font-light">{leads.length} total leads</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setForm(empty); setEditing(null); }}
          className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-semibold hover:opacity-80 transition text-sm">
          + Add Lead
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6 mb-6 grid grid-cols-2 gap-4 shadow-sm">
          {['name', 'email', 'phone'].map(f => (
            <input key={f} className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
              placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
              value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
              required={f === 'name'} />
          ))}
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black dark:focus:border-white transition"
            value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
            {['web', 'referral', 'social', 'other'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black dark:focus:border-white transition"
            value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {['new', 'contacted', 'qualified', 'lost'].map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-gray-200 dark:border-zinc-600 text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition">Cancel</button>
            <button className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-80 transition">
              {editing ? 'Update' : 'Save'} Lead
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-left">
            <tr>{['Name', 'Email', 'Phone', 'Source', 'Status', 'Actions'].map(h => (
              <th key={h} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No leads yet. Add your first one!</td></tr>
            ) : leads.map(l => (
              <tr key={l._id} className="border-t border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                <td className="px-5 py-4 font-medium">{l.name}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{l.email || '—'}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{l.phone || '—'}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400 capitalize">{l.source}</td>
                <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[l.status]}`}>{l.status}</span></td>
                <td className="px-5 py-4 flex gap-3">
                  <button onClick={() => { setForm(l); setEditing(l._id); setShowForm(true); }} className="text-sm font-medium hover:underline">Edit</button>
                  <button onClick={() => api.delete(`/leads/${l._id}`)} className="text-sm font-medium text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
