const PASSING_PERCENTAGE = 67

function isArray(value) {
  return Array.isArray(value)
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !isArray(value)
}

function isValidAttempt(attempt, questionCount) {
  if (!isPlainObject(attempt)) {
    return false
  }

  if (typeof attempt.name !== 'string' || attempt.name.trim() === '') {
    return false
  }

  return isArray(attempt.answers) && attempt.answers.length === questionCount
}

export function validateQuizData(data) {
  if (!isPlainObject(data)) {
    return false
  }

  if (typeof data.quizTitle !== 'string' || data.quizTitle === '') {
    return false
  }

  if (!isArray(data.correctAnswers) || data.correctAnswers.length === 0) {
    return false
  }

  if (!isArray(data.attempts) || data.attempts.length === 0) {
    return false
  }

  return data.attempts.every((attempt) => isValidAttempt(attempt, data.correctAnswers.length))
}

export function calculateAttempt(attempt, correctAnswers) {
  let score = 0

  correctAnswers.forEach((correctAnswer, index) => {
    if (attempt.answers[index] === correctAnswer) {
      score += 1
    }
  })

  const percentage = Math.round((score / correctAnswers.length) * 100)

  return {
    name: attempt.name.trim(),
    score,
    percentage,
    passed: percentage >= PASSING_PERCENTAGE,
  }
}

export function calculateReport(data) {
  const attempts = data.attempts.map((attempt) => calculateAttempt(attempt, data.correctAnswers))

  let percentageSum = 0
  let passedCount = 0
  let best = attempts[0]

  attempts.forEach((attempt) => {
    percentageSum += attempt.percentage

    if (attempt.passed) {
      passedCount += 1
    }

    if (attempt.score > best.score) {
      best = attempt
    }
  })

  return {
    quizTitle: data.quizTitle.trim(),
    questionCount: data.correctAnswers.length,
    participantCount: attempts.length,
    averagePercentage: Math.round(percentageSum / attempts.length),
    passedCount,
    threshold: PASSING_PERCENTAGE,
    best,
    attempts,
  }
}
