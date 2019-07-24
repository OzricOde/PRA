const resolveDbName = (frontData) => {
    const batch = frontData.batch;
    const dept = frontData.dept;
    const dbName = `ait_${dept}_${batch}`
    return dbName;
}
const resolveTableName = (frontData) => {
    const sem = frontData.sem;
    const tableName = `${sem}sem`
    return tableName;
}

// const config = () => {
//     return {
//         'cse': {
//             'batch': '2015'
//         }
//     }
// }
    
module.exports = {
    resolveDbName,
    resolveTableName
}