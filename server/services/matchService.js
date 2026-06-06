const pool = require('../data/pool.json');
const customers = require('../data/customers.json');
const generateMatches = require('../lib/aiMatcher');

class MatchService {
    async getMatches(customer) {
        try {
            const poolData = pool.filter(c => c.gender !== customer.gender);
            const result = generateMatches(customer, poolData);
            return result.matches;
        }catch (error) {
            console.log(`Error in getMatches Service: ${error}`);
            throw error;
        }
    }

    async sendMatch(customerId, matchId) {
        try {
            const customer = customers.find(candidate => candidate.id === customerId);
            const match = pool.find(candidate => candidate.id === matchId);

            if (!customer || !match) {
                return null;
            }

            return {
                deliveryStatus: 'mock-sent',
                message: `Mock match notification prepared for ${customer.firstName} ${customer.lastName}.`,
                recipient: {
                    id: customer.id,
                    name: `${customer.firstName} ${customer.lastName}`,
                    email: customer.email
                },
                match: this.getProfileSummary(match),
                emailPreview: {
                    subject: `New match suggestion for ${customer.firstName}`,
                    body: `Hi ${customer.firstName}, we found a potential match: ${match.firstName} ${match.lastName}, ${match.age}, ${match.city}.`
                }
            };
        } catch (error) {
            console.log(`Error in sendMatch Service: ${error}`);
            throw error;
        }
    }

    
    getProfileSummary(candidate) {
        return {
            id: candidate.id,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            age: candidate.age,
            city: candidate.city,
            country: candidate.country,
            degree: candidate.degree,
            college: candidate.college,
            company: candidate.company,
            designation: candidate.designation,
            religion: candidate.religion,
            maritalStatus: candidate.maritalStatus,
            languages: candidate.languages,
            status: candidate.status
        };
    }
}

module.exports = MatchService;