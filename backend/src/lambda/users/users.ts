import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/role';
import { UserService } from 'src/logic/UserService';
import {
  GetUserResponse,
  GetUsersResponse,
  PostUserResponse,
  PutUserRequest,
  PutUserRoleRequest,
  PutUserRoleResponse,
} from 'src/model/User';
import { UsersEvent } from './UsersEvent';

export async function users(
  event: UsersEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const userService: UserService = bindings.get<UserService>(UserService);

    let res:
      | PostUserResponse
      | GetUserResponse
      | GetUsersResponse
      | PutUserRoleResponse;

    switch (event.httpMethod) {
      case 'POST':
        if (event.body === null)
          throw new BadRequestError('body should not be empty');
        res = await userService.addUser(
          event.headers['x-api-token'],
          JSON.parse(event.body) as PostUserResponse
        );
        break;
      case 'PUT':
        if (event.body === null)
          throw new BadRequestError('body should not be empty');
        if (event.pathParameters === null)
          res = await userService.updateUser(
            event.headers['x-api-token'],
            JSON.parse(event.body) as PutUserRequest
          );
        else {
          if (event.resource !== '/api/users/{id}/role')
            throw new InternalServerError('non-support resource');

          await userService.validateRole(event.headers['x-api-token'], [
            ROLE.ADMIN,
          ]);
          res = await userService.updateRole(
            event.pathParameters.id,
            JSON.parse(event.body) as PutUserRoleRequest
          );
        }
        break;
      case 'GET':
        await userService.validateRole(event.headers['x-api-token'], [
          ROLE.ADMIN,
        ]);

        if (event.pathParameters === null) res = await userService.getUsers();
        else res = await userService.getUserById(event.pathParameters.id);
        break;
      default:
        throw new InternalServerError('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
