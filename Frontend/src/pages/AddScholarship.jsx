import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

const GROUPS = ["General", "EWS", "SC", "ST", "OBC"];
const GENDERS = ["Male", "Female", "Trans"];
const ROWS = [
  { label: "Total", code: "TOTAL" },
  { label: "PWD", code: "PWD" },
  { label: "Muslim Minority", code: "MUSLIM_MINORITY" },
  { label: "Other Minority", code: "OTHER_MINORITY" },
];

const zeroCounts = () =>
  ROWS.reduce((acc, row) => {
    acc[row.label] = GROUPS.reduce((gAcc, grp) => {
      gAcc[grp] = { Male: 0, Female: 0, Trans: 0 };
      return gAcc;
    }, {});
    return acc;
  }, {});

function AddScholarship() {
  const [schemeName, setSchemeName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [counts, setCounts] = useState(zeroCounts());
  const [mode, setMode] = useState("add");
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch distinct existing scholarships for dropdown
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/scholarships/")
      .then((res) => {
        const unique = [
          ...new Map(
            res.data.map((i) => [i.scheme_name + "-" + i.year, i])
          ).values(),
        ];
        setAvailable(unique);
      })
      .catch(() => setAvailable([]));
  }, []);

  // Compute totals
  const rowTotals = useMemo(() => {
    const out = {};
    for (const row of ROWS.map((r) => r.label)) {
      out[row] = { Male: 0, Female: 0, Trans: 0, grand: 0 };
      for (const grp of GROUPS) {
        for (const g of GENDERS) {
          const v = Number(counts[row][grp][g] || 0);
          out[row][g] += v;
          out[row].grand += v;
        }
      }
    }
    return out;
  }, [counts]);

  // Input handler
  const handleInput = (rowLabel, grp, gender, value) => {
    let val = value === "" ? "" : Number(value);
    if (val !== "" && (isNaN(val) || val < 0)) return;
    setCounts((prev) => ({
      ...prev,
      [rowLabel]: {
        ...prev[rowLabel],
        [grp]: { ...prev[rowLabel][grp], [gender]: val === "" ? "" : Number(val) },
      },
    }));
  };

  // Build payload for one row
  const buildPayloadForRow = (rowLabel, rowCode) => {
    const p = {};
    for (const grp of GROUPS) {
      for (const gen of GENDERS) {
        const keyBase = grp.toLowerCase();
        const genKey = gen === "Trans" ? "trans" : gen.toLowerCase();
        p[`${keyBase}_${genKey}`] = Number(counts[rowLabel][grp][gen] || 0);
      }
    }
    p.category = rowCode;
    p.total_male = GROUPS.reduce((a, g) => a + (Number(counts[rowLabel][g]["Male"]) || 0), 0);
    p.total_female = GROUPS.reduce((a, g) => a + (Number(counts[rowLabel][g]["Female"]) || 0), 0);
    p.total_trans = GROUPS.reduce((a, g) => a + (Number(counts[rowLabel][g]["Trans"]) || 0), 0);
    p.scheme_name = schemeName;
    p.year = year;
    return p;
  };

  // Load existing data for edit
  const loadExisting = async (scheme, yr) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/api/scholarships?scheme=${encodeURIComponent(
          scheme
        )}&year=${yr}`
      );
      const rows = res.data;
      if (!rows.length) {
        setMessage({ type: "error", text: "No data found for that scheme/year." });
        setLoading(false);
        return;
      }
      const updated = zeroCounts();
      for (const row of rows) {
        const r = ROWS.find((r) => r.code === row.category);
        if (!r) continue;
        for (const grp of GROUPS) {
          for (const gen of GENDERS) {
            const key = `${grp.toLowerCase()}_${gen === "Trans" ? "trans" : gen.toLowerCase()}`;
            updated[r.label][grp][gen] = row[key];
          }
        }
      }
      setCounts(updated);
      setSchemeName(scheme);
      setYear(yr);
      setMode("edit");
      setMessage({ type: "success", text: "Loaded existing data for editing." });
    } catch {
      setMessage({ type: "error", text: "Failed to load scholarship data." });
    } finally {
      setLoading(false);
    }
  };

  // Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const requests = ROWS.map((r) => {
        const payload = buildPayloadForRow(r.label, r.code);
        return mode === "edit"
          ? axios.put("http://127.0.0.1:5000/api/scholarships/", payload)
          : axios.post("http://127.0.0.1:5000/api/scholarships/", payload);
      });
      await Promise.all(requests);
      setMessage({
        type: "success",
        text: mode === "edit" ? "Updated successfully." : "Saved successfully.",
      });
    } catch (err) {;
      setMessage({ type: "error", text: "Save failed: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Scholarship Matrix ({mode === "edit" ? "Edit" : "Add"})
      </h2>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <select
          className="border p-2 rounded"
          onChange={(e) => {
            const [scheme, yr] = e.target.value.split("::");
            if (scheme && yr) loadExisting(scheme, yr);
          }}
        >
          <option value="">-- Select Existing Scholarship --</option>
          {available.map((i) => (
            <option key={i.scheme_name + i.year} value={`${i.scheme_name}::${i.year}`}>
              {i.scheme_name} ({i.year})
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setMode("add");
            setSchemeName("");
            setCounts(zeroCounts());
            setMessage(null);
          }}
          className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
        >
          New Entry
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-4 items-center">
          <input
            type="text"
            placeholder="Scholarship Scheme Name"
            value={schemeName}
            onChange={(e) => setSchemeName(e.target.value)}
            className="border p-2 rounded flex-1"
            required
          />
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-28 border p-2 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : mode === "edit" ? "Update" : "Save"}
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded mb-4 ${
              message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Category</th>
                {GROUPS.map((grp) => (
                  <th key={grp} colSpan="3" className="border p-2">
                    {grp}
                  </th>
                ))}
                <th colSpan="4" className="border p-2">Totals</th>
              </tr>
              <tr>
                <th></th>
                {GROUPS.map(() =>
                  GENDERS.map((g) => (
                    <th key={g} className="border p-1 font-normal">{g}</th>
                  ))
                )}
                {["Male", "Female", "Trans", "Grand"].map((t) => (
                  <th key={t} className="border p-1 font-normal">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <td className="border p-2 font-semibold">{row.label}</td>
                  {GROUPS.map((grp) =>
                    GENDERS.map((g) => (
                      <td key={grp + g} className="border p-1">
                        <input
                          type="number"
                          min="0"
                          value={counts[row.label][grp][g]}
                          onChange={(e) =>
                            handleInput(row.label, grp, g, e.target.value)
                          }
                          className="w-16 border rounded p-1 text-center"
                        />
                      </td>
                    ))
                  )}
                  {["Male", "Female", "Trans"].map((g) => (
                    <td key={g} className="border p-1 text-center bg-gray-50">
                      {rowTotals[row.label][g]}
                    </td>
                  ))}
                  <td className="border p-1 text-center bg-gray-100 font-bold">
                    {rowTotals[row.label].grand}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
}

export default AddScholarship;