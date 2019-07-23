# imports to run ml libraries
import pandas as pd  
import numpy as np  
import matplotlib.pyplot as plt 
import pickle 
from datetime import datetime
# %matplotlib inline

# read csv file for dataset

# 20
names = ['duration', 'protocol_type', 'service', 'land', 'num_failed_logins', 'is_host_login', 'is_guest_login', 'count', 'srv_count', 'serror_rate', 'srv_rerror_rate', 'diff_srv_rate', 'srv_diff_host_rate', 'dst_host_count', 'dst_host_srv_count', 'dst_host_same_srv_rate', 'dst_host_diff_srv_rate',
'dst_host_same_src_port_rate', 'dst_host_srv_diff_host_rate', 'dst_host_serror_rate', 'label']

# read = '../datasets/kddcup.data10.multiClassifier.csv'
read= '../datasets/kddcup.data.multiClassifier.csv'

data = pd.read_csv(read, names = names)
# shows first few elements in dataset
x = data.head()
print(x)
#split labels and attributes
X = data.drop('label', axis=1)  
y = data['label']  

#split X, Y into training and test datasets
from sklearn.model_selection import train_test_split  
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.20)  

#train svm, svclassfier stores the trained modal
start = datetime.now()
print("started training model")
from sklearn.svm import SVC  
svclassifier = SVC(kernel='rbf', gamma='scale', verbose=1)
print("classifier created")  
svclassifier.fit(X_train, y_train)
end = datetime.now()
print("model trained")

#make predictions
y_pred = svclassifier.predict(X_test) 

#get metric for the modal
from sklearn.metrics import classification_report, confusion_matrix  
print("Confusion Matrix is\n",confusion_matrix(y_test,y_pred))  
print("Precision, recall and f1 score of the model is")
print(classification_report(y_test,y_pred)) 

print("saving models")
filename = 'finalizedMultiModel.sav'
pickle.dump(svclassifier, open(filename, 'wb'))