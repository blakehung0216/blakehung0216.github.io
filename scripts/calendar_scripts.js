let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");
let myGoButton = document.getElementById('btn_go');
let myResetButton = document.getElementById('btn_clr');
let mySelect = document.getElementById('str_select');
let selectedTool = document.getElementById('tool');

//let date_tr = document.querySelector('tr');
let date_tbl = document.getElementById("calendar-body");
let date_td = document.querySelector("td");

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let wsaw_all_tools = ["WSAWB01", "WSAWB02", "WSAWB03", "WSAWB04", "WSAWB05", "WSAWB06", "WSAWB07", "WSAWB08", "WSAWB09", "WSAWB10", "WSAWB11", "WSAWB12", "WSAWB13", "WSAWB14", "WSAWB15", "WSAWB16", "WSAWB17", "WSAWB18", "WSAWB19", "WSAWB20", "WSAWB21", "WSAWC01"];
let arr_ncu_columns = ["Move In Datetime", "TOOL", "LOT-ID", "Predict Result", "0~30", "31~60", "61~90", "91~120", "121~150", "151~180", "181~210", "211~240", "241~270", "271~300", "301~330", "331~360", "361~390", "391~420", "421~450", "451~480", "481~510", "511~540", "541~570", "571~600", "601~630", "631~660", "661~690", "691~720", "721~750", "751~780"]

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
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;    
    showCalendar(currentMonth, currentYear);
}

function now() {
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

// Reset dates
function reset() {
    // Clear select dates
    arr_select_dates = [];
    arr_select_tools = [];
    showCalendar(currentMonth, currentYear);
    
    // Clear showing dates
    document.getElementById("demo").innerHTML = "";
    
    // Jump to Today
    now();
    
    return;
}

myResetButton.onclick = function() {
    // Clear Charts
    var tmp_result_dates = arr_select_dates.slice();
    tmp_result_dates = tmp_result_dates.sort();
    var str_selected_tool = (selectedTool.value);
    
    //console.log(arr_select_tools);
    //console.log(tmp_result_dates);
    
    for (var k=0; k<arr_select_tools.length; k++) {
        for (var i=0; i<tmp_result_dates.length; i++) {
            if (document.getElementById('headline').textContent.split(' ')[0] !== "Kmeans+Random") {
                for (var j=1; j<4; j++) {
                    var obj_img = document.getElementById("charts_"+tmp_result_dates[i]+"_"+arr_select_tools[k]+"_"+j.toString());
                    obj_img.parentNode.removeChild(obj_img);
                }    
            } else {
                // For log only
                //var obj_log = document.getElementById("log_"+tmp_result_dates[i]+"_"+arr_select_tools[k]);
                //obj_log.parentNode.removeChild(obj_log);
                // For table
                var obj_log = document.getElementById("table_" + arr_select_tools[k]);
                obj_log.parentNode.removeChild(obj_log);
                reset();
                return;
            }
        }    
    }
    
    reset();
}

// Resuls showing
var str_wsaw_img_path = "../img/wsaw_img/";
function showResultsImages() {
    var tmp_result_dates = arr_select_dates.slice();
    tmp_result_dates = tmp_result_dates.sort();
    var str_selected_tool = (selectedTool.value);
    
    var str_model = document.getElementById('headline').textContent.split(' ')[0]; // 41, 20, 61 models
    //console.log(str_model);
    
    // If the you select All tools
    if (str_selected_tool === 'ALL_TOOL') {
        for (var i=0; i<tmp_result_dates.length; i++) {
            for (var x=0; x<wsaw_all_tools.length; x++) {
                //alert("img/wsaw_img/"+tmp_result_dates[i]+"_"+str_selected_tool+"_*_41_NoFeedback.png"); // OK!
                var str_img_path1 = str_wsaw_img_path+tmp_result_dates[i]+"/"+wsaw_all_tools[x]+"/"+str_model+"/1.png";
                var str_img_path2 = str_wsaw_img_path+tmp_result_dates[i]+"/"+wsaw_all_tools[x]+"/"+str_model+"/2.png";
                var str_img_path3 = str_wsaw_img_path+tmp_result_dates[i]+"/"+wsaw_all_tools[x]+"/"+str_model+"/3.png";
                var arr_charts_path = [str_img_path1, str_img_path2, str_img_path3];
                //alert(str_img_path);
                for (var j=0; j<arr_charts_path.length; j++) {
                    // If the charts
                    var str_chart_id = "charts_" + tmp_result_dates[i] + "_" + wsaw_all_tools[x] + "_" + (j+1).toString();
                    var check_exist = document.getElementById(str_chart_id);
                    if (!check_exist) {
                        var obj_img = document.createElement("IMG");
                        obj_img.setAttribute("src", arr_charts_path[j]);
                        //obj_img.setAttribute("width", "600");
                        obj_img.setAttribute("style", "width:900px;");
                        obj_img.setAttribute("alt", "");
                        obj_img.id = str_chart_id;
                        if (obj_img !== null) { document.body.appendChild(obj_img);}
                    }
                } // End for j
            }// End for x
            
            //if (!arr_select_tools.includes(wsaw_all_tools[x]) && tmp_result_dates.length>0) {
            //    arr_select_tools.push(wsaw_all_tools[x]);    
            //}
        }// End for i
        arr_select_tools = wsaw_all_tools.slice();
        return;
    } // All tools
    
    for (var i=0; i<tmp_result_dates.length; i++) {
        //alert("img/wsaw_img/"+tmp_result_dates[i]+"_"+str_selected_tool+"_*_41_NoFeedback.png"); // OK!
        var str_img_path1 = str_wsaw_img_path+tmp_result_dates[i]+"/"+str_selected_tool+"/"+str_model+"/1.png";
        var str_img_path2 = str_wsaw_img_path+tmp_result_dates[i]+"/"+str_selected_tool+"/"+str_model+"/2.png";
        var str_img_path3 = str_wsaw_img_path+tmp_result_dates[i]+"/"+str_selected_tool+"/"+str_model+"/3.png";
        var arr_charts_path = [str_img_path1, str_img_path2, str_img_path3];
        //alert(str_img_path);
        for (var j=0; j<arr_charts_path.length; j++) {
            // If the charts
            var str_chart_id = "charts_" + tmp_result_dates[i] + "_" + str_selected_tool + "_" + (j+1).toString();
            var check_exist = document.getElementById(str_chart_id);
            if (!check_exist) {
                var obj_img = document.createElement("IMG");
                obj_img.setAttribute("src", arr_charts_path[j]);
                //obj_img.setAttribute("width", "600");
                obj_img.setAttribute("style", "width:900px;");
                obj_img.setAttribute("alt", "");
                obj_img.id = str_chart_id;
                if (obj_img !== null) { document.body.appendChild(obj_img);}
            }
        }
    }    
    
    // For the reset button to see what tool had beec selected
    if (!arr_select_tools.includes(str_selected_tool) && tmp_result_dates.length>0) {
        arr_select_tools.push(str_selected_tool);    
    }
    //console.log(arr_select_tools);
    return;
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
    table_ncu.id = "table_" + str_selected_tool;
    table_ncu.border = "3px #FFD382 dashed";
    table_ncu.align = "center";
    //table_ncu.textAlign = "center"; // not working
    //table_ncu.fontSize = '150px'; // not working
    
    // Add columns looks like shit
    /*table_column = document.createElement('tbody');
    
    var tr_ncu = table_column.appendChild(document.createElement('tr'));
    for (var i=0; i<arr_ncu_columns.length; i++) {
        var td_ncu = tr_ncu.appendChild(document.createElement('td'));
        var a_ncu = td_ncu.appendChild(document.createElement('a'));
        a_ncu.innerText = arr_ncu_columns[i];
    }
    table_ncu.appendChild(table_column);//*/
    
    for (var i=0; i<tmp_result_dates.length; i++) {
        // Open log file
        //var str_log_filename = str_log_path+"."+str_selected_tool+"_"+tmp_result_dates[i]+".log"; // This won't work, don't know why
        var str_log_filename = str_log_path+tmp_result_dates[i]+".log";
        //console.log(tmp_result_dates[i]);
        
        var rawFile = new XMLHttpRequest();
        var str_allText = readTextFile(str_log_filename);
        var str_tool_log = "";
        // If user choose all tools
        if (str_selected_tool === 'ALL_TOOL') {
            str_tool_log = str_allText;
        } else {
        // Choose for select tool
            var arr_tool_log = str_allText.split("\n");
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
        var arr_ncu_tmp = [];
        for (var j=0; j<arr_ncu_log.length; j++) {
            arr_ncu_tmp = arr_ncu_log[j].split(",");
            //console.log(arr_ncu_tmp);
            if (arr_ncu_tmp.length < 30 && arr_ncu_tmp[0] !== "") {
                for (x=0; x<(31-arr_ncu_tmp.length); x++) {
                    arr_ncu_tmp.push("0.0"); 
                }
            }
            //console.log(arr_ncu_tmp.length);
            arr_ncu_remodel.push(arr_ncu_tmp);
        }
        //console.log(arr_ncu_remodel[0]);
        //console.log(arr_ncu_remodel[20][2]);
        
        // Table attributes
        //table_ncu.id = "log_" + tmp_result_dates[i] + "_" + str_selected_tool;
        //table_ncu.border = '1px solid black';
        
        
        var tbody_ncu = document.createElement("tbody");
        console.log(arr_ncu_remodel);
        for (j=0; j<arr_ncu_remodel.length; j++) {
            var tr_ncu = tbody_ncu.appendChild(document.createElement('tr'));
            for (var k=0; k<arr_ncu_remodel[j].length; k++) {
                if (arr_ncu_remodel[j][k] !== "") {
                    var td_ncu = tr_ncu.appendChild(document.createElement('td'));
                    var a_ncu = td_ncu.appendChild(document.createElement('a'));
                    a_ncu.innerText = arr_ncu_remodel[j][k];
                    //td_ncu.classList.add("bg-danger"); // All red XD
                    
                    // Now we add some color according to different situations
                    if (arr_ncu_remodel[j][k].replace(' ', '') === "ALARM") {
                        tr_ncu.classList.add("bg-danger");
                    } else {
                        tr_ncu.classList.add("bg-success");
                    }
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
        showResultsImages();
    }
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
    if (_month<10) { _month = "0" + _month;}
    str_key = year + _month;
    
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
                _date = date;
                if (_date<10) { _date = "0"+_date; }
                cell.id = str_key+_date;
                let cellText = document.createTextNode(date);
                //The classes for background colors are: .bg-primary, .bg-success, .bg-info,
                //.bg-warning, .bg-danger, .bg-secondary, .bg-dark and .bg-light.
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    if (arr_select_dates.includes(cell.id)) {
                        cell.classList.add("bg-secondary");
                    } else {
                        cell.classList.add("bg-info");    
                    }
                } // color today's date
                
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
                    if (cellText.nodeValue === String(today.getDate()) && year === today.getFullYear() && month === today.getMonth()) {
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
                    } else {
                        // Unselect date to NOT see result
                        if (cell.classList.contains("bg-secondary")) {
                            cell.classList.remove("bg-secondary");
                            const _index = arr_select_dates.indexOf(str_date);
                            arr_select_dates.splice(_index, 1);
                        // Select date to see result
                        } else {
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
