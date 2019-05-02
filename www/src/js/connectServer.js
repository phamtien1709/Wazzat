window.sfs = new SFS2X.SmartFox();
window.sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection, this);

window.sfs.connect('127.0.0.1', 8080);
