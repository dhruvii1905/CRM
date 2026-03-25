import { useEffect, useState } from 'react';
import api from '../api/axios';

const empty = { service: '', amount: '', paidAmount: '', status: 'pending', dueDate: '', notes: '' };

const statusStyle = {
  pending: 'bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-300',
  partial: 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black',
  paid: 'bg-black text-white dark:bg-white dark:text-black',
  overdue: 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400',
};

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('/invoices').then(r => setInvoices(r.data));
    api.get('/customers').then(r => setCustomers(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) { await api.put(`/invoices/${editing}`, form); setEditing(null); }
    else await api.post('/invoices', form);
    api.get('/invoices').then(r => setInvoices(r.data));
    setForm(empty); setShowForm(false);
  };

  const totalAmount = invoices.reduce((s, i) => s + (i.amount || 0), 0);
  const totalPaid = invoices.reduce((s, i) => s + (i.paidAmount || 0), 0);
  const totalPending = totalAmount - totalPaid;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Invoices</h1>
          <p className="text-sm text-gray-400 mt-1 font-light">
            Total: ₹{totalAmount.toLocaleString()} · Paid: ₹{totalPaid.toLocaleString()} · <span className="text-red-400">Pending: ₹{totalPending.toLocaleString()}</span>
          </p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setForm(empty); setEditing(null); }}
          className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-semibold hover:opacity-80 transition text-sm">
          + Add Invoice
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6 mb-6 grid grid-cols-2 gap-4 shadow-sm">
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black transition col-span-2"
            value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} required>
            <option value="">Select Client</option>
            {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition col-span-2"
            placeholder="Service Description" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} />
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            placeholder="Total Amount (₹)" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            placeholder="Paid Amount (₹)" type="number" value={form.paidAmount} onChange={e => setForm({ ...form, paidAmount: e.target.value })} />
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black transition"
            value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {['pending', 'partial', 'paid', 'overdue'].map(s => <option key={s}>{s}</option>)}
          </select>
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-gray-200 dark:border-zinc-600 text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition">Cancel</button>
            <button className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-80 transition">
              {editing ? 'Update' : 'Save'} Invoice
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-left">
            <tr>{['Invoice No', 'Client', 'Service', 'Amount', 'Paid', 'Due Date', 'Status', 'Actions'].map(h => (
              <th key={h} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-400">No invoices yet.</td></tr>
            ) : invoices.map(i => (
              <tr key={i._id} className={`border-t border-gray-100 dark:border-zinc-700 transition ${i.status === 'overdue' ? 'bg-red-50 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-zinc-700'}`}>
                <td className="px-5 py-4 font-medium">{i.invoiceNo}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{i.client?.name || '—'}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{i.service || '—'}</td>
                <td className="px-5 py-4 font-medium">₹{Number(i.amount).toLocaleString()}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">₹{Number(i.paidAmount).toLocaleString()}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{i.dueDate ? new Date(i.dueDate).toLocaleDateString() : '—'}</td>
                <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[i.status]}`}>{i.status}</span></td>
                <td className="px-5 py-4 flex gap-3">
                  <button onClick={() => { setForm({ ...i, client: i.client?._id || '', dueDate: i.dueDate?.slice(0, 10) || '', invoiceNo: undefined }); setEditing(i._id); setShowForm(true); }} className="text-sm font-medium hover:underline">Edit</button>
                  <button onClick={() => api.delete(`/invoices/${i._id}`).then(() => setInvoices(p => p.filter(x => x._id !== i._id)))} className="text-sm font-medium text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
