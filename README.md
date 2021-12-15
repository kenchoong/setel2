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
> $ docker-compose up --build
>
> $ wait the container build
>
> $ this expose localhost port 7000 http://localhost:7000/orders

This will initialize 3 service `gateway`, `order`, `payment` and 1 `mongodb`, initialize admin user for the db at the beginning. And expose to port 7000.

Below is all the endpoint and also params, `http://localhost:7000`, a full documentation in Swagger will be at [http://localhost:7000/api](http://localhost:7000/api)

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

- `GET orders/one/:orderId`: Get 1 order
- `GET orders/status/:orderId`: Check status of 1 order
- `GET orders/:userId`: Get all order of user

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
========== START UPDATE PAYMENT SERVICE=========== < OrderService: Receive message payload from PaymentService
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

## Deploy container to Kubernetes cluster using kubectl

Prerequisite: Kubernetes, Kubectl, Minikube, Docker hub, Kompose


Push all container to docker hub

```
$ docker login

$ docker-compose build && docker-compose push

All container already in this docker repo
https://hub.docker.com/repository/docker/kenchoong012/setel
```

Start minikube dashboard

```
$ run command prompt as adminstrator

// start minikube
$ minikube start

// here will open K8s dashboard in browser(optional, cause this will super lag)
$ minikube dashboard

```

Deploy all the stuff into K8s

```

$ cd k8s-deployment

// Create a ConfigMap for Mongodb(Initialize a user to be used by the order service)
$ kubectl create configmap mongo-initdb --from-file=create-user.sh

// deploy all stuff into K8s
$ kubectl apply -f backend-networkpolicy.yaml,db-pvc0.yaml,db-pvc1.yaml,db-pv0.yaml,db-pv1.yaml,db-deployment.yaml,db-service.yaml,env-configmap.yaml,frontend-networkpolicy.yaml,gateway-deployment.yaml,gateway-service.yaml,order-deployment.yaml,order-service.yaml,payment-deployment.yaml,payment-service.yaml

```

Wait for Pod and Deployment ready in Minikube. Now all service is only 1 replica, change it in the respective service file if needed.

Expose port run this

```
// expose gateway k8s service to localhost:7000
$ kubectl port-forward svc/gateway 7000:7000
```

Now you can access the Swagger api documentation at [localhost:7000/api](http://localhost:7000/api), so with this can be deploy to any machine in the cloud using all spec files inside k8s-deployment folder.

This is for local testing. But too many files, too many repeative inside k8s file, so we need a Helm chart

Delete all the stuff (if needed)

```
$ kubectl delete --all deployment --namespace=default

$ kubectl delete --all pvc --namespace=default

$ kubectl delete --all service --namespace=default

$ kubectl delete --all pods --namespace=default

$ kubectl delete --all configmap  --namespace=default

$ kubectl delete --all pv --namespace=default
```

## Deploy container to Kubernetes cluster using Helm Chart

Prerequisite: Kubernetes, Helm, Kubectl, Minikube, Docker hub

```

$ run command prompt as adminstrator

// start minikube
$ minikube start

$ cd helm

// Create a ConfigMap for Mongodb(Initialize a user to be used by the order service)
$ kubectl create configmap mongo-initdb --from-file=create-user.sh

$ helm install -f mongo-db.yaml mongodb ./db

$ helm install -f order-service.yaml order ./app

$ helm install -f payment-service.yaml payment ./app

$ helm install -f gateway-service.yaml gateway ./app

// expose the port to service
$ kubectl port-forward svc/gateway 7000:7000
or
// expose the port to pods
$ kubectl get pods
$ kubectl port-forward gateway-<some-hash> 7000:7000

```

Now you can access the API documentation at [localhost:7000/api](http://localhost:7000/api) and all the resource will be deployed in K8s cluster.

> Note: You may be will experience a error when you hit `POST /orders` in Swagger, due to "I dont know what is the reason", the `MongoDB service` just not initialize the Init database and create a new user inside it when the pods, only happened when using Helm, may be you can give me a hint,. I jam all this out in a very short period of time(Not an excuse), and right now I really dont have time to solve this, therefore I left it here first. This for demostration purpose, I hope it enough.

```
// check all the resource in dashboard
$ minikube dashboard

// upgrade AKA update the files/resource then redeploy again
$ helm upgrade [RELEASE NAME] -f [Release_file.yaml] [CHART FOLDER]
```

## Summary

[Previous repo, using serverless](https://github.com/kenchoong/Setel-assessment)

In this repo, I have shown 3 deployment method as below:

- using AWS ECS - Direct post the docker into cloud, then host
- using Kubectl with Kompose
- using Helm Chart
