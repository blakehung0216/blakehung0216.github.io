# -*- coding: utf-8 -*-
"""
Program: This script is for the TMSS Image Post processing
Date: 2020/06/08
Author: Blake
"""
import pandas as pd
import os, sys, glob, shutil


def www_wsaw_img_update():
    str_img_folder = '/tmss'
    str_img_folder_reg = str_img_folder + '/*png'#'_tmp_web/*png'
    
    # make sure img folder exist
    if (os.path.isdir(str_img_folder)):
        print ('Start Post-Processing!')
    else:
        sys.exit()
        
    # Make result folder
    str_result_folder = 'wsaw_img'#str_img_folder + '_Post_Processing'
    if (not os.path.isdir(str_result_folder)):
        os.mkdir(str_result_folder)
        
    # Activate the Recorder
    str_recorder = 'lots_model.csv'
    if (not os.path.isfile(str_result_folder+'/'+str_recorder)):
        df_recorder = pd.DataFrame([], columns=['Lots_Models'])
    else:
        df_recorder = pd.read_csv(str_result_folder+'/'+str_recorder)
    
    # get all images    
    list_img_files = glob.glob(str_img_folder_reg)
    list_img_files.sort()
    
    
    # Post-Processing for images
    list_all_lots_processed = list(df_recorder['Lots_Models'])
    for i in range(len(list_img_files)):
        str_tmp_path = str_result_folder + '/'
        str_img = list_img_files[i].split('/')[-1] # 20200608_WSAWB01_XXXXXXX_41_NoFeedback.png
        # Date folder
        str_dates = str_img.split('_')[0] # 20200608
        str_tmp_path = str_tmp_path + str_dates + '/' # _tmp_web_Post_Processing/20200608/
        if (not os.path.isdir(str_tmp_path)):
            os.mkdir(str_tmp_path)
        
        # Tool folder
        str_tool = str_img.split('_')[1] # WSAWB01
        str_tmp_path = str_tmp_path + str_tool + '/' # _tmp_web_Post_Processing/20200608/WSAWB01/
        if (not os.path.isdir(str_tmp_path)):
            os.mkdir(str_tmp_path)
            
        # Model folder
        str_model = str_img.split('_')[-2] # 41
        str_tmp_path = str_tmp_path + str_model + '/' # _tmp_web_Post_Processing/20200608/WSAWB01/41/
        if (not os.path.isdir(str_tmp_path)):
            os.mkdir(str_tmp_path)
            
        # Start processing
        str_lots = str_img.split('_')[2] # XXXXXXX
        str_lot_model = str_lots + "_" + str_model
        if (str_lot_model in list_all_lots_processed):
            continue
        else:
            list_all_lots_processed.append(str_lot_model)
        
        # Confirm Image 1 2 3.png
        str_src_img = str_img_folder+'/'+str_img
        if (os.path.isfile(str_tmp_path+'1.png')):
            if (os.path.isfile(str_tmp_path+'2.png')):
                shutil.copy(str_src_img, str_tmp_path+'3.png')
            else:
                shutil.copy(str_src_img, str_tmp_path+'2.png')
        else:
            shutil.copy(str_src_img, str_tmp_path+'1.png')
            
        #sys.exit()
            
    # Results recording
    df_recorder = pd.DataFrame(list_all_lots_processed, columns=['Lots_Models'])
    df_recorder.to_csv(str_result_folder+'/'+str_recorder, index=False)
    print ('Post-Processing done!')

# Debug
www_wsaw_img_update()