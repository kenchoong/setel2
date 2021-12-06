import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

// Need to create a MongoConfig  get the mongodb url from env file async-ly
//https://stackoverflow.com/questions/67661975/nestjs-unable-to-connect-mongo-asynchronously
export class MongoConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: process.env.MONGO_URL,
    };
  }
}
