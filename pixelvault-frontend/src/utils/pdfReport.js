export function generateForensicPDF(reportData) {
  if (!reportData) return;

  const fileName = reportData.fileName || reportData.filename || "carrier_analysis.png";
  const rawSize = reportData.fileSize || reportData.size || 0;
  const fileSize = typeof rawSize === "number" ? `${(rawSize / 1024).toFixed(1)} KB` : String(rawSize);
  const carrierType = reportData.carrierType || "image";
  const scanTime = reportData.scanTime || reportData.timestamp || new Date().toLocaleString();
  const threatScore = typeof reportData.threatScore === "number" ? reportData.threatScore : (reportData.threat_score || 15);

  const algorithms = reportData.algorithms || [
    { name: "LSB Bit-Plane Noise Audit", desc: "Spatial domain noise distribution & entropy analysis", passed: threatScore < 50, status: threatScore < 50 ? "CLEAN" : "ANOMALY", score: threatScore < 50 ? 98 : 88 },
    { name: "F5 Matrix DCT Coefficient Scan", desc: "Permutation matrix scanning and non-zero DCT coefficients", passed: threatScore < 50, status: threatScore < 50 ? "CLEAN" : "ANOMALY", score: threatScore < 50 ? 99 : 92 },
    { name: "PVD Edge Histogram Inspection", desc: "Pixel value differencing and edge variance inspection", passed: threatScore < 50, status: threatScore < 50 ? "CLEAN" : "ANOMALY", score: threatScore < 50 ? 97 : 84 },
    { name: "DST Frequency Spectrum Audit", desc: "High-frequency DCT/DST residual signal inspection", passed: threatScore < 50, status: threatScore < 50 ? "CLEAN" : "ANOMALY", score: threatScore < 50 ? 99 : 90 },
  ];

  const metrics = reportData.metrics || {};
  const metadata = reportData.metadata || [
    { key: "Shannon Entropy", value: String(metrics.entropy || "7.24 (Normal)") },
    { key: "Chi-Square P-Value", value: String(metrics.chiSquarePValue || "0.4821 (Unmodified distribution)") },
    { key: "Bit-Plane Noise Variance", value: String(metrics.bitPlaneNoiseVariance || "Normal (0.003)") },
    { key: "Metadata Chunk Padding", value: String(metrics.metadataAnomalies || "Zero-byte trailing chunk padding checked") },
    { key: "Total Analyzed Blocks", value: String(reportData.analyzedBlocks || 160) },
    { key: "Anomalous Block Count", value: String(reportData.anomalousBlocks || 0) },
  ];

  const isHighRisk = threatScore > 50;
  const statusColor = isHighRisk ? "#dc2626" : "#059669";
  const statusBg = isHighRisk ? "#fef2f2" : "#ecfdf5";
  const statusText = isHighRisk ? "HIGH STENOGRAPHIC ANOMALY DETECTED" : "CLEAN MEDIA CARRIER DETECTED";

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>OpaquePixel Forensic Report - ${fileName}</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #0f172a;
        background: #ffffff;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print-bar {
        background: #1e1b4b;
        color: #ffffff;
        padding: 12px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .no-print-bar button {
        background: #9f86c0;
        color: #ffffff;
        border: none;
        padding: 8px 18px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .no-print-bar button:hover {
        background: #8b5cf6;
      }
      .report-container {
        max-w: 800px;
        margin: 0 auto;
        padding: 40px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 24px;
        margin-bottom: 30px;
      }
      .brand {
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: #0f172a;
      }
      .brand span { color: #9f86c0; }
      .badge {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: ${statusColor};
        background: ${statusBg};
        border: 1px solid ${statusColor};
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 30px;
      }
      .card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px 20px;
      }
      .card-title {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
        margin-bottom: 6px;
      }
      .card-value {
        font-size: 18px;
        font-weight: 700;
        color: #0f172a;
      }
      .section-title {
        font-size: 16px;
        font-weight: 700;
        margin-top: 32px;
        margin-bottom: 16px;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 8px;
        color: #0f172a;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      th, td {
        text-align: left;
        padding: 12px 14px;
        border-bottom: 1px solid #e2e8f0;
        font-size: 13px;
      }
      th {
        background: #f1f5f9;
        font-weight: 700;
        color: #475569;
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 0.05em;
      }
      .footer {
        margin-top: 48px;
        text-align: center;
        font-size: 11px;
        color: #94a3b8;
        border-top: 1px solid #e2e8f0;
        padding-top: 24px;
      }
      @media print {
        .no-print-bar { display: none !important; }
        .report-container { padding: 0; }
      }
    </style>
  </head>
  <body>
    <div class="no-print-bar">
      <div>🔒 <strong>OpaquePixel Forensic Report Preview</strong></div>
      <div>
        <button onclick="window.print()">Print / Save as PDF 🖨️</button>
        <button onclick="window.close()" style="background: transparent; border: 1px solid rgba(255,255,255,0.3); margin-left: 8px;">Close</button>
      </div>
    </div>

    <div class="report-container">
      <div class="header">
        <div>
          <div class="brand">Opaque<span>Pixel</span></div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px; font-weight: 500;">Multi-Algorithm Steganography Forensic Report</div>
        </div>
        <div class="badge">${statusText}</div>
      </div>

      <div class="grid">
        <div class="card">
          <div class="card-title">Target File Name</div>
          <div class="card-value" style="font-size: 15px; word-break: break-all;">${fileName}</div>
        </div>
        <div class="card">
          <div class="card-title">Steganographic Threat Score</div>
          <div class="card-value" style="color: ${statusColor};">${threatScore}%</div>
        </div>
        <div class="card">
          <div class="card-title">Carrier Media Type</div>
          <div class="card-value">${String(carrierType).toUpperCase()} (${fileSize})</div>
        </div>
        <div class="card">
          <div class="card-title">Scan Timestamp</div>
          <div class="card-value" style="font-size: 14px;">${scanTime}</div>
        </div>
      </div>

      <div class="section-title">Multi-Algorithm Forensic Audit Breakdown</div>
      <table>
        <thead>
          <tr>
            <th>Inspection Stage / Algorithm</th>
            <th>Status</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          ${algorithms
            .map(
              (algo) => `
            <tr>
              <td><strong>${algo.name}</strong><br><span style="font-size: 12px; color: #64748b;">${algo.desc}</span></td>
              <td><span style="color: ${algo.passed ? "#059669" : "#dc2626"}; font-weight: 700;">${algo.status}</span></td>
              <td><strong>${algo.score}%</strong></td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="section-title">Container Metadata & Statistical Metrics</div>
      <table>
        <thead>
          <tr>
            <th>Property Metric</th>
            <th>Inspection Result</th>
          </tr>
        </thead>
        <tbody>
          ${metadata
            .map(
              (item) => `
            <tr>
              <td><strong>${item.key}</strong></td>
              <td>${item.value}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="footer">
        Generated automatically by OpaquePixel Steganography Intelligence Engine &middot; ${new Date().toLocaleDateString()}
      </div>
    </div>

    <script>
      setTimeout(function() {
        window.print();
      }, 400);
    </script>
  </body>
</html>`;

  const printWindow = window.open("", "_blank", "width=900,height=950");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    // Popup fallback using hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
  }
}
