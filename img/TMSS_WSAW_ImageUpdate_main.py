#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jun  8 15:41:51 2020
@author: hungtszen
"""
import subprocess
from datetime import datetime
import time

str_cmd = 'python3 TMSS_WSAW_Image_Update.py'
str_time_process = "06:30" # "16:20" means every 16:20 will have a daily report

def main():
    #p = subprocess.Popen(cmd, stdout=subprocess.PIPE, shell=True)
    flag_just_once = True
    while (True):
        now = (datetime.now()).strftime('%H:%M')
        #print (str(now))
        if (str(now) == "00:00"):
            flag_just_once = True
        
        if (str(now) == str_time_process and flag_just_once):
            p = subprocess.Popen(str_cmd, stdout=subprocess.PIPE, shell=True)
            flag_just_once = False
        time.sleep(10)
main()
