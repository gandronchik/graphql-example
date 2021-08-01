import { pubsub } from '../pubsub';

const PUBLISHER_MUTATED = 'publisherMutated';

export default {
    Query: {
        publishers(parent, args, {dataSources}) {
            return dataSources.appService.getPublishers();
        },
        publisher(parent, args, {dataSources}) {
            return dataSources.appService.getPublisher(args.id);
        }
    },

    Mutation: {
        async createPublisher(parent, args, {dataSources}) {
            let publisher = await dataSources.appService.createPublisher({name: args.name});
            pubsub.publish(PUBLISHER_MUTATED, {
                publisherMutated: {
                    mutation: 'CREATED',
                    node: publisher
                }
            });
            return publisher;
        },
        async updatePublisher(parent, args, {dataSources}) {
            let publisher = await dataSources.appService.updatePublisher(args.publisherId, {name: args.name});
            pubsub.publish(PUBLISHER_MUTATED, {
                publisherMutated: {
                    mutation: 'UPDATED',
                    node: publisher
                }
            });
            return publisher;
        }
    },

    Subscription: {
        publisherMutated: {
            subscribe: () => pubsub.asyncIterator(PUBLISHER_MUTATED)
        }
    },

    Publisher: {
        apps(parent, args, {dataSources}) {
            return dataSources.appService.getPublisherApps(parent.id);
        }
    }
};
