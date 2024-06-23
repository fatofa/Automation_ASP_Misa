// Function lấy dữ liệu từ một hàng (tr)
function getTableRowData(tr) {
    var tds = tr.getElementsByTagName('td');
    var indexItemCode = 2;
    var indexItemName = 3;
    var indexUnitQuantity = 7;
    var indexUnitPrice = 8;

    return {
        itemCode: tds[indexItemCode].textContent,
        itemName: tds[indexItemName].textContent,
        unitQuantity: tds[indexUnitQuantity].textContent,
        unitPrice: tds[indexUnitPrice].textContent,
        tds: tds
    };
}

// Ký tự viết tắt
const abbreviations = {
    "at": "an toan",
    "bh": "bao ho",
    "qa": "quan ao",
    "ao gi": "ao gile",
    "cn": "cong nhan",
    "bv": "bao ve",
    "bhld": "bao ho lao dong",
    "pq": "phan quang",
    "pccc": "phong chay chua chay"
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
async function checkAndFixDetail(index = 0, maxIterations = 1) {
    const unpaidDiv = Array.from(document.querySelectorAll('.tooltip-content'))
                            .find(div => div.innerText === 'Chưa thu tiền');
        if (unpaidDiv) unpaidDiv.click();

    // Lấy tất cả các <tbody> trong <table> có class="ms-table"
    var table = document.evaluate(
        '//table[@class="ms-table"]//tbody',
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
    );

    // Tính tổng số lượng các thẻ <tr> trong tất cả các <tbody>
    var trCount = 0;
    for (var i = 0; i < table.snapshotLength; i++) {
        var tbody = table.snapshotItem(i);
        var trs = document.evaluate(
            './/tr',
            tbody,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        trCount += trs.snapshotLength;
    }

    console.log("Giá trị của trCount = " + trCount);

    if (index >= trCount || index >= maxIterations) {
        console.log("Đã kiểm tra xong hoặc đạt đến số lần lặp tối đa.");
        return;
    } else {
        console.log("Thực hiện tại hàng: " + (index + 1));
    }

    // Tìm thẻ <tr> tại chỉ số hiện tại
    var trIndex = 0;
    var tr;
    for (var i = 0; i < table.snapshotLength; i++) {
        var tbody = table.snapshotItem(i);
        var trs = document.evaluate(
            './/tr',
            tbody,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        if (index < trIndex + trs.snapshotLength) {
            tr = trs.snapshotItem(index - trIndex);
            break;
        }
        trIndex += trs.snapshotLength;
    }

    var rowData = getTableRowData(tr);
    var { itemCode, itemName, unitQuantity, unitPrice, tds } = rowData;

    // In ra giá trị của các thẻ <td>
    // console.log("Giá trị của Mã hàng: " + itemCode);
    // console.log("Giá trị của Tên hàng: " + itemName);
    // console.log("Giá trị của Số lượng: " + unitQuantity);
    // console.log("Giá trị của Đơn giá: " + unitPrice);

    if (!itemCode || !isItemCodeValid(itemCode)) {
        alert("[Mã hàng] tại hàng " + (index + 1) + " không hợp lệ");

        await checkAndFixDetail(index + 1, maxIterations);  // Tiếp tục với hàng tiếp theo sau khi nhấn "OK"
    } else {
        await fixItemCodeOutput(tds, itemCode, unitQuantity, unitPrice, index + 1);
        await checkAndFixDetail(index + 1, maxIterations);
    }
}

// Hàm chính để bắt đầu quá trình kiểm tra và sửa
checkAndFixDetail();

// Function fix item code Hoá đơn đầu ra
async function fixItemCodeOutput(tds, itemCode, unitQuantity, unitPrice, index) {
    var itemCodeEle = tds[2];

    await new Promise(resolve => {
        setTimeout(() => {
            itemCodeEle.click();
            resolve();
        }, 1000);
    });

    await findItemCode(itemCode, unitQuantity, unitPrice, index);
}

// Hàm để kiểm tra giá trị và click vào thẻ input nếu giá trị là "faile"
async function checkAndClickShowStockItems() {
    // Tìm thẻ input đầu tiên bằng class name
    var input = document.querySelector('input.input-switch.ms-switch--input');

    // Kiểm tra xem thẻ input có tồn tại không
    if (input) {
        // Kiểm tra giá trị của thuộc tính value
        if (input.value === "false") {
            input.click(); // Click vào thẻ input nếu giá trị là "faile"
            console.log("Element clicked");
        } else {
            console.log("Value is not 'false'");
        }
    } else {
        console.log("Input element not found in F3");
    }
}

// Function go to find Item Code
async function goToFindItemCode() {
    // Xpath show source Item Code
    var xpathSourceItemCode = '(//div[@class="btn-dropdown"])[15]';
    await clickElementByXPath(xpathSourceItemCode);

    // Xpath button F3
    var xpathFindF3 = '//div[@class="text" and text()="Tìm nhanh (F3)"]';
    await clickElementByXPath(xpathFindF3);

    await checkAndClickShowStockItems();
}

// Function find itemCode
async function findItemCode(itemCode, unitQuantity, unitPrice, index) {
    await goToFindItemCode();

    var xpathTextBoxSearch = '(//input[@placeholder="Nhập từ khóa tìm kiếm"])';
    const decreasingArray = generateDecreasingArray(getCurrency(unitPrice));
    let checkValue = false;

    for (const value of decreasingArray) {
        let valueOfItemCode = extractTextBeforeAmount(itemCode) + " " + value;

        await new Promise(resolve => {
            setTimeout(() => {
                setInputValueByXPath(xpathTextBoxSearch, valueOfItemCode);
                console.log("value is: " + valueOfItemCode);
                resolve();
            }, 1000);
        });

        const result = await new Promise(resolve => {
            setTimeout(async () => {
                const xpathTable = `(//input[@placeholder="Nhập từ khóa tìm kiếm"])/ancestor::div[contains(@class, "right-popup-content")]//following-sibling::div[contains(@class, "table-scroll")]//tr[@tabindex="0"]`;
                const valueToCompare = unitQuantity;

                try {
                    const result = await performActionIfConditionMet(xpathTable, valueToCompare);

                    if (result) {
                        console.log('Hành động click vào checkbox thành công');
                        checkValue = true;  // Gán giá trị checkValue là true nếu điều kiện thỏa mãn
                    } else {
                        console.log('Hành động click vào checkbox thất bại');
                    }
                } catch (error) {
                    console.error('Lỗi khi thực hiện performActionIfConditionMet:', error);
                }
                resolve(checkValue);
            }, 2000);
        });

        if (result) {
            break;
        }
    }

    if (!checkValue) {
        console.error("Không có giá trị phù hợp tại hàng " + index);
        var xpathBtnCancel = '(//div[text()="Hủy"])[3]';
        await clickElementByXPath(xpathBtnCancel);
    }   
}

// Function check click check box
function checkClickCheckBox() {
    const selector = 'div[data-v-4594a258].mi.mi-16.mi-checkbox-active';
    const elementExists = document.querySelector(selector) !== null;
    return elementExists;
}

// Function select item
async function performActionIfConditionMet(xpath, valueToCompare) {
    try {
        const trElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (!trElement) {
            throw new Error('Không tìm thấy phần tử <tr> với XPath đã cung cấp.');
        }
        const tdElements = trElement.querySelectorAll('td');

        // Lấy giá trị ô số 4 (index 3 trong mảng tdElements)
        const valueQuantityInStock = parseInt(tdElements[4].textContent.trim());
        let valueQuantity = Math.floor(parseFloat(valueToCompare.replace(",", ".")));

        // So sánh giá trị ô số 4 với valueToCompare
        if (valueQuantityInStock >= valueQuantity) {
            var xpathCheckBox = '((//input[@placeholder="Nhập từ khóa tìm kiếm"])/ancestor::div[contains(@class, "right-popup-content")]//following-sibling::div[contains(@class, "table-scroll")]//tr[@tabindex="0"]//td[1]//span)[1]';

            await clickElementByXPath(xpathCheckBox);

            if (checkClickCheckBox()) {
                var xpathBtnConfirm = '(//div[text()="Đồng ý"])[2]';
                await clickElementByXPath(xpathBtnConfirm);
                return true;
            } else {
                alert("Kiểm tra lại click chọn sản phẩm");
            }
        } else {
            console.log('Giá trị của ô số 4 không lớn hơn', valueToCompare);
            return false; // Trả về false nếu không thỏa điều kiện so sánh
        }
    } catch (error) {
        console.log(error.message);
        return false; // Trả về false nếu có lỗi xảy ra
    }
}

// Function click By Xpath
async function clickElementByXPath(xpath) {
    await new Promise(resolve => {
        setTimeout(() => {
            var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (element) {
                element.click();
                console.log("Element clicked");
            } else {
                console.log("Element not found: " + xpath);
            }
            resolve();
        }, 1000);
    });
}

// Hàm để nhập giá trị vào input
function setInputValueByXPath(xpath, value) {
    setTimeout(() => {
        var result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        if (result.snapshotLength >= 3) {
            var element = result.snapshotItem(2);

            element.value = value;

            var event = new Event('input', { bubbles: true });
            element.dispatchEvent(event);

            console.log("Value set to:", value);
        } else {
            console.log("Input element not found");
        }
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

// Function so sánh 2 từ bằng cách tách chuỗi
function areWordsContained(string1, string2) {
    const resString1 = expandAbbreviations(string1, abbreviations);
    const resString2 = expandAbbreviations(string2, abbreviations);

    const words1 = resString1.split(' ');
    const words2 = resString2.split(' ');

    console.log("Giá trị của string 1 là: " + words1);
    console.log("Giá trị của string 2 là: " + words2);

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    const isSubset1 = [...set1].every(word => set2.has(word));
    const isSubset2 = [...set2].every(word => set1.has(word));

    return isSubset1 || isSubset2;
}

function expandAbbreviations(inputString, abbreviations) {
    let resultString = inputString;

    for (const [abbreviation, fullForm] of Object.entries(abbreviations)) {
        const regex = new RegExp(`\\b${abbreviation}\\b`, 'g');
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
            res = match[0];
        } else {
            console.log("No match found");
        }
    }
    return res;
}

function generateDecreasingArray(input) {
    const regex = /^(\d+)k$/;
    const match = input.match(regex);

    if (match) {
        let number = parseInt(match[1], 10);
        let result = [];

        for (let i = 0; i <= 5; i++) {
            result.push((number - i) + 'k');
        }

        return result;
    } else {
        throw new Error("Input không hợp lệ. Chuỗi phải có dạng số kết thúc bằng 'k'.");
    }
}
