import pandas as pd  
import numpy as np  
import matplotlib.pyplot as plt 
import pickle 
from datetime import datetime

def responseString(prob):
    prob = prob * 100
    if(prob > 70):
        return 'Red'
    elif (prob > 30):
        return 'Yellow'
    else:
        return 'Green'

print("attributes of a request that cause normal behaviour")
testData = [[0.0,0.051282,0.138297,0.0,0.0,0.0,0.0,0.021526,0.021526,0.0,0.0,0.0,0.0,0.094117,0.623529,1.0,0.0,0.04,0.04,0.0]]
#label = 1
# print("attributes of a request that causes anomalous behaviour")
# testData = [[0.0,0.0,0.0,0.0,0.0,0.0,0.0,1.0,1.0,0.0,0.0,0.0,0.0,1.0,1.0,0.0,1.0,0.0,0.0,0.0]]
print(testData)
#label = 0
file1 = './ml/finalizedBinaryModel.sav'
applicationBinary = pickle.load(open(file1, 'rb'))
print("model loaded")
print("testing testData")

tstart = datetime.now()
x = applicationBinary.predict_proba(testData)
tend = datetime.now()
print("time taken to process request ",tend - tstart)
resString = responseString(x[0][0])
print("probabilities", x)
if(resString == 'Green'):
    print("Shows less deviation from normal behaviour, can be processed")
else:
    file2 = './ml/finalizedMultiModel.sav'
    applicationMulti = pickle.load(open(file2, 'rb'))
    y = applicationMulti.predict(testData)
    # out = 
    print("Malicious Request, of threat type" ,y[0], 'with threat ranking of', resString) 