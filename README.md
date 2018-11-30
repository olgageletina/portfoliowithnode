# portfoliowithnode

This is a repository for my personal website. Built with Node.js, without the use of any additional frameworks.

## Here's how it works:
![portfolio architecture-final](https://s3.amazonaws.com/geletina-images/portfolio-architecture-00.png)


| Key        | function           | Scripts  |
| ------------- |-------------| -----|
|__Server__      | listens and responds to HTTP requests | server.js |
|__Router__      | parses URL, adds query terms to request, and sends to appropriate controller parses URL, adds query terms to request, and sends to appropriate controller      |   router.js |
|__Conroller__ | requests data from model sends it to the view, then sends the view HTML response back up the chain      |    /controllers* |
|__View__ | renders the response      |    /views* |
|__Model__ | Google sheets back end parses request to query appropriate data      |    /model/test-data-google-sheet.js |

## TODO:
Add notes on deployment to Google App Engine
