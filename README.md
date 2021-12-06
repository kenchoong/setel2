## Introduction

After our last conversation, I notice that what I have done in previos assessment is not what the team looking for. Therefore I make this project to demonstrate I may be have what the team looking for

Only in backend with this assessment, which is same like the previous endpoint, just to demonstrate how the data flow

## Stack

- Nestjs microservices
- Docker
- MongoDB

## Run in docker

> $ git clone https://github.com/kenchoong/setel2.git
>
> $ docker-compose up
>
> $ wait the container build
>
> $ this expose localhost port 7000 http://localhost:7000/orders

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

![Diagram](../main/docker.png)

1. Gateway service: Expose Port:7000 to the public
2. Order MicroService: When Gateway get a request, will `send()` Order using Nestjs Message-Pattern
3. Order service interact with MongoDB CRUD. When successfully create an Order, will `emit()` a message which will trigger Payment Service.
4. Payment MicroService will get subsribe event from Order Service. When done process payment `emit()` a message back to OrderService.
5. OrderService receive message from PaymentService then Update `orderStatus` of the Order in db.

## Domain Driven Design

Each microservices only handle 1 thing. Each of them is a complete separate Nestjs app, what happen in Vegas stay at Vegas. Communicate with each other using TCP right now.

Each file inside the app also only do 1 thing.

- Controller: Only get event and return response
- Service: Interact with DB
- Interface: Defined all Data Transfer Object, and response type.
  Implement `Screaming architeture` (hope it clear enough).

## Deploy to AWS ECS

For more can read [this](https://aws.amazon.com/blogs/containers/deploy-applications-on-amazon-ecs-using-docker-compose/)

```
// define a AWS ECS docker context
$  docker context create ecs MyContextName

// select profile in my system
$ ? Create a Docker context using: MyProfile

Successfully created ecs context "MyContextName "

$  docker compose up
```
