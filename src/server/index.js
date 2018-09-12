import config from 'config';

import * as dpay from 'dpayjs';

const path = require('path');
const ROOT = path.join(__dirname, '../..');

// Tell `require` calls to look into `/app` also
// it will avoid `../../../../../` require strings

// use Object.assign to bypass transform-inline-environment-variables-babel-plugin (process.env.NODE_PATH= will not work)
Object.assign(process.env, { NODE_PATH: path.resolve(__dirname, '..') });

require('module').Module._initPaths();

// Load Intl polyfill
// require('utils/intl-polyfill')(require('./config/init').locales);

global.$STM_Config = {
    fb_app: config.get('facebook_app_id'),
    dpayd_connection_client: config.get('dpayd_connection_client'),
    dpayd_connection_server: config.get('dpayd_connection_server'),
    dpayd_use_appbase: config.get('dpayd_use_appbase'),
    chain_id: config.get('chain_id'),
    address_prefix: config.get('address_prefix'),
    img_proxy_prefix: config.get('img_proxy_prefix'),
    ipfs_prefix: config.get('ipfs_prefix'),
    disable_signups: config.get('disable_signups'),
    read_only_mode: config.get('read_only_mode'),
    registrar_fee: config.get('registrar.fee'),
    upload_image: config.get('upload_image'),
    site_domain: config.get('site_domain'),
    facebook_app_id: config.get('facebook_app_id'),
    google_analytics_id: config.get('google_analytics_id'),
};

const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const WebpackIsomorphicToolsConfig = require('../../webpack/webpack-isotools-config');

global.webpackIsomorphicTools = new WebpackIsomorphicTools(
    WebpackIsomorphicToolsConfig
);

global.webpackIsomorphicTools.server(ROOT, () => {
    dpay.api.setOptions({
        url: config.dpayd_connection_client,
        useAppbaseApi: !!config.dpayd_use_appbase,
    });
    dpay.config.set('address_prefix', config.get('address_prefix'));
    dpay.config.set('chain_id', config.get('chain_id'));

    // const CliWalletClient = require('shared/api_client/CliWalletClient').default;
    // if (process.env.NODE_ENV === 'production') connect_promises.push(CliWalletClient.instance().connect_promise());
    try {
        require('./server');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});
