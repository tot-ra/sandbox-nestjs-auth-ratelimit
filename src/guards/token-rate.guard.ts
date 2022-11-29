import { Injectable, ExecutionContext } from '@nestjs/common';
import config from '../config/';
import { BaseRateLimitGuard, HOUR_SEC, MIN_SEC } from "./base-rate.guard";

@Injectable()
export class TokenRateGuard extends BaseRateLimitGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const [hitsPerSec, hitsPerMin, hitsPerHour] = await Promise.all([
            await this.incrementHitsAtFixedWindow('token-rate', request.user.userId, 'sec', 1),
            await this.incrementHitsAtFixedWindow('token-rate', request.user.userId, 'min', MIN_SEC),
            await this.incrementHitsAtFixedWindow('token-rate', request.user.userId, 'hour', HOUR_SEC)
        ])

        this.throwIfLimitExceeded(hitsPerHour, config.TOKEN_LIMIT_PER_HOUR, HOUR_SEC);
        this.throwIfLimitExceeded(hitsPerMin, config.TOKEN_LIMIT_PER_MIN, MIN_SEC);
        this.throwIfLimitExceeded(hitsPerSec, config.TOKEN_LIMIT_PER_SEC, 1);

        return true;
    }
}
