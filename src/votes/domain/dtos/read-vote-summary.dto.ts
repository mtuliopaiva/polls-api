import { ApiProperty } from '@nestjs/swagger';

export class ReadVoteSummaryDto {
  @ApiProperty()
  pollUuid: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
    },
  })
  votes: Array<{
    optionUuid: string;
    total: number;
  }>;

  @ApiProperty()
  totalVotes: number;

  @ApiProperty({
    nullable: true,
  })
  userVote: {
    uuid: string;
    optionUuid: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}
