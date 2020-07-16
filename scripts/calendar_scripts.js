let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");
let myGoButton = document.getElementById('btn_go');
let myResetButton = document.getElementById('btn_clr');
let mySelect = document.getElementById('str_select');
let selectedTool = document.getElementById('tool');
let str_cal_headline = document.getElementById('headline').textContent.split(' ')[3] // Supervised or Hierarchical or Unsupervised

//let date_tr = document.querySelector('tr');
let date_tbl = document.getElementById("calendar-body");
let date_td = document.querySelector("td");

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let wsaw_all_tools = ["WSAWB01", "WSAWB02", "WSAWB03", "WSAWB04", "WSAWB05", "WSAWB06", "WSAWB07", "WSAWB08", "WSAWB09", "WSAWB10", "WSAWB11", "WSAWB12", "WSAWB13", "WSAWB14", "WSAWB15", "WSAWB16", "WSAWB17", "WSAWB18", "WSAWB19", "WSAWB20", "WSAWB21", "WSAWC01"];
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

myResetButton.onclick = function() {
    // Clear Charts
    var tmp_result_dates = arr_select_dates.slice();
    tmp_result_dates = tmp_result_dates.sort();
    //var str_selected_tool = (selectedTool.value);
    
    //console.log(arr_select_tools);
    //console.log(tmp_result_dates);
    
    for (var k=0; k<arr_select_tools.length; k++) {
        if (document.getElementById('headline').textContent.split(' ')[0] !== "Kmeans+Random") {
            for (var i=0; i<tmp_result_dates.length; i++) {
                for (var j=1; j<4; j++) {
                    var obj_img = document.getElementById("charts_"+tmp_result_dates[i]+"_"+arr_select_tools[k]+"_"+j.toString());
                    if (obj_img) {
                        obj_img.parentNode.removeChild(obj_img);    
                    }
                }
            }
        } else {
            // For table
            var obj_log = document.getElementById("table_" + arr_select_tools[k]);
            obj_log.parentNode.removeChild(obj_log);
        }
    }
    
    if (document.getElementById('headline').textContent.split(' ')[3] === "Hierarchical" && document.getElementById("table_hpm")) {
        var obj_log = document.getElementById("table_hpm");
        obj_log.parentNode.removeChild(obj_log);
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
                    var str_chart_id = "charts_" + tmp_result_dates[i] + "_" + _str_selected_tool + "_1";
                    var check_exist = document.getElementById(str_chart_id);
                    if (!check_exist) {
                        var obj_img = document.createElement("IMG");
                        obj_img.setAttribute("src", "../img/WSAW_IMG/" + str_png_filename);
                        obj_img.setAttribute("style", "width:900px;");
                        obj_img.setAttribute("alt", "");
                        obj_img.id = str_chart_id;
                        if (obj_img !== null) { document.body.appendChild(obj_img);}
                    } else {
                        str_chart_id = "charts_" + tmp_result_dates[i] + "_" + _str_selected_tool + "_2";
                        check_exist = document.getElementById(str_chart_id);
                        if (!check_exist) {
                            var obj_img = document.createElement("IMG");
                            obj_img.setAttribute("src", "../img/WSAW_IMG/" + str_png_filename);
                            obj_img.setAttribute("style", "width:900px;");
                            obj_img.setAttribute("alt", "");
                            obj_img.id = str_chart_id;
                            if (obj_img !== null) { document.body.appendChild(obj_img);}
                        } else {
                            str_chart_id = "charts_" + tmp_result_dates[i] + "_" + _str_selected_tool + "_3";
                            check_exist = document.getElementById(str_chart_id);
                            if (!check_exist) {
                                var obj_img = document.createElement("IMG");
                                obj_img.setAttribute("src", "../img/WSAW_IMG/" + str_png_filename);
                                obj_img.setAttribute("style", "width:900px;");
                                obj_img.setAttribute("alt", "");
                                obj_img.id = str_chart_id;
                            }
                        }
                    }
                }
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
    
    var str_headline_model = document.getElementById('headline').textContent.split(' ')[0]; // 41, 20, 61, Kmeans+Random
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
    if (str_cal_headline === 'Supervised' || str_cal_headline === 'Unsupervised') {
        int_today_value = parseInt(String(today.getFullYear()) + String(today.getMonth()<10 ? '0'+(today.getMonth()+1) : (today.getMonth()+1)) + String((today.getDate()-1)<10? '0'+(today.getDate()-1) : (today.getDate()-1)));
    // Hierarchical
    } else {
        int_today_value = parseInt(String(today.getFullYear()) + String(today.getMonth()<10 ? '0'+(today.getMonth()+1) : (today.getMonth()+1)) + String((today.getDate())<10? '0'+(today.getDate()) : (today.getDate())));
    }
    var int_rest_days = 32 - new Date(parseInt(selectYear.value), parseInt(selectMonth.value), 32).getDate()//int_today_value % 100;
    
    // Select those dates which smaller than today
    arr_select_dates = [];
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
    table_hpm_result.style.background = "#fffff";
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
                    
                    if (str_threat_tools.includes(arr_wsaw_hpm_col[k])) {
                        if (bool_status_stop) {
                            td_hpm_res.style.backgroundColor = '#66ff66';
                        } else {
                            td_hpm_res.style.backgroundColor = '#ff9933';
                        }
                    } else {
                        if (bool_status_stop) { td_hpm_res.style.backgroundColor = '#ff3333';}
                    }
                }
            }
        }
        
    }
    table_hpm.appendChild(table_hpm_result);
    document.body.appendChild(table_hpm);
    
    return;
}

myGoButton.onclick = function() {
    var tmp_result_dates = arr_select_dates.slice();//We copy and keep the original array
    tmp_result_dates = tmp_result_dates.sort();
    var str_db_msg = "";
    for (var i=0; i<tmp_result_dates.length; i++) {
        str_db_msg += tmp_result_dates[i] + ", "
    }
    //alert(selectedTool.value+": "+str_db_msg); //dates sorting OK!
    document.getElementById("demo").innerHTML = str_db_msg;
    //console.log(arr_select_dates);
    
    // Show images
    if (document.getElementById('headline').textContent.split(' ')[0] === "Kmeans+Random") {
        //alert('NCU!');
        showNCUResultsImages();
    } else {
        if (str_cal_headline === 'Supervised') {
            showDecisionTreeImages();
        } else if (str_cal_headline === 'Hierarchical') {
            showDailyThreatHPM();
        }
    }
}

function getDefaultColor(str_yyyymmdd) {
    var int_today_value = parseInt(String(today.getFullYear()) + String(today.getMonth()<10 ? '0'+(today.getMonth()+1) : (today.getMonth()+1)) + String((today.getDate()-1)<10? '0'+(today.getDate()-1) : (today.getDate()-1)));
    if (parseInt(str_yyyymmdd) > int_today_value) { return  "";}
    
    var str_headline_model = document.getElementById('headline').textContent.split(' ')[0]; // 41, 20, 61, Kmeans+Random
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
            var str_headline_model = document.getElementById('headline').textContent.split(' ')[0]; // 41, 20, 61, Kmeans+Random
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


showCalendar(currentMonth, currentYear);
showConfusionMatrix();