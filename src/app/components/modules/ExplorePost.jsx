import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { serverApiRecordEvent } from 'app/utils/ServerApiClient';
import Icon from 'app/components/elements/Icon';
import CopyToClipboard from 'react-copy-to-clipboard';
import tt from 'counterpart';

class ExplorePost extends Component {
    static propTypes = {
        permlink: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            copied: false,
        };
        this.onCopy = this.onCopy.bind(this);
        this.DPayd = this.DPayd.bind(this);
        this.DPaydb = this.DPaydb.bind(this);
        this.DSocial = this.DSocial.bind(this);
    }

    DPayd() {
        serverApiRecordEvent('DPaydView', this.props.permlink);
    }

    DPaydb() {
        serverApiRecordEvent('DPaydbView', this.props.permlink);
    }

    DSocial() {
        serverApiRecordEvent('DSocial view', this.props.permlink);
    }

    onCopy() {
        this.setState({
            copied: true,
        });
    }

    render() {
        const link = this.props.permlink;
        const dpayd = 'https://bex.network' + link;
        const dpaydb = 'https://bex.network' + link;
        const dsocial = 'https://dsocial.io' + link;
        const dsite = 'https://dsite.io' + link;
        let text =
            this.state.copied == true
                ? tt('explorepost_jsx.copied')
                : tt('explorepost_jsx.copy');
        return (
            <span className="ExplorePost">
                <h4>{tt('g.share_this_post')}</h4>
                <hr />
                <div className="input-group">
                    <input
                        className="input-group-field share-box"
                        type="text"
                        value={dsite}
                        onChange={e => e.preventDefault()}
                    />
                    <CopyToClipboard
                        text={dsite}
                        onCopy={this.onCopy}
                        className="ExplorePost__copy-button input-group-label"
                    >
                        <span>{text}</span>
                    </CopyToClipboard>
                </div>
                <h5>{tt('explorepost_jsx.alternative_sources')}</h5>
                <ul>
                    <li>
                        <a
                            href={dpayd}
                            onClick={this.DPayd}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            bex.network <Icon name="extlink" />
                        </a>
                    </li>
                    <li>
                        <a
                            href={dpaydb}
                            onClick={this.DPaydb}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            dpaydb.com <Icon name="extlink" />
                        </a>
                    </li>
                    <li>
                        <a
                            href={dsocial}
                            onClick={this.DSocial}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            dsocial.io <Icon name="extlink" />
                        </a>
                    </li>
                </ul>
            </span>
        );
    }
}

export default connect()(ExplorePost);
