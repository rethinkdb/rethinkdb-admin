import * as path from 'path';
import * as webpack from 'webpack';
import nodeExternals from "webpack-node-externals";
import StartServerPlugin from "start-server-webpack-plugin";

const env = { ...process.env };

const getElectronConfig = (): webpack.Configuration => ({
    entry: ['webpack/hot/poll?100', entry],
    watch: true,
    externals: [
        nodeExternals({
            whitelist: ['webpack/hot/poll?100'],
        }),
    ],
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
        new StartServerPlugin({ name: output.filename }),
    ],
});

const getHttpConfig = (): webpack.Configuration => ({
    entry: ['webpack/hot/poll?100', entry],
    watch: true,
    externals: [
        nodeExternals({
            whitelist: ['webpack/hot/poll?100'],
        }),
    ],
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
        new StartServerPlugin({ name: output.filename }),
    ],
});

const getClientConfig = (): webpack.Configuration => ({
    entry: ['webpack/hot/poll?100', entry],
    watch: true,
    externals: [
        nodeExternals({
            whitelist: ['webpack/hot/poll?100'],
        }),
    ],
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
        new StartServerPlugin({ name: output.filename }),
    ],
});

function setupConfig() {
    const isElectron = env.ENV === 'electron';
    const isHttp = env.ENV === 'http';
    console.log('isElectron', isElectron);
    console.log('isHttp', isHttp);

    return {
        entry: ['webpack/hot/poll?100', options.entry],
        watch: true,
        externals: [
            nodeExternals({
                whitelist: ['webpack/hot/poll?100'],
            }),
        ],
        plugins: [
            ...options.plugins,
            new webpack.HotModuleReplacementPlugin(),
            new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
            new StartServerPlugin({ name: options.output.filename }),
        ],
    };
};

export default setupConfig;
