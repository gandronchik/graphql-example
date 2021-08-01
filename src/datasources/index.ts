import { AppService } from './app-service';

export const dataSources = () => ({
    appService: new AppService()
});