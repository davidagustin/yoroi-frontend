// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { Button } from 'react-polymorph/lib/components/Button';
import { ButtonSkin } from 'react-polymorph/lib/skins/simple/ButtonSkin';
import {defineMessages, FormattedHTMLMessage, intlShape} from 'react-intl';
import BorderedBox from '../widgets/BorderedBox';
import styles from './TransferSummaryPage.scss';
import type { TransferTx } from '../../types/TransferTypes';
import LocalizableError from '../../i18n/LocalizableError';
import RawHash from '../widgets/hashWrappers/RawHash';
import ExplorableHashContainer from '../../containers/widgets/ExplorableHashContainer';
import type { ExplorerType } from '../../domain/Explorer';
import globalMessages from '../../i18n/global-messages';

const messages = defineMessages({
  addressFromLabel: {
    id: 'transfer.summary.addressFrom.label',
    defaultMessage: '!!!From',
  },
  addressToLabel: {
    id: 'transfer.summary.addressTo.label',
    defaultMessage: '!!!To',
  },
  recoveredBalanceLabel: {
    id: 'transfer.summary.recoveredBalance.label',
    defaultMessage: '!!!Recovered balance',
  },
  transactionFeeLabel: {
    id: 'transfer.summary.transactionFee.label',
    defaultMessage: '!!!Transaction fees',
  },
  finalBalanceLabel: {
    id: 'transfer.summary.finalBalance.label',
    defaultMessage: '!!!Final balance',
  },
  cancelTransferButtonLabel: {
    id: 'transfer.summary.cancelTransferButton.label',
    defaultMessage: '!!!Cancel',
  },
  transferButtonLabel: {
    id: 'transfer.summary.transferButton.label',
    defaultMessage: '!!!Transfer Funds',
  },
  recoveryTitle: {
    id: 'transfer.summary.recoverytitle.label',
    defaultMessage: '!!!Recovery Successful',
  },
  attention: {
    id: 'transfer.summary.attention.label',
    defaultMessage: '!!!Attention',
  },
  attentionDescription: {
    id: 'transfer.summary.attentionDescription.label',
    defaultMessage: '!!!The balance result is shown below. Please make sure that is equivalent to the balance that you had in your Mainnet Yoroi Wallet on <strong>November 12th</strong>.',
  },
});

type Props = {|
  +formattedWalletAmount: Function,
  +selectedExplorer: ExplorerType,
  +transferTx: TransferTx,
  +onSubmit: Function,
  +isSubmitting: boolean,
  +onCancel: Function,
  +error: ?LocalizableError,
  +addressFromSubLabel: string,
  +classicTheme: boolean
|};

/** Show user what the transfer would do to get final confirmation */
@observer
export default class TransferSummaryPage extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { intl } = this.context;
    const { transferTx, isSubmitting, error, addressFromSubLabel } = this.props;

    const recoveredBalance = this.props.formattedWalletAmount(transferTx.recoveredBalance);

    const nextButtonClasses = classnames([
      'transferButton',
      isSubmitting ? styles.isSubmitting : 'primary',
      styles.button,
    ]);

    return (
      <div className={styles.component}>
          <div className={styles.recoveryTitle}>
            {intl.formatMessage(messages.recoveryTitle)}
          </div>
        <BorderedBox>

          <div className={styles.body}>
            <div className={styles.attentionTitle}>
              {intl.formatMessage(messages.attention)}
            </div>
            <div className={styles.attentionDescription}>
              <FormattedHTMLMessage {...messages.attentionDescription} />
            </div>

            <div className={styles.addressLabelWrapper}>
              <div className={styles.addressLabel}>
                {addressFromSubLabel}
              </div>
              {
                transferTx.senders.map((sender, index) => {
                  const addressesClasses = classnames([
                    'addressRecovered-' + (index + 1),
                    styles.address
                  ]);

                  return (
                    <div
                      key={index /* eslint-disable-line react/no-array-index-key */}
                    >
                      <div className={styles.addressSubLabel} />
                      <ExplorableHashContainer
                        selectedExplorer={this.props.selectedExplorer}
                        light
                        hash={sender}
                        linkType="address"
                      >
                        <RawHash light>
                          <span className={addressesClasses}>{sender}</span>
                        </RawHash>
                      </ExplorableHashContainer>
                    </div>
                  );
                })
              }
            </div>

            <div className={styles.amountFeesWrapper}>
              <div className={styles.amountWrapper}>
                <div className={styles.amountLabel}>
                  {intl.formatMessage(messages.recoveredBalanceLabel)}
                </div>
                <div className={styles.amount}>{recoveredBalance}
                  <span className={styles.currencySymbol}>&nbsp;ADA</span>
                </div>
              </div>
            </div>

            <div className={styles.errorWrapper}>
              {
                error && !isSubmitting &&
                  <p className={styles.error}>{intl.formatMessage(error)}</p>
              }
            </div>

            <div className={styles.buttonsWrapper}>
              <Button
                className={nextButtonClasses}
                label={intl.formatMessage(globalMessages.pdfGenDone)}
                onClick={this.props.onCancel}
                disabled={isSubmitting}
                skin={ButtonSkin}
              />
            </div>

          </div>

        </BorderedBox>

      </div>
    );
  }
}
