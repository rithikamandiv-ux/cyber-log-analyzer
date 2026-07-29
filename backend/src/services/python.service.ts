import { spawn } from "child_process";

export const parseAuthLog = (
    filePath: string
): Promise<{
    logs: any[];
    alerts: any[];
}> => {
    return new Promise((resolve, reject) => {
        const python = spawn(
            "python3",
            [
                "../analysis-engine/parser/parse_auth_logs.py",
                filePath,
            ],
            {
                cwd: process.cwd(),
            }
        );

        let stdout = "";
        let stderr = "";

        python.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        python.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        python.on("close", (code) => {
            if (code !== 0) {
                reject(
                    new Error(
                        `Python parser failed (${code}): ${stderr}`
                    )
                );
                return;
            }

            try {
                const parsed = JSON.parse(stdout);
                resolve(parsed);
            } catch (error) {
                reject(
                    new Error(
                        `Invalid JSON from parser: ${error}`
                    )
                );
            }
        });
    });
};