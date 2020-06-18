
var str_log_path = "log/";
var arr_columnms = ['Tool', 'Ingot', 'Class', 'State', 'Length', 'LZD Detection'];
var arr_online_tools = ['JH'];
var arr_all_tools = ["AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "EA", "EB", "EC", "ED", "EE", "EF", "EG", "EH", "EI", "EJ", "FA", "FB", "FC", "FD", "FE", "FF", "FG", "FH", "FI", "FJ", "GA", "GB", "GC", "GD", "GE", "GF", "GG", "GH", "GI", "GJ", "HA", "HB", "HC", "HD", "HE", "HF", "HG", "HH", "HI", "HJ", "IA", "IB", "IC", "ID", "IE", "IF", "IG", "IH", "JA", "JB", "JC", "JD", "JE", "JF", "JG", "JH", "JJ"]


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
    if (arr_online_tools.includes(str_log_tool)) {
        return "0";
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
            td_ncu.style.width = '200px';
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
    
    // Add results
    for (var i=0; i<arr_all_tools.length; i++) {
        var str_log_tool = arr_all_tools[i];
        if (!arr_all_tools.includes(str_log_tool)) {
            continue;
        }
        var str_log_filename = str_log_path + str_log_tool + '.log';

        var str_allText = readTextFile(str_log_filename); //JH, MJHJ5, 300, MELTDOWN, 0, 
        var arr_table_result = str_allText.split(", ");
        var str_lzd_result = lzd_detection_result(str_log_tool);
        if (str_lzd_result === "0") {
            arr_table_result[arr_table_result.length-1] = 'SAFE';
        } else if (str_lzd_result === "1") {
            arr_table_result[arr_table_result.length-1] = 'ALARM';
        } else { // "-1"
            arr_table_result[arr_table_result.length-1] = 'No detection';
        }
        
        var table_result = document.createElement('tbody');
        var tr_puller = table_result.appendChild(document.createElement('tr'));
        for (var j=0; j<arr_table_result.length; j++) {
            var td_puller = document.createElement('td');
            td_puller.style.textAlign = 'center';
            td_puller.style.fontSize = '15px';
            var cell_value = arr_table_result[j];
            
            if (cell_value === 'SAFE') {
                tr_puller.style.backgroundColor = '#66ff66';
            } else if (cell_value === 'ALARM') {
                tr_puller.style.backgroundColor = '#ff6666';
            } else if (cell_value === 'No detection') {
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