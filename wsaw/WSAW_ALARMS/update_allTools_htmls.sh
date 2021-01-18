#!/bin/bash

for i in `seq 2 21`
do
        #echo $i
        if [ $i -lt 10 ]; then
                #echo "<li><a href=\"WSAW_ALARMS/WSAWB0"$i"_alarmlogs.html\">"WSAWB0"$i""</a></li>"
		#cp WSAWB01_alarmlogs.html "WSAWB0"$i"_alarmlogs.html"
        	cat WSAWB01_alarmlogs.html | sed "s/WSAWB01/WSAWB0$i/g" > "WSAWB0"$i"_alarmlogs.html"
	elif [ $i -ge 10 ]; then
                #echo "<li><a href=\"WSAW_ALARMS/WSAWB"$i"_alarmlogs.html\">"WSAWB"$i""</a></li>"
		#cp WSAWB01_alarmlogs.html "WSAWB"$i"_alarmlogs.html"
        	cat WSAWB01_alarmlogs.html | sed "s/WSAWB01/WSAWB$i/g" > "WSAWB"$i"_alarmlogs.html"
	fi
done
#cp WSAWB01_alarmlogs.html "WSAWC01_alarmlogs.html"
cat WSAWB01_alarmlogs.html | sed "s/WSAWB01/WSAWC01/g" > "WSAWC01_alarmlogs.html"
