#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed May  6 15:07:20 2020
@author: hungtszen
Program: Help creating the HTML table structure
"""
import pandas as pd

df_para = pd.read_csv('wsaw_para.csv', encoding = "Big5")
print (list(df_para.columns))
list_col = list(df_para.columns)
list_features_41 = ['PROFILE_03', 'PROFILE_05', 'PROFILE_06', 'PROFILE_07', 
                        'PROFILE_08', 'PROFILE_09', 'PROFILE_10', 'PROFILE_11', 
                        'PROFILE_12', 'PROFILE_13', 'PROFILE_14', 'PROFILE_15', 
                        'PROFILE_17', 'PROFILE_18', 'PROFILE_20', 'PROFILE_21', 'PROFILE_22',
                        'Delta_PROFILE_03', 'Delta_PROFILE_11',
                        'Delta_PROFILE_14', 'Delta_PROFILE_22','Delta_PROFILE_20', 'Delta_PROFILE_21',
                        'Diff_PROFILE_03', 'Diff_PROFILE_05', 'Diff_PROFILE_06', 'Diff_PROFILE_07', 
                        'Diff_PROFILE_08', 'Diff_PROFILE_09', 'Diff_PROFILE_10', 'Diff_PROFILE_11', 
                        'Diff_PROFILE_12', 'Diff_PROFILE_13', 'Diff_PROFILE_14', 'Diff_PROFILE_15', 
                        'Diff_PROFILE_17', 'Diff_PROFILE_18', 'Diff_PROFILE_20', 'Diff_PROFILE_21', 
                        'Diff_PROFILE_22',]


str_html_code = ""

for i in range(len(df_para)):
    #print (df_para)
    
    
    df_tmp = df_para.loc[i,:]
    if (str(df_tmp['PROFILE']) in list_features_41):
        str_html_code += "<tr>\n"
        for f in list_col:
            str_html_code += "<td>"
            str_html_code += str(df_tmp[f])
            str_html_code += "</td>"
            if (f == list_col[-1]):
                str_html_code += "\n"
    
        str_html_code += "</tr>\n"
    #print ("===")    