import { useEffect, useRef, useState } from 'react'
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiFileText,
  FiImage,
  FiLoader,
  FiRefreshCw,
  FiShield,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi'
import toast from 'react-hot-toast'

import { useAuth } from '../../context/AuthContext'
import { analyzeScan } from '../../services/scanService'
import { extractTextFromImage } from '../../services/ocrService'

const MAX_FILE_SIZE = 5 * 1024 * 1024

export default function UploadScreenshot() {
  const { user } = useAuth()

  const fileInputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [dragging, setDragging] = useState(false)

  const [ocrLoading, setOcrLoading] =
    useState(false)

  const [ocrProgress, setOcrProgress] =
    useState(0)

  const [ocrStatus, setOcrStatus] =
    useState('')

  const [extractedText, setExtractedText] =
    useState('')

  const [analysisLoading, setAnalysisLoading] =
    useState(false)

  const [result, setResult] =
    useState(null)

  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      return false
    }

    if (!selectedFile.type.startsWith('image/')) {
      toast.error(
        'Please select a valid image file.',
      )

      return false
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(
        'Image must be smaller than 5 MB.',
      )

      return false
    }

    return true
  }

  const selectFile = (selectedFile) => {
    if (!validateFile(selectedFile)) {
      return
    }

    if (preview) {
      URL.revokeObjectURL(preview)
    }

    const objectUrl =
      URL.createObjectURL(selectedFile)

    setFile(selectedFile)
    setPreview(objectUrl)

    setExtractedText('')
    setResult(null)
    setError('')
    setOcrProgress(0)
    setOcrStatus('')
  }

  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files?.[0]

    if (selectedFile) {
      selectFile(selectedFile)
    }

    event.target.value = ''
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)

    const droppedFile =
      event.dataTransfer.files?.[0]

    if (droppedFile) {
      selectFile(droppedFile)
    }
  }

  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }

    setFile(null)
    setPreview('')
    setExtractedText('')
    setResult(null)
    setError('')
    setOcrProgress(0)
    setOcrStatus('')
  }

  const runOCR = async () => {
    if (!file) {
      toast.error(
        'Please upload a screenshot first.',
      )
      return
    }

    try {
      setOcrLoading(true)
      setOcrProgress(0)
      setOcrStatus('Starting OCR...')
      setExtractedText('')
      setResult(null)
      setError('')

      const text =
        await extractTextFromImage(
          file,
          ({ status, progress }) => {
            setOcrStatus(status)
            setOcrProgress(progress)
          },
        )

      setExtractedText(text)

      setOcrProgress(100)
      setOcrStatus('Text extraction complete.')

      toast.success(
        'Text extracted successfully.',
      )
    } catch (err) {
      console.error(err)

      const message =
        err?.message ||
        'Unable to extract text from the screenshot.'

      setError(message)
      toast.error(message)
    } finally {
      setOcrLoading(false)
    }
  }

  const analyzeExtractedText = async () => {
    if (!extractedText.trim()) {
      toast.error(
        'There is no text to analyze.',
      )
      return
    }

    try {
      setAnalysisLoading(true)
      setResult(null)
      setError('')

      const analysis = await analyzeScan(
        user.uid,
        extractedText,
        'screenshot',
      )

      setResult(analysis)

      toast.success(
        'Screenshot analyzed with Gemini AI.',
      )
    } catch (err) {
      console.error(err)

      const message =
        err?.message ||
        'Unable to analyze the extracted text.'

      setError(message)
      toast.error(message)
    } finally {
      setAnalysisLoading(false)
    }
  }

  const resetAll = () => {
    removeFile()
  }

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            OCR + AI Detection
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Upload Screenshot
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Upload a screenshot of a suspicious SMS,
            WhatsApp message, email, or notification.
            ScamShield will extract the text and analyze
            it with AI.
          </p>
        </div>

        {!file ? (
          <UploadArea
            dragging={dragging}
            setDragging={setDragging}
            onDrop={handleDrop}
            onBrowse={() =>
              fileInputRef.current?.click()
            }
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-5">
            <div className="xl:col-span-2">
              <ImagePreview
                file={file}
                preview={preview}
                onRemove={removeFile}
              />
            </div>

            <div className="space-y-6 xl:col-span-3">
              {!extractedText &&
              !ocrLoading ? (
                <OCRStartCard
                  onStart={runOCR}
                />
              ) : (
                <OCRCard
                  loading={ocrLoading}
                  progress={ocrProgress}
                  status={ocrStatus}
                  text={extractedText}
                  setText={setExtractedText}
                  onStart={runOCR}
                  onAnalyze={analyzeExtractedText}
                  analyzing={analysisLoading}
                />
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                  {error}
                </div>
              )}

              {result && (
                <ScanResult result={result} />
              )}

              <button
                type="button"
                onClick={resetAll}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <FiRefreshCw className="h-4 w-4" />
                Start another screenshot scan
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function UploadArea({
  dragging,
  setDragging,
  onDrop,
  onBrowse,
  fileInputRef,
  onFileChange,
}) {
  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(event) => {
        event.preventDefault()
        setDragging(false)
      }}
      onDrop={onDrop}
      className={`flex min-h-[480px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
        dragging
          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
          : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900'
      }`}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <FiUploadCloud className="h-9 w-9" />
      </div>

      <h2 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
        Upload a screenshot
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        Drag and drop an image here, or select one
        from your computer. ScamShield uses OCR to
        extract the message text.
      </p>

      <button
        type="button"
        onClick={onBrowse}
        className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
      >
        <FiImage className="h-4 w-4" />
        Choose Screenshot
      </button>

      <p className="mt-4 text-xs text-slate-400">
        PNG, JPG, JPEG, WEBP • Maximum 5 MB
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  )
}

function ImagePreview({
  file,
  preview,
  onRemove,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Screenshot
          </p>

          <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
            {file.name}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
          aria-label="Remove screenshot"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-[450px] items-center justify-center bg-slate-950 p-4">
        <img
          src={preview}
          alt="Uploaded screenshot"
          className="max-h-[600px] max-w-full rounded-lg object-contain"
        />
      </div>

      <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">
            File size
          </span>

          <span className="font-medium text-slate-700 dark:text-slate-300">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      </div>
    </div>
  )
}

function OCRStartCard({ onStart }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
          <FiFileText className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Extract text with OCR
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tesseract.js will read the screenshot locally.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          The screenshot is processed in your browser.
          Once text is extracted, you can review or edit
          it before sending it to ScamShield AI.
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
      >
        <FiFileText className="h-4 w-4" />
        Extract Text
      </button>
    </div>
  )
}

function OCRCard({
  loading,
  progress,
  status,
  text,
  setText,
  onStart,
  onAnalyze,
  analyzing,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
            {loading ? (
              <FiLoader className="h-5 w-5 animate-spin" />
            ) : (
              <FiFileText className="h-5 w-5" />
            )}
          </div>

          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              {loading
                ? 'Extracting text...'
                : 'Extracted text'}
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {loading
                ? status || 'Processing image...'
                : 'Review the text before AI analysis.'}
            </p>
          </div>
        </div>

        {!loading && (
          <button
            type="button"
            onClick={onStart}
            className="text-xs font-medium text-blue-500 hover:text-blue-400"
          >
            Run OCR again
          </button>
        )}
      </div>

      {loading && (
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-slate-500">
              OCR progress
            </span>

            <span className="font-semibold text-blue-500">
              {progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {!loading && (
        <>
          <textarea
            value={text}
            onChange={(event) =>
              setText(event.target.value)
            }
            rows={12}
            className="mt-6 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            placeholder="Extracted text will appear here..."
          />

          <div className="mt-3 flex justify-between text-xs text-slate-400">
            <span>
              {text.length} characters
            </span>

            <span>
              You can edit OCR mistakes before analysis.
            </span>
          </div>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={
              analyzing || !text.trim()
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <FiLoader className="h-4 w-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <FiShield className="h-4 w-4" />
                Analyze with ScamShield AI
              </>
            )}
          </button>
        </>
      )}
    </div>
  )
}

function ScanResult({ result }) {
  const isCritical =
    result.riskLevel === 'Critical'

  const isHigh =
    result.riskLevel === 'High'

  const isMedium =
    result.riskLevel === 'Medium'

  const isDangerous =
    isCritical || isHigh

  const Icon = isDangerous
    ? FiAlertTriangle
    : FiCheckCircle

  const riskColor = isDangerous
    ? 'text-red-500'
    : isMedium
      ? 'text-amber-500'
      : 'text-emerald-500'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            AI Risk Assessment
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {result.riskLevel} Risk
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {result.category}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/30">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-6">
        <div
          className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-8 border-current ${riskColor}`}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {result.score}
            </p>

            <p className="text-[10px] text-slate-500">
              / 100
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500">
            Confidence
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {result.confidence}%
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            AI confidence in this assessment.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Analysis
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {result.summary}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Detected indicators
        </h3>

        <div className="mt-3 space-y-2">
          {result.reasons.map(
            (reason, index) => (
              <div
                key={`${reason}-${index}`}
                className="flex gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">
                  {reason}
                </p>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
          Recommended action
        </p>

        <p className="mt-1 text-xs leading-5 text-blue-600 dark:text-blue-400">
          {result.recommendedAction}
        </p>
      </div>
    </div>
  )
}