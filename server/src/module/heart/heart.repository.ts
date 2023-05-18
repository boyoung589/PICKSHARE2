import { NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";
import { Heart } from "./heart.entity";
import { CustomRepository } from "../typeorm-ex.decorator";

@CustomRepository(Heart)
export class HeartRepository extends Repository<Heart> {
	async postHeart( user: User, board_id: number): Promise<Heart[]> {
		const findAlreadyExist = await this.find({
			where: {
				'user_id': user.id,
				board_id
			}
		})

		if(findAlreadyExist.length !== 0){
			throw new NotFoundException(`Already hearted board ${board_id}`);
		}

		const hearts = {
			'user_id': user.id, 
			'board_id': board_id
		};
		
		await this.save(hearts);
		const heartList = await this.find({
			where: {
				board_id,
			}
		})

		return heartList
	}
}