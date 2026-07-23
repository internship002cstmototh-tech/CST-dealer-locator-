const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT4-ZYfNA55ZyglkodD4P-phpjaUPfcLeg-vWe9h-olz3ZNB328JlBvOjyAzl1bCOYL2zNlZiduIg1S/pub?gid=228209258&single=true&output=csv";

let dealers = [];

const provinceSelect = document.getElementById("province");
const districtSelect = document.getElementById("district");
const result = document.getElementById("result");

Papa.parse(csvURL, {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function (results) {

        dealers = results.data;

        loadProvince();

    }

});

function loadProvince() {

    const provinces = [...new Set(

        dealers.map(d => d["จังหวัด"]).filter(Boolean)

    )].sort();

    provinces.forEach(p => {

        const option = document.createElement("option");

        option.value = p;

        option.textContent = p;

        provinceSelect.appendChild(option);

    });

}

provinceSelect.addEventListener("change", () => {

    districtSelect.innerHTML = '<option value="">เลือกเขต / อำเภอ</option>';

    const province = provinceSelect.value;

    const districts = [...new Set(

        dealers
        .filter(d => d["จังหวัด"] === province)
        .map(d => d["เขต"])
        .filter(Boolean)

    )].sort();

    districts.forEach(d => {

        const option = document.createElement("option");

        option.value = d;

        option.textContent = d;

        districtSelect.appendChild(option);

    });

});

document.getElementById("searchBtn").addEventListener("click", () => {

    result.innerHTML = "";

    const province = provinceSelect.value;

    const district = districtSelect.value;

    const filtered = dealers.filter(d =>

        d["จังหวัด"] === province &&
        d["เขต"] === district

    );

    if (filtered.length === 0) {

        result.innerHTML = `
            <div class="result-card">
                <p>ไม่พบตัวแทนจำหน่ายในพื้นที่นี้</p>
            </div>
        `;

        return;

    }

    filtered.forEach(d => {

        result.innerHTML += `

        <div class="result-card">

            <h3>${d["ชื่อร้าน"] || ""}</h3>

            <p>📞 ${d["เบอร์โทร"] || "-"}</p>

            <p>

                <a href="${d["Map"]}" target="_blank">
                📍 Google Maps
                </a>

                &nbsp;&nbsp;

                <a href="${d["Social Media"]}" target="_blank">
                🌐 Facebook
                </a>

            </p>

        </div>

        `;

    });

});
