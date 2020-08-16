import { BaseCmd } from '../../../shared/models/common';

export interface SignUpCmd extends BaseCmd {
  username: string;
  password: string;
  email: string;
}
