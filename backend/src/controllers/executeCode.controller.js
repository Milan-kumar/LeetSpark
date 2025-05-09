import { getLanguageName, pollBatchResults, submitBatch } from "../lib/judge0.lib.js";
import { Status } from "../generated/prisma/index.js";
import { db } from "../lib/db.js";

export const executeCode = async (req, res) => {
    try {
        const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
        const userId = req.user.id

        // Validate test cases
        if (
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length
        )
            return res.status(400).json({
                status: false,
                error: `Invalid or missing test case`
            })

        // Prepare each test case for batch submission
        const submissions = stdin.map((input) => (
            {
                source_code,
                language_id,
                stdin: input
            }))

        //3. Send batch of submissions to Judge0
        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res) => res.token);

        //4. Poll judge0 for result of all submitted test cases
        const results = await pollBatchResults(tokens);

        console.log(`RESULTS-----------------`);
        console.log(results);

        // Analyze test case result;
        let allPassed = true;
        const detailedResult = results.map((result, i) => {
            const stdout = result.stdout?.trim();
            const expected_output = expected_outputs[i]?.trim();
            const passed = stdout === expected_output;

            // console.log(`Test Case ${i + 1} ${passed}`);
            // console.log(`Input ${stdin[i]}`);
            // console.log(`Expected: ${expected_output}, Actual: ${stdout}`);

            if (!passed) allPassed = false;
            return {
                testCase: i + 1,
                passed,
                stdout,
                expected: expected_output,
                stderror: result.stderr || null,
                compileOutput: result.compile_output || null,
                status: result.status.description,
                memory: result.memory ? `${result.memory} KB` : undefined,
                time: result.time ? `${result.time} s` : undefined
            }
        })
        console.log(`detailedResult:`, detailedResult);

        // Store submission summary
        const submission = await db.submission.create(
            {
                data: {
                    userId,
                    problemId,
                    sourceCode: source_code,
                    language: getLanguageName(language_id),
                    stdin: stdin.join("\n"),
                    stdout: JSON.stringify(detailedResult.map((r) => r.stdout)),
                    stderr: detailedResult.some((r) => r.stderr)
                        ? JSON.stringify(detailedResult.map((r) => r.stderr))
                        : null,
                    compileOutput: detailedResult.some((r) => r.compileOutput)
                        ? JSON.stringify(detailedResult.map((r) => r.compileOutput))
                        : null,
                    status: allPassed ? Status.ACCEPTED : Status.WRONG_ANSWER,
                    memory: detailedResult.some((r) => r.memory)
                        ? JSON.stringify(detailedResult.map((r) => r.memory))
                        : null,
                    time: detailedResult.some((r) => r.time)
                        ? JSON.stringify(detailedResult.map((r) => r.time))
                        : null,
                }
            }
        )
        console.log("Submission created");

        // If allPassed = true mark problem as solved for the current user
        if (allPassed) {
            await db.problemSolved.upsert({
                where: {
                    userId_problemId: {
                        userId, problemId
                    }
                },
                update: {},
                create: {
                    userId, problemId
                }
            })
        }

        // Save individual test case result using detailedResult

        const testCaseResults = detailedResult.map((result) => ({
            submissionId: submission.id,
            testCase: result.testCase,
            passed: result.passed,
            stdout: result.stdout,
            expected: result.expected,
            stderror: result.stderror,
            compileOutput: result.compileOutput,
            status: result.status,
            memory: result.memory,
            time: result.time
        }))

        await db.testCaseResult.createMany({
            data: testCaseResults
        })

        const submissionWithTestCase = await db.submission.findUnique({
            where: {
                id: submission.id
            },
            include: {
                testCases: true
            }
        })

        res.status(200).json(
            {
                success: true,
                message: "Code executed successfully!",
                submission: submissionWithTestCase
            })
    } catch (error) {
        console.error(`Error executing code: ${error}`);
        res.status(500).json({
            status: false,
            error: `Error executing code: ${error}`
        })
    }
}