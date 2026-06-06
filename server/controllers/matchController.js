const MatchService = require('../services/matchService');
const CustomerService = require('../services/customerService');

const matchService = new MatchService();
const customerService = new CustomerService();

const getMatches = async (req, res) => {
    try {
        const customer = await customerService.getCustomerById(req.params.customerId);
        if (!customer) {
            return res.status(404).json({
            success: false,
            message: "Customer not found"
            });
        }
        const matches = await matchService.getMatches(customer);
        res.status(200).json({
            data: matches,
            success: true,
            message: 'Matches fetched successfully',
            err: {}
        });
    }catch (error) {
        console.log(`Error in getMatches Controller: ${error}`);
        res.status(500).json({
            data: {},
            success: false,
            message: 'An error occurred while fetching matches',
            err: {error}
        });
    }
}

const sendMatch = async (req, res) => {
    try {
        const { customerId, matchId } = req.body;

        if (!customerId || !matchId) {
            return res.status(400).json({
                success: false,
                message: 'customerId and matchId are required'
            });
        }

        const delivery = await matchService.sendMatch(customerId, matchId);

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: 'Customer or match not found'
            });
        }

        res.status(200).json({
            data: delivery,
            success: true,
            message: 'Mock match notification created successfully',
            err: {}
        });
    } catch (error) {
        console.log(`Error in sendMatch Controller: ${error}`);
        res.status(500).json({
            data: {},
            success: false,
            message: 'An error occurred while sending the mock match notification',
            err: {error}
        });
    }
}

module.exports = {
    getMatches,
    sendMatch
};