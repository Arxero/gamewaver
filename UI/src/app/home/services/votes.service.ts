import { PostsService } from './posts.service';
import { PostVoteCmd } from './../models/home.models';
import { Injectable } from '@angular/core';
import { EnvironmentService, VotesApiService, SnackbarService} from '@gamewaver/services';
import { SnackbarErrors, BaseService } from '@gamewaver/shared';

@Injectable()
export class VotesService extends BaseService<PostVoteCmd> {
  constructor(
    environmentService: EnvironmentService,
    snackbarService: SnackbarService,
    private votesApiService: VotesApiService,
    private postsService: PostsService,
  ) {
    super(environmentService, snackbarService);
  }

  async create(cmd: PostVoteCmd): Promise<void> {
    try {
      const vote = (await this.votesApiService.create(cmd)).result;
      this.postsService.updateVote(vote);
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.CreateVote);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const vote = (await this.votesApiService.delete(id)).result;
      this.postsService.updateVote(vote, true);
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.DeleteVote);
    }
  }
}
