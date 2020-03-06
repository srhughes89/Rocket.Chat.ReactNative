import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';

import { themes } from '../../constants/colors';
import { withTheme } from '../../theme';

import MessageError from './MessageError';
import sharedStyles from '../../views/Styles';
import messageStyles from './styles';
import ReadReceipt from './ReadReceipt';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	username: {
		fontSize: 12,
		lineHeight: 18,
		...sharedStyles.textMedium
	},
	timeStamp: {
		flexDirection: "row",
		alignItems: 'center',
		borderWidth: .5,
		borderRadius: 15,
		paddingRight: 3,
		paddingLeft: 3,
		bottom: 6,
		right: 12,
		backgroundColor: '#f00',
		borderColor: '#f00'
	},

	titleContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	alias: {
		fontSize: 12,
		...sharedStyles.textRegular
	}
});

const User = React.memo(({
	isSender, isHeader, useRealName, author, alias, ts, timeFormat, hasError, theme, hasAttachment, roomType, ...props
}) => {
	// if (isHeader || hasError) {
		// const username = (useRealName && author.name) || author.username;
		// const aliasUsername = alias ? (<Text style={[styles.alias, { color: themes[theme].auxiliaryText }]}> @{username}</Text>) : null;

		const time = moment(ts).format(timeFormat);

		const read = (
				<ReadReceipt
					isReadReceiptEnabled={props.isReadReceiptEnabled}
					unread={props.unread}
					theme={props.theme}
				/>
		);		

		if (isSender && !hasAttachment) {
			return (
				<View style={styles.container}>
					<View style={styles.titleContainer}>	
							
					</View>
						{isSender ? <Text style={[messageStyles.time, { color: themes[theme].senderBubbleText }]}>{time}</Text> : <Text style={[messageStyles.time, { color: themes[theme].receiverBubbleText }]}>{time}</Text> }
						{isSender ? <Text style={[messageStyles.time, { color: themes[theme].senderBubbleText }]}>{read}</Text> : <Text style={[messageStyles.time, { color: themes[theme].receiverBubbleText }]}>{read}</Text> }
						{ hasError && <MessageError hasError={hasError} theme={theme} {...props} /> }
				</View>
			);
		}
		if (isSender && hasAttachment) {
			return (
				<View style={styles.container}>
					<View style={styles.titleContainer}>	
							
					</View>
						<View style={[styles.timeStamp, {backgroundColor: themes[theme].senderBubble, borderColor: themes[theme].senderBubble}]}>
								<Text style={[messageStyles.time, { color: themes[theme].senderBubbleText }]}>{time}</Text> 
								<Text style={[messageStyles.time, { color: themes[theme].senderBubbleText }]}>{read}</Text>
								{ hasError && <MessageError hasError={hasError} theme={theme} {...props} /> }
						</View>
				</View>
			);
		}
		if (!isSender && !hasAttachment) {
			return (
				<View style={styles.container}>
					<View style={styles.titleContainer}>
					
					</View>
					<Text style={[messageStyles.time, { color: themes[theme].receiverBubbleText }]}>{time}</Text>
					{ hasError && <MessageError hasError={hasError} theme={theme} {...props} /> }
				</View>
			);
		}
		if (!isSender && hasAttachment) {
			return (
				<View style={styles.container}>
					<View style={styles.titleContainer}>	
							
					</View>
					<View style={[styles.timeStamp, {backgroundColor: themes[theme].receiverBubble, borderColor: themes[theme].receiverBubble}]}>
						<Text style={[messageStyles.time, { color: themes[theme].receiverBubbleText }]}>{time}</Text>
						{ hasError && <MessageError hasError={hasError} theme={theme} {...props} /> }
					</View>
				</View>
			);
		}
	return null;
});

User.propTypes = {
	isHeader: PropTypes.bool,
	hasError: PropTypes.bool,
	useRealName: PropTypes.bool,
	author: PropTypes.object,
	alias: PropTypes.string,
	ts: PropTypes.instanceOf(Date),
	timeFormat: PropTypes.string,
	theme: PropTypes.string
};
User.displayName = 'MessageUser';

export default withTheme(User);
