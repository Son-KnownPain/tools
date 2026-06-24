/**
 * asset/js/common/messages/messages.js
 * */
import { messageTypes } from "../util/messageUtil.js"

export const messagesIds = {
    __404: '__404',
    W0001: "W0001",
    E0001: "E0001",
    E0002: "E0002",
    E0003: "E0003",
    E0004: "E0004",
    E0005: "E0005",
    E0006: "E0006",
    E0007: "E0007",
}

const messages = {
    [messagesIds.__404]: {
        content: `Trang không tồn tại.`,
        type: messageTypes.ERROR,
    },
    [messagesIds.W0001]: {
        content: `Hiện tại tool đang trong thời gian phát triển.`,
        type: messageTypes.WARNING,
    },
    [messagesIds.E0001]: {
        content: `Vui lòng nhập nội dung cần generate!`,
        type: messageTypes.ERROR,
    },
    [messagesIds.E0002]: {
        content: `Tổng số dòng phải là số chẵn. Bao gồm 1 dòng comment và 1 dòng field.`,
        type: messageTypes.ERROR,
    },
    [messagesIds.E0003]: {
        content: `Comment "{0}" không hợp lệ. Vui lòng sử dụng định dạng // hoặc /** */`,
        type: messageTypes.ERROR,
    },
    [messagesIds.E0004]: {
        content: `Khai báo field "{0}" không hợp lệ.`,
        type: messageTypes.ERROR,
    },
    [messagesIds.E0005]: {
        content: `Dữ liệu {0} không được để trống.`,
        type: messageTypes.ERROR,
    },
    [messagesIds.E0006]: {
        content: `File csv không hợp lệ.`,
        type: messageTypes.ERROR,
    },
    [messagesIds.E0007]: {
        content: `File csv trống (không có dữ liệu).`,
        type: messageTypes.ERROR,
    },
}

// Export a function to get message
export default function getMessage({ arrayInit = true, messageId, replacements = [] }) {
    const messageObj = {...messages[messageId]};
    if (messageObj) {
        // Apply replacements if any
        replacements.forEach((replacement, index) => {
            const placeholder = `{${index}}`;
            messageObj.content = messageObj.content.replace(placeholder, replacement);
        });
    }
    const message = {
        messageId,
        ...(messageObj || {})
    }
    return arrayInit ? [message] : message;
}