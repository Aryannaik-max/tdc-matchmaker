const pool = require('../data/pool.json');
const customers = require('../data/customers.json');
const generateMatches = require('../lib/aiMatcher');
const CustomerService = require('./customerService');
const customerService = new CustomerService();

class MatchService {
    async getMatches(customer) {
        try {
            const poolData = pool.filter(c => c.gender !== customer.gender);
            const result = await generateMatches(customer, poolData);
            const candidateById = new Map(poolData.map(candidate => [candidate.id, candidate]));

            return (result.matches || []).map(match => {
                const profile = candidateById.get(match.id) || match.profile || null;

                return {
                    ...match,
                    profile,        
                };
            }).filter(match => match.profile);
        }catch (error) {
            console.log(`Error in getMatches Service: ${error}`);
            throw error;
        }
    }

    async sendMatch(customerId, matchId) {
        try {
            const fs = require('fs')
            const path = require('path')
            const customers = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/customers.json'), 'utf-8'))
            const pool = require('../data/pool.json')

            const customer = customers.find(c => c.id === customerId)
            const match = pool.find(c => c.id === matchId)

            if (!customer || !match) return null
            const alreadySent = (customer.sentMatches || []).includes(matchId)
            if (!alreadySent) {
            const updatedSentMatches = [...(customer.sentMatches || []), matchId]
            customerService.updateCustomer(customerId, { sentMatches: updatedSentMatches })
            }

            return {
            deliveryStatus: 'mock-sent',
            message: `Mock match notification prepared for ${customer.firstName} ${customer.lastName}.`,
            recipient: { id: customer.id, name: `${customer.firstName} ${customer.lastName}`, email: customer.email },
            match: this.getProfileSummary(match),
            }
        } catch (error) {
            console.log(`Error in sendMatch Service: ${error}`)
            throw error
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