import React from 'react';
import PropTypes from 'prop-types';

import { themes } from '../../constants/colors';
import { CustomIcon } from '../../lib/Icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

const ReadReceipt = React.memo(({ isReadReceiptEnabled, unread, theme }) => {
	if (isReadReceiptEnabled && unread) {
		return <Icon name='check' size={16} style={styles.readReceipt} />;
	}
	if (isReadReceiptEnabled && !unread && unread !== null) {
		return <Icon name='check-all' size={16} style={styles.readReceipt} />;
	}
	return null;
});
ReadReceipt.displayName = 'MessageReadReceipt';

ReadReceipt.propTypes = {
	isReadReceiptEnabled: PropTypes.bool,
	unread: PropTypes.bool,
	theme: PropTypes.bool
};

export default ReadReceipt;
