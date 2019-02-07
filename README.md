# portfoliowithnode
<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png' height='20px'/></a>

This is a repository for my personal website. Built with Node.js, without the use of any additional frameworks.

## Here's how it works:
![portfolio architecture-final](https://s3.amazonaws.com/geletina-images/portfolio-architecture.png)


| Key        | Function           | Scripts  |
| ------------- |-------------| -----|
|__Server__      | listens and responds to HTTP requests | server.js |
|__Router__      | parses URL, adds query terms to request, and sends to appropriate controller parses URL, adds query terms to request, and sends to appropriate controller      |   router.js |
|__Conroller__ | requests data from model sends it to the view, then sends the view HTML response back up the chain      |    /controllers* |
|__View__ | renders the response      |    /views* |
|__Model__ | [Google sheets back end](https://docs.google.com/spreadsheets/d/1s3noi79O9Z9k19jLVm0x34zkIi5wSVzHqLNUptRFuMM/edit?usp=sharing) parses request to query appropriate data      |    /model/test-data-google-sheet.js |

## Notes on deployment to Google App Engine:
Before deploying the app, make sure:
1. GCP project is created
2. [App Engine project](https://console.cloud.google.com/projectselector/appengine/create) is created 
3. Billing is enabled
4. [Permissions](https://console.cloud.google.com/iam-admin/iam) look good
