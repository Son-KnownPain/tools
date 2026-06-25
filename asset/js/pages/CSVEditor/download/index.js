
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

    switch (chosenEncoding) {
        case 'shift-jis':
            // 1. Chuyển chuỗi String hiện tại sang mảng byte mã hóa SJIS
            const sjisCodes = Encoding.convert(Encoding.stringToCode(csvString), {
                to: 'SJIS',
                from: 'UNICODE'
            });
            // 2. Đưa mảng byte vào Uint8Array
            const uint8Array = new Uint8Array(sjisCodes);
            // 3. Tạo Blob với định dạng text/csv
            blob = new Blob([uint8Array], { type: 'text/csv;charset=shift-jis;' });
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