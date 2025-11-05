
/**
 * Xử lí tạo getter/setter từ các fields truyền vào
 * @param {Object} param 
 */
export default function execute(param) {
    // Lấy ra mảng fields từ tham số truyền vào
    const { fields, getterFormat, setterFormat, isGetterGen, isSetterGen } = param;
    console.log(fields);
    
    
    // Khởi tạo kêt quả trả về
    const result = {
        error: false,
        messages: []
    };

    // Lọc comment lấy nội dung bỏ qua các ký tự thừa
    fields.map(field => {
        field.comment = field.comment
            .replace(/^\/\/\s?/, '')
            .replace(/^\/\*\*\s?/, '')
            .replace(/\s?\*\/$/, '')
            .trim();
        return field;
    });

    const getterSetterArr = fields.map(field => {
        // Lấy kiểu dữ liệu và tên field
        const type = field.declaration.type;
        const name = field.declaration.name;
        const comment = field.comment;
        // Tạo getter comment
        const getterComment = getterFormat
            .replace(/\{%c\}/g, comment)
        // Tạo setter comment
        const setterComment = setterFormat
            .replace(/\{%c\}/g, comment)
            .replace(/\{%v\}/g, name);
        // Tạo getter method
        const getterMethod = `public ${type} get${name.charAt(0).toUpperCase() + name.slice(1)}() {\n    return this.${name};\n}`;
        // Tạo setter method
        const setterMethod = `public void set${name.charAt(0).toUpperCase() + name.slice(1)}(${type} ${name}) {\n    this.${name} = ${name};\n}`;
        // Kết hợp comment và method
        return [
            isGetterGen ? `${getterComment}\n${getterMethod}` : null,
            isSetterGen ? `${setterComment}\n${setterMethod}` : null,
        ].filter(item => item !== null).join('\n\n');
    });

    // Gán kết quả vào tham số trả về
    param.generatedContent = getterSetterArr.join('\n\n');
    // Trả về kết quả
    return result;
}