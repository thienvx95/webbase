import {
    Post,
    JsonController,
  } from 'routing-controllers';
  import { Service } from 'typedi';
import { InstallService } from '../service/install.service';
  
  @Service()
  @JsonController('/install')
  export class InstallController {
    constructor(
      private installService: InstallService,
    ) {}
  
    @Post()
    async install(): Promise<boolean> {
        return this.installService.install();
    }
  }
  