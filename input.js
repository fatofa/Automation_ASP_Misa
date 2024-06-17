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