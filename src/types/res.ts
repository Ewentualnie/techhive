import { User } from 'src/models/user.entity';
import { Tokens } from './tokens';
export type UserRes = {
  user: User;
  tokens: Tokens;
};

export default UserRes;
