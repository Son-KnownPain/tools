
/**
 * Kết hợp trả về nội dung đã được generate
 * @param {Object} param 
 * @returns Nội dung đã được tạo
 */
export default function after(param) {
    // Lấy ra nội dung đã được generate từ tham số truyền vào
    const { generatedContent } = param;
    // Trả về kết quả
    return {
        error: false,
        messages: [],
        generatedContent: generatedContent,
    };
}