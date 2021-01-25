let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");
let myGoButton = document.getElementById('btn_go');
let myResetButton = document.getElementById('btn_clr');
let mySelect = document.getElementById('str_select');
let selectedTool = document.getElementById('tool');
let str_cal_headline = document.getElementById('headline').textContent.split(' ')[3] // Supervised or Hierarchical or Machine

//let date_tr = document.querySelector('tr');
let date_tbl = document.getElementById("calendar-body");
let date_td = document.querySelector("td");

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let wsaw_all_tools = ["WSAWB01", "WSAWB02", "WSAWB03", "WSAWB04", "WSAWB05", "WSAWB06", "WSAWB07", "WSAWB08", "WSAWB09", "WSAWB10", "WSAWB11", "WSAWB12", "WSAWB13", "WSAWB14", "WSAWB15", "WSAWB16", "WSAWB17", "WSAWB18", "WSAWB19", "WSAWB20", "WSAWB21", "WSAWC01"];
let wsaw_all_tools_mainRoller = ["WSAWB05", "WSAWB06", "WSAWB07", "WSAWB09", "WSAWB10", "WSAWB11", "WSAWB12", "WSAWB13", "WSAWB14", "WSAWB15", "WSAWB16", "WSAWB17", "WSAWB18", "WSAWB19", "WSAWB20", "WSAWB21", "WSAWC01"];
let arr_ncu_columns = ["Move In Datetime", "TOOL", "LOT-ID", "Predict Result", "0", "30", "60", "90", "120", "150", "180", "210", "240", "270", "300", "330", "360", "390", "420", "450", "480", "510", "540", "570", "600", "630", "660", "690", "720", "750"];

let arr_cm = ['Catch Rate', 'False Alarm', 'Accuracy'];

function Dictionary() {
	let items = {};
	this.set = function(key, value) { items[key] = value;};
	this.remove = function(key) {
    	   if(this.has(key)) {
		      delete items[key];
		      return true;
	       }
	       return false;    
    };
	this.has = function(key) { return key in items;};
	this.get = function(key) { return this.has(key) ? items[key] : undefinded;};
	this.clear = function() { items = {};};
	this.size = function() { return Object.keys(items).length;};
	this.keys = function() { return Object.keys(items);};
	this.values = function() {
            let values = {};
            for(let k in items) {
                if(this.has(k)) {
                    values.push(items[k]);
                }
            }
            return values;        
    };
}

let monthAndYear = document.getElementById("monthAndYear");
var arr_select_dates = [];
let arr_select_tools = [];
var arr_reset_objs = [];

function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
    showConfusionMatrix();
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;    
    showCalendar(currentMonth, currentYear);
    showConfusionMatrix();
}

function now() {
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    showCalendar(currentMonth, currentYear);
    showConfusionMatrix();
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
    showConfusionMatrix();
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Reset dates
function reset() {
    // Clear select dates
    arr_select_dates = [];
    arr_select_tools = [];
    
    // Clear showing dates
    document.getElementById("demo").innerHTML = "";
    
    showCalendar(currentMonth, currentYear);
    showConfusionMatrix();
    
    // Jump to Today
    //now();
    
    return;
}

function reset_objs() {
    for (var i=0; i<arr_reset_objs.length; i++) {
        var obj_img = document.getElementById(arr_reset_objs[i]);
        if (obj_img) {
            obj_img.parentNode.removeChild(obj_img);
        }
    }
}

myResetButton.onclick = function() {
    // Roller or Alarm logs
    if (document.getElementById('headline').textContent.split(' ')[0] === 'Main' || document.getElementById('headline').textContent.split(' ')[0] === 'Alarm') { reset_objs();}
    
    // 41,61,20,HPM
    if (str_cal_headline === 'Supervised') {
        reset_objs();
        reset();
    } else if (str_cal_headline === 'Hierarchical' && document.getElementById("table_hpm")) {
        var obj_log = document.getElementById("table_hpm");
        obj_log.parentNode.removeChild(obj_log);
    }
    
    // NCU
    var tmp_result_dates = arr_select_dates.slice();
    tmp_result_dates = tmp_result_dates.sort();
    if (document.getElementById('headline').textContent.split(' ')[0] === "Representation") {
        for (var k=0; k<arr_select_tools.length; k++) {
            var obj_log = document.getElementById("table_" + arr_select_tools[k]);
            obj_log.parentNode.removeChild(obj_log);
        }
    }
    
    reset();
}

function readTextFile(str_path_to_file) {
    var rawFile = new XMLHttpRequest();
    var allText = "";
    rawFile.open("GET", str_path_to_file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    
    return allText
}

// Resuls showing
function showDecisionTreeImages() {
    var tmp_result_dates = arr_select_dates.slice();
    tmp_result_dates = tmp_result_dates.sort();
    var str_selected_tool = (selectedTool.value);
    
    var str_model = String(document.getElementById('headline').textContent.split(' ')[0]); // 41, 20, 61 models
    var str_log = "WSAW_CM/" + str_model + "/";

    for (var i=0; i<tmp_result_dates.length; i++) {
        var str_filename = "Daily_" + tmp_result_dates[i].substr(0,4) + "-" + tmp_result_dates[i].substr(4,2) + "-" + tmp_result_dates[i].substr(6,2) + "_" + str_selected_tool; //Daily_2020-07-14_WSAWC01 or Daily_2020-07-14_ALL_TOOL
            
        var str_lot_log = readTextFile(str_log+str_filename);
        var arr_lot_record = str_lot_log.split('\n'); // 2020-07-01,WSAWB01,MJFK4AJ,0,0
            
        // Check Lot name for that date and record png path
        for (var j=0; j<arr_lot_record.length; j++) {
            if (j !== 0) {
                var _str_selected_tool = "";
                if (str_selected_tool === "ALL_TOOL") {
                    _str_selected_tool = arr_lot_record[j].split(',')[1];
                } else {
                    _str_selected_tool = str_selected_tool;
                }
                var str_lot = arr_lot_record[j].split(',')[2];
                var str_png_filename = tmp_result_dates[i] + "_" + _str_selected_tool + "_" + str_lot + "_" + str_model + "_NoFeedback.png";
                if (str_lot !== undefined) {
                    var str_chart_id = "charts_" + tmp_result_dates[i] + "_" + _str_selected_tool + "_" + str_lot;
                    if (!document.getElementById(str_chart_id)) {
                        var obj_img = document.createElement("IMG");
                        obj_img.setAttribute("src", "../img/WSAW_IMG/" + str_png_filename);
                        obj_img.setAttribute("style", "width:900px;");
                        obj_img.setAttribute("alt", "");
                        obj_img.id = str_chart_id;
                        arr_reset_objs.push(str_chart_id);
                        if (obj_img !== null) { document.body.appendChild(obj_img);}
                    }
                } // End if (str_lot !== undefined)
            }
        }
    }
    
    if (str_selected_tool === "ALL_TOOL") {
        arr_select_tools = wsaw_all_tools.slice();
        return;
    }
    
    if (!arr_select_tools.includes(str_selected_tool) && tmp_result_dates.length>0) {
        arr_select_tools.push(str_selected_tool);    
    }
    return;
}

function re_shape_arr(arr_tmp) {
    var arr_result = [];
    for (var i=0; i<arr_tmp.length; i++) {
        var fix_value = arr_tmp[i];
        if (i !== 0) {
            //fix_value = arr_tmp[i].replace(/\/n\|\/r| |"/g,'');
            fix_value = arr_tmp[i].replace(/ /g, '');
            fix_value = fix_value.replace(/[\r\n]/g, '');
        }
        arr_result.push(fix_value);
    }
    
    if (arr_result.length < 30) {
        for (x=0; x<(31-arr_result.length); x++) {
            arr_result.push('0.0'); 
        }
    }
    
    return arr_result;
}

function showNCUResultsImages() {
    // Open file according user choosing
    var tmp_result_dates = arr_select_dates.slice();
    tmp_result_dates = tmp_result_dates.sort();
    var str_selected_tool = (selectedTool.value);
    //console.log("."+str_selected_tool+"_"+tmp_result_dates[0]+".log")
    
    
    var str_log_path = "../img/wsaw_ncu/log/"
    var str_tmp_tool_log = "";
    var str_log_tool = "";
    
    // Result result declear
    var table_ncu = document.createElement("TABLE");
    var str_table_id = "table_" + str_selected_tool;
    if (document.getElementById(str_table_id)) {
        var obj_table = document.getElementById(str_table_id);
        obj_table.parentNode.removeChild(obj_table);
    }
    table_ncu.id = str_table_id;
    table_ncu.border = "3px #FFD382 dashed";
    table_ncu.align = "center";
    //table_ncu.textAlign = "center"; // not working
    //table_ncu.fontSize = '150px'; // not working
    
    // Add columns
    table_column = document.createElement('tbody');
    table_column.style.background = "#994C00";
    table_column.style.fontSize = "5px";
    table_column.style.color = "#ffffff";
    
    var tr_ncu = table_column.appendChild(document.createElement('tr'));
    for (var i=0; i<arr_ncu_columns.length; i++) {
        var td_ncu = document.createElement('td');
        if (i === 0) { // Move In Datetime
            td_ncu.style.width = '150px';
        } else if (i > 3) {
            td_ncu.style.width = '40px';
        }
        //var td_ncu = tr_ncu.appendChild(document.createElement('td'));
        tr_ncu.appendChild(td_ncu);
        var a_ncu = td_ncu.appendChild(document.createElement('b'));
        a_ncu.innerText = arr_ncu_columns[i];
    }
    table_ncu.appendChild(table_column);//*/
    
    // Results Information
    for (var i=0; i<tmp_result_dates.length; i++) {
        // Open log file
        //var str_log_filename = str_log_path+"."+str_selected_tool+"_"+tmp_result_dates[i]+".log"; // This won't work, don't know why
        var str_log_filename = str_log_path+tmp_result_dates[i]+".log";
        //console.log(tmp_result_dates[i]);
        
        var str_allText = readTextFile(str_log_filename);
        var str_tool_log = "";
        // If user choose all tools
        if (str_selected_tool === 'ALL_TOOL') {
            str_tool_log = str_allText;
        } else {
        // Choose for select tool
            var arr_tool_log = str_allText.split("\r\n");
            for (var j=0; j<arr_tool_log.length; j++) {
                if (arr_tool_log[j].split(", ")[1] === str_selected_tool) {
                    str_tool_log += arr_tool_log[j] + "\n";
                }
            }
        }
        // NCU V1 - Showing only log info
        /*var obj_log = document.createElement("P");
        obj_log.id = "log_" + tmp_result_dates[i] + "_" + str_selected_tool;
        obj_log.innerText = str_tool_log;
        if (obj_log !== null) { document.body.appendChild(obj_log);}//*/
        
        // NCU V2
        /*  - Replace number for Safe/Alarm
            - Replace structure for table
            - We fix the length to be exact '30' and filled empty with '0.0' which make sense*/
        // [[], [], ... []]
        var arr_ncu_remodel = [];
        var arr_ncu_log = str_tool_log.split("\n");
        //console.log("arr_ncu_log");
        //console.log(arr_ncu_log);
        var arr_ncu_tmp = [];
        for (var j=0; j<arr_ncu_log.length; j++) {
            arr_ncu_tmp = arr_ncu_log[j].split(",");
            if (arr_ncu_tmp.length === 1) { continue;}
            arr_ncu_tmp = re_shape_arr(arr_ncu_tmp);
            arr_ncu_remodel.push(arr_ncu_tmp);
        }
        
        //console.log("arr_ncu_remodel");
        //console.log(arr_ncu_remodel);
        
        var tbody_ncu = document.createElement("tbody");
        for (j=0; j<arr_ncu_remodel.length; j++) {
            var tr_ncu = tbody_ncu.appendChild(document.createElement('tr'));
            for (var k=0; k<arr_ncu_remodel[j].length; k++) {
                if (arr_ncu_remodel[j][k] !== "") {
                    var td_ncu = document.createElement('td');
                    //td_ncu.style.width = '';
                    //console.log(arr_ncu_remodel[j][k].replace(' ', ''))
                    var cell_value = arr_ncu_remodel[j][k];
                    //console.log(cell_value);
                    //console.log(typeof(cell_value));
                    //cell_value = cell_value.replace(/\/n| |"/g,'');
                    if (cell_value === "ALARM") {
                        td_ncu.style.backgroundColor = '#ff0000';
                    } else if (cell_value === "SAFE") {
                        td_ncu.style.backgroundColor = '#00ff00';
                    } else if (cell_value === "0.0" || cell_value === "1.0") {
                        td_ncu.style.backgroundColor = '#66ff66';
                        tr_ncu.appendChild(td_ncu);
                        continue;
                    } else if (cell_value === "2.0") {
                        td_ncu.style.backgroundColor = '#b2ff66';
                        tr_ncu.appendChild(td_ncu);
                        continue;
                    } else if (cell_value === "3.0") {
                        td_ncu.style.backgroundColor = '#ffff66';
                        tr_ncu.appendChild(td_ncu);
                        continue;
                    } else if (cell_value === "4.0") {
                        td_ncu.style.backgroundColor = '#ffb266';
                        tr_ncu.appendChild(td_ncu);
                        continue;
                    } else if (cell_value === "5.0") {
                        td_ncu.style.backgroundColor = '#ff6666';
                        tr_ncu.appendChild(td_ncu);
                        continue;
                    } /*else {
                        console.log(cell_value);
                        console.log(cell_value.length);
                    }//*/ // Debug
                    
                    // Color Date Tool Lot
                    if (k === 0) {
                        td_ncu.style.backgroundColor = '#C0C0C0';
                    } else if (k === 1) {
                        td_ncu.style.backgroundColor = '#E0E0E0';
                    } else if (k === 2) {
                        td_ncu.style.backgroundColor = '#ffffff';
                    }
                    
                    
                    //var a_ncu = td_ncu.appendChild(document.createElement('a'));
                    //a_ncu.innerText = cell_value;//arr_ncu_remodel[j][k];
                    td_ncu.appendChild(document.createTextNode(cell_value));
                    tr_ncu.appendChild(td_ncu);
                }
            }
        }
        table_ncu.appendChild(tbody_ncu);
        document.body.appendChild(table_ncu);//*/
    }//*/
    
    // For the reset button to see what tool had beec selected
    if (!arr_select_tools.includes(str_selected_tool) && tmp_result_dates.length>0) {
        arr_select_tools.push(str_selected_tool);    
    }
    return
}

function getDefaultColorHPM(str_yyyymmdd, str_tool) {
    var int_today_value = parseInt(String(today.getFullYear()) + String(today.getMonth()<10 ? '0'+(today.getMonth()+1) : (today.getMonth()+1)) + String((today.getDate()-1)<10? '0'+(today.getDate()-1) : (today.getDate()-1)));
    if (parseInt(str_yyyymmdd) > int_today_value) { return  "";}
    
    var str_headline_model = document.getElementById('headline').textContent.split(' ')[0]; // 41, 20, 61, Representation
    var str_yyyy_mm_dd = str_yyyymmdd.substring(0,4) + '-' + str_yyyymmdd.substring(4,6) + '-' + str_yyyymmdd.substring(6,8)//str_yyyymmdd[0:4] + str_yyyymmdd[4:6] + str_yyyymmdd[6:8];
    var str_filename = 'Daily_' + str_yyyy_mm_dd + '_' + str_tool;
    var str_log_path = "WSAW_CM/" + str_headline_model + '/' + str_filename;
    //var str_log_path = "../" + str_headline_model + '/' + str_filename
    
    var str_all_test = readTextFile(str_log_path); // 2020-07-01,WSAWB01,MJFK4AJ,0,0
    var arr_lot_record = str_all_test.split('\n');
    var str_final_result = ""
    if (arr_lot_record.length > 0) {
        for (var i=1; i<arr_lot_record.length; i++) {
            str_status = arr_lot_record[i].split(',')[3];
            str_predict = arr_lot_record[i].split(',')[4];
            
            // HPM needed
            if (str_cal_headline === "Hierarchical" && str_status==='1') {
                return "bg-danger";
            }
            
            // Supervised needed
            // Single tool
            if (str_tool !== 'ALL_TOOL') {
                if (str_status==='0' && str_predict==='1') {
                    str_final_result = "bg-warning"; 
                } else if (str_status==='1' && str_predict==='0') {
                    str_final_result = "bg-danger";
                } else if (str_status==='1' && str_predict==='1') {
                    str_final_result = "bg-success";
                }
            // ALL tools
            } else {
                if (str_status==='1') {
                    str_final_result = "bg-danger";
                }
            }
        }    
    }
    
    //console.log(arr_lot_record[1]);
    return str_final_result;
}

function selectAllDates() {
    // Get the select month
    var int_today_value = "";
    
    // Supervised
    //if (str_cal_headline === 'Supervised' || str_cal_headline === 'Machine' || str_cal_headline === 'with') {
    if (str_cal_headline === 'Supervised' || str_cal_headline === 'Machine') {
        int_today_value = parseInt(String(today.getFullYear()) + String(today.getMonth()+1<10 ? '0'+(today.getMonth()+1) : (today.getMonth()+1)) + String((today.getDate()-1)<10? '0'+(today.getDate()-1) : (today.getDate()-1)));
    // Hierarchical
    } else {
        int_today_value = parseInt(String(today.getFullYear()) + String(today.getMonth()+1<10 ? '0'+(today.getMonth()+1) : (today.getMonth()+1)) + String((today.getDate())<10? '0'+(today.getDate()) : (today.getDate())));
    }
    var int_rest_days = 32 - new Date(parseInt(selectYear.value), parseInt(selectMonth.value), 32).getDate()//int_today_value % 100;
    
    // Select those dates which smaller than today
    //arr_select_dates = [];
    var yyyy = selectYear.value.toString();
    var mm = (parseInt(selectMonth.value)+1) < 10 ? ("0"+(parseInt(selectMonth.value)+1)) : (parseInt(selectMonth.value)+1).toString();
    for (var i=1; i<=int_rest_days; i++) {
        var dd = i < 10 ? ("0"+i) : (i.toString());
        if (parseInt(yyyy+mm+dd) <= int_today_value) { arr_select_dates.push(yyyy+mm+dd);}
    }
    //console.log(arr_select_dates);
    //console.log(32 - new Date(parseInt(selectYear.value), parseInt(selectMonth.value), 32).getDate());
    
    // Update calendar
    showCalendar(currentMonth, currentYear);
    showConfusionMatrix();
    
    return;
}

function showDailyThreatHPM() {
    // Open file according user choosing
    var tmp_result_dates = arr_select_dates.slice();
    tmp_result_dates = tmp_result_dates.sort();
    
    // WSAW_HPM/41 or 20 or 61
    var str_log_path = "WSAW_HPM/" + document.getElementById('headline').textContent.split(' ')[0] + "/";
    
    // HPM result table columns
    var table_hpm = document.createElement('TABLE');
    table_hpm.id = "table_hpm";
    table_hpm.border = "3px #FFD382 dashed";
    table_hpm.align = "center";
            
    var table_hpm_col = document.createElement('tbody');
    table_hpm_col.id = "table_hpm_columns";
    table_hpm_col.style.background = "#994C00";
    table_hpm_col.style.fontSize = "4px";
    table_hpm_col.style.color = "#ffffff";
            
    var tr_hpm_col = table_hpm_col.appendChild(document.createElement('tr'));
    var arr_wsaw_hpm_col = ['Date'].concat(wsaw_all_tools);
    for (var i=0; i<arr_wsaw_hpm_col.length; i++) {
        var td_hpm_col = document.createElement('td');
        td_hpm_col.style.width = '40px';

        tr_hpm_col.appendChild(td_hpm_col);
        var a_hpm_col = td_hpm_col.appendChild(document.createElement('b'));
        if (i === 0) {
            td_hpm_col.style.width = '150px';
            a_hpm_col.innerText = "Date";
        } else {
            a_hpm_col.innerText = arr_wsaw_hpm_col[i].substr(4,6);
        }
    }
    table_hpm.appendChild(table_hpm_col);
    
    // HPM result table
    var table_hpm_result = document.createElement('tbody');
    table_hpm_result.id = "table_hpm_result";
    table_hpm_result.style.background = "#ffffff";
    table_hpm_result.style.fontSize = "4px";
    table_hpm_result.style.color = "#000000";
    
    for (var i=0; i<tmp_result_dates.length; i++) {
        // tmss_HPM_daily_20190914.log
        var str_filename = "tmss_HPM_daily_" + tmp_result_dates[i] + ".log";
        var str_hpm_msg = readTextFile(str_log_path+str_filename);
        var str_threat_tools_msg = str_hpm_msg.split('\n')[5].split(' ');
        var str_threat_tools = [];
        // Screen threat tools
        for (var j=0; j<str_threat_tools_msg.length; j++) {
            var str_tool = str_threat_tools_msg[j].replace(',','');
            if (wsaw_all_tools.includes(str_tool)) {
                str_threat_tools.push(str_tool);
            }
        }
        //console.log(str_threat_tools_msg); // ["	Potential", "threat", "tools:", "WSAWB03," ...
        //console.log(str_threat_tools); // ["WSAWB03", "WSAWB04" ...
        
        // HPM Color showing
        if (str_hpm_msg !== "") {
            //console.log(str_hpm_msg);
            var tr_hpm_res = table_hpm_result.appendChild(document.createElement('tr'));
            for (var k=0; k<arr_wsaw_hpm_col.length; k++) {
                var td_hpm_res = document.createElement('td');
                td_hpm_res.style.width = '40px';
                
                tr_hpm_res.appendChild(td_hpm_res);
                var a_hpm_col = td_hpm_res.appendChild(document.createElement('b'));
                if (k === 0) { // Dates
                    td_hpm_res.style.width = '150px';
                    a_hpm_col.innerText = tmp_result_dates[i];
                } else { // Tools
                    // Is this tool stop in this day?
                    var str_status_msg = getDefaultColorHPM(tmp_result_dates[i], wsaw_all_tools[k-1]);
                    var bool_status_stop = (str_status_msg === "bg-danger" || str_status_msg === "bg-success") ? true : false;
                    //console.log(tmp_result_dates[i] + ":" + str_status_msg);
                    
                    // Id
                    td_hpm_res.id = tmp_result_dates[i] + "_" + wsaw_all_tools[k-1];
                    var str_td_id = tmp_result_dates[i] + "_" + wsaw_all_tools[k-1];
                    
                    // Color the td
                    if (str_threat_tools.includes(arr_wsaw_hpm_col[k])) {
                        if (bool_status_stop) {
                            td_hpm_res.style.backgroundColor = '#66ff66';
                        } else {
                            td_hpm_res.style.backgroundColor = '#ff9933';
                        }
                    } else {
                        if (bool_status_stop) { td_hpm_res.style.backgroundColor = '#ff3333';}
                    }
                    
                    // Make td clickable and functionalized
                    td_hpm_res.onclick = function() {
                        var str_id = this.id;
                        //console.log(str_id);
                        if (!document.getElementById('hpm_modal')) {
                            var obj_modal = document.createElement('div');
                            obj_modal.classList.add('modal');

                            var obj_child = document.createElement('div');
                            obj_child.classList.add('modal-content');
                            obj_child.id = "hpm_modal-content";
                            
                            // Content
                            var str_hpm_file = str_log_path + "tmss_HPM_daily_" + str_id.split('_')[0] + ".log";
                            var str_content = readTextFile(str_hpm_file);
                            var _str_tool = str_id.split('_')[1];
                            //var regxp_tool = new RegExp(_str_tool, 'g');
                            //var regxp_tool = new RegExp(_str_tool + "\n(.*)\n(.*)\n(.*)\n(.*)\n(.*)\n(.*)\n(.*)", 'g');
                            var regxp_tool = new RegExp(_str_tool + "(\n(.*)){17}", 'g');
                            //var regxp = //g;
                            var match_array = str_content.match(regxp_tool);
                            var str_raw_msg = match_array[0];
                            str_raw_msg = str_raw_msg.replace(/ /g, '').replace(/\r/g, '').replace(/\n/g, '').replace(/|/g, '');
                            var arr_clean_raw = str_raw_msg.split('\t');
                            //console.log(arr_clean_raw);
                            
                            // Create table to show the result
                            if (str_raw_msg === "" || str_raw_msg === undefined) {
                                obj_child.innerHTML = "No Result Found.";//str_id;
                            } else {
                                var table_raw = obj_child.appendChild(document.createElement('TABLE'));
                                table_raw.id = "hpm_raw_result";
                                //var obj_raw_head = table_raw.appendChild(document.createElement("HEAD"));
                                //var table_raw_col = table_raw.appendChild(document.createElement('tbody'));
                                //var table_raw_res = table_raw.appendChild(document.createElement('tbody'));
                                
                                var tr_raw_col = table_raw.appendChild(document.createElement('tr'));
                                //var th_raw_col = tr_raw_col.appendChild(document.createElement('th'));
                                
                                var tr_raw_res = table_raw.appendChild(document.createElement('tr'));
                                for (var l=1; l<arr_clean_raw.length; l++) {
                                    // Column
                                    if (l<=7) {
                                        var obj_th = document.createElement('th');
                                        obj_th.innerHTML = arr_clean_raw[l];
                                        tr_raw_col.appendChild(obj_th);
                                    // Results
                                    } else {
                                        if (l%7 === 1) {
                                            tr_raw_res = table_raw.appendChild(document.createElement('tr'));
                                        } //tr_raw_res.appendChild(document.createElement('td').appendChild(document.createTextNode(arr_clean_raw[l])));
                                        var obj_td = document.createElement('td');
                                        obj_td.innerHTML = arr_clean_raw[l];
                                        tr_raw_res.appendChild(obj_td);
                                    }
                                }
                                obj_child.appendChild(table_raw);
                            }//*/
                            //obj_child.innerHTML = arr_clean_raw;//str_id;
                            //console.log(arr_clean_raw);

                            obj_modal.appendChild(obj_child);
                            obj_modal.id = "hpm_modal";
                            obj_modal.style.display = "block";

                            table_hpm.appendChild(obj_modal);
                        }
                    }
                }
            }
        }
        
    }
    table_hpm.appendChild(table_hpm_result);
    document.body.appendChild(table_hpm);
    
    return;
}

function _mainRollerRealtime(str_tool, str_today) {
    var str_png_filename = "Realtime_" + str_tool + "__RollerTemp.png";
    var str_chart_id = "realtime_" + str_today + "_" + str_tool;
    if (!document.getElementById(str_chart_id)) {
        var obj_img = document.createElement("IMG");
        obj_img.setAttribute("src", "../img/WSAW_IMG/" + str_png_filename);
        obj_img.setAttribute("style", "width:900px;");
        obj_img.setAttribute("alt", "");
        obj_img.id = str_chart_id;
        
        obj_img.onclick = function() {
            var obj_modal = document.createElement('div');
            obj_modal.classList.add('modal');
            obj_modal.id = "roller_modal_modal";

            var obj_child = document.createElement('div');
            obj_child.classList.add('modal-content');
            obj_child.id = "roller_modal-content";

            var str_png_detail = "Realtime_" + str_tool + "__DetailRollerTemp.png";
            obj_img_roller_detail = document.createElement("IMG");
            //console.log("../img/WSAW_IMG/Roller_TEMP_Details/" + str_png_detail)
            obj_img_roller_detail.setAttribute("src", "../img/WSAW_IMG/Roller_TEMP_Details/" + str_png_detail);
            obj_img_roller_detail.setAttribute("style", "width:700px;");
            obj_img_roller_detail.setAttribute("alt", "");

            obj_child.appendChild(obj_img_roller_detail);
            obj_modal.appendChild(obj_child);
            obj_modal.style.display = "block";
            document.body.appendChild(obj_modal);
        } // Click end
        
        if (obj_img !== null) { document.body.appendChild(obj_img);}
        arr_reset_objs.push(str_chart_id);
    }
}

function mainRollerRealtime(str_tool, str_today) {
    if (str_tool === "ALL_TOOL") {
        for (var i=0; i<wsaw_all_tools_mainRoller.length; i++) {
            _mainRollerRealtime(wsaw_all_tools_mainRoller[i], str_today);
        }
    } else {
        _mainRollerRealtime(str_tool, str_today);
    }
}

function showMainRollerImages() {
    var tmp_result_dates = arr_select_dates.slice();
    tmp_result_dates = tmp_result_dates.sort();
    var str_selected_tool = (selectedTool.value);
    
    var str_model = 'RollerTemp';
    var str_log = "WSAW_CM/41/";

    for (var i=0; i<tmp_result_dates.length; i++) {
        // Realtime case
        //console.log(today.getFullYear());
        //console.log(today.getMonth()+1);
        //console.log(today.getDate());
        var yyyy = today.getFullYear().toString();
        var mm = (today.getMonth()+1) < 10 ? ("0" + (today.getMonth()+1).toString()) : ((today.getMonth()+1).toString());
        var dd = (today.getDate()) < 10 ? ("0" + (today.getDate()).toString()) : ((today.getDate()).toString());
        var str_today = yyyy+mm+dd;
        //console.log(str_today);
        if (tmp_result_dates[i] === str_today) {
            mainRollerRealtime(str_selected_tool, today);
            continue;
        }
        
        
        var str_filename = "Daily_" + tmp_result_dates[i].substr(0,4) + "-" + tmp_result_dates[i].substr(4,2) + "-" + tmp_result_dates[i].substr(6,2) + "_" + str_selected_tool; //Daily_2020-07-14_WSAWC01 or Daily_2020-07-14_ALL_TOOL
            
        var str_lot_log = readTextFile(str_log+str_filename);
        var arr_lot_record = str_lot_log.split('\n'); // 2020-07-01,WSAWB01,MJFK4AJ,0,0
            
        // Check Lot name for that date and record png path
        for (var j=0; j<arr_lot_record.length; j++) {
            if (j !== 0) {
                var _str_selected_tool = "";
                if (str_selected_tool === "ALL_TOOL") {
                    _str_selected_tool = arr_lot_record[j].split(',')[1];
                } else {
                    _str_selected_tool = str_selected_tool;
                }
                var str_lot = arr_lot_record[j].split(',')[2];
                var str_png_filename = tmp_result_dates[i] + "_" + _str_selected_tool + "_" + str_lot + "_" + str_model + ".png";
                //console.log(str_png_filename)
                if (str_lot !== undefined) {
                    var str_chart_id = "charts_" + tmp_result_dates[i] + "_" + _str_selected_tool + "_" + str_lot;
                    var check_exist = document.getElementById(str_chart_id);
                    if (!check_exist) {
                        var obj_img = document.createElement("IMG");
                        obj_img.setAttribute("src", "../img/WSAW_IMG/" + str_png_filename);
                        obj_img.setAttribute("style", "width:900px;");
                        obj_img.setAttribute("alt", "");
                        obj_img.id = str_chart_id;
                        
                        // Click show details, we need to fix the id problem -> Reset problem -> Here
                        obj_img.onclick = function() {
                            var str_id = this.id; // charts_20200727_WSAWB05_MFF2UAB
                            var tool = str_id.split("_")[2];
                            var date = str_id.split("_")[1];
                            var lot = str_id.split("_")[3];
                            var obj_modal = document.createElement('div');
                            obj_modal.classList.add('modal');
                            obj_modal.id = "roller_modal_modal";

                            var obj_child = document.createElement('div');
                            obj_child.classList.add('modal-content');
                            obj_child.id = "roller_modal-content";

                            var str_png_detail = date + '_' + tool + '_' + lot + '_Detail' + str_model + '.png';
                            obj_img_roller_detail = document.createElement("IMG");
                            //console.log("../img/WSAW_IMG/Roller_TEMP_Details/" + str_png_detail)
                            obj_img_roller_detail.setAttribute("src", "../img/WSAW_IMG/Roller_TEMP_Details/" + str_png_detail);
                            obj_img_roller_detail.setAttribute("style", "width:700px;");
                            obj_img_roller_detail.setAttribute("alt", "");

                            obj_child.appendChild(obj_img_roller_detail);
                            obj_modal.appendChild(obj_child);
                            obj_modal.style.display = "block";
                            document.body.appendChild(obj_modal);
                        } // Click end
                        
                        if (obj_img !== null) { document.body.appendChild(obj_img);}
                        arr_reset_objs.push(str_chart_id);
                    }
                }
            }
        }
    }
    
    if (str_selected_tool === "ALL_TOOL") {
        arr_select_tools = wsaw_all_tools_mainRoller.slice();
        return;
    }
    
    if (!arr_select_tools.includes(str_selected_tool) && tmp_result_dates.length>0) {
        arr_select_tools.push(str_selected_tool);    
    }
    return;
}

function showAlarmLogMsg() {
    var tmp_result_dates = arr_select_dates.slice();
    tmp_result_dates = tmp_result_dates.sort();
    var str_selected_tool = (selectedTool.value);
    
    // Alarm message path
    var str_path_alarm_path = "";
    
    var table_alarm = document.createElement('TABLE');
    table_alarm.id = "table_alarm";
    table_alarm.border = "3px #FFD382 dashed";
    table_alarm.align = "center";

    var table_alarm_col = table_alarm.appendChild(document.createElement('tbody'));
    table_alarm_col.id = "table_hpm_columns";
    table_alarm_col.style.background = "#994C00";
    table_alarm_col.style.fontSize = "4px";
    table_alarm_col.style.color = "#ffffff";
    
    var tr_alarm_col = table_alarm_col.appendChild(document.createElement('tr'));
    var arr_wsaw_alarm_col = ["DATE", "TIME", "USER", "CODE", "MESSAGE"]
    for (var x=0; x<arr_wsaw_alarm_col.length; x++) {
        var td_alarm_col = tr_alarm_col.appendChild(document.createElement('td'));
        var a_alarm_col = td_alarm_col.appendChild(document.createElement('b'));
        if (arr_wsaw_alarm_col[x] === "CODE") {
            td_alarm_col.style.width = '150px';
        } else if (arr_wsaw_alarm_col[x] === "MESSAGE") {
            td_alarm_col.style.width = '400px';
        } else {
            td_alarm_col.style.width = '80px';
        }
        a_alarm_col.innerText = arr_wsaw_alarm_col[x];
    }
    
    var table_alarm_result = table_alarm.appendChild(document.createElement('tbody'));
    table_alarm_result.id = "table_alarm_result";
    table_alarm_result.style.background = "#ffffff";
    table_alarm_result.style.fontSize = "4px";
    table_alarm_result.style.color = "#000000";
    
    for (var i=0; i<tmp_result_dates.length; i++) {
        //console.log(tmp_result_dates[i]);
        str_path_alarm_path = "WSAW_ALARMS/alarm_logs/" + str_selected_tool + "/" + str_selected_tool + "_" + tmp_result_dates[i] + "_alarms.csv";
        str_alarm_msg = readTextFile(str_path_alarm_path);
        //console.log(str_alarm_msg);
        
        /*var p = document.createElement('p');
        p.id = str_selected_tool+'_'+tmp_result_dates[i]+'_alarmlogs';
        arr_reset_objs.includes(p.id);
        p.innerHTML = str_alarm_msg;
        
        document.body.appendChild(p);//*/
        arr_alarm_msg = str_alarm_msg.split("\n");
        for (var j=0; j<arr_alarm_msg.length; j++) {
            var tr_alarm_res = table_alarm_result.appendChild(document.createElement('tr'));
            var arr_alarm_msg_detail = arr_alarm_msg[j].split(",")
            for (var k=0; k<arr_alarm_msg_detail.length; k++) {
                var td_alarm_res = tr_alarm_res.appendChild(document.createElement('td'));
                //td_alarm_res.style.width = '40px';
                var a_alarm_col = td_alarm_res.appendChild(document.createElement('b'));
                a_alarm_col.innerText = arr_alarm_msg_detail[k];
            }
        }
    }
    arr_reset_objs.push(table_alarm.id);
    document.body.appendChild(table_alarm);
    return;
}

myGoButton.onclick = (async function() {
    document.body.style.cursor = 'progress';
    await sleep(300);
    var tmp_result_dates = arr_select_dates.slice();//We copy and keep the original array
    tmp_result_dates = tmp_result_dates.sort();
    var str_db_msg = "";
    for (var i=0; i<tmp_result_dates.length; i++) {
        str_db_msg += tmp_result_dates[i] + ", "
    }
    document.getElementById("demo").innerHTML = str_db_msg;
    
    // Show images
    if (document.getElementById('headline').textContent.split(' ')[0] === "Representation") {
        showNCUResultsImages();
    }else if (document.getElementById('headline').textContent.split(' ')[0] === "Main") {
        showMainRollerImages();
    }else if (document.getElementById('headline').textContent.split(' ')[0] === "Alarm") {
        showAlarmLogMsg();
    } else {
        if (str_cal_headline === 'Supervised') {
            showDecisionTreeImages();
        } else if (str_cal_headline === 'Hierarchical') {
            showDailyThreatHPM();
        }
    }
    document.body.style.cursor = 'default';
})

function getDefaultColor(str_yyyymmdd) {
    var int_today_value = parseInt(String(today.getFullYear()) + String(today.getMonth()<10 ? '0'+(today.getMonth()+1) : (today.getMonth()+1)) + String((today.getDate()-1)<10? '0'+(today.getDate()-1) : (today.getDate()-1)));
    if (parseInt(str_yyyymmdd) > int_today_value) { return  "";}
    
    var str_headline_model = document.getElementById('headline').textContent.split(' ')[0]; // 41, 20, 61, Representation
    var str_yyyy_mm_dd = str_yyyymmdd.substring(0,4) + '-' + str_yyyymmdd.substring(4,6) + '-' + str_yyyymmdd.substring(6,8)//str_yyyymmdd[0:4] + str_yyyymmdd[4:6] + str_yyyymmdd[6:8];
    var str_filename = 'Daily_' + str_yyyy_mm_dd + '_' + document.getElementById('tool').value;
    var str_log_path = "WSAW_CM/" + str_headline_model + '/' + str_filename;
    //var str_log_path = "../" + str_headline_model + '/' + str_filename
    
    var str_all_test = readTextFile(str_log_path); // 2020-07-01,WSAWB01,MJFK4AJ,0,0
    var arr_lot_record = str_all_test.split('\n');
    if (arr_lot_record.length > 0) {
        for (var i=1; i<arr_lot_record.length; i++) {
            str_status = arr_lot_record[i].split(',')[3];
            str_predict = arr_lot_record[i].split(',')[4];
            if (str_status==='0' && str_predict==='1') {
                if (document.getElementById('tool').value !== 'ALL_TOOL') {
                   return "bg-warning"; 
                }
            } else if (str_status==='1' && str_predict==='0') {
                return "bg-danger";
            } else if (str_status==='1' && str_predict==='1') {
                if (document.getElementById('tool').value !== 'ALL_TOOL') {
                    return "bg-success";
                }
            }
        }    
    }
    
    //console.log(arr_lot_record[1]);
    return "";
}

function showConfusionMatrix() {
    if (str_cal_headline !== 'Supervised') { return;}
    if (document.getElementById('headline').textContent.split(' ')[0] === 'Main') { return;}
    
    var table_cm = document.createElement("TABLE");
    var str_table_id = "table_cm";
    if (document.getElementById('tool').value === 'ALL_TOOL') {
        if (document.getElementById(str_table_id)) {
            var obj_table = document.getElementById(str_table_id);
            obj_table.parentNode.removeChild(obj_table);
        }
    } else {
        currentYear = selectYear.value;
        currentMonth = parseInt(selectMonth.value) + 1;
        currentMonth = currentMonth<10 ? ('0'+currentMonth) : (currentMonth.toString());
        if (currentYear !== '' && currentMonth !== '') {
            var str_headline_model = document.getElementById('headline').textContent.split(' ')[0]; // 41, 20, 61, Representation
            var str_filename = 'CM_' + currentYear + '-' + currentMonth + '_' + document.getElementById('tool').value; //CM_2020-01_WSAWB01
            var str_log_path = "WSAW_CM/" + str_headline_model + '/' + str_filename
            //var str_log_path = "../" + str_headline_model + '/' + str_filename
            var str_all_test = readTextFile(str_log_path);
            //console.log(str_log_path);
            
            if (document.getElementById(str_table_id)) {
                var obj_table = document.getElementById(str_table_id);
                obj_table.parentNode.removeChild(obj_table);
            }
            table_cm.id = str_table_id;
            table_cm.border = "3px #FFD382 dashed";
            table_cm.align = "center";
            
            // Cloumn name
            var tr_cm = table_cm.appendChild(document.createElement('tr'));
            for (i=0; i<arr_cm.length; i++) {
                var td_cm = document.createElement('td');
                td_cm.style.width = '100px';
                td_cm.style.textAlign = 'center';
                td_cm.style.fontSize = '10px';
                tr_cm.appendChild(td_cm);
                var a_cm = td_cm.appendChild(document.createElement('b'));
                a_cm.innerText = arr_cm[i];
            }
            // Column result
            var tr_cm2 = table_cm.appendChild(document.createElement('tr'));
            for (i=0; i<arr_cm.length; i++) {
                var td_cm2 = document.createElement('td');
                td_cm2.style.width = '100px';
                td_cm2.style.textAlign = 'center';
                td_cm2.style.fontSize = '10px';
                tr_cm2.appendChild(td_cm2);
                var a_cm2 = td_cm2.appendChild(document.createElement('b'));
                a_cm2.innerText = str_all_test.split(',')[i];
            }
            
            obj_paragraph = document.getElementById('demo');
            obj_paragraph.appendChild(table_cm);
        }
    }
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";
    
    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;
    
    // Use original calendar if exists
    _month = month+1;
    _month = _month<10 ? ("0" + _month) : (_month.toString());
    
    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            // Blake- It was starting with Sunday, I changed it to start with Monday
            // This statement is working about the first day of the week, for example 5/1 is Fri
            let cell = document.createElement("td");
            if (i === 0 && j < firstDay) {                
                let cellText = document.createTextNode("-");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            //else if (date > daysInMonth) {
            //  break;
            else if (date > daysInMonth) {
                let cellText = document.createTextNode("-");
                cell.appendChild(cellText);
                row.appendChild(cell);
                //date++;
            }
            else {
                /*
                We now add a new rules:
                - When that date is having B/S, but we did not predict it, then the cell default color -> .bg-danger
                - When that date is having B/S, and we did predict it, then the cell default color -> .bg-success
                - When that date is normal, but we did predict it, then the cell default color -> .bg-warning
                */
                _date = date;
                _date = _date<10 ? ("0"+_date) : (_date.toString());
                var str_key = year + _month;

                cell.id = str_key+_date;
                let cellText = document.createTextNode(date);
                //let str_default_color = (str_cal_headline === 'Supervised') ? getDefaultColor(str_key+_date) : "";
                let str_default_color = (str_cal_headline === 'Supervised') ? getDefaultColorHPM(str_key+_date, document.getElementById('tool').value) : "";

                //console.log(str_default_color);
                //The classes for background colors are: .bg-primary, .bg-success, .bg-info,
                //.bg-warning, .bg-danger, .bg-secondary, .bg-dark and .bg-light.
                
                // color today's date
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    if (arr_select_dates.includes(cell.id)) {
                        cell.classList.add("bg-secondary");
                    } else {
                        cell.classList.add("bg-info");
                    }
                // color other dates by default color
                } else {
                    if (arr_select_dates.includes(cell.id)) {
                        cell.classList.add("bg-secondary");
                    } else {
                        if (str_default_color !== '') { cell.classList.add(str_default_color);}
                    }
                }
                
                // We might choose Next/Previous Month
                if (arr_select_dates.includes(cell.id)) {
                    cell.classList.add("bg-secondary");
                }
                
                // Make a function, once user clicks the specific date then take them to the result charts place
                cell.onclick = function() {
                    //alert(year+""+month+""+cellText.nodeValue); //202053, today is 2020 06 03
                    var yyyy = year.toString();
                    var mm = (month+1<10) ? ("0"+(month+1)) : ((month+1).toString());
                    var dd = (cellText.nodeValue<10) ? ("0"+cellText.nodeValue) : (cellText.nodeValue.toString());
                    var str_date = yyyy + mm + dd; //20200603
                    //alert(str_date);
                    
                    // Dates color
                    // If date is today
                    if (cellText.nodeValue === String(today.getDate()) && year === today.getFullYear() && month === today.getMonth() && str_default_color === '') {
                        // Select date to see result
                        if (cell.classList.contains("bg-info")) {
                            cell.classList.remove("bg-info");
                            cell.classList.add("bg-secondary");
                            arr_select_dates.push(str_date)
                        // Unselect date to NOT see result
                        } else {
                            if (cell.classList.contains("bg-secondary")) { cell.classList.remove("bg-secondary");}
                            cell.classList.add("bg-info");
                            const _index = arr_select_dates.indexOf(str_date);
                            arr_select_dates.splice(_index, 1);
                        }
                    // If date is not today
                    } else if (str_default_color !== '') {
                        // Select date to see result
                        if (cell.classList.contains(str_default_color)) {
                            cell.classList.remove(str_default_color);
                            cell.classList.add("bg-secondary");
                            arr_select_dates.push(str_date)
                        // Unselect date to NOT see result
                        } else {
                            if (cell.classList.contains("bg-secondary")) { cell.classList.remove("bg-secondary");}
                            cell.classList.add(str_default_color);
                            const _index = arr_select_dates.indexOf(str_date);
                            arr_select_dates.splice(_index, 1);
                        }
                    // If date is not today
                    } else {
                        // Unselect date to NOT see result
                        if (cell.classList.contains("bg-secondary")) {
                            cell.classList.remove("bg-secondary");
                            const _index = arr_select_dates.indexOf(str_date);
                            arr_select_dates.splice(_index, 1);
                        // Select date to see result    
                        } else {
                            //if (cell.classList.contains(str_default_color)) { cell.classList.remove(str_default_color);}
                            cell.classList.add("bg-secondary");
                            arr_select_dates.push(str_date)
                        }
                    }
                } // End onclick function
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            } // End else
        }
        tbl.appendChild(row); // appending each row into calendar body.
    }// Finished creating all cells
}


// HPM Pop-out window
window.onclick = function(event) {
    if (event.target === document.getElementById("hpm_modal") || event.target === document.getElementById("roller_modal_modal")) {
        var obj_modal = event.target;
        obj_modal.parentNode.removeChild(obj_modal);
    }
}


// Top button & Home Button
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        myTopButton.style.display = "block";
    } else {
        myTopButton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function homeFunction() {
    location.href = "tmss_wsaw.html";
}

    // Top
window.onscroll = function() {scrollFunction()};
var btn_top = document.createElement("BUTTON");
btn_top.id = "btn_top";
btn_top.innerHTML = "Top"
btn_top.onclick = function() {
    topFunction();
}
document.body.appendChild(btn_top);
let myTopButton = document.getElementById("btn_top");
    // Home
var btn_home = document.createElement("BUTTON");
btn_home.id = "btn_home";
btn_home.innerHTML = "Back"
btn_home.onclick = function() {
    homeFunction();
}
document.body.appendChild(btn_home);
let myHomeButton = document.getElementById("btn_home");
myHomeButton.style.display = "block";

// Set cursor
//document.body.style.cursor = 'progress';
//window.onload = function() { document.body.style.cursor = 'default';}

// Calendar
showCalendar(currentMonth, currentYear);
showConfusionMatrix();