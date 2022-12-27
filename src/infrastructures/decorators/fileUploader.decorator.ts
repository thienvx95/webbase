import { Container } from "typedi";
import { SystemConfig } from '@core/configuration';
import { IFileUploader } from "@business/common/service/fileUpload/fileupload.interface";

export function FileUploader(id: string = null): ParameterDecorator {
  return (object: any, propertyName: string, index?: number): any => {
    Container.registerHandler({
        object,
        propertyName,
        index,
        value: () => Container.get<IFileUploader>(id ?? SystemConfig.getUploaderServiceId),
      });
  };
}
export { IFileUploader };