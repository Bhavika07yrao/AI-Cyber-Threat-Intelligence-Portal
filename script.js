let threats = [];
let threatId = 1;

const types = ["Ransomware","Phishing","Malware","DDoS","Zero-Day"];
const industries = ["Finance","Healthcare","Tech","Government","Retail"];

let pieChart, lineChart;

/* -----------------------------
   TAB SWITCH
------------------------------ */
function showTab(tab){
document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
document.getElementById(tab).classList.add("active");
}

/* -----------------------------
   INIT CHARTS
------------------------------ */
function initCharts(){

pieChart = new Chart(document.getElementById("threatPie"),{
type:"pie",
data:{
labels:types,
datasets:[{
data:types.map(()=>0),
backgroundColor:["#ef4444","#f97316","#eab308","#3b82f6","#8b5cf6"]
}]
}
});

lineChart = new Chart(document.getElementById("threatLine"),{
type:"line",
data:{
labels:[],
datasets:[{
label:"Threat Growth",
data:[],
borderColor:"#38bdf8",
tension:0.3
}]
}
});
}

/* -----------------------------
   GENERATE THREAT
------------------------------ */
function generateThreat(){

let type = types[Math.floor(Math.random()*types.length)];
let industry = industries[Math.floor(Math.random()*industries.length)];

let baseWeight = {
"Ransomware":80,
"Phishing":50,
"Malware":60,
"DDoS":70,
"Zero-Day":90
}[type];

let industryWeight = {
"Finance":20,
"Healthcare":25,
"Tech":15,
"Government":30,
"Retail":10
}[industry];

let score = baseWeight + industryWeight + Math.floor(Math.random()*20);

let severity = "Low";
if(score>120) severity="Critical";
else if(score>100) severity="High";
else if(score>80) severity="Medium";

let threat = {
id: threatId++,
type,
industry,
score,
severity,
time: new Date().toLocaleTimeString()
};

threats.unshift(threat);

updateDashboard();
renderLog();
updateCharts();
generateInsight();
}

/* -----------------------------
   DASHBOARD UPDATE
------------------------------ */
function updateDashboard(){

document.getElementById("totalThreats").innerText = threats.length;

document.getElementById("criticalCount").innerText =
threats.filter(t=>t.severity==="Critical").length;

document.getElementById("industryCount").innerText =
new Set(threats.map(t=>t.industry)).size;
}

/* -----------------------------
   LOG RENDER
------------------------------ */
function renderLog(){

let filterType = document.getElementById("filterType").value;
let filterSeverity = document.getElementById("filterSeverity").value;

let filtered = threats.filter(t=>{
return (filterType==="All" || t.type===filterType) &&
(filterSeverity==="All" || t.severity===filterSeverity);
});

let body="";
filtered.forEach(t=>{
body+=`<tr>
<td>${t.id}</td>
<td>${t.type}</td>
<td>${t.industry}</td>
<td>${t.severity}</td>
<td>${t.score}</td>
<td>${t.time}</td>
</tr>`;
});

document.getElementById("logBody").innerHTML=body;
}

/* -----------------------------
   CHART UPDATE
------------------------------ */
function updateCharts(){

pieChart.data.datasets[0].data =
types.map(type=>threats.filter(t=>t.type===type).length);
pieChart.update();

if(lineChart.data.labels.length>20){
lineChart.data.labels.shift();
lineChart.data.datasets[0].data.shift();
}

lineChart.data.labels.push(threats.length);
lineChart.data.datasets[0].data.push(threats.length);
lineChart.update();
}

/* -----------------------------
   AI INSIGHT
------------------------------ */
function generateInsight(){

if(threats.length<1) return;

let latest = threats[0];

document.getElementById("aiInsight").innerText =
`AI Insight: ${latest.type} threats targeting ${latest.industry} show ${latest.severity} risk with score ${latest.score}.`;
}

/* -----------------------------
   INIT FILTER
------------------------------ */
function initFilters(){
types.forEach(type=>{
let opt=document.createElement("option");
opt.textContent=type;
document.getElementById("filterType").appendChild(opt);
});
}

/* -----------------------------
   START SYSTEM
------------------------------ */
window.onload = function(){
initCharts();
initFilters();
setInterval(generateThreat,4000);
};