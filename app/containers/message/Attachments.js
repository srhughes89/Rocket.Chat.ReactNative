import React from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';

import Image from './Image';
import Audio from './Audio';
import Video from './Video';
import Reply from './Reply';

const Attachments = React.memo(({
	attachments, timeFormat, user, baseUrl, showAttachment, getCustomEmoji, theme, room, isSender
}) => {
	if (!attachments || attachments.length === 0) {
		return null;
	}

	return attachments.map((file, index) => {
		if (file.image_url) {
			return <Image key={file.image_url} file={file} user={user} baseUrl={baseUrl} showAttachment={showAttachment} getCustomEmoji={getCustomEmoji} theme={theme} />;
		}
		if (file.audio_url) {
			return <Audio key={file.audio_url} file={file} user={user} baseUrl={baseUrl} getCustomEmoji={getCustomEmoji} theme={theme} isSender={isSender} />;
		}
		if (file.video_url) {
			return <Video key={file.video_url} file={file} user={user} baseUrl={baseUrl} showAttachment={showAttachment} getCustomEmoji={getCustomEmoji} theme={theme} />;
		}

		// eslint-disable-next-line react/no-array-index-key
		return <Reply key={index} index={index} attachment={file} timeFormat={timeFormat} user={user} baseUrl={baseUrl} getCustomEmoji={getCustomEmoji} theme={theme} />;
	});
}, (prevProps, nextProps) => isEqual(prevProps.attachments, nextProps.attachments) && prevProps.theme === nextProps.theme);

Attachments.propTypes = {
	attachments: PropTypes.array,
	timeFormat: PropTypes.string,
	user: PropTypes.object,
	baseUrl: PropTypes.string,
	showAttachment: PropTypes.func,
	getCustomEmoji: PropTypes.func,
	theme: PropTypes.string,
	room: PropTypes.string,
	isSender: PropTypes.bool
};
Attachments.displayName = 'MessageAttachments';

export default Attachments;
