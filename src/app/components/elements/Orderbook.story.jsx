import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs';
import Orderbook from './Orderbook';

const selectOptions = ['error', 'default'];

const mockOrder = {
    getBBDAmount: () => 999,
    getStringBBD: () => 'nine hundred and ninety nine',
    getStringBex: () => 'two hundred bex',
    getStringPrice: () => '55',
    equals: () => 55,
};

const mockOrder2 = {
    getBBDAmount: () => 111,
    getStringBBD: () => 'one hundred and eleven',
    getStringBex: () => 'one bex',
    getStringPrice: () => '55',
    equals: () => 55,
};

storiesOf('Elements', module)
    .addDecorator(withKnobs)
    .add('Orderbook', () => (
        <Orderbook
            side={'bids'}
            orders={[mockOrder, mockOrder2]}
            onClick={price => {
                setFormPrice(price);
            }}
        />
    ));
