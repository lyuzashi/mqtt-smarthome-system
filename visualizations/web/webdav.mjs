import webdav from 'webdav-server';
import path from 'path';
import app from '../../system/web';
import root from '../../root';

const server = new webdav.v2.WebDAVServer();

server.setFileSystem('/', new webdav.v2.PhysicalFileSystem(path.join(root, 'data')), (success) => {
    // server.start(() => console.log('READY'));
})

app.use(webdav.v2.extensions.express('data', server));

export default server;
