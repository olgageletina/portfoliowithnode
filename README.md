# portfoliowithnode

This is a repository for my personal website

![portfolio architecture](https://s3.amazonaws.com/geletina-images/portfolio-architecture.png)

Server: listens and responds to HTTP requests
Router: parses URL, adds query terms to request, and sends to appropriate controller parses URL, adds query terms to request, and sends to appropriate controller  
Conroller: requests data from model sends it to the view, then sends the view HTML response back up the chain
View: renders the response
Model: Google sheets back end parses request to query appropriate data
