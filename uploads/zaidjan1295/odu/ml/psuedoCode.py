#Convert the symbolic values in the dataset to numeric values
#Scale the features in the dataset in such that one attributes values don't dominate the values of other #attributes
newValue= (oldValue - minValueInPaticularAttribute)/(maxValueInPaticularAttribute - minValueInPaticularAttribute)

#Split the dataset into attributes and label
X = attributes
y = label

#Select 20 features that are most significant to the result of the variable based on the chi-square score of each attribute
selector = SelectKBest(chi2, k=20)
new_data = selector.fit_transform(X, y)

#Split the dataset into training set and test set into X_train, X_test, y_train, y_test such that x_test, y_test #contain 20% of the dataset for finding for the accuracy, precision, recall, f1 score of the model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.20) 

#Configure The SVM classfier
svclassifier = SVC(kernel='rbf', gamma='scale', verbose=1)

#Train The classifier on X_train, Y_train
svclassifier.fit(X_train, y_train)

#Run the classifier on X_test to get a vector with prediction on each test example in x_test
y_pred = svclassifier.predict(X_test) 

#Compare the values of y_test, y_pred to get the Confusion Matrix 
confusion_matrix(y_test,y_pred)

#Compare the values of y_pred, y_test in order to measure the accuracy, precision, recall, f1 score of the model
classification_report(y_test,y_pred)

#Save the trained model for use on application level
pickle.dump(svclassifier, open('finalizedModel.sav', 'wb'))



