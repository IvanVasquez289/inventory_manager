// pages/api/upload-excel.js o app/api/upload-excel/route.js
import * as XLSX from 'xlsx';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable();
    
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing file' });
      }

      const file = files.excel;
      const workbook = XLSX.readFile(file.filepath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      res.status(200).json({ data: jsonData });
    });
  }
}