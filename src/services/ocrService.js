import { createWorker } from 'tesseract.js'

export async function extractTextFromImage(
  image,
  onProgress,
) {
  if (!image) {
    throw new Error(
      'No image was provided for OCR.',
    )
  }

  let worker

  try {
    worker = await createWorker('eng', 1, {
      logger: (message) => {
        if (typeof onProgress !== 'function') {
          return
        }

        const progress =
          typeof message.progress === 'number'
            ? Math.round(
                message.progress * 100,
              )
            : 0

        onProgress({
          status: message.status || 'Processing',
          progress,
        })
      },
    })

    const result = await worker.recognize(image)

    const text =
      result?.data?.text?.trim() || ''

    if (!text) {
      throw new Error(
        'No readable text was detected in this image.',
      )
    }

    return text
  } catch (error) {
    console.error(
      'OCR extraction error:',
      error,
    )

    throw new Error(
      error?.message ||
        'Unable to extract text from the image.',
    )
  } finally {
    if (worker) {
      await worker.terminate()
    }
  }
}