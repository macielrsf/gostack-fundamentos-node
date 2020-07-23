import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
    title: string;
    value: number;
    type: 'income' | 'outcome';
}

class CreateTransactionService {
    private transactionsRepository: TransactionsRepository;

    constructor(transactionsRepository: TransactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }

    public execute({title, value, type}: Request): Transaction {
        const balance = this.transactionsRepository.getBalance();

        if (!['income', 'outcome'].includes(type)) {
            throw Error('Type needs to be income or outcome');
        }

        if (value <= 0) {
            throw Error('Value needs to be greater than zero');
        }

        if (typeof value !== 'number') {
            throw Error('Value needs to be a number');
        }

        if (type === 'outcome' && value > balance.total) {
            throw Error('Insufficient funds');
        }

        const transaction = this.transactionsRepository.create({
            title,
            value,
            type,
        });

        return transaction;
    }
}

export default CreateTransactionService;
