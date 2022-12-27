
class Queue {
  // private sleep = (t: any) => new Promise((resolve) => setTimeout(resolve, t * 1000));
  // private setupBullMQProcessor = async (queueName: string) => {
  // 	const queueScheduler = new QueueScheduler(queueName, {
  // 		connection: this.redisOptions,
  // 	});
  // 	await queueScheduler.waitUntilReady();

  // 	new Worker(queueName, async (job) => {
  // 		for (let i = 0; i <= 100; i++) {
  // 			await this.sleep(Math.random());
  // 			await job.updateProgress(i);
  // 			await job.log(`Processing job at interval ${i}`);

  // 			if (Math.random() * 200 < 1) throw new Error(`Random error ${i}`);
  // 		}

  // 		return { jobId: `This is the return value of job (${job.id})` };
  // 	});
  // }

  // public BullMq = this.createQueueMQ("BullMQ");

  constructor() {
    // this.BullMq = new QueueMQ("BullMQ", {
    //   connection: {
    //     port: Locals.config().reditSetting.Port,
    //     host: Locals.config().reditSetting.Host,
    //     password: Locals.config().reditSetting.Password,
    //   }
    // });
  }
}

export default new Queue();
