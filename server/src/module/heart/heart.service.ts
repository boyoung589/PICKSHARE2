import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Heart } from './heart.entity';
import { HeartRepository } from './heart.repository';

@Injectable()
export class HeartService {
	constructor(
		private heartRepository: HeartRepository,
	) {}

	postHeart(user: User, board_id: number): Promise<Heart[]>{
		return this.heartRepository.postHeart(user, board_id);
	}

	async cancelHeart(user: User, board_id: number): Promise<Heart[]>{
		const result = await this.heartRepository.delete({user_id: user.id, board_id: board_id});

		if(result.affected === 0) {
			throw new NotFoundException(`Can't find Board with board_id ${board_id}`)
		}

		const afterDeleteList = await this.heartRepository.find({
			where: {
				board_id,
			}
		})

		return afterDeleteList;
	}

	async searchHeart(user: User, board_id: number): Promise<number>{
		const heartlist = await this.heartRepository.find({
			where: {
				'user_id': user.id,
				board_id
			}
		})
		
		return heartlist.length;
	}
}
