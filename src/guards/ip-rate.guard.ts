import { Injectable, ExecutionContext } from '@nestjs/common';
import config from '../config/';
import { BaseRateLimitGuard, HOUR_SEC, MIN_SEC } from "./base-rate.guard";

@Injectable()
export class IpRateGuard extends BaseRateLimitGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const IP = request.connection.remoteAddress;

        const [hitsPerSec, hitsPerMin, hitsPerHour] = await Promise.all([
            await this.incrementHitsAtFixedWindow('ip-rate', IP, 'sec', 1),
            await this.incrementHitsAtFixedWindow('ip-rate', IP, 'min', MIN_SEC),
            await this.incrementHitsAtFixedWindow('ip-rate', IP, 'hour', HOUR_SEC)
        ])

        this.throwIfLimitExceeded(hitsPerHour, config.IP_LIMIT_PER_HOUR, HOUR_SEC);
        this.throwIfLimitExceeded(hitsPerMin, config.IP_LIMIT_PER_MIN, MIN_SEC);
        this.throwIfLimitExceeded(hitsPerSec, config.IP_LIMIT_PER_SEC, 1);

        return true;
    }
}
