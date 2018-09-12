import React from 'react';
import tt from 'counterpart';
import { APP_NAME } from 'app/client_config';

class Support extends React.Component {
    render() {
        return (
            <div className="row">
                <div>
                    <h2>{tt('g.APP_NAME_support', { APP_NAME })}</h2>
                    <p>
                        {tt('g.please_email_questions_to')}{' '}
                        <a href="https://dsite.io/@dsite-contact">
                            @dsite-contact
                        </a>.
                    </p>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: 'support.html',
    component: Support,
};
