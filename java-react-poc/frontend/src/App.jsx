import { useEffect, useMemo, useState } from 'react';
import { Users, Search, Plus, Pencil, Trash2, X, BriefcaseBusiness, Building2, UserRound, RefreshCw } from 'lucide-react';

const API = 'http://localhost:8080/api/employees';
const emptyForm = { name: '', email: '', department: 'Engineering', role: '' };

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
}

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadEmployees() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error('Could not load employees. Is the Java backend running?');
      setEmployees(await response.json());
    } catch (e) {
      setError(e.message || 'Unable to connect to the API.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEmployees(); }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return employees;
    return employees.filter(employee =>
      [employee.name, employee.email, employee.department, employee.role]
        .some(value => (value || '').toLowerCase().includes(needle))
    );
  }, [employees, query]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(employee) {
    setEditing(employee);
    setForm({ name: employee.name, email: employee.email, department: employee.department, role: employee.role });
    setModalOpen(true);
  }

  async function saveEmployee(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch(editing ? `${API}/${editing.id}` : API, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || 'Save failed. Check the form and backend.');
      }
      setModalOpen(false);
      await loadEmployees();
    } catch (e) {
      setError(e.message || 'Could not save employee.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteEmployee(employee) {
    if (!window.confirm(`Delete ${employee.name}?`)) return;
    try {
      const response = await fetch(`${API}/${employee.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed.');
      setEmployees(current => current.filter(item => item.id !== employee.id));
      setError('');
    } catch (e) {
      setError(e.message || 'Could not delete employee.');
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark"><Users size={21} /></div>
        <div className="brand-copy"><strong>PeopleDesk</strong><span>WORKSPACE</span></div>
        <div className="side-label">WORKSPACE</div>
        <div className="nav-item active"><Users size={18} /> Employees <span className="nav-count">{employees.length}</span></div>
        <div className="side-bottom">
          <div className="profile-avatar">PD</div>
          <div><strong>POC Admin</strong><span>Administrator</span></div>
          <span className="online-dot" />
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Employees</strong></div>
          <div className="topbar-right"><span className="status-dot" /> API workspace <div className="mini-avatar">A</div></div>
        </header>

        <section className="page">
          <div className="page-heading">
            <div>
              <div className="eyebrow">PEOPLE OPERATIONS</div>
              <h1>Employees <span className="total-pill">{employees.length}</span></h1>
              <p>Manage your people, roles, and teams in one place.</p>
            </div>
            <button className="primary-btn" onClick={openCreate}><Plus size={18} /> Add employee</button>
          </div>

          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon purple"><Users size={19} /></div><div><span>Total employees</span><strong>{employees.length}</strong><small>People in your workspace</small></div></div>
            <div className="stat-card"><div className="stat-icon blue"><Building2 size={19} /></div><div><span>Departments</span><strong>{new Set(employees.map(e => e.department)).size}</strong><small>Teams represented</small></div></div>
            <div className="stat-card"><div className="stat-icon green"><BriefcaseBusiness size={19} /></div><div><span>Roles</span><strong>{new Set(employees.map(e => e.role)).size}</strong><small>Unique job titles</small></div></div>
          </div>

          <section className="table-card">
            <div className="table-header">
              <div><h2>All employees</h2><p>A directory of everyone in your organization.</p></div>
              <div className="table-actions">
                <label className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search employees..." /></label>
                <button className="icon-btn" onClick={loadEmployees} title="Refresh list"><RefreshCw size={17} /></button>
              </div>
            </div>
            {error && <div className="alert"><span>{error}</span><button onClick={() => setError('')}><X size={15}/></button></div>}
            <div className="table-scroll">
              <table>
                <thead><tr><th>EMPLOYEE</th><th>DEPARTMENT</th><th>ROLE</th><th>STATUS</th><th className="actions-col">ACTIONS</th></tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan="5" className="empty-state">Loading employees…</td></tr> :
                    filtered.length === 0 ? <tr><td colSpan="5" className="empty-state"><div className="empty-icon"><UserRound size={22}/></div><strong>No employees found</strong><span>Try another search or add a new employee.</span></td></tr> :
                    filtered.map(employee => <tr key={employee.id}>
                      <td><div className="employee-cell"><div className={`avatar avatar-${employee.id % 5}`}>{initials(employee.name)}</div><div><strong>{employee.name}</strong><span>{employee.email}</span></div></div></td>
                      <td><span className="department-tag">{employee.department}</span></td>
                      <td className="role-cell">{employee.role}</td>
                      <td><span className="status-badge"><i /> Active</span></td>
                      <td><div className="row-actions"><button className="row-icon" title="Edit employee" onClick={() => openEdit(employee)}><Pencil size={16}/></button><button className="row-icon danger" title="Delete employee" onClick={() => deleteEmployee(employee)}><Trash2 size={16}/></button></div></td>
                    </tr>)
                  }
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>Showing <strong>{filtered.length ? 1 : 0}–{filtered.length}</strong> of <strong>{employees.length}</strong> employees</span><span className="footer-note">Connected to Spring Boot API</span></div>
          </section>
          <footer>PeopleDesk POC <span>•</span> Built with React and Spring Boot</footer>
        </section>
      </main>

      {modalOpen && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
        <form className="modal" onSubmit={saveEmployee}>
          <div className="modal-heading"><div><div className="eyebrow">{editing ? 'UPDATE RECORD' : 'NEW TEAM MEMBER'}</div><h2>{editing ? 'Edit employee' : 'Add employee'}</h2><p>Enter the employee details below.</p></div><button type="button" className="icon-btn" onClick={() => setModalOpen(false)}><X size={18}/></button></div>
          <label>Full name<input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Ananya Singh" /></label>
          <label>Work email<input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="name@company.com" /></label>
          <div className="form-row"><label>Department<select value={form.department} onChange={e => setForm({...form, department: e.target.value})}><option>Engineering</option><option>Design</option><option>Operations</option><option>Product</option><option>Human Resources</option><option>Marketing</option><option>Finance</option></select></label><label>Job title<input required value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g. Product Manager" /></label></div>
          <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setModalOpen(false)}>Cancel</button><button className="primary-btn" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : <><Plus size={17}/> Add employee</>}</button></div>
        </form>
      </div>}
    </div>
  );
}
