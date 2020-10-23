import AsyncStorage from "@react-native-community/async-storage";
import { Category, CategoryType } from "../pages/AddTransaction";
import { Attacment } from '../pages/AddTransaction/CodeScanner/index';
import { FullTransaction } from "../pages/TransactionDetail";
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

export interface Index {
    totalCount?: string | number | null
}

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

export interface TransactionsParamsOptions {
    take?: string; skip?: string;
    name?: string
    from?: string; to?: string
    paid?: boolean
    transactionType?: string
    category?: string
}

interface RemoteTransactions extends Error, Index {
    data: {
        id: number
        name: string
        transactionType: CategoryType
        amount: number
        transactionDate: Date
        dueDate?: Date
        paid: boolean
        category: Category
    }[]
}

interface RemoteFullTransactions extends FullTransaction, Error { }

interface RemoteCategory extends Error {
    response: Category[]
}
// const BASE_API = 'http://127.0.0.1:3000';
const BASE_API = 'http://192.168.1.100:3000';
// const BASE_API = 'https://financeapi.diskquentinha.com.br';

interface ReceiptResponse {
    response: {
        emitter?: string,
        totalAmount?: number
        emittedDate?: string
        error?: string,
        attachment?: Attacment,
        message?: string,
        receiptKey?: string
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
            const resp = (typeof req === 'object') ? await req.json() : req
            // const resp = await req.json();
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
            const token = req.headers.get('Set-Header');
            const resp = (typeof req === 'object') ? await req.json() : req
            // const resp = await req.json();
            return { ...resp, token };
        } catch (error) {
            throw error.message
        }
    },
    getCategoriesByType: async (type: CategoryType): Promise<RemoteCategory> => {
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
            // const response = await req.json();
            const response = (typeof req === 'object') ? await req.json() : req

            return { response, statusCode: req.status };
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
                    'cookie': `${token}`
                }
            })
            // const response = await req.json();
            const response = (typeof req === 'object') ? await req.json() : req
            return { response, statusCode: req.status };
        } catch (error) {
            throw 'Receipt ' + error.message
        }
    },
    addTransaction: async (transactionFormData: FormData): Promise<RemoteFullTransactions> => {
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
            // const response = await req.json();
            const response = (typeof req === 'object') ? await req.json() : req
            return { ...response, statusCode: req.status };
        } catch (error) {
            throw error
        }
    },
    updateTransaction: async (transactionData: string, transactionId: number): Promise<RemoteFullTransactions> => {
        try {
            const config = await AsyncStorage.getItem('appConfig');
            const { token } = config && JSON.parse(config);
            const req = await fetch(`${BASE_API}/transactions/${transactionId}`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'cookie': `${token}`
                },
                body: transactionData
            })
            const response = (typeof req === 'object') ? await req.json() : req
            return { ...response, statusCode: req.status };
        } catch (error) {
            throw error
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
            // const response = await req.json();
            const response = (typeof req === 'object') ? await req.json() : req
            return { ...response, statusCode: req.status };
        } catch (error) {
            throw error
        }
    },
    getLastTransactions: async (skip: number = 0, take: number = 10,): Promise<RemoteTransactions> => {
        try {
            const config = await AsyncStorage.getItem('appConfig');
            const { token } = config && JSON.parse(config);
            const req = await fetch(`${BASE_API}/transactions/?take=${take}&skip=${skip}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'cookie': `${token}`
                },
            })
            // const response = await req.json();
            const response = (typeof req === 'object') ? await req.json() : req
            return { data: response, statusCode: req.status };
        } catch (error) {
            throw error
        }
    },
    getTransactions: async (optionsParams?: TransactionsParamsOptions): Promise<RemoteTransactions> => {
        try {
            const config = await AsyncStorage.getItem('appConfig');
            const { token } = config && JSON.parse(config);
            const urlParams = new URLSearchParams(<URLSearchParams>optionsParams).toString()
            const req = await fetch(`${BASE_API}/transactions/?${urlParams}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'cookie': `${token}`
                },
            })
            // const response = await req.json();
            const totalCount = req.headers.get('X-total-count')
            const response = (typeof req === 'object') ? await req.json() : req
            if (response.error) throw response
            return { data: response, totalCount, statusCode: req.status };
        } catch (error) {
            throw error
        }
    },
    getTransaction: async (id: number): Promise<RemoteFullTransactions> => {
        try {
            const config = await AsyncStorage.getItem('appConfig');
            const { token } = config && JSON.parse(config);
            const req = await fetch(`${BASE_API}/transactions/${id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'cookie': `${token}`
                },
            })
            // const response = await req.json();
            const response = (typeof req === 'object') ? await req.json() : req
            return { ...response, statusCode: req.status };
        } catch (error) {
            throw error
        }
    },
    deleteTransaction: async (id: number): Promise<Error> => {
        try {
            const config = await AsyncStorage.getItem('appConfig');
            const { token } = config && JSON.parse(config);
            const req = await fetch(`${BASE_API}/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'cookie': `${token}`
                },
            })
            return { statusCode: req.status };
        } catch (error) {
            throw error
        }
    }


}