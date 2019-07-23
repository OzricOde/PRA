import pandas as pd  
import numpy as np  
import matplotlib.pyplot as plt 
import pickle 

# print("attributes of a request that cause normal behaviour")
# testData = [[0.0,0.051282,0.138297,0.0,0.0,0.0,0.0,0.021526,0.021526,0.0,0.0,0.0,0.0,0.094117,0.623529,1.0,0.0,0.04,0.04,0.0]]
#label = 1
print("attributes of a request that causes anomalous behaviour")
testData = [[0.0,0.0,0.0,0.0,0.0,0.0,0.0,1.0,1.0,0.0,0.0,0.0,0.0,1.0,1.0,0.0,1.0,0.0,0.0,0.0]]
print(testData)
#label = 0
file1 = 'finalizedBinaryModel.sav'
applicationBinary = pickle.load(open(file1, 'rb'))
print("model loaded")
print("testing testData")
x = applicationBinary.predict(testData)
print("model predicts label ",x[0])
if (x[0] == 1):
    print("Normal Request, can be processed further")
else:
    file2 = 'finalizedMultiModel.sav'
    applicationMulti = pickle.load(open(file2, 'rb'))
    y = applicationMulti.predict(testData)
    # out = 
    print("Malicious Request, of threat type" ,y[0]) 