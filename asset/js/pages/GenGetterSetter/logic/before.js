import getMessage, { messagesIds } from "../../../common/messages/messages.js";

/**
 * Xử lí nội dung các fields truyền vào trước khi generate getter/setter
 * @param {Object} param 
 */
export default function before(param) {
    // Lấy ra nội dung từ tham số truyền vào
    const { content } = param;
    // Khởi tạo kêt quả trả về
    const result = {
        error: false,
        messages: []
    };
    // Lấy ra các dòng từ nội dung truyền vào
    const lines = content.split('\n');
    // Kiểm tra nếu tổng số dòng là lẻ thì báo lỗi
    if (lines.length % 2 !== 0) {
        result.error = true;
        result.messages.push(
            getMessage({
                arrayInit: false,
                messageId: messagesIds.E0002,
            })
        );
        return result;
    }
    // Tạo mảng lưu trữ các field
    const fields = [];
    // Xử lí từng dòng để tách comment và field
    let field = {};
    // Duyệt qua từng dòng
    lines.forEach((line, index) => {
        if (index % 2 === 0) {
            // Dòng comment
            field.comment = line.trim();
        } else {
            // Dòng field
            field.declaration = {};
            let declarationParts = line.trim().split(' ');
            declarationParts = declarationParts.filter(part => part !== '');
            if (declarationParts.length < 2) {
                result.error = true;
                result.messages.push(
                    getMessage({
                        arrayInit: false,
                        messageId: messagesIds.E0004,
                        replacements: [line.trim()],
                    })
                );
            } else if (declarationParts.length === 2) {
                if (declarationParts[1].replace(';', '') === '') {
                    result.error = true;
                    result.messages.push(
                        getMessage({
                            arrayInit: false,
                            messageId: messagesIds.E0004,
                            replacements: [line.trim()],
                        })
                    );
                }
                // Xử lí trường hợp không có modifier
                field.declaration.type = declarationParts[0];
                field.declaration.name = declarationParts[1].replace(';', '');
            } else if (declarationParts.length >= 3) {
                if (declarationParts[2].replace(';', '') === '') {
                    result.error = true;
                    result.messages.push(
                        getMessage({
                            arrayInit: false,
                            messageId: messagesIds.E0004,
                            replacements: [line.trim()],
                        })
                    );
                }
                // Xử lí trường hợp có modifier (public, private, protected, static, final, v.v.)
                field.declaration.type = declarationParts[1];
                field.declaration.name = declarationParts[2].replace(';', '');
            }
            // Thêm field vào mảng fields
            fields.push(field);
            // Khởi tạo lại đối tượng field
            field = {};
        }
    });
    // Gán mảng fields vào tham số truyền vào
    param.fields = fields;
    // Trả về kết quả
    return result;
}