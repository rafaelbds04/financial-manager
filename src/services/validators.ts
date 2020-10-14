import { string, object, mixed, number, date, boolean } from 'yup';

export default {
    async validateTransactionCreate(toValidate: object) {
            const result = await object().shape({
                name: string().required(),
                description: string().notRequired(),
                transactionType: mixed().oneOf(['revenue', 'expense']),
                amount: number().min(0.01).required(),
                transactionDate: date().required(),
                dueDate: date().notRequired(),
                paid: boolean().required(),
                category: string().required()
            }).validate(toValidate).then(() => true).catch(error => error);
            return result;
    }
}