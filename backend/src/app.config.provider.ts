import { ConfigModule } from '@nestjs/config';

export interface AppConfigDatabase {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface AppConfig {
  database: AppConfigDatabase;
}

const applicationConfig: AppConfigDatabase = {
  type: process.env.DATABASE_DRIVER,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: <AppConfig>{
    database: applicationConfig,
  },
};
