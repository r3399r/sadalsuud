import {
  errorOutput,
  LambdaContext,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/User';
import { UserService } from 'src/logic/UserService';
import {
  GetUserResponse,
  GetUsersResponse,
  PostUserResponse,
} from 'src/model/User';
import { UsersEvent } from './UsersEvent';

export async function users(
  event: UsersEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const userService: UserService = bindings.get<UserService>(UserService);

    let res: PostUserResponse | GetUserResponse | GetUsersResponse;

    switch (event.httpMethod) {
      case 'POST':
        if (event.body === null) throw new Error('null body error');
        res = await userService.addUser(
          event.headers['x-api-token'],
          JSON.parse(event.body) as PostUserResponse
        );
        break;
      case 'GET':
        // validate role
        const user = await userService.getUserByToken(
          event.headers['x-api-token']
        );
        if (user.role !== ROLE.ADMIN) throw new Error('permission denied');

        if (event.pathParameters === null) res = await userService.getUsers();
        else res = await userService.getUserById(event.pathParameters.id);
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
