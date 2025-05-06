import { db } from "../lib/db.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../lib/judge0.lib.js";

export const createProblem = async (req, res) => {
    try {
        const { title, description, difficulty, tags, examples, constraints,
            testCases, codeSnippets, referenceSolutions } = req.body

        // console.log("Body", language);
        //check the user role again
        if (req.user.role !== "ADMIN")
            return res.status(403).json({ status: false, error: `You are not allowed to create a problem` })
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
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
            console.log("tokens", tokens);


            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.lenght; i++) {
                const result = results[i];
                console.log(`Testcase ${i + 1} and language ${language} --- result ${result}`);

                if (result.status.id !== 3)
                    return res.status(400).json({
                        status: false,
                        error: `TestCase ${i + 1} failed for language ${language}`
                    })
            }

            //Save the problem to the database

            const newProblem = await db.problem.create({
                data: {
                    title, description, difficulty, tags, examples, constraints,
                    testCases, codeSnippets, referenceSolutions, userId: req.user.id
                }
            })

            return res.status(201).json({
                success: true,
                message: "Problem created successfully",
                problem: newProblem
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

export const getAllProblems = async (req, res) => {
    try {
        const problems = await db.problem.findMany();

        if (!problems)
            return res.status(404).json({
                status: false,
                error: "No problem found"
            })
        res.status(200).json(
            {
                status: true,
                message: "Problems fetched successfully!",
                problems
            }
        )
    } catch (error) {
        console.error(`Error fetching problems ${error}`);
        res.status(500).json({
            status: false,
            error: `Error fetching problems ${error}`
        })
    }

}

const getProblem = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("problemID", id);

        const problem = await db.problem.findUnique({
            where: {
                id
            }
        }
        )
        if (!problem)
            return res.status(404).json(
                {
                    status: false,
                    error: `Problem not found`
                })
        res.status(200).json(
            {
                status: true,
                message: "Fetched problem successfully!",
                problem
            }
        )
    } catch (error) {
        console.error(`Error fetching problem: ${error}`);
        res.status(500).json(
            {
                status: false,
                error: `Error fetching problem: ${error}`
            }
        )


    }

}

const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await db.problem.findUnique(
            {
                where: {
                    id
                }
            }
        )
        if (!problem)
            return res.status(404).json(
                {
                    status: false,
                    error: `Problem not found`
                })

        await db.problem.delete({ where: { id } });
        res.status(200).json(
            {
                status: true,
                message: "Problem deleted successfully"
            }
        )

    } catch (error) {
        console.error(`Error deleting problem: ${error} `);
        res.status(500).json(
            {
                status: false,
                error: `Error deleting problem: ${error} `
            })

    }
}

export { getProblem, deleteProblem }