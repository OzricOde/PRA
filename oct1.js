    
const Octokit = require('@octokit/rest')
const octokit = new Octokit({
  auth: 'token a571af79b98093e504a67da8bac840a748faa9ba'
 })


// octokit.repos.listForUser({
//   username: 'vanesssapearlss',
//   }).then(({ data }) => {
//   console.log({data})
// })



// octokit.repos.createForAuthenticatedUser({
//   name: 'bye',
// })

// octokit.repos.delete({
//   owner : 'vanesssapearlss',
//   repo : 'copy'
// })


octokit.repos.createOrUpdateFile({
  owner : 'vanesssapearlss',
  repo : 'aaa',
  path : 'eee/rrr',
  message: 'kjdkjdfb',
  content : 'bXkgbmV3IGZpbGUgY29udGVudHM='
