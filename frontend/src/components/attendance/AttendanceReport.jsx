// frontend/src/pages/AttendanceReport.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceReport = () => {
    const [report, setReport] = useState(null);
    const [limit, setLimit] = useState(5);
    const [skip, setSkip] = useState(0);
    const [dateFilter, setDateFilter] = useState(''); // State for the selected date filter
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [downloading, setDownloading] = useState(false); // State for CSV download loading

    // Set today's date as default when component mounts
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        // Format to YYYY-MM-DD for the input type="date" and backend string date matching
        setDateFilter(`${year}-${month}-${day}`);
    }, []); // Run once on mount

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError(null);
            const query = new URLSearchParams({ limit, skip });

            // Only append date if dateFilter is set (not empty string)
            if (dateFilter) {
                query.append('date', dateFilter);
            }

            // console.log("Frontend: Fetching report with URL:", `http://localhost:5000/api/attendance/report?${query.toString()}`); // DEBUG LOG
            const response = await axios.get(
                `http://localhost:5000/api/attendance/report?${query.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            // console.log("Frontend: API Response Data for Report:", response.data); // DEBUG LOG

            if (response.data.success) {
                const newData = response.data.groupData;
                const totalRecords = response.data.total || 0; // Backend's total count

                if (skip === 0) {
                    setReport(newData);
                } else {
                    setReport((prevData) => {
                        const mergedData = { ...prevData };
                        for (const dateKey in newData) {
                            if (mergedData[dateKey]) {
                                // This case typically won't happen if `groupData` only returns
                                // attendance for the current queried date, but for "all dates" it might.
                                // It means merging records for the same date if they came in separate pages.
                                // For simplicity, if a date exists, just replace it with the new full array for that date
                                // or append if pagination is per-date. For now, assuming whole date objects are loaded.
                                mergedData[dateKey] = [...mergedData[dateKey], ...newData[dateKey]];
                            } else {
                                mergedData[dateKey] = newData[dateKey];
                            }
                        }
                        return mergedData;
                    });
                }

                const currentDisplayedCount = Object.values(report || {}).flat().length + Object.values(newData || {}).flat().length;
                setHasMore(currentDisplayedCount < totalRecords);

            } else {
                setError(response.data.message || 'Failed to fetch report.');
                setReport(null);
            }
            setLoading(false);
        } catch (error) {
            console.error("Frontend: Error fetching attendance report:", error.response?.data?.error || error.message);
            setError(error.response?.status === 401 ? 'Unauthorized: Please log in again.' : 'Failed to fetch report. Please try again.');
            setLoading(false);
        }
    };

    const handleLoadmore = () => {
        setSkip((prevSkip) => prevSkip + limit);
    };

    // NEW: Handle "View All Dates" button click
    const handleViewAllDates = () => {
        setDateFilter(''); // Clear the date filter
        setSkip(0); // Reset pagination to the beginning
    };

    // Handle CSV Download
    const handleDownloadCsv = async () => {
        if (!dateFilter) {
            alert('Please select a date to download the report.');
            return;
        }

        try {
            setDownloading(true);
            setError(null);
            const response = await axios.get(
                `http://localhost:5000/api/attendance/download-csv?date=${dateFilter}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    responseType: 'blob',
                }
            );

            const contentType = response.headers['content-type'];
            if (contentType && contentType.includes('application/json')) {
                const reader = new FileReader();
                reader.onload = function() {
                    const errorData = JSON.parse(reader.result);
                    console.error("Backend Error on CSV Download:", errorData);
                    setError(errorData.error || errorData.message || 'Failed to download CSV: No data found for the selected date.');
                };
                reader.readAsText(response.data);
                setDownloading(false);
                return;
            }

            const blob = new Blob([response.data], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `attendance_report_${dateFilter}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);

            setDownloading(false);
        } catch (downloadError) {
            console.error('Frontend: CSV download error:', downloadError);
            setError('Failed to download CSV report. Please try again. Network or Server error.');
            setDownloading(false);
        }
    };

    // Effect to fetch report when skip or dateFilter changes
    useEffect(() => {
        fetchReport();
    }, [skip, dateFilter]);


    return (
        <div className="min-h-screen p-10 bg-white">
            <h2 className="text-center text-2xl font-bold">Attendance Report</h2>
            <div className="mt-6 mb-6 flex items-center space-x-4">
                <h2 className="text-xl font-semibold">Filter by Date:</h2>
                <input
                    type="date"
                    className="border bg-gray-100 p-2 rounded"
                    value={dateFilter}
                    onChange={(e) => {
                        setDateFilter(e.target.value);
                        setSkip(0); // Reset skip when date filter changes
                    }}
                />
                <button
                    onClick={handleDownloadCsv}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={downloading || !dateFilter}
                >
                    {downloading ? 'Downloading...' : 'Download CSV'}
                </button>
                {/* NEW: Button to view all dates */}
                <button
                    onClick={handleViewAllDates}
                    className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                    disabled={loading} // Disable if already loading
                >
                    View All Dates
                </button>
            </div>
            {error && <div className="text-red-500 mt-4">{error}</div>}
            {loading ? (
                <div className="text-gray-700">Loading...</div>
            ) : report && Object.keys(report).length > 0 ? (
                // Sort dates in descending order for display
                Object.entries(report)
                      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                      .map(([date, record]) => (
                    <div className="mt-4 border-b pb-4" key={date}>
                        <h2 className="text-xl font-semibold mb-2">{date}</h2>
                        {record.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300" cellPadding="10">
                                    <thead>
                                        <tr>
                                            <th className="border p-2 bg-gray-200 text-left text-sm font-semibold">S No</th>
                                            <th className="border p-2 bg-gray-200 text-left text-sm font-semibold">Employee ID</th>
                                            <th className="border p-2 bg-gray-200 text-left text-sm font-semibold">Employee Name</th>
                                            <th className="border p-2 bg-gray-200 text-left text-sm font-semibold">Department</th>
                                            <th className="border p-2 bg-gray-200 text-left text-sm font-semibold">Status</th>
                                            <th className="border p-2 bg-gray-200 text-left text-sm font-semibold">Check-in</th>
                                            <th className="border p-2 bg-gray-200 text-left text-sm font-semibold">Check-out</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {record.map((data, index) => (
                                            <tr key={data.employeeId || index} className="hover:bg-gray-50">
                                                <td className="border p-2 text-sm">{index + 1}</td>
                                                <td className="border p-2 text-sm">{data.employeeId}</td>
                                                <td className="border p-2 text-sm">{data.employeeName}</td>
                                                <td className="border p-2 text-sm">{data.departmentName}</td>
                                                <td className="border p-2 text-sm">{data.status}</td>
                                                <td className="border p-2 text-sm">{data.checkIn ? new Date(data.checkIn).toLocaleTimeString() : 'N/A'}</td>
                                                <td className="border p-2 text-sm">{data.checkOut ? new Date(data.checkOut).toLocaleTimeString() : 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-gray-600">No attendance records for this date.</div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-gray-600">No data available</div>
            )}
            <button
                className="mt-6 px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={handleLoadmore}
                disabled={loading || !hasMore}
            >
                {loading ? 'Loading...' : hasMore ? 'Load More' : 'No More Data'}
            </button>
        </div>
    );
};

export default AttendanceReport;