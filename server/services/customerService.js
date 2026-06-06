const customers = require('../data/customers.json');

class CustomerService {
    async getAllCustomers() {
        try {
            return customers;
        }catch (error) {
            console.log(`Error in getAllCustomers Service: ${error}`);
            throw error;
        }
    }

    async getCustomerById(id) {
        try {
            const customer = customers.find(c => c.id === id);
            return customer;
        }catch (error) {
            console.log(`Error in getCustomerById Service: ${error}`);
            throw error;
        }
    }
}

module.exports = CustomerService;