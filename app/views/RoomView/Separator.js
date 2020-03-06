import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import I18n from '../../i18n';
import sharedStyles from '../Styles';
import { themes } from '../../constants/colors';

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 4,
		marginBottom: 4,
		marginHorizontal: 14,
		justifyContent: 'center'
	},
	text: {
		fontSize: 14,
		...sharedStyles.textMedium,
		marginLeft: 10,
		marginRight: 10
	},
	lineMargin: {
		marginLeft: 14,
		marginRight: 14
	},
	unreadContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 4,
		marginBottom: 4,
		justifyContent: 'center',
		opacity: 0.7	
	}
});

const DateSeparator = React.memo(({ ts, unread, theme }) => {
	const date = ts ? moment(ts).format('MMMM D, YYYY') : null;
	const dateNoYear = ts ? moment(ts).format('MMMM D') : null;
	const unreadLine = { backgroundColor: themes[theme].dangerColor };
	const unreadText = { color: themes[theme].dangerColor };
	const today = moment().format('MMMM D, YYYY');
	const year = moment().format('YYYY');

	if (ts && moment(ts).format('MMMM D, YYYY') === today) {
		return (
			<View style={styles.container}>
				<TouchableOpacity style={ {borderRadius: 10, padding: 2, backgroundColor: themes[theme].separatorColor}}>
						<Text style={[styles.text, { color: themes[theme].bubbleText}, styles.lineMargin]}>Today</Text>
				</TouchableOpacity>

			</View>
		);		
	}
	if (ts && moment(ts).format('YYYY') === year) {
		return (
			<View style={styles.container}>
				<TouchableOpacity style={ {borderRadius: 10, padding: 2, backgroundColor: themes[theme].separatorColor}}>
					<Text style={[styles.text, { color: themes[theme].bubbleText }, styles.lineMargin]}>{dateNoYear}</Text>
				</TouchableOpacity>
			</View>
		);
	}
	if (ts && moment(ts).format('YYYY') !== year) {
		return (
			<View style={styles.container}>
				<TouchableOpacity style={{borderRadius: 10, padding: 2, backgroundColor: themes[theme].separatorColor}}>
					<Text style={[styles.text, { color: themes[theme].bubbleText }, styles.lineMargin]}>{date}</Text>
				</TouchableOpacity>
			</View>
		);
	}
	return (
			<View style={styles.unreadContainer}>
				<Text style={[styles.text, { backgroundColor: themes[theme].separatorColor, color: themes[theme].bubbleText}]}>Unread Messages</Text>
			</View>
	);
});

DateSeparator.propTypes = {
	ts: PropTypes.instanceOf(Date),
	unread: PropTypes.bool,
	theme: PropTypes.string
};

export default DateSeparator;

