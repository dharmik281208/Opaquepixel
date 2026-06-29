export function generateForensicPDF(reportData) {
  const { fileName, fileSize, carrierType, scanTime, threatScore, algorithms, metadata } = reportData;
  
  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (!printWindow) {
    alert("Please allow popups to download the PDF report.");
    return;
  }

  const isHighRisk = threatScore > 50;
  const statusColor = isHighRisk ? "#ef4444" : "#10b981";
  const statusText = isHighRisk ? "HIGH STENOGRAPHIC ANOMALY DETECTED" : "CLEAN MEDIA CARRIER DETECTED";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Forensic Scan Report - ${fileName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 40px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .brand {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.02em;
          }
          .brand span { color: #10b981; }
          .badge {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #ffffff;
            background: ${statusColor};
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
          }
          .card-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 8px;
          }
          .card-value {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
          }
          .section-title {
            font-size: 16px;
            font-weight: 700;
            margin-top: 30px;
            margin-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
          }
          th {
            background: #f1f5f9;
            font-weight: 600;
            color: #475569;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">Opaque<span>Pixel</span></div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Steganographic Forensic Analysis Report</div>
          </div>
          <div class="badge">${statusText}</div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-title">Target File Name</div>
            <div class="card-value" style="font-size: 15px; word-break: break-all;">${fileName}</div>
          </div>
          <div class="card">
            <div class="card-title">Steganographic Probability Score</div>
            <div class="card-value" style="color: ${statusColor};">${threatScore}%</div>
          </div>
          <div class="card">
            <div class="card-title">Carrier Media Type</div>
            <div class="card-value">${carrierType.toUpperCase()} (${fileSize})</div>
          </div>
          <div class="card">
            <div class="card-title">Scan Timestamp</div>
            <div class="card-value" style="font-size: 14px;">${scanTime}</div>
          </div>
        </div>

        <div class="section-title">Multi-Algorithm Forensic Audit</div>
        <table>
          <thead>
            <tr>
              <th>Inspection Stage / Algorithm</th>
              <th>Status</th>
              <th>Anomaly Confidence</th>
            </tr>
          </thead>
          <tbody>
            ${algorithms.map(algo => `
              <tr>
                <td><strong>${algo.name}</strong><br><span style="font-size: 12px; color: #64748b;">${algo.desc}</span></td>
                <td><span style="color: ${algo.passed ? "#10b981" : "#ef4444"}; font-weight: 700;">${algo.status}</span></td>
                <td>${algo.score}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">Container Metadata Audit</div>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Inspection Result</th>
            </tr>
          </thead>
          <tbody>
            ${metadata.map(item => `
              <tr>
                <td><strong>${item.key}</strong></td>
                <td>${item.value}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          Generated automatically by Opaque Pixel Steganography Intelligence Engine &middot; ${new Date().toLocaleDateString()}
        </div>

        <script>
          window.onload = () => {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
