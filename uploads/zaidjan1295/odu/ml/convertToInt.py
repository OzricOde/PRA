import csv
import math

label = 41

def changeToNumericValues(x):
    y = math.fabs(hash(x)) % 97
    return y 
# read = '../datasets/kddcup.data10.csv'
read = '../datasets/kddcup.data.csv'
write = '../datasets/kddcup.data.intConverted.csv'
# write = '../datasets/kddcup.data10.intConverted.csv'
with open(read) as csvDataFile:
    csvReader = csv.reader(csvDataFile)
    with open(write, 'w', newline="") as csvWriteFile:
        csvWriter = csv.writer(csvWriteFile)
        i = 0
        for row in csvReader:
            row[1] = int(changeToNumericValues(row[1]))
            row[2] = int(changeToNumericValues(row[2]))
            row[3] = int(changeToNumericValues(row[3]))
            csvWriter.writerows([row])

csvDataFile.close()
csvWriteFile.close()

print("int converted")
