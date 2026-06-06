const CustomerService = require('../services/customerService');
const customerService = new CustomerService();

const getAllCustomers = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        res.status(200).json({
            data: customers,
            success: true,
            message: 'Customers fetched successfully',
            err: {}
        });
    }catch (error) {
        console.log(`Error in getAllCustomers Controller: ${error}`);
        res.status(500).json({
            data: {},
            success: false,
            message: 'An error occurred while fetching customers',
            err: {error}
        });
    }
}

const getCustomerById = async (req, res) => {
    try {
        const customer = await customerService.getCustomerById(req.params.customerId);
        if (!customer) {
            return res.status(404).json({
            success: false,
            message: "Customer not found"
            });
        }
        res.status(200).json({
            data: customer,
            success: true,
            message: 'Customer fetched successfully',
            err: {}
        });
    }catch (error) {
        console.log(`Error in getCustomerById Controller: ${error}`);
        res.status(500).json({
            data: {},
            success: false,
            message: 'An error occurred while fetching customer',
            err: {error}
        });
    }
}

module.exports = {
    getAllCustomers,
    getCustomerById
};