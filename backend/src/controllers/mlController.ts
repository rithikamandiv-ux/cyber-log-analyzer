import fs from "fs";
import path from "path";
import { Request, Response } from "express";

export const getMLStatus = async (
    req: Request,
    res: Response
) => {
    try {
        const metadataPath = path.join(
            process.cwd(),
            "../analysis-engine/ml/model_metadata.json"
        );

        const historyPath = path.join(
            process.cwd(),
            "../analysis-engine/ml/training_history.json"
        );

        const metadata = JSON.parse(
            fs.readFileSync(metadataPath, "utf-8")
        );

        const history = JSON.parse(
            fs.readFileSync(historyPath, "utf-8")
        );

        return res.json({
            modelVersion: metadata.model_version,
            trainingSamples: metadata.training_samples,
            lastTrained: metadata.trained_at,
            trainingRuns: history.length,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Failed to load ML status",
        });
    }
};