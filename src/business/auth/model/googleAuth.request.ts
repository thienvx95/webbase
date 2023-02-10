import { IsNotEmpty } from 'class-validator';

export class GoogleAuthRequest {
  @IsNotEmpty({
    message: 'Require token',
  })
  code: string;

  remember?: boolean;
}
