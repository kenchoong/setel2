## Introduction

After our last conversation, I notice that what I have done in previos assessment is not what the team looking for. Therefore I make this project to demonstrate I may be have what the team looking for

Only in backend with this endpoint, which is same like the previous endpoint, just to demonstrate how the data flow

## Stack

- Nestjs microservices
- Docker
- MongoDB



## Run in docker

> $ Git clone https://github.com/kenchoong/setel2.git
>
> $ docker-compose up -d
>
> $ wait the container build
>
> $ this expose localhost post 7000 http://localhost:7000/orders 

Below is all the endpoint and also params

- `POST /orders` : Create order, json body

    <details>
    <summary>Create order params, Click to expand</summary>

  ```json
  {
    "userId": "1234",
    "productId": "1", // 1 or 2
    "productName": "Chicken wing",
    "totalOrderAmount": "RM 99",
    "orderStatus": "12345",
    "createdAt": "today"
  }
  ```

    </details>

- `PUT /orders`: Update orderStatus to Cancelled,Confirm from frontend

    <details>
    <summary>Update order params, Click to expand</summary>

  ```json
  {
    "orderStatus": "Done happy good day",
    "orderId": "someid" // get it from Create order
  }
  ```

    </details>

- `orders/one/:orderId`: Get 1 order
- `orders/status/:orderId`: Check status of 1 order
- `orders/:userId`: Get all order of user

## Behind the scenes 


