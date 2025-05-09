import { db } from "../lib/db.js"

const getAllSubmissions = async (req, res) => {
    try {
        const userId = req.user.id
        const submission = await db.submission.findMany({
            where: { userId }
        })
        if (!submission)
            res.status(400).json({ status: false, message: `No submission found` })
        res.status(200).json({
            status: true,
            message: "Submissions fetched successfully!",
            submission
        })
    } catch (error) {
        console.error(`Error getting submissions: ${error}`);
        res.status(500).json({ status: false, message: `Error getting submissions: ${error}` })
    }
}
const getSubmissionForProblem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { problemId } = req.params;
        console.log("userId problem", userId, problemId);

        const submissions = await db.submission.findMany({ where: { problemId, userId } })
        if (!submissions)
            res.status(400).json({ status: false, message: `No submission found` })
        res.status(200).json({
            status: true,
            message: "Submissions fetched successfully!",
            submissions
        })
    } catch (error) {
        console.error(`Error getting submissions for problem: ${error}`);
        res.status(500).json({ status: false, message: `Error getting submissions for problem: ${error}` })
    }
}
const getAllSubmissionsForProblem = async (req, res) => {
    try {
        const { problemId } = req.params
        const submissionsCount = await db.submission.count({ where: { problemId } })
        if (!submissionsCount)
            res.status(400).json({ status: false, message: `No submission found` })
        res.status(200).json({
            status: true,
            message: "Submissions fetched successfully!",
            submissionsCount: submissionsCount
        })

    } catch (error) {
        console.error(`Error getting submissions for problem: ${error}`);
        res.status(500).json({ status: false, message: `Error getting submissions for problem: ${error}` })
    }
}

export { getAllSubmissions, getSubmissionForProblem, getAllSubmissionsForProblem }