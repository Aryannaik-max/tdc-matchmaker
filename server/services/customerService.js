const customers = require('../data/customers.json');
const fs = require('fs')
const path = require('path')

const customersPath = path.join(__dirname, '../data/customers.json')

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

    async updateCustomer(id, updates) {
        try {
            const customers = JSON.parse(fs.readFileSync(customersPath, 'utf-8'))
            const idx = customers.findIndex(c => c.id === id)
            if (idx === -1) return null
            customers[idx] = { ...customers[idx], ...updates }
            fs.writeFileSync(customersPath, JSON.stringify(customers, null, 2))
            return customers[idx]
        }catch (error) {
            console.log(`Error in updateCustomer Service: ${error}`);
            throw error;
        }
  }

  async saveNotes(customerId, notes) {
    try {
        const customers = JSON.parse(fs.readFileSync(customersPath, 'utf-8'))
        const idx = customers.findIndex(c => c.id === customerId)
        if (idx === -1) return null
        customers[idx].notes = notes
        fs.writeFileSync(customersPath, JSON.stringify(customers, null, 2))
        return customers[idx]
    }catch (error) {
        console.log(`Error in saveNotes Service: ${error}`);
        throw error;
    }
 }
}

module.exports = CustomerService;