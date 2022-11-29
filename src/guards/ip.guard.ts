import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import config from '../config/';

@Injectable()
export class IPGuard implements CanActivate {
    constructor(
        @InjectRedis() private readonly redis: Redis,
    ) {
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (await this.calculateFixedMinutesFixedWindowHits(request, 'sec', 1) > config.IP_LIMIT_PER_SEC) {
            throw new HttpException("Ratelimit exceeded", 429);
        }

        if (await this.calculateFixedMinutesFixedWindowHits(request, 'min', 60) > config.IP_LIMIT_PER_MIN) {
            throw new HttpException("Ratelimit exceeded", 429);
        }

        if (await this.calculateFixedMinutesFixedWindowHits(request, 'hour', 60 * 60) > config.IP_LIMIT_PER_HOUR) {
            throw new HttpException("Ratelimit exceeded", 429);
        }
        return true;
    }

    private async calculateFixedMinutesFixedWindowHits(request, windowName = 'sec', windowSizeSec = 1) {
        const window = Math.floor(Date.now() / (windowSizeSec * 1000));
        const key = `IP-${windowName}-${request.connection.remoteAddress}-${window}`;

        const hits = await this.redis.get(key);
        const hitValue = hits ? parseInt(hits) : 0;
        await this.redis.set(key, hitValue + 1, "EX", windowSizeSec);

        console.debug('Rate limit calculation', {
            key,
            windowName,
            hitValue
        })
        return hitValue;
    }
}
