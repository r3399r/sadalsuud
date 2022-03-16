import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/user';
import { UserService } from 'src/logic/UserService';
import {
  GetUserResponse,
  GetUsersResponse,
  PostUserResponse,
  PutUserRequest,
  PutUserRoleRequest,
  PutUserRoleResponse,
} from 'src/model/User';

async function apiUsers(event: LambdaEvent, service: UserService) {
  switch (event.httpMethod) {
    case 'GET':
      await service.validateRole(event.headers['x-api-token'], [ROLE.ADMIN]);

      return await service.getUsers();
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.addUser(
        event.headers['x-api-token'],
        JSON.parse(event.body) as PostUserResponse
      );
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.updateUser(
        event.headers['x-api-token'],
        JSON.parse(event.body) as PutUserRequest
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiUsersId(event: LambdaEvent, service: UserService) {
  if (event.pathParameters === null)
    throw new BadRequestError('user id is required');

  await service.validateRole(event.headers['x-api-token'], [ROLE.ADMIN]);

  switch (event.httpMethod) {
    case 'GET':
      await service.validateRole(event.headers['x-api-token'], [ROLE.ADMIN]);

      return await service.getUserById(event.pathParameters.id);
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiUsersIdStatus(event: LambdaEvent, service: UserService) {
  if (event.pathParameters === null)
    throw new BadRequestError('user id is required');
  if (event.body === null)
    throw new BadRequestError('body should not be empty');

  await service.validateRole(event.headers['x-api-token'], [ROLE.ADMIN]);

  switch (event.httpMethod) {
    case 'PUT':
      return await service.updateUserStatus(
        event.pathParameters.id,
        JSON.parse(event.body) as PutUserRoleRequest
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

export async function users(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const service: UserService = bindings.get<UserService>(UserService);

    let res:
      | PostUserResponse
      | GetUserResponse
      | GetUsersResponse
      | PutUserRoleResponse;

    switch (event.resource) {
      case '/api/users':
        res = await apiUsers(event, service);
        break;
      case '/api/users/{id}':
        res = await apiUsersId(event, service);
        break;
      case '/api/users/{id}/status':
        res = await apiUsersIdStatus(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
