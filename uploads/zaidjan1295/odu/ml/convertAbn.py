import csv
import math

label = 20

dos = ['back.', 'land.','smurf.', 'pod.', 'neptune.', 'teardrop.'] 
probe = ['ipsweep.', 'portsweep.', 'nmap.', 'satan.']
u2r = ['loadmodule.', 'rootkit.', 'perl.', 'buffer_overflow.']
r2l =  ['guess_passwd.', 'multihop.', 'ftp_write.', 'spy.', 'phf.', 'imap.', 'warezclient.', 'warezmaster.']

# read = '../datasets/kddcup.data10.featureSelected.csv'
# write = '../datasets/kddcup.data10.multiClassifier.csv'
read = '../datasets/kddcup.data.featureSelected.csv'
write = '../datasets/kddcup.data.multiClassifier.csv'


with open(read) as csvDataFile:
    csvReader = csv.reader(csvDataFile)
    with open(write, 'w', newline="") as csvWriteFile:
        csvWriter = csv.writer(csvWriteFile)
        i = 0
        for row in csvReader:
            if (row[label] == 'normal.'):
                continue
            else:
                if row[label] in dos:
                    row[label] = 'DOS'
                elif row[label] in probe:
                    row[label] = 'Probe'
                elif row[label] in u2r:
                    row[label] = 'U2R'
                elif row[label] in r2l:
                    row[label] = 'R2L'
                else:
                    print('missed '+row[label])
                    continue
            csvWriter.writerows([row])

csvDataFile.close()
csvWriteFile.close()

print("normals rejected")
