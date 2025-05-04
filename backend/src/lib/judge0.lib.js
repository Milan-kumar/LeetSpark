import axios from "axios";

export const getJudge0LanguageId = (language) => {
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
    }
    return languageMap[language.toUpperCase()]
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const pollBatchResults = async (tokens) => {
    while (true) {
        const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
            params: {
                tokens: tokens.join(","),
                base64_encoded: false
            }
        })

        const results = data.submissions;
        console.log("res:", results);
        

        // The every method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value false, or until the end of the array.
        // Determines whether all the members of an array satisfy the specified test.
        const isAllDone = results.every((r) => r.status.id !== 1 && r.status.id !== 2)

        if (isAllDone) return results;

        await sleep(1000)
    }
}

export const submitBatch = async (submissions) => {

    const { data } = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, { submissions });

    console.log(`Submission Results: ${data}`);
    return data; //[{token},{token},{token}]

}