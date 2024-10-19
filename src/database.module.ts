import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to access config values
      inject: [ConfigService], // Inject ConfigService to use env variables
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('DatabaseConnection');

        // Log at the start of connection
        logger.log('Starting database connection...');
        logger.log(`Database Host: ${configService.get('DB_HOST')}`);
        logger.log(`Database Port: ${configService.get('DB_PORT')}`);
        logger.log(`Database Username: ${configService.get('DB_USERNAME')}`);
        logger.log(`Database Name: ${configService.get('DB_DATABASE')}`);
        logger.log('Attempting to establish database connection...');
        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/./**/*.entity{.ts,.js}'], // Read all entities file with specific path
          synchronize: false, // Don't auto update schema, use migration instead
          migrations: [__dirname + '/../../helpers/migrations/*.migration{.ts,.js}'],
        };
      },
    }),
  ],
})
export class DatabaseModule {}
