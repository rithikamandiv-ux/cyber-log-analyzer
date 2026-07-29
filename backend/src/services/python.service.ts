import { spawn } from "child_process";
import path from "path";

interface ParsedLog {
    [key: string]: unknown;
}

interface ParsedAlert {
    [key: string]: unknown;
}

interface ParseAuthLogResult {
    logs: ParsedLog[];
    alerts: ParsedAlert[];
}

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

        python.stdout.on("data", (data: Buffer) => {
            stdout += data.toString();
        });

        python.stderr.on("data", (data: Buffer) => {
            stderr += data.toString();
        });

        python.on("error", (error) => {
            reject(
                new Error(`Unable to start Python parser: ${error.message}`)
            );
        });

        python.on("close", (code) => {
            if (code !== 0) {
                reject(
                    new Error(
                        `Python parser failed with exit code ${code}: ${stderr.trim()}`
                    )
                );
                return;
            }

            try {
                const parsed = JSON.parse(stdout) as ParseAuthLogResult;

                if (!Array.isArray(parsed.logs) || !Array.isArray(parsed.alerts)) {
                    reject(
                        new Error(
                            "Python parser returned an invalid response structure."
                        )
                    );
                    return;
                }

                resolve(parsed);
            } catch (error: unknown) {
                const message =
                    error instanceof Error ? error.message : String(error);

                reject(
                    new Error(
                        `Invalid JSON returned by Python parser: ${message}. ` +
                        `Parser stderr: ${stderr.trim()}`
                    )
                );
            }
        });
    });
};