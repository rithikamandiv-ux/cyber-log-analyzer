import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileType, File as FileIcon, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { logService } from '../services/logService';
import { ProcessingPipeline } from '../components/ui/ProcessingPipeline';

type LogFile = {
  id: number;
  original_name: string;
  file_size: number;
  status: string;
  created_at: string;
};

type UploadState = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

export const UploadPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);
  const [uploadResult, setUploadResult] = useState<{ parsedLogsCount?: number; alertsCreatedCount?: number } | null>(null);
  const [recentUploads, setRecentUploads] = useState<LogFile[]>([]);
  const [error, setError] = useState('');

  const loadRecentUploads = async () => {
    try {
      const data = await logService.getLogs();
      setRecentUploads(data.logFiles || []);
    } catch (err) {
      console.error('Failed to load recent uploads:', err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecentUploads();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadState('idle');
      setError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setUploadState('idle');
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadState('uploading');
    setUploadProgress(0);
    setProcessingStep(0);
    setError('');

    try {
      // Step 0: Uploading
      setProcessingStep(0);

      const result = await logService.uploadFile(file, (percent) => {
        setUploadProgress(percent);
        if (percent >= 100) {
          // Step 1: Parsing
          setProcessingStep(1);
          setUploadState('processing');
        }
      });

      // Simulate processing steps
      setProcessingStep(2); // Detection
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStep(3); // Generating Alerts
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStep(4); // Completed
      setUploadState('completed');
      setUploadResult(result);
      loadRecentUploads();
    } catch (err: unknown) {
      console.error('Upload failed:', err);
      setUploadState('error');
      const errorMsg = err && typeof err === 'object' && 'response' in err 
        ? ((err as Record<string, unknown>).response as { data?: { error?: string } })?.data?.error 
        : null;
      setError(typeof errorMsg === 'string' ? errorMsg : 'Upload failed. Please try again.');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadState('idle');
    setUploadProgress(0);
    setProcessingStep(0);
    setUploadResult(null);
    setError('');
  };

  return (
    <main className="flex-1 overflow-y-auto bg-bg-deepest">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-text-primary">Upload Logs</h1>
          <p className="text-sm text-text-muted mt-1">
            Upload server, auth, or application logs for threat analysis
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Drop Zone */}
          {uploadState === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`relative border-2 border-dashed rounded-[18px] p-14 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-accent bg-accent/5 scale-[1.01]'
                  : 'border-border bg-card hover:border-border-light'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-5 pointer-events-none">
                <div
                  className={`p-5 rounded-2xl transition-colors ${
                    dragActive ? 'bg-accent/15 text-accent' : 'bg-bg-elevated text-text-dim'
                  }`}
                >
                  <UploadCloud className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1.5">
                    Drag & Drop Log Files
                  </h3>
                  <p className="text-sm text-text-muted max-w-sm mx-auto">
                    Upload your server logs, auth logs, or application logs for immediate threat analysis
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-text-dim">
                  <span className="flex items-center gap-1 px-2 py-1 rounded bg-bg-elevated">
                    <FileType className="w-3 h-3" /> .log
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded bg-bg-elevated">
                    <FileType className="w-3 h-3" /> .txt
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded bg-bg-elevated">
                    <FileType className="w-3 h-3" /> .csv
                  </span>
                </div>
              </div>

              <input
                id="upload-input"
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".log,.txt,.csv"
              />
            </motion.div>
          )}

          {/* Selected File */}
          {file && uploadState === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-card border border-border rounded-[18px] p-5 flex items-center justify-between card-glow"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/8 rounded-lg text-accent">
                  <FileIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{file.name}</p>
                  <p className="text-xs text-text-muted">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetUpload}
                  className="p-2 rounded-lg text-text-dim hover:text-critical hover:bg-critical/8 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  id="upload-analyze-btn"
                  onClick={handleUpload}
                  className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-bg-deepest font-semibold text-sm rounded-lg transition-colors"
                >
                  Analyze Now
                </button>
              </div>
            </motion.div>
          )}

          {/* Processing Pipeline */}
          {(uploadState === 'uploading' || uploadState === 'processing' || uploadState === 'completed') && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-card border border-border rounded-[18px] p-8 card-glow"
            >
              <ProcessingPipeline currentStep={processingStep} />

              {uploadState === 'uploading' && (
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-text-muted mb-2">
                    <span>Uploading {file?.name}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {uploadState === 'completed' && uploadResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-success/8 border border-success/20 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium text-success">Analysis Complete</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    Parsed {uploadResult.parsedLogsCount || 0} log entries · Generated{' '}
                    {uploadResult.alertsCreatedCount || 0} alerts
                  </p>
                  <button
                    onClick={resetUpload}
                    className="mt-3 px-4 py-2 bg-accent/10 text-accent text-xs font-medium rounded-lg hover:bg-accent/15 transition-colors"
                  >
                    Upload Another File
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Error */}
          {uploadState === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-critical/8 border border-critical/20 rounded-lg"
            >
              <p className="text-sm text-critical">{error}</p>
              <button
                onClick={resetUpload}
                className="mt-3 px-4 py-2 bg-critical/10 text-critical text-xs font-medium rounded-lg hover:bg-critical/15 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Recent Uploads */}
          {recentUploads.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.25, ease: 'easeOut' }}
              className="mt-10"
            >
              <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-muted" />
                Recent Uploads
              </h2>
              <div className="space-y-2">
                {recentUploads.map((log) => (
                  <div
                    key={log.id}
                    className="bg-card border border-border rounded-lg px-5 py-3.5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-bg-elevated rounded-lg text-text-dim">
                        <FileIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{log.original_name}</p>
                        <p className="text-[10px] text-text-dim">
                          {(log.file_size / 1024).toFixed(1)} KB · {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        log.status === 'completed'
                          ? 'badge-success'
                          : log.status === 'processing'
                          ? 'badge-medium'
                          : 'bg-bg-elevated text-text-muted'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
};
