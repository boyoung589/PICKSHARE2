import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { Follow } from './follow.entity';
import { FollowRepository } from './follow.repository';

@Injectable()
export class FollowService {
  constructor(
		private followRepository: FollowRepository,
		private userRepository: UserRepository
	) {}

  //유저가 다른 닉네임을 팔로우 하기
	async postFollowing(user: User, nickname: string): Promise<Follow[]> {
		const findUser = await this.userRepository.find({
            where: {
                nickname: nickname
            }
        })
		if(user.nickname === findUser[0].nickname){
			throw new BadRequestException(`Can not follow userself ${nickname}`)
		}
		return this.followRepository.postFollowing(user, nickname);
	}

  //유저가 팔로우하고 있는 다른 유저들의 목록 리턴
  async getFollowingList(nickname: string): Promise<Follow[]>{
		//user_id가 user.id인 리스트
		//user_id로 유저 테이블에서 유저 닉네임을 가져와야함.
    const findUser = await this.userRepository.findOne({
      where: {
        nickname: nickname
      }
    });

    //유저가 팔로우하고 있는 다른 유저들의 목록 조회
    const followingList = await this.followRepository.createQueryBuilder('follow')
			.select([
				'follow.id AS id',
				'follow.followingNickname AS followingNickname',
				'user.nickname AS userId'
			])
			.leftJoin(
				'follow.user', 'user'
      )
			.where('follow.user_id = :user_id', {user_id: `${findUser.id}`})
      .getRawMany()
    
		return followingList;
  }
  
  //유저가 특정 닉네임의 팔로우 중지
  async cancelFollowing(user: User, nickname: string): Promise<void> {
		const result = await this.followRepository.delete({user_id: user.id, followingNickname: nickname});

		if(result.affected === 0) {
			throw new NotFoundException(`Can't find Following with nickname ${nickname}`);
		}
	}

  //유저를 팔로우하고 있는 다른 유저 목록 리턴
	async getFollowerList(nickname: string): Promise<Follow[]> {
		//user_id에 따른 nickname을 넣어야함
    //유저를 팔로우하고 있는 다른 유저 목록 조회
		const followerList = await this.followRepository.createQueryBuilder('follow')
		.select([
			'follow.id AS id',
			'follow.followingNickname AS user_id',
			'user.nickname AS followerNickname'
		])
		.leftJoin(
			'follow.user', 'user'
		)
		.where('follow.followingNickname = :followingNickname', {followingNickname: `${nickname}`})
		.groupBy('follow.id')
      .getRawMany()

    return followerList;
	}

  //유저가 특정 닉네임을 팔로우하고있는지 아닌지 판별
  async getFollowOrNot(user: User, nickname: string): Promise<boolean> {
		const FindExistOrNot = await this.followRepository.find({
			where: {
				user_id: user.id,
				followingNickname: nickname
			}
		})

		if(FindExistOrNot.length !== 0) {
			//팔로우 중
			return true;
    }
		return false;
	}
}
