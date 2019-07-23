import csv
import math

label = 20

# read = '../datasets/kddcup.data10.featureSelected.csv'
read = '../datasets/kddcup.data.featureSelected.csv'
write = '../datasets/kddcup.data.labelConverted.csv'
# write = '../datasets/kddcup.data10.labelConverted.csv'

with open(read) as csvDataFile:
    csvReader = csv.reader(csvDataFile)
    with open(write, 'w', newline="") as csvWriteFile:
        csvWriter = csv.writer(csvWriteFile)
        i = 0
        for row in csvReader:
            if(row[label] == "normal."):
                row[label] = 1
            else:
                row[label] = 0
            csvWriter.writerows([row])

csvDataFile.close()
csvWriteFile.close()

print("label converted")
