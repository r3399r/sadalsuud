import {
  errorOutput,
  LambdaContext,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/User';
import { GroupService } from 'src/logic/GroupService';
import { UserService } from 'src/logic/UserService';
import {
  GetGroupResponse,
  PostGroupRequest,
  PostGroupResponse,
} from 'src/model/Group';
import { GroupsEvent } from './GroupsEvent';

export async function groups(
  event: GroupsEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const userService: UserService = bindings.get<UserService>(UserService);
    const groupService: GroupService = bindings.get<GroupService>(GroupService);

    let res: PostGroupResponse | GetGroupResponse;

    await userService.validateRole(event.headers['x-api-token'], ROLE.ADMIN);

    switch (event.httpMethod) {
      case 'POST':
        if (event.body === null) throw new Error('null body error');

        res = await groupService.createGroup(
          JSON.parse(event.body) as PostGroupRequest
        );
        break;
      case 'GET':
        res = await groupService.getGroups();
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
