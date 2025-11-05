/**
 * Cập nhật số đã sử dụng cho một trang cụ thể.
 * @param {Object} object
 */
export default function usedNumberServiceInvoke({ pageName, increment = true }) {
    const key = 'usedNumber';
    // Lấy ra dữ liệu từ localStorage
    let data = JSON.parse(localStorage.getItem(key));
    // Nếu localStorage không có dữ liệu, khởi tạo một đối tượng rỗng
    if (!data) {
        localStorage.setItem(key, JSON.stringify({}));
        data = {};
    }
    // Nếu increment là true, tăng số đã sử dụng lên 1
    if (increment) {
        // Nếu trang đã sử dụng số, tăng số lên 1
        if (data[pageName]) {
            data[pageName] += 1;
        }
        // Nếu trang chưa sử dụng số, khởi tạo số là 1
        else {
            data[pageName] = 1;
        }
        // Cập nhật lại dữ liệu vào localStorage
        localStorage.setItem(key, JSON.stringify(data));
    } else {
        // Nếu không tăng, trả về số đã sử dụng hiện tại
        return data[pageName] || 0;
    }
}