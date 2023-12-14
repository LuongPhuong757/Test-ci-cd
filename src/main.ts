import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestLogInterceptor } from 'src/module/common/request-log.interceptor';
import { ElasticsearchService } from '@nestjs/elasticsearch';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const elasticsearch = new ElasticsearchService({ node: 'http://localhost:9200'})
  app.useGlobalInterceptors(
    new RequestLogInterceptor(elasticsearch),
  );
  await app.listen(3000);
}
bootstrap();
