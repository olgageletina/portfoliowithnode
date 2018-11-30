# portfoliowithnode

This is a repository for my personal website. 

## Here's how it works:
![portfolio architecture-final](https://s3.amazonaws.com/geletina-images/portfolio-architecture-00.png)

__Server:__ listens and responds to HTTP requests

__Router:__ parses URL, adds query terms to request, and sends to appropriate controller parses URL, adds query terms to request, and sends to appropriate controller  

__Conroller:__ requests data from model sends it to the view, then sends the view HTML response back up the chain

__View:__ renders the response

__Model:__ Google sheets back end parses request to query appropriate data


## TODO:
Add notes on deployment to Google App Engine
