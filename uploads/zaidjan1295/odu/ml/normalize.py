import csv

import math
def truncate(number, digits) -> float:
    stepper = pow(10.0, digits)
    return math.trunc(stepper * number) / stepper

# label = 20
label = 41
maxVal = 999999999999999
minVal = -1

max = [minVal]*label
min = [maxVal]*label


def normalize(value, i):
    num = (value - min[i])
    den = max[i] - min[i]
    if den == 0:
        return value
    z = truncate(num/den,6)
    return z

# fileToRead = '../datasets/kddcup.data10.featureSelected.csv'
fileToRead = '../datasets/kddcup.data10.intConverted.csv'
# fileToRead = '../datasets/kddcup.data.intConverted.csv'

# fileToWrite = '../datasets/kddcup.data10.testNormalized.csv'
fileToWrite = '../datasets/kddcup.data10.normalized.csv'
# fileToWrite = '../datasets/kddcup.data.normalized.csv'



with open(fileToRead) as csvDataFile:
    csvReader = csv.reader(csvDataFile)
    for row in csvReader:
        j = 0
        for element in row:
            if(j == label):
                continue
            if(float(element) < min[j]):
                min[j] = float(element)
            if(float(element) > max[j]):
                max[j] = float(element)
            j = j+1

csvDataFile.close()

print("max of all attributes is", max)
print("min of all attributes is", min)

with open(fileToRead) as csvDataFile:
    csvReader = csv.reader(csvDataFile)
    with open(fileToWrite, 'w', newline="") as csvWriteFile:
        csvWriter = csv.writer(csvWriteFile)
        for row in csvReader:
            # print("row before is", row)       
            j = 0
            for element in row:
                if j == label:
                    continue
                row[j] = normalize(float(element), j)
                j = j+1    
            # print("row after is", row)        
            csvWriter.writerows([row])
    
print("normalized")  

csvDataFile.close()
csvWriteFile.close() 

            