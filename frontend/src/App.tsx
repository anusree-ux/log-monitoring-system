import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './App.css';

interface LogEntry {
  id: string;
  timestamp: string;
  service_name: string;
  log_level: string;
  message: string;
  metadata: Record<string, any>;
}

interface AlertRule {
  id: string;
  name: string;
  target_service: string;
  target_level: string;
  threshold_count: number;
  time_window_minutes: number;
  email: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'logs' | 'rules'>('logs');
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('');
  
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [newRule, setNewRule] = useState({
    name: '', target_service: '', target_level: 'ERROR', 
    threshold_count: 5, time_window_minutes: 5, email_notification: ''
  });

  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  const fetchLogs = async () => {
    const url = filterLevel ? `${API_URL}/api/logs?level=${filterLevel}` : `${API_URL}/api/logs`;
    const res = await fetch(url);
    setLogs(await res.json());
  };

  const fetchRules = async () => {
    const res = await fetch(`${API_URL}/api/rules`);
    setRules(await res.json());
  };

  const createRule = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRule)
    });
    fetchRules();
    setNewRule({ name: '', target_service: '', target_level: 'ERROR', threshold_count: 5, time_window_minutes: 5, email_notification: '' });
  };

  useEffect(() => {
    if (activeTab === 'logs') fetchLogs();
    if (activeTab === 'rules') fetchRules();
  }, [activeTab, filterLevel]);

  // Calculate Chart Data
  const chartData = [
    { name: 'INFO', count: logs.filter(l => l.log_level === 'INFO').length, color: '#3b82f6' }, 
    { name: 'WARN', count: logs.filter(l => l.log_level === 'WARN').length, color: '#f97316' }, 
    { name: 'ERROR', count: logs.filter(l => l.log_level === 'ERROR').length, color: '#ef4444' } 
  ];

  return (
    <div className="container" style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Log Monitoring & Alerting Platform</h2>
      
      <div style={{ borderBottom: '2px solid #eee', marginBottom: '20px', paddingBottom: '10px' }}>
        <button onClick={() => setActiveTab('logs')} style={{ marginRight: '10px', fontWeight: activeTab === 'logs' ? 'bold' : 'normal' }}>
          Real-Time Logs
        </button>
        <button onClick={() => setActiveTab('rules')} style={{ fontWeight: activeTab === 'rules' ? 'bold' : 'normal' }}>
          Alert Rules
        </button>
      </div>

      {activeTab === 'logs' && (
        <div>
          {/* Analytics Chart Container */}
          <div style={{ background: '#242424', padding: '20px', borderRadius: '8px', marginBottom: '20px', height: '250px' }}>
            <h3 style={{ marginTop: 0, textAlign: 'center', color: '#fff' }}>Log Volume by Severity</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis allowDecimals={false} stroke="#fff" />
                <Tooltip cursor={{fill: '#333'}} contentStyle={{ color: '#000' }}/>
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Filter Level: </label>
            <select onChange={(e) => setFilterLevel(e.target.value)} value={filterLevel}>
              <option value="">ALL</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
            <button onClick={fetchLogs} style={{ marginLeft: '10px' }}>Refresh</button>
          </div>
          
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc' }}>
                <th>Time</th><th>Service</th><th>Level</th><th>Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #444' }}>
                  <td style={{ padding: '8px 0' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td>{log.service_name}</td>
                  <td style={{ color: log.log_level === 'ERROR' ? '#ef4444' : log.log_level === 'WARN' ? '#f97316' : '#3b82f6', fontWeight: 'bold' }}>
                    {log.log_level}
                  </td>
                  <td>{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'rules' && (
        <div>
           <form onSubmit={createRule} style={{ background: '#242424', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
            <h3 style={{color: '#fff'}}>Create New Alert Rule</h3>
            <input required placeholder="Rule Name" value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} style={{ marginRight: '5px' }}/>
            <input required placeholder="Target Service (e.g. payment-api)" value={newRule.target_service} onChange={e => setNewRule({...newRule, target_service: e.target.value})} style={{ marginRight: '5px' }}/>
            <select value={newRule.target_level} onChange={e => setNewRule({...newRule, target_level: e.target.value})} style={{ marginRight: '5px' }}>
              <option value="ERROR">ERROR</option>
              <option value="WARN">WARN</option>
              <option value="INFO">INFO</option>
            </select>
            <input required type="number" placeholder="Count" value={newRule.threshold_count} onChange={e => setNewRule({...newRule, threshold_count: parseInt(e.target.value)})} style={{ width: '60px', marginRight: '5px' }}/>
            <span style={{ marginRight: '5px' }}>logs in</span>
            <input required type="number" placeholder="Mins" value={newRule.time_window_minutes} onChange={e => setNewRule({...newRule, time_window_minutes: parseInt(e.target.value)})} style={{ width: '60px', marginRight: '5px' }}/>
            <span style={{ marginRight: '5px' }}>mins. Email to:</span>
            <input required type="email" placeholder="Email" value={newRule.email_notification} onChange={e => setNewRule({...newRule, email_notification: e.target.value})} style={{ marginRight: '5px' }}/>
            <button type="submit">Save Rule</button>
          </form>

          <h3>Active Rules</h3>
          <ul>
            {rules.map(r => (
              <li key={r.id} style={{ marginBottom: '10px' }}>
                <strong>{r.name}</strong>: Alert {r.email} if <b>{r.target_service}</b> has {r.threshold_count}+ <b>{r.target_level}</b>s in {r.time_window_minutes}m.
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;