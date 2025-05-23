import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceReport = () => {
  const [report, setReport] = useState(null);
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [dateFilter, setDateFilter] = useState(''); // Default to today
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams({ limit, skip });
      if (dateFilter) {
        query.append('date', dateFilter);
      }
      const response = await axios.get(
        `http://localhost:5000/api/attendance/report?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        const newData = response.data.groupData;
        if (skip === 0) {
          setReport(newData);
        } else {
          setReport((prevData) => ({
            ...prevData,
            ...newData,
          }));
        }
        // Check if there's more data to load (assuming backend returns total)
        const totalRecords = response.data.total || 0;
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

  const handleLoadmore = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  return (
    <div className="min-h-screen p-10 bg-white">
      <h2 className="text-center text-2xl font-bold">Attendance Report</h2>
      <div>
        <h2 className="text-xl font-semibold">Filter by Date</h2>
        <input
          type="date"
          className="border bg-gray-100"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setSkip(0);
          }}
        />
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : report && Object.keys(report).length > 0 ? (
        Object.entries(report).map(([date, record]) => (
          <div className="mt-4 border-b" key={date}>
            <h2 className="text-xl font-semibold">{date}</h2>
            {record.length > 0 ? (
              <table className="" border="1" cellPadding="10">
                <thead><tr><th className="border p-2">S No</th><th className="border p-2">Employee ID</th><th className="border p-2">Employee Name</th><th className="border p-2">Department</th><th className="border p-2">Status</th></tr></thead>
                <tbody>
                  {record.map((data, index) => (<tr key={data.employeeId}><td className="border p-2">{index + 1}</td><td className="border p-2">{data.employeeId}</td><td className="border p-2">{data.employeeName}</td><td className="border p-2">{data.departmentName}</td><td className="border p-2">{data.status}</td></tr>))}
                </tbody>
              </table>
            ) : (
              <div>No attendance records for this date.</div>
            )}
          </div>
        ))
      ) : (
        <div>No data available</div>
      )}
      <button
        className="px-4 py-2 border bg-gray-100 text-lg font-semibold"
        onClick={handleLoadmore}
        disabled={loading || !hasMore}
      >
        {loading ? 'Loading...' : hasMore ? 'Load More' : 'No More Data'}
      </button>
    </div>
  );
};

export default AttendanceReport;