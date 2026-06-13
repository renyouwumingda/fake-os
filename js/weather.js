// ===== 天气 =====
var weatherState = { temp: 25, step: 0, eyeCount: 0, tempClicks: 0, timer: null };

var FORECASTS = [
  {day:"周一",icon:"☀️",temp:"25°C",desc:"晴"},
  {day:"周二",icon:"⛅",temp:"22°C",desc:"多云"},
  {day:"周三",icon:"🌧️",temp:"??°C",desc:"有东西在靠近"},
  {day:"周四",icon:"👁️",temp:"???",desc:"别出门"},
  {day:"周五",icon:"💀",temp:"∞",desc:"如果还活着"},
];

var WEATHER_STATES = ["晴","多云","局部地区有异常","检测到未知实体","适合逃跑","有东西在移动"];
var CITIES = ["北京","上海","你家楼下","█████","[数据已损坏]"];

function openWeather() {
  weatherState = { temp: 25, step: 0, eyeCount: 0, tempClicks: 0, timer: null };

  var city = CITIES[Math.floor(Math.random() * CITIES.length)];
  var mainIcon = "☀️";

  var forecastHtml = "";
  FORECASTS.forEach(function(f) {
    forecastHtml += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:12px;">'
      + '<span style="width:40px;">' + f.day + '</span>'
      + '<span>' + f.icon + '</span>'
      + '<span style="width:50px;text-align:right;">' + f.temp + '</span>'
      + '<span style="flex:1;text-align:right;color:rgba(255,255,255,0.5);">' + f.desc + '</span>'
      + '</div>';
  });

  var content = '<div style="padding:20px;text-align:center;height:100%;box-sizing:border-box;display:flex;flex-direction:column;">'
    + '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:4px;" id="weather-city">' + city + '</div>'
    + '<div id="weather-icon" style="font-size:48px;margin:8px 0;transition:all 0.5s;">☀️</div>'
    + '<div id="weather-temp" style="font-size:42px;font-weight:300;color:#fff;cursor:pointer;margin:4px 0;">25°C</div>'
    + '<div id="weather-status" style="font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:16px;">晴</div>'
    + '<div style="text-align:left;border-top:1px solid rgba(255,255,255,0.08);padding-top:12px;">'
    + '<div style="font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:8px;">5日预报</div>'
    + forecastHtml
    + '</div></div>';

  var win = createWindow("weather", "🌤️ 天气", 350, 320, content);

  var tempEl = document.getElementById("weather-temp");
  tempEl.addEventListener("click", function() {
    weatherState.tempClicks++;
    if (weatherState.tempClicks >= 5) {
      showAlert("⚠️ 天气预警", "天气预报仅供参考。\n你在的那个世界可能不存在。");
      weatherState.tempClicks = 0;
    }
  });

  weatherState.timer = setInterval(function() {
    weatherState.step++;
    if (weatherState.step >= 6) {
      clearInterval(weatherState.timer);
      return;
    }
    var temps = ["28°C","35°C","??°C","∞","???","ERR"];
    var states = WEATHER_STATES;
    var icons = ["⛅","🌧️","⛈️","👁️","💀","☠️"];

    var tEl = document.getElementById("weather-temp");
    var sEl = document.getElementById("weather-status");
    var iEl = document.getElementById("weather-icon");
    if (!tEl) { clearInterval(weatherState.timer); return; }

    tEl.textContent = temps[weatherState.step] || "∞";
    sEl.textContent = states[weatherState.step] || "???";
    iEl.textContent = icons[weatherState.step] || "👁️";

    if (weatherState.step >= 3) {
      tEl.style.color = "#f55";
      sEl.style.color = "#f55";
    }
  }, 10000);

  var origClose = win.el.querySelector(".window-ctrl-btn.close");
  if (origClose) {
    var id = "weather";
    origClose.addEventListener("click", function() { clearInterval(weatherState.timer); });
  }
}
