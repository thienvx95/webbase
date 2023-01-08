A Web Base for [Node.js](https://nodejs.org/en) App.

### Features
- **Express** using [Express.js](https://expressjs.com/) web framework, and is using [Typescript Lang](https://www.typescriptlang.org/) for writing the app's logic. 
- **Storing Custom Constant** configurations within the `process.env` - [DotEnv](https://github.com/motdotla/dotenv) package is used.
- **Dependency Injection** done with the nice framework from [Inversify](https://github.com/inversify).
- **Clear Structure** with different layers such as controllers, services, repositories, models, middlewares...
- **Easy Exception Handling** thanks to [routing-controllers](https://github.com/pleerock/routing-controllers).
- **Smart Validation** thanks to [class-validator](https://github.com/pleerock/class-validator) with some nice annotations.
- **API Documentation** thanks to [swagger](http://swagger.io/) and [routing-controllers-openapi](https://github.com/epiphone/routing-controllers-openapi).
- **API Monitoring** thanks to [express-status-monitor](https://github.com/RafalWilinski/express-status-monitor).
- **Basic Security Features** thanks to [Helmet](https://helmetjs.github.io/).
- **Easy event dispatching** thanks to [event-dispatch](https://github.com/pleerock/event-dispatch).
- **Database** Repo contains the use of [Mongoose](https://mongoosejs.com/) (ie. [MongoDB](https://www.mongodb.com/) object modeling for [Node.js](https://nodejs.org/en/)).
- **Logging** Repo uses custom Log class built in middlewares folder using [winston](https://github.com/winstonjs/winston) and it creates logs file by date & removes the log files after 'X' days (You can define that 'X' in the `.env` file).
- **Logging Middleware** Repo uses middlewares folder using [morgan](https://github.com/expressjs/morgan) for HTTP request logger middleware for node.js
- **Migrate Mongo** thank to [migrate-mongo](https://www.npmjs.com/package/migrate-mongo) for run automatic migration
- **Mongoose model** thank to [typegoose](https://github.com/typegoose/typegoose) for define model using typescript classes

# Global Requisites

* node (>= 16.13")
* tsc (>= 3.0.1)
* typescript (>= 4.8")
* mongoose (>= 6.8.1)
# App Structure

```bash
├── dist
├── public
├── .logs - For log file save
├── src
│   ├── bussiness - For container bussiness of app
│   │   ├── auth - Handle Authen bussiness
│   │   │   ├── controller - For controller auto inject by convension ***.controller.ts
│   │   │   ├── model - Data to object of bussiness
│   │   │   ├── service - Handle bussiness of model
│   │   │   ├── subscribers -  Event Dispatch of model For created, updated, deleted auto inject by convension ***.subscriber.ts
│   │   ├── user - Handle User bussiness
│   │   │   ├── controller - For controller auto inject by convension ***.controller.ts
│   │   │   ├── model - Data to object of bussiness
│   │   │   ├── service - Handle bussiness of model
│   │   │   ├── subscribers -  Event Dispatch of model For created, updated, deleted auto inject by convension ***.subscriber.ts
│   ├── core
│   │   ├── configuration - get configuration of system by environment values
│   │   ├── data - define base repository and database provider 
│   │   ├── decorators - Dispatcher or Decorator for Class
│   │   ├── log - Customize log
│   │   ├── exception - exception handle error
│   │   ├── microframework - register loaders application 
│   │   └── ultis - constant, common functions
│   ├── entities - Models of entity
│   ├── infrastructures
│   │   ├── adapter - DI Adapter for routing controller
│   │   ├── auth - Handle authorzire middleware
│   │   ├── events - define event dispatch
│   │   ├── interceptors - auto inject interceptors with convention ***.interceptors.ts or init interceptors for bootrap
│   │   ├── middleware - auto inject middleware with convention ***.middleware.ts or init middleware for bootrap
│   │   ├── mapper - define auto mapper function
│   │   ├── migration - define migration function
│   │   ├── modules - register DI modules
│   │   ├── queue - define queue function 
│   │   ├── siteSetting - define site setting function 
│   │   ├── startup - define loader for bootrap
│   ├── migrations - migration folder
├── .env.dev
├── .env.production
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
└── tslint.json