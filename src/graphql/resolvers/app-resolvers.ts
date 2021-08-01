import { pubsub } from '../pubsub';

const APP_MUTATED = 'appMutated';

export default {
    Query: {
        apps(parent, args, {dataSources}) {
            return dataSources.appService.getApps();
        },
        app(parent, args, {dataSources}) {
            return dataSources.appService.getApp(args.id);
        }
    },

    Mutation: {
        async createApp(parent, args, {dataSources}) {
            const { publisherId, ...rest } = args.app;
            let app = await dataSources.appService.createApp({...rest}, publisherId);
            pubsub.publish(APP_MUTATED, {
                appMutated: {
                    mutation: 'CREATED',
                    node: app
                }
            });
            return app;
        },
        async updateApp(parent, args, {dataSources}) {
            const { publisherId, ...rest } = args.app;
            let updatedApp = await dataSources.appService.updateApp(args.appId, {...rest}, publisherId);
            publishAppUpdated(updatedApp);
            return updatedApp;
        },
        async setAppDevelopers(parent, args, {dataSources}) {
            let updatedApp = await dataSources.appService.setAppDevelopers(args.appId, args.developerIds)
            publishAppUpdated(updatedApp);
            return updatedApp;
        }
    },

    Subscription: {
        appMutated: {
            subscribe: () => pubsub.asyncIterator(APP_MUTATED)
        }
    },

    App: {
        publisher(parent, args, {dataSources}) {
            return dataSources.appService.getAppPublisher(parent.id);
        },
        developers(parent, args, {dataSources}) {
            return dataSources.appService.getAppDevelopers(parent.id);
        }
    }
};

function publishAppUpdated(app) {
    pubsub.publish(APP_MUTATED, {
        appMutated: {
            mutation: 'UPDATED',
            node: app
        }
    });
    return app;
}
