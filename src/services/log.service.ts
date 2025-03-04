import { LogEntry, LogFilterOptions } from "@/types/log-types";

class LogService {
  /**
   * Get all logs
   * @returns {Promise<LogEntry[]>} All logs
   */
  static async getLogs(options?: LogFilterOptions): Promise<LogEntry[]> {
    try {
      const response = await fetch("/api/inventory-logs");
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      let logs = await response.json();

      // Apply client-side filtering if options are provided
      if (options) {
        if (options.module) {
          logs = logs.filter(
            (log: LogEntry) =>
              log.module.toLowerCase() === options.module!.toLowerCase()
          );
        }

        if (options.action) {
          logs = logs.filter(
            (log: LogEntry) =>
              log.action.toLowerCase() === options.action!.toLowerCase()
          );
        }

        if (options.startDate && options.endDate) {
          const startDate = new Date(options.startDate);
          const endDate = new Date(options.endDate);

          logs = logs.filter((log: LogEntry) => {
            const logDate = new Date(log.timestamp);
            return logDate >= startDate && logDate <= endDate;
          });
        }
      }

      // Sort by timestamp (newest first)
      logs.sort((a: LogEntry, b: LogEntry) => {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });

      return logs;
    } catch (error) {
      console.error("Error getting logs:", error);
      return [];
    }
  }

  /**
   * Create a new log entry
   * @param {Omit<LogEntry, 'id'>} logData - Log data
   * @returns {Promise<LogEntry>} Created log entry
   */
  static async createLog(logData: Omit<LogEntry, "id">): Promise<LogEntry> {
    try {
      // Ensure timestamp is a string
      const timestamp =
        logData.timestamp instanceof Date
          ? logData.timestamp.toISOString()
          : logData.timestamp || new Date().toISOString();

      // Prepare the data
      const data = {
        ...logData,
        timestamp,
      };

      // Make API request
      const response = await fetch("/api/inventory-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create log");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating log:", error);
      // Return a mock response if we couldn't save it
      return {
        id: -1,
        ...logData,
        timestamp:
          typeof logData.timestamp === "string"
            ? logData.timestamp
            : logData.timestamp?.toISOString() || new Date().toISOString(),
      };
    }
  }
}

export default LogService;
