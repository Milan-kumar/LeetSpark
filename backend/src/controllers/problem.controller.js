import { db } from "../lib/db.js";
import { getJudge0LanguageId, submitBatch } from "../lib/judge0.lib.js";

export const createProblem = async (req, res) => {
    try {
        const { title, description, difficulty, name, tags, examples, constraints,
            testCases, codeSnippets, refrenceSolutions } = req.body
        //check the user role again
        if (req.user.role !== "ADMIN")
            return res.status(403).json({ status: false, error: `You are not allowed to create a problem` })
        for (const [language, solutionCode] of Object.entries(refrenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).
                    json({ status: false, error: `Language ${language} is not supported` })
            }

            const submissions = testCases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_outpiut: output
            }));

            const submissionResult = await submitBatch(submissions);

            const tokens = submissionResult.map((res) => res.token)

            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.lenght; i++) {
                const result = results[i];

                if (result.status.id !== 3)
                    return res.status(400).json({
                        status: false,
                        error: `TestCase ${i + 1} failed for language ${language}`
                    })
            }

            //Save the problem to the database

            const newProblem = await db.problem.create({
                data: {
                    title, description, difficulty, name, tags, examples, constraints,
                    testCases, codeSnippets, refrenceSolutions, userId: req.user.id
                }
            })

            return res.status(201).json({
                success: true,
                newProblem
            })

        }
    } catch (error) {
        console.error(`Error creating problem: ${error}`);
        res.status(500).json({
            status: false,
            error: `Error creating problem: ${error}`
        })


    }

}

export const getProblem = async (req, res) => {

}