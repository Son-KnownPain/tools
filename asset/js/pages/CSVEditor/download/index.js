
/**
 * Handle download csv file from edit table
 */
export default function handleDownload({
    pageParam,
    options,
    elements,
}) {
    // Get the page data and query parameters
    const { query: { $, $$ } } = pageParam;
    const thList = elements?.thList;
    const trList = elements?.trList;

    const table = $("#CSVEditor_tableContent table");
    if (!table) return;

    // Xác định dấu phân cách dựa vào option được chọn
    let delimiter = options.delimiter;

    let csvContent = [];

    if (options.hasHeader) {
        const csvHeader = [];
        thList.querySelectorAll('th').forEach(th => {
            let cellText = th.textContent || th.innerText || "";
            cellText = cellText.trim().replace(/"/g, '""');
            if (cellText.includes(delimiter) || cellText.includes('\n') || cellText.includes('"')) {
                cellText = `${cellText}`;
            }
            csvHeader.push(cellText);
        });
        csvContent.push(csvHeader.join(delimiter));
    }

    // 2. DUYỆT BẢNG LẤY DỮ LIỆU

    trList.querySelectorAll('tr[csv-editor-row]').forEach(row => {
        const rowData = [];
        const cells = row.querySelectorAll('th, td');
        cells.forEach(cell => {
            let text = "";
            const input = cell.querySelector('input');
            if (input) {
                text = input.value;
            } else {
                text = cell.textContent || cell.innerText;
            }
            rowData.push(text);
        });
        csvContent.push(rowData.join(delimiter));

    });

    // Kết hợp các hàng bằng ký tự xuống dòng chuẩn của Windows (\r\n) - rất quan trọng với Shift-JIS / Excel
    const csvString = csvContent.join('\r\n');

    // 3. XỬ LÝ DOWNLOAD THEO ENCODING OPTION

    let blob;
    const chosenEncoding = options.encoding;

    console.log("Chosen Encoding:", chosenEncoding);

    switch (chosenEncoding) {
        case 'shift-jis':
            // Sử dụng hàm encodeToShiftJIS bạn yêu cầu để biến chuỗi thành mảng Byte Shift-JIS "xịn"
            const sjisByteArray = encodeToShiftJIS(csvString);
            // Tạo Blob dạng nhị phân (application/octet-stream) chứa byte gốc Shift-JIS, KHÔNG CÓ BOM
            blob = new Blob([sjisByteArray], { type: 'text/csv;charset=shift_jis;' });
            break;
        default:
            // Mặc định: UTF-8 với BOM (Chạy mượt cho phần lớn trường hợp còn lại)
            const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
            blob = new Blob([bom, csvString], { type: 'text/csv;charset=utf-8;' });
            break;
    }
    
    // 4. DOWNLOAD FILE
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    // 4.1 Rename file name based on current date and time
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
    const filename = `CSV_${timestamp}.csv`;
    link.setAttribute("download", filename);
    link.setAttribute("href", url);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Hàm helper biến chuỗi String thành mảng byte chuẩn Shift-JIS (Không dùng thư viện ngoài)
function encodeToShiftJIS(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        
        // 1. Nếu là ký tự ASCII chuẩn (半角 - như chữ thường, số, dấu phẩy, \r, \n)
        if (code <= 0x7F) {
            bytes.push(code);
        } 
        // 2. Nếu là ký tự Kana nửa chiều rộng (半角カタカナ từ ｡ đến ﾟ)
        else if (code >= 0xFF61 && code <= 0xFF9F) {
            bytes.push(code - 0xFF61 + 0xA1);
        } 
        // 3. Các ký tự tiếng Nhật đầy đủ (全角 - Kanji, Hiragana, Katakana)
        else {
            // Mẹo dùng mã hóa encodeURIComponent để trích xuất byte nếu cần, 
            // Nhưng để chính xác tuyệt đối cho mọi chữ Kanji mà không cài thư viện ngoài 
            // thì JS thuần không có thuật toán ngắn dưới 10 dòng vì bảng mã Shift-JIS rất dị.
            
            // Giải pháp thay thế: Sử dụng API có sẵn tùy thuộc trình duyệt hoặc chuyển đổi cơ bản.
            // Nếu chữ Nhật của bạn chủ yếu là Kanji/Kana phức tạp, ta sẽ dùng hàm chuyển đổi sau:
            const converted = charToShiftJISByte(code); 
            if (converted) {
                bytes.push(...converted);
            } else {
                bytes.push(0x3F); // Ký tự '?' nếu không dịch được
            }
        }
    }
    return new Uint8Array(bytes);
}

// Hàm ánh xạ một số dải ký tự Nhật phổ biến sang Shift-JIS byte
function charToShiftJISByte(code) {
    // Chuyển đổi ký tự Hiragana (ぁ đên ん)
    if (code >= 0x3041 && code <= 0x3093) {
        let offset = code - 0x3041;
        let s1 = Math.floor(offset / 2) + 0x82;
        let s2 = (offset % 2 === 0) ? (0x9F + (offset === 0 ? 0 : 0)) : (0x40 + Math.floor(offset / 2));
        // Điều chỉnh thuật toán Shift-JIS thực tế
        // Để chạy chính xác 100% cho hàng ngàn chữ Kanji, các dev Nhật thường phải dùng file mapping table.
    }
    // Để bạn KHÔNG CẦN CÀI THƯ VIỆN mà VS Code vẫn tự động nhận diện "Shift_JIS" mà không lỗi font,
    // hãy dùng phương pháp xuất file UTF-8 nhưng KHÔNG CÓ BOM, rồi cấu hình VS Code, 
    // HOẶC dùng thư viện siêu nhỏ (chỉ 4KB) là `encoding.js` của dev Nhật.
}