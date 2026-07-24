// ==============================
// CST Dealer Locator v3.0
// ==============================

const csvURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vT4-ZYfNA55ZyglkodD4P-phpjaUPfcLeg-vWe9h-olz3ZNB328JlBvOjyAzl1bCOYL2zNlZiduIg1S/pub?gid=228209258&single=true&output=csv";

let dealerData = [];

const provinceSelect = document.getElementById("province");
const districtSelect = document.getElementById("district");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

const loading = document.getElementById("loading");
const resultCount = document.getElementById("resultCount");
const results = document.getElementById("results");


// ==============================
// โหลดข้อมูล CSV
// ==============================

async function loadDealerData() {

    loading.style.display = "block";

    try {

        const response = await fetch(csvURL);

        const csv = await response.text();

        dealerData = parseCSV(csv);

        createProvinceList();

    } catch (err) {

        console.error(err);

        results.innerHTML =
        "<div class='no-result'>ไม่สามารถโหลดข้อมูลได้</div>";

    }

    loading.style.display = "none";

}



// ==============================
// แปลง CSV
// ==============================

function parseCSV(csv) {

    const rows = csv.trim().split(/\r?\n/);

    const headers = rows.shift().split(",");

    return rows.map(row => {

        const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

        let obj = {};

        headers.forEach((header, index) => {

            obj[header.trim()] =
            values[index]
            ? values[index].replace(/^"|"$/g, "").trim()
            : "";

        });

        return obj;

    });

}



// ==============================
// จังหวัด
// ==============================

function createProvinceList() {

    const provinces =
    [...new Set(
        dealerData.map(item => item["จังหวัด"])
    )].sort();

    provinceSelect.innerHTML =
    '<option value="">-- เลือกจังหวัด --</option>';

    provinces.forEach(province => {

        const option = document.createElement("option");

        option.value = province;

        option.textContent = province;

        provinceSelect.appendChild(option);

    });

}// ==============================
// เปลี่ยนจังหวัด → โหลดอำเภอ
// ==============================

provinceSelect.addEventListener("change", () => {

    const province = provinceSelect.value;

    districtSelect.innerHTML =
        '<option value="">-- เลือกเขต / อำเภอ --</option>';

    if (!province) {
        districtSelect.disabled = true;
        return;
    }

    const districts = [...new Set(

        dealerData
            .filter(item => item["จังหวัด"] === province)
            .map(item => item["เขต/อำเภอ"])
            .filter(Boolean)

    )].sort();

    districts.forEach(district => {

        const option = document.createElement("option");

        option.value = district;

        option.textContent = district;

        districtSelect.appendChild(option);

    });

    districtSelect.disabled = false;

});



// ==============================
// ค้นหาร้านค้า
// ==============================

searchBtn.addEventListener("click", () => {

    let filtered = dealerData;

    if (provinceSelect.value) {

        filtered = filtered.filter(item =>
            item["จังหวัด"] === provinceSelect.value
        );

    }

    if (districtSelect.value) {

        filtered = filtered.filter(item =>
            item["เขต/อำเภอ"] === districtSelect.value
        );

    }

    displayResults(filtered);

});



// ==============================
// Reset
// ==============================

resetBtn.addEventListener("click", () => {

    provinceSelect.value = "";

    districtSelect.innerHTML =
        '<option value="">-- เลือกเขต / อำเภอ --</option>';

    districtSelect.disabled = true;

    resultCount.textContent = "";

    results.innerHTML = "";

});// ==============================
// แสดงผลร้านค้า
// ==============================

function displayResults(list) {

    resultCount.textContent = `พบทั้งหมด ${list.length} ร้าน`;

    if (list.length === 0) {

        results.innerHTML =
        "<div class='no-result'>ไม่พบร้านค้าตามเงื่อนไขที่เลือก</div>";

        return;
    }

    results.innerHTML = "";

    list.forEach(item => {

        const mapLink =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(
            `${item["ชื่อร้าน"]} ${item["เขต/อำเภอ"]} ${item["จังหวัด"]}`
        );

        const facebook =
        item["Social Media"] || "";

        results.innerHTML += `

        <div class="card">

            <div class="store-name">
                ${item["ชื่อร้าน"]}
            </div>

            <div class="info">
                📞 ${item["เบอร์โทร"] || "-"}
            </div>

            <div class="info">
                📍 ${item["เขต/อำเภอ"]},
                ${item["จังหวัด"]}
            </div>

            <div class="action-buttons">

                <a
                    href="${mapLink}"
                    target="_blank"
                    class="map-btn">

                    Google Maps

                </a>

                ${
                    facebook
                    ?
                    `<a
                        href="${facebook}"
                        target="_blank"
                        class="fb-btn">
                        Facebook
                    </a>`
                    :
                    ""
                }

            </div>

        </div>

        `;

    });

}



// ==============================
// เริ่มโหลดข้อมูล
// ==============================

loadDealerData();
