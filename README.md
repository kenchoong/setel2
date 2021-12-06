## Introduction

After our last conversation, I notice that what I have done in previos assessment is not what the team looking for. Therefore I make this project to demonstrate I may be have what the team looking for

Only backend for this assessment, which is same like the previous endpoint, just to demonstrate how the data flow

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

This will initialize 3 service `gateway`, `order`, `payment` and 1 `mongodb`, initialize admin user for the db at the beginning. And expose to port 7000. 

Below is all the endpoint and also params, `http://localhost:7000`

- `POST /orders` : Create order, json body

    <details>
    <summary>Create order params, Click to expand</summary>

  ```json
  {
    "userId": "1234",
    "productId": "1", // 1 will success, 2 will failed
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

By default `orderStatus` in Order(in DB) is `Processing`, after `POST /order`, then call `orders/one/:orderId`, the `orderStatus` will become `Success` now, which is the response like this. 

```
{
    "ok": true,
    "order": {
        // ... all other stuff
        "orderStatus": "Success", << Default Processing, here is updated to success
    }
}
```

## Behind the scenes

![Diagram](../main/docker.png)

1. Gateway service: Expose Port:7000 to the public
2. Order MicroService: When Gateway get a request, will `send()` Order using Nestjs Message-Pattern
3. Order service interact with MongoDB CRUD. When successfully create an Order, will `emit()` a message which will trigger Payment Service.
4. Payment MicroService will get subsribe event from Order Service. When done process payment `emit()` a message back to OrderService.
5. OrderService receive message from PaymentService then Update `orderStatus` of the Order in db.

To prove this, this is what you will see in console when call `POST /order`

```ts
========== START CREATE ORDER ====================< Gateway: trigger by API call
========== START CREATE ORDER SERVICE ============< OrderService: Receive call from Gateway
========== DONE CREATE ORDER ========== ==========< OrderService: Done create order in DB, return response to User
========== EMITTING MESSAGE ======================< OrderService: send message to PaymentService
========= START PROCESS ORDER PAYMENT SERVICE=====< PaymentService: receive message from OrderService
========== DONE START PROCESS ORDER PAYMENT SERVICE< PaymentService: Processing the payment
========== EMIT MESSAGE TO ORDER SERVICE========== < PaymentService: Send message and payload to OrderService
========== START UPDATE PAYMENT SERVICE=========== < OrderService: Receive message payload from OrderService
'LINE 41 ORDER Controller', {Updated Order object} < OrderService: Done update Order object in DB, and return the result

```


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

For more scalable stuff, I figure it out later. 
