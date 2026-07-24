const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT4-ZYfNA55ZyglkodD4P-phpjaUPfcLeg-vWe9h-olz3ZNB328JlBvOjyAzl1bCOYL2zNlZiduIg1S/pub?gid=228209258&single=true&output=csv";

let dealers = [];

const provinceSelect = document.getElementById("province");
const districtSelect = document.getElementById("district");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");
const resultCount = document.getElementById("resultCount");
const loading = document.getElementById("loading");

loading.style.display = "block";

Papa.parse(csvURL, {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function (results) {

        loading.style.display = "none";

        dealers = results.data;

        loadProvince();

    },

    error: function () {

        loading.style.display = "none";

        result.innerHTML = `
            <div class="result-card">
                <h3>เกิดข้อผิดพลาด</h3>
                <p>ไม่สามารถโหลดข้อมูลร้านค้าได้</p>
            </div>
        `;

    }

});

function loadProvince() {

    const provinces = [...new Set(

        dealers
            .map(item => item["จังหวัด"]?.trim())
            .filter(Boolean)

    )].sort();

    provinceSelect.innerHTML =
        '<option value="">เลือกจังหวัด</option>';

    provinces.forEach(province => {

        provinceSelect.innerHTML += `
            <option value="${province}">
                ${province}
            </option>
        `;

    });

}

provinceSelect.addEventListener("change", function () {

    const province = this.value;

    districtSelect.innerHTML =
        '<option value="">เลือกเขต / อำเภอ</option>';

    if (!province) return;

    const districts = [...new Set(

        dealers
            .filter(item => item["จังหวัด"] === province)
            .map(item => item["เขต/อำเภอ"]?.trim())
            .filter(Boolean)

    )].sort();

    districts.forEach(district => {

        districtSelect.innerHTML += `
            <option value="${district}">
                ${district}
            </option>
        `;

    });

});

searchBtn.addEventListener("click", function () {

    const province = provinceSelect.value;
    const district = districtSelect.value;

    result.innerHTML = "";
    resultCount.innerHTML = "";

    if (!province) {

        alert("กรุณาเลือกจังหวัด");

        return;

    }

    let filtered = dealers.filter(item => {

        if (district === "") {

            return item["จังหวัด"] === province;

        }

        return item["จังหวัด"] === province &&
               item["เขต/อำเภอ"] === district;

    });

    resultCount.innerHTML =
        `พบทั้งหมด ${filtered.length} ร้าน`;

    if (filtered.length === 0) {

        result.innerHTML = `
            <div class="result-card">

                <h3>ไม่พบร้านค้า</h3>

                <p>
                    ไม่พบตัวแทนจำหน่ายในพื้นที่ที่เลือก
                </p>

            </div>
        `;

        return;

    }

    filtered.forEach(shop => {

        result.innerHTML += `

        <div class="result-card">

            <h3>${shop["ชื่อร้าน"] || "-"}</h3>

            <p>📞 ${shop["เบอร์โทร"] || "-"}</p>

            <p>📍 ${shop["จังหวัด"]} ${shop["เขต/อำเภอ"]}</p>

            <div class="button-group">

                <a
                    class="map-btn"
                    href="${shop["Map"]}"
                    target="_blank">

                    Google Maps

                </a>

                <a
                    class="fb-btn"
                    href="${shop["Social Media"]}"
                    target="_blank">

                    Facebook

                </a>

            </div>

        </div>

        `;

    });

});
