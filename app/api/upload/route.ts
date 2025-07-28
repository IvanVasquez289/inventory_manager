import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fields = (formData.get("fields") as string)
      ?.split(",")
      .map((f) => f.trim());

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    let filteredData = jsonData;

    if (fields && fields.length > 0) {
      filteredData = jsonData.map((row) => {
        const filteredRow: any = {};
        for (const field of fields) {
          if (row[field] !== undefined) {
            filteredRow[field] = row[field];
          }
        }
        return filteredRow;
      });
    }

    return NextResponse.json({ data: filteredData });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
