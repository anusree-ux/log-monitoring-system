import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import "./App.css";

interface LogEntry {
  id: string;
  timestamp: string;
  service_name: string;
  log_level: string;
  message: string;
  metadata: Record<string, any>;
}

function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState("");

  const fetchLogs = async () => {
    const url = filterLevel
      ? `/api/logs?level=${filterLevel}`
      : "/api/logs";

    const response = await fetch(url);
    const data = await response.json();
    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
  }, [filterLevel]);

  const infoCount = logs.filter(
    (log) => log.log_level === "INFO"
  ).length;

  const warnCount = logs.filter(
    (log) => log.log_level === "WARN"
  ).length;

  const errorCount = logs.filter(
    (log) => log.log_level === "ERROR"
  ).length;

  const chartData = [
    {
      name: "INFO",
      count: infoCount,
      color: "#0ea5e9",
    },
    {
      name: "WARN",
      count: warnCount,
      color: "#f59e0b",
    },
    {
      name: "ERROR",
      count: errorCount,
      color: "#ef4444",
    },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="header-title">
        ⚡ Log Monitoring Dashboard
      </h2>

      {/* Metrics */}

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Logs</div>
          <div className="metric-value">{logs.length}</div>
        </div>

        <div className="metric-card info">
          <div
            className="metric-value"
            style={{ color: "var(--color-info)" }}
          >
            {infoCount}
          </div>

          <div className="metric-label">INFO</div>
        </div>

        <div className="metric-card warn">
          <div
            className="metric-value"
            style={{ color: "var(--color-warn)" }}
          >
            {warnCount}
          </div>

          <div className="metric-label">WARN</div>
        </div>

        <div className="metric-card error">
          <div
            className="metric-value"
            style={{ color: "var(--color-error)" }}
          >
            {errorCount}
          </div>

          <div className="metric-label">ERROR</div>
        </div>
      </div>

      {/* Chart */}

      <div className="card" style={{ height: "300px" }}>
        <h3
          style={{
            marginTop: 0,
            color: "var(--text-muted)",
            fontSize: "14px",
            textTransform: "uppercase",
          }}
        >
          Log Volume by Severity
        </h3>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: -20,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="name"
              stroke="var(--text-muted)"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              allowDecimals={false}
              stroke="var(--text-muted)"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              cursor={{
                fill: "var(--bg-card-hover)",
              }}
              contentStyle={{
                backgroundColor: "var(--bg-dark)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />

            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              barSize={60}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Logs */}

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: 0 }}>Recent Logs</h3>

          <div>
            <select
              className="styled-select"
              value={filterLevel}
              onChange={(e) =>
                setFilterLevel(e.target.value)
              }
            >
              <option value="">All Severities</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>

            <button
              className="primary-btn"
              onClick={fetchLogs}
            >
              Refresh
            </button>
          </div>
        </div>

        <table className="log-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Service</th>
              <th>Severity</th>
              <th>Message</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>

                <td>{log.service_name}</td>

                <td>
                  <span
                    className={`badge ${log.log_level.toLowerCase()}`}
                  >
                    {log.log_level}
                  </span>
                </td>

                <td>{log.message}</td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  No logs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
