/**
 * asset/js/common/util/messageUtil.js
 * */
import { d$, d$$ } from './pageUtil.js';

/**
 * Message types for notification
 * @typedef {Object} messageTypes
 */
export const messageTypes = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error'
};

/**
 * Message notification function
 * @param {Object} param0 information for the message notification
 */
export default function messageNotification({ title, messages = [], type = messageTypes.INFO, onLoad = false }) {
    // Check if the title is provided, if not, set a default title
    if (!title) {
        switch (type) {
            case messageTypes.INFO:
                title = 'Thông tin';
                break;
            case messageTypes.SUCCESS:
                title = 'Thành công';
                break;
            case messageTypes.WARNING:
                title = 'Cảnh báo';
                break;
            case messageTypes.ERROR:
                title = 'Lỗi đã xảy ra';
                break;
            default:
                title = 'Thông báo';
        }
    }
    // Set the message content
    const messageTitleElm = d$('#common-message-modal-title');
    // Check if messages is an array
    if (Array.isArray(messages)) {
        // Set message title
        messageTitleElm.innerHTML = title;
        //  Judge the icon type based on the message type
        const iconElms = d$$('svg[data-common-message-modal-type-icon]');
        iconElms.forEach(iconElm => {
            iconElm.classList.add('hidden');
            if (iconElm.dataset.commonMessageModalTypeIcon === type) {
                iconElm.classList.remove('hidden');
            }
        });
        // Get content div element
        const messageContentElm = d$('#common-message-modal-content');
        // Render content list
        messageContentElm.innerHTML = messages.map(message => {
            const { messageId, content, type } = message;
            let textColorLightMode = '';
            let textColorDarkMode = '';
            let backgroundColorLightMode = '';
            let backgroundColorDarkMode = '';
            switch (type) {
                case messageTypes.INFO:
                    textColorLightMode = 'text-black';
                    textColorDarkMode = 'text-white';
                    backgroundColorLightMode = 'bg-blue-100';
                    backgroundColorDarkMode = 'bg-blue-900';
                    break;
                case messageTypes.SUCCESS:
                    textColorLightMode = 'text-black';
                    textColorDarkMode = 'text-white';
                    backgroundColorLightMode = 'bg-green-100';
                    backgroundColorDarkMode = 'bg-green-900';
                    break;
                case messageTypes.WARNING:
                    textColorLightMode = 'text-black';
                    textColorDarkMode = 'text-white';
                    backgroundColorLightMode = 'bg-yellow-100';
                    backgroundColorDarkMode = 'bg-yellow-900';
                    break;
                case messageTypes.ERROR:
                    textColorLightMode = 'text-black';
                    textColorDarkMode = 'text-white';
                    backgroundColorLightMode = 'bg-red-100';
                    backgroundColorDarkMode = 'bg-red-900';
                    break;
                default:
                    textColorLightMode = 'text-black';
                    textColorDarkMode = 'text-white';
                    backgroundColorLightMode = 'bg-gray-100';
                    backgroundColorDarkMode = 'bg-gray-900';
            }
            // Return the HTML for each message
            return `<li class="flex items-center">
                <span class="w-18 ${backgroundColorLightMode} ${textColorLightMode} text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm ${backgroundColorDarkMode} ${textColorDarkMode}">
                    ${messageId}
                </span>
                <span>
                    ${content}
                </span>
            </li>`;
        }).join('');
        // Display the message modal
        
        // If the modal is already loaded, show it directly
        if (!onLoad) {
            // Get the modal instance and show it
            const modal = FlowbiteInstances.getInstance('Modal', 'common-message-modal');
            modal.show();
        } else {
            // If not loaded, wait for the window to load before showing the modal
            window.addEventListener('load', function() {
                const modal = FlowbiteInstances.getInstance('Modal', 'common-message-modal');
                modal.show();
            });
        }
    }
}