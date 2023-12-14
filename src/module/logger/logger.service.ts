import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class LoggerService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async log(message: string) {
    // Tạo một log entry và lưu vào Elasticsearch
    const logEntry = {
      timestamp: new Date(),
      message,
    };

    return await this.elasticsearchService.index({
      index: 'logs', // Tên index để lưu log
      body: logEntry,
    });
  }
}
