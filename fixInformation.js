// Function lấy dữ liệu từ một hàng (tr)
function getTableRowData(tr) {
    var tds = tr.getElementsByTagName('td');
    var indexItemCode = 2;
    var indexItemName = 3;
    var indexValueDVT = 7;
    var indexUnitPrice = 9;

    return {
        itemCode: tds[indexItemCode].textContent,
        itemName: tds[indexItemName].textContent,
        unitPrice: tds[indexUnitPrice].textContent,
        valueDVT: tds[indexValueDVT].textContent,
        tds: tds
    };
}

// Ký tự viết tắt
const abbreviations = {
    "at": "an toan",
    "bh": "bao ho",
    "qa": "quan ao",
    "ao gi" : "ao gile",
    "cn" : "cong nhan",
    "bv" : "bao ve",
    "bhld" : "bao ho lao dong",
    "pq" : "phan quang",
    "pccc" : "phong chay chua chay"
    // Thêm các cặp viết tắt và từ đầy đủ khác vào đây
};

// Function để kiểm tra itemCode có tồn tại trong mảng các giá trị không hợp lệ
function isItemCodeValid(itemCode) {
    // Mảng các giá trị không hợp lệ
    let invalidValues = [
        "không được để trống",
        "Không tìm thấy",
        "không có trong danh mục"
        // Thêm các giá trị không hợp lệ khác vào đây nếu cần
    ];

    // Kiểm tra xem itemCode có chứa bất kỳ giá trị không hợp lệ nào không
    return !invalidValues.some(value => itemCode.includes(value));
}

// Function kiểm tra và sửa chi tiết
function checkAndFixDetail(index = 0, maxIterations = 100) {
    var trs = document.evaluate(
        '//tr[contains(@class,"tr-values vs-table--tr tr-table-state-null select")]',
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
    );
    var trCount = trs.snapshotLength;
    

    if (index >= trCount || index >= maxIterations) {
        console.log("Đã kiểm tra xong hoặc đạt đến số lần lặp tối đa.");
        return;
    } else {
        console.log("Thực hiện tại hàng: " + (index + 1));
    }

    var tr = trs.snapshotItem(index);
    var rowData = getTableRowData(tr);
    var { itemCode, itemName, valueDVT, unitPrice, tds } = rowData;

    // In ra giá trị của các thẻ <td>
    // console.log("Giá trị của Mã hàng: " + itemCode);
    // console.log("Giá trị của Tên hàng: " + itemName);
    // console.log("Giá trị của DVT: " + valueDVT);
    // console.log("Giá trị của Đơn giá: " + unitPrice);

    // fixRowDVT(tds);

    if (!itemCode || !isItemCodeValid(itemCode)) {
        alert("[Mã hàng] tại hàng " + (index + 1) + " không hợp lệ");

        checkAndFixDetail(index + 1, maxIterations);  // Tiếp tục với hàng tiếp theo sau khi nhấn "OK"
    } else {
        verifyItemCodeWithItemName(itemCode, itemName, index);
        
        if (verifyItemCode(itemCode, unitPrice)) {
            console.log("Mã hàng khớp với Đơn giá");
            checkAndFixDetail(index + 1, maxIterations);
        } else {
            console.log("Mã hàng không khớp với Đơn giá");
            fixItemCode(tds, itemCode, unitPrice, index, maxIterations);
        }
    }
}
// Hàm chính để bắt đầu quá trình kiểm tra và sửa
checkAndFixDetail();

// Function sửa mã hàng nếu không khớp
function fixItemCode(tds, itemCode, unitPrice, index, maxIterations) {
    var itemCodeEle = tds[2];

    setTimeout(() => {
        itemCodeEle.click();
        setTimeout(() => {
            itemCodeEle.click();
            var inputField = itemCodeEle.querySelector('input.combo-input');
            if (inputField) {

                var valueOfItemCode = extractTextBeforeAmount(itemCode) + " " + getCurrency(unitPrice);
                // console.log("Enter value is: " + valueOfItemCode);
                inputField.value = valueOfItemCode;
                inputField.dispatchEvent(new Event('input'));
                inputField.dispatchEvent(new Event('change'));
            } else {
                console.log("Không tìm thấy trường nhập liệu bên trong thẻ <td>");
            }
            setTimeout(() => {
                simulateTabKey(inputField);
                setTimeout(() => {
                    itemCode = tds[2].textContent;
                    if (!itemCode.includes("Mã hàng")) {
                        console.log("Information ok");
                        checkAndFixDetail(index + 1, maxIterations);
                    } else {
                        alert("Kiểm tra lại giá trị [Mã hàng] tại hàng số " + (index + 1));

                        checkAndFixDetail(index + 1, maxIterations);  // Tiếp tục với hàng tiếp theo sau khi nhấn "OK"
                    }
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

// Function để trích xuất phần văn bản trước số tiền
function extractTextBeforeAmount(str) {
    var regex = /^(.+?)\s+\d+k$/;
    var match = str.match(regex);
    return match ? match[1] : null;
}

// Function để xoá dấu tiếng việt
function removeVietnameseAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

// Function kiểm tra 2 chuỗi
function checkStrings(string1, string2, rowNumber) {
    if (areWordsContained(string1, string2)) {
        console.log("Hai gía trị [Mã hàng] và [Tên hàng] trùng khớp.")
        return true;
    } else {
        alert("Hai giá trị [Mã hàng] và [Tên hàng] không khớp tại hàng số " + rowNumber);
        
        return false;
    }
}

// Function so sánh 2 từ bằng cách tách chuỗi
function areWordsContained(string1, string2) {
    // Loại bỏ các từ viết tắt
    const resString1 = expandAbbreviations(string1, abbreviations);
    const resString2 = expandAbbreviations(string2, abbreviations);
    
    // Tách các chuỗi thành mảng từ
    const words1 = resString1.split(' ');
    const words2 = resString2.split(' ');

    // console.log("Giá trị của string 1 là: " + words1);
    // console.log("Giá trị của string 2 là: " + words2);

    // Tạo các tập hợp từ mảng từ
    const set1 = new Set(words1);
    const set2 = new Set(words2);

    // Kiểm tra xem set1 có phải là tập con của set2 hoặc ngược lại
    const isSubset1 = [...set1].every(word => set2.has(word));
    const isSubset2 = [...set2].every(word => set1.has(word));

    return isSubset1 || isSubset2;
}

function expandAbbreviations(inputString, abbreviations) {
    // Tạo một bản sao của chuỗi đầu vào để thực hiện thay thế
    let resultString = inputString;

    // Duyệt qua từng cặp viết tắt và từ đầy đủ trong từ điển
    for (const [abbreviation, fullForm] of Object.entries(abbreviations)) {
        // Tạo biểu thức chính quy để tìm viết tắt
        const regex = new RegExp(`\\b${abbreviation}\\b`, 'g');
        // Thay thế viết tắt bằng từ đầy đủ
        resultString = resultString.replace(regex, fullForm);
    }

    return resultString;
}

// Function chuyển đổi đơn vị tiền tệ
function convertCurrency(input) {
    var regex = /(\d{1,3}(?:\.\d{3})*),\d{2}/;
    return input.replace(regex, match => {
        let numberString = match.replace(/\./g, '').replace(/,\d{2}/, '');
        let number = parseInt(numberString, 10);
        let numberK = Math.floor(number / 1000);
        return numberK + 'k';
    });
}

// Function lấy giá trị tiền tệ - nếu có chuỗi
function getCurrency(input) {
    var res = convertCurrency(input);
    if (res.includes("Đơn")) {
        const regex = /\b\d+k\b/;
        const match = res.match(regex);

        if (match) {
            res =  match[0];
        } else {
            console.log("No match found");
        }
    }
    // console.log("[Đơn giá] convert to K is : " + res);
    return res;
}
// Function kiểm tra mã hàng với tên hàng
function verifyItemCodeWithItemName(itemCode, itemName, index) {
    var itemNameNoCode = extractTextBeforeAmount(itemCode);
    var itemNameAfter = removeVietnameseAccents(itemName);
    checkStrings(itemNameAfter.toLowerCase(), itemNameNoCode.toLowerCase(), index + 1);
}

// Function kiểm tra mã hàng với đơn giá
function verifyItemCode(itemCode, unitPrice) {
    var itemNameNoCode = extractTextBeforeAmount(itemCode);
    var convertUnitPriceToK = convertCurrency(unitPrice);
    return itemNameNoCode + " " + convertUnitPriceToK === itemCode;
}

// Function để mô phỏng phím Tab
function simulateTabKey(element) {
    var keyboardEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Tab',
        code: 'Tab',
        keyCode: 9,
        which: 9,
        shiftKey: false
    });
    element.dispatchEvent(keyboardEvent);
}

// Function sửa lỗi DVT
function fixRowDVT(tds) {
    var valueDVT = tds[7];
    setTimeout(() => {
        valueDVT.click();
        console.log("Click done");
    }, 1000);
}