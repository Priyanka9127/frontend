import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  const headers = ['S No', 'Employee ID', 'Employee Name', 'Department', 'Status'];
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  data.forEach((row, index) => {
    const values = [
      index + 1,
      row.employeeId,
      `"${row.employeeName}"`, // Wrap in quotes to handle commas in names
      row.departmentName,
      row.status,
    ];
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
};

// Helper function to download CSV
const downloadCSV = (csvData, fileName) => {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
};

const AttendanceReport = () => {
  const [report, setReport] = useState(null);
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [dateFilter, setDateFilter] = useState(''); // Default to today
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchReport = async (isAllRecords = false) => {
    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams();
      if (!isAllRecords) {
        query.append('limit', limit);
        query.append('skip', skip);
      }
      if (dateFilter && !isAllRecords) {
        query.append('date', dateFilter);
      }
      const response = await axios.get(
        `https://backems-production.up.railway.app/api/attendance/report?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        const newData = response.data.groupData;
        if (isAllRecords) {
          return newData; // Return data for CSV download
        }
        if (skip === 0) {
          setReport(newData);
        } else {
          setReport((prevData) => ({
            ...prevData,
            ...newData,
          }));
        }
        // Check if there's more data to load (assuming backend returns total)
        const totalRecords = response.data.total || Object.values(newData).flat().length;
        const loadedRecords = skip + limit;
        setHasMore(loadedRecords < totalRecords);
      }
      setLoading(false);
    } catch (error) {
      setError(error.response?.status === 401 ? 'Unauthorized: Please log in again.' : 'Failed to fetch report. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [skip, dateFilter]);

  const handleLoadMore = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  // Download CSV for the selected date
  const handleDownloadDayCSV = () => {
    if (!dateFilter || !report || !report[dateFilter]) {
      alert('Please select a date with available records to download.');
      return;
    }
    const dayRecords = report[dateFilter];
    const csv = convertToCSV(dayRecords);
    downloadCSV(csv, `attendance_${dateFilter}.csv`);
  };

  // Download CSV for all days
  const handleDownloadAllCSV = async () => {
    try {
      const allData = await fetchReport(true); // Fetch all records
      if (!allData || Object.keys(allData).length === 0) {
        alert('No attendance records available to download.');
        return;
      }
      const allRecords = Object.entries(allData).flatMap(([date, records]) =>
        records.map(record => ({
          ...record,
          date,
        }))
      );
      const csv = convertToCSV(allRecords);
      downloadCSV(csv, 'attendance_all_days.csv');
    } catch (error) {
      alert('Failed to download all records. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-primary-white p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-primary-black mb-6">
          Attendance Report
        </h2>

        {/* Filter and Download Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="date-filter" className="text-lg font-semibold text-primary-black">
              Filter by Date:
            </label>
            <input
              id="date-filter"
              type="date"
              className="border-2 border-primary-black rounded-lg px-3 py-2 bg-white text-primary-black focus:outline-none focus:ring-2 focus:ring-primary-red"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setSkip(0);
              }}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadDayCSV}
              className="px-4 py-2 text-white rounded-lg bg-red-600 hover:bg-red-700 transition duration-200 disabled:opacity-50"
              disabled={!dateFilter || !report || !report[dateFilter]}
            >
              Download Day's CSV
            </button>
            <button
              onClick={handleDownloadAllCSV}
              className="px-4 py-2 text-white rounded-lg bg-gray-600 hover:bg-gray-700 transition duration-200"
            >
              Download All Days' CSV
            </button>
          </div>
        </div>

        {/* Error and Loading States */}
        {error && (
          <div className="text-primary-red text-center mb-6">{error}</div>
        )}
        {loading && !report && (
          <div className="text-center text-primary-black">Loading...</div>
        )}

        {/* Report Data */}
        {report && Object.keys(report).length > 0 ? (
          Object.entries(report).map(([date, records]) => (
            <div
              key={date}
              className="mb-8 bg-white rounded-lg shadow-lg p-6 border border-primary-black"
            >
              <h3 className="text-2xl font-semibold text-primary-black mb-4">
                {date}
              </h3>
              {records.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-primary-black text-primary-white">
                        <th className="border border-primary-black p-3 text-left">S No</th>
                        <th className="border border-primary-black p-3 text-left">Employee ID</th>
                        <th className="border border-primary-black p-3 text-left">Employee Name</th>
                        <th className="border border-primary-black p-3 text-left">Department</th>
                        <th className="border border-primary-black p-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((data, index) => (
                        <tr
                          key={data.employeeId}
                          className="hover:bg-gray-100 transition duration-150"
                        >
                          <td className="border border-primary-black p-3">{index + 1}</td>
                          <td className="border border-primary-black p-3">{data.employeeId}</td>
                          <td className="border border-primary-black p-3">{data.employeeName}</td>
                          <td className="border border-primary-black p-3">{data.departmentName}</td>
                          <td className="border border-primary-black p-3">{data.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-primary-black">No attendance records for this date.</div>
              )}
            </div>
          ))
        ) : (
          !loading && (
            <div className="text-center text-primary-black">No data available</div>
          )
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-6">
            <button
              onClick={handleLoadMore}
              disabled={loading || !hasMore}
              className="px-6 py-2 bg-primary-red text-primary-white rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;