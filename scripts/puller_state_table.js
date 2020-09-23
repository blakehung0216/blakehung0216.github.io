
var str_log_path = "log/";
var str_cvx_log_path = "cvx_log/";
var arr_columnms = ['Tool', 'Ingot', 'Class', 'State', 'Length', 'LZD Detection'];
var arr_online_tools = ['JC'];
var arr_all_tools = ["JC", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "EA", "EB", "EC", "ED", "EE", "EF", "EG", "EH", "EI", "EJ", "FA", "FB", "FC", "FD", "FE", "FF", "FG", "FH", "FI", "FJ", "GA", "GB", "GC", "GD", "GE", "GF", "GG", "GH", "GI", "GJ", "HA", "HB", "HC", "HD", "HE", "HF", "HG", "HH", "HI", "HJ", "IA", "IB", "IC", "ID", "IE", "IF", "IG", "IH", "JA", "JB", "JD", "JE", "JF", "JG", "JH", "JJ"]


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
    
    return allText;
}

function lzd_detection_result(str_log_tool) {
    //console.log("Detecting..." + str_log_tool);
    if (arr_online_tools.includes(str_log_tool)) {
        var str_log_filename = str_log_path + str_log_tool + '.log'; // log/JC.log
        var str_allText = readTextFile(str_log_filename); // JC, MJCW1, 300, BODY, 170,
        var str_lot = str_allText.split(", ")[1]; // MJCW1
        var str_cvx_log_name = "PULLER_" + str_log_tool + "_" + str_lot;
        var str_cvx_log_allText = readTextFile(str_cvx_log_path + str_cvx_log_name); // 2020-09-23 10:45:23, OK, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        arr_cvx_log = str_cvx_log_allText.split("\n");
        var str_cvx_log_allText2 = arr_cvx_log[arr_cvx_log.length-2]; // Get the last message
        //console.log(arr_cvx_log);
        //console.log(str_cvx_log_allText2);
        var str_OK_NG = str_cvx_log_allText2.split(", ")[1];
        //console.log(str_OK_NG);
        var arr_res = ["0", 4];
        if (str_OK_NG != "OK"){
            var arr_1_0 = str_cvx_log_allText2.split(", ");
            var count_1 = 0;
            for (var i=0; i<arr_1_0.length; i++) {if (arr_1_0[i] == "1") { count_1++; } }
            arr_res = ["1", count_1];
        }
        return arr_res;
    } else {
        return "-1";
    }
}

function puller_tool_state(str_tool) {
    //var str_log_path = "log/"
    //var str_log_tool = "JH";
    var str_log_tool = str_tool;
    var str_log_filename = str_log_path + str_log_tool + '.log';
    
    var str_allText = readTextFile(str_log_filename);
    //console.log(str_allText);
    
    // Result result declear
    var table_lzd = document.createElement("TABLE");
    var str_table_id = "table_lzd_column";
    if (document.getElementById(str_table_id)) {
        var obj_table = document.getElementById(str_table_id);
        obj_table.parentNode.removeChild(obj_table);
    }
    table_lzd.id = str_table_id;
    table_lzd.border = "3px #FFD382 dashed";
    table_lzd.align = "center";
    
    // Add columns
    table_column = document.createElement('tbody');
    table_column.style.background = "#994C00";
    table_column.style.fontSize = "5px";
    table_column.style.color = "#ffffff";
    
    var tr_ncu = table_column.appendChild(document.createElement('tr'));
    for (var i=0; i<arr_columnms.length; i++) {
        var td_ncu = document.createElement('td');
        if (i === 5) {
            td_ncu.style.width = '230px';
        } else {
            td_ncu.style.width = '150px';
        }
        td_ncu.style.textAlign = 'center';
        td_ncu.style.fontSize = '20px';
        tr_ncu.appendChild(td_ncu);
        var a_ncu = td_ncu.appendChild(document.createElement('b'));
        a_ncu.innerText = arr_columnms[i];
    }
    table_lzd.appendChild(table_column);//*/
    
    var today = new Date();
    var yyyy = today.getFullYear().toString();
    var mm = (today.getMonth()+1<10) ? ("0"+(today.getMonth()+1)) : ((today.getMonth()+1).toString());
    var dd = (today.getDate()<10) ? ("0"+today.getDate().toString()) : (today.getDate().toString());
    var str_date = yyyy + "-" + mm + "-" + dd; // 2020-09-22
    
    var HH = (today.getHours()<10) ? ("0"+today.getHours().toString()) : (today.getHours().toString());
    var MM = (today.getMinutes()<10) ? ("0"+today.getMinutes().toString()) : (today.getMinutes().toString());
    var SS = (today.getSeconds()<10) ? ("0"+today.getSeconds().toString()) : (today.getSeconds().toString());
    var str_time = HH + ":" + MM + ":" + SS; // 11:32:26
        //today.getHours().toString() + ":" + today.getMinutes().toString() + ":" + today.getSeconds().toString();
    //console.log(str_date + " " + str_time);
    
    // Add results
    for (var i=0; i<arr_all_tools.length; i++) {
        var str_log_tool = arr_all_tools[i];
        if (!arr_all_tools.includes(str_log_tool)) {
            continue;
        }
        var str_log_filename = str_log_path + str_log_tool + '.log';

        var str_allText = readTextFile(str_log_filename); //JH, MJHJ5, 300, MELTDOWN, 0, 
        var arr_table_result = str_allText.split(", ");
        var str_lzd_result = "-1";
        var int_zd_count = 0;
        if (arr_online_tools.includes(arr_table_result[0])) {
            var arr_res = lzd_detection_result(str_log_tool);
            str_lzd_result = arr_res[0];
            int_zd_count = arr_res[1];
            if (arr_table_result[3] !== "BODY") {str_lzd_result = "2";}
        }
        
        //console.log(int_zd_count);
        //console.log(str_lzd_result);
        
        if (str_lzd_result === "0") {
            arr_table_result[arr_table_result.length-1] = 'OK';
        } else if (str_lzd_result === "1") {
            arr_table_result[arr_table_result.length-1] = 'NG';
        } else if (str_lzd_result === "2") {
            arr_table_result[arr_table_result.length-1] = 'STBY';
        } else { // "-1"
            arr_table_result[arr_table_result.length-1] = '---';
        }
        
        var table_result = document.createElement('tbody');
        var tr_puller = table_result.appendChild(document.createElement('tr'));
        for (var j=0; j<arr_table_result.length; j++) {
            var td_puller = document.createElement('td');
            td_puller.style.textAlign = 'center';
            td_puller.style.fontSize = '15px';
            var cell_value = arr_table_result[j];
            
            if (cell_value === 'OK') {
                tr_puller.style.backgroundColor = '#66ff66';
            } else if (cell_value === 'NG') {
                tr_puller.style.backgroundColor = '#ff6666';
                cell_value += ", " + str_date + ", " + str_time + ", " + int_zd_count.toString();
            } else if (cell_value === 'STBY') {
                tr_puller.style.backgroundColor = '#ffff00';
            } else if (cell_value === '---') {
                tr_puller.style.backgroundColor = '#C0C0C0';
            }
            
            td_puller.appendChild(document.createTextNode(cell_value));
            tr_puller.appendChild(td_puller);
        }
        table_lzd.appendChild(tr_puller);
    }
    
    
    document.body.appendChild(table_lzd);
}


//while (true) {
//    puller_tool_state();
//    await sleep(2000);
//}

puller_tool_state();