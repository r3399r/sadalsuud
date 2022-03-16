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
import { GroupService } from 'src/logic/GroupService';
import {
  GetGroupsResponse,
  PatchGroupRequest,
  PostGroupRequest,
  PostGroupResponse,
} from 'src/model/Group';

async function apiGroups(event: LambdaEvent, service: GroupService) {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getGroups();
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.createGroup(
        JSON.parse(event.body) as PostGroupRequest
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiGroupsId(event: LambdaEvent, service: GroupService) {
  switch (event.httpMethod) {
    case 'PATCH':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');
      if (event.pathParameters === null)
        throw new BadRequestError('group id is required');

      await service.updateGroupMembers(
        event.pathParameters.id,
        JSON.parse(event.body) as PatchGroupRequest
      );

      return;
    default:
      throw new InternalServerError('unknown http method');
  }
}

export async function groups(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const service: GroupService = bindings.get<GroupService>(GroupService);

    let res: PostGroupResponse | GetGroupsResponse | void;

    await service.validateRole(event.headers['x-api-token'], [ROLE.ADMIN]);

    switch (event.resource) {
      case '/api/groups':
        res = await apiGroups(event, service);
        break;
      case '/api/groups/{id}':
        res = await apiGroupsId(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
