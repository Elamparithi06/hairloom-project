import React, { useEffect, useState } from 'react';

const Reports = () => {
  const [summary, setSummary] = useState({
    totalSellers: 0,
    totalProducts: 0,
    totalChats: 0,
    dailyActivity: [],
  });

  useEffect(() => {
    // 👇 Replace with API call in real project
    const dummy = {
      totalSellers: 23,
      totalProducts: 78,
      totalChats: 41,
      dailyActivity: [
        { date: '2025-08-01', sellersJoined: 3, productsUploaded: 5 },
        { date: '2025-08-02', sellersJoined: 2, productsUploaded: 8 },
        { date: '2025-08-03', sellersJoined: 4, productsUploaded: 6 },
      ],
    };
    setSummary(dummy);
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Reports</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <ReportCard label="Total Sellers" value={summary.totalSellers} />
        <ReportCard label="Total Products" value={summary.totalProducts} />
        <ReportCard label="Total Chats" value={summary.totalChats} />
      </div>

      <h3 className="text-lg font-semibold mb-2">Seller Activity (Last 3 Days)</h3>
      <div className="bg-white shadow rounded-md overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">New Sellers</th>
              <th className="px-4 py-2">New Products</th>
            </tr>
          </thead>
          <tbody>
            {summary.dailyActivity.map((entry, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2">{entry.sellersJoined}</td>
                <td className="px-4 py-2">{entry.productsUploaded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportCard = ({ label, value }) => (
  <div className="bg-white p-4 shadow rounded-lg text-center">
    <p className="text-lg font-medium">{label}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default Reports;
