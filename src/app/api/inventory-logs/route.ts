import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { LogEntry } from "@/types/log-types";
const LOG_FILE_PATH = path.join(process.cwd(), "data", "logs.json");

// Helper function to ensure logs file exists
const ensureLogsFile = () => {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(LOG_FILE_PATH)) {
    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify({ logs: [] }, null, 2));
  }
};

// GET endpoint to fetch logs
export async function GET(request: NextRequest) {
  try {
    ensureLogsFile();
    const fileContent = fs.readFileSync(LOG_FILE_PATH, "utf8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data.logs);
  } catch (error) {
    console.error("Error reading logs:", error);
    return NextResponse.json({ error: "Failed to read logs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Read request body
    const logData = await request.json();

    // Ensure logs file exists
    ensureLogsFile();

    // Read current logs
    const fileContent = fs.readFileSync(LOG_FILE_PATH, "utf8");
    const data = JSON.parse(fileContent);

    // Generate new ID
    const newId =
      data.logs.length > 0
        ? Math.max(...data.logs.map((log: LogEntry) => log.id)) + 1
        : 1;

    // Create new log entry
    const newLog = {
      id: newId,
      ...logData,
      timestamp: logData.timestamp || new Date().toISOString(),
    };

    // Add to logs array
    data.logs.push(newLog);

    // Write back to file
    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(data, null, 2));

    return NextResponse.json(newLog);
  } catch (error) {
    console.error("Error creating log:", error);
    return NextResponse.json(
      { error: "Failed to create log" },
      { status: 500 }
    );
  }
}
