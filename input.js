function checkAmountAndClick() {
    // Bước 1: Lấy giá trị từ thẻ <h1>
    const summaryElement = document.querySelector('.summary-info-number');
    const summaryText = summaryElement.innerText;

    // Bước 2: Chuyển đổi giá trị thành số
    const summaryNumber = parseFloat(summaryText.replace(/\./g, ''));

    // Bước 3: Kiểm tra giá trị có lớn hơn 20.000.000 đồng không
    const threshold = 20000000;
    const isGreaterThanThreshold = summaryNumber > threshold;

    // Bước 4: Thực hiện click vào thẻ <div> tương ứng
    if (isGreaterThanThreshold) {
        // Nếu giá trị lớn hơn 20.000.000 đồng
        const unpaidDiv = Array.from(document.querySelectorAll('.tooltip-content'))
                            .find(div => div.innerText === 'Chưa thanh toán');
        if (unpaidDiv) unpaidDiv.click();
    } else {
        // Nếu giá trị nhỏ hơn hoặc bằng 20.000.000 đồng
        const payNowDiv = Array.from(document.querySelectorAll('.tooltip-content'))
                            .find(div => div.innerText === 'Thanh toán ngay');
        if (payNowDiv) payNowDiv.click();
    }
}
// Gọi hàm để kiểm tra số tiền và click
checkAmountAndClick();


function checkSupplierCodeValidity() {
    var element = document.evaluate("//div[text()='Mã nhà cung cấp']//ancestor::div[@class='con-ms-tooltip']//following-sibling::span//descendant::input[@class='combo-input']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var value = element.value;
    if (value) {
      console.log("Mã nhà cung cấp hợp lệ:", value);
    } else {
      alert("Mã nhà cung cấp bị rỗng");
    }
}
// Gọi hàm để kiểm tra mã nhà cung cấp
checkSupplierCodeValidity();
  

function clickButtonsSelectRecord(recordNumber) {
    // Click vào nút thứ 15 có class là 'btn-dropdown'
    var buttonXPath1 = "(//div[@class='btn-dropdown'])[15]";
    var button1 = document.evaluate(buttonXPath1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (button1) {
      button1.click();
      // Đợi 2 giây trước khi tiếp tục
      setTimeout(function() {
        // Click vào nút có title là '100 bản ghi trên 1 trang'
        var buttonXPath2 = `//div[@title='${recordNumber} bản ghi trên 1 trang']`;
        var button2 = document.evaluate(buttonXPath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (button2) {
          button2.click();
        } else {
          console.log(`Không tìm thấy nút có title là '${recordNumber} bản ghi trên 1 trang' với XPath đã cung cấp.`);
        }
      }, 2000); // 2000 milliseconds = 2 giây
    } else {
      console.log("Không tìm thấy nút thứ 15 với XPath đã cung cấp.");
    }
  }
// Gọi hàm để thực hiện click vào cả hai nút
clickButtons(100);
  
function checkSupplierCodeValidity() {
    var element = document.evaluate("//div[text()='Mã nhà cung cấp']//ancestor::div[@class='con-ms-tooltip']//following-sibling::span//descendant::input[@class='combo-input']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var value = element.value;
    if (value) {
      console.log("Mã nhà cung cấp hợp lệ:", value);
    } else {
      alert("Mã nhà cung cấp bị rỗng");
    }
}
checkSupplierCodeValidity();

////span[text()='Mã hàng']/ancestor::thead[@class='ms-table--thead']/following-sibling::tbody//tr[1]//td[3]//input

// Start
function checkAndFixDetail() {
    // Sử dụng XPath để lấy tất cả các thẻ <tr> có class cụ thể
    var trs = document.evaluate('//tr[contains(@class,"tr-values vs-table--tr tr-table-state-null select")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    // Lấy số lượng thẻ <tr>
    var trCount = trs.snapshotLength;

    // In ra số lượng thẻ <tr>
    console.log("Số lượng thẻ <tr> có class 'tr-values vs-table--tr tr-table-state-null selected': " + trCount);

    // Sử dụng vòng lặp for để đi qua tất cả các thẻ <tr>
    for (var i = 0; i < trCount; i++) {
        var tr = trs.snapshotItem(i);

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

        // In ra giá trị của các thẻ <td>
        // console.log("Giá trị của Mã hàng: " + itemCode);
        // console.log("Giá trị của Tên hàng: " + itemName);
        // console.log("Giá trị của Đơn giá: " + unitPrice);
        
        // Verify Mã Hàng với Tên Hàng
        verifyItemCodeWithItemName(itemCode , itemName, i);

        if (verifyItemCode(itemCode , unitPrice)) {
            console.log("Mã hàng khớp với Đơn giá")
        } else {
            console.log("Mã hàng không khớp với Đơn giá")
            var itemCodeEle = tds[indexItemCode];

            setTimeout(function() {
                itemCodeEle.click();
            }, 1000);

            setTimeout(function() {
                itemCodeEle.click();
                var inputField = itemCodeEle.querySelector('input.combo-input'); // Giả sử trường nhập liệu có class "combo-input"
                if (inputField) {
                    var valueOfItemCode = extractTextBeforeAmount(itemCode) + " " + convertCurrency(unitPrice);
                    console.log("Input is: " + valueOfItemCode)
                    inputField.value = valueOfItemCode; // Đặt giá trị mới cho trường nhập liệu
                    inputField.dispatchEvent(new Event('input')); // Kích hoạt sự kiện input để cập nhật giá trị
                    inputField.dispatchEvent(new Event('change')); // Kích hoạt sự kiện change để cập nhật giá trị nếu cần
                } else {
                    console.log("Không tìm thấy trường nhập liệu bên trong thẻ <td>");
                }
            }, 1000);

            setTimeout(function() {
                tds[indexItemName].click();
                itemCode = tds[indexItemCode].textContent;
                console.log("ItemCode is: " + itemCode);
                if (!itemCode.includes("Mã hàng")) {
                    console.log("Information ok");
                } else {
                    alert("Kiểm tra lại giá trị tại hàng " + (i + 1));
                }
            }, 2000);
        }
        break;
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
    // console.log("Giá trị của Mã hàng after: " + itemNameNoCode);
    checkStrings(itemNameAfter , itemNameNoCode, index + 1)
}

function verifyItemCode(itemCode, unitPrice) {
    // Get giá trị của Mã hàng
    var itemNameNoCode = extractTextBeforeAmount(itemCode);

    // Get giá trị của đơn giá
    var convertUnitPriceToK = convertCurrency(unitPrice);
    // console.log("Giá trị của Đơn giá after: " + convertUnitPriceToK);

    var checkItemCodeWithUnitPrice = itemNameNoCode + " " + convertUnitPriceToK;
    return checkItemCodeWithUnitPrice === itemCode;
}


// Định nghĩa hàm với tham số là phím cần nhấn
function pressKey(key) {
    // Gửi sự kiện keydown với phím được chỉ định
    var event = new KeyboardEvent('keydown', {
        key: key,
        keyCode: key.charCodeAt(0),
        code: 'Key' + key.toUpperCase(),
        which: key.charCodeAt(0),
        keyCodeVal: key.charCodeAt(0),
        charCode: 0,
        bubbles: true,
        cancelable: true,
        view: window
    });

    // Gửi sự kiện đến document
    document.dispatchEvent(event);
}

// End

