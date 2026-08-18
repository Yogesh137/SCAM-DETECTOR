import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from '../config/firebase'
import { analyzeWithGemini } from './geminiService'

const scansCollection = (userId) =>
  collection(db, 'users', userId, 'scans')

export async function analyzeScan(
  userId,
  text,
  source = 'sms',
) {
  if (!userId) {
    throw new Error(
      'You must be logged in to scan a message.',
    )
  }

  if (!text?.trim()) {
    throw new Error(
      'Please provide text to analyze.',
    )
  }

  const analysis =
    await analyzeWithGemini(text)

  const scan = {
    userId,

    text: text.trim(),

    score: analysis.riskScore,

    riskLevel: analysis.riskLevel,

    isScam: analysis.isScam,

    category: analysis.category,

    summary: analysis.summary,

    reasons: analysis.indicators,

    recommendedAction:
      analysis.recommendedAction,

    confidence: analysis.confidence,

    source,

    detectionMethod: 'gemini',

    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(
    scansCollection(userId),
    scan,
  )

  return {
    id: docRef.id,

    ...scan,

    createdAt: new Date(),
  }
}

export async function getScanHistory(userId) {
  if (!userId) {
    return []
  }

  const scansQuery = query(
    scansCollection(userId),
    orderBy('createdAt', 'desc'),
  )

  const snapshot = await getDocs(scansQuery)

  return snapshot.docs.map((doc) => {
    const data = doc.data()

    return {
      id: doc.id,
      ...data,
      createdAt:
        data.createdAt?.toDate?.() || null,
    }
  })
}

export async function getScanAnalytics(userId) {
  if (!userId) {
    return {
      totalScans: 0,
      scamsDetected: 0,
      safeScans: 0,
      averageRiskScore: 0,
      smsScans: 0,
      screenshotScans: 0,
      highRiskScans: 0,
      criticalScans: 0,
      mediumRiskScans: 0,
      lowRiskScans: 0,
      recentScans: [],
    }
  }

  const scansQuery = query(
    scansCollection(userId),
    orderBy('createdAt', 'desc'),
  )

  const snapshot = await getDocs(scansQuery)

  const scans = snapshot.docs.map((doc) => {
    const data = doc.data()

    return {
      id: doc.id,
      ...data,
      createdAt:
        data.createdAt?.toDate?.() || null,
    }
  })

  const totalScans = scans.length

  const scamsDetected = scans.filter(
    (scan) =>
      scan.isScam === true ||
      ['High', 'Critical'].includes(
        scan.riskLevel,
      ),
  ).length

  const safeScans = scans.filter(
    (scan) =>
      !scan.isScam &&
      ['Low'].includes(scan.riskLevel),
  ).length

  const totalScore = scans.reduce(
    (sum, scan) =>
      sum + Number(scan.score || 0),
    0,
  )

  const averageRiskScore =
    totalScans > 0
      ? Math.round(totalScore / totalScans)
      : 0

  return {
    totalScans,

    scamsDetected,

    safeScans,

    averageRiskScore,

    smsScans: scans.filter(
      (scan) => scan.source === 'sms',
    ).length,

    screenshotScans: scans.filter(
      (scan) => scan.source === 'screenshot',
    ).length,

    highRiskScans: scans.filter(
      (scan) => scan.riskLevel === 'High',
    ).length,

    criticalScans: scans.filter(
      (scan) => scan.riskLevel === 'Critical',
    ).length,

    mediumRiskScans: scans.filter(
      (scan) => scan.riskLevel === 'Medium',
    ).length,

    lowRiskScans: scans.filter(
      (scan) => scan.riskLevel === 'Low',
    ).length,

    recentScans: scans.slice(0, 5),
  }
}