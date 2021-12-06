Thanks for reading Mr Sashi, Malcom and Hazeem.

Based on our conversation on Friday, I noticed that your team are looking for someone to work with Microservices(although you never told me). I aware that, and to be honest, on Friday, I have very limited knowledge in this field, cause I am a Serverless guys 😂🤣, and Serverless may be not what you looking for.

But I just too stubborn, therefore I done a little of research. Read [this](https://docs.nestjs.com/microservices/basics) an a lot of the stuff online, I notice that is quite similar to what I doing right now.

End up I awared what I do before is not wrong, just not what you looking for. Therefore, in order to prove I can work with your team which using, Microservice architeture, I jammed this simple project up in 1 day, cause I think action is better than words.

And some of the point during the conversation, we also talking about Design Pattern and SOLID principle. I aware this, and I also admit that this is the stuff I always avoid to do usually. But in order to join your team, I try my very best possible to implement in this project as well. Take a look, if possible give me some advice as well.

After done this assessment, I noticed a few advantages of this architeture:

1. Scale horizontally and vertically.

   - Just based on this assessment, `gateway` instance expand horizontally to handle growing traffic, using Kubernetes or pass it AWS Fargate, ECS which is serverless(which good for me😂)
   - Then we also can scale vertically for example `order` trigger `payment` then `invoice` then `email` and so on. Then each of them can scale horizontally again if needed.

2. Each of the instance can have their own set of resource. Like `order` can have 3 different db connected for different purpose.

3. Since it is event based, so it like `publish the message out, then done`, more easier to manage in the workflow.

Disadvantage

CD/CI stuff
CD/CI definitely very important in this type architeture. If everything run on my local pc, I will definitely get mad 😂. I can do this. Therefore I present in this assessment as well. I try to give as clear as possible commit message in this assessment. If your team is using some tools like Commitizen, I can follow as well.

I definitely need to explore more about Kubernetes. Never have chance to work on this before, if use this in my situation right now, is like overkill already 😂

Happy to talk you guys, I learned a lot in the whole process. Anyway, hope we can work together one day.

Thanks for reading and Have a good day.