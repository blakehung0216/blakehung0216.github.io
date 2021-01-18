let str_toolname = document.getElementById('headline').textContent;

// Read txt file
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


function update_alarm_log(str_toolname) {
    // alarm_logs is a softlink folder lead to /tmss_raw_data/WSAW_ALARMS folder in TMSS server
    // alarm_logs/WSAWB01/WSAWB01_alarmlogs
    var str_log_path = "alarm_logs/"+str_toolname+"/"+str_toolname+"_alarmlogs";
    var str_log_info = readTextFile(str_log_path);
    /*
    alarm_logs/WSAWB01/WSAWB01_20210118_alarms.dbf
    alarm_logs/WSAWB01/WSAWB01_20210117_alarms.dbf
    ...
    */
    var arr_file_record = str_log_info.split('\n');
    
    // Create a file list according to
    let ul_alarm = document.createElement('ul');
    ul_alarm.id = "alarm_log";
    for (var i=0; i<arr_file_record.length; i++) {
        let li_alarm = document.createElement('li');
        let a_alarm = document.createElement('a');
        let linkText = document.createTextNode(arr_file_record[i].split('/')[arr_file_record[i].split('/').length-1]);
        a_alarm.appendChild(linkText);
        a_alarm.href = arr_file_record[i];
        li_alarm.appendChild(a_alarm);
        ul_alarm.appendChild(li_alarm);
    }
    
    document.body.appendChild(ul_alarm);
    return;
}

update_alarm_log(str_toolname);