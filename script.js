const csvURL="https://docs.google.com/spreadsheets/d/e/2PACX-1vT4-ZYfNA55ZyglkodD4P-phpjaUPfcLeg-vWe9h-olz3ZNB328JlBvOjyAzl1bCOYL2zNlZiduIg1S/pub?gid=228209258&single=true&output=csv";

let dealers=[];

fetch(csvURL)
.then(r=>r.text())
.then(csv=>{

const rows=csv.trim().split("\n").map(r=>r.split(","));

rows.shift();

dealers=rows.map(r=>({

name:r[0]?.replace(/"/g,""),

phone:r[1]?.replace(/"/g,""),

province:r[2]?.replace(/"/g,""),

district:r[3]?.replace(/"/g,""),

map:r[4]?.replace(/"/g,""),

facebook:r[5]?.replace(/"/g,"")

}));

loadProvince();

});

function loadProvince(){

const province=document.getElementById("province");

const list=[...new Set(dealers.map(d=>d.province))].sort();

list.forEach(p=>{

province.innerHTML+=`<option value="${p}">${p}</option>`;

});

}

document.getElementById("province").addEventListener("change",()=>{

const province=document.getElementById("province").value;

const district=document.getElementById("district");

district.innerHTML='<option>เลือกเขต / อำเภอ</option>';

const list=[...new Set(

dealers.filter(d=>d.province==province)

.map(d=>d.district)

)].sort();

list.forEach(d=>{

district.innerHTML+=`<option value="${d}">${d}</option>`;

});

});

document.getElementById("searchBtn").onclick=()=>{

const province=document.getElementById("province").value;

const district=document.getElementById("district").value;

const result=document.getElementById("result");

result.innerHTML="";

const data=dealers.filter(d=>

d.province==province &&

d.district==district

);

if(data.length==0){

result.innerHTML="<p>ไม่พบร้านตัวแทนจำหน่าย</p>";

return;

}

data.forEach(d=>{

result.innerHTML+=`

<div class="result-card">

<h3>${d.name}</h3>

<p>📞 ${d.phone}</p>

<p>

<a href="${d.map}" target="_blank">

Google Maps

</a>

&nbsp;&nbsp;

<a href="${d.facebook}" target="_blank">

Facebook

</a>

</p>

</div>

`;

});

};
