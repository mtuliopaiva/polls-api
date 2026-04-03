import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserService } from '../../service/user.service';
import { UserByUuidQuery } from './user-by-uuid.query';
import { ReadUserDto } from '../dtos/read-user.dto';

@QueryHandler(UserByUuidQuery)
export class UserByUuidHandler implements IQueryHandler<UserByUuidQuery> {
  constructor(private readonly service: UserService) {}

  async execute(query: UserByUuidQuery): Promise<ReadUserDto> {
    const user = await this.service.findByUuid(query.data.uuid);

    return {
      uuid: user.uuid,
      email: user.email,
      type: user.type,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
