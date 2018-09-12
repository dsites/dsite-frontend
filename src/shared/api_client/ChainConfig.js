import * as dpay from 'dpayjs';

dpay.config.set('address_prefix', 'DWB');

let chain_id = '';
for (let i = 0; i < 32; i++) chain_id += '00';

module.exports = {
    address_prefix: 'DWB',
    expire_in_secs: 15,
    chain_id,
};
