// Other

function checkAndFixDetail(index = 0, maxIterations = 1) {
    // Sử dụng XPath để lấy tất cả các thẻ <tr> có class cụ thể
    var trs = document.evaluate('//tr[contains(@class,"tr-values vs-table--tr tr-table-state-null select")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    // Lấy số lượng thẻ <tr>
    var trCount = trs.snapshotLength;

    // Nếu đã kiểm tra hết các hàng, dừng đệ quy
    if (index >= trCount || index >= maxIterations) {
        console.log("Đã kiểm tra xong hoặc đạt đến số lần lặp tối đa.");
        return;
    }

    var tr = trs.snapshotItem(index);

    // Lấy tất cả các thẻ <td> bên trong thẻ <tr>
    var tds = tr.getElementsByTagName('td');

    // Get index
    var indexItemCode = 2;
    var indexItemName = 3;
    var indexUnitPrice = 9;

    // Lấy giá trị của các thẻ <td> mà bạn quan tâm
    var itemCode = tds[indexItemCode].textContent; // Giá trị của mã hàng
    var itemName = tds[indexItemName].textContent; // Giá trị của Tên hàng
    var unitPrice = tds[indexUnitPrice].textContent; // Giá trị của Đơn giá

    console.log("Giá trị của Mã hàng: " + itemCode);

    if (itemCode === null || itemCode.length === 0) {
        alert("Mã hàng tại hàng " + (index + 1) + " không hợp lệ");
    } else {
        // Verify Mã Hàng với Tên Hàng
        verifyItemCodeWithItemName(itemCode, itemName, index);

        if (verifyItemCode(itemCode, unitPrice)) {
            console.log("Mã hàng khớp với Đơn giá");
            // Tiếp tục kiểm tra hàng tiếp theo sau khi đã hoàn thành
            checkAndFixDetail(index + 1);
        } else {
            console.log("Mã hàng không khớp với Đơn giá");
            var itemCodeEle = tds[indexItemCode];

            setTimeout(function() {
                itemCodeEle.click();

                setTimeout(function() {
                    itemCodeEle.click();
                    var inputField = itemCodeEle.querySelector('input.combo-input'); // Giả sử trường nhập liệu có class "combo-input"
                    if (inputField) {
                        var valueOfItemCode = extractTextBeforeAmount(itemCode) + " " + convertCurrency(unitPrice);
                        console.log("Input is: " + valueOfItemCode);
                        inputField.value = valueOfItemCode; // Đặt giá trị mới cho trường nhập liệu
                        inputField.dispatchEvent(new Event('input')); // Kích hoạt sự kiện input để cập nhật giá trị
                        inputField.dispatchEvent(new Event('change')); // Kích hoạt sự kiện change để cập nhật giá trị nếu cần
                    } else {
                        console.log("Không tìm thấy trường nhập liệu bên trong thẻ <td>");
                    }

                    setTimeout(function() {
                        tds[indexItemName].click();
                        itemCode = tds[indexItemCode].textContent;
                        // console.log("ItemCode is: " + itemCode);
                        if (!itemCode.includes("Mã hàng")) {
                            console.log("Information ok");
                            // Tiếp tục kiểm tra hàng tiếp theo sau khi đã hoàn thành
                            checkAndFixDetail(index + 1);
                        } else {
                            alert("Kiểm tra lại giá trị tại hàng " + (index + 1));
                        }
                    }, 1000);
                }, 1000);
            }, 1000);
        }
    }

    
}

checkAndFixDetail();

// Function để trích xuất phần văn bản trước số tiền
function extractTextBeforeAmount(str) {
    // Biểu thức chính quy để trích xuất phần văn bản trước số và ký tự 'k'
    var regex = /^(.+?)\s+\d+k$/;
    var match = str.match(regex);
    if (match) {
        return match[1]; // Phần văn bản trước số và ký tự 'k'
    } else {
        return null; // Không khớp với biểu thức chính quy
    }
}

// Function để xoá dấu tiếng việt
function removeVietnameseAccents(str) {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd')
              .replace(/Đ/g, 'D');
}

// Function kiểm tra 2 chuỗi
function checkStrings(string1, string2, rowNumber) {
    console.log("Hai giá trị " + string1 + " và " + string2);
    if (string2.includes(string1) || string1.includes(string2)) {
        return true;
    } else {
        alert("Kiểm tra lại giá trị tại hàng " + rowNumber);
    }
}

function convertCurrency(input) {
    // Tạo regex để tìm kiếm và thay thế dấu chấm và dấu phẩy
    var regex = /(\d{1,3}(?:\.\d{3})*),\d{2}/;

    // Hàm thay thế số dạng 1.368.640,00 thành 1368k
    var result = input.replace(regex, function(match) {
        // Loại bỏ dấu chấm và dấu phẩy
        let numberString = match.replace(/\./g, '').replace(/,\d{2}/, '');
        // Chuyển thành số nguyên
        let number = parseInt(numberString, 10);
        // Chia số cho 1000 và làm tròn xuống để lấy số k
        let numberK = Math.floor(number / 1000);
        // Thêm chữ 'k' vào cuối chuỗi
        return numberK + 'k';
    });

    return result;
}

function verifyItemCodeWithItemName(itemCode, itemName, index) {
    var itemNameNoCode = extractTextBeforeAmount(itemCode);
    var itemNameAfter = removeVietnameseAccents(itemName);
    checkStrings(itemNameAfter, itemNameNoCode, index + 1);
}

function verifyItemCode(itemCode, unitPrice) {
    // Get giá trị của Mã hàng
    var itemNameNoCode = extractTextBeforeAmount(itemCode);

    // Get giá trị của đơn giá
    var convertUnitPriceToK = convertCurrency(unitPrice);

    var checkItemCodeWithUnitPrice = itemNameNoCode + " " + convertUnitPriceToK;
    return checkItemCodeWithUnitPrice === itemCode;
}
