import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserService } from '../../service/user.service';
import { ListUserQuery } from './list-user.query';
import { ReadUserDto } from '../dtos/read-user.dto';

@QueryHandler(ListUserQuery)
export class ListUserHandler implements IQueryHandler<ListUserQuery> {
  constructor(private readonly service: UserService) {}

  async execute(query: ListUserQuery): Promise<{
    data: ReadUserDto[];
    meta: { total: number };
  }> {
    const { data, total } = await this.service.list(query.data);

    return {
      data: data.map(
        (user): ReadUserDto => ({
          uuid: user.uuid,
          email: user.email,
          type: user.type,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }),
      ),
      meta: {
        total,
      },
    };
  }
}
