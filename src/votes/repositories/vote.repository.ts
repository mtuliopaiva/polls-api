export abstract class VoteRepository {
  abstract countByPollUuid(pollUuid: string): Promise<
    Array<{
      optionUuid: string;
      total: number;
    }>
  >;

  abstract findUserVoteByPollUuid(pollUuid: string, userUuid: string): Promise<{
    uuid: string;
    pollUuid: string;
    optionUuid: string;
    userUuid: string;
    createdAt: Date;
    updatedAt: Date;
  } | null>;

  abstract create(data: {
    pollUuid: string;
    optionUuid: string;
    userUuid: string;
  }): Promise<{
    uuid: string;
    pollUuid: string;
    optionUuid: string;
    userUuid: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
