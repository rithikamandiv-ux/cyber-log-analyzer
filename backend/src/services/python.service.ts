import { spawn } from "child_process";
import path from "path";

export interface ParsedLog {
    timestamp: string;
    source_ip: string | null;
    event_type: string;
    severity: string;
    username?: string | null;
    raw_log?: string;
    [key: string]: unknown;
}

export interface ParsedAlert {
    alert_type: string;
    severity: string;
    description: string;
    source_ip?: string | null;
    [key: string]: unknown;
}

export interface ParseAuthLogResult {
    logs: ParsedLog[];
    alerts: ParsedAlert[];
}

const isParsedLog = (value: unknown): value is ParsedLog => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const log = value as Record<string, unknown>;

    return (
        typeof log.timestamp === "string" &&
        (log.source_ip === null || typeof log.source_ip === "string") &&
        typeof log.event_type === "string" &&
        typeof log.severity === "string"
    );
};

const isParsedAlert = (value: unknown): value is ParsedAlert => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const alert = value as Record<string, unknown>;

    return (
        typeof alert.alert_type === "string" &&
        typeof alert.severity === "string" &&
        typeof alert.description === "string"
    );
};

const isParseAuthLogResult = (
    value: unknown
): value is ParseAuthLogResult => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const result = value as Record<string, unknown>;

    return (
        Array.isArray(result.logs) &&
        result.logs.every(isParsedLog) &&
        Array.isArray(result.alerts) &&
        result.alerts.every(isParsedAlert)
    );
};

export const parseAuthLog = (
    filePath: string
): Promise<ParseAuthLogResult> => {
    return new Promise((resolve, reject) => {
        const analysisEnginePath =
            process.env.ANALYSIS_ENGINE_PATH ?? "../analysis-engine";

        const parserPath = path.resolve(
            process.cwd(),
            analysisEnginePath,
            "parser",
            "parse_auth_logs.py"
        );

        const python = spawn("python3", [parserPath, filePath], {
            cwd: process.cwd(),
        });

        let stdout = "";
        let stderr = "";
        let settled = false;

        const rejectOnce = (error: Error): void => {
            if (!settled) {
                settled = true;
                reject(error);
            }
        };

        python.stdout.on("data", (data: Buffer) => {
            stdout += data.toString();
        });

        python.stderr.on("data", (data: Buffer) => {
            stderr += data.toString();
        });

        python.on("error", (error) => {
            rejectOnce(
                new Error(`Unable to start Python parser: ${error.message}`)
            );
        });

        python.on("close", (code) => {
            if (settled) {
                return;
            }

            if (code !== 0) {
                rejectOnce(
                    new Error(
                        `Python parser failed with exit code ${code}: ${stderr.trim()}`
                    )
                );
                return;
            }

            try {
                const parsed: unknown = JSON.parse(stdout);

                if (!isParseAuthLogResult(parsed)) {
                    rejectOnce(
                        new Error(
                            "Python parser returned an invalid response structure."
                        )
                    );
                    return;
                }

                settled = true;
                resolve(parsed);
            } catch (error: unknown) {
                const message =
                    error instanceof Error ? error.message : String(error);

                rejectOnce(
                    new Error(
                        `Invalid JSON returned by Python parser: ${message}. ` +
                        `Parser stderr: ${stderr.trim()}`
                    )
                );
            }
        });
    });
};