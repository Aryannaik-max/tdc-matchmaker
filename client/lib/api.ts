import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

export const api = {
    login: async (username: string, password: string) => {
        const response = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
            username,
            password
        });

        return response.data.data ?? response.data;
    },

    getCustomers: async () => {
        const token = getToken();
        if(!token) throw new Error("No token found");

        const response = await axios.get(`${BASE_URL}/api/v1/customers`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    },
    saveNotes: async (id: string, notes: string) => {
        const token = getToken();
        if (!token) throw new Error("No token found");
        const response = await axios.post(`${BASE_URL}/api/v1/customers/:customerId/notes`, {
            customerId: id,
            notes
        }, {
            headers: { authorization: `Bearer ${token}` }
        });
        return response.data.data ?? response.data;
    },
    getCustomer: async (id: string) => {
        const token = getToken();
        if(!token) throw new Error("No token found");

        const response = await axios.get(`${BASE_URL}/api/v1/customers/${id}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        return response.data.data ?? response.data;
    },

    getMatches: async (customerId: string) => {
        const token = getToken();
        if(!token) throw new Error("No token found");

        const response = await axios.get(`${BASE_URL}/api/v1/matches/${customerId}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        return response.data.data ?? response.data;
    },

    getSentMatches: async (customerId: string) => {
        const token = getToken()
        if (!token) throw new Error('No token found')
        const response = await axios.get(`${BASE_URL}/api/v1/matches/${customerId}/sent`, {
            headers: { authorization: `Bearer ${token}` }
        })
        return response.data.data ?? response.data
    },

    sendMessage: async (message: string, customerId: string) => {
        const token = getToken();
        if(!token) throw new Error("No token found");

        const response = await axios.post(`${BASE_URL}/api/v1/matches/send`, {customerId, message}, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    sendMatch: async (customerId: string, matchId: string) => {
        const token = getToken();
        if (!token) throw new Error("No token found");

        const response = await axios.post(`${BASE_URL}/api/v1/matches/send`, { customerId, matchId }, {
            headers: { authorization: `Bearer ${token}` }
        });
        return response.data.data ?? response.data;
    },

    getPoolProfile: async (profileId: string) => {
        const token = getToken()
        if (!token) throw new Error('No token found')
        const response = await axios.get(`${BASE_URL}/api/v1/matches/pool/${profileId}`, {
            headers: { authorization: `Bearer ${token}` }
        })
        return response.data.data ?? response.data
    },

}