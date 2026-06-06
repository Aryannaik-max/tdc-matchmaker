const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateMatches = async (customer, candidates) => {
    const model = new GoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-2.0-flash",
    });
    const prompt = `
You are an expert Indian matrimonial matchmaker.

Analyze the customer profile and rank the candidates.

Customer:
${JSON.stringify(customer)}

Candidates:
${JSON.stringify(candidates)}

Instructions:

- Consider age
- Consider education
- Consider profession
- Consider religion
- Consider caste
- Consider city
- Consider marital status
- Consider languages
- Consider children preference
- Consider relocation preference
- Consider pet preference
- Consider notes

Return ONLY JSON.

{
  "matches":[
    {
      "id":"candidate-id",
      "score":92,
      "label":"High Potential Match",
      "reason":"Both have similar family values and compatible life goals."
    }
  ]
}

Return top 10 matches sorted by score descending.
`;

    const result =
      await this.model.generateContent({
        contents: prompt,
        generationConfig: {
          responseMimeType:
            "application/json",
        },
      });

    const text =
      result.response.text();

    return JSON.parse(text);
  }


module.exports = generateMatches;