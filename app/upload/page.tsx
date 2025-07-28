"use client";

import { axiosInstance } from "@/lib/axios";
import { useState } from "react";

export default function UploadExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState("");
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Por favor selecciona un archivo.");
      setData([]);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fields", fields);

    setMessage("");
    setData([]);

    try {
      const response = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.error) {
        setMessage(`Error: ${response.data.error}`);
        return;
      }

      if (!response.data.data || response.data.data.length === 0) {
        setMessage("No se encontraron datos con ese filtro.");
        return;
      }

      setData(response.data.data);
      setMessage("");
    } catch (error) {
      setMessage("Error al subir el archivo.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-m mt-5">
      <h1 className="text-xl font-semibold mb-4 text-center">Subir archivo Excel</h1>

      <div className="mb-4">
        <label
          htmlFor="file-upload"
          className="inline-block cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {file ? "Cambiar archivo" : "Seleccionar archivo"}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
        {file && (
          <p className="mt-2 text-gray-700 text-sm truncate">{file.name}</p>
        )}
      </div>

      <input
        type="text"
        placeholder="Campos (ej: name,price)"
        value={fields}
        onChange={(e) => setFields(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Subir y Filtrar
      </button>

      {message && (
        <p className="mt-4 text-center text-red-600 font-medium">{message}</p>
      )}

      {data.length > 0 && (
        <div className="mt-6 overflow-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(data[0]).map((key) => (
                  <th
                    key={key}
                    className="border border-gray-300 px-3 py-2 text-left"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="border border-gray-300 px-3 py-2">
                      {value !== undefined && value !== null
                        ? String(value)
                        : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
