import AsyncStorage from "@react-native-community/async-storage";
import { Category, CategoryType } from "../pages/AddTransaction";
import { Attacment } from '../pages/AddTransaction/CodeScanner/index';
/*
  url: {
    ios: localhost
    android: {
      android studio: 10.0.2.2,
      genymotion: 10.0.3.2,
      phone via usb: your ip
    }
  }
*/

export interface Error {
    statusCode?: number,
    message?: string,
    error?: string
}

interface RemoteSummary extends Error {
    due: number,
    expense: number,
    overDue: number,
    revenue: number,
}

interface RemoteTransactions extends Error {
    id: number
    name: string
    transactionType: CategoryType
    amount: number
    transactionDate: Date
    dueDate?: Date
    paid: boolean
    category: Category
}
// const BASE_API = 'http://127.0.0.1:3000';
const BASE_API = 'http://192.168.1.100:3000';

interface ReceiptResponse {
    response: {
        emitter?: string,
        totalAmount?: number
        emittedDate?: string
        error?: string,
        attachment?: Attacment,
        message?: string
    }
    statusCode?: number,
}


export default {

    checkToken: async (token: string) => {
        try {
            const req = await fetch(`${BASE_API}/authentication/`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'cookie': `${token}`
                }
            })
            const resp = await req.json();
            return { ...resp, status: req.status };
        } catch (error) {
            throw error.message
        }
    },
    singIn: async (email: string, password: string) => {
        try {
            const req = await fetch(`${BASE_API}/authentication/log-in`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            const token = req.headers.get('Set-Hedaer');
            const resp = await req.json();
            return { ...resp, token };
        } catch (error) {
            throw error.message
        }
    },
    getCategoriesByType: async (type: CategoryType): Promise<Category[]> => {
        const config = await AsyncStorage.getItem('appConfig');
        const { token } = config && JSON.parse(config);

        try {
            const req = await fetch(`${BASE_API}/categories/${type}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'cookie': `${token}`
                }
            })
            const resp = await req.json();
            return resp;
        } catch (error) {
            throw 'Catching categories ' + error.message
        }
    },
    getReceipt: async (code: string): Promise<ReceiptResponse> => {
        const config = await AsyncStorage.getItem('appConfig');
        const { token } = config && JSON.parse(config);

        try {
            const req = await fetch(`${BASE_API}/receipt/catch?code=${code}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'cookie': `${token}`
                }
            })
            const response = await req.json();
            return { response, statusCode: req.status };
        } catch (error) {
            throw 'Receipt ' + error.message
        }
    },
    addTransaction: async (transactionFormData: FormData) => {
        try {
            const config = await AsyncStorage.getItem('appConfig');
            const { token } = config && JSON.parse(config);
            const req = await fetch(`${BASE_API}/transactions/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'cookie': `${token}`
                },
                body: transactionFormData
            })
            const response = await req.json();
            return { ...response, statusCode: req.status };
        } catch (error) {
            throw error.message
        }
    },
    getSumaryStats: async (): Promise<RemoteSummary> => {
        try {
            const config = await AsyncStorage.getItem('appConfig');
            const { token } = config && JSON.parse(config);
            const req = await fetch(`${BASE_API}/stats/`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'cookie': `${token}`
                },
            })
            const response = await req.json();
            return { ...response, statusCode: req.status };
        } catch (error) {
            throw error.message
        }
    },
    getLastTransactions: async (): Promise<RemoteTransactions> => {
        try {
            const config = await AsyncStorage.getItem('appConfig');
            const { token } = config && JSON.parse(config);
            const req = await fetch(`${BASE_API}/stats/`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'cookie': `${token}`
                },
            })
            const response = await req.json();
            return { ...response, statusCode: req.status };
        } catch (error) {
            throw error.message
        }
    }


}