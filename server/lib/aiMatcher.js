const Groq = require("groq-sdk");

const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;
let groqDisabled = false;

const normalize = (value) => String(value || '').trim().toLowerCase();

const scoreCandidate = (customer, candidate) => {
  let score = 50;

  if (customer.gender !== candidate.gender) score += 8;
  if (customer.religion === candidate.religion) score += 12;
  if (customer.city === candidate.city) score += 8;
  if (customer.maritalStatus === candidate.maritalStatus) score += 4;
  if (customer.wantKids === candidate.wantKids) score += 6;
  if (customer.openToRelocate === candidate.openToRelocate) score += 4;
  if (customer.openToPets === candidate.openToPets) score += 3;

  const sharedLanguages = (customer.languages || []).filter(lang =>
    (candidate.languages || []).some(other => normalize(other) === normalize(lang))
  ).length;
  score += Math.min(sharedLanguages * 3, 9);

  if (normalize(customer.degree) === normalize(candidate.degree)) score += 3;
  if (normalize(customer.designation) === normalize(candidate.designation)) score += 2;

  return Math.max(0, Math.min(100, score));
};

const fallbackMatches = (customer, candidates) => {
  return {
    matches: [...candidates]
      .map(candidate => ({
        id: candidate.id,
        score: scoreCandidate(customer, candidate),
        label: 'Heuristic Match',
        reason: 'Ranked using shared profile and preference signals.',
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10),
  };
};

const generateMatches = async (customer, candidates) => {
  // Fallback immediately if Groq is unconfigured or disabled due to rate limits
  if (!groq || groqDisabled) {
    return fallbackMatches(customer, candidates);
  }

  // --- OPTIMIZATION STEP ---
  // Pre-sort and slice the top 15 candidates using the local heuristic.
  // This drastically reduces token payload sizes and prevents hitting Groq's TPM limits.
  const optimizedCandidates = [...candidates]
    .map(c => ({ ...c, localScore: scoreCandidate(customer, c) }))
    .sort((a, b) => b.localScore - a.localScore)
    .slice(0, 15)
    .map(({ localScore, ...cleanCandidate }) => cleanCandidate); // Strip out local temporary score

  const prompt = `
        You are an expert Indian matrimonial matchmaker.
        Analyze the customer profile and rank the candidates.

        Customer:
        ${JSON.stringify(customer)}

        Candidates:
        ${JSON.stringify(optimizedCandidates)}

        Instructions:
        - Consider age, education, profession, religion, caste, city, marital status, languages, children preference, relocation preference, and pet preference.
        - Return a JSON object containing a top 10 ranked array sorted by score descending.
        
        Expected JSON Schema:
        {
          "matches": [
            {
              "id": "candidate-id",
              "score": 92,
              "label": "High Potential Match",
              "reason": "Both have similar family values and compatible life goals."
            }
          ]
        }
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      // Llama 3.3 70B is highly accurate for complex matching logic
      model: "llama-3.3-70b-versatile", 
      // Forces the model to respond with valid JSON syntax
      response_format: { type: "json_object" }, 
      temperature: 0.3,
    });

    const text = response.choices[0].message.content;
    return JSON.parse(text);
  } catch (error) {
    console.error(`Error in Groq generateMatches:`, error);
    
    // Check for Groq rate limits or quota issues (429)
    if (String(error).includes('429') || String(error).toLowerCase().includes('quota')) {
      groqDisabled = true;
      console.log('Groq quota exhausted, switching to local heuristic matcher.');
    }
    
    return fallbackMatches(customer, candidates);
  }
};

module.exports = generateMatches;