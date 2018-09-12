/* eslint react/prop-types: 0 */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import SavingsWithdrawHistory from 'app/components/elements/SavingsWithdrawHistory';
import TransferHistoryRow from 'app/components/cards/TransferHistoryRow';
import TransactionError from 'app/components/elements/TransactionError';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import {
    numberWithCommas,
    vestingDPay,
    delegatedDPay,
} from 'app/utils/StateFunctions';
import WalletSubMenu from 'app/components/elements/WalletSubMenu';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import Tooltip from 'app/components/elements/Tooltip';
import { FormattedHTMLMessage } from 'app/Translator';
import {
    LIQUID_TOKEN,
    LIQUID_TICKER,
    DEBT_TOKENS,
    VESTING_TOKEN,
} from 'app/client_config';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import DropdownMenu from 'app/components/elements/DropdownMenu';

const assetPrecision = 1000;

class UserWallet extends React.Component {
    constructor() {
        super();
        this.state = {
            claimInProgress: false,
        };
        this.onShowDepositDPay = e => {
            if (e && e.preventDefault) e.preventDefault();
            const name = this.props.current_user.get('username');
            const new_window = window.open();
            new_window.opener = null;
            new_window.location =
                'https://blocktrades.us/?input_coin_type=eth&output_coin_type=dpay&receive_address=' +
                name;
        };
        this.onShowWithdrawDPay = e => {
            e.preventDefault();
            const new_window = window.open();
            new_window.opener = null;
            new_window.location =
                'https://blocktrades.us/unregistered_trade/dpay/eth';
        };
        this.onShowDepositPower = (current_user_name, e) => {
            e.preventDefault();
            const new_window = window.open();
            new_window.opener = null;
            new_window.location =
                'https://blocktrades.us/?input_coin_type=eth&output_coin_type=dpay_power&receive_address=' +
                current_user_name;
        };
        this.onShowDepositBBD = (current_user_name, e) => {
            e.preventDefault();
            const new_window = window.open();
            new_window.opener = null;
            new_window.location =
                'https://blocktrades.us/?input_coin_type=eth&output_coin_type=bbd&receive_address=' +
                current_user_name;
        };
        this.onShowWithdrawBBD = e => {
            e.preventDefault();
            const new_window = window.open();
            new_window.opener = null;
            new_window.location =
                'https://blocktrades.us/unregistered_trade/bbd/eth';
        };
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'UserWallet');
    }

    handleClaimRewards = account => {
        this.setState({ claimInProgress: true }); // disable the claim button
        this.props.claimRewards(account);
    };

    render() {
        const {
            onShowDepositDPay,
            onShowWithdrawDPay,
            onShowDepositBBD,
            onShowWithdrawBBD,
            onShowDepositPower,
        } = this;
        const {
            convertToDPay,
            price_per_dpay,
            savings_withdraws,
            account,
            current_user,
            open_orders,
        } = this.props;
        const gprops = this.props.gprops.toJS();

        if (!account) return null;
        let vesting_dpay = vestingDPay(account.toJS(), gprops);
        let delegated_dpay = delegatedDPay(account.toJS(), gprops);

        let isMyAccount =
            current_user &&
            current_user.get('username') === account.get('name');

        const disabledWarning = false;
        // isMyAccount = false; // false to hide wallet transactions

        const showTransfer = (asset, transferType, e) => {
            e.preventDefault();
            this.props.showTransfer({
                to: isMyAccount ? null : account.get('name'),
                asset,
                transferType,
            });
        };

        const savings_balance = account.get('savings_balance');
        const savings_bbd_balance = account.get('savings_bbd_balance');

        const powerDown = (cancel, e) => {
            e.preventDefault();
            const name = account.get('name');
            if (cancel) {
                const vesting_shares = cancel
                    ? '0.000000 VESTS'
                    : account.get('vesting_shares');
                this.setState({ toggleDivestError: null });
                const errorCallback = e2 => {
                    this.setState({ toggleDivestError: e2.toString() });
                };
                const successCallback = () => {
                    this.setState({ toggleDivestError: null });
                };
                this.props.withdrawVesting({
                    account: name,
                    vesting_shares,
                    errorCallback,
                    successCallback,
                });
            } else {
                const to_withdraw = account.get('to_withdraw');
                const withdrawn = account.get('withdrawn');
                const vesting_shares = account.get('vesting_shares');
                const delegated_vesting_shares = account.get(
                    'delegated_vesting_shares'
                );
                this.props.showPowerdown({
                    account: name,
                    to_withdraw,
                    withdrawn,
                    vesting_shares,
                    delegated_vesting_shares,
                });
            }
        };

        // Sum savings withrawals
        let savings_pending = 0,
            savings_bbd_pending = 0;
        if (savings_withdraws) {
            savings_withdraws.forEach(withdraw => {
                const [amount, asset] = withdraw.get('amount').split(' ');
                if (asset === 'BEX') savings_pending += parseFloat(amount);
                else {
                    if (asset === 'BBD')
                        savings_bbd_pending += parseFloat(amount);
                }
            });
        }

        // Sum conversions
        let conversionValue = 0;
        const currentTime = new Date().getTime();
        const conversions = account
            .get('other_history', List())
            .reduce((out, item) => {
                if (item.getIn([1, 'op', 0], '') !== 'convert') return out;

                const timestamp = new Date(
                    item.getIn([1, 'timestamp'])
                ).getTime();
                const finishTime = timestamp + 86400000 * 3.5; // add 3.5day conversion delay
                if (finishTime < currentTime) return out;

                const amount = parseFloat(
                    item.getIn([1, 'op', 1, 'amount']).replace(' BBD', '')
                );
                conversionValue += amount;

                return out.concat([
                    <div key={item.get(0)}>
                        <Tooltip
                            t={tt('userwallet_jsx.conversion_complete_tip', {
                                date: new Date(finishTime).toLocaleString(),
                            })}
                        >
                            <span>
                                (+{tt('userwallet_jsx.in_conversion', {
                                    amount: numberWithCommas(
                                        '$' + amount.toFixed(3)
                                    ),
                                })})
                            </span>
                        </Tooltip>
                    </div>,
                ]);
            }, []);

        const balance_dpay = parseFloat(account.get('balance').split(' ')[0]);
        const saving_balance_dpay = parseFloat(savings_balance.split(' ')[0]);
        const divesting =
            parseFloat(account.get('vesting_withdraw_rate').split(' ')[0]) >
            0.0;
        const bbd_balance = parseFloat(account.get('bbd_balance'));
        const bbd_balance_savings = parseFloat(
            savings_bbd_balance.split(' ')[0]
        );
        const bbdOrders =
            !open_orders || !isMyAccount
                ? 0
                : open_orders.reduce((o, order) => {
                      if (order.sell_price.base.indexOf('BBD') !== -1) {
                          o += order.for_sale;
                      }
                      return o;
                  }, 0) / assetPrecision;

        const dpayOrders =
            !open_orders || !isMyAccount
                ? 0
                : open_orders.reduce((o, order) => {
                      if (order.sell_price.base.indexOf('BEX') !== -1) {
                          o += order.for_sale;
                      }
                      return o;
                  }, 0) / assetPrecision;

        // set displayed estimated value
        const total_bbd =
            bbd_balance +
            bbd_balance_savings +
            savings_bbd_pending +
            bbdOrders +
            conversionValue;
        const total_dpay =
            vesting_dpay +
            balance_dpay +
            saving_balance_dpay +
            savings_pending +
            dpayOrders;
        let total_value =
            '$' +
            numberWithCommas(
                (total_dpay * price_per_dpay + total_bbd).toFixed(2)
            );

        // format spacing on estimated value based on account state
        let estimate_output = <p>{total_value}</p>;
        if (isMyAccount) {
            estimate_output = <p>{total_value}&nbsp; &nbsp; &nbsp;</p>;
        }

        /// transfer log
        let idx = 0;
        const transfer_log = account
            .get('transfer_history')
            .map(item => {
                const data = item.getIn([1, 'op', 1]);
                const type = item.getIn([1, 'op', 0]);

                // Filter out rewards
                if (
                    type === 'curation_reward' ||
                    type === 'author_reward' ||
                    type === 'comment_benefactor_reward'
                ) {
                    return null;
                }

                if (
                    data.bbd_payout === '0.000 BBD' &&
                    data.vesting_payout === '0.000000 VESTS'
                )
                    return null;
                return (
                    <TransferHistoryRow
                        key={idx++}
                        op={item.toJS()}
                        context={account.get('name')}
                    />
                );
            })
            .filter(el => !!el)
            .reverse();

        let dpay_menu = [
            {
                value: tt('userwallet_jsx.transfer'),
                link: '#',
                onClick: showTransfer.bind(
                    this,
                    'BEX',
                    'Transfer to Account'
                ),
            },
            {
                value: tt('userwallet_jsx.transfer_to_savings'),
                link: '#',
                onClick: showTransfer.bind(
                    this,
                    'BEX',
                    'Transfer to Savings'
                ),
            },
            {
                value: tt('userwallet_jsx.power_up'),
                link: '#',
                onClick: showTransfer.bind(
                    this,
                    'VESTS',
                    'Transfer to Account'
                ),
            },
        ];
        let power_menu = [
            {
                value: tt('userwallet_jsx.power_down'),
                link: '#',
                onClick: powerDown.bind(this, false),
            },
        ];
        let dollar_menu = [
            {
                value: tt('g.transfer'),
                link: '#',
                onClick: showTransfer.bind(this, 'BBD', 'Transfer to Account'),
            },
            {
                value: tt('userwallet_jsx.transfer_to_savings'),
                link: '#',
                onClick: showTransfer.bind(this, 'BBD', 'Transfer to Savings'),
            },
            { value: tt('userwallet_jsx.market'), link: '/market' },
        ];
        if (isMyAccount) {
            dpay_menu.push({
                value: tt('g.buy'),
                link: '#',
                onClick: onShowDepositDPay.bind(
                    this,
                    current_user.get('username')
                ),
            });
            dpay_menu.push({
                value: tt('g.sell'),
                link: '#',
                onClick: onShowWithdrawDPay,
            });
            dpay_menu.push({
                value: tt('userwallet_jsx.market'),
                link: '/market',
            });
            power_menu.push({
                value: tt('g.buy'),
                link: '#',
                onClick: onShowDepositPower.bind(
                    this,
                    current_user.get('username')
                ),
            });
            dollar_menu.push({
                value: tt('g.buy'),
                link: '#',
                onClick: onShowDepositBBD.bind(
                    this,
                    current_user.get('username')
                ),
            });
            dollar_menu.push({
                value: tt('g.sell'),
                link: '#',
                onClick: onShowWithdrawBBD,
            });
        }
        if (divesting) {
            power_menu.push({
                value: 'Cancel Power Down',
                link: '#',
                onClick: powerDown.bind(this, true),
            });
        }

        const isWithdrawScheduled =
            new Date(account.get('next_vesting_withdrawal') + 'Z').getTime() >
            Date.now();

        const dpay_balance_str = numberWithCommas(balance_dpay.toFixed(3));
        const dpay_orders_balance_str = numberWithCommas(
            dpayOrders.toFixed(3)
        );
        const power_balance_str = numberWithCommas(vesting_dpay.toFixed(3));
        const received_power_balance_str =
            (delegated_dpay < 0 ? '+' : '') +
            numberWithCommas((-delegated_dpay).toFixed(3));
        const bbd_balance_str = numberWithCommas('$' + bbd_balance.toFixed(3)); // formatDecimal(account.bbd_balance, 3)
        const bbd_orders_balance_str = numberWithCommas(
            '$' + bbdOrders.toFixed(3)
        );
        const savings_balance_str = numberWithCommas(
            saving_balance_dpay.toFixed(3) + ' BEX'
        );
        const savings_bbd_balance_str = numberWithCommas(
            '$' + bbd_balance_savings.toFixed(3)
        );

        const savings_menu = [
            {
                value: tt('userwallet_jsx.withdraw_LIQUID_TOKEN', {
                    LIQUID_TOKEN,
                }),
                link: '#',
                onClick: showTransfer.bind(this, 'BEX', 'Savings Withdraw'),
            },
        ];
        const savings_bbd_menu = [
            {
                value: tt('userwallet_jsx.withdraw_DEBT_TOKENS', {
                    DEBT_TOKENS,
                }),
                link: '#',
                onClick: showTransfer.bind(this, 'BBD', 'Savings Withdraw'),
            },
        ];
        // set dynamic secondary wallet values
        const bbdInterest = this.props.bbd_interest / 100;
        const bbdMessage = (
            <span>
                {tt('userwallet_jsx.tradeable_tokens_transferred')}
            </span>
        );

        const reward_dpay =
            parseFloat(account.get('reward_dpay_balance').split(' ')[0]) > 0
                ? account.get('reward_dpay_balance')
                : null;
        const reward_bbd =
            parseFloat(account.get('reward_bbd_balance').split(' ')[0]) > 0
                ? account.get('reward_bbd_balance')
                : null;
        const reward_sp =
            parseFloat(account.get('reward_vesting_dpay').split(' ')[0]) > 0
                ? account.get('reward_vesting_dpay').replace('BEX', 'SP')
                : null;

        let rewards = [];
        if (reward_dpay) rewards.push(reward_dpay);
        if (reward_bbd) rewards.push(reward_bbd);
        if (reward_sp) rewards.push(reward_sp);

        let rewards_str;
        switch (rewards.length) {
            case 3:
                rewards_str = `${rewards[0]}, ${rewards[1]} and ${rewards[2]}`;
                break;
            case 2:
                rewards_str = `${rewards[0]} and ${rewards[1]}`;
                break;
            case 1:
                rewards_str = `${rewards[0]}`;
                break;
        }

        let claimbox;
        if (current_user && rewards_str && isMyAccount) {
            claimbox = (
                <div className="row">
                    <div className="columns small-12">
                        <div className="UserWallet__claimbox">
                            <span className="UserWallet__claimbox-text">
                                Your current rewards: {rewards_str}
                            </span>
                            <button
                                disabled={this.state.claimInProgress}
                                className="button"
                                onClick={e => {
                                    this.handleClaimRewards(account);
                                }}
                            >
                                {tt('userwallet_jsx.redeem_rewards')}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="UserWallet">
                {claimbox}
                <div className="row">
                    <div className="columns small-10 medium-12 medium-expand">
                        {isMyAccount ? (
                            <WalletSubMenu account_name={account.get('name')} />
                        ) : (
                            <div>
                                <br />
                                <h4>{tt('g.balances')}</h4>
                                <br />
                            </div>
                        )}
                    </div>
                    {
                        <div className="columns shrink">
                            {isMyAccount && (
                                <button
                                    className="UserWallet__buysp button hollow"
                                    onClick={onShowDepositDPay}
                                >
                                    {tt(
                                        'userwallet_jsx.buy_dpay_or_dpay_power'
                                    )}
                                </button>
                            )}
                        </div>
                    }
                </div>
                <div className="UserWallet__balance row">
                    <div className="column small-12 medium-8">
                        BEX
                        <FormattedHTMLMessage
                            className="secondary"
                            id="tips_js.liquid_token"
                            params={{ LIQUID_TOKEN, VESTING_TOKEN }}
                        />
                    </div>
                    <div className="column small-12 medium-4">
                        {isMyAccount ? (
                            <DropdownMenu
                                className="Wallet_dropdown"
                                items={dpay_menu}
                                el="li"
                                selected={dpay_balance_str + ' BEX'}
                            />
                        ) : (
                            dpay_balance_str + ' BEX'
                        )}
                        {dpayOrders ? (
                            <div
                                style={{
                                    paddingRight: isMyAccount
                                        ? '0.85rem'
                                        : null,
                                }}
                            >
                                <Link to="/market">
                                    <Tooltip t={tt('market_jsx.open_orders')}>
                                        (+{dpay_orders_balance_str} BEX)
                                    </Tooltip>
                                </Link>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="UserWallet__balance row zebra">
                    <div className="column small-12 medium-8">
                        BEX POWER
                        <FormattedHTMLMessage
                            className="secondary"
                            id="tips_js.influence_token"
                        />
                        {delegated_dpay != 0 ? (
                            <span className="secondary">
                                {tt(
                                    'tips_js.part_of_your_dpay_power_is_currently_delegated',
                                    { user_name: account.get('name') }
                                )}
                            </span>
                        ) : null}
                    </div>
                    <div className="column small-12 medium-4">
                        {isMyAccount ? (
                            <DropdownMenu
                                className="Wallet_dropdown"
                                items={power_menu}
                                el="li"
                                selected={power_balance_str + ' BEX'}
                            />
                        ) : (
                            power_balance_str + ' BEX'
                        )}
                        {delegated_dpay != 0 ? (
                            <div
                                style={{
                                    paddingRight: isMyAccount
                                        ? '0.85rem'
                                        : null,
                                }}
                            >
                                <Tooltip t="BEX POWER delegated to/from this account">
                                    ({received_power_balance_str} BEX)
                                </Tooltip>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="UserWallet__balance row">
                    <div className="column small-12 medium-8">
                        BEX DOLLARS
                        <div className="secondary">{bbdMessage}</div>
                    </div>
                    <div className="column small-12 medium-4">
                        {isMyAccount ? (
                            <DropdownMenu
                                className="Wallet_dropdown"
                                items={dollar_menu}
                                el="li"
                                selected={bbd_balance_str}
                            />
                        ) : (
                            bbd_balance_str
                        )}
                        {bbdOrders ? (
                            <div
                                style={{
                                    paddingRight: isMyAccount
                                        ? '0.85rem'
                                        : null,
                                }}
                            >
                                <Link to="/market">
                                    <Tooltip t={tt('market_jsx.open_orders')}>
                                        (+{bbd_orders_balance_str})
                                    </Tooltip>
                                </Link>
                            </div>
                        ) : null}
                        {conversions}
                    </div>
                </div>
                <div className="UserWallet__balance row zebra">
                    <div className="column small-12 medium-8">
                        {tt('userwallet_jsx.savings')}
                        <div className="secondary">
                            <span>
                                {tt(
                                    'transfer_jsx.balance_subject_to_3_day_withdraw_waiting_period'
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="column small-12 medium-4">
                        {isMyAccount ? (
                            <DropdownMenu
                                className="Wallet_dropdown"
                                items={savings_menu}
                                el="li"
                                selected={savings_balance_str}
                            />
                        ) : (
                            savings_balance_str
                        )}
                        <br />
                        {isMyAccount ? (
                            <DropdownMenu
                                className="Wallet_dropdown"
                                items={savings_bbd_menu}
                                el="li"
                                selected={savings_bbd_balance_str}
                            />
                        ) : (
                            savings_bbd_balance_str
                        )}
                    </div>
                </div>
                <div className="UserWallet__balance row">
                    <div className="column small-12 medium-8">
                        {tt('userwallet_jsx.estimated_account_value')}
                        <div className="secondary">
                            {tt('tips_js.estimated_value', { LIQUID_TOKEN })}
                        </div>
                    </div>
                    <div className="column small-12 medium-4">
                        {estimate_output}
                    </div>
                </div>
                <div className="UserWallet__balance row">
                    <div className="column small-12">
                        {isWithdrawScheduled && (
                            <span>
                                {tt(
                                    'userwallet_jsx.next_power_down_is_scheduled_to_happen'
                                )}&nbsp;{' '}
                                <TimeAgoWrapper
                                    date={account.get(
                                        'next_vesting_withdrawal'
                                    )}
                                />.
                            </span>
                        )}
                        {/*toggleDivestError && <div className="callout alert">{toggleDivestError}</div>*/}
                        <TransactionError opType="withdraw_vesting" />
                    </div>
                </div>
                {disabledWarning && (
                    <div className="row">
                        <div className="column small-12">
                            <div className="callout warning">
                                {tt(
                                    'userwallet_jsx.transfers_are_temporary_disabled'
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="row">
                    <div className="column small-12">
                        <hr />
                    </div>
                </div>

                {isMyAccount && <SavingsWithdrawHistory />}

                <div className="row">
                    <div className="column small-12">
                        {/** history */}
                        <h4>{tt('userwallet_jsx.history')}</h4>
                        <div className="secondary">
                            <span>
                                {tt(
                                    'transfer_jsx.beware_of_spam_and_phishing_links'
                                )}
                            </span>
                            &nbsp;
                            <span>
                                {tt(
                                    'transfer_jsx.transactions_make_take_a_few_minutes'
                                )}
                            </span>
                        </div>
                        <table>
                            <tbody>{transfer_log}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        let price_per_dpay = undefined;
        const feed_price = state.user.get(
            'latest_feed_price',
            state.global.get('feed_price')
        );
        if (feed_price && feed_price.has('base') && feed_price.has('quote')) {
            const { base, quote } = feed_price.toJS();
            if (/ BBD$/.test(base) && / BEX$/.test(quote))
                price_per_dpay = parseFloat(base.split(' ')[0]);
        }
        const savings_withdraws = state.user.get('savings_withdraws');
        const gprops = state.global.get('props');
        const bbd_interest = gprops.get('bbd_interest_rate');
        return {
            ...ownProps,
            open_orders: state.market.get('open_orders'),
            price_per_dpay,
            savings_withdraws,
            bbd_interest,
            gprops,
        };
    },
    // mapDispatchToProps
    dispatch => ({
        claimRewards: account => {
            const username = account.get('name');
            const successCallback = () => {
                dispatch(
                    globalActions.getState({ url: `@${username}/transfers` })
                );
            };

            const operation = {
                account: username,
                reward_dpay: account.get('reward_dpay_balance'),
                reward_bbd: account.get('reward_bbd_balance'),
                reward_vests: account.get('reward_vesting_balance'),
            };

            dispatch(
                transactionActions.broadcastOperation({
                    type: 'claim_reward_balance',
                    operation,
                    successCallback,
                })
            );
        },
        convertToDPay: e => {
            //post 2018-01-31 if no calls to this function exist may be safe to remove. Investigate use of ConvertToDPay.jsx
            e.preventDefault();
            const name = 'convertToDPay';
            dispatch(globalActions.showDialog({ name }));
        },
        showChangePassword: username => {
            const name = 'changePassword';
            dispatch(globalActions.remove({ key: name }));
            dispatch(globalActions.showDialog({ name, params: { username } }));
        },
    })
)(UserWallet);
