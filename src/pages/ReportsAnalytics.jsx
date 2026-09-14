import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Clock, 
  CheckCircle2, 
  Download, 
  AlertTriangle,
  Award,
  Calendar,
  Layers
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useToast } from '../context/ToastContext';

export default function ReportsAnalytics() {
  const { complaints } = useComplaints();
  const { addToast } = useToast();

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'En Route').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const cancelled = complaints.filter(c => c.status === 'Cancelled').length;

  // Hazard breakdown counts
  const hazardCounts = {
    'Foul Smell': complaints.filter(c => c.hazard === 'Foul Smell').length,
    'Overflowing Bin': complaints.filter(c => c.hazard === 'Overflowing Bin').length,
    'Mosquito Breeding': complaints.filter(c => c.hazard === 'Mosquito Breeding').length,
    'Risk to Children': complaints.filter(c => c.hazard === 'Risk to Children').length,
    'None / Standard': complaints.filter(c => !c.hazard || c.hazard === 'None').length
  };

  // Ward performance stats
  const wards = [
    { name: 'Indiranagar (Ward 12)', total: complaints.filter(c => c.ward && c.ward.includes('Indiranagar')).length, resolved: complaints.filter(c => c.ward && c.ward.includes('Indiranagar') && c.status === 'Resolved').length, avgHours: '24h' },
    { name: 'MG Road (Ward 04)', total: complaints.filter(c => c.ward && c.ward.includes('MG Road')).length, resolved: complaints.filter(c => c.ward && c.ward.includes('MG Road') && c.status === 'Resolved').length, avgHours: '32h' },
    { name: 'Koramangala (Ward 08)', total: complaints.filter(c => c.ward && c.ward.includes('Koramangala')).length, resolved: complaints.filter(c => c.ward && c.ward.includes('Koramangala') && c.status === 'Resolved').length, avgHours: '18h' },
    { name: 'Jayanagar (Ward 15)', total: complaints.filter(c => c.ward && c.ward.includes('Jayanagar')).length, resolved: complaints.filter(c => c.ward && c.ward.includes('Jayanagar') && c.status === 'Resolved').length, avgHours: '22h' }
  ];

  const handleExportCSV = () => {
    const headers = ['ID', 'Location', 'Ward', 'Category', 'Hazard', 'Status', 'ReportedBy', 'CreatedAt', 'ResolvedAt', 'WasteRemoved'];
    const rows = complaints.map(c => [
      c.id,
      `"${c.location}"`,
      `"${c.ward || ''}"`,
      `"${c.category}"`,
      `"${c.hazard}"`,
      c.status,
      `"${c.reportedBy}"`,
      c.createdAt,
      c.resolvedAt || '',
      `"${c.wasteRemoved || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartsweep-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    addToast('Analytics CSV exported successfully!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Municipal Reports & Analytics</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem' }}>
            Comprehensive performance insights, turnaround metrics, and hazard distribution
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
          <Download size={15} /> Export Analytics CSV
        </button>
      </div>

      {/* Top High-level Indicators */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Average Turnaround</div>
            <div className="kpi-value" style={{ color: 'var(--accent)' }}>28.4 hrs</div>
            <div className="kpi-subtext">Within 48-hour municipal SLA</div>
          </div>
          <div className="kpi-icon-wrap">
            <Clock size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Cleanliness Index</div>
            <div className="kpi-value" style={{ color: 'var(--resolved)' }}>94.2%</div>
            <div className="kpi-subtext">+3.1% improvement this month</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--resolved-dim)', color: 'var(--resolved)' }}>
            <Award size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Waste Diverted</div>
            <div className="kpi-value" style={{ color: 'var(--progress)' }}>14.8 Tons</div>
            <div className="kpi-subtext">Recycled & segregated volume</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--progress-dim)', color: 'var(--progress)' }}>
            <Layers size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Citizen Rating</div>
            <div className="kpi-value" style={{ color: 'var(--pending)' }}>4.8 ★</div>
            <div className="kpi-subtext">Based on post-resolution feedback</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--pending-dim)', color: 'var(--pending)' }}>
            <Award size={22} />
          </div>
        </div>
      </div>

      {/* Visual Chart Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Chart 1: Caseload Status Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.15rem' }}>Caseload Status Breakdown</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total: {total}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Resolved Cases', count: resolved, color: 'var(--resolved)' },
              { label: 'In Progress (Active Cleanup)', count: inProgress, color: 'var(--progress)' },
              { label: 'Pending Dispatch', count: pending, color: 'var(--pending)' },
              { label: 'Cancelled / Duplicate', count: cancelled, color: 'var(--text-dim)' }
            ].map(item => {
              const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-h)', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{item.count} ({percent}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--surface-2)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${percent}%`, background: item.color, borderRadius: 'var(--radius-pill)', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Hazard Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.15rem' }}>Complaints by Hazard Type</h2>
            <AlertTriangle size={16} color="var(--hazard)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(hazardCounts).map(([hz, count]) => {
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={hz}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-h)', fontWeight: 500 }}>{hz}</span>
                    <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{count} ({percent}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--surface-2)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${percent}%`, background: hz === 'None / Standard' ? 'var(--accent)' : 'var(--hazard)', borderRadius: 'var(--radius-pill)', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ward Performance Leaderboard */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem' }}>Ward Sanitation Performance Leaderboard</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.84rem' }}>Comparative clearance rates and turnaround efficiency</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 10px' }}>Ward Sector</th>
                <th style={{ padding: '12px 10px' }}>Total Complaints</th>
                <th style={{ padding: '12px 10px' }}>Resolved</th>
                <th style={{ padding: '12px 10px' }}>Resolution Rate</th>
                <th style={{ padding: '12px 10px' }}>Average Response</th>
                <th style={{ padding: '12px 10px' }}>SLA Grade</th>
              </tr>
            </thead>
            <tbody>
              {wards.map((w, index) => {
                const rate = w.total > 0 ? Math.round((w.resolved / w.total) * 100) : 100;
                return (
                  <tr key={w.name} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '14px 10px', fontWeight: 600, color: 'var(--text-h)' }}>
                      {w.name}
                    </td>
                    <td style={{ padding: '14px 10px', color: 'var(--text)' }}>{w.total}</td>
                    <td style={{ padding: '14px 10px', color: 'var(--resolved)', fontWeight: 600 }}>{w.resolved}</td>
                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '80px', height: '6px', background: 'var(--surface-2)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${rate}%`, background: 'var(--accent)' }} />
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{rate}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 10px', color: 'var(--text-dim)' }}>{w.avgHours}</td>
                    <td style={{ padding: '14px 10px' }}>
                      <span className="badge badge-citizen" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                        Grade A+
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
