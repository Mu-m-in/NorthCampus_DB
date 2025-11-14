import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/scholarships/")
      .then((res) => {
        setScholarships(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch scholarship data");
        setLoading(false);
      });
  }, []);

  // Group data by Year and Scheme Name
  const grouped = scholarships.reduce((acc, item) => {
    const key = `${item.year}-${item.scheme_name}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  if (loading) return <p className="text-center mt-5">Loading data...</p>;
  if (error) return <p className="text-center text-red-500 mt-5">{error}</p>;
  if (!scholarships.length)
    return <p className="text-center mt-5">No scholarship data found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Scholarship Records
      </h1>

      {Object.entries(grouped).map(([key, rows]) => {
        const [year, schemeName] = key.split("-");
        return (
          <div
            key={key}
            className="bg-white shadow-md rounded-2xl p-5 mb-10 border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              Scheme: <span className="text-blue-600">{schemeName}</span>
            </h2>
            <p className="text-gray-600 mb-4">Academic Year: {year}</p>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-left">Category</th>
                    <th colSpan="3" className="border border-gray-300 px-3 py-2 text-center">General</th>
                    <th colSpan="3" className="border border-gray-300 px-3 py-2 text-center">EWS</th>
                    <th colSpan="3" className="border border-gray-300 px-3 py-2 text-center">SC</th>
                    <th colSpan="3" className="border border-gray-300 px-3 py-2 text-center">ST</th>
                    <th colSpan="3" className="border border-gray-300 px-3 py-2 text-center">OBC</th>
                    <th colSpan="3" className="border border-gray-300 px-3 py-2 text-center bg-gray-50">Total</th>
                  </tr>
                  <tr className="bg-gray-50 text-xs text-gray-600">
                    <th className="border border-gray-300 px-2 py-1"></th>
                    <th>M</th><th>F</th><th>O</th>
                    <th>M</th><th>F</th><th>O</th>
                    <th>M</th><th>F</th><th>O</th>
                    <th>M</th><th>F</th><th>O</th>
                    <th>M</th><th>F</th><th>O</th>
                    <th>M</th><th>F</th><th>O</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="text-center hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 font-medium text-left">
                        {row.category}
                      </td>
                      <td>{row.general_male}</td>
                      <td>{row.general_female}</td>
                      <td>{row.general_trans}</td>

                      <td>{row.ews_male}</td>
                      <td>{row.ews_female}</td>
                      <td>{row.ews_trans}</td>

                      <td>{row.sc_male}</td>
                      <td>{row.sc_female}</td>
                      <td>{row.sc_trans}</td>

                      <td>{row.st_male}</td>
                      <td>{row.st_female}</td>
                      <td>{row.st_trans}</td>

                      <td>{row.obc_male}</td>
                      <td>{row.obc_female}</td>
                      <td>{row.obc_trans}</td>

                      <td className="bg-gray-50 font-semibold">{row.total_male}</td>
                      <td className="bg-gray-50 font-semibold">{row.total_female}</td>
                      <td className="bg-gray-50 font-semibold">{row.total_trans}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViewScholarships;
