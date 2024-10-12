export const getCosineSimilarity = (vectorA: number[], vectorB: number[]) => {
    if (vectorA.length !== vectorB.length) {
        throw new Error('Vectors must be of the same length')
    }

    const dotProduct = vectorA.reduce(
        (sum, value, index) => sum + value * vectorB[index],
        0
    )
    const magnitudeA = Math.sqrt(
        vectorA.reduce((sum, value) => sum + value * value, 0)
    )
    const magnitudeB = Math.sqrt(
        vectorB.reduce((sum, value) => sum + value * value, 0)
    )

    if (magnitudeA === 0 || magnitudeB === 0) {
        throw new Error(
            'Magnitude of one of the vectors is zero, cosine similarity is undefined'
        )
    }

    return dotProduct / (magnitudeA * magnitudeB)
}
