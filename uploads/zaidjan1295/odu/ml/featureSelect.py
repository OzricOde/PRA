import pandas as pd  
import numpy as np  
import csv
from sklearn.feature_selection import SelectKBest
from sklearn.feature_selection import chi2

label = 41

names = ['duration','protocol_type','service','flag','src_bytes','dst_bytes','land','wrong_fragment','urgent','hot','num_failed_logins','logged_in','num_compromised','root_shell','su_attempted','num_root','num_file_creations','num_shells','num_access_files','num_outbound_cmds','is_host_login','is_guest_login','count','srv_count','serror_rate','srv_serror_rate','rerror_rate','srv_rerror_rate','same_srv_rate','diff_srv_rate','srv_diff_host_rate','dst_host_count','dst_host_srv_count','dst_host_same_srv_rate','dst_host_diff_srv_rate','dst_host_same_src_port_rate','dst_host_srv_diff_host_rate','dst_host_serror_rate','dst_host_srv_serror_rate','dst_host_rerror_rate','label']
data = pd.read_csv('./datasets/kddcup.data10.normalized.csv', names=names)
X = data.drop('label', axis=1)  
y = data['label']  

print("list all features\n", names)
print()

# selector = SelectKBest(f_classif, k=25)
selector = SelectKBest(chi2, k=20)

#fit_transform returns the data after selecting the best features
new_data = selector.fit_transform(X, y)
mask = selector.get_support()
index = 0

array = []

for element in mask:
    if(element == 1):
        array.append(names[index])
    index += 1
array.append("label")
print("list of all features selected\n",array)

# fileToRead = './datasets/kddcup.data10.normalized.csv'
# fileToWrite = './datasets/kddcup.data10.featureSelected.csv'
fileToRead = './datasets/kddcup.data.normalized.csv'
fileToWrite = './datasets/kddcup.data.featureSelected.csv'

line = []
with open(fileToRead) as csvDataFile:
    csvReader = csv.reader(csvDataFile)
    with open(fileToWrite, 'w', newline="") as csvWriteFile:
        csvWriter = csv.writer(csvWriteFile)
        for row in csvReader:   
            j = 0
            for element in row:
                if j == label - 1:
                    continue
                if(mask[j] == 1):
                    line.append(row[j])
                j = j+1    
            # print("row after is", row) 
            line.append(row[label])     
            csvWriter.writerows([line])
            line = []
    
print("featureSelected")  

csvDataFile.close()
csvWriteFile.close()