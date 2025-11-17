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
      .catch(() => {
        setError("Failed to fetch scholarship data");
        setLoading(false);
      });
  }, []);

  // Group by year + scheme
  const grouped = scholarships.reduce((acc, item) => {
    const key = `${item.year}-${item.scheme_name}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  if (loading)
    return <p className="text-center mt-10 text-lg font-medium">Loading...</p>;

  if (error)
    return (
      <p className="text-center text-red-600 mt-10 text-lg font-semibold">
        {error}
      </p>
    );

  if (!scholarships.length)
    return (
      <p className="text-center mt-10 text-gray-600 text-lg">
        No scholarship data found.
      </p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        Scholarship Records
      </h1>

      {Object.entries(grouped).map(([key, rows]) => {
        const [year, schemeName] = key.split("-");

        return (
          <div
            key={key}
            className="bg-white shadow-lg rounded-2xl p-6 mb-10 border border-gray-100"
          >
            {/* CARD HEADER */}
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                {schemeName}
              </h2>
              <p className="text-gray-600">Academic Year: {year}</p>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                  <tr>
                    <th className="border px-3 py-3 text-left">Category</th>

                    {["General", "EWS", "SC", "ST", "OBC", "Total"].map(
                      (c, index) => (
                        <th
                          key={index}
                          colSpan="3"
                          className={`border px-3 py-2 text-center ${
                            c === "Total" ? "bg-blue-50 font-semibold" : ""
                          }`}
                        >
                          {c}
                        </th>
                      )
                    )}
                  </tr>

                  {/* SUB HEADERS */}
                  <tr className="bg-gray-50 text-gray-600 text-xs">
                    <th className="border px-2 py-1"></th>
                    {Array(6)
                      .fill()
                      .map((_, i) => (
                        <>
                          <th className="border px-2 py-1">M</th>
                          <th className="border px-2 py-1">F</th>
                          <th className="border px-2 py-1">O</th>
                        </>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition text-center"
                    >
                      <td className="border px-3 py-2 text-left font-medium">
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

                      <td className="bg-blue-50 font-semibold">
                        {row.total_male}
                      </td>
                      <td className="bg-blue-50 font-semibold">
                        {row.total_female}
                      </td>
                      <td className="bg-blue-50 font-semibold">
                        {row.total_trans}
                      </td>
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
