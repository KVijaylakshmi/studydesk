import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, ArrowUpRight, BookOpen, Check, CheckCircle2, Circle, Clock3, LayoutDashboard, ListTodo, LogOut, Plus, Search, Trash2, Pencil, X, Menu, Leaf } from 'lucide-react';
import './styles.css';

const emptyTask = { title: '', subject: '', description: '', dueDate: '', priority: 'Medium', status: 'To do' };
const examples = [
  { _id: 'demo1', title: 'Build the MERN micro project', subject: 'Web Development', description: 'Connect the React frontend to the Express API.', dueDate: '2026-10-15', priority: 'High', status: 'In progress' },
  { _id: 'demo2', title: 'Revise database normalization', subject: 'Database Management', description: 'Review 1NF, 2NF, and 3NF with examples.', dueDate: '2026-10-16', priority: 'Medium', status: 'To do' },
  { _id: 'demo3', title: 'Prepare the project report', subject: 'Web Development', description: 'Add screenshots and print the report in color.', dueDate: '2026-10-17', priority: 'High', status: 'To do' },
  { _id: 'demo4', title: 'Finish Java practice problems', subject: 'Programming', description: 'Practice classes and inheritance.', dueDate: '2026-10-12', priority: 'Low', status: 'Completed' }
];
function App() {
  const [page, setPage] = useState('home');
  const [session, setSession] = useState(() => { try { return JSON.parse(sessionStorage.getItem('studydesk-session')); } catch { return null; } });
  const [demo, setDemo] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All tasks');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyTask);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState(false);
  async function api(path, options = {}) {
    const response = await fetch('/api' + path, { ...options, headers: { 'Content-Type': 'application/json', ...(session ? { Authorization: `Bearer ${session.token}` } : {}) }, ...(options.body ? { body: JSON.stringify(options.body) } : {}) });
    const data = await response.json().catch(() => ({ message: 'Cannot reach the API. Start the backend and check MongoDB.' }));
    if (!response.ok) { if (response.status === 401 && session) { setSession(null); sessionStorage.removeItem('studydesk-session'); setPage('login'); } throw new Error(data.message); }
    return data;
  }
  useEffect(() => {
    if (!session) return;
    let active = true;
    setLoading(true);
    api('/tasks').then(data => { if (active) setTasks(data); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [session]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 4000); return () => clearTimeout(timer); }, [notice]);
  useEffect(() => { if (!modal) return; const close = e => { if (e.key === 'Escape' && !busy) setModal(null); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [modal, busy]);
  function navigate(next) { setPage(next); setError(''); setMobile(false); }
  function startDemo() { setSession(null); sessionStorage.removeItem('studydesk-session'); setDemo(true); setTasks(examples.map(t => ({ ...t }))); setFilter('All tasks'); navigate('tasks'); }
  function logout() { setSession(null); setDemo(false); setTasks([]); sessionStorage.removeItem('studydesk-session'); navigate('home'); }
  async function authenticate(event) {
    event.preventDefault(); setBusy(true); setError('');
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try { const data = await api('/auth/' + (page === 'register' ? 'register' : 'login'), { method: 'POST', body: values }); setDemo(false); setTasks([]); setSession(data); sessionStorage.setItem('studydesk-session', JSON.stringify(data)); navigate('tasks'); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  function editTask(task) { setForm(task || { ...emptyTask }); setError(''); setModal(task ? 'edit' : 'add'); }
  async function saveTask(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const data = demo ? { ...form, _id: form._id || crypto.randomUUID() } : await api('/tasks' + (modal === 'edit' ? '/' + form._id : ''), { method: modal === 'edit' ? 'PUT' : 'POST', body: form });
      setTasks(old => modal === 'edit' ? old.map(t => t._id === data._id ? data : t) : [data, ...old]); setModal(null); setNotice(modal === 'edit' ? 'Task updated.' : 'New task added.');
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function deleteTask() {
    setBusy(true); setError('');
    try { if (!demo) await api('/tasks/' + form._id, { method: 'DELETE' }); setTasks(old => old.filter(t => t._id !== form._id)); setModal(null); setNotice('Task deleted.'); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  const complete = tasks.filter(t => t.status === 'Completed').length;
  const progress = tasks.filter(t => t.status === 'In progress').length;
  const shown = tasks.filter(t => (filter === 'All tasks' || t.status === filter) && `${t.title} ${t.subject}`.toLowerCase().includes(search.toLowerCase()));
  const loggedIn = session || demo;
  return <div className="app">
    <aside className={mobile ? 'sidebar open' : 'sidebar'}>
      <a className="brand" href="#home" onClick={e => { e.preventDefault(); navigate('home'); }}><span className="brand-icon"><BookOpen size={22}/></span>StudyDesk<span className="brand-dot">.</span></a>
      <div className="workspace-label">YOUR WORKSPACE</div>
      <nav><button className={page === 'home' ? 'active' : ''} onClick={() => navigate('home')}><LayoutDashboard size={18}/>Overview</button><button className={page === 'tasks' ? 'active' : ''} onClick={() => navigate(loggedIn ? 'tasks' : 'login')}><ListTodo size={18}/>My tasks{loggedIn && <span className="nav-count">{tasks.length}</span>}</button></nav>
      <div className="sidebar-note"><span className="small-leaf"><Leaf size={20}/></span><h3>Small steps. Big progress.</h3><p>A little planning today makes room for a better tomorrow.</p><span className="note-line"/></div>
      <div className="sidebar-bottom"><span className="stack-dot"/> BUILT WITH THE MERN STACK<div>Micro Project · Term Work 02</div></div>
    </aside>
    <div className="main-wrap">
      <header><div className="breadcrumb"><button className="mobile-menu icon-button" aria-label="Toggle menu" onClick={() => setMobile(!mobile)}><Menu size={20}/></button>Workspace <span>/</span> <strong>{page === 'tasks' ? 'My tasks' : page === 'login' ? 'Login' : page === 'register' ? 'Create account' : 'Overview'}</strong></div><div className="header-right"><span className="student-label">A student's everyday companion</span>{loggedIn ? <><span className="avatar">{(session?.user.name || 'Demo')[0].toUpperCase()}</span><button className="text-button" onClick={logout} title="Log out"><LogOut size={17}/><span>Log out</span></button></> : <button className="text-button" onClick={() => navigate('login')}>Log in <ArrowUpRight size={16}/></button>}</div></header>
      <main>
        {page === 'home' && <>
          <div className="eyebrow"><span/> LESS OVERWHELM. MORE GETTING THINGS DONE.</div>
          <section className="hero"><div className="hero-copy"><h1>A little more organized.<br/><em>A lot more possible.</em></h1><p>Assignments, deadlines, and everything in between.<br className="desktop-break"/> Give your student life a little breathing room.</p><div className="hero-actions"><button className="primary" onClick={() => navigate(loggedIn ? 'tasks' : 'register')}>{loggedIn ? 'Go to my tasks' : 'Start your workspace'}<ArrowRight size={18}/></button><button className="secondary" onClick={startDemo}>Explore a demo <ArrowUpRight size={17}/></button></div><div className="hero-caption"><CheckCircle2 size={14}/> Simple to use <span>·</span> Made for students <span>·</span> Free to get started</div></div><div className="hero-art" aria-label="Illustration of an organized study checklist"><div className="art-orbit one"/><div className="art-orbit two"/><span className="spark s1">✳</span><span className="spark s2">+</span><div className="floating-label"><span>✦</span> You've got this.</div><div className="paper"><div className="paper-top"><span>THE DAILY PLAN</span><span>•••</span></div><h3>One thing at a time.</h3><div className="paper-row checked"><Check size={13}/><span>Show up for yourself</span></div><div className="paper-row checked"><Check size={13}/><span>Make a little progress</span></div><div className="paper-row"><span className="empty-check"/><span>Keep going</span></div><div className="paper-progress"><i/></div><small>Progress, over perfection.</small></div><div className="floating-check"><Check size={25}/></div><div className="art-caption">a clearer mind starts here ↗</div></div></section>
          <section className="overview-section"><div className="section-heading"><div><h2>Your space to stay on track</h2><p>A simple system for all the things on your plate.</p></div><span className="pill">THINK CLEAR. WORK BETTER.</span></div><div className="feature-grid"><Feature number="01" icon={<ListTodo/>} title="Everything in one place" text="Keep assignments and study tasks together. No more scattered notes or forgotten to-dos."/><Feature number="02" icon={<Clock3/>} title="Make time for what matters" text="Set due dates and priorities, so you always know what needs your attention next."/><Feature number="03" icon={<CheckCircle2/>} title="See your progress grow" text="Move from to-do to done. Celebrate the small wins that add up to something bigger."/></div></section>
          <section className="bottom-banner"><span className="banner-icon"><BookOpen size={23}/></span><div><h3>Your next productive chapter starts here.</h3><p>Create an account and make a little space for your goals.</p></div><button className="text-button" onClick={() => navigate(loggedIn ? 'tasks' : 'register')}>{loggedIn ? 'Open workspace' : 'Let’s get started'}<ArrowRight size={18}/></button></section>
        </>}
        {(page === 'login' || page === 'register') && <div className="auth-layout"><div className="auth-intro"><div className="eyebrow">YOUR OWN LITTLE CORNER</div><h1>{page === 'register' ? 'Good things start' : 'Welcome back'}<br/><em>{page === 'register' ? 'with a small step.' : 'to your workspace.'}</em></h1><p>Less mental clutter. More room to learn.<br/>Keep your goals close and your tasks in order.</p><div className="auth-quote">“The secret of getting ahead<br/>is getting started.”<span>ONE TASK AT A TIME.</span></div></div><form className="auth-card" onSubmit={authenticate}><span className="brand-icon"><BookOpen size={22}/></span><h2>{page === 'register' ? 'Create your account' : 'Log in to StudyDesk'}</h2><p>{page === 'register' ? 'A fresh start for a more organized you.' : 'Your next small win is waiting.'}</p>{error && <div className="error" role="alert">{error}</div>}{page === 'register' && <label>Full name<input name="name" placeholder="e.g. Alex Sharma" autoComplete="name" required maxLength={60}/></label>}<label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required maxLength={254}/></label><label>Password<input name="password" type="password" placeholder={page === 'register' ? 'At least 8 characters' : 'Enter your password'} autoComplete={page === 'register' ? 'new-password' : 'current-password'} minLength={page === 'register' ? 8 : 1} maxLength={72} required/></label><button className="primary full" disabled={busy}>{busy ? 'Please wait…' : page === 'register' ? 'Create account' : 'Log in'}<ArrowRight size={17}/></button><p className="auth-switch">{page === 'register' ? 'Already have an account?' : 'New to StudyDesk?'} <button type="button" className="inline-button" onClick={() => navigate(page === 'register' ? 'login' : 'register')}>{page === 'register' ? 'Log in' : 'Create an account'}</button></p><div className="auth-demo"><button type="button" className="text-button" onClick={startDemo}>Just looking? Explore the demo <ArrowUpRight size={15}/></button></div></form></div>}
        {page === 'tasks' && <>
          {demo && <div className="demo-banner"><span><strong>Demo workspace</strong> · Try adding, editing, and deleting tasks. Changes reset when you restart the demo or refresh.</span><button onClick={() => navigate('register')}>Create a real account <ArrowRight size={14}/></button></div>}
          <div className="task-heading"><div><div className="eyebrow">A LITTLE PROGRESS, EVERY DAY</div><h1>Your tasks, <em>in focus.</em></h1><p>Welcome{session ? `, ${session.user.name.split(' ')[0]}` : ''}. Let’s make room for what matters.</p></div><button className="primary" onClick={() => editTask()}><Plus size={18}/>Add task</button></div>
          <div className="stat-grid"><Stat label="Total tasks" value={tasks.length} icon={<ListTodo size={20}/>} text="Everything on your plate"/><Stat label="In progress" value={progress} icon={<Clock3 size={20}/>} text="A little closer to done"/><Stat label="Completed" value={complete} icon={<CheckCircle2 size={20}/>} text="Small wins worth celebrating"/></div>
          <section className="task-panel"><div className="task-toolbar"><h2>My tasks <span>{tasks.length}</span></h2><div className="search"><Search size={17}/><input aria-label="Search tasks" placeholder="Search tasks or subjects…" value={search} onChange={e => setSearch(e.target.value)}/></div></div><div className="filters">{['All tasks', 'To do', 'In progress', 'Completed'].map(f => <button key={f} className={filter === f ? 'selected' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div>{error && !modal && <div className="error" role="alert">{error}</div>}{loading ? <div className="empty-state">Loading your tasks…</div> : shown.length ? <div className="task-list">{shown.map(t => <article className="task-row" key={t._id}><span className={'task-status-icon ' + (t.status === 'Completed' ? 'done' : '')}>{t.status === 'Completed' ? <CheckCircle2 size={21}/> : t.status === 'In progress' ? <Clock3 size={21}/> : <Circle size={21}/>}</span><div className="task-info"><h3>{t.title}</h3><p>{t.subject}<span>·</span>Due {new Date(t.dueDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>{t.description && <div className="task-description">{t.description}</div>}</div><span className={'priority ' + t.priority.toLowerCase()}><i/>{t.priority}</span><span className={'status ' + t.status.toLowerCase().replaceAll(' ', '-')}>{t.status}</span><div className="row-actions"><button className="icon-button" aria-label={'Edit ' + t.title} onClick={() => editTask(t)}><Pencil size={16}/></button><button className="icon-button delete" aria-label={'Delete ' + t.title} onClick={() => { setForm(t); setError(''); setModal('delete'); }}><Trash2 size={16}/></button></div></article>)}</div> : <div className="empty-state"><ListTodo size={32}/><h3>{tasks.length ? 'No matching tasks' : 'A fresh page. A good place to start.'}</h3><p>{tasks.length ? 'Try another search or status filter.' : 'Add your first task and take one small step forward.'}</p>{!tasks.length && <button className="secondary" onClick={() => editTask()}><Plus size={16}/>Add your first task</button>}</div>}</section>
          <div className="progress-note"><Leaf size={16}/> You don’t have to do it all today. Just take the next step.</div>
        </>}
        <footer><span>© {new Date().getFullYear()} StudyDesk. A little space for big things.</span><span>MongoDB <i/> Express <i/> React <i/> Node.js</span></footer>
      </main>
    </div>
    {notice && <div className="toast" role="status"><CheckCircle2 size={18}/>{notice}</div>}
    {modal && <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget && !busy) setModal(null); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><h2 id="modal-title">{modal === 'delete' ? 'Delete this task?' : modal === 'edit' ? 'Edit your task' : 'A new small step'}</h2><button className="icon-button" aria-label="Close dialog" disabled={busy} onClick={() => setModal(null)}><X size={20}/></button></div>{error && <div className="error" role="alert">{error}</div>}{modal === 'delete' ? <><p>“{form.title}” will be permanently removed from your workspace.</p><div className="modal-actions"><button className="secondary" disabled={busy} onClick={() => setModal(null)}>Cancel</button><button className="danger-button" disabled={busy} onClick={deleteTask}>{busy ? 'Deleting…' : 'Delete task'}</button></div></> : <form onSubmit={saveTask}><p>Give it a name, set a date, and make it happen.</p><label>Task title<input autoFocus required maxLength={120} placeholder="What would you like to get done?" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}/></label><div className="form-grid"><label>Subject<input required maxLength={60} placeholder="e.g. Web Development" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}/></label><label>Due date<input type="date" required value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}/></label><label>Priority<select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>{['Low', 'Medium', 'High'].map(x => <option key={x}>{x}</option>)}</select></label><label>Status<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{['To do', 'In progress', 'Completed'].map(x => <option key={x}>{x}</option>)}</select></label></div><label>Description <span className="optional">(optional)</span><textarea rows={3} maxLength={1000} placeholder="A few helpful details…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}/></label><div className="modal-actions"><button type="button" className="secondary" disabled={busy} onClick={() => setModal(null)}>Cancel</button><button className="primary" disabled={busy}>{busy ? 'Saving…' : modal === 'edit' ? 'Save changes' : 'Add task'}<Check size={16}/></button></div></form>}</section></div>}
  </div>;
}
function Feature({ number, icon, title, text }) { return <article className="feature"><div className="feature-top"><span className="feature-icon">{icon}</span><span>{number}</span></div><h3>{title}</h3><p>{text}</p></article>; }
function Stat({ label, value, icon, text }) { return <article className="stat"><div><span>{label}</span>{icon}</div><strong>{value.toString().padStart(2, '0')}</strong><p>{text}</p></article>; }
createRoot(document.getElementById('root')).render(<App/>);
