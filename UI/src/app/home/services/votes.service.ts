import { PostsService } from './posts.service';
import { PostVoteCmd } from './../models/home.models';
import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/models/base.service';
import { EnvironmentService } from '../../services/environment.service';
import { VotesApiService } from '../../services/votes.api.service';
import { LoadingService } from '../../services/loading.service';
import { SnackbarService } from '../../services/snackbar.service';

@Injectable()
export class VotesService extends BaseService<PostVoteCmd> {
  constructor(
    environmentService: EnvironmentService,
    private votesApiService: VotesApiService,
    private snackbarService: SnackbarService,
    private postsService: PostsService,
  ) {
    super(environmentService);
  }

  async create(cmd: PostVoteCmd): Promise<void> {
    try {
      const vote = (await this.votesApiService.create(cmd)).result;
      this.postsService.updateVote(vote);
    } catch ({ error }) {
      this.snackbarService.showWarn('Create Vote Failed ' + error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const vote = (await this.votesApiService.delete(id)).result;
      this.postsService.updateVote(vote, true);
    } catch ({ error }) {
      this.snackbarService.showWarn('Delete Vote Failed ' + error.message);
    }
  }

  edit(cmd: PostVoteCmd, id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getMany(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
