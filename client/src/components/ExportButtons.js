import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useRef } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

function ExportButtons({ expenses }) {
  const summaryRef = useRef();
  const pieRef = useRef();
  const barRef = useRef();
  const lineRef = useRef();

  const totalIncome = expenses.filter(e => e.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = expenses.filter(e => e.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const balance = totalIncome - totalExpense;

  const labels = ['Income', 'Expense', 'Balance'];
  const dataValues = [totalIncome, totalExpense, balance];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Amount',
        data: dataValues,
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };

  const exportPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    let y = 15; // Start below top margin

    doc.setFontSize(16);
    doc.text('Expense Tracker Report', 14, y);
    y += 10;

    const maxImgWidth = 180; // mm (A4 width - margins)
    const chartRefs = [summaryRef, pieRef, barRef, lineRef];
    const chartTitles = ['Summary', 'Pie Chart', 'Bar Chart', 'Line Chart'];

    for (let i = 0; i < chartRefs.length; i++) {
      if (chartRefs[i]?.current) {
        const canvas = await html2canvas(chartRefs[i].current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const imgHeight = (imgProps.height * maxImgWidth) / imgProps.width;

        if (y + imgHeight > 290) {
          doc.addPage();
          y = 15;
        }

        doc.setFontSize(12);
        doc.text(chartTitles[i], 14, y);
        y += 5;

        doc.addImage(imgData, 'PNG', 14, y, maxImgWidth, imgHeight);
        y += imgHeight + 10;
      }
    }

    // Add expense table
    autoTable(doc, {
      startY: y,
      head: [['Title', 'Amount', 'Type']],
      body: expenses.map(e => [e.title, `₹ ${e.amount}`, e.type]),
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 }
    });

    doc.save('expense_report.pdf');
  };

  const exportCSV = () => {
    const rows = [['Title', 'Amount', 'Type']];
    expenses.forEach(e => {
      rows.push([e.title, e.amount, e.type]);
    });
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], {
      type: 'text/csv;charset=utf-8;'
    });
    saveAs(blob, 'expense_report.csv');
  };

  return (
    <>
      {/* 🕵️ Hidden Elements for PDF Capture */}
      <div style={{ position: 'absolute', top: '-9999px' }}>
        <div ref={summaryRef} style={{ display: 'flex', gap: '10px', width: '595px', padding: '10px' }}>
          <div style={{ background: '#198754', color: 'white', flex: 1, padding: '10px', borderRadius: '8px' }}>
            <h5>Total Income</h5>
            <h4>₹ {totalIncome}</h4>
          </div>
          <div style={{ background: '#dc3545', color: 'white', flex: 1, padding: '10px', borderRadius: '8px' }}>
            <h5>Total Expense</h5>
            <h4>₹ {totalExpense}</h4>
          </div>
          <div style={{ background: '#0d6efd', color: 'white', flex: 1, padding: '10px', borderRadius: '8px' }}>
            <h5>Balance</h5>
            <h4>₹ {balance}</h4>
          </div>
        </div>

        <div style={{ width: '595px', padding: '10px' }}>
          <div ref={pieRef}><Pie data={chartData} /></div>
          <div ref={barRef}><Bar data={chartData} /></div>
          <div ref={lineRef}><Line data={chartData} /></div>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex gap-2 flex-wrap mt-4">
        <button className="btn btn-outline-secondary" onClick={exportPDF}>
          📄 Export PDF (Charts + Summary)
        </button>
        <button className="btn btn-outline-secondary" onClick={exportCSV}>
          📁 Export CSV
        </button>
      </div>
    </>
  );
}

export default ExportButtons;
