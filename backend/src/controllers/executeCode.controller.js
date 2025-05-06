import { pollBatchResults, submitBatch } from "../lib/judge0.lib.js";

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
        res.status(200).json(
            {
                success: true,
                message: "Code executed!"
            })
    } catch (error) {
        console.error(`Error executing code: ${error}`);
        res.status(500).json({
            status: false,
            error: `Error executing code: ${error}`
        })


    }

}