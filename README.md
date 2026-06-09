
### Tech Choices

The application is built using Next.js 14 (App Router) with TypeScript for the frontend and Tailwind CSS for styling. This stack was chosen because it provides a modern developer experience, strong type safety, and rapid UI development. The backend is implemented as an Express.js REST API with JWT-based authentication, which keeps the architecture simple while providing secure access to protected resources. Instead of using a traditional database, JSON files (`customers.json` and `pool.json`) are used as the data store to keep the project lightweight and easy to run without additional infrastructure. Axios is used for communication between the frontend and backend services.

### Matching Logic and AI Usage

The matching engine follows a two-stage approach. First, every candidate profile in the pool is evaluated using a local heuristic scoring system that compares attributes such as religion, city, marital status, education, languages, relocation preference, and family preferences. Each candidate receives a compatibility score, and the top 15 candidates are selected. This initial filtering stage reduces the amount of data sent to the AI model, improving performance and controlling token usage.

The shortlisted candidates are then passed to Groq's Llama 3.3 70B model with a structured prompt instructing it to act as an experienced Indian matrimonial matchmaker. The model analyzes the profiles and returns a ranked list of the top 10 matches along with compatibility scores and brief explanations. To ensure reliability, the system automatically falls back to the locally generated rankings whenever the AI service is unavailable or rate-limited. Generated matches are stored within the customer's record so that future profile visits can load recommendations instantly without requiring another AI call.

### Assumptions Made

The application assumes a single authenticated matchmaker managing all customer profiles, so multi-user roles and tenant separation were intentionally omitted. The "Send Match" feature simulates the matchmaking workflow by persisting selected matches to the customer's record, but no actual email delivery is performed because SMTP integration is outside the scope of the assignment. Profile images are also not included in the provided dataset, so the interface uses avatar initials and color coding instead. Finally, all profile data is assumed to be pre-seeded and representative of real matchmaking records, while opposite-gender matching is treated as a default business rule for the recommendation process.
