/**
 * Client Report PDF Generator
 * Generates a clean, professional, session-isolated PDF audit report.
 */
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateClientReportPdf(auditSession, branding = {}) {
  const { session, template, scoreData, findings, topOpportunities, actionPlan } = auditSession;
  const brandName = branding.agencyName || 'Funnel Audit Scorecard Pro';

  // Create temporary container for rendering the printable report
  const printContainer = document.createElement('div');
  printContainer.id = 'client-pdf-render-target';
  printContainer.style.position = 'fixed';
  printContainer.style.left = '-9999px';
  printContainer.style.top = '0';
  printContainer.style.width = '800px';
  printContainer.style.background = '#080c14';
  printContainer.style.color = '#f8fafc';
  printContainer.style.padding = '40px';
  printContainer.style.fontFamily = "'Plus Jakarta Sans', -apple-system, sans-serif";
  printContainer.style.boxSizing = 'border-box';

  const auditDate = new Date(session.completedAt || session.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const overallScore = Math.round(scoreData.overallScore);
  const classification = scoreData.classification;

  // Build high-impact report HTML
  printContainer.innerHTML = `
    <div style="border-bottom: 2px solid #1e2a42; padding-bottom: 24px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1 style="margin: 0 0 6px; font-size: 24px; font-weight: 800; color: #ffffff;">${brandName}</h1>
        <p style="margin: 0; font-size: 13px; color: #94a3b8;">Website Conversion & Funnel Audit Deliverable</p>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
          ${session.auditType}
        </span>
        <div style="margin-top: 6px; font-size: 12px; color: #64748b;">Date: ${auditDate}</div>
      </div>
    </div>

    <!-- Website Target Banner -->
    <div style="background: #131b2b; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Audited Website</div>
        <div style="font-size: 18px; font-weight: 700; color: #f8fafc; margin-top: 4px;">${session.websiteUrl}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Overall Score</div>
        <div style="font-size: 28px; font-weight: 800; color: ${classification.color}; margin-top: 2px;">
          ${overallScore} <span style="font-size: 16px; color: #64748b;">/ 100</span>
        </div>
      </div>
    </div>

    <!-- Executive Summary -->
    <div style="background: #182236; border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 28px;">
      <h3 style="margin: 0 0 8px; font-size: 15px; color: #818cf8; font-weight: 700;">Executive Conversion Assessment</h3>
      <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #cbd5e1;">
        Status: <strong style="color: ${classification.color};">${classification.label}</strong>. ${classification.description}
      </p>
    </div>

    <!-- Category Breakdown Table -->
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 16px; margin: 0 0 14px; font-weight: 700; color: #f8fafc;">Category Breakdown</h2>
      <table style="width: 100%; border-collapse: collapse; background: #131b2b; border-radius: 8px; overflow: hidden; font-size: 13px;">
        <thead>
          <tr style="background: #1e2a42; text-align: left; color: #94a3b8;">
            <th style="padding: 10px 16px;">Category</th>
            <th style="padding: 10px 16px;">Weight</th>
            <th style="padding: 10px 16px;">Score</th>
            <th style="padding: 10px 16px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${scoreData.categoryScores.map(c => `
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
              <td style="padding: 10px 16px; font-weight: 600; color: #f8fafc;">${c.categoryName}</td>
              <td style="padding: 10px 16px; color: #94a3b8;">${c.weight}%</td>
              <td style="padding: 10px 16px; font-weight: 700; color: #f8fafc;">${Math.round(c.score)} / 100</td>
              <td style="padding: 10px 16px; font-weight: 600; color: ${c.score >= 80 ? '#10b981' : (c.score >= 70 ? '#f59e0b' : '#ef4444')};">
                ${c.score >= 85 ? 'Solid' : (c.score >= 70 ? 'Needs Improvement' : 'Critical Leak')}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Key Findings -->
    ${findings && findings.length > 0 ? `
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; margin: 0 0 14px; font-weight: 700; color: #f8fafc;">High-Priority Conversion Leaks</h2>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${findings.slice(0, 5).map((f, i) => `
            <div style="background: #131b2b; border-left: 4px solid #ef4444; border-radius: 6px; padding: 14px 16px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <strong style="color: #f8fafc; font-size: 13px;">${i + 1}. ${f.criterionName}</strong>
                <span style="color: #ef4444; font-size: 11px; font-weight: 700; text-transform: uppercase;">${f.categoryName}</span>
              </div>
              <p style="margin: 0 0 6px; font-size: 12px; color: #94a3b8;"><strong>Observation:</strong> ${f.observation}</p>
              <p style="margin: 0; font-size: 12px; color: #34d399;"><strong>Recommendation:</strong> ${f.recommendation}</p>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Footer Note -->
    <div style="border-top: 1px solid #1e2a42; padding-top: 16px; margin-top: 40px; font-size: 11px; color: #64748b; text-align: center;">
      Generated via ${brandName} • Independent Client Audit Deliverable • Session ID: ${session.id}
    </div>
  `;

  document.body.appendChild(printContainer);

  try {
    const canvas = await html2canvas(printContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#080c14'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const cleanHost = session.cleanDisplayUrl ? session.cleanDisplayUrl.replace(/[^a-zA-Z0-9]/g, '_') : 'Website';
    pdf.save(`${cleanHost}_Conversion_Audit_Scorecard.pdf`);
    return true;
  } catch (err) {
    console.error('PDF export error:', err);
    // Fallback: trigger print dialog
    window.print();
    return false;
  } finally {
    document.body.removeChild(printContainer);
  }
}
