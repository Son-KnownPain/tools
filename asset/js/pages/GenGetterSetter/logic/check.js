import getMessage, { messagesIds } from "../../../common/messages/messages.js";

/**
 * Xử lí nội dung các fields truyền vào trước khi generate getter/setter
 * @param {Object} param 
 */
export default function check(param) {
    // Lấy ra mảng fields từ tham số truyền vào
    const { fields, getterFormat, setterFormat } = param;
    
    // Khởi tạo kêt quả trả về
    const result = {
        error: false,
        messages: []
    };

    // Kiểm tra định dạng getter
    if (!getterFormat || getterFormat.trim() === '') {
        result.error = true;
        result.messages.push(
            getMessage({
                arrayInit: false,
                messageId: messagesIds.E0005,
                replacements: ['getter comment format'],
            })
        );
    }

    // Kiểm tra định dạng setter
    if (!setterFormat || setterFormat.trim() === '') {
        result.error = true;
        result.messages.push(
            getMessage({
                arrayInit: false,
                messageId: messagesIds.E0005,
                replacements: ['setter comment format'],
            })
        );
    }

    // Kiểm tra định dạng comment của từng field
    fields.forEach(field => {
        // Check comment format không phải dạng // hoặc /** */
        if (!/^\/\/.*$|^\/\*\*.*\*\/$/.test(field.comment)) {
            result.error = true;
            result.messages.push(
                getMessage({
                    arrayInit: false,
                    messageId: messagesIds.E0003,
                    replacements: [field.comment],
                })
            );
        }
    });

    // Trả về kết quả
    return result;
}