import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestLogInterceptor } from 'src/module/common/request-log.interceptor';
import { ElasticsearchService } from '@nestjs/elasticsearch';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(
    new RequestLogInterceptor(),
  );
  await app.listen(3000);
}
bootstrap();
