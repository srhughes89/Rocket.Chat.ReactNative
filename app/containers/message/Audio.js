import React from 'react';
import PropTypes from 'prop-types';
import {
	View, StyleSheet, Text, Easing, Dimensions
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import equal from 'deep-equal';
import Touchable from 'react-native-platform-touchable';

import Markdown from '../markdown';
import { CustomIcon } from '../../lib/Icons';
import sharedStyles from '../../views/Styles';
import { themes } from '../../constants/colors';
import { isAndroid, isIOS } from '../../utils/deviceInfo';
import { withSplit } from '../../split';
import User from './User';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
	audioContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		height: 56,
		borderWidth: 1,
		borderRadius: 15,
		marginBottom: -16
	},
	playPauseButtonBackground: {
		marginHorizontal: 5,
		borderRadius: 20,
		width: 40,
		height: 40	
	},
	playPauseButton: {
		paddingTop: 6,
		paddingLeft: 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	slider: {
		flex: 1,
		marginRight: 15
	},
	duration: {
		marginHorizontal: 10,
		fontSize: 12,
		...sharedStyles.textRegular,
		position: 'absolute',
		bottom: 8,
		left: 42
	}
});

const formatTime = seconds => moment.utc(seconds * 1000).format('mm:ss');
const BUTTON_HIT_SLOP = {
	top: 12, right: 12, bottom: 12, left: 12
};
const sliderAnimationConfig = {
	duration: 250,
	easing: Easing.linear,
	delay: 0
};

const Button = React.memo(({ paused, onPress, theme, isSender }) => (
	<View style={[styles.playPauseButtonBackground, { backgroundColor: themes[theme].senderTintColor }]}>
		<Touchable
			style={styles.playPauseButton}
			onPress={onPress}
			hitSlop={BUTTON_HIT_SLOP}
			background={Touchable.SelectableBackgroundBorderless()}
		>
			{isSender ? <Icon name={paused ? 'play' : 'pause'} size={28} color={themes[theme].buttonText} /> : <Icon name={paused ? 'play' : 'pause'} size={28} color={themes[theme].buttonText} />}
		</Touchable>
	</View>
));

Button.propTypes = {
	paused: PropTypes.bool,
	theme: PropTypes.string,
	onPress: PropTypes.func
};
Button.displayName = 'MessageAudioButton';

class Audio extends React.Component {
	static propTypes = {
		file: PropTypes.object.isRequired,
		baseUrl: PropTypes.string.isRequired,
		user: PropTypes.object.isRequired,
		theme: PropTypes.string,
		split: PropTypes.bool,
		getCustomEmoji: PropTypes.func
	}
	constructor(props) {
		super(props);
		const { baseUrl, file, user } = props;
		this.state = {
			currentTime: 0,
			duration: 0,
			paused: true,
			uri: `${ baseUrl }${ file.audio_url }?rc_uid=${ user.id }&rc_token=${ user.token }`
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		const {
			currentTime, duration, paused, uri
		} = this.state;
		const { file, split, theme } = this.props;
		if (nextProps.theme !== theme) {
			return true;
		}
		if (nextState.currentTime !== currentTime) {
			return true;
		}
		if (nextState.duration !== duration) {
			return true;
		}
		if (nextState.paused !== paused) {
			return true;
		}
		if (nextState.uri !== uri) {
			return true;
		}
		if (!equal(nextProps.file, file)) {
			return true;
		}
		if (nextProps.split !== split) {
			return true;
		}
		return false;
	}

	onLoad = (data) => {
		this.setState({ duration: data.duration > 0 ? data.duration : 0 });
	}

	onProgress = (data) => {
		const { duration } = this.state;
		if (data.currentTime <= duration) {
			this.setState({ currentTime: data.currentTime });
		}
	}

	onEnd = () => {
		this.setState({ paused: true, currentTime: 0 });
		requestAnimationFrame(() => {
			this.player.seek(0);
		});
	}

	get duration() {
		const { duration } = this.state;
		return formatTime(duration);
	}

	setRef = ref => this.player = ref;

	togglePlayPause = () => {
		const { paused } = this.state;
		this.setState({ paused: !paused });
	}

	onValueChange = value => this.setState({ currentTime: value });

	render() {
		const {
			uri, paused, currentTime, duration
		} = this.state;
		const {
			user, baseUrl, file, getCustomEmoji, split, theme, isSender, room
		} = this.props;
		const { description } = file;

		if (!baseUrl) {
			return null;
		}

		return (
			<>

				<View
					style={ isSender ?
						[styles.audioContainer,
						{ backgroundColor: themes[theme].senderBubble, borderColor: themes[theme].senderBubble },
						split && sharedStyles.tabletContent]
						
						:

						[styles.audioContainer,
						{ backgroundColor: themes[theme].receiverBubble, borderColor: themes[theme].receiverBubble },
						split && sharedStyles.tabletContent]
					}
				>
					<Video
						ref={this.setRef}
						source={{ uri }}
						onLoad={this.onLoad}
						onProgress={this.onProgress}
						onEnd={this.onEnd}
						paused={paused}
						repeat={false}
					/>
					<Button paused={paused} onPress={this.togglePlayPause} theme={theme} isSender={isSender} />
					<Slider
						style={styles.slider}
						value={currentTime}
						maximumValue={duration}
						minimumValue={0}
						animateTransitions
						animationConfig={sliderAnimationConfig}
						thumbTintColor={isSender ? isAndroid && themes[theme].senderTintColor : isAndroid && themes[theme].receiverTintColor}
						minimumTrackTintColor={isSender ? themes[theme].senderTintColor : themes[theme].receiverTintColor}
						maximumTrackTintColor={isSender ? themes[theme].auxiliaryTintColor : themes[theme].auxiliaryTintColor}
						onValueChange={this.onValueChange}
						thumbImage={isSender ? { uri: 'audio_thumb_blue', scale: Dimensions.get('window').scale } : { uri: 'audio_thumb', scale: Dimensions.get('window').scale }}
					/>
					
				</View>
				{isSender ? <Text style={[styles.duration, { color: themes[theme].senderBubbleText }]}>{this.duration}</Text> : <Text style={[styles.duration, { color: themes[theme].receiverBubbleText }]}>{formatTime(currentTime)}</Text>}					
				<Markdown msg={description} baseUrl={baseUrl} username={user.username} getCustomEmoji={getCustomEmoji} theme={theme} />
			</>
		);
	}
}
export default withSplit(Audio);
