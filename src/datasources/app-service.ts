import { DataSource } from 'apollo-datasource';

export class AppService extends DataSource {
    constructor() {
        super();
    }

    initialize() {}

    getDevelopers() {
        return Promise.resolve(developers);
    }

    getDeveloper(id) {
        return Promise.resolve(findDeveloper(id));
    }

    getDeveloperApps(developerId) {
        const filteredApps = appDevs
            .filter(appDev => appDev.developerId === developerId)
            .map(appDeveloper => findApp(appDeveloper.appId));
        return Promise.resolve(filteredApps);
    }

    createDeveloper(devInput) {
        const dev = Object.assign(devInput, { id: newId() });
        developers.push(dev);
        return Promise.resolve(dev);
    }

    updateDeveloper(devId, devInput) {
        let dev = findDeveloper(devId);
        dev = dev ? Object.assign(dev, devInput) : null;
        return Promise.resolve(dev);
    }

    getPublishers() {
        return Promise.resolve(publishers);
    }

    getPublisher(id) {
        return Promise.resolve(findPublisher(id));
    }

    getPublisherApps(publisherId) {
        return Promise.resolve(
            apps.filter(app => app.publisherId === publisherId)
        );
    }

    createPublisher(publisherInput) {
        const publisher = Object.assign(publisherInput, { id: newId() });
        publishers.push(publisher);
        return Promise.resolve(publisher);
    }

    updatePublisher(publisherId, publisherInput) {
        let publisher = findPublisher(publisherId);
        publisher = publisher ? Object.assign(publisher, publisherInput) : null;
        return Promise.resolve(publisher);
    }

    getApps() {
        return Promise.resolve(apps);
    }

    getApp(id) {
        return Promise.resolve(findApp(id));
    }

    getAppPublisher(appId) {
        const app = findApp(appId);
        const publisher = app ? findPublisher(app.publisherId) : null;
        return Promise.resolve(publisher);
    }

    getAppDevelopers(appId) {
        const filteredDevs = appDevs
            .filter(appDev => appDev.appId === appId)
            .map(appDev => findDeveloper(appDev.developerId));
        return Promise.resolve(filteredDevs);
    }

    createApp(appInput, publisherId) {
        const app = Object.assign(appInput, { id: newId(), publisherId });
        apps.push(app);
        return Promise.resolve(app);
    }

    updateApp(appId, appInput, publisherId) {
        let app = findApp(appId);
        app = app ? Object.assign(app, appInput) : null;
        if (app) {
            app = Object.assign(app, appInput, { publisherId: publisherId });
        }
        return Promise.resolve(app);
    }

    setAppDevelopers(appId, developerIds) {
        const app = findApp(appId);
        if (app) {
            appDevs = appDevs.filter(
                appDev => appDev.appId !== appId
            );

            developerIds.forEach(devId => {
                appDevs.push({
                    id: `${appId}-${devId}`,
                    appId: appId,
                    developerId: devId
                });
            });
        }
        return Promise.resolve(app);
    }
}

function newId() {
    return Math.random()
        .toString(36)
        .substring(7);
}

function findDeveloper(id) {
    return developers.find(dev => dev.id === id);
}

function findPublisher(id) {
    return publishers.find(publisher => publisher.id === id);
}

function findApp(id) {
    return apps.find(app => app.id === id);
}

let developers = [
    {
        id: 'george',
        name: 'George'
    },
    {
        id: 'dima',
        name: 'Dima'
    },
    {
        id: 'kolia',
        name: 'Kolia'
    }
];

let publishers = [
    {
        id: 'gismart',
        name: 'Gismart'
    },
    {
        id: 'apalon',
        name: 'Apalon'
    },
    {
        id: 'almus',
        name: 'Almus'
    }
];

let apps = [
    {
        id: 'fight-club',
        name: 'Fight Club',
        publisherId: 'almus'
    },
    {
        id: 'live-wallpapers',
        name: 'Live Wallpapers',
        publisherId: 'apalon'
    },
    {
        id: 'stickers',
        name: 'Stickers',
        publisherId: 'gismart'
    }
];

let appDevs = [
    {
        id: 'fight-club-george',
        appId: 'fight-club',
        developerId: 'george'
    },
    {
        id: 'live-wallpapers-dima',
        appId: 'live-wallpapers',
        developerId: 'dima'
    },
    {
        id: 'stickers-kolia',
        appId: 'stickers',
        developerId: 'kolia'
    }
];
