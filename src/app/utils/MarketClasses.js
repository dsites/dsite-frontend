import { roundDown, roundUp } from './MarketUtils';
import { LIQUID_TICKER, DEBT_TICKER } from 'app/client_config';
const precision = 1000;

class Order {
    constructor(order, side) {
        this.side = side;
        this.price = parseFloat(order.real_price);
        this.price =
            side === 'asks'
                ? roundUp(this.price, 6)
                : Math.max(roundDown(this.price, 6), 0.000001);
        this.stringPrice = this.price.toFixed(6);
        this.dpay = parseInt(order.dpay, 10);
        this.bbd = parseInt(order.bbd, 10);
        this.date = order.created;
    }

    getDPayAmount() {
        return this.dpay / precision;
    }

    getStringDPay() {
        return this.getDPayAmount().toFixed(3);
    }

    getPrice() {
        return this.price;
    }

    getStringPrice() {
        return this.stringPrice;
    }

    getStringBBD() {
        return this.getBBDAmount().toFixed(3);
    }

    getBBDAmount() {
        return this.bbd / precision;
    }

    add(order) {
        return new Order(
            {
                real_price: this.price,
                dpay: this.dpay + order.dpay,
                bbd: this.bbd + order.bbd,
                date: this.date,
            },
            this.type
        );
    }

    equals(order) {
        return (
            this.getStringBBD() === order.getStringBBD() &&
            this.getStringDPay() === order.getStringDPay() &&
            this.getStringPrice() === order.getStringPrice()
        );
    }
}

class TradeHistory {
    constructor(fill) {
        // Norm date (FF bug)
        var zdate = fill.date;
        if (!/Z$/.test(zdate)) zdate = zdate + 'Z';

        this.date = new Date(zdate);
        this.type =
            fill.current_pays.indexOf(DEBT_TICKER) !== -1 ? 'bid' : 'ask';
        this.color = this.type == 'bid' ? 'buy-color' : 'sell-color';
        if (this.type === 'bid') {
            this.bbd = parseFloat(
                fill.current_pays.split(' ' + DEBT_TICKER)[0]
            );
            this.dpay = parseFloat(
                fill.open_pays.split(' ' + LIQUID_TICKER)[0]
            );
        } else {
            this.bbd = parseFloat(fill.open_pays.split(' ' + DEBT_TICKER)[0]);
            this.dpay = parseFloat(
                fill.current_pays.split(' ' + LIQUID_TICKER)[0]
            );
        }

        this.price = this.bbd / this.dpay;
        this.price =
            this.type === 'ask'
                ? roundUp(this.price, 6)
                : Math.max(roundDown(this.price, 6), 0.000001);
        this.stringPrice = this.price.toFixed(6);
    }

    getDPayAmount() {
        return this.dpay;
    }

    getStringDPay() {
        return this.getDPayAmount().toFixed(3);
    }

    getBBDAmount() {
        return this.bbd;
    }

    getStringBBD() {
        return this.getBBDAmount().toFixed(3);
    }

    getPrice() {
        return this.price;
    }

    getStringPrice() {
        return this.stringPrice;
    }

    equals(order) {
        return (
            this.getStringBBD() === order.getStringBBD() &&
            this.getStringDPay() === order.getStringDPay() &&
            this.getStringPrice() === order.getStringPrice()
        );
    }
}

module.exports = {
    Order,
    TradeHistory,
};
