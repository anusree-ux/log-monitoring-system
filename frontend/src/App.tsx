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

  const fetchLogs = async () => {
    const url = filterLevel ? `/api/logs?level=${filterLevel}` : '/api/logs';
    const res = await fetch(url);
    setLogs(await res.json());
  };

  const fetchRules = async () => {
    const res = await fetch('/api/rules');
    setRules(await res.json());
  };

  const createRule = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRule)
    });
    setNewRule({ name: '', target_service: '', target_level: 'ERROR', threshold_count: 5, time_window_minutes: 5, email_notification: '' });
    fetchRules();
  };

  useEffect(() => {
    if (activeTab === 'logs') fetchLogs();
    if (activeTab === 'rules') fetchRules();
  }, [activeTab, filterLevel]);

  // Derived Metrics
  const infoCount = logs.filter(l => l.log_level === 'INFO').length;
  const warnCount = logs.filter(l => l.log_level === 'WARN').length;
  const errorCount = logs.filter(l => l.log_level === 'ERROR').length;

  const chartData = [
    { name: 'INFO', count: infoCount, color: '#0ea5e9' },
    { name: 'WARN', count: warnCount, color: '#f59e0b' },
    { name: 'ERROR', count: errorCount, color: '#ef4444' }
  ];

  return (
    <div className="dashboard-container">
      <h2 className="header-title">⚡ Log Monitoring System</h2>

      <div className="nav-tabs">
        <button 
          className={`nav-button ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          Real-Time Telemetry
        </button>
        <button 
          className={`nav-button ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          Alert Policies
        </button>
      </div>

      {activeTab === 'logs' && (
        <div>
          {/* Top Metrics Row */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Total Events</div>
              <div className="metric-value">{logs.length}</div>
            </div>
            <div className="metric-card info">
              <div className="metric-label">Healthy (INFO)</div>
              <div className="metric-value" style={{color: 'var(--color-info)'}}>{infoCount}</div>
            </div>
            <div className="metric-card warn">
              <div className="metric-label">Warnings</div>
              <div className="metric-value" style={{color: 'var(--color-warn)'}}>{warnCount}</div>
            </div>
            <div className="metric-card error">
              <div className="metric-label">Critical Errors</div>
              <div className="metric-value" style={{color: 'var(--color-error)'}}>{errorCount}</div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="card" style={{ height: '300px' }}>
            <h3 style={{ marginTop: 0, color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase' }}>Volume by Severity</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'var(--bg-card-hover)'}} contentStyle={{ backgroundColor: 'var(--bg-dark)', border: 'none', borderRadius: '8px', color: '#fff' }}/>
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table Section */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Recent Logs</h3>
              <div>
                <select className="styled-select" onChange={(e) => setFilterLevel(e.target.value)} value={filterLevel}>
                  <option value="">All Severities</option>
                  <option value="INFO">INFO Only</option>
                  <option value="WARN">WARN Only</option>
                  <option value="ERROR">ERROR Only</option>
                </select>
                <button className="primary-btn" onClick={fetchLogs}>Force Sync</button>
              </div>
            </div>
            
            <table className="log-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Service Origin</th>
                  <th>Severity</th>
                  <th>Message Detail</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td style={{ fontWeight: 500 }}>{log.service_name}</td>
                    <td>
                      <span className={`badge ${log.log_level.toLowerCase()}`}>
                        {log.log_level}
                      </span>
                    </td>
                    <td>{log.message}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No logs captured yet. Fire some events into the database!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="card">
          <form onSubmit={createRule} style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid var(--bg-card-hover)' }}>
            <h3 style={{ marginTop: 0 }}>Deploy New Alert Policy</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <input className="styled-input" required placeholder="Policy Name" value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} />
              <input className="styled-input" required placeholder="Target Service" value={newRule.target_service} onChange={e => setNewRule({...newRule, target_service: e.target.value})} />
              <select className="styled-select" value={newRule.target_level} onChange={e => setNewRule({...newRule, target_level: e.target.value})}>
                <option value="ERROR">ERROR</option>
                <option value="WARN">WARN</option>
                <option value="INFO">INFO</option>
              </select>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Trigger after</span>
                <input className="styled-input" style={{ width: '70px', marginRight: 0 }} required type="number" value={newRule.threshold_count} onChange={e => setNewRule({...newRule, threshold_count: parseInt(e.target.value)})} />
                <span style={{ color: 'var(--text-muted)' }}>events in</span>
                <input className="styled-input" style={{ width: '70px', marginRight: 0 }} required type="number" value={newRule.time_window_minutes} onChange={e => setNewRule({...newRule, time_window_minutes: parseInt(e.target.value)})} />
                <span style={{ color: 'var(--text-muted)' }}>mins. Notify:</span>
              </div>
              
              <input className="styled-input" required type="email" placeholder="Email Address" value={newRule.email_notification} onChange={e => setNewRule({...newRule, email_notification: e.target.value})} />
              <button className="primary-btn" type="submit">Save Policy</button>
            </div>
          </form>

          <h3 style={{ marginTop: 0 }}>Active Policies</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {rules.map(r => (
              <li key={r.id} style={{ padding: '16px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: 'var(--accent-blue)', fontSize: '16px', display: 'block', marginBottom: '4px' }}>{r.name}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Alert <b>{r.email}</b> if <b style={{color: 'var(--text-main)'}}>{r.target_service}</b> fires <b>{r.threshold_count}+</b> <span className={`badge ${r.target_level.toLowerCase()}`}>{r.target_level}</span> events in {r.time_window_minutes}m.
                  </span>
                </div>
              </li>
            ))}
            {rules.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No active policies.</div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
